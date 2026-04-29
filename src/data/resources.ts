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
  iconSvg: string
  num: string
}

export const CATEGORY_CONFIG: Record<ResourceCategory, CategoryConfig> = {
  official: {
    accentColor: 'var(--tang)',
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
