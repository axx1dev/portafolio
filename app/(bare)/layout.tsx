/*
  (bare) layout — immersive, full-screen routes with no portfolio chrome
  (no navbar, footer, glows or scanlines). Used by /invitacion so the page
  owns the entire viewport and nothing flashes on reload.
*/

export default function BareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
