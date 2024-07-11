import { create } from 'zustand';

const useNotasCobradasStore = create((set, get) => ({
  notasCobradas: [],
  clienteActual: null,

  addNotaCobrada: (nota) => {
    const { clienteActual } = get();
    if (clienteActual && clienteActual !== nota.cuenta) {
      set({ notasCobradas: [], clienteActual: nota.cuenta });
    }
    set((state) => ({
      notasCobradas: [...state.notasCobradas, nota],
      clienteActual: nota.cuenta,
    }));
  },

  removeNotaCobrada: (notaId) => set((state) => ({
    notasCobradas: state.notasCobradas.filter((nota) => nota.pago_a_nota !== notaId)
  })),

  editNotaCobrada: (notaEditada) => {
    const { notasCobradas } = get();
    // console.log('Current notasCobradas:', JSON.stringify(notasCobradas, null, 2));
    // console.log('Incoming notaEditada:', JSON.stringify(notaEditada, null, 2));

    const notasActualizadas = notasCobradas.map((nota) => {
      if (nota.pago_a_nota === notaEditada.pago_a_nota) {
        return {
          ...notaEditada,
          monto: parseFloat(notaEditada.monto) // Convertir monto a número
        };
      }
      return nota;
    });

    console.log('Updated notasCobradas:', JSON.stringify(notasActualizadas, null, 2));

    set({ notasCobradas: notasActualizadas });
  },

  clearNotasCobradas: () => set({ notasCobradas: [], clienteActual: null })
}));

export default useNotasCobradasStore;
