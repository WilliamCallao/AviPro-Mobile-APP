import React, { useState, useEffect } from "react";
import { View, Dimensions, StyleSheet, ActivityIndicator } from "react-native";
import { theme } from "../../assets/Theme";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import SimpleButton from "../../utils/SimpleButton";
import StyledText from "../../utils/StyledText";
import InvoiceModal from "../InvoiceModal";
import useNotasCobradasStore from '../../stores/notasCobradasStore';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../config';

const screenWidth = Dimensions.get("window").width;

const capitalizeFirstLetter = (str) => {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

const ClientDebit = ({ clientInfo }) => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [clientName, setClientName] = useState('');
  const [collectorName, setCollectorName] = useState('');

  const notasCobradas = useNotasCobradasStore((state) => state.notasCobradas);
  const clearNotasCobradas = useNotasCobradasStore((state) => state.clearNotasCobradas);

  useEffect(() => {
    const fetchClientName = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/mobile/clientes/empresa/${notasCobradas[0]?.empresa_id}/cuenta/${notasCobradas[0]?.cuenta}`);
        const cliente = response.data;
        setClientName(capitalizeFirstLetter(cliente.nombre));
      } catch (error) {
        // console.error("Error fetching client name: ", error);
        console.log("no hay notas cobradas");
      }
    };

    const fetchCollectorName = async () => {
      try {
        const name = await AsyncStorage.getItem('@cobrador_nombre');
        if (name) {
          setCollectorName(capitalizeFirstLetter(name));
        }
      } catch (error) {
        console.error("Error fetching collector name: ", error);
      }
    };

    fetchClientName();
    fetchCollectorName();
  }, [notasCobradas]);

  const vBalance = clientInfo
    ? parseFloat(
        (clientInfo.notas_pendientes || []).reduce(
          (total, nota) => total + (parseFloat(nota.saldo_pendiente) || 0),
          0
        ).toFixed(2)
      )
    : null;

  const handleReciboPress = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

  useEffect(() => {
    console.log('Notas Cobradas Store:', notasCobradas);
  }, [notasCobradas]);

  const handleAutomaticPress = () => {
    navigation.navigate("AutomaticPayScreen", { clientInfo });
  };

  return (
    <View style={clientDebitStyles.container}>
      <StatusBar style="dark" backgroundColor={theme.colors.secondary} />
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
          onPress={handleAutomaticPress}
          width={screenWidth * 0.435}
        />
        <SimpleButton
          text="Recibo"
          onPress={handleReciboPress}
          width={screenWidth * 0.435}
        />
      </View>
      <InvoiceModal
        isVisible={isModalVisible}
        onCancel={handleModalCancel}
        notasCobradas={notasCobradas}
        clearNotasCobradas={clearNotasCobradas}
        formattedDate={formattedDate}
        clientName={clientName}
        collectorName={collectorName}
      />
    </View>
  );
};

const clientDebitStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.skyBlue,
    borderRadius: 25,
    width: screenWidth - 20,
    alignSelf: "center",
    marginBottom: 10,
  },
  spaceButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  text: {
    padding: 10,
  },
  loader: {
    padding: 14,
  },
});

export default ClientDebit;
