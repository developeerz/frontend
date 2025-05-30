import {ExternalPathString, Href, Link, RelativePathString, UnknownInputParams, useRouter} from "expo-router";
import {ActivityIndicator, SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {Controller, useForm} from 'react-hook-form';
import {Picker} from "@react-native-picker/picker";
import React, {useState} from 'react';
import {useAuth} from './AuthContext';
import {useFlags} from "react-native-flagsmith/react";

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
    const [selectedValue, setSelectedValue] = useState('restaurant');

    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<String | null>(null);

    const router = useRouter();
    const { setToken } = useAuth();

    const flags = useFlags(['restoran_choiser']);
    const isRestoranChoiserEnabled = flags.restoran_choiser.enabled;

    const onSubmit = async (data: FormData): Promise<void> => {
        setResponse(null);
        setError(null);
        setLoading(true);

        try {
            const res = await fetch('http://localhost/api/web-gateway/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: "include",
            });

            if (res.ok && res.status === 200) {
                const resJson: ApiResponse = await res.json();
                const token = resJson.access;

                if (token) {
                    setToken(token);
                }

                const json : ApiResponse = {success : true, message: 'Login successful!', data: token};
                setResponse(json);
                setError(null);
            } else if (res.status === 400) {
                setError('Bad request');
            } else if (res.status === 401) {
                setError('Unauthorized');
            } else if (res.status === 404) {
                setError('Not found');
            } else if (res.status === 500) {
                setError('Server error');
            } else {
                setError('Unexpected error occurred');
            }
        } catch (err) {
            setError(`Error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

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
                    { isRestoranChoiserEnabled &&
                        <Picker
                            selectedValue={selectedValue}
                            style={styles.picker}
                            onValueChange={(itemValue: React.SetStateAction<string>) => setSelectedValue(itemValue)}
                        >
                            <Picker.Item label="Restaurant" value="restaurant" />
                            <Picker.Item label="Cafe" value="cafe" />
                            <Picker.Item label="Pub" value="pub" />
                        </Picker>}
                </View>

                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.bookButton} onPress={() => navigateTo('/scheme')}>
                        <Text style={styles.bookButtonText}>Book</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.headerButton}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    <View style={styles.buttonSpacer}/>

                    <TouchableOpacity style={styles.registerButton} onPress={() => navigateTo('/register')}>
                        <Text style={styles.registerButtonText}>Registration</Text>
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
                                value: /^@[a-zA-Z][a-zA-Z0-9_]{3,31}$/,
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
                            <Text>{response.message}</Text>
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
        backgroundColor: '#ff0000',
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
        backgroundColor: '#000000',
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
        borderRadius: 3,
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
