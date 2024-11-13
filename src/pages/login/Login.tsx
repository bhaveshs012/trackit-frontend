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

  function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log(values);
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-6">
      <div className="mb-4 space-y-2">
        <img
          src={TrackItLogoBlack}
          alt="Logo"
          className="w-12 h-auto mb-4 mx-auto"
        />
        <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
          Welcome back !
        </h4>
        <p className="text-md text-muted-foreground">
          Manage your job applications and insights in one place.
        </p>
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
              <Button type="submit" className="w-full font-semibold ">
                Submit
              </Button>
            </div>
          </form>
        </Form>
        <p className="text-sm text-muted-foreground text-center">
          Not Registered yet? <span className="underline">Sign up</span>
        </p>
      </div>
    </div>
  );
}
