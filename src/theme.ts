// 主题切换：dark（月夜星咏）/ light（琉璃晨光）
// 偏好持久化于 localStorage，未存储时跟随系统 prefers-color-scheme。
// index.html 中的内联脚本已负责首屏防 FOUC，本模块接管运行时切换、
// 主题名同步、流星随机化与系统偏好跟随。

export type Theme = "dark" | "light";

const STORAGE_KEY = "dutcraft-theme";

const THEME_TEXT: Record<Theme, { name: string }> = {
  dark: { name: "月夜星咏" },
  light: { name: "晴空日照" },
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

  const nameNode = document.getElementById("theme-name");
  if (nameNode) {
    nameNode.textContent = THEME_TEXT[theme].name;
  }
}

function toggle(): void {
  const next: Theme = currentTheme() === "dark" ? "light" : "dark";
  persist(next);
  applyTheme(next);
}

/** 动态生成流星：数量随机（3–6 颗），每颗的起点 / 轨迹 / 速度 / 出现间隔
 *  均随机，避免整齐划一。运动方向统一为左下；拖尾角度按速度向量单独
 *  计算，使拖尾始终与速度方向相反；落点超出视口后再淡出。
 *  「间隔随机」通过每颗流星各自随机的循环周期实现：周期内大部分时间
 *  不可见，只在很短的窗口划过，多颗叠加即呈无规律间隔。 */
function initMeteorShower(): void {
  const stage = document.querySelector<HTMLElement>(".bg-stage");
  if (!stage) {
    return;
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const count = 3 + Math.floor(Math.random() * 4); // 3–6 颗

  for (let i = 0; i < count; i += 1) {
    const node = document.createElement("div");
    node.className = "meteor";

    const left = 30 + Math.random() * 65; // 30%–95% 横向起点
    const travelX = -(45 + Math.random() * 50); // -45vw ~ -95vw，向左飞出
    const travelY = 90 + Math.random() * 30; // 90vh–120vh，落到视口下方

    // 速度向量（像素）：dx 向左为负，dy 向下为正
    const dx = (travelX / 100) * vw;
    const dy = (travelY / 100) * vh;
    // 速度方向角；拖尾须指向反方向，故 +180°。
    // 拖尾元素初始沿 +x，旋转该角后远端指向速度反方向。
    const tailAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 180;

    // 周期随机：每个循环周期 8–18s，流星只在其中约 1/4 时段可见，
    // 其余时间停留于 opacity:0，形成随机间隔。
    const cycle = 8 + Math.random() * 10;
    const delay = Math.random() * cycle; // 错开首次出现时机

    node.style.left = `${left}%`;
    node.style.setProperty("--travel-x", `${travelX}vw`);
    node.style.setProperty("--travel-y", `${travelY}vh`);
    node.style.setProperty("--tail-angle", `${tailAngle}deg`);
    node.style.animationDuration = `${cycle}s`;
    node.style.animationDelay = `${delay}s`;

    stage.appendChild(node);
  }
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

  initMeteorShower();

  return currentTheme();
}
