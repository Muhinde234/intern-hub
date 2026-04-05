"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  fullName: z.string().min(2, { message: "Full name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  role: z.enum(["STUDENT", "COMPANY", "SUPERVISOR"], { required_error: "Please select a role." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

const ROLE_REDIRECT: Record<string, string> = {
  STUDENT: "/student/internships",
  COMPANY: "/company/postings",
  SUPERVISOR: "/supervisor/assigned-students",
};

const ROLES = [
  { value: "STUDENT", label: "Student", desc: "Browse & apply for internships" },
  { value: "COMPANY", label: "Company", desc: "Post internship opportunities" },
  { value: "SUPERVISOR", label: "Supervisor", desc: "Mentor and evaluate students" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: "", email: "", role: undefined, password: "", confirmPassword: "" },
  });

  const selectedRole = form.watch("role");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setServerError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          role: values.role,
          fullName: values.fullName,
          companyName: values.role === "COMPANY" ? values.fullName : undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error ?? "Registration failed. Please try again.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", values.email);

      router.push(ROLE_REDIRECT[data.role] ?? "/");
    } catch {
      setServerError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md p-8 space-y-5 bg-white rounded-2xl shadow-lg border border-gray-200">
        {/* Logo */}
        <div className="flex justify-center">
          <Image src="/image/intern-logo.png" alt="Logo" width={90} height={90} className="object-contain" />
        </div>

        <h2 className="text-center text-2xl font-bold text-blue-900">Create an account</h2>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {serverError}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            {/* Role selector */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>I am a...</FormLabel>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {ROLES.map(({ value, label, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => field.onChange(value)}
                        className={`flex flex-col items-center text-center p-3 rounded-xl border-2 transition-all text-xs cursor-pointer ${
                          selectedRole === value
                            ? "border-blue-600 bg-blue-50 text-blue-800"
                            : "border-gray-200 text-gray-600 hover:border-blue-300"
                        }`}
                      >
                        <span className="font-semibold text-sm">{label}</span>
                        <span className="text-gray-400 mt-0.5 leading-tight">{desc}</span>
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{selectedRole === "COMPANY" ? "Company Name" : "Full Name"}</FormLabel>
                  <FormControl>
                    <Input placeholder={selectedRole === "COMPANY" ? "e.g. TechRwanda Ltd" : "e.g. Alice Uwimana"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
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

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-900 text-white hover:bg-blue-800 rounded-full"
            >
              {loading ? "Creating account..." : "Register"}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/" className="text-blue-700 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
