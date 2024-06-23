import React, { useState, useCallback } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, KeyboardAvoidingView, TouchableOpacity, View, Dimensions, ScrollView, Platform } from 'react-native';
import { useForm } from "react-hook-form";
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Cascading from "../../animation/CascadingFadeInView";
import { theme } from "../../assets/Theme";
import InputWithDropdown from "./InputWithDropdown";
import DateInputField from "../../components/DateInputField";
import DropdownSelector from "../../components/DropdownSelector";
import Dropdown from "./DropdownPay";
import InputField from "../../components/InputField.js";
import ObservationsInputField from "./ObservationsInputField";
import { formatDate } from "date-fns";

const screenWidth = Dimensions.get("window").width;

const AutomaticPayScreen = ({ route }) => {
    const { note } = route.params;
    console.log(JSON.stringify(note, null, 2));
    const navigation = useNavigation();
    const [animationKey, setAnimationKey] = useState(Date.now());

    useFocusEffect(
        useCallback(() => {
            setAnimationKey(Date.now());
        }, [])
    );

    const [selectedCurrency, setSelectedCurrency] = useState('BS   ');
    const handleCurrencyChange = (option) => {
        setSelectedCurrency(option);
    };

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('efectivo');
    const handlePaymentMethodChange = (option) => {
        setSelectedPaymentMethod(option);
    };

    const [selectedCash, setSelectedCash] = useState('CTA 11101010001');
    const cash_accounts = ['CTA 11101010001', 'CTA 11101010002', 'CTA 11101020001', 'CTA 11101020002'];
    const [selectedDate, setSelectedDate] = useState(formatDate(new Date(), 'yyyy-MM-dd'));
    const [selectedBank, setSelectedBank] = useState('FIE.CTA 6-8918');
    const banks = ['FIE.CTA 6-8918', 'BISA.CTA 4454770019', 'UNION.CTA 1-18604442', 'BNB.CTA 300017-4016', 'BISA.CTA 4454772011'];

    const [selectedCriteria, setSelectedCriteria] = useState('PEPS');
    const criteriaOptions = ['PEPS', 'UEPS', 'MayorMenor', 'MenorMayor'];

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            amount: "",
            currency: "",
            payMode: "",
            checkBankNumber: "",
            checkBankDate: "",
            account: "",
            reference: "",
            observations: "",
        },
    });

    const modalConfirmacion = (data) =>
        Alert.alert('Confirmación', `¿Está seguro de realizar este cobro?\n Monto: ${data.amount} ${selectedCurrency}\n Método de pago: ${selectedPaymentMethod}`, [
            {
                text: 'Cancelar',
                onPress: () => { return; },
                style: 'cancel',
            },
            { text: 'Continuar', onPress: () => { onSubmit(data) } },
        ]);

    const onSubmit = (data) => {
        console.log('Data:', data);
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" backgroundColor={theme.colors.secondary} />
            <View style={styles.cover}>
                <View style={styles.up}>
                    <Cascading delay={100} animationKey={animationKey}>
                        <View style={styles.header}>
                            <TouchableOpacity
                                style={styles.back}
                                onPress={() => navigation.goBack()}
                            >
                                <Icon name="back" size={30} color="black" />
                            </TouchableOpacity>
                            <View style={styles.aviContainer}>
                                <Text style={styles.avi}>Pago de Nota</Text>
                            </View>
                        </View>
                    </Cascading>
                    <DropdownSelector
                        title="Deposito"
                        options={['efectivo', 'banco', 'cheque']}
                        selectedOption={selectedPaymentMethod}
                        onOptionChange={handlePaymentMethodChange}
                    />
                    <View style={{ marginTop:20 }}>
                    <DropdownSelector
                        title="Criterio de Cancelación"
                        options={criteriaOptions}
                        selectedOption={selectedCriteria}
                        onOptionChange={setSelectedCriteria}
                        style={styles.tertiaryDropdown}
                    />
                    </View>
                </View>
            </View>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : null}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.formContainer}>
                        <Text style={styles.saldoText}>Saldo pendiente: {note.saldo_pendiente} Bs</Text>
                        <InputWithDropdown
                            control={control}
                            name="amount"
                            title="Importe pagado"
                            type="numeric"
                            rules={{
                                required: "Este campo es requerido",
                                validate: value => parseFloat(value) <= note.saldo_pendiente || "El monto excede el saldo pendiente",
                                pattern: {
                                    value: /^[0-9]+([.][0-9]{0,2})?$/,
                                    message: "Ingrese solo números",
                                },
                            }}
                            errors={errors}
                            selectedCurrency={selectedCurrency}
                            handleCurrencyChange={handleCurrencyChange}
                        />
                        {selectedPaymentMethod === 'efectivo' &&
                            <Dropdown
                                title="Cta/Caja Banco"
                                options={cash_accounts}
                                selectedOption={selectedCash}
                                onOptionChange={setSelectedCash}
                            />}
                        {selectedPaymentMethod === 'banco' &&
                            <Dropdown
                                title="Cta/Caja Banco"
                                options={banks}
                                selectedOption={selectedBank}
                                onOptionChange={setSelectedBank}
                            />}
                        {selectedPaymentMethod === 'cheque' &&
                            <DateInputField
                                control={control}
                                name="checkBankDate"
                                title="Fecha Cheque"
                                callThrough={setSelectedDate}
                                isEditable={true}
                            />}
                        {selectedPaymentMethod === 'cheque' &&
                            <InputField
                                control={control}
                                name="reference"
                                title="Referencia"
                                type="default"
                            />}
                        <ObservationsInputField
                            control={control}
                            name="observations"
                            title="Observaciones"
                            rules={{}}
                            errors={errors}
                        />
                    </View>
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit(modalConfirmacion)}
                    >
                        <Text style={styles.buttonText}>Registrar Pago</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    cover: {
        backgroundColor: theme.colors.primary,
        zIndex: 1,
    },
    up: {
        backgroundColor: theme.colors.secondary,
        borderBottomLeftRadius: 22,
        borderBottomRightRadius: 22,
        elevation: 7,
        paddingBottom: 20,
    },
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 20,
        alignItems: "center",
    },
    back: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.skyBlue,
        borderRadius: 20,
        width: 60,
        height: 60,
    },
    aviContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    avi: {
        marginRight: 40,
    },
    formContainer: {
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 20,
        justifyContent: "center",
    },
    saldoText: {
        fontSize: 18,
        color: theme.colors.black,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        paddingVertical: 12,
        backgroundColor: theme.colors.tertiary,
        borderRadius: 22,
        width: '100%',
    },
    buttonText: {
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: "bold",
    },
    tertiaryDropdown: {
        backgroundColor: theme.colors.tertiary,
        borderRadius: 10,
        marginTop: 10,
        padding: 5,
    },
});

export default AutomaticPayScreen;
