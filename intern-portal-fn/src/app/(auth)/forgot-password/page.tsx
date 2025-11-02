"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function ForgotPasswordPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Password reset requested for:", values.email);
    // 🔗 You can integrate your reset-password API call here
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg border border-gray-200">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/image/intern-logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>

        <h2 className="text-center text-2xl font-bold text-blue-900">
          Forgot your password?
        </h2>
        <p className="text-center text-sm text-gray-600">
          Enter your email, and we’ll send you a link to reset your password.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-blue-900 text-white hover:bg-blue-800 rounded-full"
            >
              Send Reset Link
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link href="/" className="text-blue-700 font-medium hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
