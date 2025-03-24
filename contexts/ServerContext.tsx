import { Chat, Message, MessageEvent } from "@/lib/types";
import { useState, useEffect, useContext, createContext } from "react";
import { useAppState } from "./AppContext";
import { Axios } from "axios";

const ServerContext = createContext<Server | undefined>(undefined);
const SERVER_URL = "";

interface Server {
  chats: Chat[];
  cachedMessages: Message[];
  loadBaseData: () => Promise<any>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  hasReadChat: (messageId: string) => Promise<any>;
  sendMessage: (message: Message) => Promise<any>;
  deleteMessage: (messageId: string) => Promise<any>;
  editMessage: (messageId: string, newContent: string) => Promise<any>;
  createChat: (chat: Chat) => Promise<any>;
  deleteChat: (chatId: string) => Promise<any>;
  editChat: (chatId: string, newChat: Chat) => Promise<any>;
  addMember: (chatId: string, member: string) => Promise<any>;
  removeMember: (chatId: string, member: string) => Promise<any>;
  addAdmin: (chatId: string, admin: string) => Promise<any>;
  removeAdmin: (chatId: string, admin: string) => Promise<any>;
  pinMessage: (chatId: string, messageId: string) => Promise<any>;
  unpinMessage: (chatId: string, messageId: string) => Promise<any>;
  reactToMessage: (messageId: string, reaction: string) => Promise<any>;
  removeReaction: (messageId: string, reaction: string) => Promise<any>;
  loadChat: (chatId: string) => { chat: Chat, messages: Message[] };
}

export function ServerProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [cachedMessages, setCachedMessages] = useState<Message[]>([]);
  const appState = useAppState();
  const [isConnected, setIsConnected] = useState(false);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const axios = new Axios({
    baseURL: SERVER_URL,
    timeout: 3000,
    headers: { 
      'Content-Type': 'application/json',
      Authorization: '', // ed25519 sign user's public key
      user: appState.user?.id
    }
  });
  
  useEffect(() => {
    if (!appState.isAuthenticated) {
      unsubscribeFromMessages();
      return;
    }
    if (!isConnected) {
      subscribeToMessages();
    }
  }, [isConnected, appState])
  
  const loadBaseData = async () => { }
  const subscribeToMessages = async () => {
    if (isConnected) return;
    let sse = new EventSource(SERVER_URL + "/messages/stream?token=" + axios, )
    sse.onmessage = (event) => {
      let json: MessageEvent = JSON.parse(event.data);
      switch (json.type) {
        case "created": {
          let ctx = chats.find((c) => c.id == json.message.ctx);
          if (!ctx) {
            fetchChat(json.message.ctx).then((r: Chat) => setChats((prev) => [...prev, r]));
          }
          setCachedMessages((prev) => [...prev, json.message]);
          break;
        } case "updated": { 
          setCachedMessages((prev) => prev.map((m) => m.id == json.message.id ? json.message : m));
          break;
        } case "deleted": {
          setCachedMessages((prev) => prev.filter((m) => m.id != json.message.id));
          break;
        }
        default: {
          console.error("Unknown message type", json.type);
          break;
        }
      }
    };
    sse.onerror = (event) => {
      console.error("Error in SSE connection", event);
      eventSource?.CLOSED && setIsConnected(false);
      eventSource?.CLOSED && setEventSource(null);
    }
    setEventSource(sse);
    setIsConnected(true);
  }
  const unsubscribeFromMessages = () => {
    eventSource?.close();
    setIsConnected(false);
    setEventSource(null);
  }
  
  const cacheMessages = (messages: Message[]) => { 
    messages = [...cachedMessages, ...messages];
    // filter any duplicates
    messages = messages.filter((m, i) => messages.findIndex((m2) => m2.id == m.id) == i);
    setCachedMessages((prev) => [...prev, ...messages]);
  }
  
  /** Lets server know a user has read up to latest message */
  const hasReadChat = async (messageId: string) => {
    let res = await axios.put(`/messages/${messageId}/read`);
    return res.data;
  }
  const sendMessage = async (message: Message) => {
    let res = await axios.post("/messages", message);
    return res.data;
  }
  const deleteMessage = async (messageId: string) => {
    let res = await axios.delete(`/messages/${messageId}`);
    return res.data;
  }
  const editMessage = async (messageId: string, newContent: string) => {
    let res = await axios.put(`/messages/${messageId}`, { content: newContent });
    return res.data;
  }
  const reactToMessage = async (messageId: string, reaction: string) => {
    let res = await axios.put(`/messages/${messageId}/reactions`, { reaction });
    return res.data;
  }
  const removeReaction = async (messageId: string, reaction: string) => {
    let res = await axios.delete(`/messages/${messageId}/reactions/${reaction}`);
    return res.data;
  }
  const createChat = async (chat: Chat) => {
    let res = await axios.post("/chats", chat);
    return res.data;
  }
  const deleteChat = async (chatId: string) => {
    let res = await axios.delete(`/chats/${chatId}`);
    return res.data;
  }
  const editChat = async (chatId: string, newChat: Chat) => {
    let res = await axios.post(`/chats/${chatId}`, newChat);
    return res.data;
  }
  const addMember = async (chatId: string, member: string) => {
    let res = await axios.put(`/chats/${chatId}/members/${member}`);
    return res.data;
  }
  const removeMember = async (chatId: string, member: string) => {
    let res = await axios.delete(`/chats/${chatId}/members/${member}`);
    return res.data;
  }
  const addAdmin = async (chatId: string, admin: string) => {
    let res = await axios.delete(`/chats/${chatId}/admins/${admin}`);
    return res.data;
  }
  const removeAdmin = async (chatId: string, admin: string) => {
    let res = await axios.delete(`/chats/${chatId}/admins/${admin}`);
    return res.data;
  }
  const pinMessage = async (chatId: string, messageId: string) => {
    let res = await axios.put(`/chats/${chatId}/${messageId}/pins`);
    return res.data;
  }
  const unpinMessage = async (chatId: string, messageId: string) => { 
    let res = await axios.delete(`/chats/${chatId}/${messageId}/pins`);
    return res.data;
  }
  const fetchChat = async (chatId: string): Promise<Chat> => {
    let res = await axios.get<{ chat: Chat, messages: Message[] }>(`/chats/${chatId}`);
    cacheMessages(res.data.messages);
    return res.data.chat;
  }

  const loadChat = (chatId: string): { chat: Chat, messages: Message[] } => {
    let chat = chats.find((c) => c.id == chatId);
    if (chat) {
      return {
        chat,
        messages: cachedMessages.filter((m) => m.ctx == chatId)
      }
    } else {
      throw new Error("Chat not found");
    }
  }
  
  return (
    <ServerContext.Provider value={{
      chats,
      cachedMessages,
      loadBaseData,
      subscribeToMessages,
      unsubscribeFromMessages,
      hasReadChat,
      sendMessage,
      deleteMessage,
      editMessage,
      createChat,
      deleteChat,
      editChat,
      addMember,
      removeMember,
      addAdmin,
      removeAdmin,
      pinMessage,
      unpinMessage,
      reactToMessage,
      removeReaction,
      loadChat,
    }}>
      {children}
    </ServerContext.Provider>
  )
}

export function useServer() {
  let ctx = useContext(ServerContext);
  if (!ctx) {
    throw new Error("useServer must be used within a ServerProvider");
  }
  return ctx;
}