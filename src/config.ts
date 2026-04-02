import type { ServerTarget } from "./types";

export const SERVER_LIST: ServerTarget[] = [
  { name: "主城生存服", host: "play.hypixel.net" },
  { name: "小游戏大厅", host: "mc.hypixel.net" },
  { name: "示例离线服", host: "example.invalid", port: 25565 }
];

export function toAddress(server: ServerTarget): string {
  if (!server.port || server.port === 25565) {
    return server.host;
  }

  return `${server.host}:${server.port}`;
}
