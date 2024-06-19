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

const SelectPaymentMethodScreen2 = ({ route }) => {
    const { clientInfo } = route.params;
    const { criteria } = route.params;
    const navigation = useNavigation();
    const [animationKey, setAnimationKey] = useState(Date.now());
    useFocusEffect(
        useCallback(() => {
            setAnimationKey(Date.now());
        }, [])
    );

    const destino = "AutomaticPayScreen";

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
                                <Text style={styles.avi}>Metodo de pago</Text>
                            </View>
                        </View>
                    </Cascading>
                </View>
            </View>
            <View>
                <TouchableWithoutFeedback onPress={() => navigation.navigate(destino, { clientInfo ,criteria, method:"efectivo" })}>
                    <View style = {styles.itemContainer}>
                        <StyledText boldText>En Efectivo</StyledText>
                        <Icon name="right" size={30} color="black" />
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => navigation.navigate(destino, { clientInfo, criteria,method:"transferencia" })}>
                    <View style = {styles.itemContainer}>
                        <StyledText boldText>Transferencia Bancaria</StyledText>
                        <Icon name="right" size={30} color="black" />
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => navigation.navigate(destino, { clientInfo, criteria, method:"cheque" })}>
                    <View style = {styles.itemContainer}>
                        <StyledText boldText>Cheque</StyledText>
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
        backgroundColor: theme.colors.primary,
    },
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: theme.colors.skyBlue,
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
        marginRight: 60,
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

export default SelectPaymentMethodScreen2;
