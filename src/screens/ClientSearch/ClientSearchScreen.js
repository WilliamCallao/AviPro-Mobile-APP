import React, { useState, useCallback, useEffect } from "react";
import { SafeAreaView, TouchableOpacity, FlatList, StyleSheet, View, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchBar from "./SearchBar";
import ClientItem from "./ClientItem";
import { StatusBar } from "expo-status-bar";
import { theme } from "../../assets/Theme";
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import Cascading from "../../animation/CascadingFadeInView";
import { useFocusEffect } from "@react-navigation/native";
import StyledText from "../../utils/StyledText";
import axios from "axios";
import { BASE_URL } from "../../../config";

const secondary = theme.colors.secondary;

const ClientSearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("cliente");
  const [clientesConNotas, setClientesConNotas] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [animationKey, setAnimationKey] = useState(Date.now());
  const [visibleItemCount, setVisibleItemCount] = useState(10);
  const [isSearching, setIsSearching] = useState(false);
  const [empresaId, setEmpresaId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchClientes = useCallback(async (empresaId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/mobile/clientes/empresa/${empresaId}/notas-pendientes`);
      // console.log("-----------client-serach--------------");
      // console.log(JSON.stringify(response.data, null, 2));

      // Filter out notes with saldo_pendiente equal to 0
      const filteredClients = response.data.map(client => ({
        ...client,
        notas_pendientes: client.notas_pendientes.filter(nota => parseFloat(nota.saldo_pendiente) !== 0)
      }));

      setClientesConNotas(filteredClients);
      setFilteredData(filteredClients);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching clientes: ", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchEmpresaId = async () => {
      try {
        const id = await AsyncStorage.getItem('@empresa_id');
        if (id) {
          setEmpresaId(id);
          fetchClientes(id);
        } else {
          Alert.alert('Error', 'No se pudo obtener el ID de la empresa.');
        }
      } catch (error) {
        Alert.alert('Error', 'Ocurrió un error al obtener el ID de la empresa.');
      }
    };
    fetchEmpresaId();
  }, [fetchClientes]);

  const loadMoreItems = useCallback(() => {
    setVisibleItemCount((prevItemCount) => prevItemCount + 10);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setAnimationKey(Date.now());
      setVisibleItemCount(7);
      if (empresaId) {
        fetchClientes(empresaId);
      }
    }, [empresaId, fetchClientes])
  );

  const handleSearch = useCallback((text) => {
    setSearchQuery(text);
    setIsSearching(true);
    const formattedQuery = text.toLowerCase();
    const newData = clientesConNotas.filter((item) => {
      if (selectedOption === "cliente") {
        return item.nombre.toLowerCase().includes(formattedQuery);
      } else if (selectedOption === "cuenta") {
        return item.cuenta.toLowerCase().includes(formattedQuery);
      }
    });
    setFilteredData(newData);
    setIsSearching(false);
  }, [clientesConNotas, selectedOption]);

  const handleOptionChange = useCallback((option) => {
    setSelectedOption(option);
  }, []);

  const renderItem = useCallback(({ item, index }) => (
    isSearching ? (
      <ClientItem
        client={item}
        onSelect={() =>
          navigation.navigate("ClientPaymentScreen", { itemClient: item })
        }
      />
    ) : (
      <Cascading
        delay={index > 9 ? 0 : 400 + 100 * index}
        animationKey={animationKey}
      >
        <ClientItem
          client={item}
          onSelect={() =>
            navigation.navigate("ClientPaymentScreen", { itemClient: item })
          }
        />
      </Cascading>
    )
  ), [animationKey, navigation, isSearching]);

  const keyExtractor = useCallback((item) => item.cliente_id.toString(), []);

  const getItemLayout = useCallback((data, index) => ({
    length: 70,
    offset: 70 * index,
    index,
  }), []);

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
                <StyledText boldCenterText style={styles.avi}>
                  Clientes
                </StyledText>
              </View>
            </View>
          </Cascading>
          <Cascading delay={200} animationKey={animationKey}>
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={handleSearch}
              selectedOption={selectedOption}
              onOptionChange={handleOptionChange}
            />
          </Cascading>
        </View>
      </View>
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.secondary} />
        ) : (
          <FlatList
            data={filteredData.slice(0, visibleItemCount)}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            ListHeaderComponent={<View style={{ height: 10 }} />}
            ListFooterComponent={<View style={{ height: 10 }} />}
            onEndReached={loadMoreItems}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 7,
  },
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: theme.colors.secondary,
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingVertical: 10,
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
    backgroundColor: theme.colors.skyBlue,
    marginLeft: 10,
    height: 60,
    borderRadius: 25,
  },
  avi: {
    marginRight: 40,
  },
  listContainer: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
});

export default ClientSearchScreen;
