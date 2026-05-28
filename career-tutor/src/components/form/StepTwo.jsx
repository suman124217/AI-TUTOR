import { useState } from 'react'
import Button from '../ui/Button'
import { GraduationCap, Briefcase } from 'lucide-react'

export default function StepTwo({ data, onChange, onNext, onBack }) {
  const [background, setBackground] = useState(data.background || '')
  const [currentRole, setCurrentRole] = useState(data.currentRole || '')

  const handleNext = () => {
    if (!background) return alert('Please select your background')
    onChange({ background, currentRole })
    onNext()
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Your background</h2>
      <p className="text-slate-600 mb-6">This helps us tailor the roadmap to your situation.</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { value: 'student', label: 'Student', icon: GraduationCap, desc: 'Currently studying' },
          { value: 'professional', label: 'Working Professional', icon: Briefcase, desc: 'Already employed' },
        ].map(({ value, label, icon: Icon, desc }) => (
          <button
            key={value}
            onClick={() => setBackground(value)}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
              background === value
                ? 'border-indigo-500 bg-indigo-50/80 backdrop-blur-sm shadow-md'
                : 'border-white/60 bg-white/40 backdrop-blur-sm hover:border-indigo-200 hover:bg-white/80'
            }`}
          >
            <Icon className={`mb-2 transition-colors ${background === value ? 'text-indigo-600' : 'text-slate-400'}`} size={24} />
            <div className="font-semibold text-slate-900 text-sm">{label}</div>
            <div className="text-xs text-slate-500">{desc}</div>
          </button>
        ))}
      </div>

      {background === 'professional' && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Your current job role</label>
          <input
            type="text"
            placeholder="e.g. Marketing Manager, Teacher..."
            value={currentRole}
            onChange={e => setCurrentRole(e.target.value)}
            className="w-full border border-white/80 bg-white/60 backdrop-blur-sm text-slate-900 placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/90 hover:bg-white/80 transition-all duration-300 shadow-sm"
          />
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack} className="flex-1">← Back</Button>
        <Button onClick={handleNext} className="flex-1">Continue →</Button>
      </div>
    </div>
  )
}