import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import StyledText from '../utils/StyledText';
import Cascading from '../animation/CascadingFadeInView';
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { theme } from "../assets/Theme";
import { StatusBar } from 'expo-status-bar';
import { Dimensions } from 'react-native';
import useNotasCobradasStore from '../stores/notasCobradasStore'; // Ajusta la ruta
import { format } from 'date-fns'; // Asegúrate de importar 'format' de 'date-fns'
import SimpleButton from '../utils/SimpleButton';

const screenWidth = Dimensions.get('window').width;
const fontSizeM = screenWidth * 0.031;
const fontSizeL = screenWidth * 0.034;

const SimpleScreen = () => {
  const viewRef = useRef();
  const navigation = useNavigation();
  const [animationKey, setAnimationKey] = useState(Date.now());

  const notasCobradas = useNotasCobradasStore((state) => state.notasCobradas);
  const clearNotasCobradas = useNotasCobradasStore((state) => state.clearNotasCobradas);

  // Log the store content to understand the issue
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
              <Text style={styles.title}>{"Nombre de la Empresa"}</Text>
              <Text style={styles.subtitle}>{"COMPROBANTE DE PAGO"}</Text>
              <Text style={{height:15}}>{""}</Text>
              <View style={styles.dottedLine} />
              <Text style={{height:6}}>{""}</Text>
              <Text style={styles.section}>FECHA: {formattedDate}</Text>
              
              <Text style={styles.section}>N° CUENTA: {"1234567890"}</Text>
              <Text style={styles.section}>METODO DE PAGO: {"efectivo"}</Text>
              <Text style={{height:6}}>{""}</Text>
              <View style={styles.dottedLine} />
              <Text style={styles.sectionTitle}>NOTAS COBRADAS (Bs.)</Text>
              <View style={styles.dottedLine} />
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.cellNota]}>NOTA</Text>
                <Text style={[styles.tableHeaderText, styles.cellTotal]}>MONTO</Text>
                <Text style={[styles.tableHeaderText, styles.cellPagado]}>OBSERVACIONES</Text>
              </View>
              <View style={styles.dottedLine} />
              {notasCobradas.map((nota, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.cell, styles.cellNota]}>
                    {nota.pago_a_nota + '\n' + (nota.fecha ? format(new Date(nota.fecha), 'dd/MM/yyyy') : 'Fecha inválida')}
                  </Text>
                  <Text style={[styles.cell, styles.cellTotal]}>
                    {nota.monto.toFixed(2)}
                  </Text>
                  <Text style={[styles.cell, styles.cellPagado]}>
                    {nota.observaciones || '-'}
                  </Text>
                </View>
              ))}
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
  total: {
    marginTop: 20,
  },
  back: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.skyBlue,
    borderRadius: 20,
    width: 60,
    height: 60,
  },
  header: {
    marginHorizontal: 20,
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
