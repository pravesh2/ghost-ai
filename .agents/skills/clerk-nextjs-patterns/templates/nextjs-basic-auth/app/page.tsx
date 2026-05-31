"use client"

import { useEffect } from "react"
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useAuth()

  useEffect(() => {
    if (!isLoaded) return
    if (isSignedIn) {
      router.push("/dashboard")
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-10 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="text-sm text-slate-300">Loading authentication state…</p>
        </div>
      </div>
    )
  }

  if (isSignedIn) {
    return null
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-6 rounded-3xl border border-slate-800 bg-slate-900/95 p-10 shadow-lg shadow-black/20">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Clerk Auth Demo</p>
          <h1 className="text-4xl font-semibold">Welcome back</h1>
          <p className="text-sm text-slate-400">Sign in or sign up to continue to the protected dashboard.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <SignInButton mode="modal">
            <button className="rounded-full bg-slate-100 px-6 py-2 text-slate-950 transition hover:bg-white">Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="rounded-full border border-slate-700 bg-transparent px-6 py-2 text-slate-100 transition hover:border-slate-500">Sign Up</button>
          </SignUpButton>
        </div>
      </div>
    </main>
  )
}
