# Resources Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/resources/` page (+ `/en/resources/` mirror) with 15 curated Hermes Agent resources in 5 categories, using the H industrial catalog design.

**Architecture:** Resource data lives in `src/data/resources.ts` as a typed TS array. A reusable `ResourceCard.astro` component renders each entry. Two thin page files (`resources.astro` / `en/resources.astro`) import MarketingLayout and render sections. i18n strings go through the existing `useT` system.

**Tech Stack:** Astro 5, TypeScript, existing theme tokens (`--tang`, `--paper`, `--ink`), IBM Plex Mono + Bricolage Grotesque (already loaded), inline SVG icons.

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `src/data/resources.ts` | Resource types + data array + category config |
| Create | `src/components/ResourceCard.astro` | Single resource card component |
| Create | `src/pages/resources.astro` | zh-CN resources page |
| Create | `src/pages/en/resources.astro` | en resources page |
| Create | `src/tests/unit/resources.test.ts` | Data integrity tests |
| Modify | `src/content/i18n/zh-CN.json` | Add resources.* + renumber nav |
| Modify | `src/content/i18n/en.json` | Add resources.* + renumber nav |
| Modify | `src/components/SiteNav.astro` | Insert resources nav link |

---

## Task 1: Create resource data file

**Files:**
- Create: `src/data/resources.ts`

- [ ] **Step 1: Write the file**

```typescript
// src/data/resources.ts

export type ResourceTag =
  | '官方' | '入口' | '文档' | '入门' | '必读' | '路线图' | '源码'
  | '视频' | '系统' | '英文' | '文章' | '深度' | '开发者' | '对比'
  | 'GitHub' | '精选' | '社区' | 'Reddit' | 'HN'

export type ResourceCategory = 'official' | 'video' | 'article' | 'github' | 'community'

export interface Resource {
  title: string
  url: string
  desc: string
  descEn: string
  tags: ResourceTag[]
  category: ResourceCategory
}

export const resources: Resource[] = [
  // ── 官方资源 ──
  {
    title: 'Hermes Agent 官网',
    url: 'https://hermes-agent.nousresearch.com/',
    desc: 'Nous Research 官方产品主页，了解 Hermes Agent 定位与核心能力的第一站。',
    descEn: 'Official product homepage by Nous Research — start here to understand what Hermes Agent is.',
    tags: ['官方', '入口'],
    category: 'official',
  },
  {
    title: '官方文档首页',
    url: 'https://hermes-agent.nousresearch.com/docs',
    desc: '涵盖安装、配置、技能、MCP、RL 训练的完整文档索引。',
    descEn: 'Complete documentation index covering installation, configuration, skills, MCP, and RL training.',
    tags: ['官方', '文档'],
    category: 'official',
  },
  {
    title: 'Quick Start',
    url: 'https://hermes-agent.nousresearch.com/docs/getting-started/quickstart',
    desc: '5 分钟从零跑起来的官方快速上手指南，新用户必读第一步。',
    descEn: 'Official quickstart guide — get Hermes Agent running in 5 minutes.',
    tags: ['官方', '入门', '必读'],
    category: 'official',
  },
  {
    title: 'Learning Path',
    url: 'https://hermes-agent.nousresearch.com/docs/getting-started/learning-path',
    desc: '从入门到高阶的官方分阶段学习路线，含各步预估时长。',
    descEn: 'Official phased learning roadmap from beginner to advanced, with estimated time per stage.',
    tags: ['官方', '路线图'],
    category: 'official',
  },
  {
    title: 'NousResearch/hermes-agent',
    url: 'https://github.com/NousResearch/hermes-agent',
    desc: '官方 GitHub 仓库，源码、Issue、贡献指南、Releases 全在这里。',
    descEn: 'Official GitHub repository — source code, issues, contribution guide, and releases.',
    tags: ['官方', '源码', 'GitHub'],
    category: 'official',
  },
  // ── 视频教程 ──
  {
    title: 'Hermes Full Course (2 Hours)',
    url: 'https://www.youtube.com/watch?v=8avW0D2sEn8',
    desc: '目前最完整的视频课，从安装到技能系统一次讲完，适合想系统学的用户。',
    descEn: 'The most comprehensive video course available — installation to skill system in 2 hours.',
    tags: ['视频', '系统', '英文'],
    category: 'video',
  },
  {
    title: 'Full Setup: Step-by-Step',
    url: 'https://www.youtube.com/watch?v=uycgV-eulGE',
    desc: '手把手安装配置全流程，适合第一次上手遇到卡点的用户。',
    descEn: 'Step-by-step installation and configuration walkthrough for first-time users.',
    tags: ['视频', '入门', '英文'],
    category: 'video',
  },
  {
    title: "The Ultimate Beginner's Guide",
    url: 'https://www.youtube.com/watch?v=CwPUOVUdApE',
    desc: '面向零基础新手，讲清楚「Hermes 是什么、能做什么、怎么开始」。',
    descEn: "For complete beginners — answers 'what is Hermes, what can it do, how do I start'.",
    tags: ['视频', '入门', '英文'],
    category: 'video',
  },
  // ── 深度文章 ──
  {
    title: 'DataCamp: Setup and Tutorial',
    url: 'https://www.datacamp.com/tutorial/hermes-agent',
    desc: 'DataCamp 出品的结构化安装教程，附代码示例，适合有编程背景的用户。',
    descEn: 'Structured setup tutorial by DataCamp with code examples — ideal for developers.',
    tags: ['文章', '入门', '英文'],
    category: 'article',
  },
  {
    title: 'Antigravity: The Agent That Grows',
    url: 'https://antigravity.codes/blog/hermes-agent-guide',
    desc: '开发者视角深度解读 Hermes 的记忆与技能机制，讲清楚它为什么与众不同。',
    descEn: "Developer-focused deep dive into Hermes' memory and skill mechanisms — explains what makes it different.",
    tags: ['文章', '深度', '英文'],
    category: 'article',
  },
  {
    title: 'Lushbinary: Developer Guide',
    url: 'https://lushbinary.com/blog/hermes-agent-developer-guide-setup-skills-self-improving-ai/',
    desc: '面向开发者的进阶指南，重点覆盖技能编写与自进化机制原理。',
    descEn: 'Advanced guide for developers focusing on skill authoring and self-improvement mechanics.',
    tags: ['文章', '开发者', '英文'],
    category: 'article',
  },
  {
    title: 'Hermes vs OpenClaw 深度对比',
    url: 'https://www.ai.cc/blogs/hermes-agent-2026-self-improving-open-source-ai-agent-vs-openclaw-guide/',
    desc: '系统对比 Hermes 与 OpenClaw 的架构差异，从 OpenClaw 迁移的必读参考。',
    descEn: 'Side-by-side comparison of Hermes and OpenClaw — essential reading before migrating.',
    tags: ['文章', '对比', '英文'],
    category: 'article',
  },
  // ── GitHub 精选 ──
  {
    title: 'awesome-hermes-agent',
    url: 'https://github.com/0xNyk/awesome-hermes-agent',
    desc: '社区维护的 Hermes 技能、工具、集成资源精选列表，持续更新。',
    descEn: 'Community-curated list of Hermes skills, tools, and integrations — continuously updated.',
    tags: ['GitHub', '精选', '社区'],
    category: 'github',
  },
  // ── 社区讨论 ──
  {
    title: 'Reddit: Complete Setup Guide',
    url: 'https://www.reddit.com/r/hermesagent/comments/1rt5syt/complete_hermes_agent_setup_guide/',
    desc: 'r/hermesagent 高质量安装指南帖，评论区有大量真实踩坑问答。',
    descEn: 'High-quality setup guide post on r/hermesagent with extensive real-world troubleshooting in comments.',
    tags: ['社区', 'Reddit', '入门'],
    category: 'community',
  },
  {
    title: 'HN: An Agent That Grows With You',
    url: 'https://news.ycombinator.com/item?id=47726913',
    desc: 'Hermes Agent 发布时的 Hacker News 讨论，技术社区对产品设计的深度探讨。',
    descEn: 'Hacker News launch thread — deep technical community discussion on product design.',
    tags: ['社区', 'HN', '深度'],
    category: 'community',
  },
]

export interface CategoryConfig {
  accentColor: string
  bgColor: string
  iconColor: string
  /** Inline SVG string (20×20) */
  iconSvg: string
  num: string
}

export const CATEGORY_CONFIG: Record<ResourceCategory, CategoryConfig> = {
  official: {
    accentColor: '#f5713a',
    bgColor: '#fff3ee',
    iconColor: '#c2410c',
    num: '01',
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
  },
  video: {
    accentColor: '#3b82f6',
    bgColor: '#eff6ff',
    iconColor: '#1d4ed8',
    num: '02',
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/></svg>`,
  },
  article: {
    accentColor: '#8b5cf6',
    bgColor: '#f5f3ff',
    iconColor: '#6d28d9',
    num: '03',
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  },
  github: {
    accentColor: '#52525b',
    bgColor: '#f4f4f5',
    iconColor: '#3f3f46',
    num: '04',
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
  },
  community: {
    accentColor: '#10b981',
    bgColor: '#ecfdf5',
    iconColor: '#065f46',
    num: '05',
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  },
}

export const RESOURCE_CATEGORIES: ResourceCategory[] = ['official', 'video', 'article', 'github', 'community']
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm check
```

Expected: no errors from `src/data/resources.ts`.

---

## Task 2: Write data integrity test

**Files:**
- Create: `src/tests/unit/resources.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
// src/tests/unit/resources.test.ts
import { describe, it, expect } from 'vitest'
import { resources, RESOURCE_CATEGORIES, CATEGORY_CONFIG } from '@/data/resources'

describe('resources data integrity', () => {
  it('every resource has required non-empty fields', () => {
    for (const r of resources) {
      expect(r.title.length, `title empty: ${JSON.stringify(r)}`).toBeGreaterThan(0)
      expect(r.url.length, `url empty: ${r.title}`).toBeGreaterThan(0)
      expect(r.desc.length, `desc empty: ${r.title}`).toBeGreaterThan(0)
      expect(r.descEn.length, `descEn empty: ${r.title}`).toBeGreaterThan(0)
      expect(r.tags.length, `tags empty: ${r.title}`).toBeGreaterThan(0)
    }
  })

  it('every resource url starts with https://', () => {
    for (const r of resources) {
      expect(r.url, `bad url: ${r.title}`).toMatch(/^https:\/\//)
    }
  })

  it('every resource has a valid category', () => {
    const valid = new Set(RESOURCE_CATEGORIES)
    for (const r of resources) {
      expect(valid.has(r.category), `invalid category "${r.category}" on: ${r.title}`).toBe(true)
    }
  })

  it('CATEGORY_CONFIG covers all categories', () => {
    for (const cat of RESOURCE_CATEGORIES) {
      expect(CATEGORY_CONFIG[cat], `missing config for: ${cat}`).toBeDefined()
      expect(CATEGORY_CONFIG[cat].iconSvg.length).toBeGreaterThan(0)
    }
  })

  it('total resource count is 15', () => {
    expect(resources).toHaveLength(15)
  })
})
```

- [ ] **Step 2: Run — expect FAIL (file not found)**

```bash
pnpm test -- resources
```

Expected: FAIL — `Cannot find module '@/data/resources'`

- [ ] **Step 3: Run again after Task 1 is done**

```bash
pnpm test -- resources
```

Expected: all 5 tests PASS.

- [ ] **Step 4: Commit**

```bash
git add src/data/resources.ts src/tests/unit/resources.test.ts
git commit -m "feat: 资源数据文件 + 完整性测试（15 条资源，5 分类）"
```

---

## Task 3: Add i18n keys + renumber nav

**Files:**
- Modify: `src/content/i18n/zh-CN.json`
- Modify: `src/content/i18n/en.json`

- [ ] **Step 1: Edit zh-CN.json**

Find the `"nav.migrate"` and `"nav.faq"` lines. Change their number prefix and add `nav.resources`:

```json
"nav.resources": "03 · 资源",
"nav.migrate": "04 · 迁移指南",
"nav.faq": "05 · FAQ",
```

Also add all `resources.*` keys (insert anywhere after nav keys):

```json
"resources.badge": "精选资源 · 持续更新",
"resources.h1": "Hermes Agent",
"resources.h1.em": "资源导航",
"resources.subtitle": "官方文档、视频教程、深度文章——精选全网最值得收藏的 Hermes Agent 学习资源，每条经过人工审核。",
"resources.stats.count": "精选资源",
"resources.stats.categories": "分类",
"resources.stats.review": "人工",
"resources.stats.review_label": "每条审核",
"resources.footer": "持续整理中 · 最近更新于 2026-04 · 每条经过人工审核",
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
```

- [ ] **Step 2: Edit en.json**

Same pattern:

```json
"nav.resources": "03 · Resources",
"nav.migrate": "04 · Migrate",
"nav.faq": "05 · FAQ",
```

```json
"resources.badge": "Curated · Continuously Updated",
"resources.h1": "Hermes Agent",
"resources.h1.em": "Resources",
"resources.subtitle": "Official docs, video tutorials, deep-dive articles — every resource hand-picked and reviewed.",
"resources.stats.count": "Resources",
"resources.stats.categories": "Categories",
"resources.stats.review": "Human",
"resources.stats.review_label": "Reviewed",
"resources.footer": "Continuously curated · Last updated April 2026 · Every entry reviewed",
"resources.cat.official": "Official",
"resources.cat.official_sub": "Hermes Agent official docs and repository — the authoritative source",
"resources.cat.video": "Video Tutorials",
"resources.cat.video_sub": "The fastest way to get started — follow along step by step",
"resources.cat.article": "In-Depth Articles",
"resources.cat.article_sub": "High-quality guides and analysis for users who want to understand Hermes deeply",
"resources.cat.github": "GitHub Picks",
"resources.cat.github_sub": "Community-maintained tools and resource lists",
"resources.cat.community": "Community",
"resources.cat.community_sub": "Real user experiences and technical discussions — check here when stuck"
```

- [ ] **Step 3: Verify no i18n key errors**

```bash
pnpm check
```

Expected: no warnings about missing keys.

- [ ] **Step 4: Commit**

```bash
git add src/content/i18n/zh-CN.json src/content/i18n/en.json
git commit -m "feat: i18n 添加 resources.* 键 + 导航重新编号（迁移 04，FAQ 05）"
```

---

## Task 4: Create ResourceCard component

**Files:**
- Create: `src/components/ResourceCard.astro`

- [ ] **Step 1: Write the component**

```astro
---
// src/components/ResourceCard.astro
import type { Resource } from '@/data/resources'

interface Props {
  resource: Resource
  locale: 'en' | 'zh-CN'
}

const { resource, locale } = Astro.props
const desc = locale === 'en' ? resource.descEn : resource.desc
---

<a
  href={resource.url}
  target="_blank"
  rel="noopener noreferrer"
  class="resource-card"
>
  <div class="card-top">
    <span class="card-title">{resource.title}</span>
    <svg class="card-ext" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M3 13L13 3M13 3H7M13 3v6"/>
    </svg>
  </div>
  <p class="card-desc">{desc}</p>
  <div class="card-tags">
    {resource.tags.map(tag => (
      <span class={`tag tag-${tag}`}>{tag}</span>
    ))}
  </div>
</a>

<style>
  .resource-card {
    background: #fff;
    border-radius: 3px;
    border: 1px solid var(--sand);
    border-top-width: 3px;
    padding: 18px 20px 16px;
    text-decoration: none;
    color: var(--ink);
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: 0 1px 3px rgba(43,43,46,.08), 0 4px 12px rgba(43,43,46,.04);
    transition: box-shadow .2s, transform .2s;
  }
  .resource-card:hover {
    box-shadow: 0 2px 8px rgba(43,43,46,.12), 0 8px 24px rgba(43,43,46,.08);
    transform: translateY(-1px);
  }
  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
  }
  .card-title {
    font-family: 'Bricolage Grotesque Variable', sans-serif;
    font-weight: 600;
    font-size: 15px;
    letter-spacing: -0.01em;
    line-height: 1.3;
    color: var(--ink);
  }
  .card-ext {
    flex-shrink: 0;
    color: var(--ink-faint);
    transition: color .15s;
  }
  .resource-card:hover .card-ext { color: var(--tang); }
  .card-desc {
    font-size: 13px;
    color: var(--ink-muted);
    line-height: 1.55;
    flex: 1;
  }
  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 4px;
  }
  /* ── Tag colors ── */
  .tag {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: .04em;
    padding: 2px 7px;
    border-radius: 2px;
    line-height: 1.6;
  }
  .tag-官方, .tag-入口, .tag-必读 { background: #fff3ee; color: #c2410c; }
  .tag-文档, .tag-路线图, .tag-系统 { background: #eff6ff; color: #1d4ed8; }
  .tag-源码, .tag-GitHub      { background: #f4f4f5; color: #52525b; }
  .tag-视频                   { background: #fef2f2; color: #b91c1c; }
  .tag-入门                   { background: #ecfdf5; color: #065f46; }
  .tag-英文                   { background: #fafaf9; color: #78716c; border: 1px solid #e7e5e4; }
  .tag-文章                   { background: #f5f3ff; color: #6d28d9; }
  .tag-开发者                 { background: #fff7ed; color: #c2410c; }
  .tag-对比                   { background: #fdf4ff; color: #7e22ce; }
  .tag-深度                   { background: #f5f3ff; color: #6d28d9; }
  .tag-精选                   { background: #fff3ee; color: #c2410c; }
  .tag-社区                   { background: #ecfdf5; color: #065f46; }
  .tag-Reddit                 { background: #fff7ed; color: #c2410c; }
  .tag-HN                     { background: #fff3ee; color: #c2410c; }
</style>
```

- [ ] **Step 2: Verify**

```bash
pnpm check
```

Expected: no component errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ResourceCard.astro
git commit -m "feat: ResourceCard 组件（标题/描述/标签/外链图标）"
```

---

## Task 5: Create zh-CN resources page

**Files:**
- Create: `src/pages/resources.astro`

- [ ] **Step 1: Write the page**

```astro
---
// src/pages/resources.astro
import MarketingLayout from '@/layouts/MarketingLayout.astro'
import ResourceCard from '@/components/ResourceCard.astro'
import { useT } from '@/lib/i18n'
import { detectLocale } from '@/lib/locale'
import { resources, RESOURCE_CATEGORIES, CATEGORY_CONFIG } from '@/data/resources'

const locale = detectLocale(Astro.url.pathname)
const t = useT(locale)

const totalCount = resources.length
const categoryCount = RESOURCE_CATEGORIES.length

const categoryCatKeys: Record<string, string> = {
  official: 'resources.cat.official',
  video: 'resources.cat.video',
  article: 'resources.cat.article',
  github: 'resources.cat.github',
  community: 'resources.cat.community',
}
const categorySubKeys: Record<string, string> = {
  official: 'resources.cat.official_sub',
  video: 'resources.cat.video_sub',
  article: 'resources.cat.article_sub',
  github: 'resources.cat.github_sub',
  community: 'resources.cat.community_sub',
}
---

<MarketingLayout
  title={`Hermes Agent ${t('resources.h1.em')} | Hermes Agent 中文指南`}
  description={t('resources.subtitle')}
  pathname={Astro.url.pathname}
>
  <!-- Hero -->
  <section class="resources-hero">
    <div class="hero-badge">
      <span class="badge-dot"></span>
      {t('resources.badge')}
    </div>
    <h1>
      {t('resources.h1')} <em>{t('resources.h1.em')}</em>
    </h1>
    <p class="hero-desc">{t('resources.subtitle')}</p>
    <div class="hero-stats">
      <div class="stat">
        <span class="stat-num accent">{totalCount}</span>
        <span class="stat-label">{t('resources.stats.count')}</span>
      </div>
      <div class="stat">
        <span class="stat-num">{categoryCount}</span>
        <span class="stat-label">{t('resources.stats.categories')}</span>
      </div>
      <div class="stat">
        <span class="stat-num">{t('resources.stats.review')}</span>
        <span class="stat-label">{t('resources.stats.review_label')}</span>
      </div>
    </div>
  </section>

  <!-- Category sections -->
  <main class="resources-main">
    {RESOURCE_CATEGORIES.map((cat, idx) => {
      const config = CATEGORY_CONFIG[cat]
      const catResources = resources.filter(r => r.category === cat)
      return (
        <section
          class="cat-section"
          style={`--cat-accent: ${config.accentColor}; --cat-bg: ${config.bgColor}; --cat-icon-color: ${config.iconColor};`}
        >
          <div class="section-divider">
            <div class="divider-line"></div>
            <span class="divider-num">{String(idx + 1).padStart(2, '0')} / {String(RESOURCE_CATEGORIES.length).padStart(2, '0')}</span>
            <div class="divider-line"></div>
          </div>
          <div class="cat-header">
            <div class="cat-icon" set:html={config.iconSvg} />
            <div>
              <h2 class="cat-title">{t(categoryCatKeys[cat])}</h2>
              <p class="cat-sub">{t(categorySubKeys[cat])}</p>
            </div>
          </div>
          <div class="cards-grid">
            {catResources.map(r => (
              <ResourceCard resource={r} locale={locale} />
            ))}
          </div>
        </section>
      )
    })}

    <footer class="resources-footer">
      <p class="footer-note">{t('resources.footer')}</p>
    </footer>
  </main>
</MarketingLayout>

<style>
  /* ── Hero ── */
  .resources-hero {
    padding: 72px 48px 48px;
    max-width: 960px;
    margin: 0 auto;
    border-bottom: 1px solid var(--sand);
  }
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--tang);
    border: 1px solid var(--tang);
    padding: 4px 10px;
    border-radius: 2px;
    margin-bottom: 24px;
  }
  .badge-dot {
    width: 6px; height: 6px;
    background: var(--tang);
    border-radius: 50%;
  }
  .resources-hero h1 {
    font-family: 'Bricolage Grotesque Variable', sans-serif;
    font-weight: 800;
    font-size: clamp(36px, 5vw, 56px);
    line-height: 1.05;
    letter-spacing: -.03em;
    color: var(--ink);
    margin-bottom: 20px;
    white-space: nowrap;
  }
  .resources-hero h1 em {
    font-style: normal;
    color: var(--tang);
  }
  .hero-desc {
    font-size: 16px;
    color: var(--ink-muted);
    line-height: 1.7;
    margin-bottom: 40px;
    white-space: nowrap;
  }
  .hero-stats {
    display: flex;
    gap: 40px;
  }
  .stat { display: flex; flex-direction: column; gap: 2px; }
  .stat-num {
    font-family: 'Bricolage Grotesque Variable', sans-serif;
    font-size: 36px;
    font-weight: 800;
    letter-spacing: -.04em;
    color: var(--ink);
    line-height: 1;
  }
  .stat-num.accent { color: var(--tang); }
  .stat-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: var(--ink-faint);
    letter-spacing: .05em;
    text-transform: uppercase;
  }

  /* ── Main ── */
  .resources-main {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 48px 96px;
  }

  /* ── Category section ── */
  .cat-section { padding-top: 40px; }

  .section-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
  }
  .divider-line { flex: 1; height: 1px; background: var(--sand); }
  .divider-num {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    color: var(--ink-faint);
    letter-spacing: .1em;
  }

  .cat-header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-top: 24px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--sand);
  }
  .cat-icon {
    width: 36px; height: 36px;
    border-radius: 3px;
    background: var(--cat-bg);
    color: var(--cat-icon-color);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cat-title {
    font-family: 'Bricolage Grotesque Variable', sans-serif;
    font-weight: 700;
    font-size: 20px;
    letter-spacing: -.02em;
    color: var(--ink);
    line-height: 1.2;
    margin-bottom: 2px;
  }
  .cat-sub {
    font-size: 13px;
    color: var(--ink-faint);
  }

  /* ── Cards grid ── */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  /* Apply category accent to cards inside this section */
  .cat-section :global(.resource-card) {
    border-top-color: var(--cat-accent);
  }

  /* ── Footer ── */
  .resources-footer {
    margin-top: 56px;
    padding-top: 20px;
    border-top: 1px solid var(--sand);
  }
  .footer-note {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: var(--ink-faint);
    letter-spacing: .04em;
  }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .resources-hero { padding: 48px 20px 32px; }
    .resources-main { padding: 0 20px 64px; }
    .cards-grid { grid-template-columns: 1fr; }
    .hero-stats { gap: 24px; }
    .resources-hero h1 { white-space: normal; font-size: 32px; }
    .hero-desc { white-space: normal; }
  }
</style>
```

- [ ] **Step 2: Run dev server and visually verify**

```bash
pnpm dev
```

Open http://localhost:4321/resources/ — check:
- Hero shows "Hermes Agent 资源导航" on one line
- Stats show 15 / 5 / 人工
- All 5 category sections render
- Cards show correct title, desc, tags
- External link icon visible on each card

- [ ] **Step 3: Commit**

```bash
git add src/pages/resources.astro
git commit -m "feat: 资源导航页 zh-CN（/resources/）"
```

---

## Task 6: Create en resources page

**Files:**
- Create: `src/pages/en/resources.astro`

- [ ] **Step 1: Write the page**

```astro
---
// src/pages/en/resources.astro
// Identical structure to resources.astro — locale detected as 'en' from pathname
---
<script>
  // Redirect handled by Astro — this file intentionally mirrors resources.astro
</script>
```

Actually — the page is identical to `resources.astro` in structure; `detectLocale` handles the rest. Write it as a near-copy:

```astro
---
// src/pages/en/resources.astro
import MarketingLayout from '@/layouts/MarketingLayout.astro'
import ResourceCard from '@/components/ResourceCard.astro'
import { useT } from '@/lib/i18n'
import { detectLocale } from '@/lib/locale'
import { resources, RESOURCE_CATEGORIES, CATEGORY_CONFIG } from '@/data/resources'

const locale = detectLocale(Astro.url.pathname)
const t = useT(locale)

const totalCount = resources.length
const categoryCount = RESOURCE_CATEGORIES.length

const categoryCatKeys: Record<string, string> = {
  official: 'resources.cat.official',
  video: 'resources.cat.video',
  article: 'resources.cat.article',
  github: 'resources.cat.github',
  community: 'resources.cat.community',
}
const categorySubKeys: Record<string, string> = {
  official: 'resources.cat.official_sub',
  video: 'resources.cat.video_sub',
  article: 'resources.cat.article_sub',
  github: 'resources.cat.github_sub',
  community: 'resources.cat.community_sub',
}
---

<MarketingLayout
  title={`Hermes Agent ${t('resources.h1.em')} | Hermes Agent Guide`}
  description={t('resources.subtitle')}
  pathname={Astro.url.pathname}
>
  <section class="resources-hero">
    <div class="hero-badge">
      <span class="badge-dot"></span>
      {t('resources.badge')}
    </div>
    <h1>{t('resources.h1')} <em>{t('resources.h1.em')}</em></h1>
    <p class="hero-desc">{t('resources.subtitle')}</p>
    <div class="hero-stats">
      <div class="stat">
        <span class="stat-num accent">{totalCount}</span>
        <span class="stat-label">{t('resources.stats.count')}</span>
      </div>
      <div class="stat">
        <span class="stat-num">{categoryCount}</span>
        <span class="stat-label">{t('resources.stats.categories')}</span>
      </div>
      <div class="stat">
        <span class="stat-num">{t('resources.stats.review')}</span>
        <span class="stat-label">{t('resources.stats.review_label')}</span>
      </div>
    </div>
  </section>

  <main class="resources-main">
    {RESOURCE_CATEGORIES.map((cat, idx) => {
      const config = CATEGORY_CONFIG[cat]
      const catResources = resources.filter(r => r.category === cat)
      return (
        <section
          class="cat-section"
          style={`--cat-accent: ${config.accentColor}; --cat-bg: ${config.bgColor}; --cat-icon-color: ${config.iconColor};`}
        >
          <div class="section-divider">
            <div class="divider-line"></div>
            <span class="divider-num">{String(idx + 1).padStart(2, '0')} / {String(RESOURCE_CATEGORIES.length).padStart(2, '0')}</span>
            <div class="divider-line"></div>
          </div>
          <div class="cat-header">
            <div class="cat-icon" set:html={config.iconSvg} />
            <div>
              <h2 class="cat-title">{t(categoryCatKeys[cat])}</h2>
              <p class="cat-sub">{t(categorySubKeys[cat])}</p>
            </div>
          </div>
          <div class="cards-grid">
            {catResources.map(r => (
              <ResourceCard resource={r} locale={locale} />
            ))}
          </div>
        </section>
      )
    })}
    <footer class="resources-footer">
      <p class="footer-note">{t('resources.footer')}</p>
    </footer>
  </main>
</MarketingLayout>

<style>
  /* identical styles — copy from resources.astro */
  .resources-hero { padding: 72px 48px 48px; max-width: 960px; margin: 0 auto; border-bottom: 1px solid var(--sand); }
  .hero-badge { display: inline-flex; align-items: center; gap: 6px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: var(--tang); border: 1px solid var(--tang); padding: 4px 10px; border-radius: 2px; margin-bottom: 24px; }
  .badge-dot { width: 6px; height: 6px; background: var(--tang); border-radius: 50%; }
  .resources-hero h1 { font-family: 'Bricolage Grotesque Variable', sans-serif; font-weight: 800; font-size: clamp(36px, 5vw, 56px); line-height: 1.05; letter-spacing: -.03em; color: var(--ink); margin-bottom: 20px; white-space: nowrap; }
  .resources-hero h1 em { font-style: normal; color: var(--tang); }
  .hero-desc { font-size: 16px; color: var(--ink-muted); line-height: 1.7; margin-bottom: 40px; white-space: nowrap; }
  .hero-stats { display: flex; gap: 40px; }
  .stat { display: flex; flex-direction: column; gap: 2px; }
  .stat-num { font-family: 'Bricolage Grotesque Variable', sans-serif; font-size: 36px; font-weight: 800; letter-spacing: -.04em; color: var(--ink); line-height: 1; }
  .stat-num.accent { color: var(--tang); }
  .stat-label { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--ink-faint); letter-spacing: .05em; text-transform: uppercase; }
  .resources-main { max-width: 960px; margin: 0 auto; padding: 0 48px 96px; }
  .cat-section { padding-top: 40px; }
  .section-divider { display: flex; align-items: center; gap: 12px; margin: 0; }
  .divider-line { flex: 1; height: 1px; background: var(--sand); }
  .divider-num { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--ink-faint); letter-spacing: .1em; }
  .cat-header { display: flex; align-items: flex-start; gap: 16px; margin-top: 24px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--sand); }
  .cat-icon { width: 36px; height: 36px; border-radius: 3px; background: var(--cat-bg); color: var(--cat-icon-color); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .cat-title { font-family: 'Bricolage Grotesque Variable', sans-serif; font-weight: 700; font-size: 20px; letter-spacing: -.02em; color: var(--ink); line-height: 1.2; margin-bottom: 2px; }
  .cat-sub { font-size: 13px; color: var(--ink-faint); }
  .cards-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .cat-section :global(.resource-card) { border-top-color: var(--cat-accent); }
  .resources-footer { margin-top: 56px; padding-top: 20px; border-top: 1px solid var(--sand); }
  .footer-note { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--ink-faint); letter-spacing: .04em; }
  @media (max-width: 640px) {
    .resources-hero { padding: 48px 20px 32px; }
    .resources-main { padding: 0 20px 64px; }
    .cards-grid { grid-template-columns: 1fr; }
    .hero-stats { gap: 24px; }
    .resources-hero h1 { white-space: normal; font-size: 32px; }
    .hero-desc { white-space: normal; }
  }
</style>
```

- [ ] **Step 2: Visually verify**

Open http://localhost:4321/en/resources/ — check:
- English i18n strings appear (badge, h1.em = "Resources", subtitle in English)
- Card descriptions in English
- Tag labels unchanged (they're design tokens, locale-neutral)

- [ ] **Step 3: Commit**

```bash
git add src/pages/en/resources.astro
git commit -m "feat: 资源导航页 en（/en/resources/）"
```

---

## Task 7: Update SiteNav

**Files:**
- Modify: `src/components/SiteNav.astro`

- [ ] **Step 1: Add resources link after the 7-days link**

In `SiteNav.astro`, find the `<li>` block with nav links. Insert the resources link after the 7-days entry:

```astro
<li><a href={lp('/resources/')}>{t('nav.resources')}</a></li>
```

The full `<ul>` should read:
```astro
<ul class="nav-links">
  <li><a href={lp('/#install')}>{t('nav.install')}</a></li>
  <li><a href={lp('/7-days/')}>{t('nav.7days')}</a></li>
  <li><a href={lp('/resources/')}>{t('nav.resources')}</a></li>
  <li><a href={lp('/migrate/')}>{t('nav.migrate')}</a></li>
  <li><a href={lp('/faq/')}>{t('nav.faq')}</a></li>
</ul>
```

- [ ] **Step 2: Verify nav renders and both pages accessible**

```bash
pnpm dev
```

Check:
- Nav shows 01 · 安装 / 02 · 七日教程 / 03 · 资源 / 04 · 迁移指南 / 05 · FAQ
- Clicking "03 · 资源" navigates to `/resources/`
- All other nav links still work

- [ ] **Step 3: Commit**

```bash
git add src/components/SiteNav.astro
git commit -m "feat: 导航栏加入资源链接（03 · 资源），迁移 04，FAQ 05"
```

---

## Task 8: Final checks + cleanup

- [ ] **Step 1: Run full type check**

```bash
pnpm check
```

Expected: 0 errors.

- [ ] **Step 2: Run all unit tests**

```bash
pnpm test
```

Expected: all tests pass including new `resources.test.ts`.

- [ ] **Step 3: Run build to confirm no build errors**

```bash
pnpm build
```

Expected: build completes without errors.

- [ ] **Step 4: Delete design preview file**

```bash
rm _design-preview-resources.html
```

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: 删除资源页设计预览文件"
```

---

## Self-Review

**Spec coverage check:**
- ✅ 15 resources with title/url/desc/descEn/tags/category → Task 1
- ✅ Data integrity tests → Task 2
- ✅ i18n keys for both locales + nav renumbering → Task 3
- ✅ ResourceCard component with all tag colors → Task 4
- ✅ zh-CN page at /resources/ → Task 5
- ✅ en page at /en/resources/ → Task 6
- ✅ SiteNav updated with renumbered links → Task 7
- ✅ Design tokens (padding-top: 40px, section-divider margin: 0) → Tasks 5/6
- ✅ `white-space: nowrap` on h1 and hero-desc → Tasks 5/6
- ✅ SVG icons per category → Task 1 (CATEGORY_CONFIG.iconSvg)
- ✅ `set:html` for icon SVG rendering → Tasks 5/6
- ✅ Responsive mobile layout → Tasks 5/6
- ✅ `rel="noopener noreferrer"` on all external links → Task 4
- ✅ Stats computed from data (not hardcoded) → Tasks 5/6
- ✅ Cleanup of preview file → Task 8

**No placeholder issues found. All code is complete.**
