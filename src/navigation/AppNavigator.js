import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import NewScreen from '../screens/Home/HomeScreen';
import ClientSearchScreen from '../screens/ClientSearch/ClientSearchScreen';
import BillScreen from '../screens/BillScreen';
import ClientPaymentScreen from '../screens/NotesScreen/ClientPaymentScreen';
import PayScreen from '../screens/PayScreen/PayScreen';
import AutomaticPayScreen from '../screens/AutomaticPayScreen';
import SelectPaymentMethodScreen from '../screens/SelectPaymentMethodScreen';
import FacturaScreen from '../screens/FacturaScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ActivationScreen from '../screens/ActivationScreen/ActivationScreen';
import LoginScreen from '../screens/LoginScreen';
import SelectPayModeScreen from '../screens/SelectPayModeScreen';
import SelectPaymentMethodScreen2 from '../screens/SelectPaymentMethodScreen2';
import CobradoresScreen from '../screens/CobradoresScreen/CobradoresScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import { theme } from '../assets/Theme';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkEmpresaId = async () => {
      try {
        const empresaId = await AsyncStorage.getItem('@empresa_id');
        if (empresaId) {
          setInitialRoute('NewScreen');
        } else {
          setInitialRoute('ActivationScreen');
        }
      } catch (error) {
        console.error('Error checking empresa_id in AsyncStorage:', error);
      }
    };

    checkEmpresaId();
  }, []);

  if (initialRoute === null) {
    // While we're checking the AsyncStorage, we can show a loading spinner or any kind of splash screen.
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.secondary }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} 
      screenOptions={{
      animationEnabled: false,
      headerShown: false,
      }}>
        <Stack.Screen 
          name="NewScreen" 
          component={NewScreen}
        />
        <Stack.Screen 
          name="ClientSearchScreen" 
          component={ClientSearchScreen}
        />
        <Stack.Screen 
          name="BillScreen" 
          component={BillScreen}
        />
        <Stack.Screen
          name='ClientPaymentScreen'
          component={ClientPaymentScreen}
        />
        <Stack.Screen
          name='PayScreen'
          component={PayScreen}
        />
        <Stack.Screen
          name='AutomaticPayScreen'
          component={AutomaticPayScreen}
        />
        <Stack.Screen
          name='SelectPaymentMethodScreen'
          component={SelectPaymentMethodScreen}
        />
        <Stack.Screen 
          name="Factura" 
          component={FacturaScreen}
        />
        <Stack.Screen
          name='ProfileScreen'
          component={ProfileScreen}
        />
        <Stack.Screen
          name='ActivationScreen'
          component={ActivationScreen}
        />
        <Stack.Screen
          name='LoginScreen'
          component={LoginScreen}
        />
        <Stack.Screen
          name='SelectPayModeScreen'
          component={SelectPayModeScreen}
        />
        <Stack.Screen
          name='SelectPaymentMethodScreen2'
          component={SelectPaymentMethodScreen2}
        />
        <Stack.Screen
          name='CobradoresScreen'
          component={CobradoresScreen}
        />
      </Stack.Navigator>    
    </NavigationContainer>
  );
}

export default AppNavigator;
