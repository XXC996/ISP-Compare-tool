# ISP比较网站技术概述

## 项目概述

ISP比较网站是一个基于React的互联网服务提供商(ISP)和公用事业比较平台，为用户提供各种ISP计划的详细比较，帮助用户根据价格、速度、客户满意度等因素做出明智选择。项目支持多语言（英文和中文）并采用TypeScript提高代码质量和开发体验。

## 技术栈

### 前端技术

- **React 18**: 用于构建用户界面的JavaScript库
- **TypeScript**: 提供静态类型检查，增强代码质量和开发体验
- **i18next**: 国际化框架，支持多语言切换
- **FontAwesome**: 提供丰富的图标资源
- **CSS3**: 用于样式设计，实现响应式布局

### 国际化(i18n)实现

- **i18next**: 核心国际化框架
- **react-i18next**: React绑定库
- **i18next-browser-languagedetector**: 自动检测用户浏览器语言
- **i18next-http-backend**: 从服务器加载翻译文件

翻译文件位于`public/locales/`目录下，按语言代码分为不同文件夹：
- `en/translation.json`: 英文翻译
- `zh/translation.json`: 中文翻译

### 后端技术 (计划实现)

目前项目使用模拟数据，未来计划实现的后端技术包括：

- **Node.js/Python**: 服务器端开发
- **数据抓取系统**: 使用BeautifulSoup/Scrapy等Python库抓取ISP数据
- **RESTful API**: 为前端提供数据接口
- **数据库**: 存储ISP计划、价格和用户数据
- **用户认证**: 允许用户保存比较结果和个人偏好

## 组件结构

项目采用模块化组件设计，主要组件包括：

1. **Header**: 网站导航栏
2. **Hero**: 主页横幅
3. **Filters**: 筛选工具，允许用户按位置、速度、价格等筛选
4. **Comparison**: 显示ISP计划比较结果
5. **PlanCard**: 单个ISP计划详情卡片
6. **CompetitorTool**: 竞争对手价格比较工具
7. **Features**: 网站特色功能展示
8. **FAQ**: 常见问题解答
9. **Newsletter**: 邮件订阅
10. **Footer**: 网站页脚
11. **LanguageSwitcher**: 语言切换器

## 数据模型

TypeScript接口定义了项目中使用的主要数据结构：

```typescript
export interface ISPPlan {
  id: string;
  provider: string;
  name: string;
  price: number;
  speed: {
    download: number;
    upload: number;
  };
  data: string; // "Unlimited" 或 GB大小
  contract: number; // 合同月数，0表示无合同
  features: string[];
  rating: number;
  logoSrc: string;
  type: string;
  promoPrice?: string;
  typicalSpeed: number;
  setupFee: number;
  modem: string;
  yearCost: number;
  reviewCount: number;
  support?: string;
  languages?: string;
}
```

## 项目特色

1. **多语言支持**: 英文和中文语言支持，易于扩展其他语言
2. **类型安全**: 使用TypeScript提供类型检查，减少错误
3. **响应式设计**: 适配不同设备屏幕尺寸的用户友好界面
4. **动态过滤**: 根据用户偏好筛选ISP计划
5. **竞争对手工具**: 比较用户当前计划与市场上其他选项的价格和功能
6. **模块化结构**: 易于维护和扩展的代码组织

## 未来开发计划

1. **后端集成**: 开发实时数据API，替代模拟数据
2. **数据爬取系统**: 自动从ISP网站获取最新计划和价格
3. **用户认证**: 实现用户账户系统，保存比较结果
4. **高级筛选**: 增强筛选和排序功能
5. **数据可视化**: 添加图表和图形，使计划比较更直观
6. **AI推荐**: 基于用户使用模式和位置的个性化推荐

## 安装和运行

```bash
# 安装依赖
npm install

# 或使用脚本安装TypeScript依赖
./setup-typescript.sh

# 启动开发服务器
npm start
```

## 项目结构

```
react-isp-comparison/
├── public/
│   ├── locales/           # i18n翻译文件
│   │   ├── en/            # 英文翻译
│   │   └── zh/            # 中文翻译
├── src/
│   ├── components/        # React组件
│   ├── styles/            # CSS文件
│   ├── types/             # TypeScript类型定义
│   │   ├── index.ts       # 通用接口
│   │   └── declarations.d.ts # 模块声明
│   ├── i18n.ts            # i18n配置
│   ├── App.tsx            # 主应用组件
│   └── index.tsx          # 入口点
└── package.json           # 依赖和脚本
``` 