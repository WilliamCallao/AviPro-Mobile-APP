	//ActivationScreen.js
	import React, { useEffect, useState } from "react";
	import { Image, TouchableOpacity, StyleSheet, View, Text, TextInput, Dimensions } from "react-native";
	import { SafeAreaView } from "react-native-safe-area-context";
	import { theme } from "../assets/Theme";
	import { useNavigation } from "@react-navigation/native";
	import { db } from "../../config/firebase";
	import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
	import userStore from "../stores/userStore";
	import StyledText from "../utils/StyledText";
	import SimpleButton from "../utils/SimpleButton";

	
	const windowWidth = Dimensions.get('window').width;
	const aspectRatio = 5285 / 5315;

	const ActivationScreen = () => {
		const [activationCode, setActivationCode] = useState("");
		const [message, setMessage] = useState(false);
		const [codes, setCodes] = useState([]);
		const { setEmpresa, setUser } = userStore(state => ({
			setEmpresa: state.setEmpresa,
			setUser: state.setUser
		}));

		const fecthData = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, 'codigoActivacion'));
				const newCodes = [];
				querySnapshot.forEach((doc) => {
					const codigo = doc.data().codigo;
					const used = doc.data().activo;
					const codigoConId = {
						id: doc.id,
						codigo: codigo,
						activo: used,
						empresa: doc.data().empresa_id  //nombre directamente
					}
					if (!codes.includes(codigo) && used) {
						newCodes.push(codigoConId);
					}
				});
				setCodes(prevCodes => [...prevCodes, ...newCodes]);
			} catch (error) {
				console.error('Error al recuperar documentos:', error);
			}
		};

		useEffect(() => {
			fecthData();
		}, [db]);

		const handleSend = async () => {
			if (activationCode.length === 0) {
				alert("Por favor llene todos los campos");
				return;
			}
			const codeDocum = codes.find(code => code.codigo === activationCode);
			if (!codeDocum) {
				setMessage(true);
				return;
			}
			const docRef = doc(db, 'codigoActivacion', codeDocum.id);
			try {
				await updateDoc(docRef, { activo: false });
				setMessage(false);
				setEmpresa(codeDocum.empresa);
				navigation.replace("LoginScreen");
			} catch (e) {
				setMessage(true);
			}
		}

		const navigation = useNavigation();

		const handleSkip = () => {
			setUser({
				idDoc: "generic_id",
				nombre: "Generic User",
				empresa_id: "generic_empresa"
			});
			navigation.navigate("NewScreen");
		};
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.containerImgs}>
					<Image source={require('../assets/formas.png')} style={{ width: windowWidth * 0.75, height: windowWidth * 0.75 * aspectRatio }} />
				</View>
				<View>
					<StyledText style={styles.title}>Avi Pro Mobile</StyledText>
					<StyledText style={styles.subtitle}>Clave de activación</StyledText>
					<TextInput
						placeholder="XXXX - XXXX - XXXX - XXXX"
						style={styles.label}
						onChange={(code) => { setActivationCode(code.nativeEvent.text) }}
						value={activationCode}
						keyboardType="default"
						autoCapitalize="characters"
					/>
					{message && <StyledText style={styles.errorFormat}>La clave de activación es incorrecta</StyledText>}
					<StyledText style={styles.softText}>Al continuar acepta todos los términos, condiciones y políticas de privacidad.</StyledText>
					<SimpleButton text="Continuar" onPress={handleSend} width={styles.button.width} />
					<StyledText style={styles.softText}>Si desea adquirir una licencia del producto por favor comuníquese con nuestro equipo de ventas.</StyledText>
					<SimpleButton text="Saltar" onPress={handleSkip} width={styles.button.width} />
				</View>

			</SafeAreaView>
		)
	};

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: '#9DBBE2',
			padding: 20,
		},
		containerImgs: {
			alignItems: 'center',
			justifyContent: 'center',
			width: windowWidth * 0.9,
			marginTop: 20,
		},
		title: {
			fontSize: 30,
			fontWeight: 'bold',
			textAlign: 'center',
			marginTop: 12,
			marginBottom: 20,
		},
		subtitle: {
			fontSize: 18,
			marginBottom: 5,
		},
		label: {
			backgroundColor: 'white',
			marginVertical: 10,
			padding: 10,
			borderRadius: 10,
		},
		softText: {
			color: theme.colors.gray,
			fontSize: 13,
			marginVertical: 18,
		},
		errorFormat: {
			color: 'red',
			fontSize: 13,
			marginTop: -8,
		},
		button: {
			backgroundColor: theme.colors.tertiary,
			alignItems: 'center',
			justifyContent: 'center',
			borderRadius: 10,
			padding: 10,
			marginVertical: 15,
		},
		continueButton: {
			color: theme.colors.primary,
			fontSize: 19,
			fontWeight: 'bold',
		}
	});

	export default ActivationScreen;