# locatorlab

一个轻量级的网页元素定位调试工具，用于分析 HTML、调试 CSS Selector / XPath、生成 Playwright 定位代码，并支持通过 AI 对定位表达式进行优化。

<img width="2880" height="1462" alt="LocatorLab" src="https://github.com/user-attachments/assets/35dd79e2-4417-47cf-93cb-c5553feb6054" />

## 功能

- CSS Selector 调试与实时匹配
- XPath 调试与实时匹配
- 可视化点选页面元素并自动生成定位
- 自动生成 CSS、XPath 与 Playwright 写法
- 生成 Playwright Locator、Wait、Click、Role 等常用代码
- 查看元素文本、属性、DOM 路径与源码
- 支持匹配结果高亮、锁定、预览与上下跳转
- 支持 HTML 文件上传
- 支持 HTML 格式化与源码查看
- 支持明暗主题切换
- 支持中英文界面
- 支持 AI 优化 CSS / XPath 定位

## AI 定位

v1.6.0 新增 AI 辅助定位。

普通定位结果默认仍由本地规则生成，不会自动调用 AI。每条 CSS / XPath 定位右侧提供独立的 **AI** 按钮，需要时再请求 AI 优化，再次点击可恢复本地定位结果。

AI 定位流程：

1. 根据当前元素整理标签、文本、属性、元素 HTML 与附近 HTML
2. 调用后端 `/api/ai-locator`
3. 由 DeepSeek 返回 CSS / XPath 候选
4. 浏览器在当前 HTML 中重新验证候选
5. 只有能够唯一命中当前元素的候选才会被采用

AI 只是辅助生成定位，最终结果仍建议在真实目标页面中验证。

## 使用方式

### 方式一：仅使用本地定位

如果只使用 CSS、XPath、可视化点选和 Playwright 代码生成功能，可以直接使用浏览器打开：

```text
index.html
```

CodeMirror 通过 CDN 加载，因此格式化代码视图需要能够访问对应 CDN 资源。

### 方式二：启用 AI 定位

AI 功能需要启动 FastAPI 后端。

#### 1. 安装依赖

```bash
pip install -r backend/requirements.txt
```

#### 2. 配置环境变量

复制：

```text
.env.example
```

为：

```text
.env
```

填写 DeepSeek 配置：

```env
DEEPSEEK_API_KEY=your_api_key
DEEPSEEK_MODEL=deepseek-flash
```

`DEEPSEEK_MODEL` 可不填写，程序默认使用 `deepseek-flash`。

#### 3. 启动服务

在项目根目录执行：

```bash
uvicorn backend.main:app --reload
```

然后访问：

```text
http://127.0.0.1:8000
```

健康检查：

```text
GET /api/health
```

AI 定位接口：

```text
POST /api/ai-locator
```

## 基本使用流程

1. 粘贴 HTML 源码，或上传 `.html`、`.htm`、`.txt` 文件
2. 输入 CSS Selector 或 XPath 进行匹配
3. 查看命中数量与匹配元素
4. 悬停结果进行预览，点击结果锁定元素
5. 复制 CSS、XPath 或 Playwright 定位代码
6. 也可以进入可视化点选模式，直接点击页面元素生成定位
7. 如需进一步优化某条 CSS / XPath，点击对应定位右侧的 **AI** 按钮

可视化点选生成的定位会直接展示在结果区域，不会自动覆盖手动输入的 CSS / XPath 测试条件。

## 使用示例

CSS Selector：

```css
.container > button.submit
```

XPath：

```xpath
//button[@type='submit']
```

Playwright CSS Locator：

```python
page.locator(".container > button.submit")
```

Playwright XPath Locator：

```python
page.locator("xpath=//button[@type='submit']")
```

## 预览说明

预览区域主要用于调试静态 HTML 快照。

- 页面脚本不会执行
- 外部资源会受到限制，避免预览内容影响工具本身
- 动态生成的页面内容需要先获取渲染后的 HTML
- Playwright Role 等定位属于参考写法，复制后仍应在目标页面验证

## 技术栈

### 前端

- HTML
- CSS
- JavaScript
- CodeMirror 5

### 后端

- Python
- FastAPI
- Uvicorn
- OpenAI Python SDK
- DeepSeek API
- python-dotenv

## 项目结构

```text
locatorlab/
├─ backend/
│  ├─ ai_locator.py
│  ├─ main.py
│  └─ requirements.txt
├─ .env.example
├─ .gitignore
├─ favicon.png
├─ index.html
└─ README.md
```

## 更新记录

### v1.6.0

- 新增 DeepSeek AI 辅助元素定位
- CSS / XPath 定位支持独立 AI 优化与本地结果切换
- AI 请求改为按需触发，不影响普通定位流程
- AI 返回候选会在当前 HTML 中重新验证，仅采用唯一命中当前元素的结果
- 新增 FastAPI 后端与 `/api/ai-locator` 接口
- 新增 `/api/health` 健康检查接口
- 新增 `.env` 环境变量配置方式
- 优化可视化点选逻辑，不再覆盖手动 CSS / XPath 测试输入
- 修复上传 HTML 后刷新与预览同步问题
- 加强预览区域资源限制与安全处理

### v1.5.9

- 修复 XPath 生成 Playwright Locator 时的兼容问题
- 修复预览模式事件重复绑定问题
- 修复预览工具自身样式对选择器匹配结果的干扰
- 优化 Playwright Role 定位名称生成
- 优化复制结果状态提示
- 合并重复的 CSS / XPath 选择器生成逻辑
- 优化大量匹配结果时的 DOM 渲染性能
- 统一项目名称为 `locatorlab`

## 当前版本

`v1.6.0`

## 作者

WenYang
