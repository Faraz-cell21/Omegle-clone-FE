import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "~/components/ui/sonner";
import { SocketProvider } from "~/features/chat/context/socket-context";
import ChatLayout from "~/features/chat/components/chat-layout";
import HomePage from "~/pages/home";
import WaitingPage from "~/pages/waiting";
import ChatPage from "~/pages/chat";
import ReconnectingPage from "~/pages/reconnecting";
import BannedPage from "~/pages/banned";

export function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <Routes>
          <Route element={<ChatLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/waiting" element={<WaitingPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/reconnecting" element={<ReconnectingPage />} />
            <Route path="/banned" element={<BannedPage />} />
          </Route>
        </Routes>
      </SocketProvider>
      <Toaster richColors />
    </BrowserRouter>
  );
}
