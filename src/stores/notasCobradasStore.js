import {create} from 'zustand';

const useNotasCobradasStore = create((set) => ({
  notasCobradas: [],
  addNotaCobrada: (nota) => set((state) => ({
    notasCobradas: [...state.notasCobradas, nota]
  })),
  removeNotaCobrada: (index) => set((state) => ({
    notasCobradas: state.notasCobradas.filter((_, i) => i !== index)
  })),
  clearNotasCobradas: () => set({ notasCobradas: [] })
}));

export default useNotasCobradasStore;
