import React, { useEffect } from 'react';
import { Button, View } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import AppNavigator from './src/navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  return (
    <MenuProvider>
      <AppNavigator />
    </MenuProvider>
  );
};

export default App;
