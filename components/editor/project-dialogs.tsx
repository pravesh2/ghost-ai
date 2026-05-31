"use client"

import { type FormEvent } from "react"
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
import type { DialogType, Project } from "@/hooks/use-project-dialogs"

interface ProjectDialogsProps {
  isOpen: boolean
  dialogType: DialogType
  selectedProject?: Project
  formName: string
  slugPreview: string
  isLoading: boolean
  setFormName: (value: string) => void
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function ProjectDialogs({
  isOpen,
  dialogType,
  selectedProject,
  formName,
  slugPreview,
  isLoading,
  setFormName,
  onClose,
  onSubmit,
}: ProjectDialogsProps) {
  const title =
    dialogType === "create"
      ? "Create Project"
      : dialogType === "rename"
      ? "Rename Project"
      : "Delete Project"

  const description =
    dialogType === "create"
      ? "Create a new project workspace. Enter a name to generate a live slug preview."
      : dialogType === "rename"
      ? `Rename ${selectedProject?.name ?? "this project"}. Press Enter to submit.`
      : `Confirm deletion of ${selectedProject?.name ?? "this project"}. This action cannot be undone.`

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          {(dialogType === "create" || dialogType === "rename") && (
            <>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-900 dark:text-slate-100" htmlFor="project-name">
                  Project Name
                </label>
                <Input
                  id="project-name"
                  autoFocus
                  value={formName}
                  onChange={(event) => setFormName(event.target.value)}
                  placeholder="Enter project name"
                />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  Slug preview
                </p>
                <p className="mt-1 font-medium">{slugPreview || "project-slug"}</p>
              </div>
            </>
          )}
          {dialogType === "delete" && (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-slate-700 dark:text-slate-200">
              <p>
                You are about to delete <span className="font-semibold text-slate-900 dark:text-slate-50">{selectedProject?.name}</span>.
              </p>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                This cannot be undone.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={dialogType === "delete" ? "destructive" : "default"}
              disabled={
                isLoading ||
                ((dialogType === "create" || dialogType === "rename") && !formName.trim())
              }
            >
              {dialogType === "delete"
                ? "Delete Project"
                : dialogType === "rename"
                ? "Rename Project"
                : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
