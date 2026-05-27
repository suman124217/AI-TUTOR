import { useNavigate } from 'react-router-dom'
import { Sparkles, Map, TrendingUp, Award } from 'lucide-react'
import Button from '../components/ui/Button'

const features = [
  { icon: Map, title: 'Personalized Roadmap', desc: 'Get a step-by-step learning path built just for you.' },
  { icon: TrendingUp, title: 'Skill Gap Analysis', desc: 'Know exactly what you need to learn and what to skip.' },
  { icon: Award, title: 'Career Insights', desc: 'Real salary data, top companies, and job market trends.' },
  { icon: Sparkles, title: 'AI-Powered', desc: 'Smart recommendations based on your goals and background.' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">CareerAI</span>
        </div>
        <Button onClick={() => navigate('/onboarding')}>Get Started →</Button>
      </nav>

      <main className="max-w-4xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
          <Sparkles size={14} /> AI-Powered Career Guidance
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Your Personalized<br />
          <span className="text-indigo-600">Career Roadmap</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Answer a few questions and get a complete, realistic learning roadmap tailored to your background, skills, and career goals.
        </p>
        <Button onClick={() => navigate('/onboarding')} className="text-base px-8 py-4">
          Build My Roadmap — It's Free →
        </Button>
        <p className="text-sm text-gray-400 mt-4">Takes less than 2 minutes</p>
      </main>

      <section className="max-w-5xl mx-auto px-8 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Icon size={20} className="text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm">{title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}