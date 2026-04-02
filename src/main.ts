import { SERVER_LIST, toAddress } from "./config";
import { fetchServerView } from "./api";
import { renderLoadingCard, upsertServerCard } from "./ui";

const boardNode = document.querySelector<HTMLElement>("#status-board");
const refreshButtonNode = document.querySelector<HTMLButtonElement>("#refresh-all");

if (!boardNode || !refreshButtonNode) {
  throw new Error("页面初始化失败：缺少必要 DOM 节点");
}

const board = boardNode;
const refreshButton = refreshButtonNode;

function renderInitialLoading(): void {
  board.innerHTML = "";
  for (const server of SERVER_LIST) {
    const address = toAddress(server);
    renderLoadingCard(board, address, server.name, address);
  }
}

async function refreshAll(): Promise<void> {
  refreshButton.disabled = true;
  refreshButton.textContent = "刷新中...";

  const results = await Promise.allSettled(SERVER_LIST.map((item) => fetchServerView(item)));

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

renderInitialLoading();
void refreshAll();
