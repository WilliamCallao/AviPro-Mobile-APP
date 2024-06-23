import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { BASE_URL } from "../../../config";
import { theme } from "../../assets/Theme";

const CobradoresScreen = () => {
  const [empresaId, setEmpresaId] = useState(null);
  const [empresaNombre, setEmpresaNombre] = useState('');
  const [cobradores, setCobradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEmpresaId = async () => {
      try {
        const id = await AsyncStorage.getItem('@empresa_id');
        const nombre = await AsyncStorage.getItem('@empresa_nombre');
        setEmpresaId(id);
        setEmpresaNombre(nombre);
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
      <StatusBar style="dark" backgroundColor={theme.colors.dark} />
      <View style={styles.header}>
        <Text style={styles.title}>Información Personal</Text>
      </View>
      <View style={styles.content}>
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
                <View style={styles.itemTextContainer}>
                  <Text style={styles.empresaText}>{empresaNombre}</Text>
                  <Text style={styles.itemText}>{item.nombre}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              <TouchableOpacity style={styles.item} onPress={() => handleSelectCobrador(null)}>
                <View style={styles.iconWraped}>
                  <Text style={styles.initial}>O</Text>
                </View>
                <View style={styles.itemTextContainer}>
                  <Text style={styles.empresaText}>{empresaNombre}</Text>
                  <Text style={styles.itemText}>Otro</Text>
                </View>
              </TouchableOpacity>
            }
          />
        )}
        <Text style={styles.footerText}>
          Puede cambiar esta configuración más tarde en la sección de perfil.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
  },
  header: {
    marginTop: 50,
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primaryText,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: theme.colors.skyBlue,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  empresaText: {
    fontSize: 14,
    color: theme.colors.gray,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primaryText,
    flexWrap: 'wrap',
  },
  iconWraped: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.tertiary,
    borderRadius: 10,
    width: 50,
    height: 50, 
  },
  initial: {
    fontSize: 24,
    color: "white",
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.primaryText,
    textAlign: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.gray,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});

export default CobradoresScreen;
