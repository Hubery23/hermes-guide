# Hermes Agent 中文指南站 · 设计规范

- **日期**：2026-04-23
- **状态**：spec 草案（待用户复审）
- **下一步**：spec 审核通过后，调用 `superpowers:writing-plans` 生成实施计划

---

## 1. 背景与目标

做一个面向中文开发者的 Hermes Agent 入门 + 迁移指南站。

**核心目标**：让一个零基础的中文开发者跟着网站走，**7 天内在自己机器上跑通 Hermes Agent**（常驻 + Telegram 接入 + 装过至少一个 skill）。次级目标：让已经在用 OpenClaw 的用户能平滑迁移到 Hermes。

**衡量成功的标准**：首月 >50 个用户从 Day 01 一路读到 Day 07 并在 GitHub / Telegram 社群反馈成功上线。

---

## 2. 定位

| 维度 | 本站 | hermes101.dev（竞品 / 对标） |
|---|---|---|
| 定位 | 做得比 101 更好的中文入门站 | 先发者，2026-04-22 上线 |
| 差异化 | **亲测可复现的实操流程**（作者本人跑通过 Telegram 接入 + skill 安装 + OpenClaw 迁移） | 更像读官方文档翻译整理 |
| 视觉 | 工业产品目录风（见 §5） | 深色极客荧光绿 |
| MVP 范围 | 只做入门 + 迁移 | 首页 / 安装 / 7天教程 / 资源 / 迁移 / FAQ 全铺 |
| 语言 | **中英双语可切换**（文案不写死在代码里） | 仅中文 |

**非目标（non-goals）**：
- ❌ 不是 Hermes Agent 官方站点或官方翻译
- ❌ MVP 不做"资源聚合 / 推荐教程"栏目（推迟到 v2）
- ❌ 不自动爬取/自动更新外部资源
- ❌ 不放作者自制截图（截图维护成本高、半衰期短；用命令行输出代替）
- ❌ 不做评论系统、用户登录、付费功能

---

## 3. 受众

**主受众**：具备基础开发能力的中文用户，想在自己机器上跑一个有持久记忆、多平台接入的 AI Agent，用来做个人自动化、信息推送、日常助手。

**次受众**：已经在用 OpenClaw 并考虑切到 Hermes 的用户。

**典型读者路径**：
1. 从 Twitter/X 或 GitHub trending 看到 Hermes，搜中文教程
2. 落在本站首页，扫完 hero + 8 个模块概览
3. 从 Day 01 开始跟着做；跑不通时看 FAQ 或命令输出
4. 第 7 天在自己 Telegram 里和 Hermes 聊天

---

## 4. MVP 范围与内容规划

### 4.1 核心内容：8 篇长文

沿用对标站"7 天 + 迁移"结构，每篇独立可读，15~20 分钟读完：

| # | 标题（中） | 标题（EN） | 时长 | 备注 |
|---|---|---|---|---|
| Day 01 | 安装 Hermes | Install Hermes Agent | 60 min | Mac / Linux / WSL 三平台都覆盖 |
| Day 02 | 接入 Telegram | Connect Telegram Bot | 45 min | BotFather → token → .env |
| Day 03 | 装第一个 Skill | Install a Skill | 60 min | 从官方 skills hub 装 |
| Day 04 | 持久记忆 | Persistent Memory | 75 min | **里程碑**：这是 Hermes 的核心差异化 |
| Day 05 | 自动化调度 | Scheduled Tasks | 50 min | 自然语言 cron |
| Day 06 | MCP / 工具集 | MCP & Toolsets | 60 min | 浏览器 / FS / GitHub 等 |
| Day 07 | 沙箱与安全 | Sandbox & Security | 40 min | Docker / SSH 等 5 种后端 |
| Bonus | 从 OpenClaw 迁移 | Migrate from OpenClaw | 90 min | 原创内容，亲测过 |

每篇文末必带：
- **你应该能观察到**（预期命令输出 / 日志 / 对话截片）
- **踩坑提示**（基于作者实际安装过程中的遇到的问题）
- **下一步**（到 Day N+1 的链接）
- **资料来源**（官方文档章节链接 + 原始资料）

### 4.2 MVP 不包含

- 资源聚合栏目（v2）
- FAQ 独立页（Day 01-07 内嵌局部 FAQ 即可）
- 搜索（v2，或用 Pagefind 低成本接入）
- 评论 / 分享 / RSS（v2）

---

## 5. 视觉方向：H · 工业产品目录

**核心隐喻**：这个网站不是"又一个深色极客博客"，而是一本**产品说明书**——每个模块有编号、参数、装配步骤。呼应 Hermes Agent 本身"像一件硬件产品一样被你组装、部署、运行"的气质。

参考：Teenage Engineering OP-1 产品手册 · Braun Dieter Rams · IBM 1980s 技术手册 · Muji 商品目录。

### 5.1 色板

| 名称 | HEX | 用途 |
|---|---|---|
| `--sand` | `#E8E2D4` | 主底色，温暖的沙米 |
| `--sand-dark` | `#D9D2BF` | 大字背景装饰 |
| `--paper` | `#F4EFE1` | 卡片 / hover 高亮 |
| `--ink` | `#2B2B2E` | 主文字 + 深色区块 |
| `--ink-soft` | `#44444A` | 次文字 |
| `--tang` | `#F5713A` | 主强调色（CTA、link、强调） |
| `--amber` | `#E8C547` | 次强调色（milestone、警示） |

**规则**：sand + ink 是 80% 的画面，tang + amber 是 15% 的锐利点缀，其余 5% 是白/灰过渡。**不使用紫色、蓝绿色、purple gradient**——这些是 AI slop 的典型标志。

### 5.2 字体

| 层级 | 字体 | 回退 |
|---|---|---|
| Display（大标题） | **Bricolage Grotesque** (variable, 500/700/800) | system-ui |
| 正文（中文） | **Noto Sans SC** / PingFang SC | sans-serif |
| 正文（西文） | **IBM Plex Sans** 400/500 | -apple-system |
| 代码 / 标签 / 编号 | **IBM Plex Mono** 500/700 | ui-monospace |

**规则**：display 字体的字距必须 `letter-spacing: -0.02em` 往下压，等宽字体的 label 必须 `letter-spacing: 2-4px` 拉开。这是"产品目录"排版的关键字距反差。明确不用 Inter / Roboto / Arial / Space Grotesk。

### 5.3 排版语言（motifs）

贯穿所有页面的视觉元素：

- **Warning tape 顶条**：深墨底 + 琥珀色字，带一个橙色小圆点开头
- **Unit 编号**：`H/01.02` 格式，所有模块都有
- **Batch / Serial 元信息**：页脚和关键卡片右上角有 `S/N 2026-0001` `BATCH 26.Q2` 这种标识
- **Marquee 分隔条**：section 之间用 `● SKILL · ◉ INSTALL · ▲ MEMORY` 这种跑马灯式标签分隔
- **Compat / Spec 表**：关键信息（如 OpenClaw → Hermes 迁移映射）做成双列对照表，背景一侧深一侧浅
- **背景巨字**：hero 下半部有超大的 `HERMES` 作 subtractive 底纹（用 sand-dark 色，不抢焦点）
- **Milestone 胶带**：7 天里有 1-2 天做琥珀色高亮 + 右上角 `★ MILESTONE` 胶带

**不要**：圆角阴影玻璃拟态、purple gradient、generic Material 风图标、彩色 emoji（🚀 💡 等）。允许使用几何 Unicode 符号（● ◉ ▲ ◆ ■ ★ ↗）作为标识和项目符号——这些是工业排版的原生语言。

### 5.4 参考 mockup

`/mockups/homepage-H-full.html`（已写，保存在 `.superpowers/brainstorm/` 会话目录下；正式实施时迁移到仓库）

---

## 6. 信息架构（首页）

按滚动顺序：

1. **Warning tape** (中/EN 切换器在右上)
2. **Nav**（5 项：安装 / 七日教程 / 迁移 / 资源-灰显 / FAQ）
3. **Hero**：左 `H/01` 大字 + tagline + 两个 CTA + 三个关键数字；右侧深墨色 `SPECIFICATION` 卡片
4. **Marquee 分隔**
5. **A.01 七日组装指南**：8 张方格，Day 04 做 milestone
6. **A.02 从 OpenClaw 迁移**：左右对照兼容性映射表
7. **Final CTA**：大字 "现在开始，7 天后上线你的 Agent"
8. **Footer**：S/N、MIT 声明、非官方社区指南

**Logo 文字**：暂定 `Hermes/Agent`（左下"Hermes"主名 + 斜杠橙色 + "Agent"）。**站点正式品牌名未定**，见 §10 TBD。

---

## 7. 国际化（i18n）

**硬性需求**：中英双语切换，文案**不能写死在模板里**。

### 7.1 架构要求

- 所有可见文案（包括 nav、按钮、spec 卡片、footer）从翻译文件读取
- URL 策略：`/` 默认跳到浏览器语言；`/en/*` 为英文；`/zh/*` 为中文（或 `/` 作中文默认）
- 语言切换按钮保留当前路径，只切换语言段
- Day 01-07 + Bonus 内容文件按语言分文件，用翻译键映射，不强制同时交付两语——可以"中文先行，英文标 Coming soon"

### 7.2 i18n 选型

看选的框架（§9）决定：
- Astro + Starlight：内置 i18n，配置即用
- Astro vanilla：`astro-i18n` 或 `@astrolicious/i18n`
- 自己写：一个 `t()` 函数 + JSON 字典（最轻）

---

## 8. 内容来源与版权

| 来源 | 可用作 | 限制 |
|---|---|---|
| Hermes 官方 docs | 事实性步骤、命令、参数 | **改写而非照搬**；每页底部标 "原始资料：[link]" |
| hermes-agent GitHub README / 源码 | 事实性特性说明 | MIT，允许引用 |
| hermes101.dev | **只参考章节编排的灵感** | 文字必须自己重写。不抄写原创内容 |
| 作者亲测经验 | **Day 01-07 的踩坑 + OpenClaw 迁移全部内容** | 原创，是本站护城河 |

**每篇文末必带**：`资料来源 / Sources:` 链接列表。既合规又帮 Google 判断"是原创改写"而非"重复内容"。

---

## 9. 技术方案（待决，仅列选项）

按 §1 目标"抢先发时间窗口 + 作者是编程新手"，下列三个选项里：

### 选项 A：Astro + Starlight（官方文档主题）
- ✅ 8 篇教程的 TOC / 目录 / 代码高亮 / i18n / 暗色模式全开箱即用
- ❌ Starlight 默认观感很"Vue/React 官方文档"，要呈现 H 工业风需要**大量 CSS 覆盖**
- ❌ 首页基本要完全脱离 Starlight 模板自己做（Starlight 允许但配置繁琐）
- ❌ Starlight 内置的字体/色板系统我们大概率不用

### 选项 B：Astro vanilla + MDX + 手写布局（**推荐**）
- ✅ 视觉上 100% 按 H 方向定制，无包袱
- ✅ MDX 处理教程正文足够（代码块用 Shiki、图标用 iconify-json）
- ✅ i18n 用 `astro-i18n` 轻量路由
- ✅ 搜索接 Pagefind（单 script 标签级别集成）
- ❌ 需要手写左侧目录、prev/next 导航这类文档组件（~2 天工作量）

### 选项 C：Next.js + nextra 或其他
- ✅ 生态大
- ❌ 默认 JS bundle 重，和 H "精简产品目录"的气质不匹配
- ❌ 对编程新手调试门槛更高
- **不推荐**

**推荐 B**。理由：我们的视觉方向本身就是"反文档主题默认"，用 Starlight 反而要和它的 CSS 系统搏斗。vanilla Astro 多花的 2 天工作量，换来的是不被模板绑架的自由度。

**待用户拍板**。

### 9.1 部署

- **Cloudflare Pages**（推荐，和竞品同栈，国内外 CDN 都快，免费）
- Vercel（备选）
- 自建：不推荐

### 9.2 关键依赖候选

| 功能 | 选型 |
|---|---|
| 代码高亮 | Shiki（Astro 原生） |
| 图标 | iconify-json（按需引入） |
| 搜索 | Pagefind（v2） |
| Analytics | Cloudflare Web Analytics（无 cookie） |
| 字体 | Google Fonts self-hosted（CN 访问友好） |

---

## 10. 未决项（TBD）

以下需用户拍板后在实施阶段填入：

- **站点品牌名**：不叫 hermes101。候选方向：`hermes.zh` / `agent.study` / `hermes-zh.dev` / 其他
- **域名**：待定
- **英文内容 v1 是否同步交付**：全量 / 中文先行英文 coming soon
- **作者署名策略**：匿名 / 作者名 / GitHub 账号
- **技术栈**：A vs B vs C（§9）

---

## 11. 非 MVP（v2+ 规划，仅作备忘）

- 资源聚合页（Markdown 手动清单 →  GitHub Actions 半自动）
- 站内搜索（Pagefind）
- RSS
- 作者踩坑案例集（"我在 Mac M1 上安装 Hermes 的 12 个失败"这类原创长文）
- 社区贡献入口（PR 欢迎）

---

## 12. 里程碑 / 验收

**MVP 发布条件**：
1. 首页按 H 视觉方向实施完成（8 个 section 全部写出）
2. Day 01 - Day 07 全部写完中文版（每篇 >1500 字，命令可复现）
3. Bonus 迁移指南中文版写完（>2000 字，映射表完整）
4. 中英双语框架搭好（英文可为占位 "Coming soon" 的可路由页面）
5. 部署到 Cloudflare Pages，有可访问的 URL

**发布后 7 天**：
- 在 V2EX / Twitter / 小红书有首发推广
- 收集 >10 条用户反馈
- 修一轮明显 bug
