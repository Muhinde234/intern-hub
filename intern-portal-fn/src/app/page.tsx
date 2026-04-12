"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, BookOpen, Star, BarChart3, Bell, CheckCircle, Sparkles } from "lucide-react";

const FEATURES = [
  { icon: Briefcase,    title: "AI Internship Matching",    desc: "Claude AI ranks every internship by fit — matching your skills, major, and interests automatically.",       tag: "AI",        tagColor: "text-blue-600 bg-blue-50" },
  { icon: BookOpen,     title: "Weekly Progress Logs",       desc: "Submit structured logs weekly and get instant AI feedback on clarity, depth, and professionalism.",         tag: "AI",        tagColor: "text-indigo-600 bg-indigo-50" },
  { icon: Star,         title: "Digital Evaluations",        desc: "Supervisors get an AI-drafted evaluation they can review, edit, and submit — saving hours of work.",         tag: "AI",        tagColor: "text-teal-600 bg-teal-50" },
  { icon: CheckCircle,  title: "Placement Approval",         desc: "The internship office approves placements centrally. Every status change is visible in real time.",          tag: "Admin",     tagColor: "text-sky-600 bg-sky-50" },
  { icon: Bell,         title: "Smart Notifications",        desc: "Automatic reminders for deadlines, approvals, and evaluations — no one slips through the cracks.",           tag: "Real-time", tagColor: "text-emerald-600 bg-emerald-50" },
  { icon: BarChart3,    title: "Reports & Analytics",        desc: "Management dashboards with live participation stats, placement rates, and evaluation scores.",                tag: "Insights",  tagColor: "text-violet-600 bg-violet-50" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/image/intern-logo.png" alt="InternHub" width={30} height={30} className="object-contain" />
            <span className="font-extrabold text-blue-950 tracking-tight">InternHub</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-blue-900 px-3 py-1.5 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="text-sm font-semibold bg-blue-950 text-white px-4 py-1.5 rounded-full hover:bg-blue-800 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="min-h-screen bg-blue-950 flex flex-col items-center justify-center px-6 pt-14 relative overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-700/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 text-teal-300 text-xs font-semibold">
            <Sparkles size={13} /> Powered by Claude AI
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white leading-[1.05] tracking-tight">
            Internship management,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300">
              reimagined.
            </span>
          </h1>

          <p className="text-blue-300 text-lg max-w-xl mx-auto leading-relaxed">
            One platform for students, companies, supervisors and admins — with AI at every step.
          </p>

          {/* Role chips */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Students",    bg: "bg-blue-500/15 border-blue-400/25 text-blue-200" },
              { label: "Companies",   bg: "bg-indigo-500/15 border-indigo-400/25 text-indigo-200" },
              { label: "Supervisors", bg: "bg-teal-500/15 border-teal-400/25 text-teal-200" },
              { label: "Admins",      bg: "bg-sky-500/15 border-sky-400/25 text-sky-200" },
            ].map(({ label, bg }) => (
              <span key={label} className={`px-4 py-1 rounded-full text-xs font-semibold border ${bg}`}>{label}</span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-white text-blue-950 font-bold px-7 py-3 rounded-full hover:bg-blue-50 transition-colors text-sm shadow-xl shadow-blue-950/40">
              Create Free Account <ArrowRight size={15} />
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center gap-2 bg-white/8 border border-white/15 text-white/80 font-medium px-7 py-3 rounded-full hover:bg-white/15 transition-colors text-sm">
              Sign In
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30">
          <div className="w-5 h-8 rounded-full border border-white/40 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: "4 Roles",     sub: "Students · Companies · Supervisors · Admins" },
            { value: "AI-Powered",  sub: "Matching, logs, evaluations & cover letters" },
            { value: "Real-time",   sub: "Notifications & live placement tracking" },
            { value: "100% Digital",sub: "No paperwork, no manual coordination" },
          ].map(({ value, sub }) => (
            <div key={value} className="space-y-1">
              <p className="text-2xl font-extrabold text-blue-950">{value}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-3">What's inside</p>
            <h2 className="text-4xl font-extrabold text-gray-900 leading-tight max-w-lg">Everything you need, in one place</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, tag, tagColor }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-950 flex items-center justify-center">
                    <Icon size={18} className="text-white" />
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tagColor}`}>{tag}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14 text-center">
            <p className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-3">Who it's for</p>
            <h2 className="text-4xl font-extrabold text-gray-900">Built for every role</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { role: "Students",    desc: "Browse internships, apply with AI cover letters, submit weekly logs, and track your placement from start to finish.", pill: "bg-blue-950 text-white" },
              { role: "Companies",   desc: "Post opportunities, receive applications, shortlist candidates, and evaluate interns — all in one dashboard.", pill: "bg-indigo-600 text-white" },
              { role: "Supervisors", desc: "Monitor assigned students, review weekly logs, and complete AI-assisted evaluations with just a few clicks.", pill: "bg-teal-600 text-white" },
              { role: "Admins",      desc: "Approve placements, manage all users, and generate institutional reports with real-time data.", pill: "bg-sky-600 text-white" },
            ].map(({ role, desc, pill }) => (
              <div key={role} className="group flex gap-5 p-6 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                <span className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full h-fit ${pill}`}>{role}</span>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-blue-950 py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-extrabold text-white leading-tight">Ready to go fully digital?</h2>
          <p className="text-blue-300">Join InternHub and eliminate manual internship coordination forever.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-white text-blue-950 font-bold px-8 py-3.5 rounded-full hover:bg-blue-50 transition-colors shadow-xl shadow-blue-950/40">
            Get Started Free <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-gray-100 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image src="/image/intern-logo.png" alt="InternHub" width={28} height={28} className="object-contain" />
            <div>
              <p className="font-extrabold text-blue-950 text-sm">InternHub</p>
              <p className="text-xs text-gray-400">Internship & Industrial Attachment Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/login" className="hover:text-blue-900 transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-blue-900 transition-colors">Register</Link>
          </div>
          <p className="text-xs text-gray-400">© 2026 InternHub · Powered by Claude AI</p>
        </div>
      </footer>
    </div>
  );
}
