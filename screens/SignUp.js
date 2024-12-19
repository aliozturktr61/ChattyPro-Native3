import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Snackbar } from "react-native-paper";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase"; // Firebase ayarları dosyasından import
import { CommonActions } from "@react-navigation/native";

const SignUp = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Yükleniyor durumu için
  const [isLoading, setIsLoading] = useState(false);
  // Hata mesajları için
  const [error, setError] = useState("");
  // Snackbar mesaj penceresi için
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const createAccount = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Kullanıcı oluşturma
      const response = await createUserWithEmailAndPassword(auth, email, password);

      // Kullanıcı profili güncelleme
      await updateProfile(response.user, { displayName: name });

      // Kayıt başarılı olduğunda ana ekrana yönlendirme
      setIsLoading(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Main" }], // "Main" doğru hedef ekran adı olmalı
        })
      );
    } catch (e) {
      setIsLoading(false);
      setError(e.message);
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={{ margin: 16 }}>
      <TextInput
        label="Name"
        value={name}
        onChangeText={(text) => setName(text)}
        style={{ marginBottom: 12 }}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        style={{ marginBottom: 12 }}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={{ marginBottom: 16 }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button compact onPress={() => navigation.navigate("SignIn")}>
          Sign In
        </Button>
        <Button
          mode="contained"
          onPress={createAccount}
          loading={isLoading}
          disabled={isLoading}
        >
          Sign Up
        </Button>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {error}
      </Snackbar>
    </View>
  );
};

export default SignUp;