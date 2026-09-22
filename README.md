# locatorlab

一个轻量级的浏览器端元素定位调试工具，用于调试 CSS Selector、XPath，并生成 Playwright 定位代码。

<img width="2880" height="1462" alt="image" src="https://github.com/user-attachments/assets/35dd79e2-4417-47cf-93cb-c5553feb6054" />


## 功能

- CSS Selector 调试
- XPath 调试
- 可视化点选页面元素
- HTML 格式化与预览
- 自动生成 Playwright Locator、Wait、Click、Role 写法
- 查看元素文本、属性、DOM 路径与源码
- 支持匹配结果高亮、锁定与上下跳转
- 支持 HTML 文件上传
- 支持明暗主题切换
- 支持中英文界面

## 使用方式

无需安装依赖，也无需启动后端服务。

直接使用浏览器打开 `index.html` 即可。

使用流程：

1. 粘贴 HTML 源码，或上传 `.html`、`.htm`、`.txt` 文件
2. 输入 CSS Selector 或 XPath 进行匹配
3. 查看命中数量与匹配元素
4. 点击结果查看对应 DOM 位置
5. 复制 CSS、XPath 或 Playwright 定位代码
6. 也可以进入可视化点选模式，直接点击页面元素生成选择器

## 使用示例

CSS Selector：

```css
.container > button.submit
```

XPath：

```xpath
//button[@type='submit']
```

对应的 Playwright 定位代码示例：

```python
page.locator(".container > button.submit")
```

XPath 示例：

```python
page.locator("xpath=//button[@type='submit']")
```

## 技术说明

locatorlab 是一个纯前端单文件工具，主要使用：

- HTML
- CSS
- JavaScript
- CodeMirror 5

项目不依赖 Node.js、Python 或其他后端环境，可以直接在浏览器本地运行。

## 项目结构

```text
locatorlab/
├─ index.html
├─ README.md
```

## 更新记录

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

`v1.5.9`
