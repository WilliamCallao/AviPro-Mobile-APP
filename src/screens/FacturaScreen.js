import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from "react-native-vector-icons/AntDesign";
import { StatusBar } from 'expo-status-bar';
import { Dimensions } from 'react-native';
import useNotasCobradasStore from '../stores/notasCobradasStore'; // Ajusta la ruta
import SimpleButton from '../utils/SimpleButton';
import { theme } from "../assets/Theme";

const screenWidth = Dimensions.get('window').width;
const fontSizeM = screenWidth * 0.045;
const fontSizeL = screenWidth * 0.05;

const SimpleScreen = () => {
  const viewRef = useRef();
  const navigation = useNavigation();
  const [animationKey, setAnimationKey] = useState(Date.now());

  const notasCobradas = useNotasCobradasStore((state) => state.notasCobradas);
  const clearNotasCobradas = useNotasCobradasStore((state) => state.clearNotasCobradas);

  useEffect(() => {
    console.log('Notas Cobradas Store:', notasCobradas);
  }, [notasCobradas]);

  useFocusEffect(
    useCallback(() => {
      setAnimationKey(Date.now());
    }, [])
  );

  const captureAndShareScreenshot = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.9,
      });
      await Sharing.shareAsync(uri, { dialogTitle: 'Comparte tu comprobante de pago' });
    } catch (error) {
      Alert.alert("Error", "No se pudo capturar o compartir el comprobante: " + error.message);
    }
  };

  const handlePress = async () => {
    await captureAndShareScreenshot();
    handleClearNotasCobradas();
  };

  const handleClearNotasCobradas = () => {
    clearNotasCobradas();
  };

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

  return (
    <SafeAreaView style={styles.flexContainer}>
      <StatusBar style="light" backgroundColor={theme.colors.secondary} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.goBack()}
        >
          <Icon name="back" size={30} color="black" />
        </TouchableOpacity>
        <View style={styles.aviContainer}>
          {/* Additional view content if needed */}
        </View>
      </View>
      
      <View style={styles.flexContainer}>
        <ScrollView style={styles.safeArea} contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container} ref={viewRef}>
            <Text style={styles.companyName}>{"Nombre de la Empresa"}</Text>
            <Text style={styles.title}>{"COMPROBANTE DE PAGO"}</Text>
            <View style={styles.infoSection}>
              <Text style={styles.sectionText}>Fecha: {formattedDate}</Text>
              <Text style={styles.sectionText}>N° Cuenta: {"1234567890"}</Text>
              <Text style={styles.sectionText}>Método de Pago: {"Efectivo"}</Text>
            </View>
            <Text style={styles.notesTitle}>Notas Cobradas (Bs.)</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.cellNota]}>Nota</Text>
                <Text style={[styles.tableHeaderText, styles.cellPago]}>Pago</Text>
                <Text style={[styles.tableHeaderText, styles.cellAmount]}>Monto</Text>
              </View>
              {notasCobradas.map((nota, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.cell, styles.cellNota]}>{nota.pago_a_nota}</Text>
                  <Text style={[styles.cell, styles.cellPago]}>{nota.modo_pago === 'E' ? 'Efectivo' : 'Banco'}</Text>
                  <Text style={[styles.cell, styles.cellAmount]}>
                    {nota.monto.toFixed(2)} {nota.moneda === 'B' ? 'Bs' : '$'}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.totalSection}>
              <Text style={styles.totalText}>Total Pagado: </Text>
              <Text style={styles.totalAmount}>{notasCobradas.reduce((total, nota) => total + nota.monto, 0).toFixed(2)} Bs.</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <SimpleButton
            text="Imprimir"
            onPress={handlePress}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
  },
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 30,
  },
  container: {
    margin: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignSelf: 'stretch',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  companyName: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionText: {
    fontSize: fontSizeM,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  notesTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 10,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: fontSizeL,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    fontSize: fontSizeM,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  cellNota: {
    width: screenWidth * 0.3,
  },
  cellPago: {
    width: screenWidth * 0.2,
    textAlign: 'center',
  },
  cellAmount: {
    width: screenWidth * 0.3,
    textAlign: 'right',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#000',
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: fontSizeL,
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: fontSizeL,
    marginLeft: 10,
  },
  buttonContainer: {
    marginHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  back: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.skyBlue,
    borderRadius: 20,
    width: 60,
    height: 60,
  },
  aviContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default SimpleScreen;
