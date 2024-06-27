import React from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';
import { theme } from "../assets/Theme";
const { height } = Dimensions.get('window');

const regularTextSize = height * 0.024;
const bigTextSize = height * 0.025;
const grandbigText = height * 0.04;

const styles = StyleSheet.create({
  base: {},
  boldText: {
    fontWeight: 'bold',
    fontSize: regularTextSize,
    color: theme.colors.tertiary,
  },
  boldTextUpper: {
    fontWeight: 'bold',
    fontSize: bigTextSize,
    textTransform: 'uppercase',
    color: theme.colors.tertiary,
  },
  regularText: {
    fontSize: regularTextSize,
    color: theme.colors.secondaryText,
  },
  regularBlackText: { // Nuevo estilo
    fontSize: regularTextSize,
    color: theme.colors.black,
  },
  regularIntenceText: {
    fontSize: regularTextSize,
    color: theme.colors.primaryText,
  },
  boldCenterText: {
    fontSize: regularTextSize,
    fontWeight: 'bold',
    color: theme.colors.tertiary,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  buttonText: {
    color: theme.colors.primary,
    fontSize: regularTextSize,
    fontWeight: "bold",
  },
  initial: {
    color: theme.colors.primary,
    fontSize: 33,
    fontWeight: 'bold',
  },
  balance: {
    fontSize: grandbigText,
    fontWeight: "bold",
    alignSelf: "center",
  },
  money: {
    fontWeight: 'bold',
    fontSize: regularTextSize,
    color: theme.colors.green,
  },
  bill: {
    fontWeight: 'bold',
    fontSize: regularTextSize * 1.2,
    color: 'black',
  }
});

const StyledText = ({
  children, style, bill, boldCenterText, regularText, boldText, buttonText, boldTextUpper, initial, regularBlackText, regularIntenceText, balance, money, ...rest
}) => {
  const customStyles = [
    regularText && styles.regularText,
    regularBlackText && styles.regularBlackText,
    boldText && styles.boldText,
    buttonText && styles.buttonText,
    boldTextUpper && styles.boldTextUpper,
    initial && styles.initial,
    regularIntenceText && styles.regularIntenceText,
    balance && styles.balance,
    money && styles.money,
    boldCenterText && styles.boldCenterText,
    bill && styles.bill,
    style,
  ].filter(Boolean);

  return (
    <Text allowFontScaling={false} style={customStyles} {...rest}>
      {children}
    </Text>
  );
};

export default StyledText;
