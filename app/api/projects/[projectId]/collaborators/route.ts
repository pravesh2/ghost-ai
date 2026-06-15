import { clerkClient, getAuth } from "@clerk/nextjs/server"
import type { User } from "@clerk/backend"
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

interface CollaboratorResponse {
  id: string
  email: string
  displayName: string | null
  avatarUrl: string | null
}

interface CollaboratorParams {
  projectId: string
}

interface CollaboratorRouteContext {
  params: Promise<CollaboratorParams>
}

const emailPattern = /^\S+@\S+\.\S+$/

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : ""
}

function isValidEmail(email: string) {
  return emailPattern.test(email)
}

function getDisplayName(user: User) {
  return user.fullName ?? user.username ?? null
}

async function getProject(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
    include: { collaborators: { orderBy: { createdAt: "asc" } } },
  })
}

async function getUserPrimaryEmail(userId: string) {
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const email =
      user.emailAddresses.find((item) => item.id === user.primaryEmailAddressId)?.emailAddress ??
      user.emailAddresses[0]?.emailAddress ??
      null

    return email?.toLowerCase() ?? null
  } catch (error) {
    console.error("Unable to load Clerk user for collaborator access:", error)
    return null
  }
}

async function enrichCollaborators(
  collaborators: Array<{ id: string; email: string }>,
): Promise<CollaboratorResponse[]> {
  if (collaborators.length === 0) {
    return []
  }

  const usersByEmail = new Map<string, User>()

  try {
    const client = await clerkClient()
    const users = await client.users.getUserList({
      emailAddress: collaborators.map((collaborator) => collaborator.email),
      limit: collaborators.length,
    })

    for (const user of users.data) {
      for (const emailAddress of user.emailAddresses) {
        usersByEmail.set(emailAddress.emailAddress.toLowerCase(), user)
      }
    }
  } catch (error) {
    console.error("Unable to enrich collaborators from Clerk:", error)
  }

  return collaborators.map((collaborator) => {
    const user = usersByEmail.get(collaborator.email.toLowerCase())

    return {
      id: collaborator.id,
      email: collaborator.email,
      displayName: user ? getDisplayName(user) : null,
      avatarUrl: user?.imageUrl ?? null,
    }
  })
}

export async function GET(req: NextRequest, context: CollaboratorRouteContext) {
  const { userId } = getAuth(req)
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { projectId } = await context.params
  const project = await getProject(projectId)
  if (!project) {
    return new Response("Not found", { status: 404 })
  }

  const isOwner = project.ownerClerkId === userId
  const requesterEmail = isOwner ? null : await getUserPrimaryEmail(userId)
  const isCollaborator = requesterEmail
    ? project.collaborators.some((collaborator) => collaborator.email === requesterEmail)
    : false

  if (!isOwner && !isCollaborator) {
    return new Response("Forbidden", { status: 403 })
  }

  const collaborators = await enrichCollaborators(project.collaborators)
  return NextResponse.json({ collaborators })
}

export async function POST(req: NextRequest, context: CollaboratorRouteContext) {
  const { userId } = getAuth(req)
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { projectId } = await context.params
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) {
    return new Response("Not found", { status: 404 })
  }

  if (project.ownerClerkId !== userId) {
    return new Response("Forbidden", { status: 403 })
  }

  const body: unknown = await req.json()
  const email = normalizeEmail(
    typeof body === "object" && body !== null && "email" in body ? body.email : "",
  )

  if (!isValidEmail(email)) {
    return new Response("Valid email is required", { status: 400 })
  }

  const collaborator = await prisma.projectCollaborator.upsert({
    where: { projectId_email: { projectId, email } },
    create: { projectId, email },
    update: {},
  })

  const [enrichedCollaborator] = await enrichCollaborators([collaborator])
  return NextResponse.json({ collaborator: enrichedCollaborator }, { status: 201 })
}

export async function DELETE(req: NextRequest, context: CollaboratorRouteContext) {
  const { userId } = getAuth(req)
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { projectId } = await context.params
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) {
    return new Response("Not found", { status: 404 })
  }

  if (project.ownerClerkId !== userId) {
    return new Response("Forbidden", { status: 403 })
  }

  const body: unknown = await req.json()
  const email = normalizeEmail(
    typeof body === "object" && body !== null && "email" in body ? body.email : "",
  )

  if (!isValidEmail(email)) {
    return new Response("Valid email is required", { status: 400 })
  }

  await prisma.projectCollaborator.deleteMany({
    where: { projectId, email },
  })

  return new Response(null, { status: 204 })
}
