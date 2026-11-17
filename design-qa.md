# Design QA：股东权益公共标题

- Source visual truth: `/var/folders/py/18yf1bmx1w9f1z5fx19j4nm80000gn/T/codex-clipboard-fb0c1177-b889-4f22-9fae-0ef10431ef30.png`（问题截图），以及首页 `src/pages/index.vue` 的 `.section-title` 公共标题。
- Homepage reference capture: `/private/tmp/home-title-clean.png`
- Homepage focused crop: `/private/tmp/home-title-crop.png`
- Implementation screenshot: `/private/tmp/shareholder-title-clean.png`
- Implementation focused crop: `/private/tmp/shareholder-title-crop.png`
- Viewport: `912 × 1326` CSS px，`devicePixelRatio: 1`
- Source and implementation screenshots: `912 × 1326` px；无需密度归一化。
- Focused crops: `505 × 70` px。
- State: 简体中文、社区股东选中、默认价格；另验证了战略股东切换状态。

## Full-view comparison evidence

问题截图中的标题使用独立超宽底图和自定义左右向量，视觉宽度、装饰线与底座比例和首页公共标题不一致。修改后的浏览器截图使用首页同一组标题资源与内部尺寸，标题在 690px 内容区居中，和下方 690px 权益卡片同轴。

## Focused-region comparison evidence

首页标题与股东购买页标题的聚焦截图已在同一比较输入中核对。左右装饰、星形节点、中央底座、文字基线及整体高度一致，仅标题文案和所在页面背景不同。

## Findings

- 无剩余 P0、P1 或 P2 问题。
- 字体与排版：两页均为 32px、700 字重、1.15 行高，标题居中且不截断。
- 间距与布局：外框 690px，左右装饰各 170px，底座 540px 并距左 75px，和首页一致。
- 颜色与视觉变量：标题统一使用 `#ffdeb3`。
- 图片质量与资源一致性：直接复用首页 `index5.png`、`index6.png`、`index7.png`，未使用近似绘制。
- 文案：保留“股东权益”及多语言调用。

## Interaction and runtime checks

- 社区股东与战略股东切换正常，金额、席位和权益内容随状态更新。
- 最终生产构建通过。
- clean capture 后未发现由本次标题修改引入的控制台错误；现有项目存在与本次修改无关的 i18n 警告。

## Comparison history

1. P1：股东权益标题采用独立资源和布局，和首页公共标题比例不一致。
2. Fix：替换为首页同款 DOM 结构、图片资源和尺寸规则，并将容器对齐到页面 30px 左边距。
3. Post-fix evidence：聚焦截图中两页装饰线、底座和标题基线一致，无剩余 P0/P1/P2 差异。

final result: passed
