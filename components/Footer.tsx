export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 py-8 text-center text-sm text-neutral-500">
      © {year} Developed by{" "}
      <span className="font-medium text-neutral-300">Mushfiqul Islam</span>
    </footer>
  );
}