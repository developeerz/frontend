import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {ExternalPathString, Href, Link, RelativePathString, UnknownInputParams, useRouter} from "expo-router";

type FormData = {
    name: string;
    surname: string;
    account: string;
    password: string;
};

export default function RegisterScreen() {
    const {control, handleSubmit, formState: {errors}} = useForm<FormData>();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState('ресторан');

    const router = useRouter();

    const onSubmit = (data: FormData) => {
        alert(data)
    };

    const navigateTo = (url: string | { pathname: RelativePathString; params?: UnknownInputParams; } |
                    { pathname: ExternalPathString; params?: UnknownInputParams; } | { pathname: `/`; params?: UnknownInputParams; } |
                    { pathname: `/login`; params?: UnknownInputParams; } | { pathname: `/register`; params?: UnknownInputParams; } |
                    { pathname: `/_sitemap`; params?: UnknownInputParams; }) => {
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

                    <TouchableOpacity style={styles.registerButton}>
                        <Text style={styles.registerButtonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.container}>
                <View style={styles.form}>
                    <Text variant="headlineLarge" style={styles.title}>Register</Text>

                    <Controller
                        control={control}
                        name="name"
                        rules={{
                            required: "Name is required",
                            pattern: {
                                value: /^[A-Za-zА-Яа-я]+$/,
                                message: "Only one word without numbers",
                            },
                        }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                label="Name"
                                value={value}
                                onChangeText={onChange}
                                mode="outlined"
                                style={styles.input}
                                error={!!errors.name}
                            />
                        )}
                    />
                    {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

                    <Controller
                        control={control}
                        name="surname"
                        rules={{
                            required: "Surname is required",
                            pattern: {
                                value: /^[A-Za-zА-Яа-я]+$/,
                                message: "Only one word without numbers",
                            },
                        }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                label="Surname"
                                value={value}
                                onChangeText={onChange}
                                mode="outlined"
                                style={styles.input}
                                error={!!errors.surname}
                            />
                        )}
                    />
                    {errors.surname && <Text style={styles.error}>{errors.surname.message}</Text>}

                    <Controller
                        control={control}
                        name="account"
                        rules={{
                            required: "Telegram is required",
                            pattern: {
                                value: /^@?[a-zA-Z][a-zA-Z0-9_]{3,31}$/,
                                message: "Enter a valid @telegram",
                            },
                        }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                label="Account (@telegram)"
                                value={value}
                                onChangeText={onChange}
                                mode="outlined"
                                style={styles.input}
                                error={!!errors.account}
                            />
                        )}
                    />
                    {errors.account && <Text style={styles.error}>{errors.account.message}</Text>}

                    <Controller
                        control={control}
                        name="password"
                        rules={{ required: "Password is required" }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                label="Password"
                                value={value}
                                onChangeText={onChange}
                                mode="outlined"
                                style={styles.input}
                                secureTextEntry={!passwordVisible}
                                right={
                                    <TextInput.Icon
                                        icon={passwordVisible ? "eye-off" : "eye"}
                                        onPress={() => setPasswordVisible(!passwordVisible)}
                                    />
                                }
                                error={!!errors.password}
                            />
                        )}
                    />
                    {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

                    <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
                        Register
                    </Button>
                    <TouchableOpacity>
                        <Link replace href="/login" style={styles.link}>
                            I already have an account
                        </Link>
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
    },
    registerButtonText: {
        color: '#000',
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
