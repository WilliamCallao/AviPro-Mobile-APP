import React from "react";
import { View, Dimensions, StyleSheet, ActivityIndicator } from "react-native";
import { theme } from "../../assets/Theme";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import SimpleButton from "../../utils/SimpleButton";
import StyledText from "../../utils/StyledText";

const screenWidth = Dimensions.get("window").width;

const ClientDebit = ({ clientInfo }) => {
  const navigation = useNavigation();

  const vBalance = clientInfo
    ? parseFloat(
        (clientInfo.notas_pendientes || []).reduce(
          (total, nota) => total + (parseFloat(nota.saldo_pendiente) || 0),
          0
        ).toFixed(2)
      )
    : null;

  return (
    <View style={clientDebitStyles.container}>
      <StatusBar style="light" backgroundColor={theme.colors.secondary} />
      {clientInfo === null ? (
        <ActivityIndicator size="large" color={theme.colors.black} style={clientDebitStyles.loader} />
      ) : (
        <StyledText balance style={clientDebitStyles.text}>
          {vBalance} Bs
        </StyledText>
      )}
      <View style={clientDebitStyles.spaceButtons}>
        <SimpleButton
          text="Automático"
          onPress={() => navigation.navigate("SelectPayModeScreen", { clientInfo })}
          width={screenWidth * 0.4}
        />
        <SimpleButton
          text="Recibo"
          onPress={() => navigation.navigate('Factura')}
          width={screenWidth * 0.4}
        />
      </View>
    </View>
  );
};

const clientDebitStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.skyBlue,
    borderRadius: 22,
    width: screenWidth - 40,
    alignSelf: "center",
    marginBottom: 20,
  },
  spaceButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  text: {
    padding: 15,
  },
  loader: {
    padding: 18,
  },
  button: {
    backgroundColor: theme.colors.tertiary,
    borderRadius: 22,
    paddingVertical: 12,
    padding: 10,
    width: screenWidth * 0.4,
  },
});

export default ClientDebit;
