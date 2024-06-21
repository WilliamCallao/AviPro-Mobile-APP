import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { BASE_URL } from "../../config";
import { theme } from "../assets/Theme";

const CobradoresScreen = () => {
  const [empresaId, setEmpresaId] = useState(null);
  const [cobradores, setCobradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEmpresaId = async () => {
      try {
        const id = await AsyncStorage.getItem('@empresa_id');
        setEmpresaId(id);
        if (id) {
          fetchCobradores(id);
        } else {
          Alert.alert('Error', 'No se pudo obtener el ID de la empresa.');
        }
      } catch (error) {
        Alert.alert('Error', 'Ocurrió un error al obtener el ID de la empresa.');
      }
    };
    fetchEmpresaId();
  }, []);

  const fetchCobradores = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/mobile/cobradores/${id}`);
      const data = await response.json();
      setCobradores(data);
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al obtener la lista de cobradores.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCobrador = async (cobrador) => {
    console.log(cobrador);
    try {
      await AsyncStorage.setItem('@cobrador_id', cobrador ? cobrador.cobrador_id : '');
      await AsyncStorage.setItem('@cobrador_nombre', cobrador ? cobrador.nombre : '');

      // Leer los datos guardados y hacer un log para verificación
      const idEmpresa = await AsyncStorage.getItem('@empresa_id');
      const savedCobradorId = await AsyncStorage.getItem('@cobrador_id');
      const savedCobradorNombre = await AsyncStorage.getItem('@cobrador_nombre');
      console.log('Empresa ID guardado:', idEmpresa);
      console.log('Cobrador ID guardado:', savedCobradorId);
      console.log('Cobrador Nombre guardado:', savedCobradorNombre);
      navigation.navigate('NewScreen'); // Reemplaza 'NewScreen' con el nombre de la pantalla a la que deseas navegar.
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al guardar la información del cobrador.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={theme.colors.dark} />
      <View style={styles.header}>
        <Text style={styles.label}>ID Empresa: {empresaId}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.instruction}>Seleccione su nombre de la lista:</Text>
        {loading ? (
          <Text style={styles.loadingText}>Cargando...</Text>
        ) : (
          <FlatList
            data={cobradores}
            keyExtractor={(item) => item.cobrador_id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => handleSelectCobrador(item)}>
                <View style={styles.iconWraped}>
                  <Text style={styles.initial}>{item.nombre.charAt(0)}</Text>
                </View>
                <Text style={styles.itemText}>{item.nombre}</Text>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              <TouchableOpacity style={styles.item} onPress={() => handleSelectCobrador(null)}>
                <View style={styles.iconWraped}>
                  <Text style={styles.initial}>O</Text>
                </View>
                <Text style={styles.itemText}>Otro</Text>
              </TouchableOpacity>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: theme.colors.secondary,
    backgroundColor: 'orange',
  },
  header: {
    backgroundColor: theme.colors.dark,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  instruction: {
    fontSize: 16,
    color: theme.colors.primaryText,
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: theme.colors.skyBlue,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 18,
    color: theme.colors.primaryText,
    marginLeft: 10,
  },
  iconWraped: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.tertiary,
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  initial: {
    fontSize: 20,
    color: theme.colors.white,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.primaryText,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CobradoresScreen;
