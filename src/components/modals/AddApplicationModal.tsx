import { Button } from "@/components/ui/button";
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
import { convertInputStringToDate } from "@/utils/input_date_formatter";
import { Textarea } from "@/components/ui/textarea";

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
  applicationStatus:
    | "Applied"
    | "Interviewing"
    | "Offer Received"
    | "Accepted"
    | "Rejected"
    | "Withdrawn";
}

const AddApplicationModal: React.FC<AddApplicationModalProps> = ({
  onClose,
  inEditMode = false,
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form Values :: ", values);
  }

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
              <Button type="submit" className={`w-full font-semibol`}>
                {inEditMode
                  ? "Update Job Application"
                  : "Save the Job Application"}
              </Button>
            </div>
            {/* {inEditMode && (
              <ConfirmDeleteDialog
                onConfirm={handleDeleteContact}
                description="This action cannot be undone. This will permanently delete the
            contact and remove your data from our servers."
              />
            )} */}
          </form>
        </Form>
      </div>
    </DialogContent>
  );
};

export default AddApplicationModal;
