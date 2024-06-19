import { create } from 'zustand';

const PaymentStore = create((set) => ({
  // Estados y métodos existentes
  pagosRealizados: [],
  agregarPago: (nuevoPago) => set((state) => ({
    pagosRealizados: [...state.pagosRealizados, nuevoPago]
  })),
  eliminarPago: (numeroNota) => set((state) => ({
    pagosRealizados: state.pagosRealizados.filter(pago => pago.numeroNota !== numeroNota),
  })),
  borrarPagos: () => set(() => ({
    pagosRealizados: []
  })),

  // Estado actualizado para las facturas
  facturaActual: {
    nombreEmpresa: "NOMBRE EMPRESA",
    comprobanteDePago: "Comprobante de Pago",
    cliente: {
      nombre: "none",
      numeroCuenta: "none"
    },
    metodoPago: "none",
    notasPagadas: []
  },

  establecerCliente: (nombre, numeroCuenta) => set((state) => ({
    facturaActual: {
      ...state.facturaActual,
      cliente: {
        nombre,
        numeroCuenta
      }
    }
  })),
  establecerMetodoPago: (metodoPago) => set((state) => ({
    facturaActual: {
      ...state.facturaActual,
      metodoPago
    }
  })),
  agregarNotaPagada: (notaPagada) => set((state) => ({
    facturaActual: {
      ...state.facturaActual,
      notasPagadas: [...state.facturaActual.notasPagadas, notaPagada]
    }
  })),
  eliminarNotaPagada: (numeroNota) => set((state) => ({
    facturaActual: {
      ...state.facturaActual,
      notasPagadas: state.facturaActual.notasPagadas.filter(nota => 
        nota.detalles.some(detalle => detalle.numeroNota !== numeroNota)
      )
    }
  })),
  limpiarFactura: () => set((state) => ({
    facturaActual: {
      ...state.facturaActual,
      cliente: {
        nombre: '',
        numeroCuenta: ''
      },
      metodoPago: '',
      notasPagadas: []
    }
  }))
}));

export default PaymentStore;

