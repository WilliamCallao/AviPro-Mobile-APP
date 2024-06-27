import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
import { Controller } from 'react-hook-form';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { FontAwesome5 } from "@expo/vector-icons";
import { theme } from "../../assets/Theme";
import StyledText from "../../utils/StyledText"; // Importar StyledText

const { width } = Dimensions.get('window');

const InputWithDropdown = ({ control, name, title, type = 'default', rules = {}, errors = {}, selectedCurrency, handleCurrencyChange }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => {
        setMenuVisible(prevState => !prevState);
    };

    const inputStyle = isFocused ? styles.inputFocused : styles.input;

    return (
        <View style={styles.container}>
            <StyledText regularText style={styles.label}>{title}</StyledText>
            <View style={styles.inputContainer}>
                <Controller
                    control={control}
                    name={name}
                    defaultValue=""
                    rules={rules}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={inputStyle}
                            onChangeText={onChange}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            value={value}
                            keyboardType={type === 'numeric' ? 'numeric' : 'default'}
                        />
                    )}
                />
                <Menu opened={menuVisible} onBackdropPress={() => setMenuVisible(false)}>
                    <MenuTrigger onPress={toggleMenu} style={styles.trigger}>
                        <View style={styles.menuTrigger}>
                            <StyledText regularText style={styles.triggerText}>{selectedCurrency}</StyledText>
                            <FontAwesome5 name={menuVisible ? "chevron-up" : "chevron-down"} size={15} color={theme.colors.black} />
                        </View>
                    </MenuTrigger>
                    <MenuOptions customStyles={{ optionsContainer: styles.optionsContainer, optionsWrapper: styles.optionsWrapper }}>
                        {['BS   ', 'USD '].map((option) => (
                            <MenuOption key={option} onSelect={() => { handleCurrencyChange(option); setMenuVisible(false); }}>
                                <View style={styles.optionContainer}>
                                    <StyledText regularText style={styles.optionsText}>{option}</StyledText>
                                    {selectedCurrency === option && (
                                        <FontAwesome5 name="check" size={17} color={theme.colors.black} style={{ marginLeft: 10 }} />
                                    )}
                                </View>
                            </MenuOption>
                        ))}
                    </MenuOptions>
                </Menu>
            </View>
            {errors[name] && (
                <StyledText regularText style={styles.error}>{errors[name].message}</StyledText>
            )}
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
        marginBottom: 5,
        paddingLeft: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 46,
        padding: 10,
        backgroundColor: theme.colors.white,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderWidth: 2,
        borderColor: theme.colors.otherWhite,
        fontWeight: 'bold',
    },
    inputFocused: {
        flex: 1,
        height: 46,
        padding: 10,
        backgroundColor: theme.colors.white,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderWidth: 2,
        borderColor: theme.colors.black,
        fontWeight: 'bold',
    },
    trigger: {
        backgroundColor: '#D6E3F5',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderColor: '#D6E3F5',
        borderWidth: 2,
        paddingHorizontal: 15,
        justifyContent: 'center',
        height: 46,
    },
    menuTrigger: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    triggerText: {
        color: theme.colors.black,
        fontWeight: "bold",
    },
    optionsContainer: {
        marginTop: 50,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#D0DEF1',
        borderWidth: 1,
        borderColor: '#D0DEF1',
    },
    optionsWrapper: {
        marginHorizontal: 10,
    },
    optionsText: {
        color: theme.colors.black,
        fontWeight: "bold",
    },
    optionContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 1,
        paddingLeft: 10,
    },
});

export default InputWithDropdown;
