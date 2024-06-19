import React, {useState} from 'react';
import { Text, TextInput, StyleSheet, View } from 'react-native';
import { theme } from "../assets/Theme";
import { Controller } from 'react-hook-form';

const InputField = ({ control, name, title, type = 'default', rules = {}, errors ={} }) => {

  const [isFocused, setIsFocused] = useState(false);

    const InputStyle = isFocused ? styles.inputFocused : styles.input;
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{title}</Text>
            <Controller
                control={control}
                name={name}
                defaultValue=""
                rules={rules}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={InputStyle}
                        onChangeText={onChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        value={value}
                        keyboardType={type === 'numeric' ? 'numeric' : 'default'}
                    />
                )}
            />
            {errors[name] && (
                <Text style={styles.error}>{errors[name].message}</Text>
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
        fontSize: 18,
        marginBottom: 5,
        paddingLeft: 10
    },
    input: {
      height: 46,
      width: "auto",
      minWidth: 245,
      padding: 10,
      backgroundColor: theme.colors.white,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.colors.otherWhite,
      fontSize: 18,
      fontWeight: "bold",

    },
    inputFocused:{
        height: 46,
        width: "auto",
        minWidth: 245,
        padding: 10,
        borderRadius: 10,
        fontSize: 18,
        fontWeight: "bold",
        borderWidth: 2,
        borderColor: theme.colors.black,
    
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 1,
        paddingLeft: 10
    },
});

export default InputField;
