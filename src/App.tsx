import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import { StoriesProvider } from './lib/StoriesContext';

const HomePage = lazy(() => import('./pages/Home'));
const ArchivePage = lazy(() => import('./pages/Archive'));
const InsightsPage = lazy(() => import('./pages/Insights'));
const MethodsPage = lazy(() => import('./pages/Methods'));
const SubmitPage = lazy(() => import('./pages/Submit'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));

const App = () => {
  useEffect(() => {
    const preload = async () => {
      await Promise.all([
        import('./pages/Archive'),
        import('./pages/Insights'),
        import('./pages/Methods'),
        import('./pages/Submit'),
      ]);
    };
    preload().catch(() => undefined);
  }, []);

  return (
    <StoriesProvider>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="min-h-screen bg-base-light text-slate-900">
        <Header />
        <main id="main-content" className="mx-auto flex max-w-6xl flex-1 flex-col gap-12 px-4 pb-16 pt-8" role="main">
          <Suspense fallback={<p className="text-center text-slate-600">Loading...</p>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/archive" element={<ArchivePage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/methods" element={<MethodsPage />} />
              <Route path="/submit" element={<SubmitPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main> 
        <Footer />
      </div>
    </StoriesProvider>
  );
};

export default App;
