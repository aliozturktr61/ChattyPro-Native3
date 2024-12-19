import React, { useState, useEffect } from "react";
import { View } from "react-native";
import {
  List,
  Avatar,
  Divider,
  FAB,
  Portal,
  Dialog,
  Button,
  TextInput,
} from "react-native-paper";
import { db, auth } from "../firebase"; // Yeni firebase config dosyasından import
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";
import { useNavigation } from "@react-navigation/core";

const ChatList = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);

  const navigation = useNavigation();

  // Oturum durumunu izlemek
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setEmail(user?.email ?? "");
    });

    return () => unsubscribe();
  }, []);

  // Yeni sohbet oluşturma
  const createChat = async () => {
    if (!email || !userEmail) return;
    setIsLoading(true);
    try {
      const response = await addDoc(collection(db, "chats"), {
        users: [email, userEmail],
      });
      setIsLoading(false);
      setIsDialogVisible(false);
      navigation.navigate("Chat", { chatId: response.id });
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating chat: ", error);
    }
  };

  // Sohbetleri dinleme
  useEffect(() => {
    if (!email) return;

    const q = query(collection(db, "chats"), where("users", "array-contains", email));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setChats(querySnapshot.docs);
    });

    return () => unsubscribe();
  }, [email]);

  return (
    <View style={{ flex: 1 }}>
      {chats.map((chat) => (
        <React.Fragment key={chat.id}>
          <List.Item
            title={chat.data().users.find((x) => x !== email)}
            description={(chat.data().messages ?? [])[0]?.text ?? undefined}
            left={() => (
              <Avatar.Text
                label={chat
                  .data()
                  .users.find((x) => x !== email)
                  .split(" ")
                  .reduce((prev, current) => prev + current[0], "")}
                size={56}
              />
            )}
            onPress={() => navigation.navigate("Chat", { chatId: chat.id })}
          />
          <Divider leftInset />
        </React.Fragment>
      ))}

      <Portal>
        <Dialog
          visible={isDialogVisible}
          onDismiss={() => setIsDialogVisible(false)}
        >
          <Dialog.Title>New Chat</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Enter user email"
              value={userEmail}
              onChangeText={(text) => setUserEmail(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDialogVisible(false)}>Cancel</Button>
            <Button onPress={createChat} loading={isLoading}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        icon="plus"
        style={{ position: "absolute", bottom: 16, right: 16}}
        onPress={() => setIsDialogVisible(true)}
      />
    </View>
  );
};

export default ChatList;