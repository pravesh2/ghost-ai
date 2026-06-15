"use client"

import { type FormEvent, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export type DialogType = "create" | "rename" | "delete" | null

export type Project = {
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

function makeSuffix() {
  return Math.random().toString(36).slice(2, 6)
}

function buildRoomId(name: string, suffix: string) {
  return `${slugify(name)}-${suffix}`
}

export function useProjectActions(projects: Project[]) {
  const [dialogType, setDialogType] = useState<DialogType>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [formName, setFormName] = useState("")
  const [createSuffix, setCreateSuffix] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const activeProjectId = searchParams.get("projectId")

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId),
    [projects, selectedProjectId]
  )

  const slugPreview = useMemo(() => {
    if (dialogType === "create") {
      return formName.trim() ? buildRoomId(formName, createSuffix) : ""
    }

    if (dialogType === "rename") {
      return formName.trim() ? slugify(formName) : selectedProject?.slug ?? ""
    }

    return ""
  }, [createSuffix, dialogType, formName, selectedProject])

  const openCreateDialog = () => {
    setDialogType("create")
    setSelectedProjectId(null)
    setFormName("")
    setCreateSuffix(makeSuffix())
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

  const submitDialog = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!dialogType) return

    if (dialogType === "create") {
      const trimmedName = formName.trim()
      if (!trimmedName) return

      const roomId = buildRoomId(trimmedName, createSuffix)
      setIsLoading(true)

      try {
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: roomId, name: trimmedName }),
        })

        if (!response.ok) {
          throw new Error(`Unable to create project: ${response.statusText}`)
        }

        const project = await response.json()
        closeDialog()
        router.push(`/editor/${encodeURIComponent(project.id)}`)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }

      return
    }

    if (!selectedProject) return

    if (dialogType === "rename") {
      const trimmedName = formName.trim()
      if (!trimmedName) return

      setIsLoading(true)

      try {
        const response = await fetch(`/api/projects/${selectedProject.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: trimmedName }),
        })

        if (!response.ok) {
          throw new Error(`Unable to rename project: ${response.statusText}`)
        }

        closeDialog()
        router.refresh()
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }

      return
    }

    if (dialogType === "delete") {
      setIsLoading(true)

      try {
        const response = await fetch(`/api/projects/${selectedProject.id}`, {
          method: "DELETE",
        })

        if (!response.ok && response.status !== 204) {
          throw new Error(`Unable to delete project: ${response.statusText}`)
        }

        closeDialog()

        if (activeProjectId === selectedProject.id) {
          router.push("/editor")
        } else {
          router.refresh()
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return {
    dialogType,
    isDialogOpen,
    formName,
    isLoading,
    slugPreview,
    selectedProject,
    setFormName,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    submitDialog,
  }
}
