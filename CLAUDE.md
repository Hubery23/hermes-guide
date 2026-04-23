# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**Hermes Agent 中文指南**（hermesagentguide.online）：面向中文开发者的 Hermes Agent 入门 + 从 OpenClaw 迁移指南。非官方社区站点，不隶属 Nous Research。设计对标物是 hermes101.dev，希望做得更好；视觉风格称为「H 工业产品目录风」（参考 Teenage Engineering 说明书）。

## 常用命令

Node 20+、pnpm 9（通过 corepack）。

```bash
pnpm dev              # 本地开发 http://localhost:4321
pnpm build            # 生产构建到 dist/
pnpm preview          # 本地预览 dist/（注意：Playwright E2E 依赖此命令）
pnpm check            # astro check 类型 + 内容集合校验
pnpm test             # vitest 单测（只跑 src/tests/unit/**）
pnpm test:e2e         # Playwright E2E；webServer 用 pnpm preview，必须先 pnpm build
pnpm test -- locale   # 过滤到单个测试文件名
```

部署：Cloudflare Pages，`pages_build_output_dir = ./dist`（见 `wrangler.toml`）。**不要**依赖 `git push` 触发部署逻辑。

## 架构：两套外壳，一套设计语言

仓库核心特点是 **Starlight 文档层 + 手写营销层** 并存：

- **文档层**：`src/content/docs/` 下的 MDX 由 Starlight 渲染。侧边栏在 `astro.config.mjs` 里通过 `autogenerate` 从目录结构生成。schema 在 `src/content.config.ts` 扩展了 `day`/`duration`/`milestone`/`sources` 字段。
- **营销层**：`src/pages/` 里手写的 `.astro` 页面（`/`、`/migrate/`、`/7-days/` 及 `/en/` 镜像），包在 `src/layouts/MarketingLayout.astro` 里。不经过 Starlight。
- **共享主题**：`src/styles/theme.css` 先定义 H tokens（`--sand` / `--tang` / `--amber` / `--ink` ...），再把 Starlight 的 `--sl-color-*` 重新指向这些 tokens，所以一处改色两处生效。营销页和文档页视觉统一靠这个机制，不是靠复制样式。

## 双语路由约定

默认语言 zh-CN（root），英文走 `/en/` 前缀。Starlight 的 `defaultLocale: 'root'` 让中文不带前缀。

- 所有 locale 判定 / 路径切换 **必须**走 `src/lib/locale.ts` 的 `detectLocale` / `stripLocale` / `swapLocalePath`。不要在组件里手写 `locale === 'en' ? '/en' : ''`——这条约定已经在 SiteNav 里被违反过一次，未来 locale 方案改动（例如加 `/zh-CN/`）会静默 break。
- 营销页文案走 `src/content/i18n/{zh-CN,en}.json`，用 `useT(locale)` 翻译。缺 key 时 `createTranslator` 会 warn 并回落到 key 本身。
- 英文 MDX 是 stub 状态，在 `src/content/docs/en/` 下，等社区 PR。

## 测试布局

- `src/tests/unit/**/*.test.ts` → vitest，node 环境，路径别名 `@lib` / `@` 在 `vitest.config.ts` 和 `tsconfig.json` 都要维护。
- `src/tests/e2e/*.spec.ts` → Playwright，只跑 chromium，`baseURL=http://localhost:4321`，webServer 跑 `pnpm preview`。**CI 外 `reuseExistingServer: true`**，本地跑 E2E 前若 4321 端口被占要先释放（历史上遇到过僵尸 node 进程占端口导致 preview 启动异常）。

## 内容撰写约定

- 新增教程章节：在 `src/content/docs/7-days/day-NN.mdx` 同时建中英两份（`7-days/` 和 `en/7-days/`），frontmatter 里 `day: N`、`milestone: true/false`。sidebar 会自动收录。
- 迁移指南映射表（OpenClaw ↔ Hermes）走 `CompatChart.astro` 组件；数据目前在各页面重复，后续会抽到 `src/lib/data.ts`——如果你在改动营销页数据，优先考虑抽共享源。
- 脚注/引用外链放 frontmatter 的 `sources: [{title, url}]` 数组，schema 会校验。

## 参考链接（见 `reference.md`）

对标：hermes101.dev · 参考：openclaw101.dev · 官方文档：hermes-agent.nousresearch.com/docs/ · 官方迁移指南：.../docs/guides/migrate-from-openclaw
