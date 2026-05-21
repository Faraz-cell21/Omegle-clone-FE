import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "~/components/ui/sonner";
import { SocketProvider } from "~/features/chat/context/socket-context";
import ChatLayout from "~/features/chat/components/chat-layout";
import { ADMIN_DASHBOARD_PATH, ADMIN_LOGIN_PATH } from "~/config";
import AdminLoginPage from "~/pages/admin-login";
import AdminDashboardPage from "~/pages/admin-dashboard";
import HomePage from "~/pages/home";
import PrivacyPage from "~/pages/privacy";
import TermsPage from "~/pages/terms";
import WaitingPage from "~/pages/waiting";
import ChatPage from "~/pages/chat";
import ReconnectingPage from "~/pages/reconnecting";
import BannedPage from "~/pages/banned";
import NotFoundPage from "~/pages/not-found";

function ChatShell() {
  return (
    <SocketProvider>
      <ChatLayout />
    </SocketProvider>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ADMIN_LOGIN_PATH} element={<AdminLoginPage />} />
        <Route path={ADMIN_DASHBOARD_PATH} element={<AdminDashboardPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/admin" element={<NotFoundPage />} />
        <Route path="/admin/*" element={<NotFoundPage />} />
        <Route element={<ChatShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/waiting" element={<WaitingPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/reconnecting" element={<ReconnectingPage />} />
          <Route path="/banned" element={<BannedPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster richColors />
    </BrowserRouter>
  );
}
