import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {Link} from "expo-router";

export default function WelcomeScreen() {
    return (
        <View style={styles.main}>
            <View style={styles.container}>
                <View style={styles.form}>
                    <Image
                        source={require('../assets/logo.jpg')}
                        style={styles.image}
                        resizeMode="contain"
                    />
                    <View style={styles.buttonContainer}>
                        <Link href={"/register"} asChild>
                            <Button style={styles.button}>
                                <Text style={{color: 'white'}}>
                                    Registration
                                </Text>
                            </Button>
                        </Link>
                        <Link href={"/login"} asChild>
                            <Button style={styles.button}>
                                <Text style={{color: 'white'}}>
                                    Login
                                </Text>
                            </Button>
                        </Link>
                        <Link href={"/scheme"} asChild>
                            <Button style={styles.button}>
                                <Text style={{color: 'white'}}>
                                    Book
                                </Text>
                            </Button>
                        </Link>
                    </View>

                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
    },
    image: {
        width: '100%',
        aspectRatio: 1,
        marginBottom: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        overflow: 'hidden',
        resizeMode: 'cover',
        maxWidth: 388,
        maxHeight: 295,
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
