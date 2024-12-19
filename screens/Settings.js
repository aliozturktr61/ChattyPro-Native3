import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Avatar, Title, Subheading, Button } from "react-native-paper";
import { auth } from "../firebase"; // Firebase ayarlarını doğru import edin
import { onAuthStateChanged, signOut } from "firebase/auth";

const Settings = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Oturum açmış kullanıcıyı dinle
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setName(user?.displayName || "Anonymous");
        setEmail(user?.email || "No Email");
      } else {
        // Oturum kapatılmışsa kullanıcıyı giriş sayfasına yönlendir
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate("SignIn");
        }
      }
    });

    return unsubscribe; // Bileşen unmount olduğunda dinleyiciyi temizle
  }, [navigation]);

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Oturumu kapat
    } catch (error) {
      console.error("Sign-out error:", error.message);
    }
  };

  return (
    <View style={{ alignItems: "center", marginTop: 16 }}>
      <Avatar.Text
        size={64}
        label={name
          .split(" ")
          .reduce((prev, current) => prev + (current[0] || ""), "")}/* kullanıcı ismi bir kaç kelimeden oluşuyorsa sadece ilk harflerini almak için */
      />
      <Title>{name}</Title>
      <Subheading>{email}</Subheading>
      <Button mode="contained" onPress={handleSignOut} style={{ marginTop: 16 }}>
        Sign Out
      </Button>
    </View>
  );
};

export default Settings;