// ProfileHeader.js
// External library imports
import React, { useCallback, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Dimensions, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

// Local imports
import Cascading from "../animation/CascadingFadeInView";
import { theme } from "../assets/Theme";

const screenWidth = Dimensions.get('window').width;

const ProfileHeader = ({ userName }) => {
  const navigation = useNavigation();
  const [animationKey, setAnimationKey] = useState(Date.now());

  const isCobranzaEnabled = true;
  const isPedidosEnabled = false;
  const isVentasEnabled = false;

  useFocusEffect(
    useCallback(() => {
      setAnimationKey(Date.now());
    }, [])
  );

  const handleDisabledClick = (section) => {
    Alert.alert("Función no disponible", `La sección "${section}" no está disponible por el momento.`);
  };

  return (
    <View style={styles.maxContainer}>
      <StatusBar style="light" backgroundColor={theme.colors.secondary} />
      <Cascading delay={100} animationKey={animationKey}>
        <TouchableOpacity style={styles.accountContainer} onPress={() => navigation.navigate("ProfileScreen", {username: userName})}>
          <View style={styles.letter}>
            <Text style={styles.initialLetter}>{userName[0]}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.userName}>{userName}</Text>
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
            <Text style={styles.buttonText}>Cobranza</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.disabledButton]}
            onPress={() => handleDisabledClick("Pedidos")}
            disabled={true}
          >
            <Icon name="list-alt" size={40} color="#8097B6" />
            <Text style={styles.buttonText2}>Pedidos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.disabledButton]}
            onPress={() => handleDisabledClick("Ventas")}
            disabled={true}
          >
            <Icon name="line-chart" size={40} color="#8097B6" />
            <Text style={styles.buttonText2}>Ventas</Text>
          </TouchableOpacity>
        </View>
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
    padding: 5,
    borderRadius: 20,
    marginBottom: 10,
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
    fontSize: 22,
  },
  info: {
    marginLeft: 10,
  },
  welcomeText: {
    color: theme.colors.primaryText,
    fontSize: 15,
    fontWeight: 'normal',
  },
  userName: {
    color: theme.colors.primaryText,
    fontSize: 17,
    fontWeight: 'bold',
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
    width: screenWidth*0.25,
    height: screenWidth*0.22,
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
    fontWeight: 'bold',
    color: 'black',
  },
  buttonText2: {
    marginTop: 3,
    fontWeight: 'bold',
    color: '#8097B6',
  },
});

export default ProfileHeader;
