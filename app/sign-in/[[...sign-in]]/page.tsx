"use client";

import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-base">
      <div className="grid grid-cols-2 h-full">
        {/* Left Panel */}
        <div className="flex flex-col justify-center px-16 py-12 bg-subtle border-r border-surface-border">
          <div className="max-w-md">
            {/* Logo and tagline */}
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-sm bg-brand" />
                <h1 className="text-3xl font-bold text-copy-primary" style={{ fontFamily: "var(--font-geist-sans)" }}>Ghost AI</h1>
              </div>
              <p className="text-lg text-copy-secondary" style={{ fontFamily: "var(--font-geist-sans)" }}>Design systems at the speed of thought.</p>
            </div>

            {/* Description */}
            <p className="text-copy-secondary mb-12 leading-relaxed" style={{ fontFamily: "var(--font-geist-sans)" }}>
              Describe your architecture in plain English. Ghost AI maps it to a shared canvas your whole team can refine in real time.
            </p>

            {/* Features */}
            <div className="space-y-8">
              {[
                { title: "AI Architecture Generation", desc: "Describe your system, AI maps it to nodes and edges on a live canvas." },
                { title: "Real-time Collaboration", desc: "Live cursors, presence indicators, and shared node editing across your team." },
                { title: "Instant Spec Generation", desc: "Export a complete Markdown technical spec directly from the canvas graph." },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-0.5 h-full bg-brand shrink-0 mt-1" />
                  <div>
                    <p className="text-copy-primary font-semibold mb-1" style={{ fontFamily: "var(--font-geist-sans)" }}>{title}</p>
                    <p className="text-sm text-copy-secondary" style={{ fontFamily: "var(--font-geist-sans)" }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Clerk Form */}
        <div className="flex items-center justify-center px-8 py-12 bg-base">
          <div className="w-full max-w-sm">
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}