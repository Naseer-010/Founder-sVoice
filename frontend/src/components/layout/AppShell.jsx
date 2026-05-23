/**
 * AppShell.jsx — Root layout container for the application.
 *
 * Provides the mesh gradient background and full-viewport layout.
 */

export default function AppShell({ children }) {
  return (
    <div className="bg-mesh h-full w-full overflow-hidden relative">
      <div className="relative h-full w-full flex flex-col">
        {children}
      </div>
    </div>
  );
}
