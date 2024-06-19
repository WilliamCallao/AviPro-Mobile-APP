import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import NewScreen from '../screens/HomeScreen';
import ClientSearchScreen from '../screens/ClientSearch/ClientSearchScreen';
import BillScreen from '../screens/BillScreen'
import ClientPaymentScreen from '../screens/ClientPaymentScreen';
import PayScreen from '../screens/PayScreen';
import AutomaticPayScreen from '../screens/AutomaticPayScreen';
import SelectPaymentMethodScreen from '../screens/SelectPaymentMethodScreen';
import FacturaScreen from '../screens/FacturaScreen';
import ProfileScreen from '../screens/ProfileScreen';
// import HistoryScreen from '../screens/HistoryScreen';
// import OthersScreen from '../screens/OthersScreen';
import ActivationScreen from '../screens/ActivationScreen';
import LoginScreen from '../screens/LoginScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import SelectPayModeScreen from '../screens/SelectPayModeScreen';
import SelectPaymentMethodScreen2 from '../screens/SelectPaymentMethodScreen2';
import { theme } from '../assets/Theme';

const Stack = createNativeStackNavigator();

// const Tab = createBottomTabNavigator();

// const TabIcon = ({ name, color, size }) => {
//   return <Icon name={name} color={color} size={size} />;
// };


function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ActivationScreen" 
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
      </Stack.Navigator>    
    </NavigationContainer>
  );
}

// function TabNavigator() {
//   return (
//     <Tab.Navigator
//     screenOptions={{
//       tabBarActiveTintColor: theme.colors.tertiary,
//       tabBarInactiveTintColor: theme.colors.slateGrey,
//       headerShown: false,
//       }}
//     >
//       <Tab.Screen
//       name="Inicio"
//       component={NewScreen}
//       options={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => (
//           <TabIcon name={focused ? 'home' : 'home-outline'} color={color} size={size}/>
          
//         ),
//       })}
//     />
//       <Tab.Screen
//       name="Historial"
//       component={HistoryScreen}
//       options={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => (
//           <TabIcon name={focused ? 'newspaper' : 'newspaper-outline'} color={color} size={size} />
//         ),
//         tabBarBadge: 3, //borrar
//       })}
//     />
//       <Tab.Screen
//       name="Otros"
//       component={OthersScreen}
//       options={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => (
//           <TabIcon name={focused ? 'menu' : 'menu-outline'} color={color} size={size} />
//         ),
//       })}
//       />
//     </Tab.Navigator>
//   );
// }

export default AppNavigator;
