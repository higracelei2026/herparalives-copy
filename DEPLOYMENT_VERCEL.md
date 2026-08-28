# Vercel 部署与 Coach 环境变量配置

本说明面向把仓库推到 GitHub、再导入 Vercel 部署的场景。主要覆盖两件事：跨平台构建失败的修复，以及动态 Life Coach 所需的环境变量。

## 一、部署失败的根因与修复

Vercel 的构建机是 Linux（默认 Node 20 / 22 与 pnpm），而项目最初的两个配置只允许 Windows 运行，导致 `pnpm install` 后 `next build` 必然失败。修复涉及两个文件，均已改好提交：

| 文件 | 问题 | 修复 |
|---|---|---|
| `pnpm-workspace.yaml` | 写死了 `supportedArchitectures: os=[win32], cpu=[x64]`，Linux 上安装会跳过 Next 原生二进制 | 删除该字段，只保留 `packages: ["."]` |
| `package.json` | 把 Windows 专属的 `@next/swc-win32-x64-msvc` 放进 `dependencies`，且 `typescript`、`@types/*` 错放在 `dependencies` | 移除 Win 二进制；把 `typescript` 与 `@types/*` 移到 `devDependencies` |

改完后务必删除本地旧的 `pnpm-lock.yaml` 再重新生成一份（旧锁文件里固化了 Windows 平台的解析结果），否则锁文件仍会把安装卡在 win32。检查方法：锁文件里若出现 `@next/swc-win32-x64-msvc` 且没有 `@next/swc-linux-x64-gnu`，就说明还是旧版，需要重新生成。

## 二、在 Vercel 导入项目

1. 把项目推送到 GitHub（务必把上述两个修复、以及 `server/coach-prompt.ts`、`lib/coach-digest.ts`、`app/api/coach/[runId]/route.ts`、改过的 `app/ending/[runId]/page.tsx`、`app/globals.css` 都纳入提交）。
2. 在 Vercel 新建 Project → Import Git Repository → 选择该仓库。
3. Framework Preset 选 **Next.js**（Vercel 会自动识别）。检测到 `pnpm-lock.yaml` 后会使用 pnpm 安装。
4. Build Command 留空（默认 `next build`），Install Command 留空（默认 `pnpm install`）。Node Version 建议 20.x 或 22.x。

> 注意：Vercel 用 Linux 构建，务必确认仓库根目录的 `pnpm-workspace.yaml` 已按第一节修复，且 `pnpm-lock.yaml` 是重新生成过的。这两点是先前部署失败的根源。

## 三、配置 Coach 环境变量

动态 Coach 路由 `app/api/coach/[runId]/route.ts` 只读取两个服务端环境变量：

| 变量 | 必填 | 说明 | 在 Vercel 里的配置位置 |
|---|---|---|---|
| `DASHSCOPE_API_KEY` | 是 | 阿里云百炼（DashScope）的 API Key。有它才会真正调用 Qwen 生成动态 Coach | 没有它，Coach 会自动降级为预设文案（页面会提示"未接入实时分析"），Demo 仍可正常跑 |
| `QWEN_STRUCTURED_MODEL` | 否 | 指定使用的 Qwen 模型名；不填时默认 `qwen-plus` | 可选，填了就用你指定的模型 |

配置步骤：

1. 在 Vercel 项目页进入 **Settings → Environment Variables**。
2. 添加 `DASHSCOPE_API_KEY`，Environment 勾选 Production 与 Preview；值为你在百炼控制台创建的 API Key（形如 `sk-...`）。
3. 如需指定模型，再加 `QWEN_STRUCTURED_MODEL`。
4. 回到 **Deployments**，点最上方一行右侧的 **⋯ → Redeploy**，让新环境变量随下一次构建生效。
5. 验证：完成一局 5 章剧情后进入结局页，若能见到"Coach 正在回望这一路的选择…"随后显示与固定文案不同的内容，即说明动态 Coach 已启用。

密钥安全：这两个变量都不带 `NEXT_PUBLIC_` 前缀，只存在于服务端，不会泄露到浏览器。切勿把它们写进 `NEXT_PUBLIC_*` 变量或在客户端代码里引用。

## 四、环境变量与声音密钥的约定

项目里其余的 AI / 云服务密钥（百炼故事生成、图片、CloudBase 等）也遵循同一约定：只进服务端环境变量，避免 `NEXT_PUBLIC_` 前缀。`.env.example` 列出了所有可选键，Vercel 上只填你要启用的即可，未填写时会自动使用安全降级路径（预设内容始终可玩）。

## 五、部署后验收

- `GET /` 与角色大厅可正常进入五个预设角色。
- 走完一章后能进入下一章；走完第五章进入结局页。
- 结局页保留原有动作：换一句、保存到图鉴、下载卡片、展开人生地图、再走一条平行线路。
- 已配置 `DASHSCOPE_API_KEY` 时，三条观察与金句基于本局真实选择生成；未配置时显示预设文案与降级提示，功能不受影响。