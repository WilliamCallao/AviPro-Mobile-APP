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
import DateInputField from "../../components/DateInputField";
import DropdownSelector from "../../components/DropdownSelector";
import Dropdown from "./DropdownPay";
import InputField from "../../components/InputField.js";
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
    const navigation = useNavigation();
    const [animationKey, setAnimationKey] = useState(Date.now());

    const [cashAccounts, setCashAccounts] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState('BS   ');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('efectivo');
    const [selectedCash, setSelectedCash] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
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

        const commonData = {
            empresa_id: note.empresa_id,
            sucursal_id: note.sucursal_id,
            cuenta: note.cuenta,
            pago_a_nota: note.nro_nota,
            monto: parseFloat(data.amount),
            moneda: selectedCurrency.trim() === 'BS' ? 'B' : 'U',
            modo_pago: selectedPaymentMethod === 'cheque' ? 'B' : selectedPaymentMethod[0].toUpperCase(),
            observaciones: data.observations || null,
            fecha_registro: new Date()
        };

        if (selectedPaymentMethod === 'efectivo' || selectedPaymentMethod === 'banco') {
            commonData.cta_deposito = selectedPaymentMethod === 'efectivo' ? getAccountNumber(selectedCash, cashAccounts) : getAccountNumber(selectedBank, bankAccounts);
        }

        if (selectedPaymentMethod === 'cheque') {
            commonData.fecha = selectedDate;
            commonData.referencia = data.reference || null;
        }

        try {
            const name = await AsyncStorage.getItem('@cobrador_id');
            await axios.post(`${BASE_URL}/api/mobile/notas-cobradas/register`, commonData);

            await axios.put(`${BASE_URL}/api/mobile/notas-pendientes/${note.empresa_id}/${note.sucursal_id}/${note.cuenta}/${note.nro_nota}`, {
                monto_pagado: parseFloat(data.amount)
            });

            // Registrar el pago en el historial
            await axios.post(`${BASE_URL}/api/mobile/historial-cobros`, {
                empresa_id: note.empresa_id,
                cobrador_id: name,
                nombre_cliente: clientName,
                monto: parseFloat(data.amount)
            });

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
            await handleRollback(commonData, data.amount, name, clientName);
            setIsProcessing(false);
            setSuccessMessage('');
            Alert.alert('Error', 'Ocurrió un error al registrar el pago');
        }
    };

    const handleRollback = async (commonData, amount, cobrador_id, nombre_cliente) => {
        try {
            await axios.post(`${BASE_URL}/api/mobile/notas-cobradas/rollback`, {
                empresa_id: commonData.empresa_id,
                sucursal_id: commonData.sucursal_id,
                cuenta: commonData.cuenta,
                pago_a_nota: commonData.pago_a_nota
            });

            await axios.post(`${BASE_URL}/api/mobile/notas-pendientes/rollback`, {
                empresa_id: commonData.empresa_id,
                sucursal_id: commonData.sucursal_id,
                cuenta: commonData.cuenta,
                nro_nota: commonData.pago_a_nota,
                monto: parseFloat(amount)
            });

            await axios.post(`${BASE_URL}/api/mobile/historial-cobros/rollback`, {
                empresa_id: commonData.empresa_id,
                cobrador_id: cobrador_id,
                nombre_cliente: nombre_cliente,
                monto: parseFloat(amount)
            });
        } catch (rollbackError) {
            console.error('Error during rollback:', rollbackError);
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
                                    options={cashAccounts.map(c => c.descripcion)}
                                    selectedOption={selectedCash}
                                    onOptionChange={setSelectedCash}
                                />
                            </Cascading>}
                        {selectedPaymentMethod === 'banco' &&
                            <Cascading delay={480} animationKey={animationKey}>
                                <Dropdown
                                    title="Cta/Caja Banco"
                                    options={bankAccounts.map(c => c.descripcion)}
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
                            <StyledText style={styles.modalText}>Registrando pago...</StyledText>
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
    modalContent: {
        backgroundColor: theme.colors.primary,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        marginVertical: 10,
        // color: theme.colors.primary,
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
