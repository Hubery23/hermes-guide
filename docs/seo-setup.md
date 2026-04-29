# SEO 站外接入操作手册

> 适用站点：hermesagentguide.online（Cloudflare Pages 托管）  
> 预计总耗时：40 分钟  
> 执行顺序：GSC → Bing → CF Analytics（Bing 可从 GSC 一键导入，必须先做 GSC）

---

## 第一步：Google Search Console（GSC）

**目的**：让 Google 知道你的站存在，拿到爬虫日志、索引覆盖率、关键词 CTR。

### 1.1 添加站点

1. 打开 https://search.google.com/search-console
2. 左上角点 **"Add property"**
3. 选 **Domain**（不是 URL prefix），填写：
   ```
   hermesagentguide.online
   ```
4. 点 **Continue**，页面会给你一段 TXT 记录，形如：
   ```
   google-site-verification=xxxxxxxxxxxxxxxxx
   ```
   **先复制这段值，不要关闭页面。**

### 1.2 在 Cloudflare DNS 添加验证记录

1. 打开 https://dash.cloudflare.com → 选择 `hermesagentguide.online` 域名
2. 左侧菜单 → **DNS** → **Records**
3. 点 **Add record**，填写：
   - Type：`TXT`
   - Name：`@`（代表根域名）
   - Content：粘贴上一步复制的 google-site-verification 值
   - TTL：Auto
4. 点 **Save**

### 1.3 回到 GSC 验证

1. 回到 GSC 页面，点 **Verify**
2. 通常 1 分钟内通过（DNS 传播很快）
3. 验证通过后进入 GSC 控制台

### 1.4 提交 Sitemap

1. 左侧菜单 → **Sitemaps**
2. 在输入框填写：
   ```
   https://hermesagentguide.online/sitemap-index.xml
   ```
3. 点 **Submit**，状态变为 "Success" 即可

### 1.5 请求首批收录（加速）

1. 左侧菜单 → **URL Inspection**
2. 搜索框输入 `https://hermesagentguide.online`，按回车
3. 右上角点 **Request Indexing**（需等几秒）
4. 重复对 `https://hermesagentguide.online/faq/` 也做一次

> **后续看什么**：48 小时后看 Coverage（有没有被索引）；7 天后看 Performance（关键词点击）。

---

## 第二步：Bing Webmaster Tools

**目的**：覆盖 ChatGPT search、DuckDuckGo、Brave Search——它们都走 Bing 索引。

### 2.1 从 GSC 一键导入（最省事）

1. 打开 https://www.bing.com/webmasters
2. 用微软账号登录（没有就注册一个，30 秒）
3. 首页会出现 **"Import from Google Search Console"** 选项
4. 点击后授权 Google 账号，Bing 自动导入你的站点 + 已验证状态
5. 导入完成后无需重新验证域名

> 如果找不到导入入口，走手动流程：左上 "Add a site" → 填 `https://hermesagentguide.online` → 选 XML 验证方式 → 把验证文件放到 `public/` 目录重新部署。

### 2.2 提交 Sitemap

1. 左侧菜单 → **Sitemaps**
2. 填写：
   ```
   https://hermesagentguide.online/sitemap-index.xml
   ```
3. 点 **Submit**

### 2.3 开启 IndexNow（选做，推荐）

IndexNow 协议：页面更新后自动 ping Bing，几分钟内重爬（vs. 默认等几天）。

1. 左侧菜单 → **IndexNow**
2. 点 **Get Started**，Bing 会生成一个 API Key 文件（形如 `abcd1234.txt`）
3. 把这个文件放到项目 `public/` 目录，重新部署（让 `https://hermesagentguide.online/abcd1234.txt` 可以访问）
4. 回到 Bing，点 **Verify**
5. 以后每次发新内容，Bing 这边都会自动发现

> IndexNow 也可以后续配合 Cloudflare Functions 自动推送，暂时手动够用。

---

## 第三步：Cloudflare Web Analytics

**目的**：流量分析，零 JS 性能开销，不需要 GDPR cookie 弹窗。

### 3.1 开启

1. 打开 https://dash.cloudflare.com
2. 左侧菜单 → **Analytics & Logs** → **Web Analytics**
3. 点 **Add a site**
4. 填写 `hermesagentguide.online`

### 3.2 选择接入方式

站点已托管在 Cloudflare Pages，选 **Automatic setup**：

- Cloudflare 直接在 CDN 层注入 beacon，无需改代码
- 不影响页面 HTML，LCP 不受影响

点 **Done**。

### 3.3 等数据

- 24 小时后有第一波数据
- 可以看：页面浏览量、访客数、Top 页面、国家分布、Referrer 来源

> 如果选了 Automatic setup 后看不到数据，检查该域名的 Cloudflare 代理是否开启（DNS 记录上的橙色云图标）。CF Pages 默认开，正常不会有问题。

---

## 完成核对清单

- [ ] GSC：域名 property 验证通过
- [ ] GSC：sitemap 提交，状态为 Success
- [ ] GSC：首页 + FAQ 手动请求收录
- [ ] Bing：站点从 GSC 导入成功
- [ ] Bing：sitemap 提交
- [ ] Bing：IndexNow 验证通过（可选）
- [ ] CF Analytics：Automatic setup 开启

三步全做完，SEO 基础设施就建好了。后续定期（每周一次）看 GSC Performance 报告，追踪关键词排名变化。
