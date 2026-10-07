# 上线发布说明 · AI 助手设计稿（v1.1）

**目标站点**：https://geo.shangjiudistillery.cn
**待发布文件**：[design-preview.html](design-preview.html)（181 KB，单文件自包含）
**SHA-256**：见 [design-preview.html.sha256](design-preview.html.sha256)

---

## 一、为什么建议作为「预览页」发布，而不是替换首页

**这条是本文档最重要的一条。**

线上 `geo.shangjiudistillery.cn` 目前是一个 **React 单页应用**：

```
Server: nginx/1.24.0 (Ubuntu)
IP:     47.238.154.62
/assets/index-BOAkzukF.js      ← 线上平台的构建产物
/assets/index-Cph21x1F.css
```

而本次交付的 `design-preview.html` 是**高保真设计稿**，不是产品：

| 维度 | 线上平台 | 本设计稿 |
| --- | --- | --- |
| 数据 | 真实采集的品牌可见度数据 | 内置示例数据 |
| AI 回答 | 调用大模型真实生成 | **前端预设文案**（模拟流式） |
| 后端 | 有（诊断 / 采集 / 知识库） | 无，纯静态 |
| 登录鉴权 | 有 | 无 |
| 引用链接 | 真实来源 | 指向平台信源路由的占位 |

**如果把设计稿发布成 `index.html`，等于用一份静态样张替换掉正在服务的产品**：
真实用户会失去全部功能，且没有任何数据。因此本方案：

- 只发布到独立文件名 `design-preview.html`，**不触碰 `index.html`**
- 部署脚本内置硬性拦截：一旦远端文件名是 `index.html` 就直接拒绝执行
- 发布前后各记录一次 `index.html` 指纹，用来自证没有动过首页

正确的长期路径是**把设计集成进真实平台代码**（见第四节 C 方案），
而不是把设计稿当成站点。

---

## 二、一键部署（推荐）

需要具备到 `47.238.154.62` 的 SSH 访问权限。

```bash
cd deploy

# 1. 先干跑，确认路径与动作无误（不产生任何改动）
./deploy.sh ubuntu@47.238.154.62 /var/www/geo --dry-run

# 2. 正式发布
chmod +x deploy.sh
./deploy.sh ubuntu@47.238.154.62 /var/www/geo
```

> 远端目录请替换为线上站点的真实根目录（可用
> `ssh <user>@47.238.154.62 "grep -r root /etc/nginx/sites-enabled/ | head"` 确认）。

脚本做了五件事，都是为了「不可能伤到线上」：

1. **备份**：目标文件若已存在，先存为 `design-preview.html.bak-<时间戳>`
2. **原子发布**：先传 `.design-preview.html.tmp`，再 `mv` 替换 —— 用户不会拿到半个文件
3. **拒绝覆盖首页**：`REMOTE_NAME` 为 `index.html` 时直接报错退出
4. **发布后校验**：拉取线上内容算 SHA-256，与本地不一致即非零退出
5. **打印回滚命令**：出事一行退回

### 不需要改 nginx

因为只新增一个静态文件，nginx 会直接按静态文件返回，**无需新增 location 块**。
（如果站点根有 `try_files ... /index.html` 这类 SPA 兜底规则，
单文件路径也在其之前被静态匹配命中，不受影响。）

**唯一例外**：若 nginx 对 `\.html$` 做了强制跳转或缓存策略，可能需要
`location = /design-preview.html { try_files $uri =404; }`，并在最前面加：

```nginx
location = /design-preview.html { add_header Cache-Control "no-cache"; }
```

---

## 三、手动发布（不使用脚本时）

```bash
# 1. 上传
scp design-preview.html ubuntu@47.238.154.62:/tmp/design-preview.html

# 2. 备份 + 原子替换（远端执行）
ssh ubuntu@47.238.154.62 '
  set -e
  cd /var/www/geo
  [ -f design-preview.html ] && cp -p design-preview.html "design-preview.html.bak-$(date +%Y%m%d-%H%M%S)"
  mv /tmp/design-preview.html .
  ls -la design-preview.html
'

# 3. 校验（本地执行，须与 design-preview.html.sha256 一致）
curl -sS https://geo.shangjiudistillery.cn/design-preview.html | shasum -a256

# 4. 回滚（需要时）
ssh ubuntu@47.238.154.62 'cd /var/www/geo && mv -f design-preview.html.bak-<时间戳> design-preview.html'
```

---

## 四、三条可选路径（请择一确认）

### A. 预览发布（推荐，风险最低）
把设计稿作为 `geo.shangjiudistillery.cn/design-preview.html` 发布，
给客户/团队看效果，**线上产品完全不受影响**。需要 SSH 访问权限。

### B. 你们运维自己发布
我不接触服务器。你们把 `deploy/` 目录（含 `design-preview.html` 与校验和）拿走，
按上面的一键或手动流程执行即可。这样最符合生产变更的权责分离。

### C. 集成进真实平台（长期正确路径）
把设计落到 React 工程里作为一个路由（如 `/assistant`），复用线上真实的
诊断数据与 AI 接口。**需要平台源码** —— 本机没有该仓库，
请提供 Git 地址（或把它 clone 到本机），我可以：
- 把设计令牌（§2 色阶）落成 Tailwind theme / CSS 变量
- 把 `design-preview.html` 拆成 React 组件
- 把 Pretext 测量层移植为 hook，接真实 SSE 流式
- 保留 4 套验证（对比度门禁 / 交互 / 布局 / axe-core）作为 CI 门禁

---

## 五、发布后验收清单

```bash
URL=https://geo.shangjiudistillery.cn/design-preview.html

# 1. 可访问
curl -sS -o /dev/null -w "%{http_code}\n" "$URL"          # 期望 200

# 2. 内容一致
curl -sS "$URL" | shasum -a256                             # 与 .sha256 一致

# 3. 线上首页未被改动
curl -sS https://geo.shangjiudistillery.cn/ | head -c 200  # 应仍是 React SPA 的 <div id="root">
```

浏览器端确认（本交付物已通过 269 项自动化断言，此处为线上复核）：

- [ ] 页面加载后页脚显示 `Pretext v0.0.9 · 纯计算文本测量 N 次 · DOM 测量 0 次`
- [ ] 输入一句话，Enter 发送 → 应看到逐字流式；发送键变为「停止生成」
- [ ] 按 Esc → 出现「已停止生成」与「继续生成」
- [ ] 缩到 375px → 诊断面板收起为一行摘要，可点开
- [ ] 切深色主题 → 颜色正常
- [ ] `Ctrl/Cmd+P` 预览 → 应是「诊断报告」版式（有抬头、无输入区）

---

## 六、当前环境限制（如实记录）

| 事项 | 状态 | 证据 |
| --- | --- | --- |
| 到生产服务器的 SSH 凭据 | **无** | `~/.ssh` 只有 `known_hosts`，无私钥；无部署 CLI/令牌 |
| 服务器 22 端口 | 开放 | `nc -z 47.238.154.62 22` 成功 |
| GitHub 可达性 | **不可达** | `curl https://github.com` 15s 超时；`git ls-remote origin` 返回 `Empty reply from server` |
| 通用外网 | 正常 | npmjs 200、目标站点 200 |
| 平台源码 | **本机没有** | 全盘搜索无 GeoRecall 平台工程；仅有已构建的线上产物 |

因此：**推送（git push）与部署（deploy）目前都无法由我直接完成** ——
前者卡在网络，后者卡在凭据。需要你择一确认路径（第四节 A/B/C）。
