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
    setUserProfile(lastStepData)
    setLoading(true)
    setError(null)
    try {
      const res = await generateRoadmap(finalProfile)
      setRoadmapData(res.data)
      navigate('/roadmap')
    } catch (err) {
      setError('Something went wrong. Please try again.')
      alert('Failed to generate roadmap. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const stepProps = { data: userProfile, onChange: setUserProfile, onNext: next, onBack: back }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-lg mb-1">
            <Sparkles size={20} /> CareerAI
          </div>
          <p className="text-gray-500 text-sm">Building your personalized roadmap</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
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