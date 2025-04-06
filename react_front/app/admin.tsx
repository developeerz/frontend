import {View, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
import { Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {ExternalPathString, Href, RelativePathString, UnknownInputParams, useRouter} from "expo-router";

export default function RegisterScreen() {
    const [selectedValue, setSelectedValue] = useState('ресторан');

    const router = useRouter();

    const navigateTo = (url: string | { pathname: RelativePathString; params?: UnknownInputParams; } |
        { pathname: ExternalPathString; params?: UnknownInputParams; } | { pathname: `/`; params?: UnknownInputParams; } |
        { pathname: `/login`; params?: UnknownInputParams; } | { pathname: `/register`; params?: UnknownInputParams; } |
        { pathname: `/_sitemap`; params?: UnknownInputParams; } | { pathname: `/scheme`; params?: UnknownInputParams; }) => {
        router.replace(url as Href);
    }

    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.header}>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedValue}
                        style={styles.picker}
                        onValueChange={(itemValue: React.SetStateAction<string>) => setSelectedValue(itemValue)}
                    >
                        <Picker.Item label="Ресторан" value="ресторан" />
                        <Picker.Item label="Кафе" value="кафе" />
                        <Picker.Item label="Бар" value="бар" />
                    </Picker>
                </View>

                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.bookButton}>
                        <Text style={styles.bookButtonText}>Забронировать</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.headerButton} onPress={() => navigateTo('/login')}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    <View style={styles.buttonSpacer}/>

                    <TouchableOpacity style={styles.registerButton} onPress={() => navigateTo('/register')}>
                        <Text style={styles.registerButtonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>



        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 5,
        width: '15%',
    },
    picker: {
        height: 40,
    },
    buttonGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: '#808080',
    },
    bookButton: {
        backgroundColor: '#e0a0a0',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    bookButtonText: {
        color: 'white',
    },
    registerButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: '#808080',
    },
    registerButtonText: {
        color: 'white',
    },
    buttonText: {
        color: 'white',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    link: {
        marginTop: 10,
        textAlign: 'center',
        fontSize: 16,
    },
    form: {
        width: '90%',
        maxWidth: 400,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
        backgroundColor: 'black',
        borderRadius: 10,
    },
    buttonSpacer: {
        width: 10,
    },
});
