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
    <div className="space-y-6 pt-4">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Skills & Interests</h2>
        <p className="text-slate-600 text-lg">What do you already know? What field excites you?</p>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-3">Your current skills</label>
        <input
          type="text"
          placeholder="Type a skill and press Enter (e.g. HTML, Python)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={addSkill}
          className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-white/80 transition-all shadow-sm mb-4"
        />
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2.5">
            {skills.map(s => (
              <span key={s} className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-indigo-100 text-indigo-700 font-medium text-sm px-3 py-1.5 rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] hover:-translate-y-0.5 transition-transform">
                {s}
                <button onClick={() => removeSkill(s)} className="hover:bg-indigo-100 p-0.5 rounded-full transition-colors"><X size={14} /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-3">Field of interest</label>
        <div className="flex flex-wrap gap-2.5">
          {fields.map(f => (
            <button key={f} onClick={() => setField(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                field === f ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5' : 'bg-white/50 backdrop-blur-sm border-white/80 text-slate-600 hover:border-indigo-300 hover:bg-white/90 hover:shadow-md hover:-translate-y-0.5'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 bg-white/40 backdrop-blur-sm border border-white/80 rounded-2xl hover:bg-white/60 transition-colors duration-300 shadow-sm">
        <button
          onClick={() => setPrior(!prior)}
          className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${prior ? 'bg-indigo-600' : 'bg-slate-300'}`}
        >
          <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform duration-300 ${prior ? 'left-6' : 'left-0.5'}`} />
        </button>
        <span className="text-sm font-medium text-slate-700">I have prior experience in this field</span>
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="secondary" onClick={onBack} className="flex-1 py-4 text-lg">← Back</Button>
        <Button onClick={handleNext} className="flex-1 py-4 text-lg">Continue →</Button>
      </div>
    </div>
  )
}