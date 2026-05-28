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
    <div className="space-y-6 pt-4">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">What's your target role?</h2>
        <p className="text-slate-500 text-lg">Tell us what career you're aiming for.</p>
      </div>

      <input
        type="text"
        placeholder="e.g. Frontend Developer, Data Scientist..."
        value={value}
        onChange={e => setValue(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 text-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
      />

      <div>
        <p className="text-xs text-slate-400 mb-4 uppercase tracking-wider font-bold">Popular roles</p>
        <div className="flex flex-wrap gap-2.5">
        {popularRoles.map(role => (
          <button
            key={role}
            onClick={() => setValue(role)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
              value === role
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700'
            }`}
          >
            {role}
          </button>
        ))}
      </div>
      </div>

      <div className="pt-4">
        <Button onClick={handleNext} className="w-full py-4 text-lg shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all">
          Continue →
        </Button>
      </div>
    </div>
  )
}