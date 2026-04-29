# Resources Page Design Spec

Date: 2026-04-29  
Status: Approved

## What We're Building

A `/resources/` page (+ `/en/resources/` bilingual mirror) for hermesagentguide.online that curates 15 hand-picked Hermes Agent resources across 5 categories. Philosophy: 少而精（few but excellent）. Every entry is human-reviewed.

## Approved Content

15 resources in 5 categories, finalized:

### 01 官方资源 (5)
| Title | URL | Tags |
|---|---|---|
| Hermes Agent 官网 | https://hermes-agent.nousresearch.com/ | 官方, 入口 |
| 官方文档首页 | https://hermes-agent.nousresearch.com/docs | 官方, 文档 |
| Quick Start | https://hermes-agent.nousresearch.com/docs/getting-started/quickstart | 官方, 入门, 必读 |
| Learning Path | https://hermes-agent.nousresearch.com/docs/getting-started/learning-path | 官方, 路线图 |
| NousResearch/hermes-agent | https://github.com/NousResearch/hermes-agent | 官方, 源码, GitHub |

### 02 视频教程 (3)
| Title | URL | Tags |
|---|---|---|
| Hermes Full Course (2 Hours) | https://www.youtube.com/watch?v=8avW0D2sEn8 | 视频, 系统, 英文 |
| Full Setup: Step-by-Step | https://www.youtube.com/watch?v=uycgV-eulGE | 视频, 入门, 英文 |
| The Ultimate Beginner's Guide | https://www.youtube.com/watch?v=CwPUOVUdApE | 视频, 入门, 英文 |

### 03 深度文章 (4)
| Title | URL | Tags |
|---|---|---|
| DataCamp: Setup and Tutorial | https://www.datacamp.com/tutorial/hermes-agent | 文章, 入门, 英文 |
| Antigravity: The Agent That Grows | https://antigravity.codes/blog/hermes-agent-guide | 文章, 深度, 英文 |
| Lushbinary: Developer Guide | https://lushbinary.com/blog/hermes-agent-developer-guide-setup-skills-self-improving-ai/ | 文章, 开发者, 英文 |
| Hermes vs OpenClaw 深度对比 | https://www.ai.cc/blogs/hermes-agent-2026-self-improving-open-source-ai-agent-vs-openclaw-guide/ | 文章, 对比, 英文 |

### 04 GitHub 精选 (1)
| Title | URL | Tags |
|---|---|---|
| awesome-hermes-agent | https://github.com/0xNyk/awesome-hermes-agent | GitHub, 精选, 社区 |

### 05 社区讨论 (2)
| Title | URL | Tags |
|---|---|---|
| Reddit: Complete Setup Guide | https://www.reddit.com/r/hermesagent/comments/1rt5syt/complete_hermes_agent_setup_guide/ | 社区, Reddit, 入门 |
| HN: An Agent That Grows With You | https://news.ycombinator.com/item?id=47726913 | 社区, HN, 深度 |

## Data Architecture

Resources stored as a TypeScript array in `src/data/resources.ts`. No content collection (Zod overhead not justified for 15 static items).

```ts
type ResourceTag =
  | '官方' | '入口' | '文档' | '入门' | '必读' | '路线图' | '源码'
  | '视频' | '系统' | '英文' | '文章' | '深度' | '开发者' | '对比'
  | 'GitHub' | '精选' | '社区' | 'Reddit' | 'HN'

type ResourceCategory = 'official' | 'video' | 'article' | 'github' | 'community'

interface Resource {
  title: string
  titleEn: string
  url: string
  desc: string        // zh-CN one-sentence description
  descEn: string      // en one-sentence description
  tags: ResourceTag[]
  category: ResourceCategory
}
```

Stats (total count, category count) computed at build time from `resources.ts` — never hardcoded.

## Page Structure

```
/resources.astro       (zh-CN)
/en/resources.astro    (en)
```

Both import `MarketingLayout`, use `useT(locale)` for UI strings, and share the same `resources.ts` data.

### Hero
- Badge pill: "精选资源 · 持续更新" (i18n key: `resources.badge`)
- H1: "Hermes Agent **资源导航**" — one line, `<em>` on 资源导航 in tang color
- Subtitle: one-line description (i18n)
- Stats: `{resources.length}` / `{categories.length}` / "人工" — computed

### Category Sections
Each section:
1. Section divider: `NN / 05` counter line
2. Category header: Phosphor icon + title + subtitle
3. Card grid: 2-column desktop, 1-column mobile

### Cards
- 3px top border in category accent color
- Title + ↗ external link icon (top-right)
- One-sentence description
- Tag pills (IBM Plex Mono, colored by tag type)
- `target="_blank" rel="noopener noreferrer"` on all links

### Footer note
"持续整理中 · 最近更新于 2026-04 · 每条经过人工审核"

## Visual Spec

Tokens (from existing `theme.css`):
- Background: `--paper` (#f4efe1)
- Text: `--ink` (#2b2b2e)
- Accent: `--tang` (#f5713a), `--amber` (#e8c547)
- Cards: white (#fff) with 1px `--sand` border

Category accent colors (new local vars, not added to theme.css):
- official: `--tang` (#f5713a)
- video: #3b82f6
- article: #8b5cf6
- github: #52525b
- community: #10b981

Icons: Phosphor Icons (`ph-bold` weight), loaded inline SVG in Astro (not CDN — use `@phosphor-icons/web` npm or inline the SVG paths directly).
- 官方资源: `seal-check`
- 视频教程: `play-circle`
- 深度文章: `book-open-text`
- GitHub 精选: `github-logo`
- 社区讨论: `chats-circle`

Section spacing: `padding-top: 40px` on each category section (approved in design review).

Typography:
- H1: Bricolage Grotesque 800, `white-space: nowrap`
- Section titles: Bricolage Grotesque 700
- Card titles: Bricolage Grotesque 600
- Tags: IBM Plex Mono 500
- Body: IBM Plex Sans 400

## Navigation Changes

Add `nav.resources` to i18n and insert in `SiteNav.astro`. New order:
- 01 · 安装 → `/#install`
- 02 · 七日教程 → `/7-days/`
- 03 · 资源 → `/resources/`
- 04 · 迁移指南 → `/migrate/`
- 05 · FAQ → `/faq/`

## i18n Keys to Add

In `src/content/i18n/zh-CN.json` and `en.json`:

```json
{
  "nav.resources": "03 · 资源",
  "resources.badge": "精选资源 · 持续更新",
  "resources.title": "资源导航",
  "resources.subtitle": "官方文档、视频教程、深度文章——精选全网最值得收藏的 Hermes Agent 学习资源，每条经过人工审核。",
  "resources.stats.resources": "精选资源",
  "resources.stats.categories": "分类",
  "resources.stats.review": "人工",
  "resources.stats.review_label": "每条审核",
  "resources.footer": "持续整理中 · 每条经过人工审核",
  "resources.cat.official": "官方资源",
  "resources.cat.official_sub": "Hermes Agent 官方文档与仓库，最权威的信息源",
  "resources.cat.video": "视频教程",
  "resources.cat.video_sub": "上手成本最低的学习方式，跟着视频一步步来",
  "resources.cat.article": "深度文章",
  "resources.cat.article_sub": "高质量教程与分析，适合想真正理解 Hermes 原理的用户",
  "resources.cat.github": "GitHub 精选",
  "resources.cat.github_sub": "社区维护的工具与资源集合，发现更多可能性",
  "resources.cat.community": "社区讨论",
  "resources.cat.community_sub": "真实用户的踩坑经验与技术讨论，遇到问题先看这里"
}
```

## SEO

- Page title: "Hermes Agent 资源导航 | Hermes Agent 中文指南"
- Meta description from i18n `resources.subtitle`
- All external links: `target="_blank" rel="noopener noreferrer"` (no nofollow — we're explicitly vouching for these)
- Canonical URL handled by existing `SEO.astro` component

## Out of Scope (v1)

- Tag-based filtering (add when resources exceed ~40)
- "Submit a resource" form
- Automated link checker
- Dark mode variant
