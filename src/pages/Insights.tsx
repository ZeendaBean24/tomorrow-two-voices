import { useEffect } from 'react';
import heroTexture from '@assets/paper-texture.svg';
import { useStories } from '../lib/StoriesContext';

const Insights = () => {
  const { stories } = useStories();

  useEffect(() => {
    void stories;
  }, [stories]);

  return (
    <section data-section="insights" className="section-root flex min-h-screen flex-col gap-12 pb-24">
      <header className="max-w-3xl space-y-4">
        <h1 className="text-4xl text-slate">Insights are coming soon</h1>
        <p className="text-lg text-slate/80">
          This page will visualize themes, affect, concreteness, and hallucinations. We are prototyping a layered storytelling dashboard.
        </p>
      </header>
      <div
        className="relative overflow-hidden rounded-3xl border border-gold/30 bg-paper p-10 text-slate/80 shadow-card"
        style={{ backgroundImage: `url(${heroTexture})`, backgroundSize: 'cover', backgroundBlendMode: 'multiply' }}
        role="status"
        aria-live="polite"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_-10%,rgba(245,158,11,0.25),transparent_65%),radial-gradient(circle_at_90%_40%,rgba(79,70,229,0.18),transparent_65%)]" aria-hidden="true" />
        <div className="relative max-w-md space-y-3">
          <p className="text-2xl text-slate">Visual lab in progress</p>
          <p className="text-slate/80">
            Expect comparisons of hopeful and cautionary affect, time vs. place anchors, and a hallucination radar. In the meantime, explore the archive for raw context.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Insights;
