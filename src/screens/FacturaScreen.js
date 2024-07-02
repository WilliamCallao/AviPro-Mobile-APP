import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from "react-native-vector-icons/AntDesign";
import { StatusBar } from 'expo-status-bar';
import useNotasCobradasStore from '../stores/notasCobradasStore';
import SimpleButton from '../utils/SimpleButton';
import { theme } from "../assets/Theme";
import StyledText from '../utils/StyledText';

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
            <StyledText boldText style={styles.companyName}>LOG Notas Cobradas</StyledText>
            <StyledText regularText style={styles.storeInfo}>Store: 02</StyledText>
            <StyledText boldText style={styles.title}>COMPROBANTE DE PAGO</StyledText>
            <View style={styles.infoSection}>
              <StyledText regularText style={styles.sectionText}>Fecha: {formattedDate}</StyledText>
              <StyledText regularText style={styles.sectionText}>N° Cuenta: 11201010212</StyledText>
            </View>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <StyledText boldText style={[styles.tableHeaderText, styles.cellNota]}>Nota</StyledText>
                <StyledText boldText style={[styles.tableHeaderText, styles.cellPago]}>Pago</StyledText>
                <StyledText boldText style={[styles.tableHeaderText, styles.cellAmount]}>Monto</StyledText>
              </View>
              {notasCobradas.map((nota, index) => (
                <View key={index} style={styles.tableRow}>
                  <StyledText regularText style={[styles.cell, styles.cellNota]}>{nota.pago_a_nota}</StyledText>
                  <StyledText regularText style={[styles.cell, styles.cellPago]}>{nota.modo_pago === 'E' ? 'Efectivo' : 'Banco'}</StyledText>
                  <StyledText regularText style={[styles.cell, styles.cellAmount]}>
                    {nota.monto.toFixed(2)} {nota.moneda === 'B' ? 'Bs' : '$'}
                  </StyledText>
                </View>
              ))}
            </View>
            <View style={styles.totalSection}>
              <StyledText boldText style={styles.totalText}>Total Pagado: </StyledText>
              <StyledText boldText style={styles.totalAmount}>{notasCobradas.reduce((total, nota) => total + nota.monto, 0).toFixed(2)} Bs.</StyledText>
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
    borderWidth: 1,
    borderColor: '#ddd',
  },
  companyName: {
    textAlign: 'center',
    marginBottom: 5,
  },
  storeInfo: {
    textAlign: 'center',
    marginBottom: 15,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 10,
  },
  sectionText: {
    fontSize: fontSizeM,
    marginVertical: 2,
  },
  notesTitle: {
    textAlign: 'center',
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
    fontSize: fontSizeL,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    fontSize: fontSizeM,
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
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#000',
  },
  totalText: {
    fontSize: fontSizeL,
  },
  totalAmount: {
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
