import "../global.css";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import checkDb from "@/utils/isDbWorking";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StripeProvider } from '@stripe/stripe-react-native';
import Toast from "react-native-toast-message";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { I18nextProvider } from "react-i18next";
import UserAiBookingContextProvider from "@/utils/UserAiBookingContext";
import i18n from "@/i18n";
import { CurrencyProvider } from "@/utils/CurrencyContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function RootLayout() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
      },
    },
  });


  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "715134125945-t2a026p2bc67jn2pc5pjvg8qq9n6fug6.apps.googleusercontent.com",
      iosClientId: "715134125945-lpc5ncghsqaqp6ct7jlk56c0sv5q4j4g.apps.googleusercontent.com",
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await checkDb();
        console.log("DataBase", data);
      } catch (error) {
        console.log("DatabaseError", error);
      }
    };
    fetchData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <UserAiBookingContextProvider>
          <StripeProvider publishableKey={'pk_test_51Ph9ImRvSiBdRdteNO5GEbaEfT6aeUNrQXA5YHtUbrqko3tFz9fksfUetdxiyJUYFuZj63p9L870vdvwf42Mu9t700pUBmxZVz'}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <SafeAreaProvider>
                <CurrencyProvider>
                  <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
                    <Stack
                      screenOptions={{
                        headerShown: false,
                      }}
                    >
                      <Stack.Screen name="(tabs)" />
                      <Stack.Screen name="welcome" />
                      <Stack.Screen name="finishsignup" />
                      <Stack.Screen name="wallet" />
                      <Stack.Screen name="+not-found" />
                    </Stack>
                    <Toast autoHide={true} visibilityTime={3000} />
                  </SafeAreaView>
                </CurrencyProvider>
              </SafeAreaProvider>
            </GestureHandlerRootView>
          </StripeProvider>
        </UserAiBookingContextProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff", // adjust this if your app uses dark mode
  },
});
