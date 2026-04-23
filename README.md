# Hermes Agent 中文指南

> 7 天跑通你的自托管 AI Agent。

**在线访问**：https://hermesagentguide.online

非官方中文社区指南。本站不隶属于 Nous Research 或 Hermes Agent 官方项目。

---

## 是什么

面向中文开发者的 Hermes Agent 入门 + 迁移指南：

- **7 天手把手教程**：从安装到在 Telegram/Discord/Slack 里让 Agent 说话
- **从 OpenClaw 搬家**：作者亲测过的概念映射表
- **中英双语切换**：文案不写死在模板，英文欢迎 PR 贡献
- **H 工业产品目录风**：像读 Teenage Engineering 说明书，不是又一个紫色 AI 文档站

## 技术栈

- [Astro 6](https://astro.build/) + [Starlight](https://starlight.astro.build/) 静态站点
- TypeScript · MDX · Pagefind（内置搜索）
- 字体自宿：Bricolage Grotesque Variable · IBM Plex Mono/Sans · Noto Sans SC
- 部署：Cloudflare Pages

## 本地开发

```bash
# 需要 Node 20+ 和 pnpm 9（corepack 会自动拉 pnpm）
corepack enable
pnpm install

pnpm dev           # http://localhost:4321
pnpm build         # 生产构建到 dist/
pnpm preview       # 预览 dist/
pnpm test          # vitest 单元测试（locale + i18n utils）
pnpm test:e2e      # Playwright E2E（需先 pnpm build）
pnpm check         # astro check 类型验证
```

## 贡献

- **英文翻译**：`src/content/docs/en/` 下是英文 stub，欢迎补内容 PR
- **教程内容**：`src/content/docs/7-days/` 是 Day 01-07 中文占位，正在撰写中
- **Bug/改进**：开 issue 告诉作者

## 目录结构

```
src/
├── components/        # H 风格展示组件（Strip/Nav/Footer/Day/Compat/...）
├── content/
│   ├── docs/          # Starlight 教程 MDX（按 locale 分 zh / en）
│   └── i18n/          # 中英字典（营销页文案）
├── layouts/           # MarketingLayout（营销页外壳）
├── lib/               # locale.ts + i18n.ts（带单测）
├── pages/             # 纯自定义营销页（/, /migrate/, /7-days/）
├── styles/            # fonts.css + theme.css（H tokens + Starlight 变量覆盖）
└── tests/             # unit/*.test.ts + e2e/*.spec.ts
```

## 许可

- 代码：[MIT](./LICENSE)
- 内容：[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

---

由 [@Hubery23](https://github.com/Hubery23) 搭建与维护。
