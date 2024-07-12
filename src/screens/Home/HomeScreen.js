import React, { useState, useCallback, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import ProfileHeader from "./ProfileHeader";
import { theme } from "../../assets/Theme";
import DropdownSelector from "../../components/DropdownSelector";
import Cascading from "../../animation/CascadingFadeInView";
import { useFocusEffect } from "@react-navigation/native";
import StyledText from "../../utils/StyledText";
import Timeline from 'react-native-timeline-flatlist';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewScreen = () => {
  const [selectedOption, setSelectedOption] = useState("Hoy");
  const OPCIONES = ['Hoy', 'Ayer'];
  const title = 'Actividad';
  const [loading, setLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(Date.now());
  const [historyData, setHistoryData] = useState([]);

  const fetchStorageData = useCallback(async () => {
    setLoading(true);
    try {
      const empresa_id = await AsyncStorage.getItem('@empresa_id');
      const cobrador_id = await AsyncStorage.getItem('@cobrador_id');
      let filtro;

      switch (selectedOption) {
        case 'Hoy':
          filtro = 'hoy';
          break;
        case 'Ayer':  
          filtro = 'ayer';
          break;
        case 'Esta Semana':
          filtro = 'ultima_semana';
          break;
        case 'Este Mes':
          filtro = 'ultimo_mes';
          break;
        case 'Todo':
        default:
          filtro = '';
      }

      const response = await axios.get(`${BASE_URL}/api/mobile/historial-cobros/${empresa_id}/${cobrador_id}/${filtro}`);
      const sortedData = response.data.sort((a, b) => new Date(`${b.fecha}T${b.hora}`) - new Date(`${a.fecha}T${a.hora}`));
      setHistoryData(transformData(sortedData));
    } catch (error) {
      console.error("Error fetching history data:", error);
      Alert.alert("Error", "Ocurrió un error al obtener los datos del historial.");
    } finally {
      setLoading(false);
    }
  }, [selectedOption]);

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  const transformData = (data) => {
    return data.map(item => ({
      time: item.hora ? item.hora.substring(0, 5) : 'N/A',
      title: `${item.accion} (${parseFloat(item.monto).toFixed(2)} Bs)`,
      description: capitalizeWords(item.nombre_cliente.toLowerCase()),
      observaciones: item.observaciones || '',
    }));
  };

  useFocusEffect(
    useCallback(() => {
      setAnimationKey(Date.now());
      fetchStorageData();
    }, [fetchStorageData])
  );

  const onOptionChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <ProfileHeader />
        <Cascading delay={300} animationKey={animationKey}>
          <DropdownSelector
            title={title}
            options={OPCIONES}
            selectedOption={selectedOption}
            onOptionChange={onOptionChange}
          />
        </Cascading>
      </View>
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.secondary} style={styles.loader} />
        ) : historyData.length === 0 ? (
          <View style={styles.noActivityContainer}>
            <StyledText regularText>No hay actividad reciente</StyledText>
          </View>
        ) : (
          <Timeline
              data={historyData}
              circleSize={15}
              circleColor="#3B4753"
              lineColor='#3B4753'
              listViewContainerStyle={{paddingVertical:20}}
              timeContainerStyle={{ minWidth: 60, justifyContent: 'center', marginTop:-10 }}
              timeStyle={{ textAlign: 'center', backgroundColor: "#3B4753", color: 'white', paddingVertical: 5, paddingHorizontal: 15, borderRadius: 20 }}
              options={{
                style: { paddingTop: 20, paddingHorizontal:20 }
              }}
              renderDetail={(rowData, sectionID, rowID) => {
                let title = <StyledText regularIntenceText style={{marginTop:-17}}>{rowData.title}</StyledText>;
                let desc = null;
                if (rowData.description)
                  desc = (
                    <View style={{marginBottom:30}}>
                      <StyledText regularText style={{ marginTop: 5 }}>{rowData.description}</StyledText>
                      {rowData.observaciones ? <StyledText regularText style={{ marginTop: 5 }}>{rowData.observaciones}</StyledText> : null}
                    </View>
                  );

                return (
                  <View style={{ flex: 1 }}>
                    {title}
                    {desc}
                  </View>
                );
              }}
            />

        )}
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
    paddingBottom: 10,
    paddingVertical: 20,
    backgroundColor: theme.colors.secondary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  listContainer: {
    backgroundColor: theme.colors.primary,
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noActivityContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NewScreen;
