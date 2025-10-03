const Footer = () => (
  <footer className="border-t border-slate/15 bg-paper/90">
    <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-slate/80 sm:flex-row sm:items-center sm:justify-between">
      <p>
        Curated by the Tomorrow Voices collective. Crafted with care for speculative urban futures.
      </p>
      <div className="flex flex-wrap gap-4">
        <a href="mailto:tomorrowvoices@example.com" className="font-medium text-indigo hover:text-indigo/80 focus-visible:focus-ring">
          Contact / Removal
        </a>
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-slate focus-visible:focus-ring">
          GitHub
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
