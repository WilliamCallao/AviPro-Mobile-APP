import React from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';
import { theme } from "../assets/Theme";
const { height } = Dimensions.get('window');

const regularTextSize = height * 0.024
const bigTextSize = height * 0.025
const grandbigText = height * 0.04

const styles = StyleSheet.create({
  base: {
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: regularTextSize,
    color: theme.colors.tertiary,  
    // color: 'red',
  },
  boldTextUpper: {
    fontWeight: 'bold',
    fontSize: bigTextSize,
    textTransform: 'uppercase',
    color: theme.colors.tertiary,  
    // color: 'blue',  
  },
  regularText: {
    fontSize: regularTextSize,
    color: theme.colors.secondaryText,
    // color: 'red',
  },
  regularIntenceText: { // no devuelto
    fontSize: regularTextSize,
    color: theme.colors.primaryText,
    // color: 'red',
  },
  boldCenterText: {
    // extras
    fontSize: regularTextSize,
    fontWeight: 'bold',
    color: theme.colors.tertiary,  
    textTransform: 'uppercase',
    textAlign: 'center',  
  },
  // estras
  buttonText:{
    color: theme.colors.primary,
    fontSize: regularTextSize,
    fontWeight: "bold",
  },
  initial:{
    color: theme.colors.primary,
    fontSize: 33,
    // fontWeight: 'medium',
    fontWeight: 'bold',
  },
  balance:{
    fontSize: grandbigText,
    fontWeight: "bold",
    alignSelf: "center",
  },
  money:{
    fontWeight: 'bold',
    fontSize: regularTextSize,
    color: theme.colors.green,  
  },
  bill: {
    fontWeight: 'bold',
    fontSize: regularTextSize*1.2,
    color: 'black',
  }

});

const StyledText = ({ children, style, bill, boldCenterText, regularText, boldText, buttonText, boldTextUpper, initial, regularIntenceText, balance, money, ...rest }) => {
    const customStyles = [
      regularText && styles.regularText,
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
