import { NextRequest, NextResponse } from "next/server"
import { getAuth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req)
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: { ownerClerkId: userId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(projects)
}

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req)
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const body = await req.json()
  const name = body?.name?.trim() || "Untitled Project"

  const id = body?.id?.trim()

  const project = await prisma.project.create({
    data: {
      id: id || undefined,
      ownerClerkId: userId,
      name,
      description: body?.description ?? null,
      status: body?.status ?? "DRAFT",
      canvasJsonPath: body?.canvasJsonPath ?? null,
    },
  })

  return NextResponse.json(project, { status: 201 })
}
