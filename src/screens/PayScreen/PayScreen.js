import React, { useState, useCallback, useEffect } from "react";
import { SafeAreaView, StyleSheet, KeyboardAvoidingView, TouchableOpacity, View, Dimensions, ScrollView, Platform, ActivityIndicator, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { useForm } from "react-hook-form";
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Cascading from "../../animation/CascadingFadeInView";
import { theme } from "../../assets/Theme";
import InputWithDropdown from "./InputWithDropdown";
import DropdownSelector from "../../components/DropdownSelector";
import Dropdown from "./DropdownPay";
import ObservationsInputField from "./ObservationsInputField";
import { format } from "date-fns";
import axios from 'axios';
import { BASE_URL } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StyledText from "../../utils/StyledText";
import useNotasCobradasStore from '../../stores/notasCobradasStore';

const screenWidth = Dimensions.get("window").width;

const PayScreen = ({ route }) => {
    const { note } = route.params;
    // console.log("---------pay-screen--------");
    // console.log(JSON.stringify(note, null, 2));
    const navigation = useNavigation();
    const [animationKey, setAnimationKey] = useState(Date.now());

    const [cashAccounts, setCashAccounts] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState('BS   ');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Efectivo');
    const [selectedCash, setSelectedCash] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [clientName, setClientName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const addNotaCobrada = useNotasCobradasStore((state) => state.addNotaCobrada);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/mobile/cuentas-deposito/empresa/${note.empresa_id}`);
                const cuentas = response.data;
                setCashAccounts(cuentas.filter(c => c.tipo === 'E').map(c => ({ descripcion: c.descripcion, cuenta: c.cuenta })));
                setBankAccounts(cuentas.filter(c => c.tipo === 'B').map(c => ({ descripcion: c.descripcion, cuenta: c.cuenta })));
                setSelectedCash(cuentas.filter(c => c.tipo === 'E')[0]?.descripcion || '');
                setSelectedBank(cuentas.filter(c => c.tipo === 'B')[0]?.descripcion || '');
            } catch (error) {
                console.error("Error fetching deposit accounts: ", error);
            }
        };

        const fetchClientName = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/mobile/clientes/empresa/${note.empresa_id}/cuenta/${note.cuenta}`);
                const cliente = response.data;
                setClientName(cliente.nombre);
            } catch (error) {
                console.error("Error fetching client name: ", error);
            }
        };

        fetchAccounts();
        fetchClientName();
    }, [note.empresa_id, note.cuenta]);

    useFocusEffect(
        useCallback(() => {
            setAnimationKey(Date.now());
        }, [])
    );

    const handleCurrencyChange = (option) => {
        setSelectedCurrency(option);
    };

    const handlePaymentMethodChange = (option) => {
        setSelectedPaymentMethod(option);
        setAnimationKey(Date.now());
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            amount: "",
            currency: "",
            payMode: "",
            account: "",
            reference: "",
            observations: "",
        },
    });

    const modalConfirmacion = (data) => {
        setIsModalVisible(true);
        setModalData(data);
    };

    const [modalData, setModalData] = useState({});

    const onSubmit = async (data) => {
        setIsProcessing(true);
        setSuccessMessage('');

        const getAccountNumber = (description, accounts) => {
            const account = accounts.find(a => a.descripcion === description);
            return account ? account.cuenta : '';
        };

        const cobrador_id = await AsyncStorage.getItem('@cobrador_id');
        
        const commonData = {
            empresa_id: note.empresa_id,
            sucursal_id: note.sucursal_id,
            cuenta: note.cuenta,
            // fecha: format(new Date(), 'YYYY-MM-DD'),
            pago_a_nota: note.nro_nota,
            monto: parseFloat(data.amount),
            moneda: selectedCurrency.trim() === 'BS' ? 'B' : 'U',
            modo_pago: selectedPaymentMethod[0].toUpperCase(),
            cta_deposito: selectedPaymentMethod.toLowerCase() === 'efectivo' ? getAccountNumber(selectedCash, cashAccounts) : getAccountNumber(selectedBank, bankAccounts),
            observaciones: data.observations || '',
            nro_factura: note.nro_factura,
            cobrador_id: cobrador_id,
            nombre_cliente: clientName,
        };

        try {
            // Registrar el pago
            await axios.post(`${BASE_URL}/api/mobile/notas/process-payment`, commonData);

            // Agregar la nota cobrada al store de Zustand
            addNotaCobrada(commonData);

            setIsProcessing(false);
            setSuccessMessage('El pago ha sido registrado correctamente');
            setTimeout(() => {
                setSuccessMessage('');
                setIsModalVisible(false);
                navigation.goBack();
            }, 2000);
        } catch (error) {
            console.error('Error updating note:', error);
            setIsProcessing(false);
            setSuccessMessage('');
            Alert.alert('Error', 'Ocurrió un error al registrar el pago');
        }
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
                                <StyledText boldText style={styles.clientName}>{clientName}</StyledText>
                            </View>
                        </View>
                    </Cascading>
                    <Cascading delay={200} animationKey={animationKey}>
                        <DropdownSelector
                            title="Deposito"
                            options={['efectivo', 'banco'].map(capitalizeFirstLetter)}
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
                                    <StyledText regularText style={styles.noteDetailLabel}>Saldo Pendiente:</StyledText>
                                    <StyledText regularText style={styles.noteDetailValue}>{note.saldo_pendiente} Bs</StyledText>
                                </View>
                                <View style={styles.noteDetailRow}>
                                    <StyledText regularText style={styles.noteDetailLabel}>Monto Pagado:</StyledText>
                                    <StyledText regularText style={styles.noteDetailValue}>{note.monto_pagado} Bs</StyledText>
                                </View>
                                <View style={styles.noteDetailRow}>
                                    <StyledText regularText style={styles.noteDetailLabel}>Importe de la Nota:</StyledText>
                                    <StyledText regularText style={styles.noteDetailValue}>{note.importe_nota} Bs</StyledText>
                                </View>
                                <View style={styles.noteDetailRow}>
                                    <StyledText regularText style={styles.noteDetailLabel}>Fecha de la Nota:</StyledText>
                                    <StyledText regularText style={styles.noteDetailValue}>{format(new Date(note.fecha), 'dd/MM/yyyy')}</StyledText>
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
                                    validate: {
                                        positive: value => parseFloat(value) > 0 || "El monto debe ser mayor a 0",
                                        notExceed: value => parseFloat(value) <= note.saldo_pendiente || "El monto excede el saldo pendiente"
                                    },
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
                        {selectedPaymentMethod.toLowerCase() === 'efectivo' &&
                            <Cascading delay={480} animationKey={animationKey}>
                                <Dropdown
                                    title="Cta/Caja Banco"
                                    options={cashAccounts.map(c => capitalizeFirstLetter(c.descripcion))}
                                    selectedOption={selectedCash}
                                    onOptionChange={setSelectedCash}
                                />
                            </Cascading>}
                        {selectedPaymentMethod.toLowerCase() === 'banco' &&
                            <Cascading delay={480} animationKey={animationKey}>
                                <Dropdown
                                    title="Cta/Caja Banco"
                                    options={bankAccounts.map(c => capitalizeFirstLetter(c.descripcion))}
                                    selectedOption={selectedBank}
                                    onOptionChange={setSelectedBank}
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
                                    <StyledText buttonText>Registrar Pago</StyledText>
                                </TouchableOpacity>
                            </View>
                        </Cascading>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <Modal isVisible={isModalVisible} backdropColor="#9DBBE2" backdropOpacity={0.4}>
                <View style={[styles.modalContent, styles.modalShadow]}>
                    {isProcessing ? (
                        <>
                            <ActivityIndicator size="large" color={theme.colors.black} />
                            <StyledText regularText style={styles.modalText}>Registrando pago...</StyledText>
                        </>
                    ) : (
                        successMessage ? (
                            <>
                                <Icon name="checkcircle" size={50} color="green" />
                                <StyledText regularBlackText style={styles.modalText}>{successMessage}</StyledText>
                            </>
                        ) : (
                            <>
                                <StyledText regularBlackText style={styles.modalText}>¿Está seguro de realizar este cobro?</StyledText>
                                <StyledText regularText style={styles.modalDetailText}>Monto: {modalData.amount} {selectedCurrency}</StyledText>
                                <StyledText regularText style={styles.modalDetailText}>Método de pago: {selectedPaymentMethod}</StyledText>
                                <View style={styles.modalButtonContainer}>
                                    <TouchableOpacity
                                        style={[styles.modalButton, { backgroundColor: 'red' }]}
                                        onPress={() => setIsModalVisible(false)}
                                    >
                                        <StyledText style={styles.modalButtonText}>Cancelar</StyledText>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.modalButton, { backgroundColor: 'green' }]}
                                        onPress={handleSubmit(onSubmit)}
                                    >
                                        <StyledText style={styles.modalButtonText}>Confirmar</StyledText>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )
                    )}
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    cover: {
        zIndex: 1,
    },
    up: {
        backgroundColor: theme.colors.secondary,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 7,
        paddingBottom: 10,
    },
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: "row",
        paddingHorizontal: 10,
        paddingTop: 20,
        paddingBottom: 10,
        alignItems: "center",
    },
    back: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.skyBlue,
        borderRadius: 25,
        width: 60,
        height: 60,
    },
    aviContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: 60,
        marginLeft:10,
        borderRadius: 25,
        backgroundColor: theme.colors.skyBlue,
    },
    clientName: {
        textAlign: 'center',
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
        color: "#9A9A9A",
    },
    noteDetailValue: {
        color: "#9A9A9A",
    },
    buttonContainer: {
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 12,
        backgroundColor: theme.colors.tertiary,
        borderRadius: 20,
        width: '100%',
    },
    modalContent: {
        backgroundColor: theme.colors.primary,
        padding: 20,
        borderRadius: 25,
        alignItems: 'center',
    },
    modalText: {
        marginVertical: 10,
    },
    modalDetailText: {
        marginVertical: 5,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 5,
        marginHorizontal: 5,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    modalShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.75,
        shadowRadius: 10,
        elevation: 90,
    },
});

export default PayScreen;
