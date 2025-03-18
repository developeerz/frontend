import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {Link} from "expo-router";

export default function WelcomeScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text variant="headlineLarge" style={styles.title}>Welcome!</Text>
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    form: {
        width: '90%',
        maxWidth: 400,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
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
    },
});
