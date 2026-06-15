import { getCurrentIdentity } from "@/lib/project-access"
import prisma from "@/lib/prisma"

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export type Project = {
  id: string
  name: string
  slug: string
  owned: boolean
}

interface ProjectRecord {
  id: string
  name: string
}

export async function getProjectLists() {
  const identity = await getCurrentIdentity()
  if (!identity?.userId) {
    return { ownedProjects: [], sharedProjects: [] }
  }

  const { userId } = identity
  const email = identity.email?.toLowerCase() ?? null
  let ownedProjects: ProjectRecord[] = []
  let sharedProjects: ProjectRecord[] = []

  try {
    ownedProjects = await prisma.project.findMany({
      where: { ownerClerkId: userId },
      orderBy: { createdAt: "desc" },
    })

    if (email) {
      sharedProjects = await prisma.project.findMany({
        where: {
          ownerClerkId: { not: userId },
          collaborators: { some: { email } },
        },
        orderBy: { createdAt: "desc" },
      })
    }
  } catch (err) {
    // Database is unavailable (dev environment). Log and return empty lists so the app can still render.
    // eslint-disable-next-line no-console
    console.error("Prisma query failed in getProjectLists:", err)
    return { ownedProjects: [], sharedProjects: [] }
  }

  return {
    ownedProjects: ownedProjects.map((project) => ({
      id: project.id,
      name: project.name,
      slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id)
        ? project.id
        : slugify(project.name),
      owned: true,
    })),
    sharedProjects: sharedProjects.map((project) => ({
      id: project.id,
      name: project.name,
      slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id)
        ? project.id
        : slugify(project.name),
      owned: false,
    })),
  }
}
