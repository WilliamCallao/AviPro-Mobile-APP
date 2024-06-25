import React from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "../../assets/Theme";
import moment from 'moment';
import StyledText from "../../utils/StyledText";

const StoryItem = ({ story }) => {
  const dateTime = moment(`${story.fecha}T${story.hora}`);
  const formattedDate = dateTime.format('DD/MM/YY');
  const formattedTime = dateTime.format('HH:mm');

  return (
    <View style={styles.container}>
        {/* <StyledText regularBlackText style={styles.type}>Nota Cobrada</StyledText> */}
      <View style={styles.dateContainer}>
        <StyledText regularText style={styles.date}>{formattedDate}</StyledText>
        <StyledText regularText style={styles.time}>{formattedTime}</StyledText>
      </View>
      <View style={styles.infoContainer}>
        <StyledText regularText style={styles.name}>{story.nombre_cliente}</StyledText>
        <StyledText regularText style={styles.amount}>{story.monto} Bs</StyledText>
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
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 20,
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
    marginBottom: 2,
  },
  name: {
    // color: theme.colors.primaryText,
  },
  amount: {
    color: theme.colors.primaryText,
  },
  date: {
    marginBottom: 2,
  },
  time: {},
});

export default StoryItem;
