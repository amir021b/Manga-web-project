function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 px-4 py-6 backdrop-blur-md">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-white/50">
        <p>© {new Date().getFullYear()} MangaHub. Design preview.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition">Terms</a>
          <a href="#" className="hover:text-white transition">Privacy</a>
          <a href="#" className="hover:text-white transition">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
