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
import { format } from "date-fns";

const screenWidth = Dimensions.get("window").width;

const PayScreen = ({ route }) => {
    const { note } = route.params;
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
        setAnimationKey(Date.now());
    };

    const [selectedCash, setSelectedCash] = useState('CTA 11101010001');
    const cash_accounts = ['CTA 11101010001', 'CTA 11101010002', 'CTA 11101020001', 'CTA 11101020002'];
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [selectedBank, setSelectedBank] = useState('FIE.CTA 6-8918');
    const banks = ['FIE.CTA 6-8918', 'BISA.CTA 4454770019', 'UNION.CTA 1-18604442', 'BNB.CTA 300017-4016', 'BISA.CTA 4454772011'];

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
                    <Cascading delay={200} animationKey={animationKey}>
                        <DropdownSelector
                            title="Deposito"
                            options={['efectivo', 'banco', 'cheque']}
                            selectedOption={selectedPaymentMethod}
                            onOptionChange={handlePaymentMethodChange}
                        />
                    </Cascading>
                </View>
            </View>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.formContainer}>
                        <Cascading delay={300} animationKey={animationKey}>
                            <View style={styles.noteDetails}>
                                <View style={styles.noteDetailRow}>
                                    <Text style={styles.noteDetailLabel}>Importe de la Nota:</Text>
                                    <Text style={styles.noteDetailValue}>{note.importe_nota} Bs</Text>
                                </View>
                                <View style={styles.noteDetailRow}>
                                    <Text style={styles.noteDetailLabel}>Fecha de la Nota:</Text>
                                    <Text style={styles.noteDetailValue}>{format(new Date(note.fecha), 'dd/MM/yyyy')}</Text>
                                </View>
                                <View style={styles.noteDetailRow}>
                                    <Text style={styles.noteDetailLabel}>Monto Pagado:</Text>
                                    <Text style={styles.noteDetailValue}>{note.monto_pagado} Bs</Text>
                                </View>
                                <View style={styles.noteDetailRow}>
                                    <Text style={styles.noteDetailLabel}>Saldo Pendiente:</Text>
                                    <Text style={styles.noteDetailValue}>{note.saldo_pendiente} Bs</Text>
                                </View>
                            </View>
                        </Cascading>
                        <Cascading delay={400} animationKey={animationKey}>
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
                        </Cascading>
                        {selectedPaymentMethod === 'efectivo' &&
                            <Cascading delay={480} animationKey={animationKey}>
                                <Dropdown
                                    title="Cta/Caja Banco"
                                    options={cash_accounts}
                                    selectedOption={selectedCash}
                                    onOptionChange={setSelectedCash}
                                />
                            </Cascading>}
                        {selectedPaymentMethod === 'banco' &&
                            <Cascading delay={480} animationKey={animationKey}>
                                <Dropdown
                                    title="Cta/Caja Banco"
                                    options={banks}
                                    selectedOption={selectedBank}
                                    onOptionChange={setSelectedBank}
                                />
                            </Cascading>}
                        {selectedPaymentMethod === 'cheque' &&
                            <Cascading delay={480} animationKey={animationKey}>
                                <DateInputField
                                    control={control}
                                    name="checkBankDate"
                                    title="Fecha Cheque"
                                    callThrough={setSelectedDate}
                                    isEditable={true}
                                />
                            </Cascading>}
                        {selectedPaymentMethod === 'cheque' &&
                            <Cascading delay={500} animationKey={animationKey}>
                                <InputField
                                    control={control}
                                    name="reference"
                                    title="Referencia"
                                    type="default"
                                />
                            </Cascading>}
                        <Cascading delay={560} animationKey={animationKey}>
                            <ObservationsInputField
                                control={control}
                                name="observations"
                                title="Observaciones"
                                rules={{}}
                                errors={errors}
                            />
                        </Cascading>
                        <Cascading delay={700} animationKey={animationKey}>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={handleSubmit(modalConfirmacion)}
                                >
                                    <Text style={styles.buttonText}>Registrar Pago</Text>
                                </TouchableOpacity>
                            </View>
                        </Cascading>
                    </View>
                </ScrollView>
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
    noteDetails: {
        marginBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    noteDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    noteDetailLabel: {
        fontSize: 16,
        color: "#9A9A9A",
    },
    noteDetailValue: {
        fontSize: 16,
        color: "#9A9A9A",
    },
    buttonContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
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

export default PayScreen;
