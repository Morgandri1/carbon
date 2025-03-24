import { useState, useEffect, createContext, useContext } from "react";

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextType {
  user: any;
  setUser: (user: any) => void;
  isAuthenticated: boolean;
  setAuthenticated: (isAuthenticated: boolean) => void;
  // Position properties
  currentChat: string | null;
  setCurrentChat: (chatId: string | null) => void;
  typing: boolean;
  setTyping: (isTyping: boolean) => void;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [typing, setTyping] = useState<boolean>(false);

  return (
    <AppContext.Provider value={{ 
      user, 
      setUser, 
      isAuthenticated, 
      setAuthenticated, 
      currentChat, 
      setCurrentChat, 
      typing, 
      setTyping
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppProvider");
  }
  return context;
}