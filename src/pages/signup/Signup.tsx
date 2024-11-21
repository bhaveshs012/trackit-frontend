"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, X } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import TrackItLogoBlack from "/logos/trackit-transparent-black.png";
import Heading from "@/components/typography/Heading";
import SubHeading from "@/components/typography/SubHeading";
import { useDispatch } from "react-redux";
import { setLoading, loginSuccess } from "@/features/authSlice";
import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const FormSchema = z
  .object({
    firstName: z
      .string({ required_error: "First name is required" })
      .min(1, "First name cannot be empty"),
    lastName: z
      .string({ required_error: "Last name is required" })
      .min(1, "Last name cannot be empty"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Enter a valid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(1, "Password cannot be empty")
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        "Choose a strong password"
      ),
    confirmPassword: z
      .string({ required_error: "Confirm password is required" })
      .min(1, "Confirm Password cannot be empty")
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        "Choose a strong password"
      ),
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

//* Experience Level Enum
const experienceLevelEnum = {
  ENTRY: "Entry",
  INTERMEDIATE: "Intermediate",
  SENIOR: "Senior",
  EXECUTIVE: "Executive",
};

export default function Signup() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      skills: [],
      aspiringRole: "",
      experienceLevel: "Entry",
    },
  });

  const { setValue, watch } = form;

  //* Skills State (Managed through form state now)
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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(values: z.infer<typeof FormSchema>) {
    const submitHandler = async () => {
      try {
        dispatch(setLoading(true));
        const response = await apiClient.post("/users/register", {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          skills: values.skills,
          aspiringRole: values.aspiringRole,
          experienceLevel: values.experienceLevel,
        });
        dispatch(loginSuccess(response.data.data));
        navigate("/home");
      } catch (error) {
        console.error("Sign up failed:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    submitHandler();
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-6">
      <div className="mb-4 space-y-2">
        <img
          src={TrackItLogoBlack}
          alt="Logo"
          className="w-12 h-auto mb-4 mx-auto"
        />
        <Heading title="Create an account" />
        <SubHeading subtitle="Sign up to get started with our services" />
      </div>
      <div className="w-full space-y-4 max-w-3xl border-2 p-6 rounded-lg shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl className="relative">
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl className="relative">
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+91 12345 67890"
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
            <div className="grid grid-cols-2 gap-4">
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
                          <SelectValue placeholder="Select an interview round" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(experienceLevelEnum).map(
                          ([_, value]) => (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-center">
              <Button type="submit" className="w-full font-semibold">
                Submit
              </Button>
            </div>
          </form>
        </Form>
        <p className="text-sm text-muted-foreground text-center">
          Already have an account?{" "}
          <span className="underline" onClick={() => navigate("/login")}>
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}
