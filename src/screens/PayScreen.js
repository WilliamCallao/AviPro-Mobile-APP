import React, { useState, useCallback } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, View, Dimensions, ScrollView } from 'react-native';
import { useForm } from "react-hook-form";
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Cascading from "../animation/CascadingFadeInView";
import { theme } from "../assets/Theme";
import InputField from "../components/InputField.js";
import DateInputField from "../components/DateInputField.js";
import DropdownSelector2 from "../components/DropdownSelector2.js";
import PaymentStore from "../stores/PaymentStore.js";
import useStore from "../stores/store.js";
import userStore from "../stores/userStore";
import { formatDate } from "date-fns";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const PayScreen = ({ route }) => {
    const { note, method } = route.params;
    const navigation = useNavigation();
    const { updateNota, agregarPago } = useStore(state => ({ state, updateNota: state.updateNota, agregarPago: state.agregarPago }));
    const { user } = userStore(state => ({ user: state.user }));
    const [animationKey, setAnimationKey] = useState(Date.now());
    useFocusEffect(
        useCallback(() => {
            setAnimationKey(Date.now());
        }, [])
    );

    const [selectedCurrency, setSelectedCurrency] = useState('Bs');
    const handleCurrencyChange = (option) => {
        setSelectedCurrency(option);
    };

    const [selectedCash, setSelectedCash] = useState('CTA 11101010001');
    const cash_accounts = ['CTA 11101010001', 'CTA 11101010002', 'CTA 11101020001', 'CTA 11101020002'];
    const [selectedDate, setSelectedDate] = useState(formatDate(new Date(), 'yyyy-MM-dd'));
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
            // advancePaymentNumber: "",
            checkBankNumber: "",
            checkBankDate: "",
            account: "",
            reference: "",
            observations: "",
        },
    });

    const modalConfirmacion = (data) =>
        Alert.alert('Confirmación', `¿Está seguro de realizar este cobro?\n Monto: ${data.amount} ${selectedCurrency}\n Método de pago: ${method}`, [
            {
                text: 'Cancelar',
                onPress: () => { return; },
                style: 'cancel',
            },
            { text: 'Continuar', onPress: () => { onSubmit(data) } },
        ]);

    const onSubmit = (data) => {
        if (note.Saldo_pendiente === 0 || parseFloat(data.amount) > note.Saldo_pendiente || parseFloat(data.amount) === 0) {
            return;
        }
        PaymentStore.getState().establecerCliente(user.nombre, note.Cuenta);
        PaymentStore.getState().establecerMetodoPago(method);
        PaymentStore.getState().agregarNotaPagada({
            fecha: selectedDate,
            metodoPago: method,
            detalles: [{
                numeroNota: note.nro_nota,
                fecha: note.Fecha_venta,
                total: parseFloat(note.importe_nota),
                pagado: parseFloat(data.amount),
                saldo: parseFloat(note.Saldo_pendiente) - parseFloat(data.amount),
            }]
        });

        updateNota(note.id, {
            Saldo_pendiente: note.Saldo_pendiente - parseFloat(data.amount),
            Monto_pagado: note.Monto_pagado + parseFloat(data.amount)
        });

        agregarPago({
            cta_deposito: selectedBank,
            cuenta: note.Cuenta || "",
            empresa_id: user.empresa_id,
            fecha: selectedDate,
            fecha_registro: note.Fecha_venta || "",
            modo_pago: method,
            moneda: selectedCurrency,
            monto: data.amount || "",
            nro_factura: note.nro_nota || "",
            observaciones: data.observations || "",
            pago_a_nota: note.id || "",
            referencia: data.reference || "",
            sucursal_id: note.sucursal_id || "",
            usuario_id: user.id || "",
        });
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="ligth" backgroundColor={theme.colors.secondary} />
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
                                <Text style={styles.avi}>{note.nro_nota}</Text>
                                <Text style={styles.avi}>{note.Saldo_pendiente} Bs.</Text>
                            </View>
                        </View>
                    </Cascading>
                </View>
            </View>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.formContainer}>
                    <View style={styles.lineForm}>
                        <InputField
                            control={control}
                            name="amount"
                            title="Importe pagado"
                            type="numeric"
                            rules={{
                                required: "Este campo es requerido",
                                validate: value => parseFloat(value) <= note.Saldo_pendiente || "El monto excede el saldo pendiente",
                                pattern: {
                                    value: /^[0-9]+([.][0-9]{0,2})?$/,
                                    message: "Ingrese solo números",
                                },
                            }}
                            errors={errors}
                        />
                        <DropdownSelector2
                            title="Moneda"
                            name="currency"
                            options={['Bs', 'USD']}
                            selectedOption={selectedCurrency}
                            onOptionChange={handleCurrencyChange}
                        />
                    </View>
                    {/* <InputField 
                control={control}
                name="advancePaymentNumber"
                title="Nº Anticipo"
                type="numeric"
                rules={{
                    required: "Este campo es requerido",
                    pattern: {
                        value: /^[0-9]+$/,
                        message: "Ingrese solo números",
                    },
                }}
                errors={errors} 
            /> */}
                    {method === 'cheque' &&
                        <InputField
                            control={control}
                            name="checkBankNumber"
                            title="Nº Cheque"
                            type="numeric"
                            rules={{
                                required: "Este campo es requerido",
                                pattern: {
                                    value: /^[0-9]+$/,
                                    message: "Ingrese solo números",
                                },
                            }}
                            errors={errors}
                        />}

                    {/* El input de abajo necesita usar un datetime picker para la fecha */}

                    <View style={styles.lineForm}>
                        <DateInputField
                            control={control}
                            name="checkBankDate"
                            title={method === 'method' ? "Fecha Cheque" : "Fecha"}
                            callThrough={setSelectedDate}
                            isEditable={method === 'cheque' ? true : false}
                        />

                        {method === 'efectivo' &&
                            <DropdownSelector2
                                title="Cta/Caja Banco"
                                options={cash_accounts}
                                selectedOption={selectedCash}
                                onOptionChange={setSelectedCash}
                            />}
                        {method === 'transferencia' &&
                            <DropdownSelector2
                                title="Cta/Caja Banco"
                                options={banks}
                                selectedOption={selectedBank}
                                onOptionChange={setSelectedBank}
                            />}
                    </View>
                    <InputField
                        control={control}
                        name="reference"
                        title="Referencia"
                        type="default"
                    />
                    <InputField
                        control={control}
                        name="observations"
                        title="Observaciones"
                        type="default"
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSubmit(modalConfirmacion)}
                        >
                            <Text style={styles.buttonText}>Registrar Pago</Text>
                        </TouchableOpacity>
                    </View>
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
        backgroundColor: theme.colors.primary,
    },
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: theme.colors.primary,
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
        backgroundColor: theme.colors.otherWhite,
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
        fontWeight: "bold",
        fontSize: 22,
        marginRight: 60,
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignSelf: "center",
        width: screenWidth - 240,
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        paddingVertical: 12,
        backgroundColor: theme.colors.tertiary,
        borderRadius: 22,
        flex: 1,
    },
    buttonText: {
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: "bold",
    },
    lineForm: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    formContainer: {
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 10,
    },
});

export default PayScreen;
