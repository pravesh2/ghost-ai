"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { useProjectActions, type Project } from "@/hooks/use-project-actions"

interface EditorHomeProps {
  ownedProjects: Project[]
  sharedProjects: Project[]
}

export default function EditorHomeClient({ ownedProjects, sharedProjects }: EditorHomeProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const {
    dialogType,
    isDialogOpen,
    formName,
    slugPreview,
    selectedProject,
    isLoading,
    setFormName,
    openCreateDialog,
    openDeleteDialog,
    openRenameDialog,
    closeDialog,
    submitDialog,
  } = useProjectActions([...ownedProjects, ...sharedProjects])

  return (
    <div className="h-screen bg-gray-950 flex flex-col">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <main className="flex-1 px-6 py-8 sm:px-10">
        <div className="mx-auto flex h-full max-w-4xl flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            Create a project or open an existing one
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-gray-400 sm:text-base">
            Start a new architecture workspace, or choose a project from the sidebar.
          </p>
          <Button onClick={openCreateDialog} className="mt-8">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </main>
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projects={[...ownedProjects, ...sharedProjects]}
        onCreateProject={openCreateDialog}
        onRenameProject={openRenameDialog}
        onDeleteProject={openDeleteDialog}
      />
      <ProjectDialogs
        isOpen={isDialogOpen}
        dialogType={dialogType}
        selectedProject={selectedProject}
        formName={formName}
        slugPreview={slugPreview}
        isLoading={isLoading}
        setFormName={setFormName}
        onClose={closeDialog}
        onSubmit={submitDialog}
      />
    </div>
  )
}
