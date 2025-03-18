import React, { useState } from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import {Link} from "expo-router";

type FormData = {
    account: string;
    password: string;
};

export default function LoginScreen() {
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [ passwordVisible, setPasswordVisible ] = useState(false);

    const onSubmit = (data: FormData) => {
        alert(data)
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text variant="headlineLarge" style={styles.title}>Login</Text>

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
                    Login
                </Button>
                <TouchableOpacity>
                    <Link replace href={"/register"} style={styles.link}>
                        I have not account yet
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
