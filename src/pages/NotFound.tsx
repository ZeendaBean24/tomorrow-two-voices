import { Link } from 'react-router-dom';

const NotFound = () => (
  <section className="space-y-6 text-center">
    <h1 className="font-display text-4xl text-slate-900">404 — Story thread not found</h1>
    <p className="text-lg text-slate-700">
      The page you are looking for might be a future we have not conjured yet. Try heading back to the archive or home.
    </p>
    <div className="flex justify-center gap-3">
      <Link
        to="/"
        className="rounded-full bg-focus px-5 py-2 text-sm font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-focus"
      >
        Return home
      </Link>
      <Link
        to="/archive"
        className="rounded-full border border-focus px-5 py-2 text-sm font-semibold text-focus hover:bg-focus/10 focus:outline-none focus:ring-2 focus:ring-focus"
      >
        Explore archive
      </Link>
    </div>
  </section>
);

export default NotFound;
