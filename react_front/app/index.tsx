import React from 'react';
import {View, StyleSheet, Image, Dimensions, Platform} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {Link} from "expo-router";

export default function WelcomeScreen() {
    return (
        <View style={styles.main}>
            <View style={styles.container}>
                <View style={styles.form}>
                    {/*<Image*/}
                    {/*    source={require('../assets/logo.jpg')}*/}
                    {/*    style={styles.image}*/}
                    {/*    resizeMode="contain"*/}
                    {/*/>*/}
                    <View style={styles.buttonContainer}>
                        <Link href={"/login"} asChild>
                            <Button style={styles.button}>
                                <Text style={{color: 'white'}}>
                                    Login
                                </Text>
                            </Button>
                        </Link>
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
        </View>
    );
}

// const windowWidth = Dimensions.get('window').width;
// const windowHeight = Dimensions.get('window').height;
// const webContW = windowWidth*0.5;
// const webContH = windowHeight*0.6;
// const othContW = windowWidth*0.8;
// const othContH = windowHeight*0.35;

const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    container: {
        // width: Platform.OS === "web" ? webContW : othContW,
        // height: Platform.OS === "web" ? webContH : othContH,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
    },
    image: {
        // height: Platform.OS === "web" ? webContH*0.9 : othContH*0.7,
        // width: Platform.OS === "web" ? webContW*0.9 : othContW*0.9,
        width: '100%',
        aspectRatio: 1,
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 0,
    },
    form: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
        alignItems: 'center',
        paddingVertical: 10,
        maxWidth: 400,
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
        backgroundColor: 'black',
        borderRadius: 10,
        marginVertical: 5,
        alignItems: 'center',
    },
    buttonSpacer: {
        width: 20,
    },
});
