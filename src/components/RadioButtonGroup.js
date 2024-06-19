import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RadioButtonGroup = ({ title, options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    onSelect(option);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.optionContainer}
          onPress={() => handleSelectOption(option)}
        >
          <View style={styles.radioButton}>
            {selectedOption === option && <View style={styles.radioInnerCircle} />}
          </View>
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'gray',
    fontSize: 18,
    marginBottom: 5,
  },
  container: {
    flexDirection: 'column',
    marginHorizontal: 36,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
    marginHorizontal: 6
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'black',
  },
  optionText: {
    fontSize: 16,
  },
});

export default RadioButtonGroup;
