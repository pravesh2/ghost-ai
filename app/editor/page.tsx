import { getProjectLists } from "@/lib/projects"
import EditorHomeClient from "@/components/editor/editor-home"

export default async function EditorPage() {
  const { ownedProjects, sharedProjects } = await getProjectLists()

  return <EditorHomeClient ownedProjects={ownedProjects} sharedProjects={sharedProjects} />
}
