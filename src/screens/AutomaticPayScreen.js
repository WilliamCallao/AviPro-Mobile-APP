import React, { useState, useCallback, useEffect } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Dimensions, ScrollView } from 'react-native';
import { useForm } from "react-hook-form";
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Cascading from "../animation/CascadingFadeInView";
import { theme } from "../assets/Theme";
import InputField from "../components/InputField.js";
import DateInputField from "../components/DateInputField.js";
import PaymentStore from "../stores/PaymentStore.js";
import DropdownSelector2 from "../components/DropdownSelector2.js";
import userStore from "../stores/userStore";
import useStore from "../stores/store";
import { formatDate } from "date-fns";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const AutomaticPayScreen = ({ route }) => {
    const navigation = useNavigation();
    const { clientInfo } = route.params;
    const { criteria } = route.params;
    const { method } = route.params;
    const { updateNota, agregarPago } = useStore(state => ({ state, updateNota: state.updateNota, agregarPago: state.agregarPago }));
    const { user } = userStore(state => ({ user: state.user }));
    const [dataAll, setDataAll] = useState(null);
    const [animationKey, setAnimationKey] = useState(Date.now());
    useFocusEffect(
        useCallback(() => {
            setAnimationKey(Date.now());
        }, [])
    );

    const vBalance = parseFloat(
        clientInfo.NotasPendientes.reduce(
            (total, nota) => total + nota.Saldo_pendiente,
            0
        ).toFixed(2)
    );
    useEffect(() => {
        if (criteria == "PEPS") {
            setDataAll(clientInfo.NotasPendientes.sort((a, b) => b.Fecha - a.Fecha));
        } else if (criteria == "UEPS") {
            setDataAll(clientInfo.NotasPendientes.sort((a, b) => a.Fecha - b.Fecha));
        } else if (criteria == "MayorMenor") {
            setDataAll(clientInfo.NotasPendientes.sort((a, b) => b.Saldo_pendiente - a.Saldo_pendiente));
        } else {
            setDataAll(clientInfo.NotasPendientes.sort((a, b) => a.Saldo_pendiente - b.Saldo_pendiente));
        }
    }, []);

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
            deposit: "",
            // advancePaymentNumber: "",
            checkBankNumber: "",
            checkBankDate: "",
            bankAccount: "",
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
        console.log(data);
        let index = 0;
        let amount2 = data.amount;
        while (index < dataAll.length && data.amount > 0) {
            if (dataAll[index].Saldo_pendiente === 0 || data.amount === 0) {
                console.log("bien", index);
                if (index === dataAll.length - 1) {
                    return;
                }
            } else {
                dataAll[index].Monto_pagado = parseFloat(dataAll[index].Monto_pagado);
                if (data.amount > dataAll[index].Saldo_pendiente) {
                    data.amount -= dataAll[index].Saldo_pendiente;
                    dataAll[index].Saldo_pendiente = 0;
                    dataAll[index].Monto_pagado = parseFloat(dataAll[index].importe_nota).toFixed(2);
                    amount2 = dataAll[index].importe_nota;
                    console.log("Saldo pendiente: ", dataAll[index].Monto_pagado, "Monto pagado: ", data.amount);
                } else {
                    dataAll[index].Saldo_pendiente = parseFloat((dataAll[index].Saldo_pendiente - parseFloat(data.amount)).toFixed(2));
                    dataAll[index].Monto_pagado = parseFloat((dataAll[index].Monto_pagado + parseFloat(data.amount)).toFixed(2));
                    amount2 = data.amount;
                    data.amount = 0;
                    console.log("Saldo pendiente2: ", dataAll[index].Monto_pagado, "Monto pagado: ", data.amount)
                }

                PaymentStore.getState().establecerCliente(user.nombre, dataAll[index].Cuenta);
                PaymentStore.getState().establecerMetodoPago(method);
                PaymentStore.getState().agregarNotaPagada({
                    fecha: selectedDate,
                    metodoPago: method,
                    detalles: [{
                        numeroNota: dataAll[index].nro_nota,
                        fecha: dataAll[index].Fecha_venta,
                        total: parseFloat(dataAll[index].importe_nota),
                        pagado: parseFloat(amount2),
                        saldo: parseFloat(dataAll[index].Saldo_pendiente),
                    }]
                });

                updateNota(dataAll[index].id, { Saldo_pendiente: dataAll[index].Saldo_pendiente, Monto_pagado: dataAll[index].Monto_pagado });
                agregarPago({
                    cta_deposito: selectedBank,
                    cuenta: dataAll[index].Cuenta || "",
                    empresa_id: user.empresa_id,
                    fecha: selectedDate,
                    fecha_registro: dataAll[index].Fecha_venta || "",
                    modo_pago: method,
                    moneda: selectedCurrency,
                    monto: parseFloat(dataAll[index].Monto_pagado),
                    nro_factura: dataAll[index].nro_nota || "",
                    observaciones: data.observations || "",
                    pago_a_nota: dataAll[index].id || "",
                    referencia: data.reference || "",
                    sucursal_id: dataAll[index].sucursal_id || "",
                    usuario_id: user.id,
                })
            }
            index++;
        }
        console.log("Pagos realizados");

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
                                <Text style={styles.nombre}>{clientInfo.Nombre}</Text>
                                <Text style={styles.avi}>{vBalance} Bs.</Text>
                            </View>
                        </View>
                    </Cascading>
                </View>
            </View>
            <View style={styles.formContainer}>
                <View style={styles.lineForm}>
                    <InputField
                        control={control}
                        name="amount"
                        title="Importe pagado"
                        type="numeric"
                        rules={{
                            required: "Este campo es requerido",
                            validate: (value) => parseFloat(value) <= vBalance || "El monto excede el saldo pendiente",
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
            </View >
        </SafeAreaView >
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
        textAlign: "center",
    },
    nombre: {
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center",
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
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: theme.colors.tertiary,
        borderRadius: 22,
        flex: 1,
    },
    buttonText: {
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: "bold",
    },
    firstLineForm: {
        flexDirection: "row",
    },
    lineForm: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

export default AutomaticPayScreen;
