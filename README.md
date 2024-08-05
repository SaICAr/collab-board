# CollabBoard
这是一个实时协作白板，采用以下技术栈：
* Next.js
* TypeScript
* Tailwind CSS
* Clerk
* Convex 
* LiveBlocks
* ShadcnUI
# 已完成的功能
主要功能：
* Tailwind 设计打造时尚 UI
* 对所有设备的全面响应
* 利用 LiveBlocks 实现实时协作
* 集成 Clerk 和 Convex，对身份和数据进行验证
* 用户的授权、组织和邀请
* 带有文本、形状、便笺和铅笔的工具栏
* 基于 transform matrix 实现的图形缩放
* 图形的着色系统、分层功能、撤销和重做
* 收藏功能
* 自定义图片上传
* 支持 png/jpg/webp/svg 格式导出
* 使用 react-toast 处理服务器错误
* 在路由处理程序 (app/api) 中编写 POST、GET 和 DELETE 路由
* 在实时环境中处理服务器和子组件之间的关系
# Node 环境
Node version 20.x
# 快速开始
要开始使用这个项目，请按照以下步骤操作：
### 克隆项目到本地:
```
https://github.com/SaICAr/collab-board.git
```
### 安装依赖:
```
npm install
```
### 设置 .env.local
```
CONVEX_DEPLOYMENT=

NEXT_PUBLIC_CONVEX_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

CLERK_SECRET_KEY=

LIVEBLOCKS_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in

NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```
### Start the app
```
npm run dev
```
