# 统计集成

Polyglow 为 Google Analytics 预留 Partytown 加载路径。默认状态下，不加载统计脚本。

## 启用条件

配置环境变量：

```bash
PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

配置后，`src/components/features/Analytics.astro` 输出 Google tag 脚本，并通过 Partytown 降低对主线程的影响。

## 默认关闭

未配置 `PUBLIC_GOOGLE_ANALYTICS_ID` 时：

- 不加载 `googletagmanager.com`。
- 不输出 Partytown 统计脚本。
- 本地开发、构建和部署不需要统计服务凭据。

## 部署平台

Cloudflare 部署时，在项目环境变量中添加 `PUBLIC_GOOGLE_ANALYTICS_ID`。GitHub Actions 或 Wrangler 本地部署同样读取该变量。

## 隐私说明

开源主题不默认收集访问数据。采用者启用统计后，需按自己的站点所在地法律和隐私政策处理告知、同意和数据保留。
