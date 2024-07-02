// ProfileHeader.js
import React, { useCallback, useState, useEffect } from "react";
import { TouchableOpacity, View, StyleSheet, Dimensions, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { theme } from "../../assets/Theme";
import StyledText from "../../utils/StyledText";
import Cascading from "../../animation/CascadingFadeInView";
import { BASE_URL } from "../../../config";

const screenWidth = Dimensions.get('window').width;
const isCobranzaEnabled = true;
const isPedidosEnabled = false;
const isVentasEnabled = false;

const ProfileHeader = () => {
  const navigation = useNavigation();
  const [animationKey, setAnimationKey] = useState(Date.now());
  const [userName, setUserName] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useFocusEffect(
    useCallback(() => {
      setAnimationKey(Date.now());
      const fetchUserName = async () => {
        try {
          const name = await AsyncStorage.getItem('@cobrador_nombre');
          if (name) {
            setUserName(name);
          } else {
            setUserName('Usuario');
          }
        } catch (error) {
          Alert.alert('Error', 'Ocurrió un error al obtener el nombre del usuario.');
        }
      };

      fetchUserName();

      // Obtener la fecha actual
      const date = new Date();
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      setCurrentDate(formattedDate);

      // Verificar y actualizar el estado del código en segundo plano
      const checkAndUpdateCodeStatus = async () => {
        try {
          const codigoActivacion = await AsyncStorage.getItem('@codigo_activacion');
          if (codigoActivacion) {
            // Actualizar el último uso
            await axios.put(`${BASE_URL}/api/mobile/dispositivos/ultimo_uso/${codigoActivacion}`);

            // Verificar el estado del código
            const estadoResponse = await axios.get(`${BASE_URL}/api/mobile/dispositivos/estado/${codigoActivacion}`);
            const { estado } = estadoResponse.data;

            if (estado === 'desactivado') {
              navigation.replace("ActivationScreen");
            }
          }
        } catch (error) {
          console.error("Error verificando y actualizando el estado del código:", error);
        }
      };

      checkAndUpdateCodeStatus();
    }, [navigation])
  );

  const handleDisabledClick = (section) => {
    Alert.alert("Función no disponible", `La sección "${section}" no está disponible por el momento.`);
  };

  const handleClearStorage = async () => {
    try {
      await AsyncStorage.removeItem('@empresa_id');
      await AsyncStorage.removeItem('@cobrador_id');
      await AsyncStorage.removeItem('@cobrador_nombre');
      Alert.alert('Éxito', 'Datos borrados exitosamente');
      setUserName('Usuario');
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al borrar los datos.');
    }
  };

  return (
    <View style={styles.maxContainer}>
      <StatusBar style="dark" backgroundColor={theme.colors.secondary} />
      <Cascading delay={100} animationKey={animationKey}>
        <TouchableOpacity style={styles.accountContainer} onPress={() => navigation.navigate("CobradoresScreen", { username: userName })}>
          <View style={styles.letter}>
            <StyledText initial>{userName[0]}</StyledText>
          </View>
          <View style={styles.info}>
            <StyledText regularBlackText>{currentDate}</StyledText>
            <StyledText boldText>{userName}</StyledText>
          </View>
        </TouchableOpacity>
      </Cascading>
      <Cascading delay={200} animationKey={animationKey}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isCobranzaEnabled ? null : styles.disabledButton]}
            onPress={isCobranzaEnabled ? () => navigation.navigate("ClientSearchScreen") : () => handleDisabledClick("Cobranzas")}
            disabled={!isCobranzaEnabled}
          >
            <Icon name="money" size={40} color={isCobranzaEnabled ? "black" : "#768DAD"} />
            <StyledText boldText style={styles.buttonText}>Cobranza</StyledText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.disabledButton]}
            onPress={() => handleDisabledClick("Pedidos")}
            disabled={true}
          >
            <Icon name="list-alt" size={40} color="#8097B6" />
            <StyledText boldText style={styles.buttonText2}>Pedidos</StyledText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.disabledButton]}
            onPress={() => handleDisabledClick("Ventas")}
            disabled={true}
          >
            <Icon name="line-chart" size={40} color="#8097B6" />
            <StyledText boldText style={styles.buttonText2}>Ventas</StyledText>
          </TouchableOpacity>
        </View>
      </Cascading>
      <Cascading delay={300} animationKey={animationKey}>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearStorage}>
          <StyledText buttonText>Borrar Datos</StyledText>
        </TouchableOpacity>
      </Cascading>
    </View>
  );
};

const styles = StyleSheet.create({
  maxContainer: {
    backgroundColor: theme.colors.secondary,
    marginBottom: 5,
  },
  accountContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.skyBlue,
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    backgroundColor: theme.colors.tertiary,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    width: 55,
    height: 55,
  },
  initialLetter: {
    color: theme.colors.primary,
  },
  info: {
    marginLeft: 10,
    flex: 1,
  },
  welcomeText: {
    color: theme.colors.primaryText,
  },
  userName: {
    color: theme.colors.primaryText,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    marginTop: 8,
    backgroundColor: theme.colors.skyBlue,
    borderRadius: 20,
    width: screenWidth * 0.25,
    height: screenWidth * 0.22,
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'flex-end',
    paddingVertical: 10,
    paddingLeft: 13,
  },
  disabledButton: {
    backgroundColor: '#A0BEE4',
  },
  buttonText: {
    marginTop: 3,
  },
  buttonText2: {
    marginTop: 3,
    color: '#8097B6',
  },
  clearButton: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
  },
});

export default ProfileHeader;
