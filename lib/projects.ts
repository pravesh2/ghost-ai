import { auth } from "@clerk/nextjs/server"
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

export async function getProjectLists() {
  const { userId } = await auth()
  if (!userId) {
    return { ownedProjects: [], sharedProjects: [] }
  }

  const ownedProjects = await prisma.project.findMany({
    where: { ownerClerkId: userId },
    orderBy: { createdAt: "desc" },
  })

  return {
    ownedProjects: ownedProjects.map((project) => ({
      id: project.id,
      name: project.name,
      slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id)
        ? project.id
        : slugify(project.name),
      owned: true,
    })),
    sharedProjects: [],
  }
}
