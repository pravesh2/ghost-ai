import { redirect } from "next/navigation"
import { getProjectLists } from "@/lib/projects"
import { getCurrentIdentity, getProjectIfAccessible } from "@/lib/project-access"
import AccessDenied from "@/components/editor/access-denied"
import EditorWorkspaceShell from "@/components/editor/editor-workspace-shell"

interface EditorRoomPageProps {
  params: Promise<{
    roomId: string
  }>
}

export default async function EditorRoomPage({ params }: EditorRoomPageProps) {
  const actualParams = await params
  const roomId = actualParams?.roomId
  const identity = await getCurrentIdentity()

  if (!identity?.userId) {
    redirect("/sign-in")
  }

  if (!roomId) {
    return <AccessDenied />
  }

  const project = await getProjectIfAccessible(roomId, identity)
  if (!project) {
    return <AccessDenied />
  }

  const { ownedProjects, sharedProjects } = await getProjectLists()

  return (
    <EditorWorkspaceShell
      projectName={project.name}
      activeProjectId={project.id}
      projects={[...ownedProjects, ...sharedProjects]}
      isOwner={project.ownerClerkId === identity.userId}
    />
  )
}
