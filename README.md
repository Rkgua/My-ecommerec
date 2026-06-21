# My E-Commerce

基于 Next.js 16 的全栈电商 / 内容管理平台，涵盖前台商城、后台管理和用户系统。

## 技术栈

| 类别     | 技术                                    |
| -------- | --------------------------------------- |
| 框架     | Next.js 16 (App Router) + React 19      |
| 语言     | TypeScript (strict)                     |
| 样式     | Tailwind CSS v4                         |
| 组件库   | shadcn/ui (Radix)                       |
| 数据库   | PostgreSQL (Neon)                       |
| ORM      | Prisma 6                                |
| 认证     | Auth.js v5 (JWT + OAuth)                |
| 状态管理 | Zustand                                 |
| 动画     | Framer Motion                           |
| 通知     | Sonner                                  |
| 主题     | next-themes                             |
| 测试     | Jest + Playwright                       |
| 代码质量 | ESLint + Prettier + Husky + lint-staged |

## 快速启动

```bash
# 安装依赖
npm install

# 配置环境变量（编辑 .env）
cp .env.example .env  # 或手动创建

# 同步数据库
npx prisma db push

# 填充测试数据
npx prisma db seed

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 测试账号

| 角色     | 邮箱                | 密码          |
| -------- | ------------------- | ------------- |
| 管理员   | `admin@example.com` | `password123` |
| 普通用户 | `user@example.com`  | `password123` |

管理员可增删改产品和分类；普通用户仅可浏览和下单。

## 项目结构

```
src/
├── app/                        # App Router 页面
│   ├── page.tsx                # / 产品管理后台
│   ├── layout.tsx              # 根布局（Header + Footer）
│   ├── Header.tsx              # 导航栏（购物车/用户/主题切换）
│   ├── shop/page.tsx           # /shop 商店首页（ISR 60s）
│   ├── products/[id]/page.tsx  # /products/:id 商品详情（SSG）
│   ├── cart/page.tsx           # /cart 购物车
│   ├── orders/page.tsx         # /orders 我的订单
│   ├── login/page.tsx          # /login 登录
│   ├── register/page.tsx       # /register 注册
│   ├── categories/page.tsx     # /categories 分类管理
│   └── api/                    # REST API
│       ├── products/           # 产品 CRUD
│       ├── categories/         # 分类 CRUD
│       ├── orders/             # 订单（需登录）
│       └── auth/               # 认证 + 注册
├── components/ui/              # shadcn/ui 组件
│   ├── button.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── select.tsx
│   └── table.tsx
├── lib/
│   ├── prisma.ts               # Prisma 客户端单例
│   ├── auth.ts                 # Auth.js 配置
│   ├── store.ts                # Zustand 购物车
│   ├── api.ts                  # 前端 API 封装
│   └── utils.ts                # cn() 工具函数
└── __tests__/                  # Jest 单元测试
prisma/
├── schema.prisma               # 数据模型
└── seed.ts                     # 种子数据
e2e/                            # Playwright E2E 测试
```

## 数据模型

```
User (id, email, name, password, role)
  │
  │ 1:N
  ▼
Order (id, total, status)
  │
  │ 1:N
  ▼
OrderItem (quantity, price)
  │
  │ N:1
  ▼
Product (name, description, price, stock, images)
  │
  │ N:1
  ▼
Category (name)
```

## API 端点

| 方法     | 端点                      | 认证   | 说明                         |
| -------- | ------------------------- | ------ | ---------------------------- |
| GET      | `/api/products`           | 无     | 产品列表（分页、搜索、筛选） |
| POST     | `/api/products`           | 管理员 | 创建产品                     |
| GET      | `/api/products/[id]`      | 无     | 产品详情                     |
| PUT      | `/api/products/[id]`      | 管理员 | 更新产品                     |
| DELETE   | `/api/products/[id]`      | 管理员 | 删除产品                     |
| GET      | `/api/categories`         | 无     | 分类列表                     |
| POST     | `/api/categories`         | 管理员 | 创建分类                     |
| PUT      | `/api/categories/[id]`    | 管理员 | 更新分类                     |
| DELETE   | `/api/categories/[id]`    | 管理员 | 删除分类                     |
| GET      | `/api/orders`             | 登录   | 用户订单列表                 |
| POST     | `/api/orders`             | 登录   | 创建订单                     |
| GET      | `/api/orders/[id]`        | 登录   | 订单详情                     |
| POST     | `/api/auth/register`      | 无     | 用户注册                     |
| GET/POST | `/api/auth/[...nextauth]` | —      | Auth.js 路由                 |

## 环境变量

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth（可选）
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

## 设计系统

- **颜色**：黑白灰为主色调，低饱和度灰蓝点缀
- **字体**：标题 Playfair Display (衬线)，正文 Geist (无衬线)
- **圆角**：统一 2px 微圆角
- **边框**：细边框替代重阴影
- **图片**：默认黑白滤镜 (`.img-bw`)
- **暗黑模式**：Header 一键切换

## 渲染策略

| 页面                         | 策略       | 说明                                         |
| ---------------------------- | ---------- | -------------------------------------------- |
| `/shop`                      | ISR (60s)  | 首页静态生成，60 秒增量更新                  |
| `/products/[id]`             | SSG + ISR  | 前 20 个构建时预渲染，其余 1 小时 revalidate |
| `/cart`、`/orders`、`/login` | 客户端渲染 | 交互密集，纯客户端                           |
| API 路由                     | 动态       | 服务端按需执行                               |

## 可用脚本

| 命令                  | 说明                |
| --------------------- | ------------------- |
| `npm run dev`         | 启动开发服务器      |
| `npm run build`       | 生产构建            |
| `npm start`           | 启动生产服务器      |
| `npm run lint`        | ESLint 检查         |
| `npm test`            | Jest 单元测试       |
| `npx playwright test` | Playwright E2E 测试 |
