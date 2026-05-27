import { useState } from 'react'
import Button from '../ui/Button'

const popularRoles = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Data Scientist', 'AI/ML Engineer', 'Cybersecurity Analyst',
  'DevOps Engineer', 'UI/UX Designer', 'Cloud Engineer', 'Mobile Developer'
]

export default function StepOne({ data, onChange, onNext }) {
  const [value, setValue] = useState(data.targetRole || '')

  const handleNext = () => {
    if (!value.trim()) return alert('Please enter a target role')
    onChange({ targetRole: value.trim() })
    onNext()
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">What's your target role?</h2>
      <p className="text-gray-500 mb-6">Tell us what career you're aiming for.</p>

      <input
        type="text"
        placeholder="e.g. Frontend Developer, Data Scientist..."
        value={value}
        onChange={e => setValue(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
      />

      <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide font-semibold">Popular roles</p>
      <div className="flex flex-wrap gap-2 mb-8">
        {popularRoles.map(role => (
          <button
            key={role}
            onClick={() => setValue(role)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
              value === role
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      <Button onClick={handleNext} className="w-full">Continue →</Button>
    </div>
  )
}