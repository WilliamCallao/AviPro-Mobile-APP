import React, { useState, useCallback } from "react";
import { SafeAreaView, TouchableOpacity, Text, FlatList, StyleSheet, View, Dimensions } from 'react-native';
import { theme } from '../../assets/Theme';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import ClientDebit from './ClientDebit';
import NoteItem from "./NoteItem";
import PaidNoteItem from "./PaidNoteItem"; // Importar el nuevo componente
import DropdownSelector from "../../components/DropdownSelector";
import Cascading from "../../animation/CascadingFadeInView";
import { useFocusEffect } from "@react-navigation/native";
import StyledText from "../../utils/StyledText";
const windowWidth = Dimensions.get('window').width;

const ClientPaymentScreen = ({ route }) => {
  const { itemClient } = route.params;
  // console.log(JSON.stringify(itemClient, null, 2));
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState('Pendientes');
  const [clientData, setClientData] = useState(itemClient);
  const title = 'Notas';
  const OPCIONES = ['Pendientes', 'Pagadas'];
  const [animationKey, setAnimationKey] = useState(Date.now());

  useFocusEffect(
    useCallback(() => {
      setAnimationKey(Date.now());
    }, [])
  );

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const renderItem = ({ item, index }) => (
    <Cascading
      delay={index > 6 ? 0 : 400 + 80 * index}
      animationKey={animationKey}
    >
      {selectedOption === 'Pendientes' ? (
        <NoteItem note={item} onSelect={() => { }} />
      ) : (
        <PaidNoteItem note={item} />
      )}
    </Cascading>
  );

  const keyExtractor = (item, index) => {
    return item.nro_nota ? item.nro_nota.toString() : index.toString();
  };

  if (!clientData) {
    return <Text>Cargando datos...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWithComponents}>
        <Cascading delay={100} animationKey={animationKey}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.back} onPress={() => navigation.navigate("ClientSearchScreen")}>
              <Icon name="back" size={30} color="black" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <View style={styles.text}>
                <StyledText boldTextUpper>{clientData.nombre}</StyledText>
              </View>
            </View>
          </View>
        </Cascading>
        <Cascading delay={200} animationKey={animationKey}>
          <ClientDebit clientInfo={clientData} />
        </Cascading>
        <Cascading delay={300} animationKey={animationKey}>
          <DropdownSelector
            title={title}
            options={OPCIONES}
            selectedOption={selectedOption}
            onOptionChange={handleOptionChange}
          />
        </Cascading>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={selectedOption === 'Pendientes' ? clientData.notas_pendientes : clientData.notas_cobradas}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={<View style={{ height: 10 }} />}
          ListFooterComponent={<View style={{ height: 10 }} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: theme.colors.primary,
  },
  headerWithComponents: {
    zIndex: 1,
    backgroundColor: theme.colors.secondary,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    elevation: 7,
    paddingBottom: 20,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  back: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.skyBlue,
    borderRadius: 20,
    width: 60,
    height: 60,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: theme.colors.skyBlue,
    borderRadius: 20,
    marginLeft: 20,
  },
  text: {
    alignItems: 'center',
    paddingVertical: 15,
    flexDirection: 'row',
    flex: 1,
  },
  code: {
    fontSize: 15,
    textAlign: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
  },
});

export default ClientPaymentScreen;
