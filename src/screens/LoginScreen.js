//LoginScreen.js
import React, { useState } from "react";
import { Image, TouchableOpacity, StyleSheet, SafeAreaView, View, Text, ScrollView,TextInput, Dimensions, KeyboardAvoidingView } from "react-native";
import {theme} from "../assets/Theme";
import { useNavigation } from "@react-navigation/native";
import {db} from "../../config/firebase";
import { collection, addDoc } from 'firebase/firestore';
import StyledText from "../utils/StyledText";
import userStore from "../stores/userStore"; 
import SimpleButton from "../utils/SimpleButton";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const aspectRatio = 5285 / 5315;

const LoginScreen = () => {
  const [info, setInfo] = useState({
    email: "", 
    nombre: "", 
  });
  const [message, setMessage] = useState(false);
  const { user, setUser, setUserId, setName, setId } = userStore(state => ({
    user: state.user,
    setUser: state.setUser,
    setUserId: state.setUserId,
    setName: state.setName,
    setId: state.setId,
  }));
  const addDocument = async (data) => {
    try{
      const cobrador_id = Math.floor(Math.random() * 1000000);
      data.cobrador_id = cobrador_id;
      data.empresa_id = user.empresa_id;
      const collectionRef = collection(db, 'cobradores');
      const docRef = await addDoc(collectionRef, data);
      console.log("Document written with ID: ", docRef.id, docRef);
      return docRef.id;
    }catch(e){
      console.error("Error adding document why: ", e);
    }
    
  };
  const handleSend = () => {
    if(info.email.length === 0 || info.nombre.length === 0 ){
      alert("Por favor llene todos los campos");
      return;
    }
    if(!info.email.match("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")){
      setMessage(true);
      return;
    }
    setMessage(false);

    addDocument(info)
      .then((id) => {
        console.log("Document added with ID: ", id);
        setUserId(id);
        setName(info.nombre);
        setId(info.cobrador_id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });

    navigation.replace("NewScreen")
  }

  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1}} behavior="padding"> 
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.containerImgs}>
        <Image source={require('../assets/formas.png')} style={{ width: windowWidth * 0.75, height: windowWidth * 0.75 * aspectRatio }} />
      </View>
      <View>
        <StyledText boldCenterText style={styles.title}>Información Personal</StyledText>
        <StyledText boldText style={styles.subtitle}>Nombre</StyledText>
        <TextInput 
          placeholder="Nombre" 
          style={styles.label} 
          onChangeText={name => {
            if(name.length <= 30 && name.match("^[a-zA-Z ]*$")){
              setInfo({...info, nombre: name});
            }
          }}
          value={info.nombre}
          keyboardType="default"
        />

        <StyledText boldText style={styles.subtitle}>Correo Electronico</StyledText>
        <TextInput 
          placeholder="Correo Electronico" 
          style={styles.label} 
          onChangeText={item => {
            setInfo({...info, email: item});
          }}
          value={info.email}
          keyboardType="email-address"
        />
        {message && <StyledText regularText style={styles.errorFormat}>Por favor ingrese un correo válido</StyledText>}
        <SimpleButton text="Continuar" onPress={handleSend} width={styles.button.width} />
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#9DBBE2',
		padding: 20,
	},
  containerImgs:{
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth*0.9,
    marginTop: windowHeight*0.05,
  },
	title: {
		fontSize: 30,
		fontWeight: 'bold',
		textAlign: 'center',
		marginVertical: 20,
	},
	subtitle: {
		fontSize: 16,
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
		marginVertical: 10,
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
    marginTop: 15,
	}, 
	continueButton: {
		color: theme.colors.primary,
		fontSize: 19,
	}
});

export default LoginScreen;