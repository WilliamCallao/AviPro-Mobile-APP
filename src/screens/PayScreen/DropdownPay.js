import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { FontAwesome5 } from "@expo/vector-icons";
import { theme } from "../../assets/Theme";

const { width } = Dimensions.get('window');

const Dropdown = ({ title, options, selectedOption, onOptionChange }) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => {
        setMenuVisible(prevState => !prevState);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{title}</Text>
            <Menu opened={menuVisible} onBackdropPress={() => setMenuVisible(false)}>
                <MenuTrigger onPress={toggleMenu} style={styles.trigger}>
                    <View style={styles.menuTrigger}>
                        <Text style={styles.triggerText}>{selectedOption}</Text>
                        <FontAwesome5 name={menuVisible ? "chevron-up" : "chevron-down"} size={15} color={theme.colors.black} />
                    </View>
                </MenuTrigger>
                <MenuOptions customStyles={{ optionsContainer: styles.optionsContainer, optionsWrapper: styles.optionsWrapper }}>
                    {options.map((option) => (
                        <MenuOption key={option} onSelect={() => { onOptionChange(option); setMenuVisible(false); }}>
                            <View style={styles.optionContainer}>
                                <Text style={styles.optionsText}>{option}</Text>
                                {selectedOption === option && (
                                    <FontAwesome5 name="check" size={17} color={theme.colors.black} style={{ marginLeft: 10 }} />
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
        marginHorizontal: 10,
        marginBottom: 20,
    },
    label: {
        color: 'gray',
        fontSize: 18,
        marginBottom: 5,
        paddingLeft: 10,
    },
    trigger: {
        backgroundColor: '#D6E3F5',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D6E3F5',
        paddingHorizontal: 15,
        justifyContent: 'center',
        height: 46,
        width: width - 40,
    },
    menuTrigger: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    triggerText: {
        color: theme.colors.black,
        fontSize: 16,
        fontWeight: "bold",
    },
    optionsContainer: {
        width: width - 40,
        marginTop: 50,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#D6E3F5',
        borderWidth: 1,
        borderColor: '#D6E3F5',
    },
    optionsWrapper: {
        marginHorizontal: 10,
    },
    optionsText: {
        color: theme.colors.black,
        fontSize: 16,
        fontWeight: "bold",
    },
    optionContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
});

export default Dropdown;
