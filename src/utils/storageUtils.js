// utils/storageUtils.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getStoredValues = async () => {
  try {
    const empresaId = await AsyncStorage.getItem('@empresa_id');
    const codigoActivacion = await AsyncStorage.getItem('@codigo_activacion');
    const cobradorId = await AsyncStorage.getItem('@cobrador_id');

    return {
      empresaId,
      codigoActivacion,
      cobradorId
    };
  } catch (error) {
    console.error('Error reading values from AsyncStorage', error);
    return null;
  }
};