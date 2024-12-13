import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
import {
  convertDateToInputString,
  convertInputStringToDate,
} from "@/utils/input_date_formatter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ScheduledInterviewModel } from "@/pages/interviews/models/interview.model";
import apiClient from "@/api/apiClient";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import LoadingScreen from "@/pages/common/LoadingScreen";
import ErrorScreen from "@/pages/common/ErrorScreen";
import ConfirmDeleteDialog from "../alert-dialogs/ConfirmDelete";
import { Textarea } from "@/components/ui/textarea";

//* Form Schema
const FormSchema = z
  .object({
    position: z
      .string({ required_error: "Position/Role is required" })
      .min(1, "Position/Role cannot be empty"),
    companyName: z
      .string({ required_error: "Company name is required" })
      .min(1, "Company name cannot be empty"),
    interviewRound: z.enum(
      [
        "Phone Screening",
        "Technical Interview",
        "HR Interview",
        "On-site",
        "Final Round",
        "Offer Discussion",
        "Other",
      ],
      {
        message: "Please select a valid value",
      }
    ),
    roundDetails: z.string(),
    scheduledOn: z.string(),
  })
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return convertInputStringToDate(data.scheduledOn) >= today;
    },
    {
      path: ["scheduledOn"],
      message: "Date must be today or in the future",
    }
  );

const interviewRoundEnum = {
  PHONE_SCREENING: "Phone Screening",
  TECHNICAL_INTERVIEW: "Technical Interview",
  HR_INTERVIEW: "HR Interview",
  ON_SITE: "On-site",
  FINAL_ROUND: "Final Round",
  OFFER_DISCUSSION: "Offer Discussion",
  OTHER: "Other",
};

interface AddInterviewScheduleModalProps {
  onClose: () => void; // Explicit type for the onClose prop
  inEditMode?: boolean;
  interviewId?: string;
}

const InterviewScheduleModal: React.FC<AddInterviewScheduleModalProps> = ({
  onClose,
  inEditMode = false,
  interviewId,
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      position: "",
      companyName: "",
      interviewRound: "Phone Screening",
      roundDetails: "",
      scheduledOn: convertDateToInputString(new Date()),
    },
  });

  const { reset, watch } = form;

  //* React Query Client
  const queryClient = useQueryClient();

  //* When in edit mode :: we fetch the interview details
  const getInterviewDetailsById = async (interviewId: string | undefined) => {
    if (interviewId === undefined)
      return { message: "No interview details found" };
    const response = await apiClient.get(`/interviews/${interviewId}`);
    return response.data.data;
  };

  const {
    data: interviewDetails,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["getInterviewDetailsById", interviewId],
    queryFn: () => getInterviewDetailsById(interviewId),
    enabled: !!interviewId,
  });

  useEffect(() => {
    if (interviewDetails && Object.keys(interviewDetails).length > 0) {
      reset({
        companyName: interviewDetails.companyName || "",
        position: interviewDetails.position || "",
        scheduledOn: interviewDetails.scheduledOn.split("T")[0],
        roundDetails: interviewDetails.roundDetails || "",
        interviewRound: interviewDetails.interviewRound,
      });
    }
  }, [interviewId, interviewDetails, reset]);

  const addNewInterviewSchedule = async (
    newInterviewSchedule: ScheduledInterviewModel
  ) => {
    const response = await apiClient.post("/interviews", newInterviewSchedule);
    return response.data.data;
  };

  const editInterviewById = async (
    newInterviewSchedule: ScheduledInterviewModel
  ) => {
    const response = await apiClient.patch(
      `/interviews/${interviewId}`,
      newInterviewSchedule
    );
    return response.data.data;
  };

  const deleteInterviewById = async () => {
    const response = await apiClient.delete(`/interviews/${interviewId}`);
    return response.data.data;
  };

  const mutation = useMutation({
    mutationFn: addNewInterviewSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllInterviews"] });
      toast({
        title: "Schedule has been saved successfully !!",
      });
      onClose();
    },
    onError(error, variables, context) {
      toast({
        title: "Error occurred while saving the schedule !!",
        description: error.toString(),
      });
      onClose();
    },
  });

  const editInterviewMutation = useMutation({
    mutationFn: editInterviewById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllInterviews"] });
      toast({
        title: "Interview Schedule has been updated successfully !!",
      });
      onClose();
    },
    onError(error, variables, context) {
      toast({
        title: "Error occurred while updating interview schedule !!",
        description: error.toString(),
      });
      onClose();
    },
  });

  const deleteInterviewMutation = useMutation({
    mutationFn: deleteInterviewById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllInterviews"] });
      toast({
        title: "Interview Schedule has been deleted successfully !!",
      });
      onClose();
    },
    onError(error, variables, context) {
      toast({
        title: "Error occurred while deleting the interview schedule !!",
        description: error.toString(),
      });
      onClose();
    },
  });

  const handleDeleteInterview = () => {
    deleteInterviewMutation.mutate();
  };

  //* Check if form state has changed
  const [valuesChanged, setValuesChanged] = useState<boolean>(false);
  const checkForChange = () => {
    if (interviewDetails) {
      const formValues = form.getValues();
      const hasChanged = Object.entries(formValues).some(([key, value]) => {
        const detailValue = interviewDetails[key];
        // Special handling for "scheduledOn" to compare only the date part
        if (key === "scheduledOn") {
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

  function onSubmit(values: z.infer<typeof FormSchema>) {
    const newInterviewSchedule: ScheduledInterviewModel = {
      position: values.position,
      companyName: values.companyName,
      interviewRound: values.interviewRound,
      roundDetails: values.roundDetails,
      scheduledOn: convertInputStringToDate(values.scheduledOn),
    };
    if (inEditMode) {
      editInterviewMutation.mutate(newInterviewSchedule);
    } else {
      mutation.mutate(newInterviewSchedule);
    }
  }

  if (isLoading) return <LoadingScreen />;
  if (error) {
    return (
      <ErrorScreen
        title="Error while fetching interview details"
        description="Could not find the interview schedule you're looking for"
      />
    );
  }

  return (
    <DialogContent className="modal overflow-auto max-h-screen scroll-mb-4 m-4 flex flex-col items-center max-w-xl w-full">
      {/* Header Section */}
      <div className="w-full">
        <DialogHeader>
          <DialogTitle>Add a Scheduled Interview</DialogTitle>
          <DialogDescription>
            Save your interview schedules here !!
          </DialogDescription>
        </DialogHeader>
      </div>

      {/* Interview Schedule Addition Form  */}
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position/Role</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Which role are you interviewing for?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Which company are you interviewing for?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Interview Round Selection */}
            <FormField
              control={form.control}
              name="interviewRound"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Round</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an interview round" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(interviewRoundEnum).map(([_, value]) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roundDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Round Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the round details"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scheduledOn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scheduled On</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder="The interview is sccheduled on?"
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
                  ? "Update Interview Schedule"
                  : "Save the Interview Schedule"}
              </Button>
            </div>
            {inEditMode && (
              <ConfirmDeleteDialog
                onConfirm={handleDeleteInterview}
                description="This action cannot be undone. This will permanently delete the
            interview schedule and remove your data from our servers."
              />
            )}
          </form>
        </Form>
      </div>
    </DialogContent>
  );
};

export default InterviewScheduleModal;
