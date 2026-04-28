# 营销层首屏性能优化 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 hermesagentguide.online 营销层首屏 render-blocking CSS 从 374KB 压到 35KB 以内，LCP render delay 在节流环境下从 455ms 降到 250ms 以内。

**Architecture:** 拆出营销层专属 `marketing.css`（剔除 Starlight/Pagefind/EC 选择器）与 `marketing-fonts.css`（精简字重）。`MarketingLayout` 头部内联 H token 关键 CSS，主样式与字体样式都用 `<link rel="preload" as="style" onload="...">` 异步加载；显式 preload Bricolage 子集；manifest 挪到 body 末。文档层 (`@astrojs/starlight`) 入口与既有 `theme.css` 完全不动。

**Tech Stack:** Astro 6.1 / fontsource / Vite `?url` 资源 import / Cloudflare Pages。

**Spec 路径:** `docs/superpowers/specs/2026-04-28-perf-optimization-design.md`

---

## 文件结构

| 路径 | 操作 | 责任 |
|---|---|---|
| `src/styles/marketing.css` | 新建 | 营销层全局样式：H token + base + h1-h4 + Pagefind 不再需要 |
| `src/styles/marketing-fonts.css` | 新建 | 营销层字体声明：bricolage + ibm-plex-mono（400/500/700）+ noto-sans-sc/400 |
| `src/styles/fonts.css` | 修改 | 顶部加注释说明仅文档层使用；移除 ibm-plex-sans 三个字重；移除 noto-sans-sc 500/700 |
| `src/styles/theme.css` | 不动 | 文档层（Starlight）继续用 |
| `src/layouts/MarketingLayout.astro` | 修改 | head 注入 inline 关键 CSS + async link + font preload；manifest 挪到 body 末 |

---

## Task 1：精简 fonts.css（让文档层也轻一些）

**Files:**
- Modify: `src/styles/fonts.css:1-18`

**说明：** 改完之后 `fonts.css` 仍由 `theme.css`/Starlight 文档层引用。营销层后续不再依赖它。先改这里是因为它体积影响 baseline，且改动最简单。

- [ ] **Step 1.1: 用编辑器替换 fonts.css 内容为下面整段**

```css
/* src/styles/fonts.css — 文档层（Starlight）使用的字体栈
 *
 * 注意：营销层（src/pages/*.astro，使用 MarketingLayout）从 2026-04-28 起
 *   不再 import 此文件，改用 src/styles/marketing-fonts.css。
 *   修改字体策略时务必同步两边。
 */

@import '@fontsource-variable/bricolage-grotesque';
@import '@fontsource/ibm-plex-mono/400.css';
@import '@fontsource/ibm-plex-mono/500.css';
@import '@fontsource/ibm-plex-mono/700.css';
@import '@fontsource/noto-sans-sc/400.css';

:root {
	--font-display: 'Bricolage Grotesque Variable', system-ui, sans-serif;
	--font-body: 'Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', -apple-system, sans-serif;
	--font-mono: 'IBM Plex Mono', ui-monospace, 'SF Mono', monospace;
	--font-cjk: 'Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}
```

- [ ] **Step 1.2: 跑 type check 验证不破坏**

Run: `pnpm check`
Expected: PASS（0 errors, 0 warnings 或仅有既有 warnings）

- [ ] **Step 1.3: 提交**

```bash
git add src/styles/fonts.css
git commit -m "refactor(styles): fonts.css 字重瘦身 + 标注用途为文档层专属"
```

---

## Task 2：新建 marketing-fonts.css

**Files:**
- Create: `src/styles/marketing-fonts.css`

- [ ] **Step 2.1: 创建文件 src/styles/marketing-fonts.css，写入：**

```css
/* src/styles/marketing-fonts.css — 营销层字体声明
 *
 * 由 MarketingLayout.astro 通过 <link rel="preload" as="style"> 异步加载，
 * 不阻塞渲染。font-display: swap 由 fontsource 默认开启，
 * 字体下载完成前文字使用 fallback 字体（PingFang SC / 系统 sans）渲染。
 *
 * 字重选择对齐 Task 1 的 fonts.css，营销层与文档层视觉一致。
 */

@import '@fontsource-variable/bricolage-grotesque';
@import '@fontsource/ibm-plex-mono/400.css';
@import '@fontsource/ibm-plex-mono/500.css';
@import '@fontsource/ibm-plex-mono/700.css';
@import '@fontsource/noto-sans-sc/400.css';
```

- [ ] **Step 2.2: 验证文件存在**

Run: `ls -la src/styles/marketing-fonts.css`
Expected: 文件存在且非空

- [ ] **Step 2.3: 提交**

```bash
git add src/styles/marketing-fonts.css
git commit -m "feat(styles): 新增 marketing-fonts.css 供营销层异步加载字体"
```

---

## Task 3：新建 marketing.css（剥离 Starlight 选择器）

**Files:**
- Create: `src/styles/marketing.css`

**说明：** 内容是 `theme.css` 当前内容剔除所有 Starlight/Pagefind/Expressive Code 相关选择器后的结果。`:root` H token、body 基础规则、h1-h4 都保留（因为营销页 hero 等组件依赖它们）。

- [ ] **Step 3.1: 创建文件 src/styles/marketing.css，写入：**

```css
/* src/styles/marketing.css — 营销层全局样式
 *
 * 营销层（src/pages/*.astro 直接渲染、不走 Starlight）专用。
 * H 工业设计系统的 token 在此定义；文档层 src/styles/theme.css
 * 包含同一组 token 的副本——改色时务必两处同步。
 *
 * 不包含：Starlight 选择器、Pagefind 搜索 UI、Expressive Code 代码块。
 * 这些选择器在营销页 DOM 里不存在，剔除可减小首屏 render-blocking 体积。
 */

/* ===== 1. H 工业设计 Token ===== */
:root {
	/* 主色板 */
	--sand: #e8e2d4;
	--sand-dark: #d4ccb8;
	--paper: #f5f0e6;
	--ink: #1a1a1a;
	--ink-soft: #555;
	--tang: #ff6b35;
	--amber: #ffc24b;
}

/* ===== 2. 基础结构 ===== */
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
	background: var(--sand);
	color: var(--ink);
	font-family: var(--font-body);
	line-height: 1.5;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

/* ===== 3. 标题 ===== */
h1, h2, h3, h4 {
	font-family: var(--font-display);
	letter-spacing: -0.02em;
}

/* ===== 4. 等宽字 ===== */
code, pre, .mono {
	font-family: var(--font-mono);
}
```

> ⚠️ **重要前置**：在写这一步之前，**先 Read 一次 `src/styles/theme.css` 全文**，确认上面 token 值（`--sand` `--tang` 等）与现有 theme.css 完全一致。如果有差异，以 theme.css 当前值为准复制过来——避免颜色漂移。

- [ ] **Step 3.2: 跨文件 token 对账**

Run:
```bash
grep -E "^\s*--(sand|sand-dark|paper|ink|ink-soft|tang|amber):" src/styles/theme.css src/styles/marketing.css
```
Expected: 两个文件里同名 token 的值完全相同。

如果不一致：以 `theme.css` 为准修改 `marketing.css`，再次运行确认一致。

- [ ] **Step 3.3: 提交**

```bash
git add src/styles/marketing.css
git commit -m "feat(styles): 新增 marketing.css 仅含 H token + 基础规则，剔除 Starlight"
```

---

## Task 4：改造 MarketingLayout.astro

**Files:**
- Modify: `src/layouts/MarketingLayout.astro:1-98`

**说明：** 这是计划核心步骤。改完之后营销层不再 import `theme.css` 与 `fonts.css`，而是 head 内联关键 token + 异步 link 主样式与字体样式 + preload Bricolage 子集；`<link rel="manifest">` 挪到 body 末。

- [ ] **Step 4.1: 阅读当前 MarketingLayout.astro 全文**

Run: 用 Read 工具读取 `/Users/hubery/MyProduct/hermes/src/layouts/MarketingLayout.astro`，确认当前结构与本计划假设一致（前置 frontmatter 在 1-29 行、`<head>` 30-60 行、`<body>` 后面跟 WarningStrip/SiteNav/main/SiteFooter）。

- [ ] **Step 4.2: 用下面整段替换 frontmatter（1-29 行）**

```astro
---
import type { Locale } from '@lib/locale';
import WarningStrip from '@components/WarningStrip.astro';
import SiteNav from '@components/SiteNav.astro';
import SiteFooter from '@components/SiteFooter.astro';
import SEO from '@components/SEO.astro';
import Schema from '@components/Schema.astro';
import { websiteSchema, organizationSchema } from '@lib/schemas';
// 营销层不再直接 import theme.css / fonts.css。
// 它们改为通过 <link rel="preload" as="style"> 异步加载，避免阻塞首屏渲染。
import marketingCssUrl from '@styles/marketing.css?url';
import marketingFontsCssUrl from '@styles/marketing-fonts.css?url';
// 显式 preload hero 用到的 Bricolage Grotesque latin 子集。
// fontsource 包内文件路径稳定，可直接用 ?url 拿构建后的 hash 名。
import bricolageLatinUrl from '@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2?url';

interface Props {
	locale: Locale;
	title: string;
	description?: string;
	ogImage?: string;
	ogType?: 'website' | 'article';
	/** 页面级 JSON-LD（WebSite/Organization 已全站默认注入，无需重复）。 */
	schema?: Record<string, unknown> | Record<string, unknown>[];
	noindex?: boolean;
}
const {
	locale,
	title,
	description = '',
	ogImage,
	ogType = 'website',
	schema,
	noindex = false,
} = Astro.props;
---
```

- [ ] **Step 4.3: 用下面整段替换 `<head>...</head>` 块**

```astro
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width,initial-scale=1" />
		<title>{title}</title>
		<meta name="description" content={description} />

		<SEO
			locale={locale}
			title={title}
			description={description}
			ogImage={ogImage}
			ogType={ogType}
			noindex={noindex}
		/>

		{/* 关键首屏样式：仅含 H token、字体栈、body 基础。
		    组件级 scoped 样式（hero/spec-card 等）已被 Astro 自动 inline 在 head 后段。 */}
		<style is:global>
			:root {
				--sand: #e8e2d4;
				--sand-dark: #d4ccb8;
				--paper: #f5f0e6;
				--ink: #1a1a1a;
				--ink-soft: #555;
				--tang: #ff6b35;
				--amber: #ffc24b;
				--font-display: 'Bricolage Grotesque Variable', system-ui, sans-serif;
				--font-body: 'Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', -apple-system, sans-serif;
				--font-mono: 'IBM Plex Mono', ui-monospace, 'SF Mono', monospace;
				--font-cjk: 'Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
			}
			* { box-sizing: border-box; }
			html, body { margin: 0; padding: 0; }
			body {
				background: var(--sand);
				color: var(--ink);
				font-family: var(--font-body);
				line-height: 1.5;
				-webkit-font-smoothing: antialiased;
				-moz-osx-font-smoothing: grayscale;
			}
			h1, h2, h3, h4 { font-family: var(--font-display); letter-spacing: -0.02em; }
			code, pre, .mono { font-family: var(--font-mono); }
		</style>

		{/* 主样式 + 字体样式：异步加载 */}
		<link rel="preload" as="style" href={marketingCssUrl} onload="this.onload=null;this.rel='stylesheet'" />
		<noscript><link rel="stylesheet" href={marketingCssUrl} /></noscript>
		<link rel="preload" as="style" href={marketingFontsCssUrl} onload="this.onload=null;this.rel='stylesheet'" />
		<noscript><link rel="stylesheet" href={marketingFontsCssUrl} /></noscript>

		{/* preload Bricolage 主可变字重，确保 hero LCP 文字字体可用 */}
		<link rel="preload" as="font" type="font/woff2" href={bricolageLatinUrl} crossorigin />

		{/* Favicon 家族 */}
		<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
		<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
		<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
		<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
		<meta name="theme-color" content="#e8e2d4" />

		{/* 全站基础结构化数据 */}
		<Schema schema={[websiteSchema(locale), organizationSchema(locale)]} />
		{schema && <Schema schema={schema} />}
	</head>
```

注意点：
- `<link rel="manifest">` 从 head 移除，将在 Step 4.4 加到 body 末尾。
- `<style is:global>` 后面那块 `<style is:global>...</style>` 在文件末尾的旧块（关于 `* { box-sizing: border-box; }` 等）需要在 Step 4.5 删除以避免重复。

- [ ] **Step 4.4: 在 `<body>` 内 `</body>` 之前增加 manifest link**

把：
```astro
		<SiteFooter locale={locale} />
	</body>
```
替换为：
```astro
		<SiteFooter locale={locale} />
		{/* PWA manifest 放 body 末，避免占用 head 关键路径 */}
		<link rel="manifest" href="/site.webmanifest" />
	</body>
```

- [ ] **Step 4.5: 删除文件末尾的旧 `<style is:global>` 块**

文件末尾原本有：
```astro
<style is:global>
	* { box-sizing: border-box; }
	html, body { margin: 0; padding: 0; }
	body {
		background: var(--sand);
		color: var(--ink);
		font-family: var(--font-body);
		...
	}
</style>
```
这些规则已经在 Step 4.3 的 inline `<style is:global>` 里。**删掉文件末尾这整个 `<style is:global>` 块**。

如果文件末尾还有别的额外样式（不在本计划假设里），保留它们但删除与 Step 4.3 重复的部分。读完整文件再下手。

- [ ] **Step 4.6: 类型检查**

Run: `pnpm check`
Expected: 0 errors。

如果出现 `Cannot find module '@fontsource-variable/bricolage-grotesque/files/...'` 错误：
- 先 `ls node_modules/@fontsource-variable/bricolage-grotesque/files/` 确认 woff2 文件名是否仍是 `bricolage-grotesque-latin-wght-normal.woff2`
- 如名字变了，更新 frontmatter 的 import 路径

- [ ] **Step 4.7: 单元测试通过**

Run: `pnpm test`
Expected: 全部通过。

- [ ] **Step 4.8: 构建验证**

Run: `pnpm build`
Expected: 构建成功，无 error。完成后运行：
```bash
ls dist/_astro/marketing*.css
```
Expected: 输出 `marketing.<hash>.css` 与 `marketing-fonts.<hash>.css` 两个文件。

进一步验证营销页 HTML 不再引用 `theme.<hash>.css`：
```bash
grep -l "theme\." dist/index.html dist/en/index.html dist/migrate/index.html dist/7-days/index.html dist/faq/index.html
```
Expected: 无输出（这些营销页 HTML 都不应再引用 theme.*.css）。

如果某个营销页 HTML 仍引用 theme.*.css，说明该页绕过了 MarketingLayout 或还有其他 import 链——返回排查。

- [ ] **Step 4.9: 提交**

```bash
git add src/layouts/MarketingLayout.astro
git commit -m "perf(layout): 关键 CSS 内联 + 主样式与字体异步化 + Bricolage preload + manifest 挪位"
```

---

## Task 5：E2E 与视觉回归

- [ ] **Step 5.1: E2E 测试通过**

Run: `pnpm test:e2e`
Expected: 全绿。

如有 snapshot 失败但视觉差异是可接受的字体回退期变化：检查截图，如果只是字体加载时机微差导致的反走样不同，可更新 snapshot；如果出现颜色/布局错位，**不要**更新 snapshot，回到 Task 3/4 排查。

- [ ] **Step 5.2: 本地肉眼回归**

启动 `pnpm preview`（如果上一步 e2e 已经起过 webServer 并未停掉，先 `lsof -i :4321 | tail` 看是否 4321 被占）。打开下列 5 页中英文：
- http://localhost:4321/
- http://localhost:4321/en/
- http://localhost:4321/migrate/
- http://localhost:4321/7-days/
- http://localhost:4321/faq/

肉眼检查：
- hero 大字 (`HERMES` `Hermes Agent`) 字体形态正常
- 中文段落（如「常驻服务器的 AI 管家」）首屏显示无明显错位（即便等中文字体期间用 fallback 也应正常）
- mono 标签（`SPECIFICATION · 规格` / `01 · 安装` 等）保持等宽字
- 卡片/按钮颜色（`var(--sand)` `var(--ink)` `var(--tang)`）正确

如有视觉问题：返回 Task 3 检查 token 值是否漂移，或返回 Task 4 检查 inline `<style>` 是否覆盖完整。

---

## Task 6：性能验证（chrome-devtools-mcp）

- [ ] **Step 6.1: 启动本地 preview（如未启动）**

Run: `pnpm build && pnpm preview &`
等待终端输出 `Local: http://localhost:4321/`。

- [ ] **Step 6.2: 用 chrome-devtools-mcp 节流跑 trace**

调用如下工具序列（与基线测量条件一致）：
1. `mcp__plugin_chrome-devtools-mcp_chrome-devtools__new_page`，url 设 `about:blank`
2. `mcp__plugin_chrome-devtools-mcp_chrome-devtools__emulate`：viewport `412x823x2.625,mobile,touch`，cpuThrottlingRate `4`，networkConditions `Slow 4G`
3. `mcp__plugin_chrome-devtools-mcp_chrome-devtools__navigate_page`：url `http://localhost:4321/`
4. `mcp__plugin_chrome-devtools-mcp_chrome-devtools__performance_start_trace`，reload true，autoStop true
5. `mcp__plugin_chrome-devtools-mcp_chrome-devtools__performance_analyze_insight`：insightName `LCPBreakdown`
6. `mcp__plugin_chrome-devtools-mcp_chrome-devtools__performance_analyze_insight`：insightName `RenderBlocking`

记录数据：
- LCP 总时长 与 render delay
- Render-blocking 资源总未压缩字节

- [ ] **Step 6.3: 验收口径检查**

| 指标 | 基线 | 目标 | 实测 |
|---|---|---|---|
| LCP render delay | 455ms | < 250ms | 填入 |
| Render-blocking CSS 未压缩字节 | 374KB | < 100KB | 填入 |

如果未达标：分析瓶颈，回到对应 Task 修正。如果达标：进入下一步。

- [ ] **Step 6.4: 推上远端**（用户决定何时执行；本计划默认到此停手等用户确认）

```bash
git log --oneline main..HEAD  # 看本分支提交
```
报告给用户：本分支已就绪，是否合并到 main 或推送到远端。

---

## 自查清单（执行 agent 完成后逐项打勾再交付）

- [ ] 所有 Task 1-6 步骤已完成
- [ ] `pnpm check` 通过
- [ ] `pnpm test` 全绿
- [ ] `pnpm build` 通过且 `dist/_astro/marketing*.css` 存在
- [ ] `pnpm test:e2e` 全绿
- [ ] 5 页中英文肉眼无视觉回归
- [ ] chrome-devtools-mcp 节流 trace：LCP render delay 低于 250ms
- [ ] 首屏 render-blocking CSS 未压缩总和低于 100KB
- [ ] 4-5 个 commit，message 中文且符合既有风格
- [ ] 没有动 `src/styles/theme.css` 与 Starlight 文档层入口
