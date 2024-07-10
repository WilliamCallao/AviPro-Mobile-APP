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

const AutomaticPayScreen = ({ route }) => {
    const { clientInfo } = route.params;
    const navigation = useNavigation();
    const [animationKey, setAnimationKey] = useState(Date.now());

    const [cashAccounts, setCashAccounts] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState('BS');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('efectivo');
    const [selectedCash, setSelectedCash] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [selectedCriteria, setSelectedCriteria] = useState('PEPS');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [paidNotes, setPaidNotes] = useState([]);
    const addNotaCobrada = useNotasCobradasStore((state) => state.addNotaCobrada);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/mobile/cuentas-deposito/empresa/${clientInfo.empresa_id}`);
                const cuentas = response.data;
                setCashAccounts(cuentas.filter(c => c.tipo === 'E').map(c => ({ descripcion: c.descripcion, cuenta: c.cuenta })));
                setBankAccounts(cuentas.filter(c => c.tipo === 'B').map(c => ({ descripcion: c.descripcion, cuenta: c.cuenta })));
                setSelectedCash(cuentas.filter(c => c.tipo === 'E')[0]?.descripcion || '');
                setSelectedBank(cuentas.filter(c => c.tipo === 'B')[0]?.descripcion || '');
            } catch (error) {
                console.error("Error fetching deposit accounts: ", error);
            }
        };

        fetchAccounts();
    }, [clientInfo.empresa_id]);

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

    const handleCriteriaChange = (option) => {
        setSelectedCriteria(option);
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
        const amount = parseFloat(data.amount);
        const sortedNotes = [...clientInfo.notas_pendientes];

        switch (selectedCriteria) {
            case 'PEPS':
                sortedNotes.sort((a, b) => new Date(a.fecha_venta) - new Date(b.fecha_venta));
                break;
            case 'UEPS':
                sortedNotes.sort((a, b) => new Date(b.fecha_venta) - new Date(a.fecha_venta));
                break;
            case 'MayorMenor':
                sortedNotes.sort((a, b) => parseFloat(b.importe_nota) - parseFloat(a.importe_nota));
                break;
            case 'MenorMayor':
                sortedNotes.sort((a, b) => parseFloat(a.importe_nota) - parseFloat(b.importe_nota));
                break;
            default:
                break;
        }

        let remainingAmount = amount;
        const notesToPay = sortedNotes.map(note => {
            if (remainingAmount > 0) {
                const amountToPay = Math.min(remainingAmount, parseFloat(note.saldo_pendiente));
                remainingAmount -= amountToPay;
                return {
                    ...note,
                    monto_pagado: amountToPay.toFixed(2)
                };
            }
            return null;
        }).filter(note => note !== null);

        setPaidNotes(notesToPay);
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

        try {
            for (const note of paidNotes) {
                const commonData = {
                    empresa_id: clientInfo.empresa_id,
                    sucursal_id: clientInfo.sucursal_id,
                    cuenta: clientInfo.cuenta,
                    fecha: format(new Date(), 'dd-MM-yyyy'),
                    pago_a_nota: note.nro_nota,
                    monto: note.monto_pagado,
                    moneda: selectedCurrency.trim() === 'BS' ? 'B' : 'U',
                    modo_pago: selectedPaymentMethod[0].toUpperCase(),
                    cta_deposito: selectedPaymentMethod.toLowerCase() === 'efectivo' ? getAccountNumber(selectedCash, cashAccounts) : getAccountNumber(selectedBank, bankAccounts),
                    observaciones: data.observations || '',
                    nro_factura: note.nro_factura,
                    cobrador_id: cobrador_id,
                };

                await axios.post(`${BASE_URL}/api/mobile/notas/process-payment`, commonData);

                // Agregar la nota cobrada al store de Zustand
                addNotaCobrada(commonData);
            }

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
                                <StyledText boldText style={styles.clientName}>{clientInfo.nombre}</StyledText>
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
                    <Cascading delay={300} animationKey={animationKey}>
                        <View style={{marginTop:10}}>
                            <DropdownSelector
                                title="Criterio de Cancelación"
                                options={['PEPS', 'UEPS', 'MayorMenor', 'MenorMayor']}
                                selectedOption={selectedCriteria}
                                onOptionChange={handleCriteriaChange}
                            />
                        </View>
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
                        <Cascading delay={400} animationKey={animationKey}>
                            <View style={styles.noteDetails}>
                                <View style={styles.noteDetailRow}>
                                    <StyledText regularText style={styles.noteDetailLabel}>Saldo Pendiente:</StyledText>
                                    <StyledText regularText style={styles.noteDetailValue}>{clientInfo.notas_pendientes.reduce((acc, note) => acc + parseFloat(note.saldo_pendiente), 0).toFixed(2)} Bs</StyledText>
                                </View>
                            </View>
                        </Cascading>
                        <Cascading delay={500} animationKey={animationKey}>
                            <InputWithDropdown
                                control={control}
                                name="amount"
                                title="Importe pagado"
                                type="numeric"
                                rules={{
                                    required: "Este campo es requerido",
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
                            <Cascading delay={600} animationKey={animationKey}>
                                <Dropdown
                                    title="Cta/Caja Banco"
                                    options={cashAccounts.map(c => capitalizeFirstLetter(c.descripcion))}
                                    selectedOption={selectedCash}
                                    onOptionChange={setSelectedCash}
                                />
                            </Cascading>}
                        {selectedPaymentMethod.toLowerCase() === 'banco' &&
                            <Cascading delay={600} animationKey={animationKey}>
                                <Dropdown
                                    title="Cta/Caja Banco"
                                    options={bankAccounts.map(c => capitalizeFirstLetter(c.descripcion))}
                                    selectedOption={selectedBank}
                                    onOptionChange={setSelectedBank}
                                />
                            </Cascading>}
                        <Cascading delay={700} animationKey={animationKey}>
                            <ObservationsInputField
                                control={control}
                                name="observations"
                                title="Observaciones"
                                rules={{}}
                                errors={errors}
                            />
                        </Cascading>
                        <Cascading delay={800} animationKey={animationKey}>
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
                                <ScrollView style={styles.notesContainer}>
                                    {paidNotes.map(note => (
                                        <View key={note.nro_nota}>
                                            <StyledText boldText>{note.nro_nota}</StyledText>
                                            <View style={styles.noteRow}>
                                                <StyledText regularText>Monto Pagado: </StyledText>
                                                <StyledText money>{note.monto_pagado} Bs</StyledText>
                                            </View>
                                            <View style={styles.noteRow}>
                                                <StyledText regularText style={{marginBottom:15}}>
                                                    {parseFloat(note.monto_pagado) === parseFloat(note.saldo_pendiente) ? 'Pago Completo' : 'Pago Parcial'}
                                                </StyledText>
                                            </View>
                                        </View>
                                    ))}
                                    <View style={styles.noteRow}>
                                        <StyledText boldText>Total:</StyledText>
                                        <StyledText money>{paidNotes.reduce((acc, note) => acc + parseFloat(note.monto_pagado), 0).toFixed(2)} Bs</StyledText>
                                    </View>
                                </ScrollView>

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
        borderBottomLeftRadius: 22,
        borderBottomRightRadius: 22,
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
        borderRadius: 20,
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
    notesContainer: {
        maxHeight: 900,
        marginVertical: 10,
    },
    noteRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default AutomaticPayScreen;
