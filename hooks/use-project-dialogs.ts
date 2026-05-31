"use client"

import { FormEvent, useMemo, useState } from "react"

export type DialogType = "create" | "rename" | "delete" | null

export interface Project {
  id: string
  name: string
  slug: string
  owned: boolean
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

const initialProjects: Project[] = [
  { id: "proj-1", name: "Product Launch", slug: "product-launch", owned: true },
  { id: "proj-2", name: "Design Sprint", slug: "design-sprint", owned: true },
  { id: "proj-3", name: "Partner Brief", slug: "partner-brief", owned: false },
]

export function useProjectDialogs() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [dialogType, setDialogType] = useState<DialogType>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [formName, setFormName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId),
    [projects, selectedProjectId]
  )

  const slugPreview = useMemo(() => slugify(formName || selectedProject?.name || ""), [
    formName,
    selectedProject,
  ])

  const openCreateDialog = () => {
    setDialogType("create")
    setSelectedProjectId(null)
    setFormName("")
    setIsDialogOpen(true)
  }

  const openRenameDialog = (projectId: string) => {
    const project = projects.find((item) => item.id === projectId)
    if (!project) return

    setDialogType("rename")
    setSelectedProjectId(projectId)
    setFormName(project.name)
    setIsDialogOpen(true)
  }

  const openDeleteDialog = (projectId: string) => {
    const project = projects.find((item) => item.id === projectId)
    if (!project) return

    setDialogType("delete")
    setSelectedProjectId(projectId)
    setFormName("")
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setDialogType(null)
    setSelectedProjectId(null)
    setFormName("")
  }

  const submitDialog = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!dialogType) return

    if (dialogType === "create") {
      const value = formName.trim()
      if (!value) return

      setProjects((current) => [
        {
          id: `proj-${Date.now()}`,
          name: value,
          slug: slugify(value),
          owned: true,
        },
        ...current,
      ])
      closeDialog()
      return
    }

    if (dialogType === "rename" && selectedProject) {
      const value = formName.trim()
      if (!value) return

      setProjects((current) =>
        current.map((project) =>
          project.id === selectedProject.id
            ? { ...project, name: value, slug: slugify(value) }
            : project
        )
      )
      closeDialog()
      return
    }

    if (dialogType === "delete" && selectedProject) {
      setProjects((current) => current.filter((project) => project.id !== selectedProject.id))
      closeDialog()
      return
    }
  }

  return {
    projects,
    dialogType,
    isDialogOpen,
    formName,
    slugPreview,
    selectedProject,
    isLoading,
    setFormName,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    submitDialog,
  }
}
