import { getConcretenessGauges, getFidelityGauges, getHallucinationGauges } from '../lib/metrics';
import type { Story } from '../lib/types';

type MetricsPanelProps = {
  story: Story;
};

const Gauge = ({ label, value, max, description }: { label: string; value: number; max: number; description?: string }) => {
  const denominator = max <= 0 ? Math.max(1, value) : max;
  const percentage = Math.min(100, Math.round((value / denominator) * 100));
  return (
    <div
      className="glass-panel hover:-translate-y-0.5 hover:ring-white/60 space-y-2 rounded-2xl border border-white/20 bg-white/18 p-4"
      role="group"
      aria-label={`${label}: ${value} of ${denominator}`}
    >
      <div className="flex items-center justify-between text-xs text-slate/70">
        <span>{label}</span>
        <span className="font-mono text-slate-600">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-white/25" role="img" aria-label={`${percentage}% full`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald via-indigo to-gold"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {description && <p className="text-[11px] text-slate/60">{description}</p>}
    </div>
  );
};

const MetricsPanel = ({ story }: MetricsPanelProps) => (
  <div className="space-y-6 text-slate/80">
    <section aria-labelledby="fidelity-metrics" className="space-y-3">
      <h3 id="fidelity-metrics" className="glass-heading text-lg">
        Fidelity
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {getFidelityGauges(story).map((gauge) => (
          <Gauge key={gauge.label} {...gauge} />
        ))}
      </div>
    </section>

    <section aria-labelledby="concreteness-metrics" className="space-y-3">
      <h3 id="concreteness-metrics" className="glass-heading text-lg">
        Concreteness
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {getConcretenessGauges(story).map((gauge) => (
          <Gauge key={gauge.label} {...gauge} />
        ))}
      </div>
    </section>

    <section aria-labelledby="hallucination-metrics" className="space-y-3">
      <h3 id="hallucination-metrics" className="glass-heading text-lg">
        Hallucinations
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {getHallucinationGauges(story).map((gauge) => (
          <Gauge key={gauge.label} {...gauge} />
        ))}
      </div>
    </section>
  </div>
);

export default MetricsPanel;
