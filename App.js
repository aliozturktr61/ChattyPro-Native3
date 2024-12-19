import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatList from "./screens/ChatList";
import Chat from "./screens/Chat";
import Settings from "./screens/Settings";
import SignIn from "./screens/SingIn";
import SignUp from "./screens/SignUp";
import { Ionicons } from "@expo/vector-icons";
import { Provider, DefaultTheme } from "react-native-paper";
import { auth } from "./firebase"; // Firebase'den auth import edin
import { onAuthStateChanged } from "firebase/auth";

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const TabsNavigator = () => (
  <Tabs.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => (
        <Ionicons
          name={route.name === "ChatList" ? "chatbubbles" : "settings"}
          color={color}
          size={size}
        />
      ),
    })}
  >
    <Tabs.Screen name="ChatList" component={ChatList} />
    <Tabs.Screen name="Settings" component={Settings} />
  </Tabs.Navigator>
);

const SplashScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#6200ee" />
  </View>
);

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isLoggedIn === null) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Main"
            component={TabsNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Chat" component={Chat} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ presentation: "fullScreenModal" }}
          />
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ presentation: "fullScreenModal" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#2196f3",
    accent: "#e91e63",
  },
};
const App = () => {
  return (
    <NavigationContainer>
      <Provider theme={theme}>
        <AppNavigator />
      </Provider>
    </NavigationContainer>
  );
};

export default App;