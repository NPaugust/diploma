export default function ProjectIntro() {
  const items = [
    {
      title: 'Goal',
      text: 'Assist neuroradiology workflow by classifying brain tumor types on MRI and explaining model decisions.'
    },
    {
      title: 'Transfer Learning',
      text: 'Pretrained CNN backbone adapted to 4 classes: No Tumor, Glioma, Meningioma, Pituitary.'
    },
    {
      title: 'Explainable AI (XAI)',
      text: 'Grad-CAM (attention maps) and optional SHAP (feature importance) provide transparency.'
    }
  ]

  return (
    <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((it) => (
        <div key={it.title} className="glass-dark rounded-xl p-4">
          <h3 className="text-white font-semibold mb-2">{it.title}</h3>
          <p className="text-white/70 text-sm leading-relaxed">{it.text}</p>
        </div>
      ))}
    </section>
  )
}



