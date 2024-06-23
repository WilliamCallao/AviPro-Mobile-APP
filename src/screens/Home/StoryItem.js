// StoryItem.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { theme } from "../../assets/Theme";

const StoryItem = ({ story, onSelect }) => {
  const dateTime = new Date(story.date);
  const formattedDate = dateTime.toLocaleDateString("es-BO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = dateTime.toLocaleTimeString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <TouchableOpacity onPress={onSelect} style={styles.container}>
      <View style={styles.group}>
        <Text style={styles.name}>{story.name}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.date}>{formattedTime}</Text>
      </View>
      <View style={styles.containerAmount}>
        <Text style={styles.amount}>{story.amount} Bs</Text>
      </View>
      <View style={styles.icon}></View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.otherWhite,
  },
  group: {
    flex: 0.8,
  },
  containerAmount: {},
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primaryText,
  },
  amount: {
    fontSize: 16,
  },
  date: {
    fontSize: 14,
    color: theme.colors.secondaryText,
  },
});

export default StoryItem;
