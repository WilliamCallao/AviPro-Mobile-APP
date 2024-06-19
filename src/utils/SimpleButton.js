import React, { useState } from 'react';
import { TouchableWithoutFeedback, Animated, StyleSheet } from 'react-native';
import StyledText from './StyledText';
import { theme } from '../assets/Theme';

const SimpleButton = ({ text, onPress, width }) => {
  const [scale, setScale] = useState(new Animated.Value(1));

  const animatePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.90,
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
    animatePressIn();
    setTimeout(() => {
      animatePressOut();
    }, 200);
    onPress();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={animatePressIn}
      onPressOut={animatePressOut}
      onPress={handlePress}
    >
      <Animated.View style={[styles.container, { transform: [{ scale }] }, width ? { width: width } : {}]}>
        <StyledText buttonText>{text}</StyledText>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.tertiary,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
});

export default SimpleButton;