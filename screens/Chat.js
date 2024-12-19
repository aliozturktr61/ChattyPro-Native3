import { useRoute } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { Text, View, KeyboardAvoidingView, Platform } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../firebase";

const Chat = () => {
  const route = useRoute();
  const [messages, setMessages] = useState([]);
  const [uid, setUID] = useState("");
  const [name, setName] = useState("");

  // Kullanıcı oturum bilgilerini al
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUID(user?.uid || "");
      setName(user?.displayName || "");
    });
    return () => unsubscribe();
  }, []);

  // Mesajları dinleme
  useEffect(() => {
    if (!route.params?.chatId) return;

    const chatRef = doc(db, "chats", route.params.chatId);
    const unsubscribe = onSnapshot(chatRef, (snapshot) => {
      const data = snapshot.data();
      setMessages(data?.messages ?? []);
    });

    return () => unsubscribe();
  }, [route.params?.chatId]);

  // Mesaj gönderme
  const onSend = async (newMessages = []) => {
    if (!route.params?.chatId) return;

    const chatRef = doc(db, "chats", route.params.chatId);

    try {
      await updateDoc(chatRef, {
        messages: arrayUnion({
          ...newMessages[0],
          createdAt: new Date(),
        }),
      });
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={20} // Klavyeyi kaldırırken boşluk
    >
      <GiftedChat
        messages={messages.map((msg) => ({
          ...msg,
          createdAt: msg.createdAt?.toDate(), // Firebase Timestamp'ı Date'e dönüştür
        }))}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: uid,
          name: name,
        }}
        bottomOffset={20} // Mesaj yazma alanını alt kenardan 20px yukarı taşı
      />
    </KeyboardAvoidingView>
  );
};

export default Chat;