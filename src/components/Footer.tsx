const Footer = () => (
  <footer className="glass-panel border-t border-white/20 bg-white/18 backdrop-blur-xl">
    <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-slate/85 sm:flex-row sm:items-center sm:justify-between">
      <p>
        Curated by the Tomorrow Voices collective. Crafted with care for speculative urban futures.
      </p>
      <div className="flex flex-wrap gap-4">
        <a href="mailto:tomorrowvoices@example.com" className="glass-link font-medium focus-visible:focus-ring">
          Contact / Removal
        </a>
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="glass-link focus-visible:focus-ring">
          GitHub
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
