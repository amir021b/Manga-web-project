function Footer() {
  return (
    <footer
      className="border-t border-[var(--mh-border)] bg-[var(--mh-surface-strong)] px-4 py-6 backdrop-blur-md"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-[var(--mh-text-secondary)]">
        <p>© {new Date().getFullYear()} MangaHub. Design preview.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-[var(--mh-text)] transition">Terms</a>
          <a href="#" className="hover:text-[var(--mh-text)] transition">Privacy</a>
          <a href="#" className="hover:text-[var(--mh-text)] transition">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
