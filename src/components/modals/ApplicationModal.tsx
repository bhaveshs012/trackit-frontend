import { Button } from "@/components/ui/button";
import ContainerType from "../../pages/home/components/Container/container.type";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { convertInputStringToDate } from "@/utils/input_date_formatter";
import { Textarea } from "@/components/ui/textarea";
import apiClient from "@/api/apiClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import LoadingScreen from "@/pages/common/LoadingScreen";
import ErrorScreen from "@/pages/common/ErrorScreen";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import ConfirmDeleteDialog from "../alert-dialogs/ConfirmDelete";
import { ApplicationModel } from "@/pages/home/models/application.model";

//* Form Schema
const formSchema = z
  .object({
    companyName: z
      .string({ required_error: "Company Name is required" })
      .min(1, "Company Name cannot be empty"),
    position: z
      .string({ required_error: "Position/Role is required" })
      .min(1, "Position/Role cannot be empty"),
    jobLink: z
      .string({ required_error: "Job Link is required" })
      .min(1, "Job Link cannot be empty"),
    resumeUploaded: z
      .string({ required_error: "Uploaded Resume is required" })
      .min(1, "Uploaded Resume link cannot be empty"),
    applicationStatus: z.enum(
      [
        "Applied",
        "Interviewing",
        "Offer Received",
        "Accepted",
        "Rejected",
        "Withdrawn",
      ],
      {
        message: "Please select a valid value",
      }
    ),
    notes: z.string(),
    appliedOn: z.string(),
  })
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return convertInputStringToDate(data.appliedOn) <= today;
    },
    {
      path: ["appliedOn"],
      message: "Future Date cannot be added",
    }
  );

interface AddApplicationModalProps {
  onClose: () => void; // Explicit type for the onClose prop
  inEditMode?: boolean;
  applicationId?: string;
  setContainers: React.Dispatch<React.SetStateAction<ContainerType[]>>;
  applicationStatus?:
    | "Applied"
    | "Interviewing"
    | "Offer Received"
    | "Accepted"
    | "Rejected"
    | "Withdrawn";
}

const ApplicationModal: React.FC<AddApplicationModalProps> = ({
  onClose,
  setContainers,
  inEditMode = false,
  applicationId,
  applicationStatus,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      position: "",
      companyName: "",
      jobLink: "",
      appliedOn: "",
      notes: "",
      applicationStatus: applicationStatus,
    },
  });

  //* Get all resumes
  const getAllResumes = async () => {
    const response = await apiClient.get("users/resume", {
      params: {
        page: 1,
        limit: 5,
      },
    });
    //* Return the resumes list
    return response.data.data.resumes;
  };

  const {
    data: resumes,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["getAllResumes"],
    queryFn: getAllResumes,
  });

  const { reset, watch } = form;

  //* When in edit mode :: fetch the application details
  const getApplicationDetailsById = async (
    applicationId: string | undefined
  ) => {
    if (applicationId === undefined)
      return { message: "No interview details found" };
    const response = await apiClient.get(`/applications/${applicationId}`);
    return response.data.data;
  };

  const {
    data: applicationDetails,
    error: applicationDetailsError,
    isLoading: applicationDetailsIsLoading,
  } = useQuery({
    queryKey: ["getApplicationDetailsById", applicationId],
    queryFn: () => getApplicationDetailsById(applicationId),
    enabled: !!applicationId,
  });

  useEffect(() => {
    if (applicationDetails && Object.keys(applicationDetails).length > 0) {
      reset({
        companyName: applicationDetails.companyName || "",
        jobLink: applicationDetails.jobLink || "",
        applicationStatus: applicationDetails.applicationStatus || "",
        notes: applicationDetails.notes || "",
        position: applicationDetails.position || "",
        resumeUploaded: applicationDetails.resumeUploaded,
        appliedOn: applicationDetails.appliedOn.split("T")[0],
      });
    }
  }, [applicationId, applicationDetails, reset]);

  const addNewApplication = async (newApplication: {
    companyName: string;
    position: string;
    jobLink: string;
    applicationStatus:
      | "Applied"
      | "Interviewing"
      | "Offer Received"
      | "Accepted"
      | "Rejected"
      | "Withdrawn";
    resumeUploaded: string;
    coverLetterUploaded?: string;
    notes: string;
    appliedOn: Date;
  }) => {
    const response = await apiClient.post("applications", newApplication);
    return response.data.data;
  };

  const mutation = useMutation({
    mutationFn: addNewApplication,
    onSettled(data, error, variables, context) {
      if (!error) {
        setContainers((prevContainers) =>
          prevContainers.map((container) => {
            // If the container title matches the new application's status, append the new application
            if (data?.applicationStatus === container.title) {
              return {
                ...container,
                applications: [
                  ...container.applications,
                  {
                    // change the applied on field to date format from string
                    ...data,
                    appliedOn: new Date(data.appliedOn),
                  },
                ],
              };
            }
            // If no match, return the container as is
            return container;
          })
        );
      }
    },
    onSuccess: () => {
      toast({
        title: "Job application has been saved successfully !!",
      });
      onClose();
    },
    onError(error, variables, context) {
      toast({
        title: "Error occurred while saving the job application !!",
        description: error.toString(),
      });
      onClose();
    },
  });

  //* Edit the job application
  const editApplicationById = async (newApplication: {
    companyName: string;
    position: string;
    jobLink: string;
    applicationStatus:
      | "Applied"
      | "Interviewing"
      | "Offer Received"
      | "Accepted"
      | "Rejected"
      | "Withdrawn";
    resumeUploaded: string;
    coverLetterUploaded?: string;
    notes: string;
    appliedOn: Date;
  }) => {
    const response = await apiClient.patch(
      `/applications/${applicationId}`,
      newApplication
    );
    return response.data.data;
  };

  //* Check if form state has changed
  const [valuesChanged, setValuesChanged] = useState<boolean>(false);
  const checkForChange = () => {
    if (applicationDetails) {
      const formValues = form.getValues();
      const hasChanged = Object.entries(formValues).some(([key, value]) => {
        const detailValue = applicationDetails[key];
        // Special handling for "scheduledOn" to compare only the date part
        if (key === "appliedOn") {
          return (
            detailValue &&
            value !== new Date(detailValue).toISOString().split("T")[0]
          );
        }
        return detailValue && value.toString() !== detailValue.toString();
      });
      setValuesChanged(hasChanged);
    }
  };

  useEffect(() => {
    checkForChange();
  }, [watch()]);

  const editApplicationMutation = useMutation({
    mutationFn: editApplicationById,
    onSuccess: () => {
      toast({
        title: "Job Application has been updated successfully !!",
      });
      onClose();
    },
    onSettled(data, error, variables, context) {
      if (!error) {
        setContainers((prevContainers) =>
          prevContainers.map((container) => {
            if (data?.applicationStatus === container.title) {
              return {
                ...container,
                applications: container.applications.map((application) =>
                  application._id === data?._id
                    ? {
                        // If application matches, update it with new data
                        ...application,
                        ...data, // Spread the new data over the existing application
                        appliedOn: new Date(data.appliedOn), // Ensure appliedOn is converted to Date
                      }
                    : application
                ),
              };
            }
            return container; // Return the container as is if no match
          })
        );
      }
    },
    onError(error, variables, context) {
      toast({
        title: "Error occurred while updating the job application !!",
        description: error.toString(),
      });
      onClose();
    },
  });

  //* Delete the Job Application
  const deleteApplicationById = async () => {
    const response = await apiClient.delete(`applications/${applicationId}`);
    return response.data.data;
  };

  const deleteApplicationMutation = useMutation({
    mutationFn: deleteApplicationById,
    onSuccess: () => {
      setContainers((prevContainers) =>
        prevContainers.map((container) => ({
          ...container,
          applications: container.applications.filter(
            (app) => app._id !== applicationId
          ),
        }))
      );
      toast({
        title: "Job Application has been deleted successfully !!",
      });
      onClose();
    },
    onError(error, variables, context) {
      toast({
        title: "Error occurred while deleting the job application !!",
        description: error.toString(),
      });
      onClose();
    },
  });

  const handleDeleteApplication = () => {
    deleteApplicationMutation.mutate();
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newApplication = {
      companyName: values.companyName,
      position: values.position,
      jobLink: values.jobLink,
      applicationStatus: values.applicationStatus,
      resumeUploaded: values.resumeUploaded,
      notes: values.notes,
      appliedOn: convertInputStringToDate(values.appliedOn),
    };
    if (inEditMode) {
      editApplicationMutation.mutate(newApplication);
    } else mutation.mutate(newApplication);
  }

  if (isLoading || applicationDetailsIsLoading) {
    return <LoadingScreen />;
  }

  if (error || applicationDetailsError)
    return (
      <ErrorScreen
        title="Some error occurred !!"
        description="Please try again after some time"
      />
    );

  return (
    <DialogContent className="modal overflow-auto max-h-screen scroll-mb-4 m-4 flex flex-col items-center max-w-xl w-full">
      {/* Header Section */}
      <div className="w-full">
        <DialogHeader>
          <DialogTitle>Add a New Job Application</DialogTitle>
          <DialogDescription>
            Save your job applications here !!
          </DialogDescription>
        </DialogHeader>
      </div>

      {/* Job Application Addition Form  */}
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Which company are you interviewing at?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position/Role</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Which position/role are you interviewing for?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the job portal link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="applicationStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Status</FormLabel>
                  <FormControl>
                    <Input
                      className="cursor-not-allowed"
                      readOnly={true}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resumeUploaded"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume Uploaded</FormLabel>
                  {!inEditMode ? (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the uploaded resume" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resumes.map(
                          (
                            resume: {
                              resumeLink: string;
                              fileName: string;
                              skills: string[];
                            },
                            index: number
                          ) => (
                            <SelectItem key={index} value={resume.resumeLink}>
                              {resume.fileName} - {resume.skills.join(", ")}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex flex-col gap-y-4">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={applicationDetails?.resumeUploaded || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Resume
                        </a>
                      </Button>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes/Remarks</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any notes or special remarks you would like to remember"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appliedOn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Applied On</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder="Enter the date on which you applied for this job"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button
                type="submit"
                className={`w-full font-semibold ${
                  !valuesChanged ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                disabled={!valuesChanged}
              >
                {inEditMode
                  ? "Update Job Application"
                  : "Save the Job Application"}
              </Button>
            </div>
            {inEditMode && (
              <ConfirmDeleteDialog
                onConfirm={handleDeleteApplication}
                description="This action cannot be undone. This will permanently delete the
            contact and remove your data from our servers."
              />
            )}
          </form>
        </Form>
      </div>
    </DialogContent>
  );
};

export default ApplicationModal;
