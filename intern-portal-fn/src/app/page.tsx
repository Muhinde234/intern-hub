"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, BookOpen, Star, BarChart3, Bell, CheckCircle } from "lucide-react";

const FEATURES = [
  {
    icon: Briefcase,
    title: "Smart Internship Matching",
    desc: "AI-powered matching connects students to the right internships based on their skills, interests, and academic profile.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: BookOpen,
    title: "Weekly Progress Logs",
    desc: "Students submit structured weekly logs. Supervisors review them online — no paperwork, no delays.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Star,
    title: "Digital Evaluations",
    desc: "Supervisors complete AI-assisted digital assessments and assign grades directly on the platform.",
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: Bell,
    title: "Automated Notifications",
    desc: "Automatic reminders for log submissions, placement approvals, and evaluation deadlines.",
    color: "bg-teal-50 text-teal-600",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    desc: "University management gets real-time dashboards with internship performance and participation stats.",
    color: "bg-sky-50 text-sky-600",
  },
  {
    icon: CheckCircle,
    title: "Placement Approval",
    desc: "The internship office reviews and approves placements centrally — full visibility at every step.",
    color: "bg-emerald-50 text-emerald-600",
  },
];

const ROLES = [
  { label: "Students", desc: "Apply for internships, submit logs, track progress", color: "border-blue-200 bg-blue-50" },
  { label: "Companies", desc: "Post opportunities, review applicants, evaluate interns", color: "border-indigo-200 bg-indigo-50" },
  { label: "Supervisors", desc: "Guide students, review logs, complete evaluations", color: "border-teal-200 bg-teal-50" },
  { label: "Admins", desc: "Manage placements, monitor performance, generate reports", color: "border-sky-200 bg-sky-50" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/image/intern-logo.png" alt="InternHub" width={32} height={32} className="object-contain" />
            <span className="text-base font-bold text-blue-900">InternHub</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-900 transition-colors">
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-blue-900 text-white px-4 py-1.5 rounded-full hover:bg-blue-800 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — full screen */}
      <section className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Subtle background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-700/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-800/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-7 relative z-10">
          {/* AI badge */}
          <div className="inline-flex items-center gap-2 bg-teal-400/20 text-teal-200 text-sm px-4 py-1.5 rounded-full border border-teal-400/30 backdrop-blur-sm">
            ✨ Powered by Claude AI
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight">
            The Smart Internship Portal <br className="hidden sm:block" />
            for African Universities
          </h1>

          <p className="text-lg text-blue-200 max-w-2xl mx-auto leading-relaxed">
            Centralize every step of your internship programme — from applications and placements to weekly logs and evaluations — in one intelligent platform.
          </p>

          {/* Role pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-400/20 text-blue-200 border border-blue-400/30">Students</span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-400/20 text-indigo-200 border border-indigo-400/30">Companies</span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-400/20 text-teal-200 border border-teal-400/30">Supervisors</span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-400/20 text-sky-200 border border-sky-400/30">Admins</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-950 font-bold px-8 py-3.5 rounded-full hover:bg-blue-50 transition-colors text-sm shadow-lg"
            >
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white font-medium px-8 py-3.5 rounded-full hover:bg-white/20 transition-colors text-sm backdrop-blur-sm"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-blue-300/60 text-xs animate-bounce">
          <span>Scroll</span>
          <div className="w-px h-6 bg-blue-300/40" />
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-blue-950 border-b border-blue-900 py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: "4 Roles", label: "Student · Company · Supervisor · Admin" },
            { value: "AI-Powered", label: "Smart matching & cover letters" },
            { value: "Real-time", label: "Notifications & progress tracking" },
            { value: "100%", label: "Digital — no paperwork" },
          ].map(({ value, label }) => (
            <div key={value}>
              <p className="text-2xl font-extrabold text-white">{value}</p>
              <p className="text-xs text-blue-300 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-600">What we offer</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-3 max-w-xl leading-tight">Everything you need, in one place</h2>
          </div>

          <div className="space-y-0 divide-y divide-gray-200">
            {[
              {
                number: "01",
                icon: Briefcase,
                title: "Smart Internship Matching",
                desc: "AI-powered matching connects students to the right internships based on skills, interests, and academic profile.",
                tag: "AI Powered",
                tagColor: "bg-blue-100 text-blue-700",
              },
              {
                number: "02",
                icon: BookOpen,
                title: "Weekly Progress Logs",
                desc: "Students submit structured logs each week. Get instant AI feedback before submitting to your supervisor.",
                tag: "AI Feedback",
                tagColor: "bg-indigo-100 text-indigo-700",
              },
              {
                number: "03",
                icon: Star,
                title: "Digital Evaluations",
                desc: "Supervisors complete AI-assisted assessments and assign grades directly on the platform — no paper forms.",
                tag: "AI Assisted",
                tagColor: "bg-teal-100 text-teal-700",
              },
              {
                number: "04",
                icon: CheckCircle,
                title: "Placement Approval",
                desc: "The internship office reviews and approves all student placements centrally with full visibility.",
                tag: "Admin Control",
                tagColor: "bg-sky-100 text-sky-700",
              },
              {
                number: "05",
                icon: Bell,
                title: "Automated Notifications",
                desc: "Automatic reminders for log submissions, placement approvals, and evaluation deadlines — no one falls behind.",
                tag: "Real-time",
                tagColor: "bg-emerald-100 text-emerald-700",
              },
              {
                number: "06",
                icon: BarChart3,
                title: "Reports & Analytics",
                desc: "University management gets live dashboards with internship performance and participation statistics.",
                tag: "Insights",
                tagColor: "bg-violet-100 text-violet-700",
              },
            ].map(({ number, icon: Icon, title, desc, tag, tagColor }) => (
              <div key={number} className="group flex items-start gap-6 sm:gap-10 py-8 hover:bg-white transition-colors rounded-2xl px-4 cursor-default">
                <span className="text-4xl font-black text-gray-100 group-hover:text-blue-100 transition-colors select-none shrink-0 w-12 text-right leading-none mt-1">
                  {number}
                </span>
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 group-hover:border-blue-200 flex items-center justify-center shrink-0 shadow-sm transition-colors">
                  <Icon size={18} className="text-blue-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1.5">
                    <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${tagColor}`}>{tag}</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Built for everyone in the internship journey</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ROLES.map(({ label, desc, color }) => (
              <div key={label} className={`p-5 rounded-2xl border-2 ${color}`}>
                <p className="font-bold text-gray-800 text-lg">{label}</p>
                <p className="text-sm text-gray-600 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-blue-950 text-white text-center">
        <div className="max-w-2xl mx-auto space-y-5">
          <h2 className="text-3xl font-bold">Ready to modernize your internship programme?</h2>
          <p className="text-blue-300">Join InternHub and eliminate manual coordination forever.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-blue-950 font-bold px-8 py-3.5 rounded-full hover:bg-blue-50 transition-colors"
          >
            Create Your Account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Image src="/image/intern-logo.png" alt="InternHub" width={36} height={36} className="object-contain" />
            <div>
              <p className="font-bold text-blue-900 text-base">InternHub</p>
              <p className="text-xs text-gray-400">Internship & Industrial Attachment Portal</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/login" className="hover:text-blue-900 transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-blue-900 transition-colors">Register</Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-gray-400 text-center sm:text-right">
            © 2026 InternHub · Powered by Claude AI
          </p>
        </div>
      </footer>
    </div>
  );
}
