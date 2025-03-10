export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // Create any shared layout or styles here
  return <div className="prose prose-neutral container py-10">{children}</div>;
}
