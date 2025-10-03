import { Link } from 'react-router-dom';

const NotFound = () => (
  <section data-section="not-found" className="section-root flex min-h-screen flex-col items-center justify-center gap-6 text-center pb-24">
    <h1 className="text-4xl text-slate">404 — Story thread not found</h1>
    <p className="max-w-xl text-lg text-slate/80">
      The page you are looking for might be a future we have not conjured yet. Try heading back to the archive or home.
    </p>
    <div className="flex justify-center gap-3">
      <Link
        to="/"
        className="rounded-full bg-indigo px-6 py-2 text-sm font-semibold text-white shadow transition-transform duration-300 ease-out hover:-translate-y-1 focus-visible:focus-ring"
      >
        Return home
      </Link>
      <Link
        to="/archive"
        className="rounded-full border border-oxblood/60 px-6 py-2 text-sm font-semibold text-oxblood transition hover:bg-oxblood/10 focus-visible:focus-ring"
      >
        Explore archive
      </Link>
    </div>
  </section>
);

export default NotFound;
