import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../assets/Theme";
import moment from 'moment';

const StoryItem = ({ story }) => {
  const dateTime = moment(`${story.fecha}T${story.hora}`);
  const formattedDate = dateTime.format('DD/MM/YY');
  const formattedTime = dateTime.format('HH:mm');

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.time}>{formattedTime}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.type}>Nota Cobrada</Text>
        <Text style={styles.name}>{story.nombre_cliente}</Text>
        <Text style={styles.amount}>{story.monto} Bs</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.otherWhite,
  },
  dateContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  infoContainer: {
    flex: 0.7,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  type: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.secondaryText,
    marginBottom: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primaryText,
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.primaryText,
  },
  date: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    marginBottom: 2,
  },
  time: {
    fontSize: 14,
    color: theme.colors.secondaryText,
  },
});

export default StoryItem;
