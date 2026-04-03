import type { ServerTarget } from "./types";

const SERVERS_CONFIG_PATH = "./servers.json";

const DEFAULT_SERVER_LIST: ServerTarget[] = [
  { name: "主城生存服", host: "play.hypixel.net" },
  { name: "小游戏大厅", host: "mc.hypixel.net" },
  { name: "示例离线服", host: "example.invalid", port: 25565 }
];

function isServerTarget(value: unknown): value is ServerTarget {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ServerTarget>;
  return (
    typeof candidate.name === "string" &&
    candidate.name.trim().length > 0 &&
    typeof candidate.host === "string" &&
    candidate.host.trim().length > 0 &&
    (candidate.port === undefined || Number.isInteger(candidate.port))
  );
}

function normalizeServer(server: ServerTarget): ServerTarget {
  return {
    name: server.name.trim(),
    host: server.host.trim(),
    port: server.port
  };
}

export async function loadServerList(): Promise<ServerTarget[]> {
  try {
    const response = await fetch(SERVERS_CONFIG_PATH, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = (await response.json()) as unknown;
    if (!Array.isArray(payload)) {
      throw new Error("Invalid server list format");
    }

    const parsed = payload.filter(isServerTarget).map(normalizeServer);
    if (parsed.length === 0) {
      throw new Error("No valid server entries");
    }

    return parsed;
  } catch {
    return DEFAULT_SERVER_LIST;
  }
}

export function toAddress(server: ServerTarget): string {
  if (!server.port || server.port === 25565) {
    return server.host;
  }

  return `${server.host}:${server.port}`;
}
