"use client";

import { MessageSquare, PanelLeftClose, PanelLeftOpen, Share2 } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  projectName: string;
  isSidebarOpen: boolean;
  isAiOpen: boolean;
  onToggleSidebar: () => void;
  onToggleAiSidebar: () => void;
  onShare: () => void;
}

export function EditorNavbar({
  projectName,
  isSidebarOpen,
  isAiOpen,
  onToggleSidebar,
  onToggleAiSidebar,
  onShare,
}: EditorNavbarProps) {
  return (
    <div className="flex h-12 items-center justify-between border-b border-surface-border bg-surface px-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="text-copy-muted hover:text-copy-primary"
          title={isSidebarOpen ? "Close project sidebar" : "Open project sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>
        <p className="text-sm font-semibold text-copy-primary">{projectName}</p>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onShare} title="Share project">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button
          variant={isAiOpen ? "secondary" : "ghost"}
          size="sm"
          onClick={onToggleAiSidebar}
          title={isAiOpen ? "Close AI sidebar" : "Open AI sidebar"}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
        <UserButton />
      </div>
    </div>
  );
}
