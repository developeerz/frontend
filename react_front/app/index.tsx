import React from 'react';
import {View, StyleSheet, Image, Dimensions, Platform} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {Link} from "expo-router";

export default function WelcomeScreen() {
    return (
        <View style={styles.main}>
            <View style={styles.container}>
                <Image
                    source={require('../assets/logo.jpg')}
                    style={styles.image}
                    resizeMode="contain"
                />

                <View style={styles.form}>
                    <Link href={"/login"} asChild>
                        <Button style={styles.button}>
                            <Text style={{color: 'white'}}>
                                Login
                            </Text>
                        </Button>
                    </Link>
                    <View style={styles.buttonSpacer}/>
                    <Link href={"/register"} asChild>
                        <Button style={styles.button}>
                            <Text style={{color: 'white'}}>
                                Register
                            </Text>
                        </Button>
                    </Link>
                </View>
            </View>
        </View>
    );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const webContW = windowWidth*0.5;
const webContH = windowHeight*0.6;
const othContW = windowWidth*0.8;
const othContH = windowHeight*0.35;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    container: {
        width: Platform.OS === "web" ? webContW : othContW,
        height: Platform.OS === "web" ? webContH : othContH,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        height: Platform.OS === "web" ? webContH*0.9 : othContH*0.7,
        width: Platform.OS === "web" ? webContW*0.9 : othContW*0.9,
        resizeMode: 'contain',
        flex: 2,
    },
    form: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    link: {
        marginTop: 10,
        textAlign: 'center',
        fontSize: 16,
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        marginTop: 10,
        backgroundColor: 'black',
        borderRadius: 10,
        width: '100%',
        flex: 2,
    },
    buttonSpacer: {
        width: 20,
    },
});
