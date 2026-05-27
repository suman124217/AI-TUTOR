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
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Your background</h2>
      <p className="text-gray-500 mb-6">This helps us tailor the roadmap to your situation.</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { value: 'student', label: 'Student', icon: GraduationCap, desc: 'Currently studying' },
          { value: 'professional', label: 'Working Professional', icon: Briefcase, desc: 'Already employed' },
        ].map(({ value, label, icon: Icon, desc }) => (
          <button
            key={value}
            onClick={() => setBackground(value)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              background === value
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Icon className={`mb-2 ${background === value ? 'text-indigo-600' : 'text-gray-400'}`} size={24} />
            <div className="font-semibold text-gray-900 text-sm">{label}</div>
            <div className="text-xs text-gray-500">{desc}</div>
          </button>
        ))}
      </div>

      {background === 'professional' && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Your current job role</label>
          <input
            type="text"
            placeholder="e.g. Marketing Manager, Teacher..."
            value={currentRole}
            onChange={e => setCurrentRole(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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