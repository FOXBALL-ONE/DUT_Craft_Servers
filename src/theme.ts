// 主题切换：dark（月夜星咏）/ light（琉璃晨光）
// 偏好持久化于 localStorage，未存储时跟随系统 prefers-color-scheme。
// index.html 中的内联脚本已负责首屏防 FOUC，本模块接管运行时切换与文案同步。

export type Theme = "dark" | "light";

const STORAGE_KEY = "dutcraft-theme";

const THEME_TEXT: Record<Theme, { kicker: string; titleZh: string; subtitle: string }> = {
  dark: {
    kicker: "Lunar Nocturne",
    titleZh: "月夜星咏 · ",
    subtitle: "于静谧夜空下，守望每一座服务器的微光。实时查询预设服务器的在线状态、人数、MOTD 与版本信息。",
  },
  light: {
    kicker: "Auroran Porcelain",
    titleZh: "琉璃晨光 · ",
    subtitle: "于晨光熹微中，凝望每一座服务器的轮廓。实时查询预设服务器的在线状态、人数、MOTD 与版本信息。",
  },
};

function resolveStored(): Theme | undefined {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "dark" || stored === "light" ? stored : undefined;
  } catch {
    return undefined;
  }
}

function persist(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // 无痕模式或禁用存储时静默忽略
  }
}

export function currentTheme(): Theme {
  return (document.documentElement.getAttribute("data-theme") as Theme | null) ?? "dark";
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);

  const text = THEME_TEXT[theme];
  const kicker = document.getElementById("hero-kicker");
  const titleZh = document.getElementById("hero-title-zh");
  const subtitle = document.getElementById("hero-subtitle");

  if (kicker) {
    kicker.textContent = text.kicker;
  }
  if (titleZh) {
    titleZh.textContent = text.titleZh;
  }
  if (subtitle) {
    subtitle.textContent = text.subtitle;
  }
}

function toggle(): void {
  const next: Theme = currentTheme() === "dark" ? "light" : "dark";
  persist(next);
  applyTheme(next);
}

/** 初始化主题切换按钮与系统偏好跟随。返回当前主题。 */
export function initThemeToggle(): Theme {
  // 首次访问（无存储）时，跟随系统明暗
  if (resolveStored() === undefined) {
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(prefersLight ? "light" : "dark");
  } else {
    applyTheme(currentTheme());
  }

  // 系统偏好变化时，若用户未显式选择，则跟随
  const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
  const onSystemChange = (event: MediaQueryListEvent) => {
    if (resolveStored() !== undefined) {
      return;
    }
    applyTheme(event.matches ? "light" : "dark");
  };

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", onSystemChange);
  } else {
    // 旧版 Safari 兼容
    mediaQuery.addListener(onSystemChange);
  }

  const button = document.querySelector<HTMLButtonElement>("#theme-toggle");
  if (button) {
    button.addEventListener("click", toggle);
  }

  return currentTheme();
}
