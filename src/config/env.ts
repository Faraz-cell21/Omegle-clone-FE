export const WS_URL = import.meta.env.DEV
  ? `ws://${window.location.hostname}:8000/ws/chat/`
  : `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws/chat/`;
