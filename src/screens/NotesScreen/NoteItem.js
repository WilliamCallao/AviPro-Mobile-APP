import React from "react";
import {
  View, StyleSheet, TouchableWithoutFeedback
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../assets/Theme";
import StyledText from "../../utils/StyledText";

const NoteItem = ({ note }) => {
  const navigation = useNavigation();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate("PayScreen", { note })}>
      <View style={noteItemstyles.container}>
        <View style={noteItemstyles.row}>
          <View style={noteItemstyles.column}>
            <StyledText regularBlackText style={noteItemstyles.label}>Nota:</StyledText>
            <StyledText regularText style={noteItemstyles.value}>{note.nro_nota}</StyledText>
          </View>
          <View style={noteItemstyles.column}>
            <StyledText regularBlackText style={noteItemstyles.label}>   Factura:</StyledText>
            <StyledText regularText style={noteItemstyles.value}>   {note.nro_factura}</StyledText>
          </View>
          <View style={noteItemstyles.column}>
            <StyledText regularBlackText style={noteItemstyles.label}>Saldo:</StyledText>
            <StyledText money style={noteItemstyles.value}>{note.saldo_pendiente} Bs</StyledText>
          </View>
        </View>
        <View style={noteItemstyles.row}>
          <View style={noteItemstyles.column}>
            <StyledText regularBlackText style={noteItemstyles.label}>Fecha Venta:</StyledText>
            <StyledText regularText style={noteItemstyles.value}>{formatDate(note.fecha_venta)}</StyledText>
          </View>
          <View style={noteItemstyles.column}>
            <StyledText regularBlackText style={noteItemstyles.label}>Vencimiento:</StyledText>
            <StyledText regularText style={noteItemstyles.value}>{formatDate(note.fecha_vence)}</StyledText>
          </View>
        </View>
        <View style={noteItemstyles.row}>
          <View style={noteItemstyles.column}>
            <StyledText regularBlackText style={noteItemstyles.label}>Importe:</StyledText>
            <StyledText regularText style={noteItemstyles.value}>{note.importe_nota} Bs</StyledText>
          </View>
          <View style={noteItemstyles.column}>
            <StyledText regularBlackText style={noteItemstyles.label}>Monto Pagado:</StyledText>
            <StyledText regularText style={noteItemstyles.value}>{note.monto_pagado} Bs</StyledText>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const noteItemstyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 8,
    marginHorizontal: 20,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: theme.colors.otherWhite,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  column: {
    flex: 1,
  },
  label: {
    color: theme.colors.darkGray,
  },
  value: {
  },
});

export default NoteItem;
