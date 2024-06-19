import React, { useRef, useState, useCallback} from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity, Text  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import StyledText from '../utils/StyledText';
import DualTextView from '../utils/DualTextView';
import SimpleButton from '../utils/SimpleButton';
import PaymentStore from '../stores/PaymentStore';
import Cascading from '../animation/CascadingFadeInView';
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { theme } from "../assets/Theme";
import { StatusBar } from 'expo-status-bar';
import { Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;
import useStore from '../stores/store';

const fontSizeM = screenWidth * 0.031;
const fontSizeL =screenWidth * 0.034;

const SimpleScreen = () => {
  const viewRef = useRef();
  const navigation = useNavigation();
  const factura = PaymentStore((state) => state.facturaActual);
  const numeroCuenta = factura.cliente.numeroCuenta;
  const cliente = useStore(state => state.buscarClientePorCuenta(numeroCuenta));

  const pagosRealizados = PaymentStore((state) => state.pagosRealizados);
  const borrarPagos = PaymentStore((state) => state.limpiarFactura);
  const totalPagado = factura.notasPagadas.reduce((acc, nota) => acc + nota.detalles.reduce((accDet, det) => accDet + parseFloat(det.pagado), 0), 0).toFixed(2);

  const [animationKey, setAnimationKey] = useState(Date.now());
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
    handleBorrarPagos();
  };
  const handleBorrarPagos = () => {
    borrarPagos();
  };

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

  return (
    <SafeAreaView style={styles.flexContainer}>
      <StatusBar style="light" backgroundColor={theme.colors.secondary} />
      <Cascading delay={200} animationKey={animationKey}>
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
      </Cascading>
      
      <View style={styles.flexContainer}>
        <ScrollView style={styles.safeArea} contentContainerStyle={styles.scrollViewContent}>
          <Cascading delay={400} animationKey={animationKey}>
            <View style={styles.container} ref={viewRef}>
              <Text style={styles.title}>{factura.nombreEmpresa}</Text>
              <Text style={styles.subtitle}>{"COMPROBANTE DE PAGO"}</Text>
              <Text style={{height:15}}>{""}</Text>
              <View style={styles.dottedLine} />
              <Text style={{height:6}}>{""}</Text>
              <Text style={styles.section}>FECHA: {formattedDate}</Text>
              {cliente && cliente.Nombre && (
                <Text style={styles.section}>CLIENTE: {cliente.Nombre}</Text>
              )}
              
              <Text style={styles.section}>N° CUENTA: {factura.cliente.numeroCuenta}</Text>
              <Text style={styles.section}>METODO DE PAGO: {factura.metodoPago}</Text>
              <Text style={{height:6}}>{""}</Text>
              <View style={styles.dottedLine} />
              <Text style={styles.sectionTitle}>NOTAS PAGADAS (Bs.)</Text>
              <View style={styles.dottedLine} />
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.cellNota]}>NOTA</Text>
                <Text style={[styles.tableHeaderText, styles.cellTotal]}>TOTAL</Text>
                <Text style={[styles.tableHeaderText, styles.cellPagado]}>PAGADO</Text>
                <Text style={[styles.tableHeaderText, styles.cellSaldo]}>SALDO</Text>
              </View>
              <View style={styles.dottedLine} />
              {factura.notasPagadas.map((nota, index) => (
                <View key={index}>
                  {nota.detalles.map((detalle, detalleIndex) => (
                    <View key={detalleIndex} style={styles.tableRow}>
                      <Text style={[styles.cell, styles.cellNota]}>
                        {detalle.numeroNota + '\n' + detalle.fecha}
                      </Text>
                      <Text style={[styles.cell, styles.cellTotal]}>
                        {detalle.total.toFixed(2)}
                      </Text>
                      <Text style={[styles.cell, styles.cellPagado]}>
                        {typeof detalle.pagado === 'number' ? detalle.pagado.toFixed(2) : '0.00'}
                      </Text>
                      <Text style={[styles.cell, styles.cellSaldo]}>
                        {typeof detalle.saldo === 'number' ? detalle.saldo.toFixed(2) : '0.00'}
                      </Text>
                    </View>
                  ))}
                  {/* <View style={styles.dottedLine} /> */}
                </View>
              ))}
              <View style={styles.totalRow}>
                <Text style={styles.cellTotal}>{"Total Pagado: "}</Text>
                <Text style={[styles.cellPagado, styles.totalPagado]}>{totalPagado} Bs.</Text>
              </View>
              <View style={styles.dottedLine} />
            </View>
          </Cascading>
        </ScrollView>

        <Cascading delay={500} animationKey={animationKey}>
          <View style={styles.buttonContainer}>
            <SimpleButton
              text="Imprimir"
              onPress={handlePress}
            />
          </View>
        </Cascading>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  totalRow: {
    
    flexDirection: 'row',
    justifyContent: 'center',
  },
  totalPagado: {
    fontSize: fontSizeL,
    textAlign: 'center',
  },
  cellTotal: {
    fontSize: fontSizeL,
  },
  sectionLabel: {
    marginTop: 5,
    marginLeft: 20,
    fontWeight: 'bold',
    fontSize: fontSizeL,
  },
  sectionContent: {
    fontSize: fontSizeM,
  },
  flexContainer: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
  },
  safeArea: {
    flex: 1,
  },
  safeArea: {
    paddingTop: 35,
    backgroundColor:theme.colors.secondary, 
  },
  scrollViewContent: {
    flexGrow: 0.7,
    justifyContent: 'center',
    paddingBottom: 30,
  },
  buttonContainer: {
    marginHorizontal: 20,
    paddingBottom: 20,
  },
  container: {
    margin: 10,
    paddingTop: 40,
    paddingBottom: 80,
    alignSelf: 'stretch',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
  },
  notaSection: {
    marginBottom: 10,
    marginTop: 10,
  },
  total:{
    marginTop:20,
  },
  back: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.skyBlue,
    borderRadius: 20,
    width: 60,
    height: 60,
},
  header:{
    marginHorizontal:20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    fontSize: fontSizeM,
    marginLeft: 20,
  },
  sectionTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: fontSizeL,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  dottedLine: {
    borderBottomWidth: 2,
    borderColor: 'black',
    borderStyle: 'dotted',
    marginVertical: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 13,
    fontSize: fontSizeL,
  },
  cell: {
    fontSize: fontSizeM,
    paddingVertical: 5,
    textAlign: 'left',
  },
  cellNota: {
    width: screenWidth * 0.22,
  },
  cellFecha: {
    textAlign: 'center',
  },
  cellPagado: {
    width: screenWidth * 0.23,
    textAlign: 'right',
  },
  cellSaldo: {
    width: screenWidth * 0.2,
    textAlign: 'right',
  },
});

export default SimpleScreen;
