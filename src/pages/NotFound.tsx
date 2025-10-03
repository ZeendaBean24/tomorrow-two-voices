import { Link } from 'react-router-dom';

const NotFound = () => (
  <section data-section="not-found" className="section-root flex min-h-screen flex-col items-center justify-center pb-24">
    <div className="glass-panel glass-border-rust flex max-w-xl flex-col items-center gap-6 rounded-3xl border border-white/20 bg-white/18 px-10 py-12 text-center">
      <div className="glass-scrim flex flex-col items-center gap-6 text-center">
      <h1 className="glass-heading text-4xl">404 — Story thread not found</h1>
      <p className="glass-body text-lg">
        The page you are looking for might be a future we have not conjured yet. Try heading back to the archive or home.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow transition-transform duration-300 ease-out hover:-translate-y-1 hover:bg-indigo-700 focus-visible:focus-ring"
        >
          Return home
        </Link>
        <Link
          to="/archive"
          className="rounded-full border border-oxblood/60 bg-oxblood/20 px-6 py-2 text-sm font-semibold text-oxblood transition hover:-translate-y-0.5 hover:bg-oxblood/30 focus-visible:focus-ring"
        >
          Explore archive
        </Link>
      </div>
      </div>
    </div>
  </section>
);

export default NotFound;
