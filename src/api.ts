import type { ApiServerResponse, ServerTarget, ServerViewModel } from "./types";
import { toAddress } from "./config";

const API_BASE = "https://api.mcsrvstat.us/2";
const REQUEST_TIMEOUT_MS = 8000;

function withTimeout(timeoutMs: number): AbortController {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller;
}

function normalizeMotd(cleanMotd?: string[]): string {
  if (!cleanMotd || cleanMotd.length === 0) {
    return "暂无 MOTD";
  }

  return cleanMotd.join(" / ");
}

export async function fetchServerView(server: ServerTarget): Promise<ServerViewModel> {
  const address = toAddress(server);
  const controller = withTimeout(REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE}/${address}`, {
      method: "GET",
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = (await response.json()) as ApiServerResponse;

    if (!data.online) {
      return {
        id: address,
        name: server.name,
        address,
        status: "offline",
        version: "离线",
        playersText: "0 / 0",
        motdText: "服务器离线或不可达"
      };
    }

    const online = data.players?.online ?? 0;
    const max = data.players?.max ?? 0;

    return {
      id: address,
      name: server.name,
      address,
      status: "online",
      version: data.version ?? "未知版本",
      playersText: `${online} / ${max}`,
      motdText: normalizeMotd(data.motd?.clean)
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "未知错误";

    return {
      id: address,
      name: server.name,
      address,
      status: "error",
      version: "查询失败",
      playersText: "-",
      motdText: "无法获取服务器状态",
      errorText: reason
    };
  }
}
