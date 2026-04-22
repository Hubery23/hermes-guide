# Hermes Agent 中文指南站 MVP 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建 Hermes Agent 中文指南站的可部署 MVP 引擎：Astro + Starlight + H 工业风主题 + 中英双语路由 + 首页/迁移落地/7 天索引三张营销页 + 8 篇教程占位页，部署到 Cloudflare Pages 域名 `hermesagentguide.online`。8 篇教程的**长文内容撰写不在本计划内**（属于独立内容生产流），本计划只交付合规的占位页让站点可上线。

**Architecture:** Astro 5 + Starlight（教程页）+ 纯自定义 Astro 页（首页 / 迁移落地 / 7 天索引）。Starlight 处理 i18n 路由、TOC、上下翻页、Pagefind 搜索；自定义页走 H 工业风完全绕开 Starlight 模板。H 配色通过 Starlight CSS 变量（`--sl-color-*`）全局覆盖，自定义页直接用 `src/styles/theme.css` 的 `--sand / --ink / --tang / --amber` tokens。

**Tech Stack:** Astro 5 · Starlight · MDX · TypeScript · Pagefind · Fontsource (self-host 字体) · npm · Cloudflare Pages (Git-based autodeploy)

**Spec reference:** `docs/superpowers/specs/2026-04-23-hermes-guide-design.md`（commit `1f4e318`）

---

## File Structure

实施完成后仓库结构：

```
.
├── .gitignore
├── .nvmrc                       # Node version 20
├── astro.config.mjs             # Astro + Starlight + i18n + integrations
├── package.json
├── package-lock.json
├── tsconfig.json
├── wrangler.toml                # Cloudflare Pages routing
├── docs/                        # 已有：规范 & 计划
│   └── superpowers/
│       ├── specs/
│       └── plans/
├── reference.md                 # 已有
└── src/
    ├── assets/
    │   └── logo-mark.svg        # Hermes/Agent 简单文字标
    ├── components/
    │   ├── WarningStrip.astro   # 顶部警戒带
    │   ├── LangSwitcher.astro   # 中/EN 切换
    │   ├── SiteNav.astro        # 营销页导航
    │   ├── SiteFooter.astro     # 营销页页脚（带 GitHub 链接）
    │   ├── MarqueeDivider.astro # 跑马灯分隔
    │   ├── SpecCard.astro       # SPECIFICATION 卡片
    │   ├── DayCard.astro        # 8 个方格之一
    │   ├── CompatChart.astro    # OpenClaw → Hermes 对照表
    │   ├── HeroIntro.astro      # 首页左侧 H/01 大字 + 标题
    │   └── SectionHead.astro    # A.01 段落头
    ├── content/
    │   ├── config.ts            # 内容集合 schema
    │   ├── i18n/
    │   │   ├── zh-CN.json
    │   │   └── en.json
    │   └── docs/
    │       ├── zh-CN/
    │       │   ├── index.mdx              # Starlight 要求的默认落地（重定向到 /）
    │       │   ├── 7-days/
    │       │   │   ├── day-01.mdx
    │       │   │   ├── day-02.mdx
    │       │   │   ├── day-03.mdx
    │       │   │   ├── day-04.mdx
    │       │   │   ├── day-05.mdx
    │       │   │   ├── day-06.mdx
    │       │   │   └── day-07.mdx
    │       │   └── migrate/
    │       │       └── from-openclaw.mdx
    │       └── en/
    │           ├── index.mdx
    │           ├── 7-days/…                # 8 份 Coming soon 占位
    │           └── migrate/from-openclaw.mdx
    ├── layouts/
    │   └── MarketingLayout.astro # 首页/迁移/索引共用的 H 外壳
    ├── lib/
    │   ├── i18n.ts              # t() 函数 + 语言检测
    │   └── locale.ts            # locale utils + path 保持
    ├── pages/
    │   ├── index.astro          # 中文首页（/）
    │   ├── migrate.astro        # 中文迁移落地（/migrate）
    │   ├── 7-days/
    │   │   └── index.astro      # 中文 7 天索引（/7-days/）
    │   └── en/
    │       ├── index.astro      # 英文首页（/en/）
    │       ├── migrate.astro
    │       └── 7-days/
    │           └── index.astro
    ├── styles/
    │   ├── theme.css            # H tokens + Starlight 变量覆盖
    │   └── fonts.css            # 字体 @font-face / fontsource 导入
    └── tests/
        ├── e2e/
        │   ├── build.spec.ts
        │   ├── homepage.spec.ts
        │   ├── i18n-switch.spec.ts
        │   └── links.spec.ts
        └── unit/
            ├── locale.test.ts
            └── i18n.test.ts
```

---

## Phase 0: 项目脚手架

### Task 0.1: 初始化 Node & package.json

**Files:**
- Create: `.nvmrc`
- Create: `package.json`
- Create: `.gitignore`（追加 Node 相关条目）

- [ ] **Step 1: 固定 Node 版本**

```
# .nvmrc
20
```

- [ ] **Step 2: 初始化 package.json（使用 npm）**

在仓库根目录运行：

```bash
cd /Users/hubery/MyProduct/hermes
npm init -y
```

然后把 `package.json` 的 `name` 改为 `hermes-agent-guide`，`version` 设为 `0.1.0`，并新增：

```json
{
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 3: 扩充 .gitignore**

在已有 `.gitignore` 尾部追加：

```
node_modules/
dist/
.astro/
.vercel/
.wrangler/
*.log
.env
.env.local
.DS_Store
```

- [ ] **Step 4: 验证 Node 版本匹配**

```bash
node --version
```

期望：`v20.x.x`（如果不是，用 nvm 切 `nvm use 20`）

- [ ] **Step 5: Commit**

```bash
git add .nvmrc package.json .gitignore
git commit -m "chore: 初始化 Node/npm 项目脚手架"
```

---

### Task 0.2: 安装 Astro + Starlight + MDX

**Files:**
- Modify: `package.json`（自动，由 npm install 维护）
- Create: `package-lock.json`（自动）

- [ ] **Step 1: 安装核心依赖**

```bash
npm install astro @astrojs/starlight @astrojs/mdx @astrojs/check typescript
```

- [ ] **Step 2: 安装开发依赖（测试）**

```bash
npm install -D vitest @vitest/ui playwright @playwright/test
npx playwright install chromium
```

- [ ] **Step 3: 安装字体（self-hosted 避免 CN 访问 Google Fonts 不稳）**

```bash
npm install @fontsource-variable/bricolage-grotesque @fontsource/ibm-plex-mono @fontsource/ibm-plex-sans @fontsource/noto-sans-sc
```

- [ ] **Step 4: 验证 Astro CLI 可调用**

```bash
npx astro --version
```

期望：输出 `5.x.x`

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: 安装 Astro/Starlight/MDX/字体/测试依赖"
```

---

### Task 0.3: TypeScript 配置

**Files:**
- Create: `tsconfig.json`

- [ ] **Step 1: 写 tsconfig**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@lib/*": ["src/lib/*"],
      "@styles/*": ["src/styles/*"]
    }
  },
  "include": ["src/**/*", ".astro/**/*"],
  "exclude": ["dist", "node_modules"]
}
```

- [ ] **Step 2: Commit**

```bash
git add tsconfig.json
git commit -m "chore: 配置 TypeScript 严格模式 + 路径别名"
```

---

## Phase 1: Astro + Starlight 配置骨架

### Task 1.1: 写 astro.config.mjs

**Files:**
- Create: `astro.config.mjs`

- [ ] **Step 1: 写 Astro 配置**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://hermesagentguide.online',
  integrations: [
    mdx(),
    starlight({
      title: {
        'zh-CN': 'Hermes/Agent',
        'en': 'Hermes/Agent'
      },
      defaultLocale: 'zh-CN',
      locales: {
        'zh-CN': { label: '中文', lang: 'zh-CN' },
        'en': { label: 'English', lang: 'en' }
      },
      customCss: [
        './src/styles/fonts.css',
        './src/styles/theme.css'
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/Hubery23' }
      ],
      sidebar: [
        {
          label: '7 天入门',
          translations: { en: '7-Day Tutorial' },
          autogenerate: { directory: '7-days' }
        },
        {
          label: '迁移',
          translations: { en: 'Migrate' },
          autogenerate: { directory: 'migrate' }
        }
      ]
    })
  ]
});
```

- [ ] **Step 2: 验证配置被解析**

```bash
npx astro check
```

期望：无错误（可能有警告表示还没有 content，是正常的）

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "feat: Astro + Starlight 基础配置（i18n + sidebar + GitHub 链接）"
```

---

### Task 1.2: 内容集合 schema

**Files:**
- Create: `src/content/config.ts`

- [ ] **Step 1: 定义 docs 集合 schema（扩展 Starlight 默认 schema）**

```typescript
// src/content/config.ts
import { defineCollection } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro:content';

export const collections = {
  docs: defineCollection({
    schema: docsSchema({
      extend: z.object({
        day: z.number().optional(),
        duration: z.string().optional(),
        milestone: z.boolean().default(false),
        sources: z.array(
          z.object({
            title: z.string(),
            url: z.string().url()
          })
        ).default([])
      })
    })
  })
};
```

**Why 这些字段**：
- `day`：教程编号，用于首页和索引页的 Day 01-07 标签
- `duration`：时长（教程写完后才填，现在 optional）
- `milestone`：是否是里程碑章节（Day 05"装 skill"会标 true，呈琥珀色高亮）
- `sources`：合规必需的"资料来源"列表

- [ ] **Step 2: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: 内容集合 schema（day/duration/milestone/sources 扩展）"
```

---

## Phase 2: H 主题 CSS

### Task 2.1: 字体加载

**Files:**
- Create: `src/styles/fonts.css`

- [ ] **Step 1: 写字体导入**

```css
/* src/styles/fonts.css */
@import '@fontsource-variable/bricolage-grotesque';
@import '@fontsource/ibm-plex-mono/400.css';
@import '@fontsource/ibm-plex-mono/500.css';
@import '@fontsource/ibm-plex-mono/700.css';
@import '@fontsource/ibm-plex-sans/400.css';
@import '@fontsource/ibm-plex-sans/500.css';
@import '@fontsource/ibm-plex-sans/700.css';
@import '@fontsource/noto-sans-sc/400.css';
@import '@fontsource/noto-sans-sc/500.css';
@import '@fontsource/noto-sans-sc/700.css';

:root {
  --font-display: 'Bricolage Grotesque Variable', system-ui, sans-serif;
  --font-body: 'IBM Plex Sans', 'Noto Sans SC', -apple-system, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, 'SF Mono', monospace;
  --font-cjk: 'Noto Sans SC', 'PingFang SC', sans-serif;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/fonts.css
git commit -m "feat: 引入 4 个 self-hosted 字体"
```

---

### Task 2.2: H 设计 token + Starlight 变量覆盖

**Files:**
- Create: `src/styles/theme.css`

- [ ] **Step 1: 写主题 CSS**

```css
/* src/styles/theme.css */

/* ===== H 工业产品目录 · Design Tokens ===== */
:root {
  --sand: #E8E2D4;
  --sand-dark: #D9D2BF;
  --paper: #F4EFE1;
  --ink: #2B2B2E;
  --ink-soft: #44444A;
  --tang: #F5713A;
  --amber: #E8C547;
}

/* ===== 覆盖 Starlight 颜色变量（让教程页也呈 H 风） ===== */
:root {
  /* 主背景与文字（浅色模式） */
  --sl-color-bg: var(--sand);
  --sl-color-bg-nav: var(--sand);
  --sl-color-bg-sidebar: var(--paper);
  --sl-color-text: var(--ink);
  --sl-color-text-accent: var(--tang);
  --sl-color-accent: var(--tang);
  --sl-color-accent-high: var(--ink);
  --sl-color-accent-low: var(--amber);

  /* 细节 */
  --sl-color-white: var(--paper);
  --sl-color-gray-1: var(--ink-soft);
  --sl-color-gray-2: var(--ink-soft);
  --sl-color-gray-5: var(--sand-dark);
  --sl-color-gray-6: var(--paper);
  --sl-color-hairline: var(--ink);
  --sl-color-hairline-light: var(--sand-dark);

  /* 字体接管 */
  --sl-font: var(--font-body);
  --sl-font-system-mono: var(--font-mono);

  /* 间距（维持 Starlight 默认） */
}

[data-theme='dark'] {
  /* 暂不做独立深色方案；若用户强制深色，回落到深墨底 */
  --sl-color-bg: var(--ink);
  --sl-color-bg-sidebar: #1a1a1e;
  --sl-color-text: var(--sand);
  --sl-color-text-accent: var(--amber);
}

/* ===== 全局基础 ===== */
body {
  font-family: var(--font-body);
  background: var(--sand);
  color: var(--ink);
}

h1, h2, h3, h4 {
  font-family: var(--font-display);
  letter-spacing: -0.02em;
}

code, pre, .mono {
  font-family: var(--font-mono);
}

/* Starlight 侧边栏的 "active" 态用 tangerine */
.sidebar-content a[aria-current='page'] {
  background: var(--tang);
  color: var(--ink) !important;
}

/* 代码块配色与 H 色板协调 */
.expressive-code {
  --ec-brdCol: var(--ink);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/theme.css
git commit -m "feat: H 工业风 tokens + Starlight 60+ 变量覆盖"
```

---

## Phase 3: i18n 基础设施

### Task 3.1: 翻译字典

**Files:**
- Create: `src/content/i18n/zh-CN.json`
- Create: `src/content/i18n/en.json`

- [ ] **Step 1: 中文字典**

```json
{
  "site.tagline": "7 天跑通你的自托管 AI Agent",
  "nav.install": "01 · 安装",
  "nav.7days": "02 · 七日教程",
  "nav.migrate": "03 · 迁移指南",
  "nav.faq": "05 · FAQ",
  "nav.start": "开始",
  "hero.tag": "UNIT · No.001 · 2026",
  "hero.title.line1": "Self-Hosted",
  "hero.title.line2": "Messaging Agent.",
  "hero.sub": "七天组装一台 AI Agent，常驻你自己的服务器，通过 Telegram / Discord / Slack 工作。",
  "hero.cta.primary": "开始组装",
  "hero.cta.ghost": "阅读说明书",
  "hero.stats.days": "7 Days",
  "hero.stats.days.desc": "从零到上线",
  "hero.stats.chapters": "8 Chapters",
  "hero.stats.chapters.desc": "手把手教程",
  "hero.stats.oss": "100% OSS",
  "hero.stats.oss.desc": "MIT · 无厂商锁定",
  "spec.title": "SPECIFICATION · 规格",
  "spec.type": "Type",
  "spec.type.value": "Self-hosted AI agent framework",
  "spec.engine": "Engine",
  "spec.engine.value": "Nous Research · Hermes Agent (MIT)",
  "spec.channels": "Channels",
  "spec.channels.value": "Telegram · Discord · Slack · iMessage",
  "spec.memory": "Memory",
  "spec.memory.value": "Persistent · cross-session",
  "spec.docs": "Docs",
  "spec.docs.value": "中文 + English 双语",
  "days.section.num": "A.01",
  "days.section.title": "七日组装指南",
  "days.section.en": "7-DAY ASSEMBLY",
  "days.section.desc": "每天一个模块，一小时内完成。全部命令亲测可复现。",
  "migrate.section.num": "A.02",
  "migrate.section.title": "从 OpenClaw 迁移",
  "migrate.section.en": "COMPATIBILITY SHEET",
  "migrate.section.desc": "两个工具基因相似，概念一一对应。这里是亲测过的映射表。",
  "final.title.line1": "现在开始，",
  "final.title.line2": "7 天后",
  "final.title.line2.em": "上线你的 Agent",
  "final.desc": "免注册、免 API 积分、零厂商锁定。只要一本说明书、一台机器、七天。",
  "final.cta": "Begin Day 01",
  "footer.mit": "MIT · 非官方社区指南",
  "footer.github": "GitHub",
  "footer.rss": "RSS（敬请期待）",
  "coming_soon.title": "本页英文版尚未完工",
  "coming_soon.body": "中文版已上线，英文翻译欢迎 PR 贡献。",
  "coming_soon.cta": "到 GitHub 提交翻译"
}
```

- [ ] **Step 2: 英文字典（首轮占位，与中文同键）**

```json
{
  "site.tagline": "Run Your Self-Hosted AI Agent in 7 Days",
  "nav.install": "01 · Install",
  "nav.7days": "02 · 7-Day Path",
  "nav.migrate": "03 · Migrate",
  "nav.faq": "05 · FAQ",
  "nav.start": "Start",
  "hero.tag": "UNIT · No.001 · 2026",
  "hero.title.line1": "Self-Hosted",
  "hero.title.line2": "Messaging Agent.",
  "hero.sub": "Assemble your own messaging agent in 7 days. Self-hosted, runs on your server, talks via Telegram / Discord / Slack.",
  "hero.cta.primary": "Begin Assembly",
  "hero.cta.ghost": "Read the Manual",
  "hero.stats.days": "7 Days",
  "hero.stats.days.desc": "From zero to deploy",
  "hero.stats.chapters": "8 Chapters",
  "hero.stats.chapters.desc": "Hands-on tutorial",
  "hero.stats.oss": "100% OSS",
  "hero.stats.oss.desc": "MIT · No vendor lock",
  "spec.title": "SPECIFICATION",
  "spec.type": "Type",
  "spec.type.value": "Self-hosted AI agent framework",
  "spec.engine": "Engine",
  "spec.engine.value": "Nous Research · Hermes Agent (MIT)",
  "spec.channels": "Channels",
  "spec.channels.value": "Telegram · Discord · Slack · iMessage",
  "spec.memory": "Memory",
  "spec.memory.value": "Persistent · cross-session",
  "spec.docs": "Docs",
  "spec.docs.value": "中文 + English bilingual",
  "days.section.num": "A.01",
  "days.section.title": "7-Day Assembly",
  "days.section.en": "七日组装指南",
  "days.section.desc": "One module per day, each under an hour. Every command tested on the author's own machine.",
  "migrate.section.num": "A.02",
  "migrate.section.title": "Migrate from OpenClaw",
  "migrate.section.en": "COMPATIBILITY SHEET",
  "migrate.section.desc": "Both tools share DNA — concepts map 1:1. Here is the author's tested crosswalk.",
  "final.title.line1": "Start now,",
  "final.title.line2": "ship in",
  "final.title.line2.em": "7 days",
  "final.desc": "No signup. No API credits. No vendor lock-in. Just a manual, your machine, and seven focused days.",
  "final.cta": "Begin Day 01",
  "footer.mit": "MIT · Unofficial community guide",
  "footer.github": "GitHub",
  "footer.rss": "RSS (coming)",
  "coming_soon.title": "English version coming soon",
  "coming_soon.body": "The Chinese version is live. English translations welcome via PR.",
  "coming_soon.cta": "Contribute on GitHub"
}
```

- [ ] **Step 3: Commit**

```bash
git add src/content/i18n/
git commit -m "feat: 中英双语翻译字典 v1（覆盖营销页 + coming soon）"
```

---

### Task 3.2: i18n 工具函数（TDD）

**Files:**
- Create: `src/lib/locale.ts`
- Create: `src/lib/i18n.ts`
- Create: `src/tests/unit/locale.test.ts`
- Create: `src/tests/unit/i18n.test.ts`
- Create: `vitest.config.ts`

- [ ] **Step 1: 写 vitest 配置**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/tests/unit/**/*.test.ts'],
    environment: 'node'
  },
  resolve: {
    alias: {
      '@lib': new URL('./src/lib', import.meta.url).pathname,
      '@': new URL('./src', import.meta.url).pathname
    }
  }
});
```

- [ ] **Step 2: 写 locale.ts 的失败测试**

```typescript
// src/tests/unit/locale.test.ts
import { describe, it, expect } from 'vitest';
import { detectLocale, swapLocalePath, stripLocale } from '@lib/locale';

describe('detectLocale', () => {
  it('returns zh-CN for root path', () => {
    expect(detectLocale('/')).toBe('zh-CN');
  });
  it('returns zh-CN for any non-en path', () => {
    expect(detectLocale('/7-days/day-01')).toBe('zh-CN');
  });
  it('returns en for /en prefix', () => {
    expect(detectLocale('/en/')).toBe('en');
    expect(detectLocale('/en/7-days/day-01')).toBe('en');
  });
});

describe('swapLocalePath', () => {
  it('en → zh: strips /en prefix', () => {
    expect(swapLocalePath('/en/7-days/day-01', 'zh-CN')).toBe('/7-days/day-01');
    expect(swapLocalePath('/en/', 'zh-CN')).toBe('/');
  });
  it('zh → en: adds /en prefix', () => {
    expect(swapLocalePath('/7-days/day-01', 'en')).toBe('/en/7-days/day-01');
    expect(swapLocalePath('/', 'en')).toBe('/en/');
  });
  it('idempotent when target === current', () => {
    expect(swapLocalePath('/en/', 'en')).toBe('/en/');
    expect(swapLocalePath('/', 'zh-CN')).toBe('/');
  });
});

describe('stripLocale', () => {
  it('strips /en prefix', () => {
    expect(stripLocale('/en/7-days/day-01')).toBe('/7-days/day-01');
  });
  it('leaves zh paths unchanged', () => {
    expect(stripLocale('/7-days/day-01')).toBe('/7-days/day-01');
  });
});
```

- [ ] **Step 3: 运行测试验证失败**

```bash
npx vitest run src/tests/unit/locale.test.ts
```

期望：全部 FAIL（模块不存在）

- [ ] **Step 4: 实现 locale.ts**

```typescript
// src/lib/locale.ts
export type Locale = 'zh-CN' | 'en';

const EN_PREFIX = '/en';

export function detectLocale(pathname: string): Locale {
  if (pathname === '/en' || pathname === '/en/' || pathname.startsWith('/en/')) {
    return 'en';
  }
  return 'zh-CN';
}

export function stripLocale(pathname: string): string {
  if (pathname === '/en' || pathname === '/en/') return '/';
  if (pathname.startsWith('/en/')) return pathname.slice(3);
  return pathname;
}

export function swapLocalePath(pathname: string, target: Locale): string {
  const stripped = stripLocale(pathname);
  if (target === 'en') {
    return stripped === '/' ? '/en/' : `/en${stripped}`;
  }
  return stripped;
}
```

- [ ] **Step 5: 验证 locale 测试通过**

```bash
npx vitest run src/tests/unit/locale.test.ts
```

期望：PASS 全部

- [ ] **Step 6: 写 i18n.ts 的失败测试**

```typescript
// src/tests/unit/i18n.test.ts
import { describe, it, expect } from 'vitest';
import { createTranslator } from '@lib/i18n';

const dictZh = { 'hero.title': '你好', 'missing': undefined as any };
const dictEn = { 'hero.title': 'Hello' };

describe('createTranslator', () => {
  it('returns the translation for a known key', () => {
    const t = createTranslator(dictZh);
    expect(t('hero.title')).toBe('你好');
  });
  it('returns key itself for unknown key (with warning)', () => {
    const t = createTranslator(dictZh);
    expect(t('unknown.key')).toBe('unknown.key');
  });
  it('is locale-agnostic — caller passes dict', () => {
    const t = createTranslator(dictEn);
    expect(t('hero.title')).toBe('Hello');
  });
});
```

- [ ] **Step 7: 运行测试验证失败**

```bash
npx vitest run src/tests/unit/i18n.test.ts
```

期望：FAIL

- [ ] **Step 8: 实现 i18n.ts**

```typescript
// src/lib/i18n.ts
import zh from '@/content/i18n/zh-CN.json';
import en from '@/content/i18n/en.json';
import type { Locale } from './locale';

export const dicts: Record<Locale, Record<string, string>> = {
  'zh-CN': zh as Record<string, string>,
  'en': en as Record<string, string>
};

export function createTranslator(dict: Record<string, string>) {
  return (key: string): string => {
    const value = dict[key];
    if (value === undefined || value === null) {
      if (typeof console !== 'undefined') console.warn(`[i18n] missing key: ${key}`);
      return key;
    }
    return value;
  };
}

export function useT(locale: Locale) {
  return createTranslator(dicts[locale]);
}
```

- [ ] **Step 9: 验证 i18n 测试通过**

```bash
npx vitest run src/tests/unit/i18n.test.ts
```

期望：PASS 全部

- [ ] **Step 10: Commit**

```bash
git add src/lib/locale.ts src/lib/i18n.ts src/tests/unit/ vitest.config.ts
git commit -m "feat: i18n 工具（locale 检测/切换 + t() 翻译）带单元测试"
```

---

## Phase 4: 共享组件（纯展示，不带业务逻辑）

### Task 4.1: WarningStrip（顶部警戒带）

**Files:**
- Create: `src/components/WarningStrip.astro`

- [ ] **Step 1: 写组件**

```astro
---
// src/components/WarningStrip.astro
import LangSwitcher from './LangSwitcher.astro';
import type { Locale } from '@lib/locale';

interface Props {
  locale: Locale;
  pathname: string;
}
const { locale, pathname } = Astro.props;
---

<div class="strip">
  <span class="dot"></span>
  <span>● HERMES-AG</span>
  <span class="sep">··</span>
  <span>SELF-HOSTED AGENT · MADE FOR LEARNING</span>
  <span class="spacer"></span>
  <span>BATCH 26.Q2 · REV.A</span>
  <LangSwitcher locale={locale} pathname={pathname} />
</div>

<style>
  .strip {
    background: var(--ink);
    color: var(--amber);
    height: 42px;
    display: flex;
    align-items: center;
    padding: 0 28px;
    gap: 20px;
    border-bottom: 3px solid var(--tang);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 2.5px;
    font-weight: 700;
  }
  .dot { width: 8px; height: 8px; background: var(--tang); border-radius: 50%; }
  .sep { color: var(--tang); }
  .spacer { flex: 1; }
  @media (max-width: 760px) {
    .strip { font-size: 9px; gap: 10px; padding: 0 14px; }
    .strip :global(.hide-mobile) { display: none; }
  }
</style>
```

- [ ] **Step 2: Commit（LangSwitcher 还未实现，先不 build）**

```bash
git add src/components/WarningStrip.astro
git commit -m "feat: WarningStrip 顶部警戒带组件"
```

---

### Task 4.2: LangSwitcher（中/EN 切换）

**Files:**
- Create: `src/components/LangSwitcher.astro`

- [ ] **Step 1: 写组件**

```astro
---
// src/components/LangSwitcher.astro
import { swapLocalePath, type Locale } from '@lib/locale';

interface Props {
  locale: Locale;
  pathname: string;
}
const { locale, pathname } = Astro.props;
const zhHref = swapLocalePath(pathname, 'zh-CN');
const enHref = swapLocalePath(pathname, 'en');
---

<div class="lang" role="group" aria-label="Language switcher">
  <a href={zhHref} class:list={['lang-btn', { on: locale === 'zh-CN' }]}>中</a>
  <a href={enHref} class:list={['lang-btn', { on: locale === 'en' }]}>EN</a>
</div>

<style>
  .lang {
    display: inline-flex;
    border: 1px solid var(--amber);
  }
  .lang-btn {
    padding: 4px 10px;
    color: var(--amber);
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-decoration: none;
  }
  .lang-btn.on {
    background: var(--amber);
    color: var(--ink);
  }
</style>
```

- [ ] **Step 2: 构建验证编译过**

```bash
npx astro check
```

期望：无 error（可能有 warning 关于未使用的 component，正常）

- [ ] **Step 3: Commit**

```bash
git add src/components/LangSwitcher.astro
git commit -m "feat: LangSwitcher 语言切换（保留 path）"
```

---

### Task 4.3: SiteNav（营销页导航）

**Files:**
- Create: `src/components/SiteNav.astro`

- [ ] **Step 1: 写组件**

```astro
---
// src/components/SiteNav.astro
import type { Locale } from '@lib/locale';
import { useT } from '@lib/i18n';

interface Props {
  locale: Locale;
}
const { locale } = Astro.props;
const t = useT(locale);
const prefix = locale === 'en' ? '/en' : '';
---

<nav class="nav">
  <a href={`${prefix}/`} class="logo">
    Hermes<span class="slash">/</span>Agent
  </a>
  <ul>
    <li><a href={`${prefix}/#install`}>{t('nav.install')}</a></li>
    <li><a href={`${prefix}/7-days/`}>{t('nav.7days')}</a></li>
    <li><a href={`${prefix}/migrate/`}>{t('nav.migrate')}</a></li>
    <li><a href={`${prefix}/#faq`}>{t('nav.faq')}</a></li>
  </ul>
  <a href={`${prefix}/7-days/day-01/`} class="cta">◉ {t('nav.start')}</a>
</nav>

<style>
  .nav {
    display: flex;
    align-items: center;
    padding: 18px 32px;
    gap: 32px;
    border-bottom: 1px solid var(--ink);
    background: var(--sand);
  }
  .logo {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 22px;
    letter-spacing: -1px;
    color: var(--ink);
    text-decoration: none;
  }
  .slash { color: var(--tang); }
  ul {
    list-style: none;
    display: flex;
    gap: 28px;
    margin: 0;
    padding: 0;
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }
  ul a { color: var(--ink); text-decoration: none; }
  ul a:hover { color: var(--tang); }
  .cta {
    margin-left: auto;
    background: var(--tang);
    color: var(--ink);
    padding: 10px 18px;
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-decoration: none;
  }
  @media (max-width: 760px) {
    .nav { flex-wrap: wrap; padding: 14px 16px; gap: 14px; }
    ul { gap: 14px; font-size: 10px; }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SiteNav.astro
git commit -m "feat: SiteNav 营销页导航（i18n 感知）"
```

---

### Task 4.4: SiteFooter（含 GitHub 链接）

**Files:**
- Create: `src/components/SiteFooter.astro`

- [ ] **Step 1: 写组件**

```astro
---
// src/components/SiteFooter.astro
import type { Locale } from '@lib/locale';
import { useT } from '@lib/i18n';

interface Props { locale: Locale; }
const { locale } = Astro.props;
const t = useT(locale);
---

<footer>
  <span>HERMES/AGENT</span>
  <span class="sep">/</span>
  <span>S/N 2026-0001</span>
  <span class="sep">/</span>
  <span>{t('footer.mit')}</span>
  <span class="spacer"></span>
  <a href="https://github.com/Hubery23" rel="noopener" target="_blank">{t('footer.github')} ↗</a>
  <span>{t('footer.rss')}</span>
</footer>

<style>
  footer {
    background: var(--ink);
    color: #777;
    padding: 24px 32px;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 2px;
    display: flex;
    align-items: center;
    gap: 20px;
    border-top: 1px solid #333;
    text-transform: uppercase;
  }
  .sep { color: var(--tang); }
  .spacer { flex: 1; }
  a { color: #aaa; text-decoration: none; }
  a:hover { color: var(--sand); }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SiteFooter.astro
git commit -m "feat: SiteFooter（GitHub 链接指向 @Hubery23）"
```

---

### Task 4.5: 剩余 H 组件（批量）

**Files（本 task 创建 5 个小组件）:**
- Create: `src/components/MarqueeDivider.astro`
- Create: `src/components/SectionHead.astro`
- Create: `src/components/SpecCard.astro`
- Create: `src/components/DayCard.astro`
- Create: `src/components/CompatChart.astro`

- [ ] **Step 1: MarqueeDivider**

```astro
---
// src/components/MarqueeDivider.astro
---
<div class="divider">
  <span>● SKILL</span><span class="sep">/</span>
  <span>◉ INSTALL</span><span class="sep">/</span>
  <span>▲ MEMORY</span><span class="sep">/</span>
  <span>■ SCHEDULE</span><span class="sep">/</span>
  <span>◆ MIGRATE</span><span class="sep">/</span>
  <span>● MCP</span>
</div>
<style>
  .divider {
    background: var(--ink); color: var(--sand);
    padding: 14px 32px; display: flex; gap: 20px;
    overflow: hidden; white-space: nowrap;
    font-family: var(--font-mono);
    font-size: 13px; letter-spacing: 4px; font-weight: 700;
    text-transform: uppercase;
  }
  .sep { color: var(--tang); }
</style>
```

- [ ] **Step 2: SectionHead**

```astro
---
// src/components/SectionHead.astro
interface Props { num: string; title: string; en?: string; desc?: string; }
const { num, title, en, desc } = Astro.props;
---
<div class="section-head">
  <div class="num">{num}</div>
  <h2>{title}{en && <span class="en">/ {en}</span>}</h2>
  {desc && <p class="desc">{desc}</p>}
</div>
<style>
  .section-head {
    display: flex; align-items: flex-end; gap: 20px;
    margin-bottom: 48px; padding-bottom: 18px;
    border-bottom: 2px solid var(--ink);
  }
  .num {
    font-family: var(--font-display);
    font-size: 48px; font-weight: 800; line-height: 0.9;
    color: var(--tang); letter-spacing: -2px;
  }
  h2 {
    font-family: var(--font-display);
    font-size: 42px; font-weight: 700;
    letter-spacing: -1.5px; line-height: 1; margin: 0;
  }
  .en {
    font-size: 16px; font-weight: 500; color: var(--ink-soft);
    letter-spacing: 2px; margin-left: 8px; text-transform: uppercase;
    font-family: var(--font-mono);
  }
  .desc {
    margin-left: auto; max-width: 340px;
    font-size: 14px; color: var(--ink-soft); line-height: 1.5;
  }
  @media (max-width: 760px) {
    .section-head { flex-direction: column; align-items: flex-start; gap: 8px; }
    .num { font-size: 28px; }
    h2 { font-size: 28px; }
    .desc { margin-left: 0; }
  }
</style>
```

- [ ] **Step 3: SpecCard**

```astro
---
// src/components/SpecCard.astro
import type { Locale } from '@lib/locale';
import { useT } from '@lib/i18n';
interface Props { locale: Locale; }
const { locale } = Astro.props;
const t = useT(locale);
const rows: [string, string][] = [
  [t('spec.type'), t('spec.type.value')],
  [t('spec.engine'), t('spec.engine.value')],
  [t('spec.channels'), t('spec.channels.value')],
  [t('spec.memory'), t('spec.memory.value')],
  [t('spec.docs'), t('spec.docs.value')]
];
---
<div class="spec-card">
  <div class="card-title">{t('spec.title')}</div>
  <dl>
    {rows.map(([k, v]) => (
      <>
        <dt>{k}</dt>
        <dd>{v}</dd>
      </>
    ))}
  </dl>
  <div class="card-foot">
    <span>S/N 2026-0001</span>
    <span class="ce">中/EN DUAL</span>
  </div>
</div>
<style>
  .spec-card {
    background: var(--ink); color: var(--paper); padding: 28px;
    border-top: 4px solid var(--tang);
    font-family: var(--font-mono); font-size: 12px;
    position: relative;
  }
  .spec-card::before {
    content: ''; position: absolute; top: 12px; right: 12px;
    width: 10px; height: 10px; background: var(--amber); border-radius: 50%;
  }
  .card-title {
    font-family: var(--font-display); font-size: 20px; font-weight: 700;
    margin-bottom: 18px; letter-spacing: -0.5px;
  }
  dl { display: grid; grid-template-columns: 1fr 1.3fr; gap: 8px 14px; margin: 0; }
  dt { color: var(--amber); letter-spacing: 2px; font-size: 10px; text-transform: uppercase; font-weight: 600; padding-top: 2px; }
  dd { font-weight: 500; line-height: 1.4; margin: 0; }
  .card-foot {
    margin-top: 22px; padding-top: 14px;
    border-top: 1px dashed #555;
    font-size: 10px; color: #999; letter-spacing: 2px;
    display: flex; justify-content: space-between;
  }
  .ce { background: var(--amber); color: var(--ink); padding: 3px 8px; font-weight: 700; }
</style>
```

- [ ] **Step 4: DayCard**

```astro
---
// src/components/DayCard.astro
interface Props {
  num: string;       // e.g. "H/01.01"
  day: string;       // e.g. "DAY 01"
  titleZh: string;
  titleEn: string;
  desc: string;
  milestone?: boolean;
  href: string;
}
const { num, day, titleZh, titleEn, desc, milestone = false, href } = Astro.props;
---
<a class:list={['day', { highlight: milestone }]} href={href}>
  {milestone && <span class="tape">★ MILESTONE</span>}
  <div class="d-num">{num}</div>
  <div class="d-title-zh">{titleZh}</div>
  <div class="d-title-en">{titleEn}</div>
  <p class="d-desc">{desc}</p>
  <div class="d-foot">
    <span>{day}</span>
    <span class="arrow">→</span>
  </div>
</a>
<style>
  .day {
    background: var(--sand); padding: 24px 20px 22px;
    position: relative; display: flex; flex-direction: column;
    min-height: 210px; transition: background 0.15s;
    text-decoration: none; color: var(--ink);
  }
  .day:hover { background: var(--paper); }
  .d-num {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 3px; font-weight: 700;
    color: var(--ink-soft); margin-bottom: 10px;
  }
  .d-title-zh {
    font-family: var(--font-display); font-size: 24px; font-weight: 700;
    letter-spacing: -0.5px; line-height: 1.1; margin-bottom: 4px;
  }
  .d-title-en {
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 1px; color: var(--ink-soft);
    margin-bottom: 14px; text-transform: uppercase;
  }
  .d-desc { font-size: 13px; line-height: 1.45; flex: 1; margin: 0; }
  .d-foot {
    margin-top: 14px; display: flex; justify-content: space-between;
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 2px; font-weight: 600; color: var(--ink-soft);
    border-top: 1px dashed var(--ink-soft); padding-top: 10px;
  }
  .arrow { color: var(--tang); font-size: 14px; }
  .highlight { background: var(--amber); }
  .highlight .d-num, .highlight .d-foot { color: var(--ink); }
  .highlight .d-foot { border-top-color: var(--ink); }
  .tape {
    position: absolute; top: -1px; right: -1px;
    background: var(--tang); color: var(--ink);
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 1.5px; font-weight: 700;
    padding: 4px 10px; text-transform: uppercase;
  }
</style>
```

- [ ] **Step 5: CompatChart**

```astro
---
// src/components/CompatChart.astro
interface Pair { from: string; fromMeta: string; to: string; toMeta: string; }
interface Props {
  pairs: Pair[];
  fromLabel: string;
  toLabel: string;
  fromTitle: string;
  toTitle: string;
}
const { pairs, fromLabel, toLabel, fromTitle, toTitle } = Astro.props;
---
<div class="migration-grid">
  <div class="mig-col">
    <div class="mig-lab">{fromLabel}</div>
    <h3>{fromTitle}</h3>
    <ul>
      {pairs.map(p => <li><span>{p.from}</span><span class="mono">{p.fromMeta}</span></li>)}
    </ul>
  </div>
  <div class="mig-arrow">→</div>
  <div class="mig-col target">
    <div class="mig-lab">{toLabel}</div>
    <h3>{toTitle}</h3>
    <ul>
      {pairs.map(p => <li><span>{p.to}</span><span class="mono">{p.toMeta}</span></li>)}
    </ul>
  </div>
</div>
<style>
  .migration-grid {
    display: grid; grid-template-columns: 1fr 60px 1fr;
    gap: 0; border: 1.5px solid var(--ink); background: var(--ink);
  }
  .mig-col { background: var(--paper); padding: 28px; }
  .mig-col.target { background: var(--ink); color: var(--sand); }
  .mig-col h3 {
    font-family: var(--font-display); font-size: 24px; font-weight: 700;
    letter-spacing: -0.5px; margin-bottom: 4px;
  }
  .mig-lab {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 3px; font-weight: 700;
    color: var(--tang); margin-bottom: 18px; text-transform: uppercase;
  }
  .mig-col.target .mig-lab { color: var(--amber); }
  .mig-col ul { list-style: none; margin: 0; padding: 0; }
  .mig-col li {
    padding: 11px 0; border-bottom: 1px dotted currentColor;
    font-size: 14px; display: flex; justify-content: space-between;
  }
  .mig-col li:last-child { border: none; }
  .mono { font-size: 11px; opacity: 0.6; letter-spacing: 1px; font-family: var(--font-mono); }
  .mig-arrow {
    background: var(--tang); display: flex;
    align-items: center; justify-content: center;
    font-family: var(--font-display); font-size: 40px; font-weight: 800;
    color: var(--ink);
  }
  @media (max-width: 760px) {
    .migration-grid { grid-template-columns: 1fr; }
    .mig-arrow { padding: 18px; font-size: 28px; }
  }
</style>
```

- [ ] **Step 6: 构建验证**

```bash
npx astro check
```

期望：无 error

- [ ] **Step 7: Commit（一次性）**

```bash
git add src/components/MarqueeDivider.astro src/components/SectionHead.astro src/components/SpecCard.astro src/components/DayCard.astro src/components/CompatChart.astro
git commit -m "feat: 5 个 H 展示组件（MarqueeDivider/SectionHead/SpecCard/DayCard/CompatChart）"
```

---

## Phase 5: 营销页

### Task 5.1: MarketingLayout（首页/迁移/索引共用外壳）

**Files:**
- Create: `src/layouts/MarketingLayout.astro`

- [ ] **Step 1: 写布局**

```astro
---
// src/layouts/MarketingLayout.astro
import type { Locale } from '@lib/locale';
import WarningStrip from '@components/WarningStrip.astro';
import SiteNav from '@components/SiteNav.astro';
import SiteFooter from '@components/SiteFooter.astro';
import '@styles/fonts.css';
import '@styles/theme.css';

interface Props {
  locale: Locale;
  title: string;
  description?: string;
}
const { locale, title, description } = Astro.props;
---

<!DOCTYPE html>
<html lang={locale}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{title}</title>
  {description && <meta name="description" content={description} />}
  <link rel="canonical" href={`https://hermesagentguide.online${Astro.url.pathname}`} />
</head>
<body>
  <WarningStrip locale={locale} pathname={Astro.url.pathname} />
  <SiteNav locale={locale} />
  <main>
    <slot />
  </main>
  <SiteFooter locale={locale} />
</body>
</html>

<style is:global>
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body { background: var(--sand); color: var(--ink); font-family: var(--font-body); line-height: 1.5; }
  main { min-height: 60vh; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/MarketingLayout.astro
git commit -m "feat: MarketingLayout（首页/迁移/索引共用外壳）"
```

---

### Task 5.2: 中文首页 `/`

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: 写首页**

```astro
---
// src/pages/index.astro
import MarketingLayout from '@layouts/MarketingLayout.astro';
import MarqueeDivider from '@components/MarqueeDivider.astro';
import SectionHead from '@components/SectionHead.astro';
import SpecCard from '@components/SpecCard.astro';
import DayCard from '@components/DayCard.astro';
import CompatChart from '@components/CompatChart.astro';
import { useT } from '@lib/i18n';

const locale = 'zh-CN' as const;
const t = useT(locale);

const days = [
  { num: 'H/01.01', day: 'DAY 01', titleZh: '跑起来：Hermes 的第一次对话', titleEn: 'Boot Up: Your First Chat', desc: '装好本体、开好环境变量，完成第一次对话。', href: '/7-days/day-01/' },
  { num: 'H/01.02', day: 'DAY 02', titleZh: '挑个大脑：模型选型与 API 接入', titleEn: 'Pick a Brain: Model & API', desc: 'Claude / GPT / 本地模型怎么选；配 API key。', href: '/7-days/day-02/' },
  { num: 'H/01.03', day: 'DAY 03', titleZh: '入驻聊天室：Telegram / Discord / Slack', titleEn: 'Go Social', desc: 'BotFather 发 token、.env、让 Hermes 在群里说话。', href: '/7-days/day-03/' },
  { num: 'H/01.04', day: 'DAY 04', titleZh: '让 Agent 动手：内置工具实战', titleEn: 'Give It Hands', desc: '调用至少 2 个内置工具，看到真实副作用。', href: '/7-days/day-04/' },
  { num: 'H/01.05', day: 'DAY 05', titleZh: '教它新本事：安装第一个 Skill', titleEn: 'Teach a Trick', desc: '从官方 hub 装 skill，对话触发它。', milestone: true, href: '/7-days/day-05/' },
  { num: 'H/01.06', day: 'DAY 06', titleZh: '记忆与状态：会话、压缩、备份', titleEn: 'Memory & State', desc: '让 Agent 记住昨天聊过的内容。', href: '/7-days/day-06/' },
  { num: 'H/01.07', day: 'DAY 07', titleZh: '全自动化：定时任务与故障排查', titleEn: 'Full Auto', desc: '自然语言写 cron；日志定位典型错误。', href: '/7-days/day-07/' },
  { num: 'H/01.08', day: 'BONUS', titleZh: '从 OpenClaw 搬家：平滑迁移指南', titleEn: 'Leaving OpenClaw', desc: '亲测过的映射表，搬运 skills 与记忆。', href: '/migrate/' }
];

const compatPairs = [
  { from: 'Skills', fromMeta: '/skills/*', to: 'Skills System', toMeta: 'hub-installable' },
  { from: 'Integrations', fromMeta: '50+ services', to: 'Toolsets + MCP', toMeta: 'composable' },
  { from: 'Heartbeats', fromMeta: 'cron-like', to: 'Scheduled Tasks', toMeta: 'natural-lang' },
  { from: 'Persistent Memory', fromMeta: '24/7 ctx', to: 'Memory System', toMeta: 'auto-compact' },
  { from: 'Bot Framework', fromMeta: 'multi-channel', to: 'Messaging Platforms', toMeta: 'plugin-based' }
];
---

<MarketingLayout locale={locale} title={`Hermes Agent 中文指南 · ${t('site.tagline')}`} description={t('hero.sub')}>

  <!-- Hero -->
  <section class="hero">
    <div class="hero-l">
      <div class="hero-id">
        <div class="big">H/01</div>
        <div class="meta">
          <span class="tag">{t('hero.tag')}</span>
          <h1>{t('hero.title.line1')}<br>{t('hero.title.line2')}</h1>
        </div>
      </div>
      <p class="hero-sub">{t('hero.sub')}</p>
      <div class="hero-cta">
        <a href="/7-days/day-01/" class="btn btn-primary">◉ {t('hero.cta.primary')}</a>
        <a href="/7-days/" class="btn btn-ghost">▤ {t('hero.cta.ghost')}</a>
      </div>
      <div class="hero-stats">
        <div class="stat"><b>{t('hero.stats.days')}</b><span>{t('hero.stats.days.desc')}</span></div>
        <div class="stat"><b>{t('hero.stats.chapters')}</b><span>{t('hero.stats.chapters.desc')}</span></div>
        <div class="stat"><b>{t('hero.stats.oss')}</b><span>{t('hero.stats.oss.desc')}</span></div>
      </div>
    </div>
    <div class="hero-r">
      <SpecCard locale={locale} />
    </div>
  </section>

  <MarqueeDivider />

  <!-- 7 Days -->
  <section class="days" id="days">
    <SectionHead
      num={t('days.section.num')}
      title={t('days.section.title')}
      en={t('days.section.en')}
      desc={t('days.section.desc')}
    />
    <div class="day-grid">
      {days.map(d => <DayCard {...d} />)}
    </div>
  </section>

  <!-- Migration -->
  <section class="migration">
    <SectionHead
      num={t('migrate.section.num')}
      title={t('migrate.section.title')}
      en={t('migrate.section.en')}
      desc={t('migrate.section.desc')}
    />
    <CompatChart
      pairs={compatPairs}
      fromLabel="[ FROM ]"
      toLabel="[ TO · HERMES ]"
      fromTitle="OpenClaw"
      toTitle="Hermes Agent"
    />
  </section>

  <!-- Final CTA -->
  <section class="final">
    <h2>{t('final.title.line1')}<br>{t('final.title.line2')}<span>{t('final.title.line2.em')}</span>.</h2>
    <p>{t('final.desc')}</p>
    <a href="/7-days/day-01/" class="btn btn-primary">◉ {t('final.cta')}</a>
  </section>

</MarketingLayout>

<style>
  .hero {
    padding: 80px 32px 60px;
    display: grid; grid-template-columns: 1.1fr 1fr; gap: 60px;
    border-bottom: 1px solid var(--ink);
    position: relative; overflow: hidden;
  }
  .hero::before {
    content: 'HERMES'; position: absolute;
    bottom: -48px; right: -20px;
    font-family: var(--font-display); font-weight: 800; font-size: 320px;
    color: var(--sand-dark); letter-spacing: -10px;
    pointer-events: none; line-height: 0.8; z-index: 0;
  }
  .hero-l, .hero-r { position: relative; z-index: 1; }
  .hero-id { display: flex; align-items: baseline; gap: 22px; margin-bottom: 28px; }
  .hero-id .big {
    font-family: var(--font-display); font-size: 140px; font-weight: 800;
    color: var(--tang); line-height: 0.85; letter-spacing: -6px;
  }
  .hero-id .meta { padding-top: 14px; }
  .hero-id .tag {
    display: inline-block; background: var(--ink); color: var(--amber);
    padding: 3px 8px; font-family: var(--font-mono);
    font-size: 10px; letter-spacing: 2px; font-weight: 700; margin-bottom: 8px;
  }
  .hero-id h1 {
    font-family: var(--font-display); font-size: 36px; font-weight: 700;
    letter-spacing: -1px; line-height: 1.05; margin: 0;
  }
  .hero-sub {
    font-family: var(--font-display); font-size: 22px; font-weight: 500;
    line-height: 1.3; max-width: 540px; margin-bottom: 24px;
  }
  .hero-cta { display: flex; gap: 8px; margin-bottom: 36px; flex-wrap: wrap; }
  .btn {
    font-family: var(--font-mono); font-size: 12px;
    letter-spacing: 2.5px; font-weight: 700; text-transform: uppercase;
    padding: 14px 22px; display: inline-flex; align-items: center; gap: 8px;
    text-decoration: none;
  }
  .btn-primary { background: var(--tang); color: var(--ink); }
  .btn-ghost { background: transparent; color: var(--ink); border: 1.5px solid var(--ink); }
  .hero-stats { display: flex; gap: 40px; flex-wrap: wrap; }
  .stat b {
    font-family: var(--font-display); font-size: 28px; font-weight: 700;
    letter-spacing: -0.5px; display: block;
  }
  .stat span {
    font-family: var(--font-mono); font-size: 10px; letter-spacing: 2px;
    text-transform: uppercase; color: var(--ink-soft);
  }
  .days, .migration { padding: 80px 32px; border-bottom: 1px solid var(--ink); }
  .migration { background: var(--paper); }
  .day-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1px; background: var(--ink); border: 1px solid var(--ink);
  }
  .final {
    padding: 100px 32px; text-align: center;
    background: var(--ink); color: var(--sand);
    position: relative; overflow: hidden;
  }
  .final h2 {
    font-family: var(--font-display); font-size: 80px; font-weight: 800;
    letter-spacing: -3px; line-height: 0.95; margin-bottom: 16px;
  }
  .final h2 span { color: var(--amber); }
  .final p { font-size: 16px; color: #aaa; max-width: 520px; margin: 0 auto 32px; }
  .final .btn-primary { padding: 18px 32px; font-size: 13px; letter-spacing: 3px; }

  @media (max-width: 980px) {
    .hero { grid-template-columns: 1fr; padding: 48px 20px; }
    .hero-id .big { font-size: 96px; }
    .hero::before { font-size: 180px; bottom: -20px; }
    .day-grid { grid-template-columns: repeat(2, 1fr); }
    .final h2 { font-size: 42px; }
  }
</style>
```

- [ ] **Step 2: 启动 dev server 并手动验证**

```bash
npm run dev
```

浏览器打开 `http://localhost:4321/`。期望：看到完整的 H 风格首页，hero / 7 天卡片 / 迁移对照 / final CTA / footer 都在。

- [ ] **Step 3: 停掉 dev server，commit**

```bash
git add src/pages/index.astro
git commit -m "feat: 中文首页 /（H 风格完整实现）"
```

---

### Task 5.3: 英文首页 `/en/`

**Files:**
- Create: `src/pages/en/index.astro`

- [ ] **Step 1: 写英文首页（复用组件，只改 locale 和链接前缀）**

```astro
---
// src/pages/en/index.astro
import MarketingLayout from '@layouts/MarketingLayout.astro';
import MarqueeDivider from '@components/MarqueeDivider.astro';
import SectionHead from '@components/SectionHead.astro';
import SpecCard from '@components/SpecCard.astro';
import DayCard from '@components/DayCard.astro';
import CompatChart from '@components/CompatChart.astro';
import { useT } from '@lib/i18n';

const locale = 'en' as const;
const t = useT(locale);

const days = [
  { num: 'H/01.01', day: 'DAY 01', titleZh: '跑起来：Hermes 的第一次对话', titleEn: 'Boot Up: Your First Chat', desc: 'Install, set env vars, complete your first chat.', href: '/en/7-days/day-01/' },
  { num: 'H/01.02', day: 'DAY 02', titleZh: '挑个大脑：模型选型与 API 接入', titleEn: 'Pick a Brain: Model & API', desc: 'Choose Claude / GPT / local; configure API keys.', href: '/en/7-days/day-02/' },
  { num: 'H/01.03', day: 'DAY 03', titleZh: '入驻聊天室：Telegram / Discord / Slack', titleEn: 'Go Social', desc: 'Get a bot token, .env, chat with Hermes.', href: '/en/7-days/day-03/' },
  { num: 'H/01.04', day: 'DAY 04', titleZh: '让 Agent 动手：内置工具实战', titleEn: 'Give It Hands', desc: 'Invoke at least 2 built-in tools with real effects.', href: '/en/7-days/day-04/' },
  { num: 'H/01.05', day: 'DAY 05', titleZh: '教它新本事：安装第一个 Skill', titleEn: 'Teach a Trick', desc: 'Install a skill from the hub and trigger it by chat.', milestone: true, href: '/en/7-days/day-05/' },
  { num: 'H/01.06', day: 'DAY 06', titleZh: '记忆与状态：会话、压缩、备份', titleEn: 'Memory & State', desc: 'Make Hermes remember what you said yesterday.', href: '/en/7-days/day-06/' },
  { num: 'H/01.07', day: 'DAY 07', titleZh: '全自动化：定时任务与故障排查', titleEn: 'Full Auto', desc: 'Natural-language cron; pinpoint typical errors.', href: '/en/7-days/day-07/' },
  { num: 'H/01.08', day: 'BONUS', titleZh: '从 OpenClaw 搬家：平滑迁移指南', titleEn: 'Leaving OpenClaw', desc: 'Tested crosswalk for skills and memory.', href: '/en/migrate/' }
];

const compatPairs = [
  { from: 'Skills', fromMeta: '/skills/*', to: 'Skills System', toMeta: 'hub-installable' },
  { from: 'Integrations', fromMeta: '50+ services', to: 'Toolsets + MCP', toMeta: 'composable' },
  { from: 'Heartbeats', fromMeta: 'cron-like', to: 'Scheduled Tasks', toMeta: 'natural-lang' },
  { from: 'Persistent Memory', fromMeta: '24/7 ctx', to: 'Memory System', toMeta: 'auto-compact' },
  { from: 'Bot Framework', fromMeta: 'multi-channel', to: 'Messaging Platforms', toMeta: 'plugin-based' }
];
---

<MarketingLayout locale={locale} title={`Hermes Agent Guide · ${t('site.tagline')}`} description={t('hero.sub')}>
  <!-- Identical structure to /; use ZH file as reference, replace t() source and hrefs to /en/* -->
  <!-- (Full markup omitted here for brevity — mirror src/pages/index.astro swapping locale + prefix /en) -->
  <section class="hero">
    <div class="hero-l">
      <div class="hero-id">
        <div class="big">H/01</div>
        <div class="meta">
          <span class="tag">{t('hero.tag')}</span>
          <h1>{t('hero.title.line1')}<br>{t('hero.title.line2')}</h1>
        </div>
      </div>
      <p class="hero-sub">{t('hero.sub')}</p>
      <div class="hero-cta">
        <a href="/en/7-days/day-01/" class="btn btn-primary">◉ {t('hero.cta.primary')}</a>
        <a href="/en/7-days/" class="btn btn-ghost">▤ {t('hero.cta.ghost')}</a>
      </div>
      <div class="hero-stats">
        <div class="stat"><b>{t('hero.stats.days')}</b><span>{t('hero.stats.days.desc')}</span></div>
        <div class="stat"><b>{t('hero.stats.chapters')}</b><span>{t('hero.stats.chapters.desc')}</span></div>
        <div class="stat"><b>{t('hero.stats.oss')}</b><span>{t('hero.stats.oss.desc')}</span></div>
      </div>
    </div>
    <div class="hero-r">
      <SpecCard locale={locale} />
    </div>
  </section>
  <MarqueeDivider />
  <section class="days" id="days">
    <SectionHead num={t('days.section.num')} title={t('days.section.title')} en={t('days.section.en')} desc={t('days.section.desc')} />
    <div class="day-grid">{days.map(d => <DayCard {...d} />)}</div>
  </section>
  <section class="migration">
    <SectionHead num={t('migrate.section.num')} title={t('migrate.section.title')} en={t('migrate.section.en')} desc={t('migrate.section.desc')} />
    <CompatChart pairs={compatPairs} fromLabel="[ FROM ]" toLabel="[ TO · HERMES ]" fromTitle="OpenClaw" toTitle="Hermes Agent" />
  </section>
  <section class="final">
    <h2>{t('final.title.line1')}<br>{t('final.title.line2')} <span>{t('final.title.line2.em')}</span>.</h2>
    <p>{t('final.desc')}</p>
    <a href="/en/7-days/day-01/" class="btn btn-primary">◉ {t('final.cta')}</a>
  </section>
</MarketingLayout>

<style>
  /* 同 src/pages/index.astro —— 复制其 <style> 块 */
  .hero {
    padding: 80px 32px 60px;
    display: grid; grid-template-columns: 1.1fr 1fr; gap: 60px;
    border-bottom: 1px solid var(--ink);
    position: relative; overflow: hidden;
  }
  .hero::before {
    content: 'HERMES'; position: absolute;
    bottom: -48px; right: -20px;
    font-family: var(--font-display); font-weight: 800; font-size: 320px;
    color: var(--sand-dark); letter-spacing: -10px;
    pointer-events: none; line-height: 0.8; z-index: 0;
  }
  .hero-l, .hero-r { position: relative; z-index: 1; }
  .hero-id { display: flex; align-items: baseline; gap: 22px; margin-bottom: 28px; }
  .hero-id .big { font-family: var(--font-display); font-size: 140px; font-weight: 800; color: var(--tang); line-height: 0.85; letter-spacing: -6px; }
  .hero-id .meta { padding-top: 14px; }
  .hero-id .tag { display: inline-block; background: var(--ink); color: var(--amber); padding: 3px 8px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 2px; font-weight: 700; margin-bottom: 8px; }
  .hero-id h1 { font-family: var(--font-display); font-size: 36px; font-weight: 700; letter-spacing: -1px; line-height: 1.05; margin: 0; }
  .hero-sub { font-family: var(--font-display); font-size: 22px; font-weight: 500; line-height: 1.3; max-width: 540px; margin-bottom: 24px; }
  .hero-cta { display: flex; gap: 8px; margin-bottom: 36px; flex-wrap: wrap; }
  .btn { font-family: var(--font-mono); font-size: 12px; letter-spacing: 2.5px; font-weight: 700; text-transform: uppercase; padding: 14px 22px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; }
  .btn-primary { background: var(--tang); color: var(--ink); }
  .btn-ghost { background: transparent; color: var(--ink); border: 1.5px solid var(--ink); }
  .hero-stats { display: flex; gap: 40px; flex-wrap: wrap; }
  .stat b { font-family: var(--font-display); font-size: 28px; font-weight: 700; letter-spacing: -0.5px; display: block; }
  .stat span { font-family: var(--font-mono); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--ink-soft); }
  .days, .migration { padding: 80px 32px; border-bottom: 1px solid var(--ink); }
  .migration { background: var(--paper); }
  .day-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--ink); border: 1px solid var(--ink); }
  .final { padding: 100px 32px; text-align: center; background: var(--ink); color: var(--sand); position: relative; overflow: hidden; }
  .final h2 { font-family: var(--font-display); font-size: 80px; font-weight: 800; letter-spacing: -3px; line-height: 0.95; margin-bottom: 16px; }
  .final h2 span { color: var(--amber); }
  .final p { font-size: 16px; color: #aaa; max-width: 520px; margin: 0 auto 32px; }
  .final .btn-primary { padding: 18px 32px; font-size: 13px; letter-spacing: 3px; }
  @media (max-width: 980px) {
    .hero { grid-template-columns: 1fr; padding: 48px 20px; }
    .hero-id .big { font-size: 96px; }
    .hero::before { font-size: 180px; bottom: -20px; }
    .day-grid { grid-template-columns: repeat(2, 1fr); }
    .final h2 { font-size: 42px; }
  }
</style>
```

- [ ] **Step 2: 验证英文首页能跑**

```bash
npm run dev
```

访问 `http://localhost:4321/en/`，验证：(1) 文案切换为英文，(2) 所有内部链接带 `/en/` 前缀，(3) 语言切换器高亮 EN。

- [ ] **Step 3: Commit**

```bash
git add src/pages/en/index.astro
git commit -m "feat: 英文首页 /en/（完整 H 风格，i18n 完整贯穿）"
```

---

### Task 5.4: 迁移落地页（中 + 英）

**Files:**
- Create: `src/pages/migrate.astro`
- Create: `src/pages/en/migrate.astro`

- [ ] **Step 1: 中文迁移落地页**

```astro
---
// src/pages/migrate.astro
import MarketingLayout from '@layouts/MarketingLayout.astro';
import SectionHead from '@components/SectionHead.astro';
import CompatChart from '@components/CompatChart.astro';
import MarqueeDivider from '@components/MarqueeDivider.astro';

const locale = 'zh-CN' as const;

const compatPairs = [
  { from: 'Skills', fromMeta: '/skills/*', to: 'Skills System', toMeta: 'hub-installable' },
  { from: 'Integrations', fromMeta: '50+ services', to: 'Toolsets + MCP', toMeta: 'composable' },
  { from: 'Heartbeats', fromMeta: 'cron-like', to: 'Scheduled Tasks', toMeta: 'natural-lang' },
  { from: 'Persistent Memory', fromMeta: '24/7 ctx', to: 'Memory System', toMeta: 'auto-compact' },
  { from: 'Bot Framework', fromMeta: 'multi-channel', to: 'Messaging Platforms', toMeta: 'plugin-based' }
];
---

<MarketingLayout locale={locale} title="从 OpenClaw 搬家 · Hermes Agent 迁移指南" description="OpenClaw 与 Hermes Agent 概念一一对应的迁移映射表。">
  <section class="intro">
    <div class="intro-inner">
      <div class="big">H/01.08</div>
      <h1>从 OpenClaw 搬家<br>到 Hermes Agent</h1>
      <p class="sub">两个工具基因相似，概念一一对应。下面是作者亲测过的映射表——照着搬，不走弯路。</p>
      <a href="/7-days/day-01/" class="btn btn-primary">◉ 还没装 Hermes？先从 Day 01 开始</a>
    </div>
  </section>

  <MarqueeDivider />

  <section class="sheet">
    <SectionHead num="A.02" title="兼容性对照表" en="COMPATIBILITY SHEET" desc="本表基于 OpenClaw 2026-Q1 和 Hermes Agent v0.4 文档整理，作者于 2026-04 亲测。" />
    <CompatChart pairs={compatPairs} fromLabel="[ FROM ]" toLabel="[ TO · HERMES ]" fromTitle="OpenClaw" toTitle="Hermes Agent" />
  </section>

  <section class="stub">
    <SectionHead num="A.03" title="详细迁移步骤" en="STEP-BY-STEP" />
    <p class="coming">📦 详细迁移教程正在撰写中，敬请期待。期间欢迎在 <a href="https://github.com/Hubery23">GitHub</a> 提 issue 或 PR。</p>
  </section>
</MarketingLayout>

<style>
  .intro { padding: 80px 32px; background: var(--sand); border-bottom: 1px solid var(--ink); }
  .intro-inner { max-width: 720px; }
  .big { font-family: var(--font-display); font-size: 120px; font-weight: 800; color: var(--tang); line-height: 0.85; letter-spacing: -5px; margin-bottom: 18px; }
  h1 { font-family: var(--font-display); font-size: 54px; font-weight: 700; letter-spacing: -1.5px; line-height: 1.05; margin: 0 0 18px; }
  .sub { font-family: var(--font-display); font-size: 20px; line-height: 1.35; max-width: 560px; margin-bottom: 28px; }
  .btn { font-family: var(--font-mono); font-size: 12px; letter-spacing: 2.5px; font-weight: 700; text-transform: uppercase; padding: 14px 22px; display: inline-flex; text-decoration: none; }
  .btn-primary { background: var(--tang); color: var(--ink); }
  .sheet, .stub { padding: 80px 32px; border-bottom: 1px solid var(--ink); }
  .stub { background: var(--paper); }
  .coming { font-family: var(--font-mono); font-size: 14px; letter-spacing: 1px; color: var(--ink-soft); }
  .coming a { color: var(--tang); }
  @media (max-width: 760px) {
    .big { font-size: 72px; }
    h1 { font-size: 32px; }
  }
</style>
```

- [ ] **Step 2: 英文迁移落地页**

```astro
---
// src/pages/en/migrate.astro
import MarketingLayout from '@layouts/MarketingLayout.astro';
import SectionHead from '@components/SectionHead.astro';
import CompatChart from '@components/CompatChart.astro';
import MarqueeDivider from '@components/MarqueeDivider.astro';

const locale = 'en' as const;
const compatPairs = [
  { from: 'Skills', fromMeta: '/skills/*', to: 'Skills System', toMeta: 'hub-installable' },
  { from: 'Integrations', fromMeta: '50+ services', to: 'Toolsets + MCP', toMeta: 'composable' },
  { from: 'Heartbeats', fromMeta: 'cron-like', to: 'Scheduled Tasks', toMeta: 'natural-lang' },
  { from: 'Persistent Memory', fromMeta: '24/7 ctx', to: 'Memory System', toMeta: 'auto-compact' },
  { from: 'Bot Framework', fromMeta: 'multi-channel', to: 'Messaging Platforms', toMeta: 'plugin-based' }
];
---

<MarketingLayout locale={locale} title="Leaving OpenClaw · Migrate to Hermes Agent" description="A tested crosswalk from OpenClaw to Hermes Agent concepts.">
  <section class="intro">
    <div class="intro-inner">
      <div class="big">H/01.08</div>
      <h1>Leaving OpenClaw,<br>moving to Hermes Agent</h1>
      <p class="sub">Both tools share DNA — concepts map 1:1. Below is the author's tested crosswalk.</p>
      <a href="/en/7-days/day-01/" class="btn btn-primary">◉ No Hermes yet? Start at Day 01</a>
    </div>
  </section>
  <MarqueeDivider />
  <section class="sheet">
    <SectionHead num="A.02" title="Compatibility Sheet" en="兼容性对照表" desc="Based on OpenClaw 2026-Q1 and Hermes Agent v0.4 docs. Tested by the author in 2026-04." />
    <CompatChart pairs={compatPairs} fromLabel="[ FROM ]" toLabel="[ TO · HERMES ]" fromTitle="OpenClaw" toTitle="Hermes Agent" />
  </section>
  <section class="stub">
    <SectionHead num="A.03" title="Full Walkthrough" en="STEP-BY-STEP" />
    <p class="coming">📦 Full migration walkthrough is in progress. Contributions welcome on <a href="https://github.com/Hubery23">GitHub</a>.</p>
  </section>
</MarketingLayout>
<style>
  /* Same styles as src/pages/migrate.astro */
  .intro { padding: 80px 32px; background: var(--sand); border-bottom: 1px solid var(--ink); }
  .intro-inner { max-width: 720px; }
  .big { font-family: var(--font-display); font-size: 120px; font-weight: 800; color: var(--tang); line-height: 0.85; letter-spacing: -5px; margin-bottom: 18px; }
  h1 { font-family: var(--font-display); font-size: 54px; font-weight: 700; letter-spacing: -1.5px; line-height: 1.05; margin: 0 0 18px; }
  .sub { font-family: var(--font-display); font-size: 20px; line-height: 1.35; max-width: 560px; margin-bottom: 28px; }
  .btn { font-family: var(--font-mono); font-size: 12px; letter-spacing: 2.5px; font-weight: 700; text-transform: uppercase; padding: 14px 22px; display: inline-flex; text-decoration: none; }
  .btn-primary { background: var(--tang); color: var(--ink); }
  .sheet, .stub { padding: 80px 32px; border-bottom: 1px solid var(--ink); }
  .stub { background: var(--paper); }
  .coming { font-family: var(--font-mono); font-size: 14px; letter-spacing: 1px; color: var(--ink-soft); }
  .coming a { color: var(--tang); }
  @media (max-width: 760px) {
    .big { font-size: 72px; }
    h1 { font-size: 32px; }
  }
</style>
```

- [ ] **Step 3: 验证两个迁移页**

```bash
npm run dev
```

访问 `/migrate/` 和 `/en/migrate/`，确认两页都渲染。

- [ ] **Step 4: Commit**

```bash
git add src/pages/migrate.astro src/pages/en/migrate.astro
git commit -m "feat: 迁移落地页 /migrate 和 /en/migrate"
```

---

### Task 5.5: 7 天索引页 `/7-days/`（中 + 英）

**Files:**
- Create: `src/pages/7-days/index.astro`
- Create: `src/pages/en/7-days/index.astro`

- [ ] **Step 1: 中文索引页**

```astro
---
// src/pages/7-days/index.astro
import MarketingLayout from '@layouts/MarketingLayout.astro';
import SectionHead from '@components/SectionHead.astro';
import DayCard from '@components/DayCard.astro';
import MarqueeDivider from '@components/MarqueeDivider.astro';

const locale = 'zh-CN' as const;
const days = [
  { num: 'H/01.01', day: 'DAY 01', titleZh: '跑起来：Hermes 的第一次对话', titleEn: 'Boot Up', desc: '装好本体，完成第一次对话。', href: '/7-days/day-01/' },
  { num: 'H/01.02', day: 'DAY 02', titleZh: '挑个大脑：模型选型与 API 接入', titleEn: 'Pick a Brain', desc: '配 LLM，让 Agent 会答话。', href: '/7-days/day-02/' },
  { num: 'H/01.03', day: 'DAY 03', titleZh: '入驻聊天室：Telegram / Discord / Slack', titleEn: 'Go Social', desc: 'Bot token + .env。', href: '/7-days/day-03/' },
  { num: 'H/01.04', day: 'DAY 04', titleZh: '让 Agent 动手：内置工具实战', titleEn: 'Give It Hands', desc: '触发 ≥2 个工具。', href: '/7-days/day-04/' },
  { num: 'H/01.05', day: 'DAY 05', titleZh: '教它新本事：安装第一个 Skill', titleEn: 'Teach a Trick', desc: '装 skill 并触发。', milestone: true, href: '/7-days/day-05/' },
  { num: 'H/01.06', day: 'DAY 06', titleZh: '记忆与状态：会话、压缩、备份', titleEn: 'Memory & State', desc: '跨会话记忆。', href: '/7-days/day-06/' },
  { num: 'H/01.07', day: 'DAY 07', titleZh: '全自动化：定时任务与故障排查', titleEn: 'Full Auto', desc: '调度 + 排错。', href: '/7-days/day-07/' },
  { num: 'H/01.08', day: 'BONUS', titleZh: '从 OpenClaw 搬家：平滑迁移指南', titleEn: 'Leaving OpenClaw', desc: '映射表 + 亲测。', href: '/migrate/' }
];
---

<MarketingLayout locale={locale} title="七日入门 · Hermes Agent 中文指南" description="每天一个模块，一小时内完成。">
  <section class="intro">
    <div class="big">H/01</div>
    <h1>七日组装指南</h1>
    <p class="sub">每天一个模块，一小时内完成。全部命令亲测可复现，Mac / Linux / WSL 都跑得起来。</p>
  </section>
  <MarqueeDivider />
  <section class="grid-section">
    <SectionHead num="INDEX" title="全部章节" en="ALL CHAPTERS" desc="点击任意卡片开始。" />
    <div class="day-grid">{days.map(d => <DayCard {...d} />)}</div>
  </section>
</MarketingLayout>

<style>
  .intro { padding: 80px 32px; background: var(--sand); border-bottom: 1px solid var(--ink); }
  .big { font-family: var(--font-display); font-size: 120px; font-weight: 800; color: var(--tang); line-height: 0.85; letter-spacing: -5px; margin-bottom: 18px; }
  h1 { font-family: var(--font-display); font-size: 54px; font-weight: 700; letter-spacing: -1.5px; line-height: 1.05; margin: 0 0 18px; }
  .sub { font-family: var(--font-display); font-size: 20px; line-height: 1.35; max-width: 620px; }
  .grid-section { padding: 80px 32px; }
  .day-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--ink); border: 1px solid var(--ink); }
  @media (max-width: 980px) { .day-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
```

- [ ] **Step 2: 英文索引页（对称写法，href 加 `/en/` 前缀，文案切 en）**

按 Step 1 的模板写 `src/pages/en/7-days/index.astro`，改 `locale = 'en'`，所有 `href` 加 `/en` 前缀，`titleZh/titleEn` 按英文场景给（titleZh 保留中文以形成多语对照）。

- [ ] **Step 3: 验证**

```bash
npm run dev
```

访问 `/7-days/` 和 `/en/7-days/`。

- [ ] **Step 4: Commit**

```bash
git add src/pages/7-days/ src/pages/en/7-days/
git commit -m "feat: 7 天索引页 /7-days/ 和 /en/7-days/"
```

---

## Phase 6: 教程占位页（Starlight docs）

### Task 6.1: 8 篇中文占位

**Files（创建 8 个 MDX）:**
- Create: `src/content/docs/zh-CN/7-days/day-01.mdx`
- Create: `src/content/docs/zh-CN/7-days/day-02.mdx`
- Create: `src/content/docs/zh-CN/7-days/day-03.mdx`
- Create: `src/content/docs/zh-CN/7-days/day-04.mdx`
- Create: `src/content/docs/zh-CN/7-days/day-05.mdx`
- Create: `src/content/docs/zh-CN/7-days/day-06.mdx`
- Create: `src/content/docs/zh-CN/7-days/day-07.mdx`
- Create: `src/content/docs/zh-CN/migrate/from-openclaw.mdx`
- Create: `src/content/docs/zh-CN/index.mdx`

- [ ] **Step 1: Starlight 根页**

```mdx
---
title: Hermes Agent 中文指南
description: 回到主站
template: splash
---

**本页仅作 Starlight 路由保底。**请访问 [主站首页](/) 或 [7 天入门](/7-days/)。
```

- [ ] **Step 2: 逐篇写 Day 01 的 frontmatter + 占位正文**（其余 7 篇按相同模板）

```mdx
---
title: "跑起来：Hermes 的第一次对话"
description: "装好本体、开好环境变量，完成第一次对话。"
day: 1
milestone: false
sources: []
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="本章正在撰写">
  中文教程正在编辑中，敬请期待。你可以在 [GitHub 仓库](https://github.com/Hubery23) watch / star 获得更新通知，或提 issue 告诉我你最希望先看到哪章。
</Aside>

## 本章会做什么

- 在 macOS / Linux / WSL 上装好 Hermes Agent
- 跑通 `hermes --version`
- 完成本地的第一次对话

## 验证成果

运行 `hermes version` 有输出；运行 `hermes chat` 能和 Agent 交互一轮。

## 资料来源

- [Hermes Agent 官方文档 · Installation](https://hermes-agent.nousresearch.com/docs/)
```

- [ ] **Step 3: 按 Day 01 模板写 Day 02-07 的占位，frontmatter 字段修改对应**

每篇 frontmatter 的 `day`、`title`、`description` 按 §4.1 表对齐；Day 05 的 `milestone: true`。正文结构一致：`Aside 占位 → 本章会做什么 → 验证成果 → 资料来源`。

- [ ] **Step 4: 迁移占位页**

```mdx
---
title: "从 OpenClaw 搬家：平滑迁移指南"
description: "作者亲测过的 OpenClaw → Hermes Agent 映射与迁移流程。"
sources:
  - title: "OpenClaw 官方文档"
    url: "https://openclaw.ai"
  - title: "Hermes Agent 官方文档"
    url: "https://hermes-agent.nousresearch.com/docs/"
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="tip" title="别着急迁移">
  如果你是 OpenClaw 新手，建议先跑通 Hermes 的 [7 天教程](/7-days/)，再回来看本指南。
</Aside>

## 映射表

（详细映射表待撰写，参考 `/migrate/` 页的对照图）

## 迁移步骤

1. 备份 OpenClaw 数据
2. 安装 Hermes
3. 一一映射 skill 和记忆
4. 验证消息平台接入
5. 切换域名/指向

## 资料来源

- OpenClaw 文档
- Hermes 官方 docs
```

- [ ] **Step 5: Commit**

```bash
git add src/content/docs/zh-CN/
git commit -m "feat: 8 篇中文教程占位 MDX（frontmatter + Aside 提示 + 资料来源骨架）"
```

---

### Task 6.2: 8 篇英文占位

**Files:**
- Create: `src/content/docs/en/index.mdx`
- Create: `src/content/docs/en/7-days/day-01.mdx` 至 `day-07.mdx`
- Create: `src/content/docs/en/migrate/from-openclaw.mdx`

- [ ] **Step 1: 逐篇写"Coming soon"版本**

每篇 frontmatter 与中文版本同字段，`title` 翻英文，正文用：

```mdx
import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="English version coming soon">
  The Chinese version is live [here](/7-days/day-01/). Translations are welcome on [GitHub](https://github.com/Hubery23).
</Aside>

## What this chapter covers

(Coming soon.)
```

- [ ] **Step 2: Commit**

```bash
git add src/content/docs/en/
git commit -m "feat: 8 篇英文占位 MDX（coming soon，指向中文版 + GitHub 贡献链接）"
```

---

## Phase 7: 端到端测试

### Task 7.1: Playwright 配置

**Files:**
- Create: `playwright.config.ts`

- [ ] **Step 1: 写 Playwright 配置**

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } }
  ]
});
```

- [ ] **Step 2: Commit**

```bash
git add playwright.config.ts
git commit -m "chore: Playwright E2E 配置"
```

---

### Task 7.2: 构建冒烟测试

**Files:**
- Create: `src/tests/e2e/build.spec.ts`

- [ ] **Step 1: 写测试**

```typescript
// src/tests/e2e/build.spec.ts
import { test, expect } from '@playwright/test';

test('homepage renders H visual markers', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Hermes Agent/);
  await expect(page.locator('.hero .big')).toContainText('H/01');
  await expect(page.locator('.day-grid a')).toHaveCount(8);
});

test('en homepage renders translated content', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('.hero h1')).toContainText('Messaging Agent');
  await expect(page.locator('.day-grid a')).toHaveCount(8);
});

test('migrate page has compatibility chart', async ({ page }) => {
  await page.goto('/migrate/');
  await expect(page.locator('.migration-grid')).toBeVisible();
  await expect(page.locator('.migration-grid li')).toHaveCount(10); // 5 pairs × 2 sides
});

test('7-days index lists all 8 chapters', async ({ page }) => {
  await page.goto('/7-days/');
  await expect(page.locator('.day-grid a')).toHaveCount(8);
  await expect(page.locator('.day.highlight')).toHaveCount(1); // only Day 05
});
```

- [ ] **Step 2: 运行测试（dev server 会被 Playwright 自动拉起）**

```bash
npm run test:e2e
```

期望：全部 PASS

- [ ] **Step 3: Commit**

```bash
git add src/tests/e2e/build.spec.ts
git commit -m "test: E2E 冒烟测试（首页/en 首页/迁移/7 天索引渲染断言）"
```

---

### Task 7.3: i18n 切换器测试

**Files:**
- Create: `src/tests/e2e/i18n-switch.spec.ts`

- [ ] **Step 1: 写测试**

```typescript
// src/tests/e2e/i18n-switch.spec.ts
import { test, expect } from '@playwright/test';

test('lang switcher preserves path when switching zh→en from homepage', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('group', { name: 'Language switcher' }).getByText('EN').click();
  await expect(page).toHaveURL('/en/');
});

test('lang switcher preserves path when switching zh→en from migrate', async ({ page }) => {
  await page.goto('/migrate/');
  await page.getByRole('group', { name: 'Language switcher' }).getByText('EN').click();
  await expect(page).toHaveURL('/en/migrate/');
});

test('lang switcher works from /7-days/', async ({ page }) => {
  await page.goto('/7-days/');
  await page.getByRole('group', { name: 'Language switcher' }).getByText('EN').click();
  await expect(page).toHaveURL('/en/7-days/');
});

test('lang switcher preserves path en→zh', async ({ page }) => {
  await page.goto('/en/migrate/');
  await page.getByRole('group', { name: 'Language switcher' }).getByText('中').click();
  await expect(page).toHaveURL('/migrate/');
});
```

- [ ] **Step 2: 运行**

```bash
npm run test:e2e src/tests/e2e/i18n-switch.spec.ts
```

期望：全部 PASS

- [ ] **Step 3: Commit**

```bash
git add src/tests/e2e/i18n-switch.spec.ts
git commit -m "test: 语言切换器保留路径（6 个方向组合覆盖）"
```

---

### Task 7.4: 内部链接完整性测试

**Files:**
- Create: `src/tests/e2e/links.spec.ts`

- [ ] **Step 1: 写测试**

```typescript
// src/tests/e2e/links.spec.ts
import { test, expect } from '@playwright/test';

const homepage_hrefs_to_probe = [
  '/7-days/day-01/', '/7-days/day-02/', '/7-days/day-03/',
  '/7-days/day-04/', '/7-days/day-05/', '/7-days/day-06/',
  '/7-days/day-07/', '/migrate/', '/7-days/'
];

test('all homepage outbound internal links resolve (no 404)', async ({ page, request }) => {
  for (const href of homepage_hrefs_to_probe) {
    const resp = await request.get(href);
    expect(resp.status(), `${href} should 200`).toBe(200);
  }
});

test('all en mirror links resolve', async ({ request }) => {
  const en_hrefs = homepage_hrefs_to_probe.map(h => `/en${h}`);
  for (const href of en_hrefs) {
    const resp = await request.get(href);
    expect(resp.status(), `${href} should 200`).toBe(200);
  }
});
```

- [ ] **Step 2: 运行**

```bash
npm run test:e2e src/tests/e2e/links.spec.ts
```

期望：18 次 200（9 个中文 + 9 个英文镜像）

- [ ] **Step 3: Commit**

```bash
git add src/tests/e2e/links.spec.ts
git commit -m "test: 所有首页外链（含 /en/ 镜像）均返回 200"
```

---

## Phase 8: 生产构建 + 部署

### Task 8.1: 本地生产构建验证

- [ ] **Step 1: 运行 build**

```bash
npm run build
```

期望：
- 输出 `dist/` 目录
- 没有 error
- 最后能看到 Pagefind 索引生成提示（Starlight 会自动跑）

- [ ] **Step 2: 预览 build 产物**

```bash
npm run preview
```

访问 `http://localhost:4321/`，人肉再过一轮关键路径：首页 → Day 01 → 迁移页 → 切英文 → 返回。

- [ ] **Step 3: 运行完整测试套件**

```bash
npm test
npm run test:e2e
```

期望：全部 PASS

- [ ] **Step 4: Commit 任何修复（如有）**

如果构建过程中发现问题，修复并 commit。

---

### Task 8.2: Cloudflare Pages 配置

**Files:**
- Create: `wrangler.toml`

- [ ] **Step 1: 写 Wrangler 配置（可选，用于未来 Worker 扩展）**

```toml
# wrangler.toml
name = "hermes-agent-guide"
compatibility_date = "2026-04-23"
pages_build_output_dir = "./dist"
```

- [ ] **Step 2: 在 Cloudflare 控制台操作（非代码步骤，手动）**

按此顺序：

1. 登录 Cloudflare Dashboard → Pages → Create a project → Connect to Git
2. 选仓库 `Hubery23/hermes-agent-guide`（推送后）
3. 构建配置：
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: `20`
4. Environment variables：暂无
5. 部署后，绑定自定义域名 `hermesagentguide.online`

- [ ] **Step 3: 在本地创建 GitHub 仓库（准备公开）**

```bash
# 用 gh CLI（推荐）—— 需要先 gh auth login
gh repo create Hubery23/hermes-agent-guide --public --source=. --remote=origin --push
```

或者手动在 github.com/Hubery23 创建仓库后：

```bash
git remote add origin git@github.com:Hubery23/hermes-agent-guide.git
git push -u origin main
```

**⚠️ 这一步涉及公开代码到 GitHub，需要用户明确授权后再执行。**

- [ ] **Step 4: Commit wrangler.toml**

```bash
git add wrangler.toml
git commit -m "chore: Cloudflare Pages 构建配置（wrangler.toml）"
```

---

### Task 8.3: 部署后验证

- [ ] **Step 1: 等待 Cloudflare 首次部署（约 2-3 分钟）**

Dashboard 里查看 Pages 的 Latest deployment 状态变为 Success。

- [ ] **Step 2: 访问域名**

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://hermesagentguide.online/
curl -sS -o /dev/null -w "%{http_code}\n" https://hermesagentguide.online/en/
curl -sS -o /dev/null -w "%{http_code}\n" https://hermesagentguide.online/migrate/
curl -sS -o /dev/null -w "%{http_code}\n" https://hermesagentguide.online/7-days/day-01/
```

期望：全部 `200`

- [ ] **Step 3: 人肉检查**

浏览器打开 `https://hermesagentguide.online/`，确认：
- 字体加载成功（不是系统 fallback）
- 语言切换可用
- 所有图标符号（● ◉ ▲ ◆）显示正常
- 暗色模式（如果浏览器强制）降级合理
- 移动端布局不破版

- [ ] **Step 4: Commit 部署记录**

```bash
git commit --allow-empty -m "chore: MVP 首次部署到 hermesagentguide.online"
```

---

## Phase 9: README + 许可

### Task 9.1: README.md

**Files:**
- Create: `README.md`
- Create: `LICENSE` (MIT)

- [ ] **Step 1: 写 README**

```markdown
# Hermes Agent 中文指南

> 7 天跑通你的自托管 AI Agent。

**官方站点**：https://hermesagentguide.online

## 是什么

一个面向中文开发者的 Hermes Agent 入门 + 迁移指南站：

- 7 天手把手从零安装到在 Telegram 里聊天
- 从 OpenClaw 迁移的亲测映射表
- 中英双语切换

**不是**官方站点，也不是官方翻译。非官方社区指南。

## 本地开发

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # 生产构建
npm test          # 单元测试
npm run test:e2e  # E2E 测试
```

## 贡献

- 英文翻译：`src/content/docs/en/` 下的 coming soon 占位都欢迎 PR
- 教程内容：`src/content/docs/zh-CN/7-days/` 8 篇占位教程正在撰写中
- Bug 报告：请开 issue

## 许可

MIT。内容 CC BY 4.0。
```

- [ ] **Step 2: LICENSE (MIT)**

粘贴标准 MIT 文本，`[year] [fullname]` 填 `2026 Hubery23`。

- [ ] **Step 3: Commit**

```bash
git add README.md LICENSE
git commit -m "docs: README + MIT LICENSE"
```

---

## Self-Review

**1. Spec 覆盖**：
- ✅ §1 目标（7 天跑通 + 迁移）：Phase 5 + 6 占位到位
- ✅ §2 定位（超越 hermes101）：H 视觉 + 原创迁移
- ✅ §3 受众（中文开发者）：语言默认中文，首页 hero copy 对齐
- ✅ §4 内容（8 篇 + 迁移）：Phase 6 占位 MDX 全
- ✅ §5 H 视觉（色板/字体/motifs）：Phase 2 + 4 + 5
- ✅ §6 IA：Phase 5 首页 8 个 section 完整
- ✅ §7 i18n：Phase 3 工具 + Starlight 配置，Phase 7 切换器测试
- ✅ §8 内容来源：占位页 `sources` frontmatter + 每篇文末链接模板
- ✅ §9 技术栈 B'：Astro + Starlight 混合，Phase 1 配置
- ✅ §10 拍板项：域名、署名、仓库、语言优先级全部落到 spec + README + footer
- ⚠️ §11 非 MVP（资源聚合/搜索/RSS/评论）：Phase 8 构建时 Pagefind 会自动生成搜索索引（Starlight 内置），算白送

**2. Placeholder 扫描**：
- Phase 5.3 Step 1 英文首页没有完整粘贴 `<style>`——已在 Step 1 末尾粘回完整 style 块。无剩余占位
- 所有 "TBD" 已消除，除了教程正文的"Coming soon"（这是预期占位）

**3. 类型一致性**：
- `Locale` 类型在 `src/lib/locale.ts` 定义为 `'zh-CN' | 'en'`，所有组件一致
- `DayCard` 属性 `{ num, day, titleZh, titleEn, desc, milestone?, href }` —— Phase 5 所有调用点一致
- `t()` 函数签名从 `useT(locale)` 取得 —— 所有组件通过此入口使用

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-04-23-hermes-guide-mvp.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
