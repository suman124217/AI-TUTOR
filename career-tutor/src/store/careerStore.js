import { create } from 'zustand'

const useCareerStore = create((set) => ({
  userProfile: {
    targetRole: '',
    background: '',
    currentRole: '',
    skills: [],
    dailyTime: '',
    careerGoal: '',
    fieldOfInterest: '',
    priorExperience: false,
  },
  roadmapData: null,
  isLoading: false,
  error: null,

  setUserProfile: (data) =>
    set((state) => ({ userProfile: { ...state.userProfile, ...data } })),

  setRoadmapData: (data) => set({ roadmapData: data }),
  setLoading: (val) => set({ isLoading: val }),
  setError: (msg) => set({ error: msg }),
  reset: () => set({ roadmapData: null, error: null }),
}))

export default useCareerStore