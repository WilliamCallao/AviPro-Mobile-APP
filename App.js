// App.js
import React, { useEffect } from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import AppNavigator from './src/navigation/AppNavigator';
import useLogStore from './src/stores/useLogStore';

const App = () => {
  const initialize = useLogStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <MenuProvider>
      <AppNavigator />
    </MenuProvider>
  );
};

export default App;
