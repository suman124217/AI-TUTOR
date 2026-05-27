import { useNavigate } from 'react-router-dom'
import useCareerStore from '../store/careerStore'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { RotateCcw, CheckCircle, BookOpen, Briefcase, Award, TrendingUp, Wrench } from 'lucide-react'

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Icon size={18} className="text-indigo-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  )
}

export default function RoadmapPage() {
  const navigate = useNavigate()
  const { roadmapData, userProfile, reset } = useCareerStore()

  if (!roadmapData) return null

  const { analysis, roadmap, projects, certifications, tools, resources, careerInsights, studyPlan } = roadmapData

  const handleReset = () => { reset(); navigate('/onboarding') }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white px-6 py-10 text-center">
        <p className="text-indigo-200 text-sm mb-2">Your personalized roadmap</p>
        <h1 className="text-3xl font-extrabold mb-2">
          Road to {userProfile.targetRole} 🚀
        </h1>
        <p className="text-indigo-200 text-sm">Estimated timeline: {analysis?.timelineEstimate}</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Profile Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-wrap gap-3">
          <Badge color="indigo">{userProfile.background}</Badge>
          <Badge color="purple">{userProfile.fieldOfInterest}</Badge>
          <Badge color="green">{userProfile.dailyTime}</Badge>
          <Badge color="amber">{userProfile.careerGoal}</Badge>
          {userProfile.skills.slice(0, 4).map(s => <Badge key={s} color="gray">{s}</Badge>)}
        </div>

        {/* Analysis */}
        {analysis && (
          <Section icon={TrendingUp} title="Profile Analysis">
            {/* Difficulty */}
            {analysis.difficultyScore !== undefined && (
              <div className="mb-5">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-gray-700">Difficulty Score</span>
                  <span className="text-indigo-600 font-bold">{analysis.difficultyScore}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${analysis.difficultyScore}%` }} />
                </div>
              </div>
            )}

            {/* Skill Gap */}
            {analysis.skillGap && (
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: '✅ Strong', items: analysis.skillGap.strong, color: 'green' },
                  { label: '⚠️ Weak', items: analysis.skillGap.weak, color: 'amber' },
                  { label: '❌ Missing', items: analysis.skillGap.missing, color: 'rose' },
                ].map(({ label, items, color }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-bold text-gray-500 mb-2">{label}</p>
                    {items?.map(i => <p key={i} className="text-xs text-gray-700 mb-1">• {i}</p>)}
                  </div>
                ))}
              </div>
            )}

            {/* SWOT */}
            {analysis.swot && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Strengths 💪', items: analysis.swot.strengths, bg: 'bg-green-50 border-green-100' },
                  { label: 'Weaknesses 🔧', items: analysis.swot.weaknesses, bg: 'bg-amber-50 border-amber-100' },
                  { label: 'Opportunities 🚀', items: analysis.swot.opportunities, bg: 'bg-indigo-50 border-indigo-100' },
                  { label: 'Threats ⚠️', items: analysis.swot.threats, bg: 'bg-rose-50 border-rose-100' },
                ].map(({ label, items, bg }) => (
                  <div key={label} className={`${bg} border rounded-xl p-3`}>
                    <p className="text-xs font-bold text-gray-700 mb-2">{label}</p>
                    {items?.map(i => <p key={i} className="text-xs text-gray-600 mb-1">• {i}</p>)}
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

        {/* Roadmap */}
        {roadmap && (
          <Section icon={BookOpen} title="Learning Roadmap">
            {[
              { key: 'beginner', label: '🟢 Beginner', color: 'bg-green-100 text-green-700' },
              { key: 'intermediate', label: '🟡 Intermediate', color: 'bg-amber-100 text-amber-700' },
              { key: 'advanced', label: '🔴 Advanced', color: 'bg-rose-100 text-rose-700' },
            ].map(({ key, label, color }) => roadmap[key]?.length > 0 && (
              <div key={key} className="mb-5">
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${color}`}>{label}</span>
                <div className="flex flex-wrap gap-2">
                  {roadmap[key].map(item => (
                    <span key={item} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <Section icon={CheckCircle} title="Projects to Build">
            <div className="space-y-3">
              {projects.map((p, i) => (
                <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{p.title || p}</p>
                    {p.description && <p className="text-xs text-gray-500 mt-0.5">{p.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Certifications */}
        {certifications && (
          <Section icon={Award} title="Certifications">
            {['free', 'paid'].map(type => certifications[type]?.length > 0 && (
              <div key={type} className="mb-4">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">{type === 'free' ? '🆓 Free' : '💳 Paid'}</p>
                <div className="space-y-2">
                  {certifications[type].map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                      <Award size={14} className="text-indigo-500 flex-shrink-0" /> {c.name || c}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* Tools */}
        {tools?.length > 0 && (
          <Section icon={Wrench} title="Tools & Technologies">
            <div className="flex flex-wrap gap-2">
              {tools.map((t, i) => (
                <span key={i} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700">{t.name || t}</span>
              ))}
            </div>
          </Section>
        )}

        {/* Career Insights */}
        {careerInsights && (
          <Section icon={Briefcase} title="Career Insights">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Market Demand', value: careerInsights.marketDemand },
                { label: 'Future Scope', value: careerInsights.futureScope },
                { label: 'Entry-Level Salary', value: careerInsights.salaryEntry },
                { label: 'Mid-Level Salary', value: careerInsights.salaryMid },
              ].map(({ label, value }) => value && (
                <div key={label} className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  <p className="font-bold text-gray-900 text-sm">{value}</p>
                </div>
              ))}
            </div>
            {careerInsights.companies?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold text-gray-500 mb-2">TOP COMPANIES HIRING</p>
                <div className="flex flex-wrap gap-2">
                  {careerInsights.companies.map(c => <Badge key={c} color="indigo">{c}</Badge>)}
                </div>
              </div>
            )}
          </Section>
        )}

        {/* Reset */}
        <div className="text-center pt-4">
          <Button variant="secondary" onClick={handleReset}>
            <RotateCcw size={16} /> Start Over
          </Button>
        </div>
      </div>
    </div>
  )
}