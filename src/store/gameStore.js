import { create } from 'zustand';

export const useGameStore = create((set) => ({
  score: 0,
  targetLocked: null,
  isScrolled: false,
  
  settings: {
    bloom: true,
    sparkles: true,
    grid: true,
    sun: true,
  },

  addScore: () => set((state) => ({ score: state.score + 100 })),
  setTarget: (id) => set({ targetLocked: id }),
  setScrolled: (status) => set({ isScrolled: status }),
  
  toggleSetting: (key) => set((state) => ({
    settings: { ...state.settings, [key]: !state.settings[key] }
  })),
}));