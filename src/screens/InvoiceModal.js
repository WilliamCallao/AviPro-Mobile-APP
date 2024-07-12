import React, { useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { theme } from "../assets/Theme";
import StyledText from "../utils/StyledText";
import SimpleButton from '../utils/SimpleButton';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

const screenWidth = Dimensions.get('window').width;
const fontSizeM = screenWidth * 0.045;
const fontSizeL = screenWidth * 0.05;

const InvoiceModal = ({ isVisible, onCancel, notasCobradas = [], formattedDate, clientName, collectorName }) => {
  const viewRef = useRef();

  const captureAndShareScreenshot = async () => {
    try {
      const uri = await captureRef(viewRef.current, {
        format: 'png',
        quality: 0.9,
      });
      await Sharing.shareAsync(uri, { dialogTitle: 'Comparte tu comprobante de pago' });
    } catch (error) {
      Alert.alert("Error", "No se pudo capturar o compartir el comprobante: " + error.message);
    }
  };

  return (
    <Modal isVisible={isVisible} backdropColor="#9DBBE2" backdropOpacity={0.4} onBackdropPress={onCancel}>
      <View style={[styles.modalContent, styles.modalShadow]}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container} ref={viewRef}>
            <View style={styles.decorativeBarTop} />
            <StyledText boldText style={styles.title}>COMPROBANTE</StyledText>
            <StyledText regularText style={styles.sectionText2}>{formattedDate}</StyledText>
            <View style={styles.infoSection}>
              <StyledText regularText style={styles.sectionText}>Cliente: {clientName}</StyledText>
              <StyledText regularText style={styles.sectionText}>Cobrador: {collectorName}</StyledText>
              <StyledText regularText style={styles.sectionText}>N° Cuenta: 11201010212</StyledText>
            </View>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <StyledText boldText style={[styles.tableHeaderText, styles.cellNota]}>Nota</StyledText>
                <StyledText boldText style={[styles.tableHeaderText, styles.cellPago]}>Pago</StyledText>
                <StyledText boldText style={[styles.tableHeaderText, styles.cellAmount]}>Monto</StyledText>
              </View>
              {notasCobradas.length > 0 ? (
                notasCobradas.map((nota, index) => (
                  <View key={index} style={styles.tableRow}>
                    <StyledText regularText style={[styles.cell, styles.cellNota]}>{nota.pago_a_nota}</StyledText>
                    <StyledText regularText style={[styles.cell, styles.cellPago]}>{nota.modo_pago === 'E' ? 'Efectivo' : 'Banco'}</StyledText>
                    <StyledText regularText style={[styles.cell, styles.cellAmount]}>
                      {nota.monto.toFixed(2)} {nota.moneda === 'B' ? 'Bs' : '$'}
                    </StyledText>
                  </View>
                ))
              ) : (
                <StyledText regularText style={styles.noDataText}>No hay notas cobradas.</StyledText>
              )}
            </View>
            <View style={styles.totalSection}>
              <StyledText boldText style={styles.totalText}>Total Pagado: </StyledText>
              <StyledText boldText style={styles.totalAmount}>{notasCobradas.reduce((total, nota) => total + nota.monto, 0).toFixed(2)} Bs.</StyledText>
            </View>
            <View style={styles.decorativeBarBottom} />
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <SimpleButton text="Imprimir" onPress={captureAndShareScreenshot} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    maxHeight: '80%',
  },
  modalShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.75,
    shadowRadius: 10,
    elevation: 90,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 20,
    alignSelf: 'stretch',
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  decorativeBarTop: {
    height: 10,
    backgroundColor: theme.colors.tertiary,
    borderRadius: 5,
    marginBottom: 30,
  },
  decorativeBarBottom: {
    height: 10,
    backgroundColor: theme.colors.tertiary,
    borderRadius: 5,
    marginTop: 30,
  },
  title: {
    textAlign: 'center',
    fontSize: fontSizeL,
  },
  infoSection: {
    marginBottom: 10,
  },
  sectionText: {
    fontSize: fontSizeM,
    marginVertical: 2,
  },
  sectionText2: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: fontSizeM,
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
  noDataText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: fontSizeM,
    color: theme.colors.secondaryText,
  },
});

export default InvoiceModal;
