import { loadServerList, toAddress } from "./config";
import { fetchServerView } from "./api";
import type { ServerTarget } from "./types";
import { renderLoadingCard, upsertServerCard } from "./ui";

const boardNode = document.querySelector<HTMLElement>("#status-board");
const refreshButtonNode = document.querySelector<HTMLButtonElement>("#refresh-all");

if (!boardNode || !refreshButtonNode) {
  throw new Error("页面初始化失败：缺少必要 DOM 节点");
}

const board = boardNode;
const refreshButton = refreshButtonNode;
let activeServerList: ServerTarget[] = [];
let activeServerSignature = "";

function serverSignature(list: ServerTarget[]): string {
  return list.map((server) => `${server.name}|${toAddress(server)}`).join("||");
}

function renderInitialLoading(list: ServerTarget[]): void {
  board.innerHTML = "";
  for (const server of list) {
    const address = toAddress(server);
    renderLoadingCard(board, address, server.name, address);
  }
}

async function syncServerList(): Promise<boolean> {
  const loaded = await loadServerList();
  const nextSignature = serverSignature(loaded);
  const changed = nextSignature !== activeServerSignature;

  activeServerList = loaded;
  activeServerSignature = nextSignature;

  return changed;
}

async function refreshAll(): Promise<void> {
  refreshButton.disabled = true;
  refreshButton.textContent = "刷新中...";

  const listChanged = await syncServerList();
  if (listChanged) {
    renderInitialLoading(activeServerList);
  }

  const results = await Promise.allSettled(activeServerList.map((item) => fetchServerView(item)));

  for (const result of results) {
    if (result.status === "fulfilled") {
      upsertServerCard(board, result.value);
    }
  }

  refreshButton.disabled = false;
  refreshButton.textContent = "刷新全部服务器";
}

refreshButton.addEventListener("click", () => {
  void refreshAll();
});

void refreshAll();
