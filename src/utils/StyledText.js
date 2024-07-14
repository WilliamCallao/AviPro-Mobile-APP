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
    color: 'black',
  },
  boldTextUpper: {
    fontWeight: 'bold',
    fontSize: bigTextSize,
    textTransform: 'uppercase',
    color: 'black',
  },
  regularText: {
    fontSize: regularTextSize,
    color: theme.colors.secondaryText,
  },
  regularWhiteText: {
    fontSize: regularTextSize,
    alignSelf: 'center',
    color: "white",
  },
  regularBlackText: {
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
    color: 'black',
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
  children, style, bill, boldCenterText, regularWhiteText, regularText, boldText, buttonText, boldTextUpper, initial, regularBlackText, regularIntenceText, balance, money, ...rest
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
    regularWhiteText && styles.regularWhiteText, 
    style,
  ].filter(Boolean);

  return (
    <Text allowFontScaling={false} style={customStyles} {...rest}>
      {children}
    </Text>
  );
};

export default StyledText;
