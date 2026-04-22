# Hermes Agent 中文指南站 · 设计规范

- **日期**：2026-04-23
- **状态**：spec 已冻结，进入实施计划阶段
- **域名**：**hermesagentguide.online**
- **技术栈**：**B'**（Astro + Starlight 混合 + 自定义营销页）
- **署名**：GitHub 账号 [@Hubery23](https://github.com/Hubery23)
- **仓库**：本地 `/Users/hubery/MyProduct/hermes`；未来会作为**公开仓库**推送到 `github.com/Hubery23`，站内所有 "源码"/"贡献"/"报 bug" 链接都指向该公开仓库
- **首轮发布语言**：中文先行，英文页面作为可路由占位（语言切换器能点但落地页显示 "Coming soon — 欢迎贡献"）
- **下一步**：调用 `superpowers:writing-plans` 生成实施计划

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

**章节顺序严格参照 hermes101.dev/7-days/ 的拓扑**（他们的编排经过学习路径推敲），但**每篇标题重写**，避免照搬文字。章节时长在教程写完后根据实际字数/步骤量再定，此处不预设。

| # | 我们的标题（中） | 我们的标题（EN） | 对应 101 章节（仅参考） | 验证成果 |
|---|---|---|---|---|
| Day 01 | 跑起来：Hermes 的第一次对话 | Boot Up: Your First Chat with Hermes | 安装 Hermes，说出第一句话 | `hermes version` 有输出 + 本地一次对话成功 |
| Day 02 | 挑个大脑：模型选型与 API 接入 | Pick a Brain: Model & API Setup | 配置模型与 API Key | Agent 能调 LLM 并给出有意义回答 |
| Day 03 | 入驻聊天室：Telegram / Discord / Slack | Go Social: Messaging Platforms | 连接消息平台机器人 | 在真实聊天 app 里 @ 机器人并获得回复 |
| Day 04 | 让 Agent 动手：内置工具实战 | Give It Hands: Using Built-in Tools | 调用内置工具 | 成功触发 ≥2 个内置工具 |
| Day 05 | 教它新本事：安装第一个 Skill | Teach a Trick: Installing Your First Skill | 安装并使用技能 | **里程碑**：从 hub 装一个 skill 并对话触发 |
| Day 06 | 记忆与状态：会话、压缩、备份 | Memory & State: Sessions, Compression, Backup | 记忆、会话与备份 | 会话恢复 + 备份导出/导入成功 |
| Day 07 | 全自动化：定时任务与故障排查 | Full Auto: Scheduling & Diagnostics | 自动化、诊断与迁移（我们把迁移单拎出来） | 自然语言调度 + 日志定位典型错误 |
| Bonus | 从 OpenClaw 搬家：平滑迁移指南 | Leaving OpenClaw: A Smooth Migration | （101 在 Day 7 里简写；我们做加长版） | 迁移映射表 + 作者亲测 5 个真实案例 |

**关于时长**：每篇写完、截稿后根据字数和步骤数标注（例：< 1500 字 → ~10 min；多平台分支 → 每分支算时长）。UI 上时长用 `IBM Plex Mono` 等宽字体展示。

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
8. **Footer**：S/N、MIT 声明、非官方社区指南、**GitHub ↗ 链接指向 `github.com/Hubery23/<repo>`**、"贡献 PR" 指引

**Logo 文字**：暂定 `Hermes/Agent`（左下"Hermes"主名 + 斜杠橙色 + "Agent"）。**站点正式品牌名未定**，见 §10 TBD。

---

## 7. 国际化（i18n）

**硬性需求**：中英双语切换，文案**不能写死在模板里**。

### 7.1 架构要求

- 所有可见文案（nav、按钮、spec 卡片、footer、所有 H 风格 label）从翻译文件读取
- URL 策略：`/` 默认 = 中文（`zh-CN`）；`/en/*` = 英文
- 语言切换按钮保留当前路径，只切换语言段
- 教程内容按语言分文件；**首轮只交付中文，英文页保留为"Coming soon，欢迎贡献 PR"的占位页**，让语言切换器不至于点了就 404

### 7.2 i18n 实现

走 Starlight 内置 i18n：
- 在 `astro.config.mjs` 里声明 `defaultLocale: 'zh-CN'` 和 `locales: { 'zh-CN': {...}, 'en': {...} }`
- UI 文案通过 `src/content/i18n/zh-CN.json` / `en.json` 提供
- 教程 MDX 按语言放在 `src/content/docs/zh-CN/` 和 `src/content/docs/en/`
- 自定义 Astro 页面（首页、迁移落地页）用 `getLocaleByPath` 等 Starlight utility 取得当前语言，从翻译字典渲染

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

## 9. 技术方案（2026-04-23 决议）

### 9.0 决议

**采用 B' 混合方案：Astro + Starlight（教程页） + 纯自定义 Astro 页（首页 / 迁移落地 / 营销页）**。

用户 2026-04-23 初轮选定 B（Astro vanilla），我在此轮做了一次 2026 市场调研（Fumadocs、Nextra v4、VitePress、Starlight），反转推荐为 B'——理由见 §9.5。若用户坚持 B，保留 B 也完全可行，只是要自己实现 i18n 路由 + TOC + 上下翻页。

### 9.1 选项 A：Astro + Starlight（纯 Starlight 模板）
- ✅ TOC / 上下翻页 / i18n（同类最佳）/ 搜索（Pagefind 内置）/ 暗色 / CWV 满分全开箱
- ❌ 默认主题偏"Vue/React 文档"观感。要呈现 H 工业风需大量 `--sl-*` CSS 变量覆盖
- ❌ 首页若完全按 H 风格做，需要脱离 Starlight 模板——配置可行但要理解 `Starlight` 的 page 覆盖机制
- ⚠️ 这条路要么全套用它的主题（视觉屈服）、要么大范围改（视觉自由但工作量不小）

### 9.2 选项 B：Astro vanilla + MDX（100% 手写）
- ✅ 视觉 100% 按 H 定制，无任何模板包袱
- ✅ MDX + Shiki + iconify-json 处理教程正文足够
- ❌ i18n 要自己接 `astro-i18n`（路由 + 字典），不如 Starlight 稳
- ❌ 左侧目录 / 上下翻页 / TOC / 搜索全部手写（~2~3 天）
- ❌ 对编程新手而言，手写文档组件容易踩无数细节坑（滚动指示、锚点跳转、响应式目录等）

### 9.3 选项 B'（**推荐**）：Astro + Starlight（教程页）+ 自定义 Astro 页（营销页）
- ✅ **教程页走 Starlight**：Day 01-07 + Bonus 用 Starlight 的 docs page，自动拿到 TOC/翻页/i18n/Pagefind 搜索
- ✅ **营销页完全自定义**：`/` 首页、`/migrate/` 迁移落地页、`/7-days/` 目录页用纯 Astro 页面脱离 Starlight 模板，100% 呈现 H 工业风
- ✅ **全局 H 色板注入到 Starlight**：通过 `--sl-color-*` 变量覆盖，Starlight 教程页也能呈现沙米/墨/橙的 H 配色
- ✅ **i18n 不用自己搭**：Starlight 的 i18n 同类最佳（locale 检测、UI 翻译系统、路由）
- ⚠️ 成本：多花半天理解 Starlight 的 slot / override 机制，但**比从零写 i18n + TOC + 翻页省 1-2 天**
- 📊 对比 B：整体工作量更少，稳定性更高，代价是学习曲线稍陡

### 9.4 选项 C：Fumadocs / Nextra v4（Next.js 系）
- ✅ Fumadocs 是 2025-2026 增速最快的文档框架（3x YoY），headless 组件易定制
- ✅ 视觉自由度高
- ❌ Next.js ecosystem 本身对编程新手太重（比 Astro 多一层心智负担）
- ❌ Core Web Vitals 略逊于 Astro/Starlight（纯内容场景 Astro 是冠军）
- **不推荐**

### 9.5 选项 D：VitePress（Vue 系）
- ✅ 极简，上手最快
- ❌ Vue 生态，视觉改主题的模式和 Starlight 类似（同样有模板包袱）
- ❌ i18n 不如 Starlight
- **不推荐**

### 9.6 为什么反转推荐

我 2026-04-23 初轮给 B，基于"H 视觉方向反文档主题默认"。调研后发现：
- Starlight 0.30+ 支持 `components` slot 全局替换任意组件，CSS 变量超过 60 个覆盖点
- 真正"反默认"的压力在营销页（首页 / hero），不在教程页。教程页的 "list + TOC + prev/next" 布局本身就是 H 风格可接受的形态，只要配色和字体对齐
- Starlight 解决 i18n 是硬价值——我们是硬要求双语可切换的站，自己写 i18n 极容易出锚点/路由 bug

**B' 本质是 "用框架解决硬问题（i18n / 搜索 / 翻页），把创意精力放在营销页视觉"**——这是成熟团队的做法。

---

## 9.7 部署

- **Cloudflare Pages**（推荐，和竞品同栈、国内外 CDN 都快、免费、与域名 `hermesagentguide.online` 直接绑定）
- Vercel（备选）
- 自建：不推荐

## 9.8 关键依赖候选

| 功能 | 选型 |
|---|---|
| 文档框架 | Astro + Starlight（教程页） |
| 首页框架 | 纯 Astro 页面（不走 Starlight 模板） |
| 内容格式 | MDX |
| 代码高亮 | Shiki（Astro / Starlight 原生） |
| 搜索 | Pagefind（Starlight 内置） |
| 图标 | iconify-json（按需） |
| Analytics | Cloudflare Web Analytics（无 cookie） |
| 字体 | Google Fonts self-host（Bricolage Grotesque / IBM Plex Mono / IBM Plex Sans / Noto Sans SC） |
| 部署 | Cloudflare Pages + `hermesagentguide.online` |

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

所有 MVP 前置决策均已拍板（见顶部 metadata）。

- ✅ 站点 logo：`Hermes/Agent`
- ✅ 域名：`hermesagentguide.online`
- ✅ 技术栈：B'（Astro + Starlight 混合）
- ✅ 首轮语言：中文先行、英文占位可路由
- ✅ 署名：GitHub [@Hubery23](https://github.com/Hubery23)
- ✅ 仓库：未来公开到 `github.com/Hubery23/<repo>`，站内导航 footer 有 "GitHub ↗" 链接

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
