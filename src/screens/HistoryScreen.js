import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../assets/Theme';

const OthersScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={{ color: theme.colors.primaryText }}>Sigan Viendo Historial...</Text>
        <StatusBar style="light" backgroundColor={theme.colors.secondary}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
});

export default OthersScreen;