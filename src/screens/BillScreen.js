import React from 'react';
import { SafeAreaView, TouchableOpacity, View, Image, StyleSheet, Text } from 'react-native';
import zigzag from '../assets/zigzagBorder.png';
import { Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;
import Icon from 'react-native-vector-icons/AntDesign';
import { theme } from '../assets/Theme'
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const primary = theme.colors.primary;

const Receipt = () => {
    const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
    <StatusBar style="ligth" backgroundColor={primary}/>
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Icon name="back" size={30} color="white" />
          </TouchableOpacity>
            <View style={styles.aviContainer}>
              <Text style={styles.avi}>Recibo</Text>
            </View>
          </View>
        <View style={styles.receiptContainer}>
            <Image source={zigzag} style={styles.zigzagBorderBottom} resizeMode="repeat" />
            <View style={styles.receiptContent}>
                <View style={styles.textTitleContainer}>
                    <Text style={styles.receiptTextTitle}>CASH RECEIPT</Text>
                </View>            
                <View style={styles.dottedLine} />
                
                <View style={styles.textLine}>
                    <Text>Date:</Text>
                    <Text>08/03/2024</Text>
                </View>
                <View style={styles.textLine}>
                    <Text>Store manager:</Text>
                    <Text>John Doe</Text>
                </View>
                <View style={styles.textLine}>
                    <Text>Cashier:</Text>
                    <Text>Peter Smith</Text>
                </View>
                <View style={styles.dottedLine} />
                
                <View style={styles.textLine}>
                    <Text>nota N° 72:</Text>
                    <Text>125 Bs</Text>
                </View>
                <View style={styles.textLine}>
                    <Text>nota N° 92:</Text>
                    <Text>320 Bs</Text>
                </View>
                <View style={styles.textLine}>
                    <Text>nota N° 04:</Text>
                    <Text>12 Bs</Text>
                </View>
            </View>
            <Image source={zigzag} style={styles.zigzagBorder} resizeMode="repeat" />
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity activeOpacity={0} style={styles.button}>
                <Text style={styles.buttonText}>Emitidas</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0} style={styles.button}>
                <Text style={styles.buttonText}>Imprimir</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        paddingVertical: 20,
        backgroundColor: 'black',
    },
    receiptContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        paddingBottom: 30,
    },
    zigzagBorder: {
        width: screenWidth - 40,
        height: 20,
        zIndex: 1,
    },
    dotsContainer: {
        justifyContent: 'center',
        alignItems: "center",
    },
    dots: {
        justifyContent: 'center',
        backgroundColor: 'blue',
    },
    dottedLine: {
        borderBottomWidth: 3,
        borderBottomColor: 'black',
        borderStyle: 'dotted',
        marginVertical: 8,
    },
    receiptContent: {
        justifyContent: 'center',
        paddingHorizontal: 40,
        minHeight: 400,
        width: screenWidth - 40,
        backgroundColor: theme.colors.primary,
        elevation: 60,
        shadowColor: theme.colors.tertiary,
    },
    zigzagBorderBottom: {
        width: screenWidth - 40,
        height: 20,
        transform: [{ rotate: '180deg' }],
        zIndex: 1,
    },
    back: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.tertiary,
        borderRadius: 20,
        width: 60,
        height: 60,
        marginLeft: 20,
      },
    textTitleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      aviContainer: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      avi: {
        fontWeight: 'bold',
        fontSize: 22,
        marginRight: 80,
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: screenWidth - 40,
      },
      button: {
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        paddingVertical: 15,
        paddingHorizontal: 25,
        backgroundColor: theme.colors.tertiary,
        borderRadius: 22,
        width: screenWidth/2 - 30,
      },
      buttonText: {
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: "bold",
      },
  });

export default Receipt;
