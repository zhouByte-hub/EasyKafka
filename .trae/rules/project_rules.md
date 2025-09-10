项目名称：**EasyKafka**
定位：一款面向开发者与运维人员的现代化、图形化 Apache Kafka 客户端工具（桌面端APP），主打“零门槛上手、功能全面、界面美观、监控直观”。
核心理念：让 Kafka 的使用像呼吸一样简单、让使用者对UI存在一种强烈的科技认可感。

关键提示词：你是一名优秀的全栈开发工程师，对于前后端的技术都非常精通，熟悉 React、TypeScript、Material-UI 等前端技术，熟悉 Rust、SQLite、Kafka 等后端技术，熟悉 tauro 2.0 等跨平台技术；对于陌生的技术栈，你可以通过阅读官网快速的分析学习并在项目中使用。

**使用的技术栈：**
- 前端：
  - Vue3
  - TypeScript
  - ElementPlus 
  - naive UI库（https://www.naiveui.com/zh-CN/os-theme）
  - themedevhub 图标库（https://www.themedevhub.com/）
  - echarts（https://echarts.apache.org/zh/index.html）
  - 等其他流行的前端UI库、组件库
- 后端：Rust
- 数据库：SQLite
- 消息队列：Kafka
- 前后端整合：tauri 2.0
  
**官网：**
 - tauri 2.0 官网：https://tauri.app/zh-cn/

## 一、核心目标
- 降低 Kafka 使用门槛：无需记忆复杂命令，通过图形界面完成常用操作。
- 功能覆盖全面：支持生产、消费、主题管理、集群监控、指标可视化等核心场景。
- 极致用户体验：界面现代美观、富有科技感，支持明暗双主题，操作流畅直观。
- 实时监控与洞察：内置仪表盘，图形化展示 Kafka 集群关键指标，辅助性能调优与故障排查。

## 二、UI/UX 需求
1. 主题系统
✅ 支持 Light（明亮） 和 Dark（暗黑） 两种主题。
✅ 提供主题切换开关（Toggle），位于应用右上角或设置菜单中。
✅ 切换主题时需平滑过渡，无闪烁或布局错乱。
✅ 主题需覆盖所有界面元素：背景、文字、按钮、图表、边框、图标等。
✅ 支持“跟随系统主题”自动切换（可选加分项）。
2. 界面风格
🎨 设计风格：现代、科技、专业。

## 三、核心功能模块
1. 集群连接管理
✅ 支持多集群配置保存（名称、Bootstrap Servers、SASL/SSL 配置、超时设置等）。
✅ 支持测试连接 & 连接状态指示（✅/❌）。
✅ 支持快速切换当前操作集群。
2. 主题（Topic）管理
✅ 查看所有 Topic 列表（名称、分区数、副本数、配置等）。
✅ 创建新 Topic（指定分区、副本、配置）。
✅ 删除 Topic（需二次确认）。
✅ 查看/编辑 Topic 配置（如 retention.ms, cleanup.policy）。
✅ 查看 Topic 分区分布与 Leader 信息。
3. 消息生产者（Producer）
✅ 指定 Topic + 可选 Key + Value（支持纯文本、JSON、AVRO、Protobuf 格式高亮）。
✅ 支持自定义 Headers。
✅ 支持批量发送 & 延迟发送。
✅ 发送历史记录（本地缓存最近 N 条）。
✅ 发送成功/失败 Toast 提示 + 详细日志。
4. 消息消费者（Consumer）
✅ 支持从指定 Topic + Partition + Offset 开始消费。
✅ 支持消费指定数量或持续监听。
✅ 消息列表展示（Key, Value, Offset, Timestamp, Headers, Partition）。
✅ 支持按关键字/正则过滤消息。
✅ 支持消息格式自动识别与美化（JSON 格式化、Base64 解码等）。
✅ 支持暂停/继续消费。
✅ 支持定时的监听消息的消费（实时消费）。
5. 消费者组（Consumer Group）管理
✅ 查看所有 Consumer Group 列表。
✅ 查看 Group 成员、分配的分区、当前 Offset、Lag。
✅ 支持重置 Offset（到最早、最新、指定时间、指定 Offset）。
✅ 支持删除 Consumer Group（谨慎操作，需确认）。

**对于上述功能可能设计的不够完整，你还可以参考市面上流行的组件进行合理的分析给出完整的功能需求。**

## 四、监控与可视化
1. 集群概览仪表盘（Dashboard）
✅ 实时显示以下核心指标图表（折线图/柱状图）：
    - 集群 Broker 数量 & 在线状态
    - 总 Topic 数 / 总 Partition 数
    - 全局每秒生产消息数（Msg/s）
    - 全局每秒消费消息数（Msg/s）
    - 平均消息大小
    - 总 Lag（所有 Consumer Group 滞后总和）
    - 磁盘使用总量 & 增长趋势
    - 网络 I/O 吞吐量（In/Out）
2. Topic 级监控
✅ 选定 Topic 后，显示该 Topic 专属监控：
    - 每个 Partition 的生产/消费速率（Msg/s）
    - 每个 Partition 的当前 Offset 与 Lag
    - 消息大小分布
    - 分区 Leader 分布热力图
3. Consumer Group 级监控
✅ 选定 Group 后，显示：
    - 每个 Consumer 成员的消费速率（Msg/s）
    - 各 Partition Lag 变化趋势图
    - 重平衡（Rebalance）事件日志
4. 图表交互
✅ 支持时间范围选择（Last 5m, 15m, 1h, 6h, 24h, Custom）。
✅ 支持图表缩放、悬停查看数值。
✅ 支持导出图表为 PNG / CSV。
✅ 图表配色需适配明暗主题。

**对于上述功能可能设计的不够完整，你还可以参考市面上流行的组件进行合理的分析给出完整的功能需求。**

## 五、其他功能
✅ 全局搜索（快速跳转到 Topic / Group）。
✅ 操作日志面板（记录用户关键操作）。
✅ 支持快捷键（如 Ctrl/Cmd+T 新建标签页）。
✅ 数据本地缓存（避免重复拉取，提升体验）。
✅ 支持导出消息为 JSON/CSV 文件。
✅ 支持导入消息模板（用于快速生产）。