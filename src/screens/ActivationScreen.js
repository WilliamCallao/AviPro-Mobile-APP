import React, { useState } from "react";
import { Image, StyleSheet, View, TextInput, Dimensions, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import userStore from "../stores/userStore";
import StyledText from "../utils/StyledText";
import SimpleButton from "../utils/SimpleButton";
import axios from 'axios';
import { BASE_URL } from "../../config";
import { theme } from "../assets/Theme";

const windowWidth = Dimensions.get('window').width;
const aspectRatio = 5285 / 5315;

const ActivationScreen = () => {
  const [activationCode, setActivationCode] = useState("");
  const [message, setMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activationSuccess, setActivationSuccess] = useState(false);

  const { setEmpresa, setUser } = userStore(state => ({
    setEmpresa: state.setEmpresa,
    setUser: state.setUser
  }));

  const handleActivate = async () => {
    if (activationCode.length === 0) {
      Alert.alert("Error", "Por favor, ingrese un código de activación.");
      return;
    }

    setLoading(true);

    // Garantizar que la animación de carga se muestre durante al menos 2 segundos
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));

    try {
      await Promise.all([
        axios.put(`${BASE_URL}/api/mobile/dispositivos/estado/usado/${activationCode}`),
        minLoadingTime
      ]);

      setMessage(false);
      setActivationSuccess(true);
      setEmpresa("EmpresaAsignada"); // Asigna la empresa de manera adecuada según tu lógica de negocio
    } catch (e) {
      setMessage(true);
      Alert.alert("Error", "El código de activación es incorrecto. Por favor, verifique e intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaludo = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/saludo`);
      Alert.alert("Saludo", response.data.message);
    } catch (e) {
      Alert.alert("Error", "No se pudo obtener el saludo.");
    }
  };

  const navigation = useNavigation();

  const handleContinue = () => {
    navigation.replace("LoginScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.containerImgs}>
            <Image source={require('../assets/formas.png')} style={{ width: windowWidth * 0.75, height: windowWidth * 0.75 * aspectRatio }} />
          </View>
          <View style={styles.innerContainer}>
            <StyledText style={styles.title}>Avi Pro Mobile</StyledText>
            {!activationSuccess ? (
              <>
                <StyledText style={styles.subtitle}>Ingrese su código de activación</StyledText>
                <TextInput
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  style={styles.label}
                  onChange={(code) => { setActivationCode(code.nativeEvent.text) }}
                  value={activationCode}
                  keyboardType="default"
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
                {message && <StyledText style={styles.errorFormat}>El código de activación es incorrecto.</StyledText>}
                {loading ? (
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                ) : (
                  <>
                    <SimpleButton text="Activar" onPress={handleActivate} width={styles.button.width} />
                    <SimpleButton text="Obtener Saludo" onPress={handleSaludo} width={styles.button.width} />
                  </>
                )}
                <StyledText style={styles.softText}>Si no tiene un código de activación, por favor contacte a nuestro equipo de ventas para adquirir una licencia.</StyledText>
              </>
            ) : (
              <>
                <StyledText style={styles.successFormat}>La aplicación fue activada correctamente.</StyledText>
                <StyledText style={styles.softText}>Al continuar, acepta todos los términos, condiciones y políticas de privacidad.</StyledText>
                <SimpleButton text="Continuar" onPress={handleContinue} width={styles.button.width} />
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9DBBE2',
  },
  keyboardAvoidingView: {
    flex: 1,
    paddingBottom: 30,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  containerImgs: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 80,
    paddingBottom: 10,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    backgroundColor: 'white',
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    fontSize: 15,
    textAlign: 'center',
    letterSpacing: 4,
  },
  softText: {
    color: theme.colors.gray,
    fontSize: 15,
    marginVertical: 18,
    textAlign: 'center',
  },
  errorFormat: {
    color: 'red',
    fontSize: 13,
    marginTop: -8,
    textAlign: 'center',
  },
  successFormat: {
    color: 'green',
    fontSize: 20,
    marginTop: 20,
    textAlign: 'center',
    marginHorizontal:40,
  },
  button: {
    backgroundColor: theme.colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
    marginVertical: 15,
  },
  continueButton: {
    color: theme.colors.primary,
    fontSize: 19,
    fontWeight: 'bold',
  },
});

export default ActivationScreen;
