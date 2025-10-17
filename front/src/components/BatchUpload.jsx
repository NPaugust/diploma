import { useRef, useState } from 'react'
import useAppStore from '../store/useAppStore'
import { predictImage } from '../api/api'

export default function BatchUpload() {
  const inputRef = useRef(null)
  const { selectedMethod, addBatchResult, resetBatch, setError, setIsLoading } = useAppStore()
  const [progress, setProgress] = useState({ done: 0, total: 0 })

  const handlePick = () => inputRef.current?.click()

  const handleFiles = async (files) => {
    const list = Array.from(files || [])
    if (!list.length) return
    resetBatch()
    setProgress({ done: 0, total: list.length })
    setIsLoading(true)
    try {
      for (let i = 0; i < list.length; i++) {
        const f = list[i]
        try {
          const res = await predictImage(f, selectedMethod)
          addBatchResult({ name: f.name, ...res })
        } catch (e) {
          addBatchResult({ name: f.name, error: e?.response?.data?.detail || 'Failed' })
        }
        setProgress({ done: i + 1, total: list.length })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="glass-dark rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold">Batch Analysis</h3>
        <button className="text-sm px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white" onClick={handlePick}>Select images</button>
        <input ref={inputRef} type="file" accept="image/*,.jpg,.jpeg,.png,.webp" multiple className="hidden" onChange={(e)=>handleFiles(e.target.files)} />
      </div>
      {progress.total > 0 && (
        <div className="text-white/70 text-sm mb-3">Progress: {progress.done}/{progress.total}</div>
      )}
      <BatchTable />
    </div>
  )
}

function BatchTable() {
  const { batchResults } = useAppStore()
  if (!batchResults?.length) {
    return <p className="text-white/50 text-sm">No batch results yet.</p>
  }
  return (
    <div className="overflow-auto max-h-72">
      <table className="w-full text-left text-sm text-white/80">
        <thead className="text-white/60">
          <tr>
            <th className="py-2 pr-2">File</th>
            <th className="py-2 pr-2">Predicted</th>
            <th className="py-2 pr-2">Confidence</th>
            <th className="py-2">Error</th>
          </tr>
        </thead>
        <tbody>
          {batchResults.map((r, idx) => (
            <tr key={idx} className="border-t border-white/10">
              <td className="py-2 pr-2 break-all">{r.name}</td>
              <td className="py-2 pr-2">{r.predicted_class || '-'}</td>
              <td className="py-2 pr-2">{r.confidence != null ? `${(r.confidence*100).toFixed(1)}%` : '-'}</td>
              <td className="py-2">{r.error || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}



