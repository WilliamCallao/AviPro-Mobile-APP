// ActivationScreen.js
import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import userStore from "../../stores/userStore";
import StyledText from "../../utils/StyledText";
import SimpleButton from "../../utils/SimpleButton";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { theme } from "../../assets/Theme";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from "expo-status-bar";

const windowWidth = Dimensions.get("window").width;
const aspectRatio = 5285 / 5315;

const ActivationScreen = () => {
  const [activationCode, setActivationCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activationSuccess, setActivationSuccess] = useState(false);
  const [empresaId, setEmpresaId] = useState("");
  const [empresaNombre, setEmpresaNombre] = useState("");

  const { setEmpresa } = userStore((state) => ({
    setEmpresa: state.setEmpresa,
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

  const handleActivate = async () => {
    if (activationCode.length === 0) {
      Alert.alert("Error", "Por favor, ingrese un código de activación.");
      return;
    }

    setLoading(true);
    setMessage("");

    const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const [response] = await Promise.all([
        axios.put(
          `${BASE_URL}/api/mobile/dispositivos/estado/usado/${activationCode}`
        ),
        minLoadingTime,
      ]);

      const { message, dispositivo } = response.data;

      if (message === "El código fue activado correctamente") {
        await axios.put(
          `${BASE_URL}/api/mobile/dispositivos/ultimo_uso/${activationCode}`
        );
        setMessage("El código fue activado correctamente.");
        setActivationSuccess(true);
        setEmpresa("EmpresaAsignada");
        await AsyncStorage.setItem('@empresa_id', dispositivo.empresa_id);
        await AsyncStorage.setItem('@codigo_activacion', activationCode);
        console.log("codigo registrado:",activationCode);
        setEmpresaId(dispositivo.empresa_id);

        const empresaResponse = await axios.get(
          `${BASE_URL}/api/mobile/empresas/${dispositivo.empresa_id}/nombre`
        );
        const empresaData = empresaResponse.data;
        setEmpresaNombre(empresaData.nombre);
        await AsyncStorage.setItem('@empresa_nombre', empresaData.nombre);
        console.log("Empresa nombre:", empresaData.nombre);

      } else if (message === "El código ya fue usado") {
        setMessage("El código ya fue usado.");
      } else if (message === "El código ya no es válido") {
        setMessage("El código ya no es válido.");
      } else {
        setMessage("Error desconocido.");
      }
    } catch (e) {
      setMessage("Error al activar el código. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaludo = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/saludo`);
      console.log("response", response.data);
      Alert.alert("Saludo", "Recibido: " + response.data);
    } catch (e) {
      Alert.alert("Error", "No se pudo obtener el saludo.");
      console.error("Error fetching public API:", e);
    }
  };

  const navigation = useNavigation();

  const handleContinue = () => {
    navigation.replace("CobradoresScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor={theme.colors.secondary} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.containerImgs}>
            <Image
              source={require("../../assets/formas.png")}
              style={{
                width: windowWidth * 0.75,
                height: windowWidth * 0.75 * aspectRatio,
              }}
            />
          </View>
          <View style={styles.innerContainer}>
            <StyledText style={styles.title}>Avi Pro Mobile</StyledText>
            {!activationSuccess ? (
              <>
                <StyledText style={styles.subtitle}>
                  Ingrese su código de activación
                </StyledText>
                <TextInput
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  style={styles.label}
                  onChange={(code) => {
                    setActivationCode(code.nativeEvent.text);
                  }}
                  value={activationCode}
                  keyboardType="default"
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
                {/* {empresaId ? (
                  <StyledText style={styles.lastCodeText}>
                    Último ID de empresa: {empresaId}
                  </StyledText>
                ) : null} */}
                {message && (
                  <StyledText style={styles.errorFormat}>{message}</StyledText>
                )}
                {loading ? (
                  <ActivityIndicator
                    size="large"
                    color={theme.colors.primary}
                  />
                ) : (
                  <>
                    <SimpleButton
                      text="Activar"
                      onPress={handleActivate}
                      width={styles.button.width}
                    />
                    {/* <SimpleButton
                      text="Obtener Saludo"
                      onPress={handleSaludo}
                      width={styles.button.width}
                    /> */}
                  </>
                )}
                <StyledText style={styles.softText}>
                  Si no tiene un código de activación, por favor contacte a
                  nuestro equipo de ventas para adquirir una licencia.
                </StyledText>
              </>
            ) : (
              <>
                <StyledText style={styles.successFormat}>{message}</StyledText>
                <StyledText style={styles.softText}>
                  Al continuar, acepta todos los términos, condiciones y
                  políticas de privacidad.
                </StyledText>
                {activationSuccess && (
                  <SimpleButton
                    text="Continuar"
                    onPress={handleContinue}
                    width={styles.button.width}
                  />
                )}
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
    backgroundColor: "#9DBBE2",
  },
  keyboardAvoidingView: {
    flex: 1,
    paddingBottom: 30,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  containerImgs: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
    paddingBottom: 10,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    backgroundColor: "white",
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    fontSize: 15,
    textAlign: "center",
    letterSpacing: 4,
  },
  lastCodeText: {
    fontSize: 14,
    color: theme.colors.gray,
    textAlign: "center",
    marginBottom: 10,
  },
  softText: {
    color: theme.colors.gray,
    fontSize: 15,
    marginVertical: 18,
    textAlign: "center",
  },
  errorFormat: {
    color: "red",
    fontSize: 15,
    marginTop: -8,
    textAlign: "center",
    marginBottom: 20,
  },
  successFormat: {
    color: "green",
    fontSize: 20,
    marginTop: 20,
    textAlign: "center",
    marginHorizontal: 40,
  },
  button: {
    backgroundColor: theme.colors.tertiary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 10,
    marginVertical: 15,
  },
  continueButton: {
    color: theme.colors.primary,
    fontSize: 19,
    fontWeight: "bold",
  },
});

export default ActivationScreen;
