import {ExternalPathString, Href, Link, RelativePathString, UnknownInputParams, useRouter} from "expo-router";
import {View, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator} from 'react-native';
import {TextInput, Button, Text} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {Picker} from "@react-native-picker/picker";
import React, { useState } from 'react';

interface FormData {
    telegram: string;
    password: string;
}

interface ApiResponse {
    success?: boolean;
    message?: string;
    data?: any;
    [key: string]: any;
}

export default function LoginScreen() {
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [ passwordVisible, setPasswordVisible ] = useState(false);
    const [selectedValue, setSelectedValue] = useState('ресторан');

    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<String | null>(null);

    const router = useRouter();

    const onSubmit = async (data: FormData): Promise<void> => {
        setResponse(null);
        setError(null);
        setLoading(true);

        try {
            const res = await fetch('http://localhost/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error(`HTTP error: ${res.status}`);
            }

            const json: ApiResponse = await res.json();
            setResponse(json);
        } catch (err) {
            setError(`Error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
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

                    <TouchableOpacity style={styles.headerButton}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    <View style={styles.buttonSpacer}/>

                    <TouchableOpacity style={styles.registerButton} onPress={() => navigateTo('/register')}>
                        <Text style={styles.registerButtonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.container}>
                <View style={styles.form}>
                    <Text variant="headlineLarge" style={styles.title}>Login</Text>

                    <Controller
                        control={control}
                        name="telegram"
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
                                error={!!errors.telegram}
                            />
                        )}
                    />
                    {errors.telegram && <Text style={styles.error}>{errors.telegram.message}</Text>}

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

                    <Button
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                        style={styles.button}
                        disabled={loading}>
                        {loading ? "Sending..." : "Login"}
                    </Button>
                    <TouchableOpacity>
                        <Link replace href={"/register"} style={styles.link}>
                            I have not account yet
                        </Link>
                    </TouchableOpacity>

                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size={"large"} color={"#0000ff"} />
                            <Text>Sending data...</Text>
                        </View>
                    )}

                    {response && (
                        <View style={styles.responseContainer}>
                            <Text style={styles.responseTitle}>Server answer:</Text>
                            <Text>{JSON.stringify(response, null, 2)}</Text>
                        </View>
                    )}

                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>Error: {error}</Text>
                        </View>
                    )}
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
        color: '#000',
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
    loadingContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    responseContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#e6f7ff',
        borderRadius: 5,
    },
    responseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    errorContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#ffebee',
        borderRadius: 5,
    },
    errorText: {
        color: 'red',
    },
});
