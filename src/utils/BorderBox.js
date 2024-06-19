import React, { useState } from 'react';
import { View, TouchableWithoutFeedback, Animated, StyleSheet } from 'react-native';
import { theme } from '../assets/Theme'; 

const BorderBox = ({ children, onPress, style }) => {
    const [scale, setScale] = useState(new Animated.Value(1));

  const animatePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const animatePressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    // // animatePressIn();
    // setTimeout(() => {
    //   animatePressOut();
    // }, 100);
    // if (onPress) onPress();
    onPress();
  };

  return (
    <TouchableWithoutFeedback onPressIn={animatePressIn} onPressOut={animatePressOut} onPress={handlePress}>
      <Animated.View style={[styles.container, { transform: [{ scale }] }, style]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

  
  const styles = StyleSheet.create({
    container: {
      paddingVertical: 20,
      paddingHorizontal: 20,
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: theme.colors.otherWhite,
    },
  });
  

export default BorderBox;