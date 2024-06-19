import React, {useState} from 'react';
import { Text, TextInput, StyleSheet, View } from 'react-native';
import { theme } from "../assets/Theme";
import { Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, formatDate } from 'date-fns';

const DateInputField = ({ control, name, title, callThrough, type = 'default', isEditable }) => {

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange =  (event, newselectedDate) => {
        const currentDate = newselectedDate || selectedDate;
        setShowDatePicker(false);
        setSelectedDate(currentDate);
        console.log(formatDate(currentDate, 'yyyy-MM-dd')); 
        console.log('selectedDate', selectedDate);
        callThrough(formatDate(currentDate, 'yyyy-MM-dd'));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{title}</Text>
            <Controller
                control={control}
                name={name}
                defaultValue=""
                render={({ field: { onChange, onBlur, value}}) => (
                    <TextInput
                        style={styles.input}
                        onFocus={() => setShowDatePicker(true)}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={format(selectedDate, 'dd/MM/yyyy')}
                        editable={isEditable}
                    />
                    
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
        width: 145,
    },
    label: {
        color: 'gray',
        fontSize: 18,
        marginBottom: 5,
        paddingLeft: 10
    },
    input: {
      height: 46,
      borderColor: 'gray',
      paddingHorizontal: 10,
      backgroundColor: theme.colors.otherWhite,
      borderRadius: 22,
      fontSize: 18,
      fontWeight: "bold",
      textAlign: 'center',
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 1,
        paddingLeft: 10
    },
});

export default DateInputField;