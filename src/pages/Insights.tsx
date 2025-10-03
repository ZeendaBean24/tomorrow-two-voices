import { useEffect } from 'react';
import heroTexture from '@assets/paper-texture.svg';
import { useStories } from '../lib/StoriesContext';

const Insights = () => {
  const { stories } = useStories();

  useEffect(() => {
    void stories;
  }, [stories]);

  return (
    <section className="flex flex-col gap-8">
      <header className="max-w-3xl space-y-4">
        <h1 className="font-display text-3xl text-slate-900">Insights are coming soon</h1>
        <p className="text-lg text-slate-700">
          This page will visualize themes, affect, concreteness, and hallucinations. We are prototyping a layered storytelling dashboard.
        </p>
      </header>
      <div
        className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-10 text-slate-600 shadow-artifact"
        style={{ backgroundImage: `url(${heroTexture})`, backgroundSize: 'cover', backgroundBlendMode: 'multiply' }}
        role="status"
        aria-live="polite"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-hope/10 via-sunrise/10 to-focus/10" aria-hidden="true" />
        <div className="relative max-w-md space-y-3">
          <p className="font-display text-2xl text-slate-800">Visual lab in progress</p>
          <p>
            Expect comparisons of hopeful and cautionary affect, time vs. place anchors, and a hallucination radar. In the meantime, explore the archive for raw context.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Insights;
