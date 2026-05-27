import { useState } from 'react'
import Button from '../ui/Button'
import { X } from 'lucide-react'

const fields = [
  'Web Development', 'AI/ML', 'Cybersecurity', 'Data Science',
  'Cloud Computing', 'Mobile Development', 'DevOps', 'UI/UX Design'
]

export default function StepThree({ data, onChange, onNext, onBack }) {
  const [skills, setSkills] = useState(data.skills || [])
  const [input, setInput] = useState('')
  const [field, setField] = useState(data.fieldOfInterest || '')
  const [prior, setPrior] = useState(data.priorExperience || false)

  const addSkill = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      if (!skills.includes(input.trim())) setSkills([...skills, input.trim()])
      setInput('')
    }
  }

  const removeSkill = (s) => setSkills(skills.filter(sk => sk !== s))

  const handleNext = () => {
    onChange({ skills, fieldOfInterest: field, priorExperience: prior })
    onNext()
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Skills & Interests</h2>
      <p className="text-gray-500 mb-6">What do you already know? What field excites you?</p>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Your current skills</label>
        <input
          type="text"
          placeholder="Type a skill and press Enter (e.g. HTML, Python)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={addSkill}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
        />
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map(s => (
              <span key={s} className="flex items-center gap-1 bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full">
                {s}
                <button onClick={() => removeSkill(s)}><X size={12} /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Field of interest</label>
        <div className="flex flex-wrap gap-2">
          {fields.map(f => (
            <button key={f} onClick={() => setField(f)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                field === f ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:border-indigo-400'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8 flex items-center gap-3">
        <button
          onClick={() => setPrior(!prior)}
          className={`w-11 h-6 rounded-full transition-colors ${prior ? 'bg-indigo-600' : 'bg-gray-200'}`}
        >
          <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${prior ? 'translate-x-5' : ''}`} />
        </button>
        <span className="text-sm text-gray-700">I have prior experience in this field</span>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack} className="flex-1">← Back</Button>
        <Button onClick={handleNext} className="flex-1">Continue →</Button>
      </div>
    </div>
  )
}