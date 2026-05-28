import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import StepProgress from '../components/form/StepProgress'
import StepOne from '../components/form/StepOne'
import StepTwo from '../components/form/StepTwo'
import StepThree from '../components/form/StepThree'
import StepFour from '../components/form/StepFour'
import useCareerStore from '../store/careerStore'
import { generateRoadmap } from '../api/careerApi'

const TOTAL_STEPS = 4

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const { userProfile, setUserProfile, setRoadmapData, setLoading, setError, isLoading } = useCareerStore()

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS))
  const back = () => setStep(s => Math.max(s - 1, 1))

  const handleSubmit = async (lastStepData) => {
    const finalProfile = { ...userProfile, ...lastStepData }
    setUserProfile(finalProfile)   // ✅ fixed: was setUserProfile(lastStepData)
    setLoading(true)
    setError(null)
    try {
      const res = await generateRoadmap(finalProfile)
      setRoadmapData(res.data)
      navigate('/roadmap')
    } catch (err) {                // ✅ fixed: removed the extra } before catch
      console.error('Roadmap generation failed:', err)
      setError('Something went wrong. Please try again.')
      alert('Failed to generate roadmap. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const stepProps = { data: userProfile, onChange: setUserProfile, onNext: next, onBack: back }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center px-4 py-12 font-sans selection:bg-indigo-200 selection:text-indigo-900 text-slate-900">
      <div className="w-full max-w-xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-indigo-600 font-extrabold text-2xl mb-2 tracking-tight">
            <Sparkles size={24} /> CareerAI
          </div>
          <p className="text-slate-600 text-base font-medium">Building your personalized roadmap</p>
        </div>

        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_32px_rgb(0,0,0,0.04)] border border-white/80 p-8 sm:p-10 hover:shadow-[0_12px_48px_rgb(0,0,0,0.08)] transition-shadow duration-500">
          <StepProgress currentStep={step} totalSteps={TOTAL_STEPS} />

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {step === 1 && <StepOne {...stepProps} />}
              {step === 2 && <StepTwo {...stepProps} />}
              {step === 3 && <StepThree {...stepProps} />}
              {step === 4 && <StepFour {...stepProps} onSubmit={handleSubmit} isLoading={isLoading} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}