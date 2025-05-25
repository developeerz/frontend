import {Stack} from 'expo-router';
import {AuthProvider} from "@/app/AuthContext";
import flagsmith from "react-native-flagsmith";
import {FlagsmithProvider} from "react-native-flagsmith/react";

export default function Layout() {
    return (
        <FlagsmithProvider
            flagsmith={flagsmith}
            options={{
                environmentID: 'iBPwcngpEiMQhJbmAsUfLy',
            }}>
            <AuthProvider>
                <Stack
                    screenOptions={{
                        headerShown: false,
                    }}
                />
            </AuthProvider>
        </FlagsmithProvider>
    );
}
