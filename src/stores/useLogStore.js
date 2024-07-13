// src/stores/useLogStore.js
import create from 'zustand';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config';
const useLogStore = create((set, get) => ({
  logsQueue: [],
  empresaId: '',
  codigoActivacion: '',
  cobradorId: '',
  isProcessing: false,
  
  initialize: async () => {
    try {
      const [empresaId, codigoActivacion, cobradorId] = await Promise.all([
        AsyncStorage.getItem('@empresa_id'),
        AsyncStorage.getItem('@codigo_activacion'),
        AsyncStorage.getItem('@cobrador_id')
      ]);

      set({
        empresaId,
        codigoActivacion,
        cobradorId
      });
    } catch (error) {
      console.error('Error reading values from AsyncStorage', error);
    }
  },
  
  addToQueue: (success, detalle) => {
    const { logsQueue } = get();
    const newLog = { success, detalle };
    set({ logsQueue: [...logsQueue, newLog] });
    get().processQueue();
  },
  
  processQueue: async () => {
    const { logsQueue, isProcessing, empresaId, codigoActivacion, cobradorId } = get();
    
    if (isProcessing || logsQueue.length === 0) {
      return;
    }
    
    set({ isProcessing: true });
    
    while (logsQueue.length > 0) {
      const currentLog = logsQueue.shift();
      const logData = {
        codigo_id: codigoActivacion,
        empresa_id: empresaId,
        cobrador_id: cobradorId,
        success: currentLog.success,
        detalle: currentLog.detalle
      };

      try {
        const response = await axios.post(`${BASE_URL}/api/mobile/logs`, logData);
        console.log('Log added successfully:', response.data);
      } catch (error) {
        console.error('Error adding log:', error);
        logsQueue.unshift(currentLog); // Reinsertar al inicio si falla
        break;
      }
    }
    
    set({ isProcessing: false });
  }
}));

export default useLogStore;
