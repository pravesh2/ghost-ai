import { Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Project } from "@/hooks/use-project-dialogs";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onCreateProject: () => void;
  onRenameProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
}

export function ProjectSidebar({
  isOpen,
  onClose,
  projects,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  const myProjects = projects.filter((project) => project.owned);
  const sharedProjects = projects.filter((project) => !project.owned);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Projects</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <Tabs defaultValue="my-projects" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="my-projects">My Projects</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
            </TabsList>
            <TabsContent value="my-projects" className="mt-4 space-y-3">
              {myProjects.length === 0 ? (
                <div className="text-center text-gray-400 py-8">No projects yet</div>
              ) : (
                myProjects.map((project) => (
                  <div key={project.id} className="rounded-2xl border border-gray-700 bg-gray-950 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{project.name}</p>
                        <p className="mt-1 text-sm text-gray-500">/{project.slug}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRenameProject(project.id)}
                          title="Rename project"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteProject(project.id)}
                          title="Delete project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
            <TabsContent value="shared" className="mt-4 space-y-3">
              {sharedProjects.length === 0 ? (
                <div className="text-center text-gray-400 py-8">No shared projects yet</div>
              ) : (
                sharedProjects.map((project) => (
                  <div key={project.id} className="rounded-2xl border border-gray-700 bg-gray-950 p-4">
                    <p className="font-semibold text-white">{project.name}</p>
                    <p className="mt-1 text-sm text-gray-500">/{project.slug}</p>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-4 border-t border-gray-700">
          <Button className="w-full" variant="default" onClick={onCreateProject}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>
    </>
  );
}
