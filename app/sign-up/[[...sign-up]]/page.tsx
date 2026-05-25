"use client";

import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";
import { Zap, Users, FileText } from "lucide-react";

export default function SignUpPage() {
  const features = [
    {
      icon: Zap,
      title: "AI Architecture Generation",
      desc: "Describe your system, AI maps it to nodes and edges on a live canvas.",
    },
    {
      icon: Users,
      title: "Real-time Collaboration",
      desc: "Live cursors, presence indicators, and shared node editing across your team.",
    },
    {
      icon: FileText,
      title: "Instant Spec Generation",
      desc: "Export a complete Markdown technical spec directly from the canvas graph.",
    },
  ];

  return (
    <div className="min-h-screen bg-base font-geist-sans">
      <div className="grid grid-cols-2 h-full">
        {/* Left Panel */}
        <div className="flex flex-col justify-between px-16 py-16 bg-surface border-r border-surface-border">
          <div>
            {/* Logo and tagline */}
            <div className="mb-20">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-md bg-accent-primary flex items-center justify-center">
                  <span className="text-base text-black font-bold">◆</span>
                </div>
                <h1 className="text-4xl font-bold text-copy-primary tracking-tight">Ghost AI</h1>
              </div>
              <p className="text-lg text-copy-primary font-medium leading-relaxed max-w-sm">
                Design systems at the speed of thought.
              </p>
            </div>

            {/* Description */}
            <p className="text-copy-secondary mb-16 leading-relaxed max-w-sm text-sm">
              Describe your architecture in plain English. Ghost AI maps it to a shared canvas your whole team can refine in real time.
            </p>

            {/* Features */}
            <div className="space-y-10">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-5 h-5 text-accent-primary shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-copy-primary font-semibold mb-1 text-sm">
                      {title}
                    </p>
                    <p className="text-xs text-copy-secondary leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-copy-muted">© 2025 Ghost AI. All rights reserved.</p>
        </div>

        {/* Right Panel - Clerk Form */}
        <div className="flex items-center justify-center px-12 py-16 bg-base">
          <div className="w-full max-w-sm">
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center gap-4 py-16">
                <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-copy-secondary">Loading...</p>
              </div>
            }>
              <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}