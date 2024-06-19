import React, { useState, useCallback } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Dimensions, Keyboard } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import { theme } from "../../assets/Theme";
import StyledText from "../../utils/StyledText";

const windowWidth = Dimensions.get("window").width;
const { height } = Dimensions.get('window');
const regularTextSize = height * 0.021;

const SearchBar = ({ searchQuery, setSearchQuery, selectedOption, onOptionChange }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible((prevState) => !prevState);
  };

  const handleClear = useCallback(() => {
    setSearchQuery('');
    Keyboard.dismiss();
  }, [setSearchQuery]);

  return (
    <View style={searchBarStyles.container}>
      {searchQuery.length === 0 ? (
        <Ionicons name="search" size={25} color="#2E3233" />
      ) : (
        <TouchableOpacity onPress={handleClear}>
          <Ionicons name="close" size={25} color="#2E3233" />
        </TouchableOpacity>
      )}
      <TextInput
        placeholder="Search..."
        style={searchBarStyles.searchTextInput}
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <Menu opened={menuVisible} onBackdropPress={() => setMenuVisible(false)}>
        <MenuTrigger onPress={toggleMenu} style={searchBarStyles.trigger}>
          <TouchableOpacity onPress={toggleMenu} activeOpacity={1} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
            <StyledText buttonText style={{ marginRight: 12 }}>
              {selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)}
            </StyledText>
            <FontAwesome5 name={menuVisible ? "chevron-up" : "chevron-down"} size={20} color="white" />
          </TouchableOpacity>
        </MenuTrigger>
        <MenuOptions customStyles={{ optionsContainer: searchBarStyles.optionsContainer, optionsWrapper: searchBarStyles.optionsWrapper }}>
          <MenuOption onSelect={() => { onOptionChange("cliente"); setMenuVisible(false); }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <StyledText buttonText>Cliente  </StyledText>
              {selectedOption === "cliente" && <FontAwesome5 name="check" size={17} color="white" />}
            </View>
          </MenuOption>
          <MenuOption onSelect={() => { onOptionChange("cuenta"); setMenuVisible(false); }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <StyledText buttonText>Cuenta  </StyledText>
              {selectedOption === "cuenta" && <FontAwesome5 name="check" size={17} color="white" />}
            </View>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );
};

const searchBarStyles = StyleSheet.create({
  container: {
    marginBottom: 20,
    flexDirection: "row",
    padding: 8,
    paddingLeft: 12,
    backgroundColor: theme.colors.skyBlue,
    borderRadius: 22,
    alignItems: "center",
    marginHorizontal: windowWidth * 0.05,
  },
  searchTextInput: {
    flex: 1,
    marginLeft: 7,
    marginRight: 10,
    fontSize: regularTextSize,
    color: theme.colors.primaryText,
  },
  trigger: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: theme.colors.tertiary,
    borderRadius: 22,
  },
  optionsContainer: {
    paddingVertical: 15,
    marginTop: 55,
    marginLeft: 0,
    borderRadius: 20,
    width: 142,
    backgroundColor: theme.colors.tertiary,
  },
  optionsWrapper: {
    marginLeft: 20,
  },
});

export default SearchBar;
