/**
 * AppShell.jsx — Root layout. Clean dark canvas, no decorations.
 */
export default function AppShell({ children }) {
  return (
    <div className="h-full w-full bg-surface-0 text-fg relative">
      {children}
    </div>
  );
}
