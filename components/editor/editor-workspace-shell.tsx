"use client"

import { useState } from "react"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ShareDialog } from "@/components/editor/share-dialog"
import type { Project } from "@/hooks/use-project-actions"

interface EditorWorkspaceShellProps {
  projectName: string
  projects: Project[]
  activeProjectId: string
  isOwner: boolean
}

export default function EditorWorkspaceShell({
  projectName,
  projects,
  activeProjectId,
  isOwner,
}: EditorWorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isAiOpen, setIsAiOpen] = useState(true)
  const [isShareOpen, setIsShareOpen] = useState(false)

  return (
    <div className="h-screen bg-base text-copy-primary">
      <EditorNavbar
        projectName={projectName}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((state) => !state)}
        isAiOpen={isAiOpen}
        onToggleAiSidebar={() => setIsAiOpen((state) => !state)}
        onShare={() => setIsShareOpen(true)}
      />
      <ShareDialog
        projectId={activeProjectId}
        projectName={projectName}
        isOpen={isShareOpen}
        isOwner={isOwner}
        onOpenChange={setIsShareOpen}
      />
      <div className="flex h-[calc(100vh-3rem)] overflow-hidden">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          projects={projects}
          onCreateProject={() => undefined}
          onRenameProject={() => undefined}
          onDeleteProject={() => undefined}
          activeProjectId={activeProjectId}
        />

        <div className={`flex min-h-0 flex-1 flex-col ${isSidebarOpen ? "pl-80" : "pl-0"}`}>
          <div className="flex flex-1 overflow-hidden">
            <main className="flex-1 overflow-hidden p-6">
              <div className="flex h-full min-h-0 flex-col rounded-3xl border border-surface-border bg-surface p-10 text-center shadow-inner shadow-black/30">
                <div className="m-auto max-w-xl">
                  <p className="text-sm uppercase tracking-[0.3em] text-brand">Workspace shell</p>
                  <h1 className="mt-6 text-3xl font-semibold text-copy-primary">{projectName}</h1>
                  <p className="mt-4 text-sm leading-6 text-copy-muted">
                    Project workspace is ready. The canvas and AI sidebar will be connected in the next feature.
                  </p>
                </div>
              </div>
            </main>

            {isAiOpen ? (
              <aside className="hidden w-80 flex-col border-l border-surface-border bg-surface p-6 xl:flex">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-copy-primary">AI Sidebar</p>
                  <span className="rounded-full bg-subtle px-2 py-1 text-xs text-copy-muted">Coming soon</span>
                </div>
                <div className="rounded-3xl border border-dashed border-surface-border bg-base p-4 text-sm leading-6 text-copy-muted">
                  This space will host AI suggestions, chat, and project guidance.
                </div>
              </aside>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
