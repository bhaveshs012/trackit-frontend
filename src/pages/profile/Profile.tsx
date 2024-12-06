import SubHeading from "@/components/typography/SubHeading";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import apiClient from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "../common/LoadingScreen";
import ErrorScreen from "../common/ErrorScreen";

const userDetailsFormSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .min(1, "First name cannot be empty"),
  lastName: z
    .string({ required_error: "Last name is required" })
    .min(1, "Last name cannot be empty"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Enter a valid email address"),
  phoneNumber: z
    .string({ required_error: "Phone number is required" })
    .regex(/^\d{10}$/, "Phone number must be 10 digits"),
  skills: z.array(z.string().min(1, "Skill cannot be empty")),
  aspiringRole: z
    .string({ required_error: "Aspiring Role is required" })
    .min(1, "Aspiring Role cannot be empty"),
  experienceLevel: z.enum(["Entry", "Intermediate", "Senior", "Executive"], {
    message: "Please select a valid value",
  }),
});

const experienceLevelEnum = {
  ENTRY: "Entry",
  INTERMEDIATE: "Intermediate",
  SENIOR: "Senior",
  EXECUTIVE: "Executive",
};

function Profile() {
  //* Get the user details from the backend
  const getUserDetails = async () => {
    const response = await apiClient.get("/users/current-user");
    return response.data.data;
  };

  const {
    data: currentUser,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["getUserDetails"],
    queryFn: getUserDetails,
  });

  //* Set the default values
  const form = useForm<z.infer<typeof userDetailsFormSchema>>({
    resolver: zodResolver(userDetailsFormSchema),
    defaultValues: {
      email: currentUser?.email || "",
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      phoneNumber: "",
      skills: currentUser?.skills || [],
      aspiringRole: currentUser?.aspiringRole || "",
      experienceLevel: currentUser?.experienceLevel || "Entry",
    },
  });

  const { handleSubmit, setValue, watch, reset } = form;

  useEffect(() => {
    if (currentUser) {
      reset({
        email: currentUser.email,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        phoneNumber: currentUser.phoneNumber || "",
        skills: currentUser.skills || [],
        aspiringRole: currentUser.aspiringRole || "",
        experienceLevel: currentUser.experienceLevel || "Entry",
      });
    }
  }, [currentUser, reset]);

  //* Check if form state has changed
  const [valuesChanged, setValuesChanged] = useState<boolean>(false);

  const checkForChange = () => {
    if (currentUser) {
      const hasChanged = Object.entries(form.getValues()).some(
        ([key, value]) => {
          return (
            currentUser[key] && value.toString() !== currentUser[key].toString()
          );
        }
      );
      setValuesChanged(hasChanged);
    }
  };

  useEffect(() => {
    checkForChange();
  }, [watch()]);

  //* Input State for managing the skills
  const [inputValue, setInputValue] = useState("");

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

  const onSubmit = (values: z.infer<typeof userDetailsFormSchema>) => {
    console.log(values);
  };

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen title="" description="" />;

  return (
    <div className="flex justify-start flex-col min-h-screen p-6 gap-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-y-2 justify-start">
        <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight ">
          {"Profile"}
        </h4>
        <SubHeading subtitle="Manage your user profile from here." />
      </div>
      {/* Profile Details Display Section */}
      <div className="w-full space-y-4 max-w-3xl border-2 p-6 rounded-lg shadow-lg">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your first name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your first name as you'd like it displayed on your profile.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your last name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your last name as it will appear on your profile.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} disabled />
                  </FormControl>
                  <FormDescription>
                    Your primary email address, used for account-related
                    communications.
                  </FormDescription>
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
                  <FormDescription>
                    List the technical and soft skills you possess, separated by
                    commas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aspiringRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aspiring Role</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g. SDE, Product Manager, Designer"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The job title or position you're targeting.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experienceLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(experienceLevelEnum).map(([_, value]) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The job title or position you're targeting.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-full font-semibold"
                disabled={!valuesChanged}
              >
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Profile;
