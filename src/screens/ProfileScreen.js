//ProfileScreen.js
import React, { useState, useEffect, useCallback } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Dimensions, Image, SafeAreaView, ScrollView, KeyboardAvoidingView } from "react-native";
import StyledText from "../utils/StyledText";
import { theme } from "../assets/Theme";
import imgprofile from "../assets/imgprofile.png";
import TouchableData from "../components/TouchableData";
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import Cascading from "../animation/CascadingFadeInView";
import { useFocusEffect } from "@react-navigation/native";
import userStore from "../stores/userStore";
import { db } from "../../config/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

const screenWidth = Dimensions.get('window').width;

const ProfileScreen = ({ route }) => {
  const { username } = route.params;
  const navigation = useNavigation();
  const [animationKey, setAnimationKey] = useState(Date.now());
  const { user, setUser } = userStore(state => ({
    user: state.user,
    setUser: state.setUser
  }));
  const [userData, setUserData] = useState({});


  useEffect(() => {
    if (!user || !user.idDoc) {
      return;
    } 
      const docRef = doc(db, 'cobradores', user.idDoc);
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const { nombre, empresa_id, email } = data;
          setUserData({ nombre, empresa_id, email });
          setUser({ ...user, empresa_id: empresa_id, nombre: nombre});
        } else {
          console.log('Ningun documento!');
        }
      }, (error) => {
        console.error("Error al obtener documento: ", error);
      });
      return unsubscribe;
  }, [user, db]);

  useFocusEffect(
    useCallback(() => {
      setAnimationKey(Date.now());
    }, [])
  );
  return (
    <SafeAreaView style={styles.container}>
       <KeyboardAvoidingView style={{ flex: 1}} behavior="padding"> 
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Cascading delay={150} animationKey={animationKey}>
        <View style={styles.headerAll}>
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Icon name="back" size={30} color="black" />
          </TouchableOpacity>
          <StyledText boldText style={styles.text}>Perfil</StyledText>
          <View></View>
        </View>

        <Cascading delay={200} animationKey={animationKey}>
          <View style={styles.header}>
            <Image source={imgprofile} style={styles.avatar}></Image>
            <StyledText boldText style={styles.text}>{userData.nombre}</StyledText>
          </View>
        </Cascading>
      </Cascading>
      <View style={styles.containerInfo}>
        <Cascading delay={200} animationKey={animationKey}>
          <TouchableData
            label="Nombre"
            icon="person-circle-outline"
            value={userData.nombre}
            fieldName="nombre"
          />
        </Cascading>
        <Cascading delay={300} animationKey={animationKey}>
          <TouchableData
            label="Empresa"
            icon="business-outline"
            value={userData.empresa_id}
            fieldName="empresa_id"
            editable = {false}
          />
        </Cascading>
        <Cascading delay={400} animationKey={animationKey}>
          <TouchableData
            label="Email"
            icon="mail-open-outline"
            value={userData.email}
            fieldName="email"
            
          />
        </Cascading>
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView >
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    // backgroundColor: theme.colors.secondary,
    backgroundColor: 'orange',
  },
  headerAll: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: screenWidth * 0.2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: screenWidth * 0.11,
  },
  back: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.skyBlue,
    borderRadius: 20,
    width: 60,
    height: 60,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    paddingVertical: 10,
  },
  avatar: {
    height: screenWidth * 0.28,
    width: screenWidth * 0.28,
    marginVertical: screenWidth * 0.05,
    backgroundColor: theme.colors.skyBlue,
    borderRadius: 50,
  },
  textSub: {
    color: theme.colors.slateGrey,
    fontSize: 16,
  },
  containerInfo: {
    marginVertical: 20,
  }
})

export default ProfileScreen;