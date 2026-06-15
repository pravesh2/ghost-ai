# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature Implementation Phase 1 (in-progress - bug fixes)

## Current Goal

- Implement share dialog collaborator management for editor workspaces
- Verify share dialog build and API wiring

## Completed

- Implemented Prisma schema with Project and ProjectCollaborator models
- Implemented backend project APIs:
  - `GET /api/projects` lists the current user's projects
  - `POST /api/projects` creates a project and defaults missing names to `Untitled Project`
  - `PATCH /api/projects/[projectId]` renames a project
  - `DELETE /api/projects/[projectId]` deletes a project
  - Owner checks are enforced for rename/delete mutations
  - Unauthenticated requests return `401`
  - Non-owner mutations return `403`
- Wired editor home page to project data:
  - `app/editor/page.tsx` loads `ownedProjects` and `sharedProjects` server-side via `getProjectLists()`
  - `lib/projects.ts` fetches owned projects and derives stable slugs
- Implemented `hooks/use-project-actions.ts` for project management flows:
  - Create dialog state and project name input
  - Short unique suffix generation for room ID alignment
  - Slugify project names for room ID preview
  - `POST /api/projects` to create a new project and navigate to `/editor/[projectId]` (fixed routing)
  - `PATCH /api/projects/[id]` for renaming
  - `DELETE /api/projects/[id]` for deletion
  - Confirm delete and refresh/redirect logic for active workspace removal
- Connected UI components to real project data:
  - `components/editor/editor-home.tsx` renders the editor home with real owned/shared projects
  - `components/editor/project-sidebar.tsx` lists projects and exposes rename/delete actions
  - `components/editor/project-dialogs.tsx` renders create, rename, and delete dialogs with slug preview and confirmation copy
- Built active workspace shell with server-side access checks:
  - `app/editor/[roomId]/page.tsx` redirects unauthenticated users to `/sign-in`
  - `components/editor/access-denied.tsx` handles unauthorized or missing projects
  - `lib/project-access.ts` resolves Clerk identity and project access by owner or collaborator
- Fixed routing bug:
  - Changed project creation redirect from query parameter `/editor?projectId=...` to path-based `/editor/[projectId]`
- Implemented workspace sharing:
  - Added `GET /api/projects/[projectId]/collaborators` for accessible users to list collaborators
  - Added owner-only `POST /api/projects/[projectId]/collaborators` invite flow by normalized email
  - Added owner-only `DELETE /api/projects/[projectId]/collaborators` removal flow
  - Enriched collaborator emails with Clerk display name and avatar when a matching Clerk user exists
  - Wired the editor navbar Share button to the share dialog
  - Owners can invite, remove, view collaborators, and copy the project link with temporary `Copied!` feedback
  - Collaborators can open the share dialog in read-only mode and view the collaborator list
  - Normalized shared-project email lookup so invited collaborators can see shared projects reliably

## In Progress

- No active implementation task.

## Next Up

- Canvas rendering and Liveblocks integration
- AI sidebar persistence

## Recent Completions
- Fixed critical routing issue in `hooks/use-project-actions.ts` - project creation now redirects to correct path-based URL
- Implemented share dialog API and workspace UI wiring per `context/feature-specs/09-share-dialog.md`
- Verified `npm.cmd run build` passes after PowerShell blocked the `npm.ps1` shim

- Authentication integration, editor chrome, and design system implementation are complete and stable.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Add decisions that affect the system design or data model.

## Session Notes

- Add context needed to resume work in the next session.
