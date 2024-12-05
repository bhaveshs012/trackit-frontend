"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, setLoading } from "@/features/authSlice";
import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const FormSchema = z.object({
  email: z.string().email("Enter a valid email !!"),
  password: z
    .string({ required_error: "Password is required !!" })
    .min(1, "Password is required !!"),
});

export default function Login() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //* Redux states
  const dispatch = useDispatch();
  const { loading } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  function onSubmit(values: z.infer<typeof FormSchema>) {
    const submitHandler = async () => {
      try {
        dispatch(setLoading(true));
        const response = await apiClient.post("/users/login", {
          email: values.email,
          password: values.password,
        });
        dispatch(loginSuccess(response.data.data));
        navigate("/dashboard");
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        toast({
          title: "Error occurred !!",
          description: errorMessage,
        });
      } finally {
        dispatch(setLoading(false));
      }
    };
    submitHandler(); // Call the async function
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-6">
      <div className="mb-4 space-y-2">
        <img
          src={TrackItLogoBlack}
          alt="Logo"
          className="w-12 h-auto mb-4 mx-auto"
        />
        <Heading title="Welcome back !" />
        <SubHeading subtitle="Manage your job applications and insights in one place." />
      </div>
      <div className="w-full space-y-4 max-w-md border-2 p-6 rounded-lg shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="leading-7">Email</FormLabel>
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
                  <FormLabel className="leading-7">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
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
                className="w-full font-semibold"
                disabled={loading}
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
        <p className="text-sm text-muted-foreground text-center">
          Not Registered yet?{" "}
          <span className="underline" onClick={() => navigate("/signup")}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
