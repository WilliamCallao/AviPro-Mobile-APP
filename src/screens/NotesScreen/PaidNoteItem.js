import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../assets/Theme';
import StyledText from '../../utils/StyledText';

const PaidNoteItem = ({ note }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <StyledText boldText>{note.nro_nota}</StyledText>
        <StyledText money>{note.monto} Bs</StyledText>
      </View>
      <View style={styles.textLine}>
        <StyledText regularText>Fecha de Pago:</StyledText>
        <StyledText regularText>{formatDate(note.fecha)}</StyledText>
      </View>
      <View style={styles.textLine}>
        <StyledText regularText>Modo de Pago:</StyledText>
        <StyledText regularText>{note.modo_pago}</StyledText>
      </View>
      <View style={styles.textLine}>
        <StyledText regularText>Cuenta de Depósito:</StyledText>
        <StyledText regularText>{note.cta_deposito}</StyledText>
      </View>
      <View style={styles.textLine}>
        <StyledText regularText>Nro de Factura:</StyledText>
        <StyledText regularText>{note.nro_factura}</StyledText>
      </View>
      <View style={styles.textLine}>
        <StyledText regularText>Fecha de Registro:</StyledText>
        <StyledText regularText>{formatDate(note.fecha_registro)}</StyledText>
      </View>
      <View style={styles.textLine}>
        <StyledText regularText>Observaciones:</StyledText>
        <StyledText regularText>{note.observaciones}</StyledText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical: 8,
    marginHorizontal: 20,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: theme.colors.otherWhite,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default PaidNoteItem;
