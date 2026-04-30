这个是新手练手练习 会记录我整个开发过程的步骤和问题

这个项目是基于 Next.js + TypeScript + Tailwind CSS 的内容管理平台 类电商（CMS）

我将整个开发过程拆解为 6 个阶段性目标。你可以把这看作是一个产品开发的路线图。
本人所用软件 vscode+

## 🎯阶段一：环境搭建与技术选型 (基础建设)

先打好地基。这一步的目标是建立一个高起点、易维护的开发环境。

1.  初始化项目
2.  配置开发工具
    - 目标： 提升开发体验和代码质量。
    - 操作：
      - 配置 tsconfig.json 开启严格模式 (strict: true) 和路径别名 (@/\*)，方便导入文件。
      - 配置 Prettier 和 ESLint，确保团队代码风格一致。
      - 安装 Husky，在提交代码前自动运行检查。
      - 安装了vscode插件 ESLint+Prettier - Code formatter 保证 VS Code 自动格式化 自动检验提交代码是否规范
        (Prettier 负责让代码好看,ESLint 负责让代码正确,Husky 负责在你 git commit 时，自动调用前两者进行检查，确保只有“既好看又正确”的代码才能被提交)
3.  UI 框架深度集成
    - 目标： 建立设计系统，避免重复造轮子。
    - 操作： 除了 Tailwind CSS，引入一个组件库Shadcn/ui，实现“原子化”设计。
    - 关键点： 在 tailwind.config.js 中定义好你的品牌色、字体和间距，实现“原子化”设计。
      注意本项目使用的是 Tailwind CSS v4 这是一个非常新的版本 变化：在 v4 中，tailwind.config.js 不再需要了

## 阶段二：数据层与后端架构 (全栈核心)

这是区分“前端页面”和“全栈应用”的关键。你需要处理数据怎么存、怎么取。

1.  数据库设计与连接

- 目标： 设计商品、用户、订单的数据模型。
- 操作： 推荐使用 PostgreSQL (Neon 等云端数据)。
- 工具： 使用 Prisma 或 Drizzle ORM 作为数据库工具。Prisma 对 TypeScript 支持极好，能自动生成类型定义,安装dotenv(一个非常流行且实用的 Node.js 工具库),在Neon.tech(直接使用云数据库) 创建项目,创建一个名为 my-ecommerce-db 的项目,使用了Prisma(一个现代化的 数据库工具包，专门用于 Node.js 和 TypeScript 开发,是代码（TypeScript）和数据库（如 PostgreSQL）之间的“超级翻译官”和“管家)
- 完整的数据库初始化包括：
  - 完善的数据库模型 - 包含用户、产品、购物车、订单等完整电商系统所需的所有表
  - 数据库初始化脚本 - 在开发环境中添加示例数据
  - 数据库设置脚本 - 自动化数据库结构同步
  - API端点 - 用于触发数据库初始化
  - 包管理脚本 - 便于执行各种数据库

2. API 层构建
   - 目标： 实现前后端通信(连接前端界面和后端数据)。
   - 方案 A (传统 REST)： 使用 Next.js 的 Route Handlers (app/api/...) 编写 RESTful API。
     (其中app/api/products/[id]/route.ts中动态路由 (Dynamic Route) 的语法,/api/products/[id] -> 对应无数个可能的 URL)
     操作:api接口->把数据库的操作封装成 HTTP 接口
3. 模拟数据 (可选)
   - 目标： 如果不想一开始就搞定数据库，可以先用 JSON 文件或 Mock 服务（如 MSW）模拟商品数据，快速推进前端开发。

> [!WARNING]
> **数据库连接失败**
> 在 Neon.tech 创建数据库后，本地一直无法连接，且无法导入商品模型数据。
>
> - **原因**：Prisma 客户端版本过新，与当前 Node 环境存在兼容性冲突。
> - **解决**：将 `prisma` 和 `@prisma/client` 版本锁定为 `^6.19.2`。
>
> [!WARNING]
> **Git 提交被拦截 (Husky Error)**
> 执行 `git commit` 时报错：`lint-staged could not find any valid configuration`。
>
> - **原因**：`package.json` 中 `lint-staged` 配置项位置错误，未作为根属性存在。
> - **解决**：将配置移至 `package.json` 顶层，并确保格式为 `{ "lint-staged": { ... } }`。

> [!TIP]
> **ESLint 与 Prettier 冲突**
> 两者规则打架导致自动修复失效。记得配置vscode自动修复~
>
> - **解决**：引入 `eslint-config-prettier` 并在 `eslint.config.mjs` 数组的**最后一位**加载它，以覆盖格式化规则

## 🛍️ 阶段三：核心业务功能开发 (电商/CMS 逻辑)

这一步是实现“能用”的关键，重点在于交互逻辑。

# ----目前进行到

1.  商品/内容展示系统
    - 目标： 高效渲染列表和详情。
    - 操作：
      - 列表页： 实现分页、分类筛选、搜索功能。
      - 详情页： 使用 动态路由 (/product/[id])。
      - 性能： 利用 Next.js 的 组件实现图片懒加载和优化。
2.  购物车/状态管理
    - 目标： 处理复杂的全局状态。
    - 操作： 使用 Zustand (轻量级，推荐) 或 Redux Toolkit。
    - 关键点： 实现“添加购物车”、“数量增减”、“本地持久化”（刷新页面购物车不丢失）。
3.  用户认证与权限
    - 目标： 区分普通用户和管理员。
    - 操作： 集成 NextAuth.js (Auth.js) 实现登录注册（支持 GitHub/Google 登录）。
    - CMS 特性： 如果是 CMS，需要设计“只有管理员可见”的后台路由。

## ⚡ 阶段四：性能优化与用户体验 (进阶加分项)

这是让你的项目从“能跑”变成“优秀”的分水岭。

1.  渲染策略优化
    - 目标： 平衡 SEO 和实时性。
    - 操作：
      - 首页/商品列表： 使用 SSG (静态生成) 或 ISR (增量静态再生)，保证秒开和 SEO。
      - 购物车/个人中心： 使用 Client Component 或 SSR。
2.  交互体验打磨
    - 目标： 让应用感觉像原生 App 一样丝滑。
    - 操作： 使用 Framer Motion 添加页面转场动画、购物车侧边栏滑出效果、按钮点击反馈。
    - 反馈： 实现全局的 Toast 通知系统（例如“添加成功”提示）。
3.  响应式与暗黑模式
    - 目标： 适配所有设备和用户偏好。
    - 操作： 利用 Tailwind 的 md: lg: 前缀做移动端适配；使用 next-themes 实现一键切换暗黑模式。

## 🚀 阶段五：测试与部署 (工程化落地)

1.  测试
    - 目标： 保证核心功能不崩溃。
    - 操作： 使用 Jest + React Testing Library 编写单元测试（测试工具函数）；使用 Cypress 或 Playwright 进行端到端测试（模拟用户下单流程）。
2.  部署
    - 目标： 让全世界都能访问。
    - 操作： 将代码推送到 GitHub，连接 Vercel 进行自动部署。
    - 配置： 配置环境变量（数据库地址、API 密钥），设置域名。

技术栈清单
模块 使用技术 理由
核心框架 Next.js 15+ React 全栈框架的事实标准，App Router 是必学内容。
语言 TypeScript 类型安全，大型项目必备，能极大减少运行时错误。
样式 Tailwind CSS 原子化 CSS，开发速度极快，配合 Next.js 完美。
组件库 Shadcn/ui 目前最火的 React 组件库，代码拷贝即用，高度可定制。
状态管理 Zustand 比 Redux 更简单，比 Context 性能更好，适合购物车等场景。
数据库 ORM Prisma 对 TS 支持最好的 ORM，开发体验极佳。
数据请求 TanStack Query 处理服务端状态（缓存、加载、错误）的神器。
认证 NextAuth.js 支持多种登录方式，集成简单。
表单 React Hook Form 性能最好的表单库，配合 Zod 做验证。

不要一口气做完所有功能。建议按照 MVP (最小可行性产品) 的思路：

1.  先做一个静态的商品展示页（阶段一 + 阶段三的部分）。
2.  再接入数据库，让商品数据动态化（阶段二）。
3.  最后加入购物车和登录（阶段三 + 阶段四）。
