import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { theme } from '../../assets/Theme';
import StyledText from "../../utils/StyledText";
import BorderBox from "../../utils/BorderBox";
import useStore from "../../stores/store";

const windowWidth = Dimensions.get('window').width;

const ClientItem = ({ client, onSelect }) => {
  // console.log(JSON.stringify(client, null, 2));
  const vNombre = client.nombre;
  const vCuenta = client.cuenta;

  const notasPendientes = useMemo(() => Array.isArray(client.notas_pendientes) ? client.notas_pendientes : [], [client.notas_pendientes]);
  const vBalance = useMemo(() => parseFloat(notasPendientes.reduce((total, nota) => {
    const saldoPendiente = parseFloat(nota.saldo_pendiente);
    return total + (isNaN(saldoPendiente) ? 0 : saldoPendiente);
  }, 0).toFixed(2)), [notasPendientes]);

  const vNotasPendientes = notasPendientes.length;
  const pagosRealizados = useStore(state => state.pagosRealizados);
  const [vUltimoPago, setUltimoPago] = useState(null);

  useEffect(() => {
    if (client.notas_cobradas.length > 0) {
      const ultimoPago = client.notas_cobradas.reduce((mayor, pago) => {
        return new Date(pago.fecha_registro) > new Date(mayor) ? pago.fecha_registro : mayor;
      }, client.notas_cobradas[0].fecha_registro);
      setUltimoPago(ultimoPago);
    }
  }, [client.notas_cobradas]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePress = useCallback(() => {
    onSelect(client.cliente_id);
  }, [client.cliente_id, onSelect]);

  return (
    <BorderBox onPress={handlePress} style={{ marginVertical: 10 }}>
      <View style={styles.iconContainer}>
        <View style={styles.iconWraped}>
          <StyledText initial>{vNombre.charAt(0)}</StyledText>
        </View>
        <View style={styles.detailsContainer}>
          <StyledText boldTextUpper>{vNombre}</StyledText>
          <StyledText regularText>{vCuenta}</StyledText>
        </View>
      </View>
      <View style={styles.lineContainer}>
        <View style={styles.line}></View>
      </View>
      <View style={styles.notesContainer}>
        <View style={styles.textLine}>
          <StyledText regularText>Notas Pendientes:</StyledText>
          <StyledText regularText>
            {vNotasPendientes} {vNotasPendientes === 1 ? 'nota' : 'notas'}
          </StyledText>
        </View>
        <View style={styles.textLine}>
          <StyledText regularText>Saldo Total:</StyledText>
          <StyledText regularText>{vBalance} Bs</StyledText>
        </View>
        <View style={styles.textLine}>
          <StyledText regularText>Último Pago:</StyledText>
          <StyledText regularText>{vUltimoPago ? formatDate(vUltimoPago) : "No hay pagos"}</StyledText>
        </View>
      </View>
    </BorderBox>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWraped: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.tertiary,
    borderRadius: 20,
    width: 70,
    height: 70,
  },
  detailsContainer: {
    marginLeft: 17,
    flex: 1,
  },
  notesContainer: {
    flexDirection: 'column',
  },
  lineContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    marginVertical: 10,
    backgroundColor: theme.colors.otherWhite,
    width: windowWidth * 0.8,
    height: 2,
  },
  textLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default React.memo(ClientItem);
