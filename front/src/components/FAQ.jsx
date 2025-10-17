export default function FAQ() {
  const qas = [
    {
      q: 'What kinds of MRI images does this demo accept?',
      a: 'Standard 2D brain MRI slices in JPG/PNG/WEBP formats. DICOM is not supported in-browser in this demo.'
    },
    {
      q: 'Is the AI decision transparent?',
      a: 'Yes. Grad-CAM highlights salient regions the model focused on. SHAP (optional) explains feature contributions.'
    },
    {
      q: 'Can I use my own dataset?',
      a: 'Yes. Replace the dataset loader and retrain the model on your MRI dataset.'
    }
  ]
  return (
    <section className="mt-8">
      <h3 className="text-white font-bold mb-3">FAQ</h3>
      <div className="space-y-2">
        {qas.map((x) => (
          <details key={x.q} className="glass-dark rounded-lg p-3">
            <summary className="text-white cursor-pointer">{x.q}</summary>
            <p className="text-white/70 mt-2 text-sm">{x.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}



