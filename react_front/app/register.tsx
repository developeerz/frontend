import React, { useState } from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import {Link} from "expo-router";

type FormData = {
    name: string;
    surname: string;
    patronymic?: string;
    account: string;
    password: string;
};

export default function RegisterScreen() {
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [passwordVisible, setPasswordVisible ] = useState(false);

    const onSubmit = (data: FormData) => {
        alert(data)
    };

    return (
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
                    name="patronymic"
                    rules={{
                        pattern: {
                            value: /^[A-Za-zА-Яа-я]+$/,
                            message: "Only one word without numbers",
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            label="Patronymic"
                            value={value}
                            onChangeText={onChange}
                            mode="outlined"
                            style={styles.input}
                            error={!!errors.patronymic}
                        />
                    )}
                />
                {errors.patronymic && <Text style={styles.error}>{errors.patronymic.message}</Text>}

                <Controller
                    control={control}
                    name="account"
                    rules={{
                        required: "Email is required",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Enter a valid email",
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            label="Account (Email)"
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
    );
}

const styles = StyleSheet.create({
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
});
