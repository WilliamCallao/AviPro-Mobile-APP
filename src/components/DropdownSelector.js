// DropdownSelector.js
import React, { useState, useCallback } from "react";
import { View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import { theme } from '../assets/Theme';
import { StyleSheet, Dimensions } from 'react-native';
import StyledText from "../utils/StyledText";
const screenWidth = Dimensions.get('window').width;

const DropdownSelector = ({ title, options, selectedOption, onOptionChange }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(prevState => !prevState);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.label}>
        <StyledText boldText>{title}</StyledText>
      </View>
      <Menu opened={menuVisible} onBackdropPress={() => setMenuVisible(false)}>
        <MenuTrigger onPress={toggleMenu} style={styles.trigger}>
          <View style={styles.menuTrigger}>
            <View style={styles.menuTriggerInter}>
              <StyledText buttonText style={styles.triggerText}>
              {selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)}
              </StyledText>
            </View>
            <FontAwesome5 name={menuVisible ? "chevron-up" : "chevron-down"} size={20} color="white" />
          </View>
        </MenuTrigger>
        <MenuOptions customStyles={{ optionsContainer: styles.optionsContainer, optionsWrapper: styles.optionsWrapper, }}>
          {options.map((option) => (
            <MenuOption key={option} onSelect={() => { onOptionChange(option); setMenuVisible(false); }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <StyledText buttonText>{option}</StyledText>
                {selectedOption === option && (
                  <FontAwesome5 name="check" size={17} color="white" style={{ marginLeft: 10 }} />
                )}
              </View>
            </MenuOption>
          ))}
        </MenuOptions>
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    borderRadius: 20,
    backgroundColor: theme.colors.skyBlue,
    padding: 7,
    flexDirection: "row",
    justifyContent: 'flex-end',
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    borderRadius: 20,
    flex:1
  },
  menuTrigger: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: theme.colors.tertiary,
    borderRadius: 22,
    width: 200,
  },
  menuTriggerInter: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  triggerText: {
      marginRight: 12,
  },
  optionsContainer: {
    paddingVertical: 15,
    marginTop: 55,
    marginLeft: 0,
    borderRadius: 20,
    width: 200,
    backgroundColor: theme.colors.tertiary,
  },
  optionsWrapper: {
    marginLeft: 20,
  },
});
export default DropdownSelector;