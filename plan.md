# TripMind Travel Planner 实施计划

> 项目类型：Lifestyle Track / Planning an Escape  旅行规划 AI Agent  
> 目标：在黑客松时间内交付一条可演示、可验证的端到端用户旅程。

## 1. 产品定位

### 1.1 一句话定位

TripMind 是一个持续理解同行者、预算与现实变化的协作式旅行 AI Agent。它不只生成一次行程，而是负责从需求收集、群组协调、行程确认、费用记录到突发事件重排的整趟旅行。

> **Don’t just plan the trip. Protect the experience.**

TripMind 的优化对象不只是地点和时间，还包括同行者之间的和谐度、每个人的体力、现实变化下的关键体验，以及临时探索的空间。产品体验围绕四个连续环节展开：

> **Harmony → Energy → Adapt → Discover**

- **Harmony**：把个人偏好协调成公平、可接受的群组方案。
- **Energy**：控制步行、活动密度、换乘和休息，避免计划压垮成员。
- **Adapt**：发生延误、天气或取消时，局部修复而不是推翻整趟旅行。
- **Discover**：在有空闲时间时，根据当下状态提供可控的临时探索。

### 1.2 要解决的问题

- 日期、住宿地点、想去的景点、预算和群聊意见分散在多个工具中。
- 组团旅行中，每个人的兴趣、时间、预算和体力不同，组织者需要手动协调。
- 普通 AI 行程常忽略营业时间、路程、固定安排、预算和休息等硬约束。
- 到达时间变化、下雨、景点关闭或成员临时退出后，用户通常只能手动重做整天计划。

### 1.3 核心差异

TripMind 的核心不是“生成一段好看的旅游文案”，而是维护一份结构化的旅行状态，并在约束内主动提出可执行、可解释、可审批的方案。

四个产品能力：

1. **Group Harmony**：以 Group Preference Engine 为基础，把个人偏好转成群组共识、冲突和投票项，并以整体 Harmony、个人满意度和最低成员满意度保护来衡量公平性；同时保护成员的私密预算和敏感偏好。
2. **Travel Energy**：把活动密度、步行、连续活动、换乘、早起/晚归和休息块纳入可解释的体力负荷评估，避免平均满意度掩盖某位成员无法承受的行程。
3. **Constraint-aware Itinerary**：用确定性的规则校验时间、距离、营业时间、预算、用户锁定安排和成员限制，再由模型解释和排序候选方案。
4. **Disruption Replanner**：发生变化时只重排受影响部分，尽量保留用户锁定的关键安排，并以标准 Experience Diff 清楚显示变更、代价和取舍。

这些能力由一个 TripMind Agent 编排，通过领域工具调用确定性计算和数据适配器；它们不是多个彼此独立的真实 Agent。

### 1.4 产品成功指标（黑客松版）

- 从创建旅行到看到首版可执行行程不超过 3 分钟。
- 4 名成员的偏好能被汇总为共同偏好、冲突和待投票事项。
- 共识页显示整体 Harmony Score、每位成员满意度和最低满意度；优化后整体分数提升，且最低成员满意度不得因追求平均分而下降。
- 每日行程显示 Travel Energy 指标；在演示场景中，Energy 优化能降低步行或疲劳风险，同时不违反硬约束并保留关键体验。
- 生成的行程 100% 通过硬约束校验，所有费用和路程都有来源或明确标为估算。
- 模拟突发事件后 10 秒内给出至少 2 个候选重排方案。
- 重排保留已锁定安排，并展示完整 Experience Diff：Harmony、最低满意度、预算、步行、疲劳风险、天气风险、关键体验保留情况和固定安排影响。
- 总预算、分类预算、预计花费和剩余预算能够随行程调整而重新计算。

## 2. 目标用户

### 2.1 首要用户：小型朋友/家庭旅行（2–8 人）

典型旅行组织者负责收集意见、整理时间、控制预算和反复调整行程；其他成员只愿意快速填写偏好并在关键决策时投票。产品必须让组织者省事，也必须让非组织者能表达真实限制。

### 2.2 次要用户：独自旅行者

单人模式复用预算、约束行程和突发重排能力，跳过群组投票；可以作为低复杂度的首个体验或回退路径。

### 2.3 典型人物画像

| 用户 | 需求 | 主要痛点 | TripMind 价值 |
| --- | --- | --- | --- |
| 组织者 Alex | 快速形成大家都接受的方案 | 在群聊里追问、改表格、重新算钱 | TripMind Agent 汇总偏好、解释冲突、维护版本 |
| 预算敏感的 Jamie | 不想超支，也不想公开具体上限 | 不知道当前计划最终会花多少钱 | 私密预算区间、分类预算和方案超支预警 |
| 体力/饮食有特殊要求的 Sam | 行程可承受、饮食安全 | “大家都可以”掩盖了个人限制 | 硬约束优先，生成替代路线和自由活动 |
| 独旅 Taylor | 省时间、少踩坑 | 搜索结果多但难以组合 | 直接得到带缓冲和预算的可执行日程 |

## 3. 关键用户流程

### 3.1 主流程

1. **创建旅行**：输入目的地、日期/天数、出发地、币种、人数和总预算；可以选择“先用演示数据”。
2. **邀请成员**：生成分享链接或邀请码。每位成员填写自己的兴趣、必做、避免、预算区间、饮食、体力、可用时间和隐私选项。
3. **形成共识**：TripMind Agent 去重偏好、识别硬冲突，展示“共同喜欢”“有人强烈想做”“可分组进行”“需要投票”四类结果，并计算整体 Harmony、个人满意度和最低成员满意度。
4. **生成初版行程**：组织者录入住宿地点、到达/离开时间和必须保留的固定安排，选择旅行节奏（轻松/平衡/密集），TripMind Agent 输出按天时间线、地图顺序、预计费用、Energy 指标和假设。
5. **协作确认**：成员对活动点赞/投票；组织者锁定安排。所有重大改动显示差异并需要审批。
6. **旅行中维护**：成员可标记迟到、计划取消或身体不适；系统可接收或模拟天气、到达延误和景点关闭事件。
7. **局部重排**：Agent 找出受影响活动，保留已锁定安排，给出带 Experience Diff、预算、步行量和疲劳风险的候选方案；成员或组织者批准后生成新版本。
8. **预算复核**：查看行程预计总花费、分类预算、成员预算适配度和不同方案的成本差异。
9. **临时探索（可选）**：出现 1–3 小时空闲时，使用 Surprise Me 按 Safe、Balanced、Adventurous 三档推荐附近体验。
10. **结束总结**：保留最终行程、预算快照和变更记录，支持导出分享。

### 3.2 关键状态

旅行状态：`draft → collecting_preferences → planning → review → confirmed → in_trip → completed`。  
行程版本状态：`draft → proposed → approved → superseded`。  
活动状态：`suggested / locked / confirmed / completed / cancelled`。

### 3.3 体验原则

- 私密输入默认只对本人和 Agent 可见；公开给群组的是聚合结论，不是个人原话或精确预算。
- Agent 提案与已确认事实分开显示，不能悄悄修改用户锁定的固定安排。
- 每次重排都给出“保留了什么、改变了什么、为什么、预算差多少、谁会受影响”。
- 遇到不确定数据时明确标注“估算/待确认”，不伪装成实时事实。

## 4. TripMind AI Agent 设计

### 4.1 职责边界

TripMind Agent 是唯一面向用户的旅行状态编排者，负责理解自然语言、调用领域工具、组织候选方案、解释取舍和请求审批。产品只规划与调整旅行，不承担任何交易或预订职责。以下是同一个 Agent 的逻辑职责边界，不应实现为多个彼此独立、各自维护记忆的真实 Agent：

- **Orchestrator**：识别用户意图，读取最新旅行状态，安排工具调用并维护对话上下文。
- **Preference Coordinator**：规范化标签、聚合偏好、计算 Group Harmony、冲突/共识和投票项。
- **Energy Evaluator**：计算成员和每日行程的 Travel Energy、疲劳风险，并提出降低负荷的候选调整。
- **Itinerary Planner**：依据硬约束生成候选时间线，并请求确定性校验器验证。
- **Disruption Replanner**：分析事件影响范围，对未锁定部分做局部替换和排序，生成 Experience Diff。
- **Budget Planner**：估算行程成本、分配分类预算、检查成员预算边界并比较候选方案。
- **Serendipity Curator**：在明确的短空闲时间内，根据当前位置、预算、群组偏好和 Energy 状态筛选临时体验。

### 4.2 旅行状态与记忆

Agent 每次运行都从结构化 `TripState` 读取事实，而不是依赖长对话记忆。至少包括：

- 目的地、日期、币种、人数、成员权限和当前状态。
- 成员偏好、硬约束、软偏好、权重和隐私设置。
- 成员 Energy 状态（当前 energy level、最大步行距离、连续活动上限、早起/晚归偏好、休息偏好）及每日 Energy 统计。
- 活动候选、地理坐标、时长、营业时间、价格、天气敏感度、来源和更新时间。
- 住宿地点、到达/离开时间，以及用户锁定的餐厅或活动等固定安排。
- 当前 Group Harmony（整体分数、逐成员满意度、最低满意度、被忽略成员预警）及其优化前后快照。
- 当前 Experience Metrics（步行、疲劳、天气风险、关键体验保留率、固定安排影响）及每次重排前后的差异。
- 总预算、分类预算、预计花费、剩余预算和成员预算适配度。
- 行程版本、变更事件、投票和 Agent 决策说明。

### 4.3 工具契约

模型只能通过结构化工具操作领域状态：

`get_trip_state`、`aggregate_preferences`、`calculate_harmony`、`calculate_energy_load`、`optimize_energy`、`search_options`、`estimate_route`、`validate_itinerary`、`calculate_budget`、`propose_replan`、`calculate_experience_diff`、`suggest_serendipity`、`create_vote`、`save_draft_version`、`request_approval`。

每个工具的返回值应包含 `data`、`warnings`、`source`、`updatedAt`；工具失败时返回可解释错误和回退方案。只有用户明确审批后，才允许将草稿升级为确认版本。

其中 `calculate_harmony` 必须返回 `overallScore`、`memberSatisfaction[]`、`minimumSatisfaction`、`ignoredMemberWarnings[]` 和 `baselineComparison`；`calculate_energy_load`/`optimize_energy` 必须返回活动数、步行距离、连续活动时长、换乘次数、早起/晚归、休息块、成员 energy level 和 `fatigueRisk`；`calculate_experience_diff` 必须返回重排前后上述指标、关键体验保留情况、固定安排影响和每项变更原因。`suggest_serendipity` 接收当前位置、空闲时间、剩余预算、群组偏好和成员 Energy 状态，并只返回可在窗口内完成的候选体验。

### 4.4 Agent 决策循环

1. 解析请求或外部事件，提取变化和影响对象。
2. 读取最新状态与锁定项，识别硬约束/软约束。
3. 调用检索、路线、价格和天气适配器获取候选数据。
4. 使用规则校验器过滤不可执行方案。
5. 对可行方案按满意度、最低成员满意度保护、预算、Energy 移动成本、风险和关键体验保留排序。
6. 生成 2–3 个候选并说明取舍，不自动替用户做重大决定。
7. 保存提案、请求投票或审批；审批后创建新版本和审计事件。

### 4.5 安全与可靠性

- 提示词和工具返回值分离；外部文本不能改变系统规则或越权读取私密偏好。
- 所有金额、时间和地点以结构化字段为准，模型不能自行编造工具结果。
- 工具白名单只包含旅行规划、校验、预算估算和重排能力，不包含交易类操作。
- 对医疗、签证、极端天气等高风险问题给出提醒和官方来源建议，不作保证。
- API 不可用时使用 fixture 数据继续完成演示，并在 UI 标示数据模式。

## 5. 群组偏好协调与 Group Harmony

### 5.1 成员输入

每个成员填写：兴趣标签（美食、文化、自然、购物、夜生活等）、必做、可选、避免、饮食/无障碍、每日最晚结束时间、步行承受度、预算区间、可接受的早起程度、休息偏好，以及当前 `energyLevel`（`high / medium / low`）。每项偏好带有强度（`must / prefer / neutral / avoid`）；成员可以在行程中更新当天 Energy 状态。

### 5.2 聚合模型

- `must` 和安全/可达性限制默认为硬约束。
- 软偏好转为 0–5 的权重；成员可以调整“我有多在意”。
- 结果分为：全员共识、多数偏好、少数强需求、明显冲突、尚未回答。
- 用“预算档位”而不是精确金额公开群组结果；精确数字只用于 Agent 规划和本人查看。

候选活动的基本评分可采用：

`总分 = 个人偏好满足度 × 成员权重 + 群组覆盖度 + 公平性加分 + 关键体验保留分 - 成本惩罚 - Energy 移动/疲劳惩罚 - 风险惩罚`。

评分只用于排序，硬约束违反直接淘汰，不能靠高兴趣分“抵消”。

### 5.3 Group Harmony 视图与最低满意度保护

共识页必须以可视化指标呈现协调结果，而不是只显示投票数量：

- **Overall Harmony Score**：全体成员的加权偏好满足度、共识覆盖度与公平性综合分。
- **Member Satisfaction**：逐成员展示偏好满足度，并标出其必做/避免项是否满足。
- **Minimum Satisfaction**：显示当前最低成员满意度，并将其作为优化的保护下限；不能为了提升平均分而牺牲最低成员。
- **Ignored Member Warning**：当某位成员的强偏好长期未覆盖、或满意度显著低于群组平均时，显示“被忽略成员”预警，并给出分组活动、替代项或投票建议。
- **Before / After Comparison**：任何优化前后并列显示整体分数、最低满意度、逐成员变化、预算和 Energy 变化，解释分数变化来源。

Harmony 分数由确定性服务计算，Agent 只负责说明和提出候选。推荐目标采用最低满意度保护的排序策略：先满足硬约束，再最大化最低成员满意度和关键体验保留，最后优化整体平均分与成本。

### 5.4 冲突解决

当“有人想做、有人明确避免”时，优先尝试：

1. 拆成部分成员参加和部分成员自由活动。
2. 找到同地点/同时间的低冲突替代项。
3. 调整到愿意参加者方便的时段，并给未参加者明确退出选项。
4. 仍无法解决时创建投票，展示成本、步行量、满意度和受影响成员，而不是只展示多数票。

## 6. 约束感知行程

### 6.1 硬约束

- 活动不能与用户输入的到达/离开时间、住宿相关时间窗或其他锁定安排重叠。
- 活动必须位于营业时间内，并加上前后缓冲。
- 相邻活动间路程时间必须可达；跨区域移动不能被当作零成本。
- 不能超过成员可用时间、每日最大活动数、连续活动上限和步行/体力上限；必须满足必要的休息块。
- 总预算和成员预算不能超过配置的硬上限。
- 饮食、安全、无障碍等明确限制不能被忽略。

### 6.2 软约束与优化目标

兴趣覆盖、成员公平性、预算余量、活动多样性、少换乘、天气适配、Energy 负荷、休息时间和临时弹性。MVP 使用启发式排序即可，不要求求解全球最优。

### 6.3 行程输出

每个活动显示：开始/结束时间、名称、地点、预计时长、前往方式/路程、预计费用、适配成员、信息来源和数据置信度。每天显示预计总费用、移动时间、步行量、连续活动最长时段、换乘次数、早起/晚归、休息块、Energy 负荷和可替换活动。

### 6.4 确定性校验器

`validate_itinerary` 必须在保存提案前检查时间重叠、营业时间、路程可达性、预算、锁定项和成员限制，并返回具体错误位置。校验器是最终门禁，不能只依赖 LLM 自评。

## 7. Travel Energy

Travel Energy 是与偏好和预算同等重要的核心能力。TripMind 不把成员体力当作行程生成后的附注，而是在生成、优化和重排时持续计算每位成员与每天行程的可承受负荷。

### 7.1 负荷输入与指标

`calculate_energy_load` 读取成员当前 `energyLevel`、最大步行距离、连续活动上限、可接受的早起/晚归时间、休息偏好，以及行程中的：

- 每日活动数量和总活动时长。
- 总步行距离、步行占比和单段最长步行。
- 连续活动时长、相邻活动之间的缓冲和等待。
- 换乘次数、跨区域移动和交通复杂度。
- 最早开始与最晚结束时间。
- 休息块数量、时长和分布。
- 活动类型、天气暴露、坡度/无障碍信息（有数据时）。

服务返回 `energyLoadScore`、`fatigueRisk`（`low / medium / high`）和按成员拆分的风险原因。缺少精确数据时使用明确标注的估算，不把估算冒充实时体力或医疗判断。

### 7.2 Energy 优化

当 Energy 负荷过高，`optimize_energy` 按以下顺序提出局部调整：

1. 合并附近活动并减少跨区移动。
2. 插入或延长休息块，降低连续活动时长。
3. 替换为室内、低步行或交通更简单的同类体验。
4. 调整开始/结束时间，避免过早出发或过晚收尾。
5. 必要时将可选活动改为分组参加/自由活动，而不是牺牲成员的硬约束。

每次优化都显示前后指标，至少包括 `activityCount`、`walkingKm`、`longestContinuousActivityMinutes`、`transferCount`、`earliestStart`、`latestEnd`、`restBlockCount`、各成员 `energyLevel` 和 `fatigueRisk`，并说明哪些兴趣覆盖、预算或锁定安排受到影响。Energy 优化不能绕过 `validate_itinerary`，也不能悄悄删除锁定项。

### 7.3 验收标准

- 行程页能同时显示每日 Energy 指标和逐成员疲劳风险。
- 至少有一位低 Energy/低步行承受度成员时，系统能识别风险并显示被保护的限制。
- 点击“优化体力”后，至少给出一个合法候选，并展示步行、活动密度、休息块和疲劳风险的前后变化。
- 优化后不得引入时间、营业时间、预算、锁定项或成员硬约束违规。

## 8. 突发事件重排

### 8.1 MVP 支持的事件

- 到达时间或公共交通延误。
- 下雨或高温等天气变化。
- 景点临时关闭。
- 餐厅或活动取消。
- 成员迟到、提前离队或体力下降。
- 当日预算超支。

事件可由用户手动输入或从演示按钮触发；真实 webhook 属于可选增强项。

### 8.2 重排算法

1. 将事件标准化为 `DisruptionEvent`，标注时间、地点、影响范围和可信度。
2. 找出受影响的活动和依赖边，只冻结未受影响的安排。
3. 保护 `locked/confirmed` 项；若候选方案影响固定安排，明确标红并请求人工确认。
4. 在剩余时间窗内检索可行候选，优先使用附近、室内、低移动成本和时间弹性高的活动。
5. 重新执行硬约束校验和预算计算，返回 2–3 个方案。
6. 调用 `calculate_experience_diff`，展示标准化的前后差异、移除/新增/移动的活动、费用变化和受影响成员。
7. 用户批准后生成新版本；保留旧版本与事件日志，支持撤销到上一版本。

### 8.3 标准 Experience Diff

每个重排候选都必须显示同一组指标，避免只用一段自然语言描述“看起来更好”：

- **Group Harmony**：整体 Harmony Score、逐成员满意度和最低成员满意度的前后值。
- **Budget**：总预算、已规划/预计支出、剩余金额和方案带来的增减。
- **Travel Energy**：活动数、总步行距离、连续活动最长时段、换乘次数、最早开始/最晚结束、休息块和 `fatigueRisk` 的前后值。
- **Weather Risk**：天气敏感活动受影响程度、替代方案的天气风险和数据更新时间。
- **关键体验保留**：已标记 `mustDo`、高优先级偏好和不可错过体验的保留/替换状态。
- **固定安排影响**：每个用户锁定项目是“保留”“移动建议”“存在冲突”还是“无影响”；系统只提示规划影响，不处理任何交易。
- **活动变更清单**：新增、移除、移动的活动及每项变更原因、来源和审批状态。

差异面板同时显示优化前后快照和可读解释，例如“暴雨移除户外活动，保留素食晚餐；步行 8.4 km → 4.6 km，最低满意度 68% → 76%，预算增加 RM20”。

### 8.4 演示必备交互

点击“暴雨导致户外活动取消”后，界面在同一页面打开重排面板：用户锁定的晚餐时间保持不变，受影响的户外活动被替换为附近室内活动；用户可以比较“省钱”“保留更多兴趣”“最少步行”三个方案并批准其中一个。到达延误仍作为可选事件 fixture。

## 9. 预算规划

### 9.1 预算模型

按住宿、交通、餐饮、景点与活动、购物和其他分类，保存用户设置的预算上限与系统估算金额；同时显示总预算、已规划金额、剩余预算和预计超支。MVP 使用单一旅行主币种，重点回答“这个行程是否负担得起”，不记录真实消费流水。

### 9.2 预算约束

- 总预算和分类预算可以设置软上限或硬上限。
- 成员预算区间保持私密，只向群组显示“全部适配 / 有成员接近上限 / 存在超支冲突”。
- 每次生成、Energy 优化和重排都重新计算预计成本，并标出造成变化的活动。
- 外部价格缺失或过期时使用明确标注的 fixture/估算值，不把估算当作实时价格。

### 9.3 预算输出

预算页展示分类占比、每日预计花费、剩余预算、成员预算适配状态和候选方案成本差异。用户可以调整总预算或分类上限并要求 Agent 在新预算内重新规划；产品不处理收款、付款或旅行结束后的账务结算。

## 10. MVP 范围

### 10.1 核心交付优先级

在黑客松时间有限时，按以下顺序投入：

> **Disruption Replanning > Group Harmony > Travel Energy > Constraint Validation > Budget Planning > Serendipity**

其中创建旅行、成员输入、fixture 数据和审批是支撑上述故事线的基础设施；能力仍由一个 TripMind Agent 调用领域工具完成。

### 10.2 Must Have

- 手动触发暴雨/到达延误/活动取消，并进行局部重排；重排面板包含标准 Experience Diff、2–3 个候选和审批。
- Group Harmony 可视化：整体分数、逐成员满意度、最低满意度保护、被忽略成员预警及优化前后对比。
- Travel Energy：活动数、步行、连续活动、换乘、早起/晚归、休息块、energy level 和疲劳风险；支持至少一次 Energy 优化并展示前后指标。
- 基于内置本地目的地 fixture 的 2–3 天行程生成，以及时间、营业时间、路程、锁定项、成员限制和预算校验。
- 创建旅行、设置预算/日期/目的地、邀请成员；成员偏好私密保存，基础投票和冲突解释可用。
- 行程版本、锁定活动、审批与差异展示。
- 预算规划：总预算、分类预算、预计花费、剩余预算、成员预算适配度和超支预警。
- 无外部 API key 时可完整运行的演示模式。
- 可从实际 hosted URL 访问的响应式 Web App；桌面和移动浏览器核心流程可用，不能只在 localhost 演示。
- 部署检查、`env.example`、provider/dependency register、AI 边界说明、第三方归属/许可证清单和黑客松期间 Git 提交证据可供提交材料复核。

### 10.3 Should Have

- `Surprise Me` 轻量临时探索：基于当前位置、1–3 小时空闲时间、剩余预算、群组偏好和当前 Energy，提供 `Safe / Balanced / Adventurous` 三档候选。
- 地图路线可视化。
- 实时天气/地点查询适配器。
- 行程和预算摘要导出为 Markdown/CSV。
- 响应式移动布局、加载状态和错误恢复。

### 10.4 Could Have

- 多目的地优化、日历同步、实时推送。
- 成员在行程中的实时位置或自动检测迟到。

## 11. 页面与信息架构

### 11.1 页面

| 页面 | 核心内容 | 主要操作 |
| --- | --- | --- |
| `/` | 产品介绍、Demo 入口 | 新建旅行、加载演示旅行 |
| `/trips/new` | 目的地、日期、预算、人数 | 创建旅行 |
| `/trips/:id/onboarding` | 成员偏好和约束表单 | 保存偏好、邀请成员 |
| `/trips/:id/consensus` | Group Harmony、逐成员满意度、冲突/投票卡片 | 优化、投票、确认优先级 |
| `/trips/:id/itinerary` | 日历时间线、地图、Travel Energy 指标、TripMind Agent 对话 | 生成、Energy 优化、锁定、编辑、审批 |
| `/trips/:id/replan` | 事件输入、方案对比、标准 Experience Diff | 触发事件、比较、批准新版本 |
| `/trips/:id/budget` | 总预算、分类预算、预计花费和适配状态 | 调整预算、比较方案、请求重新规划 |

### 11.2 关键组件

Trip header、成员头像/权限、偏好卡片、Harmony 仪表盘、逐成员满意度卡、冲突卡片、投票卡、行程时间线、Energy 指标卡、活动锁定标记、地图路线、预算进度条、分类预算表、事件模拟器、Experience Diff、`Surprise Me` 按钮、TripMind Agent chat drawer。

### 11.3 推荐技术架构

本项目明确选择**可部署的响应式 Web App（browser-based app）**：桌面浏览器和移动浏览器均可使用，不要求同时开发 iOS/Android 原生应用，也不把原生 App 作为本次交付范围。黑客松优先采用：**Next.js + TypeScript + Tailwind CSS**，以 mobile-first/responsive layout 覆盖窄屏和桌面；服务端 API route/server action；持久层先用 **SQLite + Prisma**（部署时可替换 PostgreSQL）；Agent 使用 OpenAI Responses API 的结构化输出和工具调用；地图和实时数据通过 adapter 接入，默认 fixture 模式。

部署目标是一个实际可访问的托管环境（例如 Vercel、Netlify 或其他有免费额度的等价平台），提交和演示必须提供 hosted URL；localhost 只用于本地开发和故障排查，不能作为唯一演示方式。部署配置、构建命令、运行时版本、环境变量和健康检查都要写入 README/部署记录，并在干净浏览器中完成一次部署后冒烟测试。

代码按领域分层：

```text
app/                         页面与 API 入口
src/domain/trip              旅行、成员、权限、状态机
src/domain/preferences       偏好聚合、冲突、投票
src/domain/itinerary         活动、版本、约束校验、评分
src/domain/budget            预算上限、成本估算、方案比较
src/agent/tripmind           TripMind Agent prompt、工具注册、编排循环
src/integrations              places / map / weather adapters
src/db                        schema、seed、repository
tests/                        validator、budget、replan、E2E
```

架构原则：UI 不直接调用第三方 API；领域服务通过 adapter 接口取数据；Agent 只调用领域工具；所有外部数据记录来源与缓存时间；行程变更采用版本而非覆盖。

## 12. 数据模型（MVP）

| 实体 | 关键字段 | 关系/用途 |
| --- | --- | --- |
| `Trip` | id, name, origin, destination, start/end, currency, budget, status, ownerId | 根旅行状态 |
| `Member` | id, tripId, name, role, privacy, status, energyLevel, maxWalkingKm, consecutiveActivityLimit, earlyStartLimit, lateEndLimit, restPreference | 参与者、权限和体力边界 |
| `PreferenceProfile` | memberId, interests, mustDo, avoid, constraints, budgetRange, weights, restPreference, energyLevel | 私密偏好与当前体力输入 |
| `ActivityOption` | id, title, location, lat/lng, tags, duration, openingHours, price, indoor, weatherSensitivity, accessibility, source | 可规划活动及 Energy/天气属性 |
| `ItineraryVersion` | id, tripId, version, status, reason, createdBy, harmonySnapshot, energySnapshot, experienceMetrics, createdAt | 可审计计划版本及优化指标 |
| `ItineraryItem` | versionId, day, start/end, activityId, status, locked, cost, participants | 时间线项目 |
| `MemberDayState` | memberId, day, energyLevel, availableFrom, availableUntil, walkingLimitKm, notes | 当日可用时间和 Energy 状态 |
| `HarmonySnapshot` | tripId, versionId, overallScore, memberSatisfaction, minimumSatisfaction, ignoredMemberWarnings, baselineComparison | Group Harmony 及前后对比 |
| `ExperienceMetric` | versionId, walkingKm, activityCount, longestContinuousActivityMinutes, transferCount, earliestStart, latestEnd, restBlockCount, fatigueRisk, weatherRisk, keyExperiencesRetained, lockedItemsImpact | Experience Diff 的结构化指标 |
| `SerendipityCandidate` | id, tripId, location, windowStart/end, duration, cost, tags, requiredEnergy, mode, source | `Surprise Me` 的临时探索候选 |
| `DisruptionEvent` | id, tripId, type, occurredAt, payload, severity, source | 触发重排 |
| `Vote` | id, tripId, targetId, options, responses, deadline, status | 冲突决策 |
| `BudgetPlan` | tripId, currency, totalLimit, categoryLimits, estimatedTotal, estimatedRemaining, memberFitStatus, updatedAt | 行程预算约束与预计成本快照 |
| `AgentMessage` | tripId, actor, intent, toolCalls, response, createdAt | 解释和审计 |
| `TripEvent` | tripId, type, payload, actor, createdAt | 状态变更日志/撤销依据 |

所有实体使用 UUID；预算金额用整数最小货币单位或 Decimal，禁止用浮点数直接累计；时间统一存 UTC 并按旅行目的地显示。

## 13. API 与集成策略

### 13.1 内部 API

- `POST /api/trips`：创建旅行。
- `GET /api/trips/:id`：读取聚合后的旅行状态。
- `POST /api/trips/:id/members`：邀请或加入成员。
- `PUT /api/trips/:id/preferences`：保存当前成员偏好。
- `POST /api/trips/:id/consensus`：聚合偏好并生成冲突/投票项。
- `POST /api/trips/:id/harmony/calculate`：计算整体 Harmony、逐成员满意度、最低满意度和被忽略成员预警。
- `POST /api/trips/:id/itinerary/generate`：生成并校验草稿版本。
- `POST /api/trips/:id/energy/calculate`：计算每日与逐成员 Energy 负荷和疲劳风险。
- `POST /api/trips/:id/energy/optimize`：提出并校验降低 Energy 负荷的候选调整。
- `POST /api/trips/:id/itinerary/:version/approve`：审批版本。
- `POST /api/trips/:id/events`：写入突发事件并创建重排提案。
- `GET /api/trips/:id/replans/:id/experience-diff`：读取标准 Experience Diff。
- `POST /api/trips/:id/replans/:id/approve`：批准重排版本。
- `POST /api/trips/:id/serendipity`：按当前位置、空闲时间、预算、群组偏好和 Energy 推荐 Surprise Me 候选。
- `PUT /api/trips/:id/budget`：设置总预算与分类预算约束。
- `GET /api/trips/:id/budget`：读取预计花费、剩余预算和成员适配状态。
- `POST /api/trips/:id/budget/replan`：在新预算约束内生成候选行程。

所有写 API 进行成员权限校验、幂等键校验和事件记录，错误返回用户可读的 `code/message/details`。

### 13.2 外部适配器

- **LLM**：OpenAI Responses API；使用 JSON Schema 约束 `TripStatePatch`、`ItineraryProposal` 和 `ReplanProposal`。
- **地图/地点/路线**：Mapbox 或同类服务；先实现 `PlacesProvider`、`DirectionsProvider` 接口和本地 fixture。
- **天气**：天气 provider 可选；MVP 用天气事件 fixture。

集成顺序是 fixture → 单个真实地点/地图或天气 provider → 更多 provider。所有 provider 需要超时、缓存、限流、重试和 fallback；API key 只放环境变量，不能进入仓库。活动价格只作为规划估算并标注来源与查询时间，产品不提供库存或交易能力。

## 14. 比赛规则与合规策略

本节把比赛的一般规定落实为交付门槛。规则相关产物由团队在开发期间持续维护，不能等到提交前才补写；所有外部服务、依赖和 AI 生成代码都必须能被团队说明和复核。

### 14.1 平台选择与可部署性

- 交付形态固定为响应式 Web App；支持现代桌面浏览器和移动浏览器的核心流程，不开发 iOS/Android 原生版本，也不承诺同时支持两个移动平台。
- 从 Phase 0 就建立可部署构建，目标托管环境使用有免费额度的方案；每次合并至少通过生产构建和启动检查。
- 提交前必须完成一次真实 hosted deployment，并在桌面和窄屏浏览器分别走通“加载预设 → Harmony → Energy → 暴雨重排 → 预算”主流程。部署 URL、部署时间、commit SHA、运行时版本和检查结果写入 README/提交材料。
- 使用 `env.example` 声明变量名称、是否必需、用途和无值时的行为；真实密钥只存在托管平台的 secret/environment settings，不进入 Git、日志、截图、演示录屏或客户端 bundle。
- 应用启动时检查非敏感配置并提供健康状态；缺少可选配置、第三方超时、限流或网络不可用时，自动切换到本地 fixture，且 UI 明确标示“演示/估算数据”。

### 14.2 第三方服务、API 与依赖登记

- 只选有免费层或可用于演示的 trial 的第三方 API、SDK、付费服务；在真正接入前记录服务用途、免费层/试用条件、额度、限流、密钥配置需求/环境变量名、数据时效、费用风险、替代 provider 和 fixture fallback。记录的是 key 的配置要求与状态，不记录真实 secret。
- 在仓库内维护一份不含密钥的 provider/dependency register（可放入 README 或 `docs`，本计划只规定要求）：包括名称、版本、来源 URL、负责人、许可证、用途和移除/替代方案。若服务条款或额度变化，及时更新记录。
- 所有外部服务经 `src/integrations` adapter 接入，设置超时、缓存、重试上限和限流保护；核心演示不依赖实时网络、实时价格或任何单一 key。keyless 环境和网络失败测试必须在提交前执行。
- 不在前端暴露服务器端 key，不把 key 放进 prompt、fixture、错误信息或 Git 历史；提交前检查 `.env*`、构建产物和日志。

### 14.3 AI 可解释性与团队理解

- README/演示材料必须有一页“AI 边界与数据流”说明：LLM 负责意图理解、候选编排、自然语言解释和工具选择；确定性服务负责 `TripState` 事实、金额/路线计算、`validate_itinerary` 门禁、Harmony、Energy 和 Replan 评分及权限/审批。
- 团队成员必须能现场解释 `TripState` 如何作为唯一事实源、工具契约如何读写状态、validator 如何拒绝不可执行行程，以及 Harmony 的最低满意度保护、Energy 的负荷指标、Replan 的锁定项保护和 Experience Diff 如何计算；不能把模型生成当作不可理解的黑盒功能。
- LLM 输出一律走结构化 schema、工具白名单和 validator；展示中标出模型生成、确定性计算、fixture/外部来源和估算的边界。模型不可用时仍能用 fixture 完成核心流程。
- 提交前进行一次团队 walkthrough：从用户请求到 `TripState`、工具调用、确定性计算、审批和版本事件逐步复盘，并把已知限制、提示词版本和模型配置记录在 README/架构说明中。

### 14.4 开源、模板与原创性证据

- 允许使用 boilerplate、UI 模板和开源库，但必须记录来源 URL、版本/commit、许可证、用途和是否改动；许可证与提交平台规则冲突时不得使用。
- Harmony、Energy、约束校验、Experience Diff、局部 Replan、预算规划等解决问题的核心逻辑必须由团队在黑客松期间实现；可复用库只能提供通用基础能力，不能替代核心创新。
- 提交材料包含 README 的 attribution/dependency 清单、关键模块归属说明、黑客松期间的 Git history/提交记录和必要的设计决策记录。提交前检查仓库历史、生成物和演示素材中没有他人密钥或未归属内容。
- 本项目不得把既有个人项目整体换皮或复用其核心业务逻辑后重新提交；若使用此前通用脚手架，只保留其通用基础并明确归属，TripMind 的核心流程和算法须有黑客松期间的新增提交证据。

### 14.5 适度无障碍与响应式质量基线

- 核心流程使用语义 HTML、可见且合理的键盘焦点顺序、可操作的按钮/链接、表单 label、必填与错误提示；不以颜色作为状态的唯一表达，并保持文字与背景的基本对比度。
- Harmony、Energy、风险和错误状态同时提供文字/图标或结构化标签；主要页面可被基础 screen reader 读取，动态更新有合适的标题或提示。
- 以桌面和移动浏览器各做一次键盘/缩放/窄屏冒烟检查，记录主要问题和修复结果。此处是黑客松质量基线，不扩展为完整 WCAG 审计；若时间不足，优先保证创建、偏好、行程、重排和预算主流程。

## 15. 实施阶段与任务拆分

### Phase 0：范围和脚手架（0.5 天）

- 确认演示场景、目的地 fixture、成员和数据口径。
- 初始化 Next.js/TypeScript、样式、环境变量、lint/test。
- 选定托管平台并建立最小生产部署、`env.example`、健康检查和 provider/dependency register；明确 keyless fixture fallback。
- 建立 README 的 AI 边界、第三方归属/许可证和原创性证据章节，记录初始 commit；建立语义 HTML、键盘、对比度和表单错误的无障碍检查清单。
- 建立 `TripState`、错误码、fixture provider 和基本路由。

### Phase 1：数据与协作输入（0.5–1 天）

- 实现 schema、seed、旅行创建和邀请码。
- 完成成员偏好、Energy 输入、私密字段和聚合接口。
- 实现 Group Harmony 计算、最低满意度保护、被忽略成员预警和优化前后对比。
- 实现共识/冲突卡片与基础投票。

### Phase 2：Energy 与约束感知行程（1 天）

- 建立活动 fixture、路线估算和硬约束 validator。
- 实现 TripMind Agent 工具调用和结构化行程 proposal。
- 实现 Travel Energy 计算、疲劳风险和至少一种 Energy 优化策略。
- 完成时间线、活动详情、锁定、版本和审批。
- 为 validator 写单元测试。

### Phase 3：突发重排与 Experience Diff（0.75–1 天）

- 实现事件模型、影响分析、候选替换和标准 Experience Diff。
- 接入“暴雨导致户外活动取消”“到达延误 3 小时”“景点关闭”三个事件 fixture。
- 保证锁定项保护、旧版本留存和审批后切换。

### Phase 4：预算规划（0.5 天）

- 实现单一旅行主币种下的总预算、分类上限、预计成本和预算面板。
- 实现成员预算适配检查、超支预警和候选方案成本比较。
- 支持用户调整预算后请求一次约束内重新规划。

### Phase 5：整体验证与展示（0.5–1 天）

- 跑完整 E2E 故事线，修复金额/时区/空状态/错误状态。
- 若核心链路稳定，实现 `Surprise Me` 的 Safe/Balanced/Adventurous 轻量筛选；否则保留可点击的 fixture 回退。
- 优化移动端关键页面、加载反馈、键盘操作、screen reader 标签和 Agent 解释文案。
- 部署到 hosted URL，在干净桌面/移动浏览器中检查构建、健康状态、核心流程、无 key、网络失败和刷新恢复；准备部署 URL、备用录屏/截图和无 key fallback。
- 完成依赖/许可证/归属清单、AI walkthrough、Git 提交历史和原创性自查；确认 secret 不出现在仓库、日志、构建产物和演示素材中。

优先级顺序：**突发重排 > Group Harmony > Travel Energy > 约束校验 > 预算规划 > Serendipity**。实现时允许先搭建必要的数据和 UI 支撑，但不得让非核心集成挤占这条演示主线的质量。

## 16. 验收标准

### 16.1 功能验收

- 新用户可以创建一趟旅行并加入至少 4 名成员。
- 每名成员的私密偏好能保存，聚合页不泄露精确预算或私密原话。
- Agent 能解释至少一个共识和一个冲突，并生成投票。
- 共识页能显示整体 Harmony、逐成员满意度、最低成员满意度和被忽略成员预警；优化前后对比可复核，且优化不得降低最低成员满意度保护线。
- 行程页能显示每日活动数、步行距离、连续活动、换乘、早起/晚归、休息块、成员 `energyLevel` 和疲劳风险；Energy 优化后所有硬约束仍通过。
- 生成的行程包含时间、地点、路程、费用、来源和假设；validator 不允许硬约束违规版本进入审批。
- 用户能锁定到达/离开时间、餐厅时间或其他固定安排，Agent 不会在未确认时修改它们。
- 触发暴雨事件后，系统能识别受影响区间，保留锁定晚餐时间，并展示至少两个可行替代方案及标准 Experience Diff（Harmony、最低满意度、预算、步行、疲劳、天气风险、关键体验和固定安排影响）。
- 用户批准重排后有新版本，旧版本和变更原因仍可查看。
- 预算页能正确计算总预算、分类预算、预计花费和剩余预算；超支方案被标记，修改预算后可生成符合新上限的候选。
- `Surprise Me`（若启用）只推荐能在空闲窗口完成、符合预算/偏好/Energy 的候选，并正确区分 Safe、Balanced、Adventurous。

### 16.2 质量验收

- 无 API key 时使用 fixture 可以从创建旅行走到预算复核。
- 提交环境提供可访问的 hosted URL；在干净桌面和移动浏览器中，部署构建、健康检查和核心演示流程均通过，不以 localhost 作为唯一运行方式。
- 关闭网络或触发第三方超时/限流时，系统在可接受时间内回退到 fixture，并在界面标示数据模式；所有密钥只来自环境变量，仓库、日志、构建产物和截图中均无 secret。
- validator、预算计算和重排影响分析有自动化测试。
- 页面在桌面和窄屏下可操作；加载、空状态、超时和无结果状态有反馈。
- 核心页面通过适度无障碍冒烟：语义 HTML、键盘可操作和可见焦点、表单 label/错误提示、基本对比度、非颜色唯一表达，以及基础 screen reader 可读；不要求完整 WCAG 审计。
- Agent 输出不得把估算冒充实时事实，重大变更不得无审批写入确认计划。
- 团队能依据 AI 边界说明现场解释 LLM、`TripState`、工具调用、validator、Harmony/Energy/Replan 的职责和关键算法；相关核心逻辑有黑客松期间提交证据。
- 第三方服务/依赖有免费层或演示 trial，且 provider/dependency register 记录来源、版本、许可证、额度/限流、密钥变量名、用途和 fallback；README 具备归属清单。
- Demo 数据中不使用真实个人敏感信息。

## 17. 演示脚本（约 4–5 分钟）

演示旅行：4 位朋友在槟城进行 3 天本地旅行，总预算 RM4,800，其中活动预算 RM1,500；共同喜欢美食和文化，1 人素食，1 人不适合长距离步行，1 人希望保留购物时间。使用预置数据，避免现场填写和网络依赖。

1. **开场（15 秒）**：一句话说明 TripMind 的目标是“Protect the experience”，而不是只生成景点清单。
2. **加载预设（30 秒）**：打开槟城旅行，展示四人的私密偏好、共同兴趣、少数强需求和初始 Harmony/最低满意度。
3. **Harmony 优化（45 秒）**：点击优化，展示整体 Harmony（例如 72% → 91%）、逐成员满意度和最低满意度保护；说明系统如何保留素食和购物需求。
4. **Energy 优化（45 秒）**：展示一天的活动数、步行（8.4 km → 4.6 km）、休息块（0 → 1）和疲劳风险（High → Medium）；点击接受低步行候选。
5. **暴雨重排（75 秒）**：点击“暴雨导致户外活动取消”；Agent 保留用户锁定的晚餐时间，把户外活动换成附近室内体验，展示完整 Experience Diff，并批准“最少步行”方案。
6. **预算（35 秒）**：展示分类预算、当前行程预计花费和剩余预算；调低活动预算后，让 Agent 给出一个仍满足 Harmony 与 Energy 约束的替代方案。
7. **可选 Surprise Me（25 秒）**：若时间允许，在 1 小时空闲窗口点击 `Surprise Me`，切换 Safe、Balanced、Adventurous 查看符合当前位置、预算、偏好和 Energy 的候选。
8. **收尾（15 秒）**：回到版本历史，强调同一个 TripMind Agent 能把 Harmony、Energy、Adapt、Discover 连成一条可审批的旅行状态链。

## 18. 风险与应对

| 风险 | 影响 | 应对 |
| --- | --- | --- |
| LLM 生成闭馆、超时或超预算活动 | 失去可信度 | 结构化输出 + validator 门禁 + fixture 数据 |
| 实时 API key、限流或网络失败 | Demo 中断 | provider adapter、缓存、超时、fixture fallback |
| 成员冲突无法自动解决 | 群组体验差 | 私密偏好、权重、拆分活动、投票和人工审批 |
| 重排破坏用户固定安排 | 信任风险 | 锁定状态、版本化、固定安排受影响时必须人工确认 |
| 预算估算被误认为真实报价 | 误导用户 | 明确显示来源、更新时间和“仅供规划”标识，不接交易能力 |
| 过度规划导致行程疲劳 | 用户不愿使用 | 每日上限、缓冲/自由活动块、轻松/平衡/密集节奏 |
| 真实数据时效性不足 | 误导用户 | 显示来源和更新时间，明确估算，建议最终确认官方信息 |
| 托管环境构建/运行与本地不一致 | 现场无法打开 | Phase 0 建立 hosted deployment；锁定运行时/依赖版本，提交前在干净浏览器做健康检查和 E2E 冒烟 |
| 免费额度耗尽、第三方限流或 key 缺失 | Demo 中断或产生费用 | 只选 free tier/trial；设置预算/限流告警、超时和缓存，核心路径默认 fixture，验证 keyless/network-failure fallback |
| 密钥、许可证或来源记录不完整 | 安全/合规风险 | 环境变量注入和 secret 检查；维护 provider/dependency register、许可证与 attribution 清单，提交前检查 Git 历史和构建产物 |
| 团队无法解释 AI 关键决策 | 评审不信任或无法维护 | 固定 LLM/确定性逻辑边界，工具白名单和 validator 门禁；完成 TripState、Harmony/Energy/Replan walkthrough |
| 窄屏、键盘或辅助技术使用受阻 | 质量验收失败 | 语义 HTML、可见焦点、表单错误、对比度和非颜色表达；桌面/移动浏览器做基础 screen reader/键盘冒烟 |
| 黑客松时间不足 | 功能不完整 | 先完成单目的地 fixture 的端到端故事线，后接真实 API |

## 19. 明确不做（本次 MVP）

- 不做任何购票、住宿预订、库存查询、付款、退款或账务结算；TripMind 只负责规划、预算估算和动态调整。
- 不承诺活动估价、天气或路线的绝对准确性。
- 不做签证、医疗、保险和极端天气安全保证；相关内容仅作信息提示。
- 不做企业差旅审批、积分/会员体系、多人同时在线光标协作。
- 不做复杂多目的地全球最优求解、实时定位和自动读取所有群聊历史。
- 不将成员精确预算、饮食/健康限制等私密信息默认公开给全组。
- 不把 LLM 作为金额计算、时间可行性或权限判断的唯一来源。
- 不开发 iOS/Android 原生应用；本次只交付响应式 Web App，不要求同时覆盖两个原生平台。
- 不依赖只能在本地 localhost 运行的部署；不接入只有付费层、没有可用 trial/free tier 的外部服务。
- 不承诺完整 WCAG 审计；只交付本计划规定的核心流程无障碍质量基线。
- 不复用既有个人项目的核心业务逻辑冒充黑客松成果；不省略开源来源、许可证和第三方服务记录。

## 20. 完成定义

当一名评委可以从提交的 hosted URL（而非仅 localhost）在桌面或移动浏览器、无需开发者解释地完成“加载预设 → Harmony 优化 → Energy 优化 → 触发暴雨 → 查看 Experience Diff 并审批重排 → 调整预算并获得新方案”，且可选 `Surprise Me` 遵守窗口/预算/偏好/Energy 约束、页面能解释每次 TripMind Agent 决策、硬约束无违规、无外部 API key 或网络失败也不中断，即视为本计划的黑客松 MVP 完成。完成定义还要求：部署/健康检查结果已记录；环境变量和 keyless fallback 已验证；第三方 provider/dependency register、来源/许可证/归属清单和黑客松期间 Git 提交证据齐全；团队能解释 LLM 与确定性逻辑边界及 Harmony/Energy/Replan 关键算法；核心页面通过语义 HTML、键盘、对比度、非颜色表达、表单错误和基础 screen reader 冒烟检查。
