import {Stack} from 'expo-router';
import {AuthProvider} from "@/app/AuthContext";

export default function Layout() {
    return (
        <AuthProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </AuthProvider>
);
}
