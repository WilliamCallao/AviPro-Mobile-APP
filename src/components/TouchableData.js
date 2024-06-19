import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Dimensions, View, TouchableOpacity, TextInput } from 'react-native';
import { theme } from "../assets/Theme";
import StyledText from "../utils/StyledText";
import { Ionicons } from "@expo/vector-icons";
import userStore from "../stores/userStore"; 
import { db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const TouchableData = ({ label, icon, value, fieldName, editable = true }) => {
  const [valueEdit, setValueEdit] = useState(value);
  const [updatedData, setUpdatedData] = useState(false);
  const { user, setUser } = userStore(state => ({
    user: state.user,
    setUser: state.setUser
  }));

  const handleEditPress = () => {
    setUpdatedData(!updatedData);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (valueEdit === undefined) {
          console.log(`valueEdit is undefined for field ${fieldName}`);
          return;
        } else {
          const docRef = doc(db, 'cobradores', user.idDoc);
          await updateDoc(docRef, { [fieldName]: valueEdit });
        }
      } catch (e) {
        console.error("Error al obtener documento: ", e);
      }
    };
    fetchUserData();
  }, [updatedData, fieldName, valueEdit]);

  return (
    <View style={styles.container}>
      <View style={styles.subcontainer}>
        <TouchableOpacity style={styles.icono}>
          <Ionicons name={icon} size={25} color="black" />
        </TouchableOpacity>
        <View>
          <StyledText boldText style={styles.text}>{label}</StyledText>
          <TextInput 
            style={styles.text}
            onChangeText={name => setValueEdit(name)}
            defaultValue={value}
            value={valueEdit}
            editable={editable}
            keyboardType="default"
          />
        </View>
      </View>
      {editable && ( 
        <TouchableOpacity onPress={handleEditPress}>
          <StyledText regularText style={styles.textLink}>Guardar</StyledText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#A8C6ED',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 2,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderRadius: 20,
    borderColor: 'theme.colors.otherWhite',
    display: 'flex',
    marginVertical: 8,
    flexWrap: 'wrap',
  },
  subcontainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 30,
    flex: 1,
  },
  icono: {
    backgroundColor: theme.colors.skyBlue,
    padding: 5,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    flexShrink: 1, 
  },
  textLink: {
    color: 'black',
    fontSize: 15,
  }
});

export default TouchableData;