import React, { useState } from 'react';
import { Text, TextInput, StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import { theme } from "../assets/Theme";
import { Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

const screenWidth = Dimensions.get('window').width;

const DateInputField = ({ control, name, title, callThrough, isEditable }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event, newselectedDate) => {
        const currentDate = newselectedDate || selectedDate;
        setShowDatePicker(false);
        setSelectedDate(currentDate);
        callThrough(format(currentDate, 'yyyy-MM-dd'));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{title}</Text>
            <Controller
                control={control}
                name={name}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <TextInput
                            style={styles.input}
                            value={format(selectedDate, 'dd/MM/yyyy')}
                            editable={false}
                        />
                    </TouchableOpacity>
                )}
            />
            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        marginBottom: 20,
        width: screenWidth - 40, // Full width minus margins
    },
    label: {
        color: 'gray',
        fontSize: 18,
        marginBottom: 5,
        paddingLeft: 10,
    },
    input: {
        height: 46,
        borderColor: '#D6E3F5',
        paddingHorizontal: 10,
        backgroundColor: '#D6E3F5', // Background color
        borderRadius: 10,
        borderWidth: 2, // Maintain the border
        fontSize: 18,
        fontWeight: "bold",
        textAlign: 'left', // Align text to the left
        color: 'black', // Text color
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 1,
        paddingLeft: 10,
    },
});

export default DateInputField;
