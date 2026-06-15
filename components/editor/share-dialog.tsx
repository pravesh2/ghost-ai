"use client"

import { useEffect, useMemo, useState } from "react"
import { Check, Copy, Trash2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface Collaborator {
  id: string
  email: string
  displayName?: string | null
  avatarUrl?: string | null
}

interface ShareDialogProps {
  projectId: string
  projectName: string
  isOpen: boolean
  isOwner: boolean
  onOpenChange: (open: boolean) => void
}

function emailIsValid(value: string) {
  return /^\S+@\S+\.\S+$/.test(value.trim())
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function ShareDialog({
  projectId,
  projectName,
  isOpen,
  isOwner,
  onOpenChange,
}: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [inviteEmail, setInviteEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [copyStatus, setCopyStatus] = useState<"copy" | "copied">("copy")
  const [projectLink, setProjectLink] = useState("")

  const sortedCollaborators = useMemo(
    () => [...collaborators].sort((a, b) => a.email.localeCompare(b.email)),
    [collaborators],
  )

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setProjectLink(`${window.location.origin}/editor/${encodeURIComponent(projectId)}`)
    setErrorMessage(null)
    setStatusMessage(null)

    const abortController = new AbortController()

    async function loadCollaborators() {
      setLoading(true)
      try {
        const response = await fetch(`/api/projects/${projectId}/collaborators`, {
          signal: abortController.signal,
        })

        if (!response.ok) {
          throw new Error(`Unable to load collaborators: ${response.statusText}`)
        }

        const data = await response.json()
        setCollaborators(Array.isArray(data.collaborators) ? data.collaborators : [])
      } catch {
        if (abortController.signal.aborted) {
          return
        }
        setErrorMessage("Unable to load collaborators. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadCollaborators()

    return () => {
      abortController.abort()
    }
  }, [isOpen, projectId])

  const handleInvite = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setStatusMessage(null)

    const email = inviteEmail.trim().toLowerCase()
    if (!email) {
      setErrorMessage("Enter an email address.")
      return
    }

    if (!emailIsValid(email)) {
      setErrorMessage("Enter a valid email address.")
      return
    }

    if (collaborators.some((collaborator) => collaborator.email.toLowerCase() === email)) {
      setErrorMessage("This user is already a collaborator.")
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || response.statusText)
      }

      const result = await response.json()
      setInviteEmail("")
      setStatusMessage("Invite sent.")
      setCollaborators((current) =>
        result.collaborator ? [...current, result.collaborator] : current,
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message || "Unable to invite collaborator."
          : "Unable to invite collaborator.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemove = async (email: string) => {
    setErrorMessage(null)
    setStatusMessage(null)
    setSubmitting(true)

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || response.statusText)
      }

      setCollaborators((current) => current.filter((collaborator) => collaborator.email !== email))
      setStatusMessage("Collaborator removed.")
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message || "Unable to remove collaborator."
          : "Unable to remove collaborator.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      if (!projectLink) {
        throw new Error("Project link is not available yet.")
      }

      await navigator.clipboard.writeText(projectLink)
      setCopyStatus("copied")
      window.setTimeout(() => setCopyStatus("copy"), 2000)
    } catch {
      setErrorMessage("Unable to copy the link. Please try again.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-surface-border bg-elevated text-copy-primary">
        <DialogHeader>
          <DialogTitle>Share {projectName}</DialogTitle>
          <DialogDescription className="text-copy-muted">
            Invite collaborators by email or copy the workspace link. Collaborators can view the
            collaborator list only.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-2">
          <div className="rounded-3xl border border-surface-border bg-surface p-4 text-sm text-copy-secondary">
            <p className="font-medium text-copy-primary">Project link</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1 truncate rounded-2xl border border-surface-border bg-base px-3 py-2 text-sm text-copy-secondary shadow-sm">
                {projectLink || "Loading link..."}
              </div>
              <Button
                type="button"
                onClick={handleCopyLink}
                disabled={!projectLink || copyStatus === "copied"}
                className="whitespace-nowrap"
              >
                {copyStatus === "copied" ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy link
                  </>
                )}
              </Button>
            </div>
          </div>

          {isOwner ? (
            <form
              onSubmit={handleInvite}
              className="grid gap-3 rounded-3xl border border-surface-border bg-surface p-4"
            >
              <div className="grid gap-2">
                <label htmlFor="invite-email" className="text-sm font-medium text-copy-primary">
                  Invite collaborator by email
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    id="invite-email"
                    type="email"
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                    placeholder="name@example.com"
                    className="flex-1 border-surface-border bg-base text-copy-primary placeholder:text-copy-faint"
                  />
                  <Button type="submit" disabled={submitting || !inviteEmail.trim()}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite
                  </Button>
                </div>
              </div>
              <p className="text-xs text-copy-muted">
                Invitations are recorded by email. If the user exists in Clerk, display name and
                avatar will be shown.
              </p>
            </form>
          ) : (
            <div className="rounded-3xl border border-surface-border bg-surface p-4 text-sm text-copy-secondary">
              <p className="font-medium text-copy-primary">Read-only access</p>
              <p className="mt-2 text-copy-muted">
                You can view collaborators here, but only the project owner can invite or remove
                collaborators.
              </p>
            </div>
          )}

          <div className="rounded-3xl border border-surface-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-copy-primary">Collaborators</p>
              <p className="text-xs text-copy-muted">{collaborators.length} invited</p>
            </div>

            {loading ? (
              <div className="mt-4 text-sm text-copy-muted">Loading collaborators...</div>
            ) : collaborators.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-surface-border p-6 text-sm text-copy-muted">
                No collaborators yet.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {sortedCollaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-surface-border bg-base p-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-subtle text-copy-secondary">
                        {collaborator.avatarUrl ? (
                          <img
                            src={collaborator.avatarUrl}
                            alt={collaborator.displayName ?? collaborator.email}
                            className="h-10 w-10 rounded-2xl object-cover"
                          />
                        ) : (
                          <span className="text-sm font-semibold">
                            {getInitials(collaborator.displayName ?? collaborator.email)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-copy-primary">
                          {collaborator.displayName ?? collaborator.email}
                        </p>
                        <p className="truncate text-sm text-copy-muted">{collaborator.email}</p>
                      </div>
                    </div>
                    {isOwner ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemove(collaborator.email)}
                        disabled={submitting}
                        title={`Remove ${collaborator.email}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          {(errorMessage || statusMessage) && (
            <div
              className={
                errorMessage
                  ? "rounded-2xl border border-surface-border px-4 py-3 text-sm text-[var(--state-error)]"
                  : "rounded-2xl border border-surface-border px-4 py-3 text-sm text-[var(--state-success)]"
              }
            >
              {errorMessage || statusMessage}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
