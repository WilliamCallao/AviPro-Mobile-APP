import React, { useState } from "react";
import { Image, StyleSheet, View, TextInput, Dimensions, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
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
  const [activationSuccess, setActivationSuccess] = useState(false);

  const { setEmpresa, setUser } = userStore(state => ({
    setEmpresa: state.setEmpresa,
    setUser: state.setUser
  }));

  const handleActivate = async () => {
    if (activationCode.length === 0) {
      Alert.alert("Error", "Por favor llene todos los campos");
      return;
    }

    try {
      await axios.put(`${BASE_URL}/api/mobile/dispositivos/estado/usado/${activationCode}`);
      
      setMessage(false);
      setActivationSuccess(true);
      setEmpresa("EmpresaAsignada"); // Asigna la empresa de manera adecuada según tu lógica de negocio
    } catch (e) {
      setMessage(true);
      Alert.alert("Error", "La clave de activación es incorrecta");
    }
  };

  const navigation = useNavigation();

  const handleContinue = () => {
    navigation.replace("LoginScreen");
  };

  const handleSkip = () => {
    setUser({
      idDoc: "generic_id",
      nombre: "Generic User",
      empresa_id: "generic_empresa"
    });
    navigation.navigate("NewScreen");
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
          <View>
            <StyledText style={styles.title}>Avi Pro Mobile</StyledText>
            {!activationSuccess ? (
              <>
                <StyledText style={styles.subtitle}>Clave de activación</StyledText>
                <TextInput
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  style={styles.label}
                  onChange={(code) => { setActivationCode(code.nativeEvent.text) }}
                  value={activationCode}
                  keyboardType="default"
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
                {message && <StyledText style={styles.errorFormat}>La clave de activación es incorrecta</StyledText>}
                <StyledText style={styles.softText}>Al continuar acepta todos los términos, condiciones y políticas de privacidad.</StyledText>
                <SimpleButton text="Activar Aplicación" onPress={handleActivate} width={styles.button.width} />
              </>
            ) : (
              <>
                <StyledText style={styles.successFormat}>👍 La aplicación fue activada correctamente</StyledText>
                <SimpleButton text="Continuar" onPress={handleContinue} width={styles.button.width} />
              </>
            )}
            <StyledText style={styles.softText}>Si desea adquirir una licencia del producto por favor comuníquese con nuestro equipo de ventas.</StyledText>
            <SimpleButton text="Saltar" onPress={handleSkip} width={styles.button.width} />
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
    padding: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  containerImgs: {
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth * 0.9,
    marginTop: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 5,
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
    fontSize: 13,
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
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
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
