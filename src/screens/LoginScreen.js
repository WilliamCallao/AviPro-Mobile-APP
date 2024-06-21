import React, { useState, useEffect } from "react";
import { SafeAreaView, View, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import StyledText from "../utils/StyledText";
import userStore from "../stores/userStore";
import SimpleButton from "../utils/SimpleButton";
import { theme } from "../assets/Theme";
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LoginScreen = () => {
  const [info, setInfo] = useState({
    email: "",
    nombre: "",
  });
  const [message, setMessage] = useState(false);
  const [empresaId, setEmpresaId] = useState("");
  const { user, setUserId, setName, setId } = userStore(state => ({
    user: state.user,
    setUserId: state.setUserId,
    setName: state.setName,
    setId: state.setId,
  }));

  useEffect(() => {
    const fetchEmpresaId = async () => {
      try {
        const savedEmpresaId = await AsyncStorage.getItem('@empresa_id');
        if (savedEmpresaId !== null) {
          setEmpresaId(savedEmpresaId);
        }
      } catch (e) {
        console.error('Error retrieving empresa_id', e);
      }
    };

    fetchEmpresaId();
  }, []);

  const handleSend = () => {
    if (info.email.length === 0 || info.nombre.length === 0) {
      alert("Por favor llene todos los campos");
      return;
    }
    if (!info.email.match("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")) {
      setMessage(true);
      return;
    }
    setMessage(false);

    // Aquí puedes manejar la lógica de navegación o cualquier otra cosa que necesites hacer
    // cuando se presione el botón continuar
    navigation.replace("NewScreen");
  };

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View>
            <StyledText boldCenterText style={styles.title}>Informasción Personal</StyledText>
            <StyledText boldText style={styles.subtitle}>Nombre</StyledText>
            <TextInput
              placeholder="Nombre"
              style={styles.label}
              onChangeText={name => {
                if (name.length <= 30 && name.match("^[a-zA-Z ]*$")) {
                  setInfo({ ...info, nombre: name });
                }
              }}
              value={info.nombre}
              keyboardType="default"
            />

            <StyledText boldText style={styles.subtitle}>Correo Electronico</StyledText>
            <TextInput
              placeholder="Correo Electronico"
              style={styles.label}
              onChangeText={item => {
                setInfo({ ...info, email: item });
              }}
              value={info.email}
              keyboardType="email-address"
            />
            {message && <StyledText regularText style={styles.errorFormat}>Por favor ingrese un correo válido</StyledText>}
            <SimpleButton text="Continuar" onPress={handleSend} width={styles.button.width} />
          </View>
          {empresaId ? (
            <StyledText style={styles.empresaIdText}>
              ID de Empresa: {empresaId}
            </StyledText>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9DBBE2',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
  },
  label: {
    backgroundColor: 'white',
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
  },
  softText: {
    color: theme.colors.gray,
    fontSize: 13,
    marginVertical: 10,
  },
  errorFormat: {
    color: 'red',
    fontSize: 13,
    marginTop: -8,
  },
  button: {
    backgroundColor: theme.colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
    marginTop: 15,
  },
  continueButton: {
    color: theme.colors.primary,
    fontSize: 19,
  },
  empresaIdText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: theme.colors.primary,
  },
});

export default LoginScreen;
