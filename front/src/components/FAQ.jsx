export default function FAQ() {
  const qas = [
    {
      q: 'What MRI image formats are supported?',
      a: 'The system accepts standard 2D brain MRI slices in JPG, PNG, WEBP formats. DICOM format is not supported in the browser.'
    },
    {
      q: 'How many tumor types can the system classify?',
      a: 'The system can classify 12 different brain tumor types: normal, glioma, meningioma, pituitary, carcinoma, ependimoma, ganglioglioma, germinoma, granuloma, medulloblastoma, schwannoma, and tuberculoma.'
    },
    {
      q: 'Can I trust the AI results?',
      a: 'The system shows which brain regions the AI focused on during analysis. However, this is only a preliminary assessment - always consult a doctor for accurate diagnosis.'
    },
    {
      q: 'What should I do if AI detects a tumor?',
      a: 'Immediately consult a qualified neurologist or neurosurgeon for additional testing and accurate diagnosis.'
    },
    {
      q: 'How accurate are the results?',
      a: 'The system shows confidence level for each result. High accuracy is achieved through training on large amounts of medical data.'
    },
    {
      q: 'Is it safe to upload my medical data?',
      a: 'All uploaded images are processed locally and not stored on the server. Your data remains confidential.'
    }
  ]
  return (
    <section>
      <div className="space-y-2">
        {qas.map((x) => (
          <details key={x.q} className="card rounded-lg p-3">
            <summary className="text-primary-dark cursor-pointer font-medium text-sm">{x.q}</summary>
            <p className="text-secondary-dark mt-2 text-xs leading-relaxed">{x.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}