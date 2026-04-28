# 营销层首屏性能优化（PageSpeed 移动 LCP）

**日期**：2026-04-28
**分支**：`perf/lcp-marketing-layer`
**触发**：PageSpeed Insights 移动端跑分偏低，LCP element render delay 占比 68.7%。

---

## 背景与诊断

用 chrome-devtools-mcp 在 Slow 4G + 4× CPU 节流下对 `https://hermesagentguide.online/` 跑性能 trace，结合代码分析得出以下事实（见对话日志）：

- **LCP element**：`.hero-sub` 文字段落（不是图片）。
- **LCP 663ms（裸机）→ Lighthouse 移动端约 4.9s**。Render delay 455ms 是大头。
- **首屏关键路径上的 render-blocking 资源**：
  - `/_astro/MarqueeDivider.CLi8SjC7.css`（4KB）
  - `/_astro/theme.CYZE6Wgh.css`（**370KB 未压缩**）← 主要瓶颈
- `theme.CYZE6Wgh.css` 体积构成（采样统计）：
  - 几十个 `@font-face` 声明（每个携带 unicode-range）— 大头
  - Starlight + Pagefind + Expressive Code 全局选择器 ~50 处
  - H 设计系统 token + 全局基础样式
- **首屏并行下载 14 个 woff2**：11 个 noto-sans-sc unicode 子集 + 3 个 latin 字体 + 1 个 ibm-plex-mono。
- **第三方**：Cloudflare beacon 31KB（用户决定保留，**不在本 spec 范围内**）。
- Lighthouse 同设备：A11y 96 / Best-Practices 100 / SEO 100（A11y 1 项失败将由用户后续单独处理，不在本 spec）。

根因：`src/layouts/MarketingLayout.astro:9` 同时 import `fonts.css` 和 `theme.css`；`fonts.css` 用 `@import` 串联了 9 套 latin 字重 + 3 套 CJK 字重的 fontsource CSS，全部最终被 Astro 合成进了同一个 render-blocking 样式文件。营销层不需要 Starlight 选择器，CJK 也只需 1 个字重。

---

## 目标与非目标

### 目标
- **LCP**：节流环境下 LCP render delay 从 ~455ms 压到 ~200ms 以内（首屏 CSS 体积下降 60% 以上）。
- **Lighthouse 移动端 Performance** 从当前预估 60-70 分提升到 ≥85 分。
- 不破坏现有视觉（H 工业设计语言、双语、营销/文档两层共享 token）。
- 文档层（Starlight 渲染 `src/content/docs/**`）行为完全不变。

### 非目标
- 不重构组件结构、不改文案、不动图片资源。
- 不引入新依赖（Astro 5 原生 `<Font>` API 改造留待未来项目）。
- 不处理 Cloudflare beacon、a11y 失分（用户已决定）。

---

## 设计方案（用户已选 P0/P1/P2 + 字体策略 C）

整体思路：**关键 CSS 与字体声明分层异步化，营销层不再加载 Starlight 全局样式，CJK 字重精简，hero 字体显式 preload。**

### 架构变化

```
变更前：
  MarketingLayout.astro
    └─ import fonts.css            (9 套 latin + 3 套 CJK 字重 @import)
    └─ import theme.css            (H token + Starlight + Pagefind 全局)
       ↓ Astro 合并 ↓
       theme.CYZE6Wgh.css (370KB, render-blocking)

变更后：
  MarketingLayout.astro
    ├─ inline <style> 关键首屏样式 (hero/section-head/btn token, ~2KB)
    ├─ import marketing.css        (H token + 营销页全局, 不含 Starlight)
    └─ <link rel="preload" as="style" onload> marketing-fonts.css
       (拆出独立的字体声明文件，异步加载，font-display:swap 已开)

  StarlightLayout / 文档层
    └─ 继续用原 theme.css 路径不变
```

### 三组改动

#### P0 — 关键路径瘦身

**P0-1. 拆 fonts.css → marketing-fonts.css，瘦身字重**

- 新建 `src/styles/marketing-fonts.css`，只包含营销层用到的字重：
  - `@fontsource-variable/bricolage-grotesque`（display 字体，hero/h1/h2/section-head 都用它）
  - `@fontsource/ibm-plex-mono/400`、`500`、`700`（mono 字体，元数据/标签）
  - `@fontsource/noto-sans-sc/400`（CJK，仅一个字重）
- 删除：`ibm-plex-sans/400|500|700`（全站搜索 `--font-body` 实际只在 body 默认 fallback 链顶端，移除后用系统 -apple-system / PingFang SC，视觉差异极小且更快）；`noto-sans-sc/500|700`（中文字体加粗在工业说明书风格里几乎不用，确实有用到的 hero 大字本身用的是 Bricolage）。
- 更新 `:root` 变量：`--font-body` 移除 `'IBM Plex Sans'`，改为 `var(--font-cjk), -apple-system, sans-serif`。

**P0-2. 拆 theme.css → marketing.css**

- 新建 `src/styles/marketing.css`，内容 = `theme.css` 当前内容剔除以下选择器：
  - 所有 `.sl-*` / `--sl-color-*` / `--sl-font-*` 重映射
  - `.expressive-code *`
  - `#starlight__search` / `.pagefind-ui__*`
  - `.sidebar-content a[aria-current='page']`
- 保留：H token、`html/body` 基础、`h1-h4`、`code/pre/.mono`、营销页用到的全局规则。
- `theme.css` 文件本体不动（文档层继续用），只是营销层不再 import 它。

**P0-3. 关键 CSS inline + marketing.css 异步**

- `MarketingLayout.astro:9` 改为：
  - 移除 `import '@styles/fonts.css'` 与 `import '@styles/theme.css'`。
  - 在 `<head>` 内手写两段 `<link>`：
    ```html
    <link rel="preload" as="style" href={marketingCssHref} onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href={marketingCssHref}></noscript>
    <link rel="preload" as="style" href={marketingFontsCssHref} onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href={marketingFontsCssHref}></noscript>
    ```
  - `marketingCssHref` 通过 `import marketingCssUrl from '@styles/marketing.css?url'` 拿到 hash 化路径（Astro 支持 `?url` query）。
- 新增 inline `<style is:global>`，**只包含让组件 scoped style 能正确解析的最少规则**——因为 hero/卡片/按钮的 scoped CSS（`.astro-j7pv25f6` 等）已被 Astro 自动 inline，唯一缺的是它们引用的 CSS 变量与 body 基础。具体 inline 内容：
  - H color token：`--sand --sand-dark --paper --ink --ink-soft --tang --amber`
  - 字体栈 token：`--font-display --font-body --font-mono --font-cjk`
  - `* { box-sizing: border-box }` + `html, body { margin: 0; padding: 0 }`
  - `body { background, color, font-family, line-height, -webkit-font-smoothing }`
  - `h1-h4 { font-family, letter-spacing }`、`code/pre/.mono { font-family }`
  - 估算总量 < 1KB minified。

#### P1 — Hero 字体 preload + manifest 挪位

**P1-1. 显式 preload Bricolage Grotesque latin 子集**

- 在 `MarketingLayout.astro` head 中加：
  ```html
  <link rel="preload" as="font" type="font/woff2" crossorigin
        href={bricolageLatinUrl}>
  ```
- `bricolageLatinUrl` 通过 `import url from '@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2?url'` 取（fontsource 包的字体文件可被 Vite 直接 import）。
- 只 preload 1 个文件（latin 子集，单一可变字重），不 preload CJK——CJK 子集由浏览器按页面字符按需选择，硬 preload 反而浪费。

**P1-2. `<link rel="manifest">` 挪到 body 末尾**

- 当前在 head 与 favicon 一起，被 trace 网络依赖树识别为关键路径节点（1157ms）。挪到 `</body>` 前不影响 PWA 行为，但移出关键路径。

#### P2 — 字重瘦身（已在 P0-1 中合并）+ 微优化

- P0-1 已经覆盖 P2 的字重瘦身，无独立改动。
- 不做：preconnect（同源无收益）、JS 拆包（type=module 已 defer）、图片懒加载（LCP 是文本）。

---

## 数据流 / 边界

- **共享 token**：`marketing.css` 与文档层 `theme.css` 都依赖同一组 H token。重复定义 token 是可接受的（一处约 30 行），等价于「文档层有自己的样式入口，营销层有自己的入口」。改色仍要两处改——这是新的约束，写在文件顶部注释里。
- **fonts.css 命运**：保留文件但仅供文档层（Starlight）使用；营销层改用 `marketing-fonts.css`。文件顶部加注释说明用途分层。
- **Astro `?url` import**：Vite 原生支持，构建时会输出 hash 化文件名，运行时拿到正确 URL。已在 Astro 6.x 验证。

---

## 测试策略

- **单测**：本次不引入逻辑代码，无需新单测；既有单测必须仍然 100% 通过（`pnpm test`）。
- **类型/构建**：`pnpm check` + `pnpm build` 必须通过。`pnpm build` 后人工检查 `dist/_astro/` 下：
  - 应出现新的 `marketing.*.css` 与 `marketing-fonts.*.css`
  - `theme.*.css` 仍存在（文档层用），但营销页 HTML 不再引用它
- **E2E**：`pnpm test:e2e` 全套通过（涉及营销页 hero、双语切换等）。如果有 snapshot 因字体回退期发生像素级变化导致失败，更新 snapshot 即可。
- **性能回归验证**（关键）：
  1. `pnpm build && pnpm preview`
  2. 用 chrome-devtools-mcp，同样的 Slow 4G + 4× CPU + 412×823 mobile 设置
  3. 跑 `performance_start_trace` 对 `http://localhost:4321/` 与 `http://localhost:4321/en/`
  4. 验收口径：**LCP render delay < 250ms**（基线 455ms）；首屏 render-blocking CSS 总未压缩体积 < 100KB（基线 374KB）。
- **视觉回归**：本地开发服务器肉眼对比 `/`、`/en/`、`/migrate/`、`/7-days/`、`/faq/` 中英文 5 页，hero/卡片/按钮字体不应明显变形。重点关注：
  - 中文区段是否回退到 PingFang SC 后字重/字距正常
  - 英文区段 Bricolage 是否首屏立即可用
  - mono 标签（`SPECIFICATION · 规格` 等）是否正常

---

## 错误处理 / 边界

- **JS 关闭场景**：`<noscript>` 兜底确保 marketing.css 仍能加载（同步 stylesheet）。
- **`?url` 解析失败**：Astro 构建时若包路径错会直接构建失败——属于"早期失败优于运行时失败"，不需要 try/catch。
- **CDN 抓取顺序**：preload 字体 + preload CSS 都在 head，浏览器会按优先级排队；无主动控制需求。

---

## 落地与回退

- **commit 边界**（建议 4 个 commit）：
  1. `refactor(styles): 拆分 marketing.css 与 marketing-fonts.css，移除营销层 Starlight 依赖`
  2. `perf(layout): MarketingLayout 关键 CSS 内联 + 主样式异步化`
  3. `perf(layout): preload Bricolage 字体子集，manifest 挪到 body 末`
  4. `chore(styles): 删除 fonts.css 中营销层不再需要的字重 import`
- **回退**：若验证不达标，单独 revert 第 2 个 commit（异步化）即可恢复同步加载；CSS 拆分本身是无害的。

---

## 验收清单

- [ ] `pnpm check` 通过
- [ ] `pnpm test` 全绿
- [ ] `pnpm build` 通过
- [ ] `pnpm test:e2e` 全绿
- [ ] chrome-devtools-mcp 节流 trace：LCP render delay < 250ms
- [ ] 首屏 render-blocking CSS 未压缩总和 < 100KB
- [ ] 5 页中英文视觉对比无明显回归
