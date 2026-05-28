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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 font-sans text-slate-900 selection:bg-indigo-200 selection:text-indigo-900">
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Sparkles size={20} className="text-white" />
          </div>
          <span className="font-extrabold text-slate-900 text-xl tracking-tight">CareerAI</span>
        </div>
        <Button onClick={() => navigate('/onboarding')} variant="secondary">Get Started →</Button>
      </nav>

      <main className="max-w-4xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/80 text-indigo-700 px-5 py-2 rounded-full text-sm font-semibold mb-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300">
          <Sparkles size={14} /> AI-Powered Career Guidance
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-8 tracking-tight">
          Your Personalized<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Career Roadmap</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
          Answer a few questions and get a complete, realistic learning roadmap tailored to your background, skills, and career goals.
        </p>
        <Button onClick={() => navigate('/onboarding')} className="text-lg px-8 py-4 shadow-xl shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200">
          Build My Roadmap — It's Free →
        </Button>
        <p className="text-sm text-slate-500 mt-6 font-medium flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Takes less than 2 minutes
        </p>
      </main>

      <section className="max-w-5xl mx-auto px-8 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/80 shadow-[0_4px_24px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-12 h-12 bg-indigo-100/80 group-hover:bg-indigo-200 group-hover:scale-110 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300">
                <Icon size={24} className="text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-base">{title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}