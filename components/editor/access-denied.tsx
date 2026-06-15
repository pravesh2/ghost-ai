import Link from "next/link"
import { Lock } from "lucide-react"

export default function AccessDenied() {
  return (
    <div className="grid min-h-screen place-items-center bg-gray-950 px-4">
      <div className="max-w-md rounded-3xl border border-gray-800 bg-slate-950/95 p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-sky-400">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-white">Access denied</h1>
        <p className="mt-3 text-sm leading-6 text-gray-400">
          You do not have permission to open this project or it does not exist.
        </p>
        <Link
          href="/editor"
          className="inline-flex mt-6 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
        >
          Back to projects
        </Link>
      </div>
    </div>
  )
}
