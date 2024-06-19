import React, { useState, useCallback } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Cascading from "../animation/CascadingFadeInView";
import { theme } from "../assets/Theme";
import StyledText from "../utils/StyledText";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const SelectPayModeScreen = ({ route }) => {
    const { clientInfo } = route.params;
    
    const navigation = useNavigation();
    const [animationKey, setAnimationKey] = useState(Date.now());
    useFocusEffect(
        useCallback(() => {
            setAnimationKey(Date.now());
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="ligth" backgroundColor={theme.colors.secondary} />
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
                                <Text style={styles.avi}>Criterio de Cancelación</Text>
                            </View>
                        </View>
                    </Cascading>
                </View>
            </View>
            <View>
                <TouchableWithoutFeedback onPress={() => navigation.navigate("SelectPaymentMethodScreen2", { clientInfo, criteria:"PEPS" })}>
                    <View style = {styles.itemContainer}>
                        <StyledText boldText>PEPS (Primera nota en entrar primera en pagar)</StyledText>
                        <Icon name="right" size={30} color="black" />
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => navigation.navigate("SelectPaymentMethodScreen2", { clientInfo, criteria:"UEPS" })}>
                    <View style = {styles.itemContainer}>
                        <StyledText boldText>UEPS (Ultima nota en entrar primera en pagar)</StyledText>
                        <Icon name="right" size={30} color="black" />
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => navigation.navigate("SelectPaymentMethodScreen2", { clientInfo, criteria:"MayorMenor" })}>
                    <View style = {styles.itemContainer}>
                        <StyledText boldText>De mayor importe a menor</StyledText>
                        <Icon name="right" size={30} color="black" />
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => navigation.navigate("SelectPaymentMethodScreen2", { clientInfo, criteria:"MenorMayor" })}>
                    <View style = {styles.itemContainer}>
                        <StyledText boldText>De menor importe a mayor</StyledText>
                        <Icon name="right" size={30} color="black" />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    cover: {
        backgroundColor: theme.colors.primary,
        zIndex: 1,
    },
    up: {
        backgroundColor: theme.colors.skyBlue,
    },
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: theme.colors.tertiary,
    },
    header: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 20,
        alignItems: "center",
    },
    back: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.otherWhite,
        borderRadius: 20,
        width: 60,
        height: 60,
    },
    aviContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    avi: {
        fontWeight: "bold",
        fontSize: 22,
    },
    itemContainer: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginVertical: 8,
        marginHorizontal: 20,
        borderWidth: 2,
        borderRadius: 20,
        borderColor: theme.colors.otherWhite,
        overflow: 'hidden',
        flexDirection: "row",
        justifyContent: "space-between",
    }
});

export default SelectPayModeScreen;
