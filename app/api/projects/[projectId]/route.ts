import { NextRequest, NextResponse } from "next/server"
import { getAuth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export async function PATCH(
  req: NextRequest,
  context: any,
) {
  const { userId } = getAuth(req)
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  // `context.params` may be a Promise in some Next versions; resolve if needed
  const rawParams = context?.params
  const params = rawParams && typeof rawParams.then === 'function' ? await rawParams : rawParams
  const projectId = params?.projectId
  if (!projectId) {
    return new Response("Project ID is required", { status: 400 })
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  })

  if (!project) {
    return new Response("Not found", { status: 404 })
  }

  if (project.ownerClerkId !== userId) {
    return new Response("Forbidden", { status: 403 })
  }

  const body = await req.json()
  const name = body?.name?.trim()

  if (!name) {
    return new Response("Project name is required", { status: 400 })
  }

  const updated = await prisma.project.update({
    where: { id: projectId },
    data: { name },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  req: NextRequest,
  context: any,
) {
  const { userId } = getAuth(req)
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  // `context.params` may be a Promise in some Next versions; resolve if needed
  const rawParams = context?.params
  const params = rawParams && typeof rawParams.then === 'function' ? await rawParams : rawParams
  const projectId = params?.projectId
  if (!projectId) {
    return new Response("Project ID is required", { status: 400 })
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  })

  if (!project) {
    return new Response("Not found", { status: 404 })
  }

  if (project.ownerClerkId !== userId) {
    return new Response("Forbidden", { status: 403 })
  }

  await prisma.project.delete({ where: { id: projectId } })

  return new Response(null, { status: 204 })
}
