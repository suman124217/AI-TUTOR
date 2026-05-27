import { useState } from 'react'
import Button from '../ui/Button'

const timeOptions = ['30 mins/day', '1 hour/day', '2 hours/day', '3+ hours/day', 'Weekends only']
const goalOptions = [
  { value: 'job', label: '💼 Get a Job' },
  { value: 'internship', label: '🎓 Get an Internship' },
  { value: 'freelancing', label: '💻 Freelancing' },
  { value: 'career-switch', label: '🔄 Career Switch' },
  { value: 'startup', label: '🚀 Start a Startup' },
]

export default function StepFour({ data, onChange, onSubmit, onBack, isLoading }) {
  const [time, setTime] = useState(data.dailyTime || '')
  const [goal, setGoal] = useState(data.careerGoal || '')

  const handleSubmit = () => {
    if (!time) return alert('Please select your daily time')
    if (!goal) return alert('Please select your career goal')
    onChange({ dailyTime: time, careerGoal: goal })
    onSubmit({ dailyTime: time, careerGoal: goal })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Time & Goals</h2>
      <p className="text-gray-500 mb-6">Help us build a realistic plan for you.</p>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Daily learning time</label>
        <div className="flex flex-wrap gap-2">
          {timeOptions.map(t => (
            <button key={t} onClick={() => setTime(t)}
              className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                time === t ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Your career goal</label>
        <div className="grid grid-cols-2 gap-3">
          {goalOptions.map(({ value, label }) => (
            <button key={value} onClick={() => setGoal(value)}
              className={`p-3 rounded-xl border-2 text-sm font-medium text-left transition-all ${
                goal === value ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack} className="flex-1">← Back</Button>
        <Button onClick={handleSubmit} disabled={isLoading} className="flex-1">
          {isLoading ? 'Generating...' : '✨ Generate My Roadmap'}
        </Button>
      </div>
    </div>
  )
}