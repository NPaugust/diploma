export default function MetricsPanel({ metrics }) {
  const m = metrics || { accuracy: 0.91, precision: 0.90, recall: 0.89, f1: 0.895 }
  const entries = [
    { key: 'Accuracy', val: m.accuracy },
    { key: 'Precision', val: m.precision },
    { key: 'Recall', val: m.recall },
    { key: 'F1-score', val: m.f1 },
  ]
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {entries.map(({ key, val }) => (
        <div key={key} className="glass-dark rounded-xl p-4 text-center">
          <div className="text-white/70 text-xs uppercase tracking-wider">{key}</div>
          <div className="text-white text-2xl font-bold mt-1">{(val * 100).toFixed(1)}%</div>
        </div>
      ))}
    </section>
  )
}



