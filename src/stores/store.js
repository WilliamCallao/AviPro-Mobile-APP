import { create } from 'zustand';

// Supongamos que tienes una función `fetchData` que obtiene los datos de un API o de otra fuente
const fetchData = async (collectionName) => {
  // Aquí iría el código para obtener los datos de tu nueva fuente, por ejemplo, una API REST
  // A continuación hay un ejemplo de datos estáticos para ilustración
  const data = {
    clientes: [
      { id: '1', Cuenta: '123', Nombre: 'Cliente 1' },
      { id: '2', Cuenta: '456', Nombre: 'Cliente 2' },
    ],
    notas_pendientes: [
      { id: '1', Cuenta: '123', Monto: 100 },
      { id: '2', Cuenta: '456', Monto: 200 },
    ],
    notas_cobradas: [
      { id: '1', cuenta: '123', Monto: 150 },
      { id: '2', cuenta: '456', Monto: 250 },
    ],
  };
  return data[collectionName] || [];
};

const useStore = create((set, get) => ({
  clientes: [],
  notasPendientes: [],
  clientesConNotas: [],
  pagosRealizados: [],

  subscribeToData: async () => {
    const clientes = await fetchData('clientes');
    const notasPendientes = await fetchData('notas_pendientes');
    const pagosRealizados = await fetchData('notas_cobradas');

    set({ clientes, notasPendientes, pagosRealizados });
    get().combinarClientesConNotas();
  },

  combinarClientesConNotas: () => {
    const { clientes, notasPendientes, pagosRealizados } = get();
    const mapaNotasPorCuenta = notasPendientes.reduce((acc, nota) => {
      const cuenta = nota.Cuenta?.trim();
      acc[cuenta] = acc[cuenta] || [];
      acc[cuenta].push(nota);
      return acc;
    }, {});

    const mapaPagados = pagosRealizados.reduce((acc, pago) => {
      const cuenta = pago.cuenta?.trim();
      acc[cuenta] = acc[cuenta] || [];
      acc[cuenta].push(pago);
      return acc;
    }, {});
    const clientesConNotas = clientes.map(cliente => {
      const cuentaCliente = cliente.Cuenta?.trim();
      return {
        ...cliente,
        NotasPendientes: mapaNotasPorCuenta[cuentaCliente] || [],
        PagosRealizados: mapaPagados[cuentaCliente] || [],
      };
    });

    set({ clientesConNotas });
  },

  updateNota: async (notaId, data) => {
    // Aquí iría el código para actualizar la nota en tu nueva base de datos o API
    console.log("Nota actualizada.", notaId);
  },

  agregarPago: async (pago) => {
    // Aquí iría el código para agregar el pago a tu nueva base de datos o API
    console.log("Pago agregado al estado.");
  },

  buscarClientePorCuenta: (numeroCuenta) => {
    const clientes = get().clientes;
    const clienteEncontrado = clientes.find(cliente => cliente.Cuenta?.trim() === numeroCuenta.trim());
    if (clienteEncontrado) {
      console.log("Cliente encontrado:", clienteEncontrado);
    } else {
      console.log("No se encontró un cliente con el número de cuenta:", numeroCuenta);
    }
    return clienteEncontrado;
  }

}));

export default useStore;
