// NewScreen.js
import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView, StyleSheet, View, FlatList, Text, Button } from "react-native";
import ProfileHeader from "../components/ProfileHeader";
import StoryItem from "../components/StoryItem";
import { theme } from "../assets/Theme";
import DropdownSelector from "../components/DropdownSelector";
import Cascading from "../animation/CascadingFadeInView";
import { useFocusEffect } from "@react-navigation/native";
import userStore from "../stores/userStore"; 
import useStore from "../stores/store";
import {db} from "../../config/firebase";
import { doc, getDoc } from 'firebase/firestore';
import shallow from 'zustand/shallow';

const NewScreen = () => {
  const [selectedOption, setSelectedOption] = useState("Hoy");
  const OPCIONES = ['Hoy', 'Esta Semana', 'Este Mes', 'Todo'];
  const title = 'Actividad';
  const { clientes, notasPendientes, clientesConNotas, subscribeToData } = useStore(state => ({
    clientes: state.clientes,
    notasPendientes: state.notasPendientes,
    subscribeToData: state.subscribeToData,
    clientesConNotas: state.clientesConNotas,
  }));
  const {user, setUser} = userStore(state =>({
    user: state.user,
    setUser: state.setUser
  })
  );
  const [nombreF, setNombreF] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToData();
    return () => unsubscribe();
  }, [subscribeToData]);
  
  useEffect(() => {
    if(!user || !user.idDoc){ 
      console.log('Usuario no definido o ID de documento no definido.');
      return;
    }else{
    const docRef = doc(db, 'cobradores', user.idDoc);
    const fetchUserData = async () => {
      try{
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log('Document data:', docSnap.data());  //raro porque sin esto no funciona
          const data = docSnap.data();
          const {nombre} = data;
          setNombreF(nombre);
        } else {
      }}catch(e){
        console.error("Error al obtener documento: ", e);
      }
    };
    fetchUserData();}
  },[user?.idDoc, user?.nombre]);

  const HISTORY_DATA = [
    {
      id: "1",
      name: "Samuel Herbas",
      amount: "130.00",
      date: "2024-03-01T12:32:00",
      note: "150",
    },
    { id: "2", 
      name: "Henry Peña", 
      amount: "70.00", 
      date: "2024-03-01T09:16:00", 
      note: "170" },
  ];
  
  const renderHistoryItem = ({ item, index }) => (
    <Cascading delay={400 + 80 * index} animationKey={animationKey}>
      <StoryItem
        story={item}
        onSelect={() => {
          /* item select */
        }}
      />
    </Cascading>
  );
  const [animationKey, setAnimationKey] = useState(Date.now());
  useFocusEffect(
    useCallback(() => {
      setAnimationKey(Date.now());
    }, [])
  );
  const onOptionChange = (option) => {
    setSelectedOption(option);
  };

  const logClientesConNotas = () => {
    const { clientesConNotas } = useStore.getState();
    
    if (clientesConNotas.length === 0) {
      console.log("No hay datos combinados para mostrar.");
      return;
    }
  
    // clientesConNotas.forEach(cliente => {
    //   console.log(`Cliente: ${cliente.Nombre} - Cuenta: ${cliente.Cuenta}`);
    //   if (cliente.NotasPendientes && cliente.NotasPendientes.length > 0) {
    //     console.log('  Notas Pendientes:');
    //     cliente.NotasPendientes.forEach(nota => {
    //       console.log(`    Nota: ${nota.nro_nota}, Importe: ${nota.importe_nota}, Saldo: ${nota.Saldo_pendiente}`);
    //     });
    //   } else {
    //     console.log('  No hay notas pendientes para este cliente.');
    //   }
    // });
  
    console.log(JSON.stringify(clientesConNotas, null, 2));
  };

  const logClientes = () => console.log("Clientes:", clientes);
  const logNotasPendientes = () => console.log("Notas Pendientes:", notasPendientes);


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <ProfileHeader userName={nombreF} />
        <Cascading delay={300} animationKey={animationKey}>
          <DropdownSelector
            title={title}
            options={OPCIONES}
            selectedOption={selectedOption}
            onOptionChange={onOptionChange}
          />
        </Cascading>
      </View>
      {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 20 }}>
        <Button title="Log Clientes" onPress={logClientes} />
        <Button title="Log Notas" onPress={logNotasPendientes} />
        <Button title="Combinar" onPress={() => {
          useStore.getState().combinarClientesConNotas();
          setTimeout(logClientesConNotas, 0);
        }} />
      </View> */}
      <View style={styles.listContainer}>
        <FlatList
          data={HISTORY_DATA}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<View style={{ height: 10 }} />}
          ListFooterComponent={<View style={{ height: 10 }} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    zIndex: 1,
    paddingTop: 40,
    paddingBottom: 18,
    paddingVertical: 20,
    backgroundColor: theme.colors.secondary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  listContainer: {
    backgroundColor: theme.colors.primary,
    flex: 1,
  },
});

export default NewScreen;
