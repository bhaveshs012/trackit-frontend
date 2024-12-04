import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import { toast } from "@/hooks/use-toast";

//* Form Schema
const FormSchema = z.object({
  targetPosition: z
    .string()
    .nonempty("Please enter the position you are targeting"),
  skills: z.array(z.string().min(1, "Skill cannot be empty")),
  resume: z
    .custom<File>((file) => file instanceof File && file.size > 0, {
      message: "Please upload a resume file!",
    })
    .refine((file) => file.type === "application/pdf", {
      message: "Resume must be a PDF file",
    }),
});

interface AddResumeModalProps {
  onClose: () => void; // Explicit type for the onClose prop
}

const AddResumeModal: React.FC<AddResumeModalProps> = ({ onClose }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      targetPosition: "",
      skills: [],
      resume: undefined,
    },
  });

  const { setValue, watch } = form;

  //* Skills State (Managed through form state now)
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const skills = watch("skills"); //* this gets the value from the form and updates when changed

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill !== "" && !skills.includes(trimmedSkill)) {
      const newSkillsArray = [...skills, trimmedSkill];
      setValue("skills", newSkillsArray); //* Using setValue to directly manipulate the form
      setInputValue("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setValue("skills", updatedSkills);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(inputValue);
    }
  };

  //* React Query Client
  const queryClient = useQueryClient();
  const addNewResume = async (newResume: {
    targetPosition: string;
    skills: string;
    resume: File;
  }) => {
    setIsLoading(true);
    let formData = new FormData();
    formData.append("targetPosition", newResume.targetPosition);
    formData.append("skills", newResume.skills);
    formData.append("resume", newResume.resume);
    const response = await apiClient.post("/users/resume", formData);
    setIsLoading(false);
    return response.data.data;
  };

  const mutation = useMutation({
    mutationFn: addNewResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllResumes"] });
      toast({
        title: "Resume has been saved successfully !!",
      });
      onClose();
    },
    onError(error, variables, context) {
      toast({
        title: "Error occurred while saving the resume !!",
        description: error.toString(),
      });
      onClose();
    },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    const newResume = {
      skills: JSON.stringify(values.skills),
      targetPosition: values.targetPosition,
      resume: values.resume,
    };
    mutation.mutate(newResume);
  }

  //* Resume Upload Handler
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("resume", file);
    }
  };

  return (
    <DialogContent className="modal overflow-auto max-h-screen m-4 flex flex-col items-center max-w-xl w-full">
      <div className="w-full">
        <DialogHeader>
          <DialogTitle>Add a Resume</DialogTitle>
          <DialogDescription>
            Save your resumes tailored for each position!
          </DialogDescription>
        </DialogHeader>
      </div>
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="targetPosition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Position</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="This resume is best suited for which role?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Skills Section */}
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="px-2 py-1">
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-xs hover:text-destructive focus:outline-none"
                    aria-label={`Remove ${skill}`}
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
            <FormField
              control={form.control}
              name="skills"
              render={() => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Add a skill (press Enter or comma to add)"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={() => addSkill(inputValue)}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Resume Upload */}
            <FormField
              control={form.control}
              name="resume"
              render={() => (
                <FormItem>
                  <FormLabel>Upload Resume</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              Add Resume
            </Button>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
};

export default AddResumeModal;
