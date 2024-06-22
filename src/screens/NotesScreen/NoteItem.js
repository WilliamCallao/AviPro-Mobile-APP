import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { theme } from "../../assets/Theme";
import StyledText from "../../utils/StyledText";

const NoteItem = ({ note, onSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const animationHeight = useRef(new Animated.Value(85)).current;

  const toggleExpansion = () => {
    setExpanded(!expanded);
    Animated.timing(animationHeight, {
      toValue: expanded ? 85 : 250,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

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
    <TouchableWithoutFeedback onPress={toggleExpansion}>
      <Animated.View style={[noteItemstyles.container, { height: animationHeight }]}>
        <View style={noteItemstyles.row}>
          <View>
            <StyledText boldText>{note.nro_nota}</StyledText>
            <StyledText regularText>{formatDate(note.fecha_venta)}</StyledText>
          </View>
          <StyledText money>{note.saldo_pendiente} Bs</StyledText>
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.green,
              paddingHorizontal: 15,
              padding: 10,
              borderRadius: 15,
            }}
            onPress={() =>
              navigation.navigate("SelectPaymentMethodScreen", { note, payMode: "normal" })
            }
          >
            <Icon name="money" size={30} color={"black"} />
          </TouchableOpacity>
        </View>
        {expanded && (
          <>
            <View style={[noteItemstyles.textLine, { marginTop: 20 }]}>
              <StyledText regularText>Importe:</StyledText>
              <StyledText regularText>{note.importe_nota} Bs</StyledText>
            </View>
            <View style={noteItemstyles.textLine}>
              <StyledText regularText>Monto Pagado:</StyledText>
              <StyledText regularText>{note.monto_pagado} Bs</StyledText>
            </View>
            <View style={noteItemstyles.textLine}>
              <StyledText regularText>Saldo Pendiente:</StyledText>
              <StyledText regularText>{note.saldo_pendiente} Bs</StyledText>
            </View>
            <View style={noteItemstyles.textLine}>
              <StyledText regularText>Fecha de Venta:</StyledText>
              <StyledText regularText>{formatDate(note.fecha_venta)}</StyledText>
            </View>
            <View style={noteItemstyles.textLine}>
              <StyledText regularText>Fecha de Vencimiento:</StyledText>
              <StyledText regularText>{formatDate(note.fecha_vence)}</StyledText>
            </View>
          </>
        )}
        <View style={noteItemstyles.iconContainer}>
          <Icon name={expanded ? "angle-up" : "angle-down"} size={20} color={theme.colors.black} />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const noteItemstyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
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
  },
  textLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    position: "absolute",
    bottom: 5,
    left: "55%",
    transform: [{ translateX: -10 }],
  },
});

export default NoteItem;
