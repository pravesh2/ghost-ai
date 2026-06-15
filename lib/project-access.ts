import { auth, currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export type CurrentIdentity = {
  userId: string
  email: string | null
}

export async function getCurrentIdentity(): Promise<CurrentIdentity | null> {
  const { userId } = await auth()
  if (!userId) {
    return null
  }

  const user = await currentUser()
  const email = user?.emailAddresses?.find(
    (item) => item.id === user.primaryEmailAddressId,
  )?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? null

  return { userId, email }
}

export async function getProjectIfAccessible(
  projectId: string,
  identity: CurrentIdentity,
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { collaborators: true },
  })

  if (!project) {
    return null
  }

  const normalizedEmail = identity.email?.toLowerCase() ?? null
  const isOwner = project.ownerClerkId === identity.userId
  const isCollaborator = normalizedEmail
    ? project.collaborators.some(
        (collaborator) => collaborator.email.toLowerCase() === normalizedEmail,
      )
    : false

  if (!isOwner && !isCollaborator) {
    return null
  }

  return project
}
