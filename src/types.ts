export interface ServerTarget {
  name: string;
  host: string;
  port?: number;
}

export interface ApiServerResponse {
  online: boolean;
  ip?: string;
  port?: number;
  version?: string;
  players?: {
    online?: number;
    max?: number;
  };
  motd?: {
    clean?: string[];
  };
}

export type ServerUiStatus = "loading" | "online" | "offline" | "error";

export interface ServerViewModel {
  id: string;
  name: string;
  address: string;
  status: ServerUiStatus;
  version: string;
  playersText: string;
  motdText: string;
  errorText?: string;
}
