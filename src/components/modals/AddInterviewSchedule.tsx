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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  InterviewRound,
  ScheduledInterviewModel,
} from "@/pages/interviews/models/interview.model";
import apiClient from "@/api/apiClient";
import { toast } from "@/hooks/use-toast";

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
}

const AddInterviewScheduleModal: React.FC<AddInterviewScheduleModalProps> = ({
  onClose,
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

  //* React Query Client
  const queryClient = useQueryClient();

  const addNewInterviewSchedule = async (
    newInterviewSchedule: ScheduledInterviewModel
  ) => {
    const response = await apiClient.post("/interviews", newInterviewSchedule);
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

  function onSubmit(values: z.infer<typeof FormSchema>) {
    const newInterviewSchedule: ScheduledInterviewModel = {
      position: values.position,
      companyName: values.companyName,
      interviewRound: values.interviewRound,
      scheduledOn: convertInputStringToDate(values.scheduledOn),
    };
    mutation.mutate(newInterviewSchedule);
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
              <Button type="submit" className="w-full font-semibold">
                Save the Interview Schedule
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
};

export default AddInterviewScheduleModal;
