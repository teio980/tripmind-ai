# TripMind

> Don’t just plan the trip. Protect the experience.

TripMind 是一个以 AI Chatbox 为入口的可解释旅行规划产品。用户不需要先创建复杂的 Plan，也不需要先填写一张很长的表单，只要说出一个模糊想法，TripMind 就会通过少量追问补齐必要信息，生成一份可以继续修改、比较、审批和协作的旅行方案。

TripMind 关注的不只是“去哪几个景点”，还要保护整趟旅行真正重要的东西：同行者之间的接受度、每个人的体力、预算空间、已锁定的安排，以及突发变化发生之后仍然值得保留的体验。

## 产品概览

TripMind 围绕一条连续的旅行状态链工作：

```text
模糊想法
   ↓
AI Chatbox 补问
   ↓
结构化需求确认
   ↓
约束感知的首版行程
   ↓
Harmony 群组协调 + Energy 体力优化
   ↓
Adapt 突发事件局部重排
   ↓
预算复核、Experience Diff 与版本审批
```

产品能力可以概括为四个关键词：

- **Harmony**：把个人偏好协调成大家都能接受的方案，并保护满意度最低的成员。
- **Energy**：关注步行、活动密度、连续活动、换乘、早起/晚归和休息，避免平均满意度掩盖某个人无法承受的行程。
- **Adapt**：天气、延误或活动取消后，只修复受影响的时间窗口，不轻易推翻整天甚至整趟旅行。
- **Discover**：在明确的空闲窗口内，根据当前位置、预算、偏好和体力状态推荐临时体验。

## 适用用户与典型场景

TripMind 面向个人旅行者，以及 1–8 人的朋友、家庭和小型旅行团队：

| 用户 | 常见问题 | TripMind 的帮助 |
| --- | --- | --- |
| 没有计划的旅行者 | 只有“想去旅行”的念头，不知道从哪里开始 | 从一句话开始，Agent 只补问必要信息 |
| 旅行组织者 | 需要在群聊、表格和多个链接之间反复协调 | 汇总偏好、解释冲突、维护统一行程和版本 |
| 预算敏感的成员 | 不想超支，也不想公开精确预算 | 查看分类预算、剩余空间和方案成本差异 |
| 有饮食或体力限制的成员 | “大家都可以”经常忽略个人限制 | 将必要限制纳入硬约束，并保护最低满意度 |
| 独旅用户 | 搜索结果很多，但很难组合成可执行日程 | 直接生成带时间、移动、预算和缓冲的计划 |

典型使用场景包括：

- 还没有目的地或详细计划，只想先聊聊去哪儿；
- 已经知道目的地和天数，希望快速得到第一版日程；
- 朋友或家人对兴趣、预算、饮食和体力有不同要求；
- 某位成员迟到、下雨或活动取消，需要只重排下午的一段时间；
- 行程已经生成，但需要比较“更省钱”“少走路”或“保留更多兴趣”之间的取舍。

## 解决什么问题

传统旅行规划通常把目的地搜索、群聊讨论、预算计算和临时改计划分散在多个工具里。TripMind 要解决的是这些环节之间的断裂：

- 用户只有“我想去旅行”的念头时，不必先理解 Plan、字段或产品结构。
- Agent 只追问会阻止生成的问题，不重复询问已经提供的信息。
- 每份行程都是结构化、可继续维护的旅行对象，而不是一次性的聊天文本。
- 同行者的兴趣、预算、饮食和体力限制可以被汇总、解释和协调。
- 计划中的时间、距离、营业时间、预算、锁定安排和成员限制需要先通过确定性校验。
- 发生下雨、延误、景点关闭或成员临时变化时，系统只重排受影响的部分。
- 每次重大变化都先展示“改了什么、为什么、代价是什么、谁会受影响”，用户批准后才成为正式版本。

## 核心特色

### 1. Chatbox-first：从一句话开始

首页把 Chatbox 作为第一入口，而不是先让用户创建 Plan。用户可以从“我想去旅行，但还没有计划”开始，也可以直接输入目的地、天数、兴趣或希望修改的内容。

Agent 会识别已知信息，优先补问目的地和日期/天数等真正阻塞生成的字段。人数、兴趣、节奏等可选字段可以稍后补充，或者使用明确标注的默认值。

### 2. Explain before apply：先解释，再应用

TripMind 不会悄悄覆盖当前行程。用户提出“第二天不要太早”、低步行优化、Harmony 优化或暴雨重排后，系统先创建一个以当前正式版本为基准的待审批草稿，并展示 Experience Diff。

只有用户批准后，草稿才会成为下一个正式版本；取消、跳过或关闭预览都不会改变当前正式行程。

### 3. Group Harmony：不让少数人的需求被平均数淹没

Harmony 不只显示一个整体分数，还同时展示：

- 整体 Harmony Score；
- 每位成员的满意度估算；
- 满意度最低的成员；
- 共同偏好与需要协调的冲突；
- 具体的活动替换、排序和保留理由；
- 哪些信息是聚合结论，哪些是成员私密输入。

优化目标不是只把平均分做高，而是在提升整体体验的同时，保护最低成员满意度不下降。

### 4. Travel Energy：把“会不会累”变成可讨论的指标

Travel Energy 将以下因素纳入行程负荷：

- 每日步行距离；
- 活动数量和连续活动时间；
- 跨区域换乘次数；
- 早起、晚归和休息块；
- 成员个人步行限制与舒适目标；
- 当前疲劳风险。

用户可以在行程页打开 Energy 面板，比较基准方案和低负荷候选，再决定是否应用。步行和疲劳数据会标注为系统估算，不是医疗建议。

### 5. Constraint-aware Itinerary：先通过规则，再给出建议

TripMind 将模型的自然语言理解与确定性约束校验分开：

- Agent 负责理解意图、组织候选和解释取舍；
- 约束校验器负责检查时间、距离、交通缓冲、预算、营业时间、锁定安排和成员限制；
- 未通过校验的候选不能直接成为正式行程；
- 固定安排会以锁定状态显示，并在所有优化和重排中保留。

### 6. Disruption Replanner：只修复受影响的窗口

面对暴雨等突发事件，TripMind 不要求用户手动重做整天计划。系统会：

1. 识别受影响的活动与时间窗口；
2. 保留用户已经锁定的安排；
3. 生成多个取舍不同的替代方案；
4. 检查替代活动的结束时间、交通和缓冲；
5. 用统一的 Experience Diff 对比方案；
6. 让用户选择并审批。

### 7. Budget & Version Control：预算和历史一起看

预算页面同时显示总预算、分类预算、已用金额、剩余金额、待审批草稿的变化和版本历史。用户可以看到一次改动具体增加或减少了住宿、餐饮、交通或活动费用，以及取消后正式版本是否保持不变。

每个正式版本保留变更原因和关键指标；旧版本不会被覆盖。版本号按“批准时的当前正式版本 + 1”递增，不把某个功能永久绑定到某一个版本号。

### 8. Privacy-aware collaboration：群组看到结论，不默认看到私密原话

产品设计区分成员私密输入与群组聚合结果。群组视图展示共同偏好、待协调事项和系统解释，不直接暴露成员的精确预算、私密评论或敏感偏好。

邀请成员是生成首版行程之后的可选动作；单人旅行不需要邀请任何人也可以完整使用核心流程。

### 9. Deterministic fallback：没有 API key 也能演示核心流程

系统设计包含可替换的 AI、地图、地点、路线和天气适配层。在当前交互原型中，使用固定 Fixture 和本地状态完成完整演示，不依赖实时网络、地图服务、天气服务或真实账号。

## 完整功能地图

| 模块 | 解决的问题 | 关键能力 |
| --- | --- | --- |
| AI Chatbox | 不知道如何开始规划 | 自然语言入口、范围判断、需求提取、少量补问 |
| Requirement Clarifier | 信息不完整或重复填写 | 已知条件记忆、缺失字段提示、可编辑条件卡 |
| Itinerary Planner | 生成内容好看但无法执行 | 按天时间线、移动时间、费用、缓冲和约束校验 |
| Trip / Plan Management | 计划只存在于一次对话里 | 独立行程对象、稳定入口、首版保存和后续修改 |
| Collaboration | 同行者意见分散在群聊里 | 邀请成员、偏好收集、聚合结论、投票和角色管理 |
| Group Harmony | 平均满意度掩盖少数成员 | 共同偏好、冲突识别、成员满意度、最低满意度保护 |
| Travel Energy | 行程过密、步行太多、成员容易疲惫 | 步行、活动密度、换乘、休息和疲劳风险评估 |
| Adapt / Replanner | 突发事件导致整天计划失效 | 事件识别、局部重排、锁定项保护、Experience Diff |
| Budget Planner | 不清楚计划会花多少钱 | 总预算、分类预算、剩余预算、候选成本比较 |
| Discover / Surprise Me | 空闲时间不知道做什么 | Safe / Balanced / Adventurous 三档临时探索建议 |
| Version & Approval | 修改后不知道发生了什么 | 待审批草稿、影响预览、版本历史、可追溯变更原因 |

首次规划只需要 Chatbox、Requirement Clarifier 和 Itinerary；Harmony、Energy、Adapt、Budget 和 Discover 都是生成首版后的增强能力，不会阻塞用户开始旅行规划。

## 与传统旅行规划工具的差异

TripMind 可以和 Wanderlog 这类偏行程整理与协作的旅行工具放在同一个使用场景里理解，但产品重点不同。传统工具更适合收集地点、整理清单和查看日程；TripMind 希望把“理解需求 → 约束校验 → 协调取舍 → 应对变化 → 用户审批”连成一条可解释的旅行状态链。

| 维度 | 常见行程整理方式 | TripMind 的重点 |
| --- | --- | --- |
| 开始规划 | 先创建计划，再填写字段或搜索地点 | 先说一句话，Agent 补齐必要信息 |
| 群组决策 | 记录成员意见，最终由组织者手动取舍 | 展示共识、冲突、逐成员满意度和最低满意度 |
| 体力管理 | 通常需要用户自己判断是否太累 | 将步行、活动密度、换乘和休息纳入 Energy |
| 计划可靠性 | 主要展示地点与时间安排 | 用确定性规则校验锁定安排、时间和交通缓冲 |
| 临时变化 | 需要手动修改受影响的多项活动 | 只重排受影响窗口，并保留关键安排 |
| 方案比较 | 结果和过程可能分开查看 | 用 Experience Diff 同时展示变化、代价和受影响指标 |
| 修改方式 | 直接编辑当前计划 | 先生成草稿，批准后创建新版本，旧版本保留 |

这里的差异不是“功能数量更多”，而是把旅行从一份静态清单变成一份可解释、可协调、可审批的状态对象。

## Agent 边界与安全原则

TripMind Agent 的职责是旅行状态编排，而不是通用聊天机器人。它可以处理：

- 目的地、日期、天数、出发地和旅行节奏；
- 行程生成、修改、路线、交通、预算和天气对行程的影响；
- 同行者偏好、饮食要求、体力限制、Harmony、Energy 和突发重排；
- TripMind 自身的功能使用帮助。

它不负责购票、住宿预订、付款、退款或其他交易；也不负责代码、作业、通用写作、新闻政治评论、投资建议、与旅行无关的医疗/法律咨询。旅行相关的健康、签证或极端天气问题只能给出规划层面的风险提醒和官方信息建议，不提供诊断、法律结论或安全保证。

完整产品形态会在 Agent 前后使用 `Business Scope Guard`：

- 越界消息在进入 Agent 或调用领域工具前被拦截；
- 混合请求只处理其中的旅行部分，并明确说明其他部分不在范围内；
- 意图不明确、结构化输出不合法或工具权限不匹配时默认拒绝；
- Agent 不能直接写数据库、修改锁定安排、授予成员权限或调用任意外部服务；
- 重大活动变化必须经过结构化预览、确定性校验和用户审批。

这些边界保证模型负责理解和解释，系统规则负责事实、计算、权限和最终写入。

## 功能使用教学

下面是一条推荐的完整体验路径。首次体验建议从“加载槟城 Demo”开始，约 5 分钟可以走完全部主要能力。

### 第一步：从首页输入想法

打开首页，在 Chatbox 中输入一句自然语言，例如：

```text
I want to travel, but I don't have a plan yet
```

也可以直接尝试：

- `I want to go to the beach`
- `Plan a 3-day food trip`
- 点击 `Load the Penang Demo`

点击发送后，TripMind 会把输入带入 Agent 补问页面。如果输入的是与旅行无关的内容，系统会提示当前只处理旅行规划与行程管理，不会创建行程状态。

### 第二步：回答 Agent 的必要问题

Agent 会在对话中优先确认：

- 目的地；
- 日期范围或旅行天数。

右侧的 `Current requirements` 会实时显示已经记住的条件。已经提供的目的地、天数、兴趣和节奏可以单独移除，移除后系统会重新标记为待确认。

用户可以直接输入回复，也可以点击 Demo 快捷回复。当前原型支持自然语言提取常见目的地、天数和兴趣关键词；为了获得最稳定的演示结果，建议使用英文示例或直接载入 Penang Demo。

### 第三步：确认条件并生成首版行程

当目的地和旅行时长齐全后，进入预生成确认页。生成前可以检查：

- 目的地、天数、人数和共同兴趣；
- 可选默认，例如轻松节奏和活动预算；
- Demo 预设中的成员限制与固定安排；
- 哪些内容来自用户输入、Demo Fixture 或系统估算。

点击 `Generate itinerary` 后，页面会依次展示五个阶段：

1. `Understand requirements`：读取目的地、天数、同行人数和偏好；
2. `Find activity candidates`：从当前数据源匹配活动；
3. `Estimate routes and costs`：估算路线、交通和费用；
4. `Validate hard constraints`：校验锁定晚餐、饮食、步行限制、交通和时间缓冲；
5. `Save Version 1`：保存第一份正式行程。

生成完成后会自动进入独立的 Itinerary 页面。

### 第四步：查看和修改行程

在 Itinerary 页面可以：

- 按天查看时间线、地点、活动类型、交通和步行信息；
- 看到每日预计花费和整体预算摘要；
- 识别 `Estimated`、`Confirmed`、`Locked` 等状态；
- 打开 `Ask Agent` 抽屉，用自然语言提出修改；
- 通过 `Invite travelers` 查看模拟邀请链接；
- 从顶部标签进入 Harmony、Energy、Budget 和 Rain replan。

尝试在 Agent 抽屉中输入：

```text
Start Day 2 later
```

提交后会看到待审批预览，例如 Day 2 开始时间从 `09:30` 调整为 `10:30`、下午活动缩短 30 分钟，而 Day 2 `19:30` 的锁定晚餐不受影响。

点击 `Keep this change` 后才会创建新版本；点击 `Keep adjusting` 或关闭预览，正式版本和版本号都不会改变。

### 第五步：使用 Group Harmony

进入 `Harmony` 页面后，可以查看：

- 当前正式 Harmony；
- 候选优化后的 Harmony 估算；
- 每位成员的满意度；
- 满意度最低的成员；
- 群组共同偏好；
- 需要协调的事项；
- 系统做出调整的原因。

点击 `Run Harmony optimization` 后，系统会先显示候选，不会直接修改正式行程。典型候选会展示 `72% → 91%` 的 Harmony 估算，并说明如何替换不兼容的餐饮、保留购物时间和重新排序同日活动。

只有点击 `Approve and apply changes` 后，活动调整才会写入新的正式版本；候选阶段的分数始终标注为 `System estimate`。

### 第六步：使用 Travel Energy

在 Itinerary 页面点击 `Energy`，会打开行程内的 Energy drawer。这里可以比较 Day 2 的基准方案与低步行候选：

| 指标 | 基准 | 候选 |
| --- | ---: | ---: |
| Walking | 8.4 km | 4.6 km |
| Rest blocks | 0 | 1 |
| Fatigue risk | High | Medium |
| Transfers | 5 | 3 |

当前 Demo 中 Sam 的每日硬上限是 `9.0 km`，舒适目标是 `≤5.0 km`。基准的 8.4 km 没有超过硬上限，但会提示较高的负荷风险；`High` 是风险提示，不等于约束违规。

点击 `Generate low-walking candidate` 后，系统会先创建草稿。确认无误后点击 `Approve low-walking plan`，系统才会增加休息块、降低步行并创建新的正式版本。

### 第七步：处理暴雨并选择重排方案

进入 `Rain replan` 页面，系统会模拟 Day 2 `13:30` 发生暴雨，影响 `14:00–17:00` 的户外活动。三种方案分别代表不同的取舍：

| 方案 | 侧重点 | 预算变化 | 典型结果 |
| --- | --- | ---: | --- |
| `Least walking`（推荐） | 降低步行和跨城换乘 | +RM 40 | 疲劳风险更低，保留美食与文化主线 |
| `Keep more interests` | 保留更多文化体验 | +RM 80 | 兴趣覆盖更高，但交通和活动费用增加 |
| `Lower budget` | 优先控制预算 | -RM 60 | 节省交通费，但文化体验覆盖下降 |

选择方案后，`Experience Diff` 会对比：

- Harmony；
- 最低成员满意度；
- 预算变化；
- 步行变化；
- 疲劳风险；
- 天气风险；
- 关键体验保留情况；
- 固定安排是否受影响。

所有候选都必须保留 Day 2 `19:30 Hai Keng Restaurant` 锁定晚餐，并验证替代活动在 `17:00` 前结束、预计交通和晚餐前缓冲充足。选择后点击 `Select and continue`，进入 Budget & version review 完成审批。

### 第八步：复核预算并审批版本

Budget 页面用于在正式写入前做最后检查：

- 总预算和剩余预算；
- 住宿、餐饮、交通、活动四类预算；
- 当前正式版本和待审批草稿的对比；
- 版本历史、变更标签和预计花费；
- 固定安排、交通缓冲和硬约束的重新校验提示。

点击 `Approve` 后，系统才会把候选变成正式版本并回到 Itinerary。点击取消则关闭草稿，当前正式版本保持不变。

## Demo 场景

当前仓库内置的完整演示场景是 `Penang Food & Culture Escape`。它是为了保证产品流程可以重复演示而准备的固定数据，不代表真实预订、实时价格或实时天气。

| 项目 | 内容 |
| --- | --- |
| Trip ID | `TRP-PEN-2403` |
| 目的地 | Penang, Malaysia |
| 时长 | 3 天 |
| 成员 | Alex、Jamie、Sam、Taylor |
| 总预算 | RM 4,800（全组、全程） |
| 共同兴趣 | Food、Culture、Relaxed pace |
| Sam 的限制 | Vegetarian；每日步行硬上限 9.0 km；舒适目标 ≤5.0 km |
| Taylor 的偏好 | 保留购物时间 |
| 固定安排 | Day 2 · 19:30 · Hai Keng Restaurant dinner |
| 暴雨事件 | Day 2 · 13:30；影响 14:00–17:00 户外活动 |

预算基线如下：

| 类别 | 上限 | 当前正式版本预计 |
| --- | ---: | ---: |
| Stay | RM 1,900 | RM 1,800 |
| Food | RM 1,200 | RM 1,040 |
| Transport | RM 700 | RM 540 |
| Activities | RM 1,000 | RM 980 |
| **Total** | **RM 4,800** | **RM 4,360** |

当前正式版本预计剩余 `RM 440`。暴雨重排的推荐方案会将交通从 `RM 540` 调整到 `RM 580`，总预计花费变为 `RM 4,400`，剩余 `RM 400`。

## 状态和数据来源说明

页面上的状态标签有明确含义：

| 标签 | 含义 |
| --- | --- |
| `Confirmed` | 已通过当前流程确认或校验的状态 |
| `Estimated` | 路线、时间、费用、Harmony、Energy 或成员满意度的系统估算 |
| `Demo data` | 来自固定演示 Fixture 的数据 |
| `Locked` | 用户固定的安排，优化和重排不能直接覆盖 |
| `Needs approval` / `Pending` | 候选草稿，尚未写入正式行程 |
| `Risk` | 需要用户注意的天气、疲劳或其他影响，不等同于硬约束违规 |

TripMind 的核心信任原则是把事实、估算、演示数据和待批准候选分开表达。当前演示中的路线、成本、天气、Harmony、Energy 和成员满意度均为固定或系统估算；使用真实旅行时，仍应在出发前确认营业时间、交通、天气、票务和餐厅安排。

## 页面和路由

| 路由 | 页面 | 用途 |
| --- | --- | --- |
| `/` | Home / AI Chatbox | 从一句模糊想法开始，或加载 Penang Demo |
| `/chat/demo` | Agent follow-up | 补问目的地、天数并查看当前条件 |
| `/chat/demo?stage=ready` | Pre-generation review | 确认需求并进入生成流程 |
| `/trips/penang-demo/itinerary` | Itinerary | 查看时间线、指标、Agent 修改和邀请成员 |
| `/trips/penang-demo/itinerary?panel=energy` | Travel Energy | 比较和审批低步行方案 |
| `/trips/penang-demo/consensus` | Group Harmony | 查看群组偏好、满意度和 Harmony 优化 |
| `/trips/penang-demo/replan` | Rain replan | 模拟暴雨并选择局部重排方案 |
| `/trips/penang-demo/budget` | Budget & version review | 对比费用、查看历史并审批草稿 |

行程区域在桌面端使用顶部导航，在移动端使用底部导航。页面适配移动端窄屏，Energy 和 Agent 以抽屉形式打开；项目同时提供 PWA manifest 和 standalone 显示配置。

## 版本、草稿和状态规则

TripMind 把“当前正式行程”和“待审批候选”分开保存：

1. 首次生成并通过硬约束校验后，保存为正式 `Version 1`。
2. 修改、Harmony、Energy 或 Replan 先创建以当前版本为基准的 `Pending draft`。
3. 草稿记录 `baseVersion`、候选原因、创建时间和过期时间。
4. 用户批准时，系统再次读取批准瞬间的当前版本并重新校验。
5. 校验通过后才创建 `currentVersion + 1`，旧版本保留在历史中。
6. 如果版本已经变化或草稿过期，草稿不可批准，需要从最新版本重新生成。
7. 取消草稿、跳过能力或关闭预览不会改变正式指标和版本号。

推荐的完整演示顺序是：

```text
Version 1 首次生成
→ Version 2 批准“第二天晚一点开始”
→ Version 3 批准 Harmony
→ Version 4 批准 Energy
→ Version 5 批准暴雨重排
```

版本号并不绑定固定功能；如果跳过某一步，后续批准会根据当时的正式版本继续递增。

## 数据持久化与重置

当前交互原型使用浏览器 `localStorage` 保存状态：

```text
tripmind-prototype-state-v1
```

因此刷新页面、返回上一页或直接打开子路由后，当前版本、待审批草稿和版本历史仍可恢复。数据只保存在当前浏览器中，不会同步到服务器或其他设备。

在行程区域点击 `Reset Demo`，确认后会清除：

- 当前正式版本；
- 待审批草稿；
- 版本历史；
- 当前 Demo / 新用户状态。

重置后回到首页，可以重新加载 Penang Demo。

## AI、确定性逻辑与数据流

TripMind 的产品设计将 AI 与规则计算分开：

```text
用户自然语言
   ↓
Business Scope Guard
   ↓
TripMind Agent
   ├─ 需求提取与补问
   ├─ 偏好协调与解释
   ├─ 候选方案编排
   └─ 修改原因与影响说明
          ↓
确定性领域逻辑
   ├─ TripState / 版本状态
   ├─ 时间、交通与缓冲校验
   ├─ 预算计算
   ├─ Harmony / 最低满意度保护
   ├─ Travel Energy / 疲劳风险
   └─ Experience Diff / 版本审批
          ↓
正式行程或待审批草稿
```

在完整产品形态中，AI Provider、地图/地点/路线 Provider 和天气 Provider 都应通过 adapter 接入；核心 Agent、数据契约、校验器和业务规则不应绑定某一个供应商。真实密钥只应存在服务器环境，不进入浏览器 bundle、日志或仓库。

## 技术栈

- **Next.js 15**：App Router、页面路由和应用壳层。
- **React 19**：页面交互和组件状态。
- **TypeScript**：类型安全和共享数据结构。
- **Lucide React**：图标系统。
- **CSS**：响应式布局、颜色 token、时间线、卡片、抽屉和状态样式。
- **Browser localStorage**：当前原型的本地状态持久化。
- **PWA Manifest**：支持添加到主屏幕的应用形态配置。

项目当前不依赖 Tailwind、数据库、认证服务、真实 AI Provider、地图 API 或天气 API；这些属于后续接入真实产品时的替换点。

## 项目结构

```text
tripmind-ai/
├─ app/
│  ├─ page.tsx                         # 首页 Chatbox
│  ├─ chat/demo/page.tsx               # Agent 补问与生成确认
│  ├─ trips/penang-demo/itinerary/     # 行程时间线与 Agent / Energy 抽屉
│  ├─ trips/penang-demo/consensus/     # Group Harmony
│  ├─ trips/penang-demo/replan/        # 暴雨局部重排
│  ├─ trips/penang-demo/budget/        # 预算与版本审批
│  ├─ globals.css                      # 全局设计系统与响应式样式
│  └─ manifest.ts                      # PWA manifest
├─ components/
│  ├─ app-shell.tsx                    # 顶部 / 移动端导航、通知和重置
│  ├─ home-screen.tsx                  # 首页体验
│  ├─ chat-screen.tsx                  # Agent 对话、需求卡和生成状态
│  ├─ itinerary-screen.tsx             # 时间线、指标和两个抽屉
│  ├─ consensus-screen.tsx             # Harmony 视图
│  ├─ replan-screen.tsx                # Replan 方案与 Experience Diff
│  ├─ budget-screen.tsx                # 预算和版本历史
│  └─ ui.tsx                           # 通用按钮、标签、卡片和差异组件
├─ lib/
│  ├─ demo-data.ts                     # Demo Fixture、预算、指标和重排候选
│  └─ trip-store.tsx                   # Trip 状态、草稿和版本操作
├─ public/
│  └─ icon.svg                         # 应用图标
├─ docx/
│  ├─ plan.md                          # 产品实施计划
│  ├─ prototype-plan.md                # Prototype 范围与验收
│  └─ prototype.md                     # 页面设计与交互说明
├─ dataflow.png                        # 产品数据流示意图
├─ package.json
└─ README.md
```

## 本地运行

### 环境要求

- Node.js 22+；
- npm 10+；
- 不需要 API key、数据库或第三方账号即可运行固定演示。

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

### 生产构建

```bash
npm run build
npm run start
```

### 可用脚本

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动 Next.js 开发服务器 |
| `npm run build` | 创建生产构建 |
| `npm run start` | 启动生产服务器 |
| `npm run typecheck` | 执行 TypeScript 类型检查 |

## 快速验收清单

启动应用后，可以按以下顺序检查完整体验：

1. 首页 Chatbox 是否可以输入旅行想法并进入 Agent 页面；
2. Agent 是否显示当前条件，并只要求补齐必要信息；
3. 需求确认页是否显示来源和五步生成进度；
4. Itinerary 是否显示三天时间线、预算摘要和锁定晚餐；
5. `Ask Agent` 是否先生成修改预览，再由用户批准；
6. Harmony 是否显示整体分数、成员满意度、最低满意度和调整原因；
7. Energy 是否显示 `8.4 km → 4.6 km`、休息块和疲劳风险变化；
8. Rain replan 是否提供三种不同预算/体验取舍的方案；
9. Experience Diff 是否显示预算、步行、风险、体验保留和固定安排影响；
10. Budget 是否显示待审批草稿、分类预算和历史版本；
11. 取消草稿后正式版本是否保持不变；
12. 刷新页面后 localStorage 是否恢复状态，`Reset Demo` 是否清空状态。

## 设计原则

- **Understand first, generate second**：先理解用户，再生成行程。
- **Progressive disclosure**：先完成首版规划，再按需要打开 Harmony、Energy、Budget 和 Replan。
- **Explain every trade-off**：所有关键改变都说明影响和代价。
- **Protect the outlier**：整体优化不能牺牲最需要被照顾的成员。
- **Facts versus estimates**：已确认事实、估算、Demo 数据和待审批候选必须明确区分。
- **Protect fixed arrangements**：锁定安排不能被自动覆盖。
- **Calm over dashboard**：用清晰的时间线和卡片承载复杂决策，而不是堆叠指标。
- **Mobile-first**：在手机上也能完成 Chatbox、查看行程和审批流程。

## 产品规划与后续扩展

当前仓库重点验证核心用户体验，但产品设计已经为以下方向预留了完整边界：

- 真实 AI Provider 与结构化工具调用；
- 真实地点、地图、路线和天气 Provider；
- Supabase 持久化、认证、成员权限和 RLS；
- 可撤销、可过期的邀请链接和成员协作；
- 成员偏好、投票、投票截止时间和活动确认；
- 预算设置、成员预算适配检查和预算约束下重新规划；
- Surprise Me 的 Safe / Balanced / Adventurous 探索推荐；
- 延误、景点关闭、身体不适和成员退出等更多事件类型；
- 旅行进行中状态、完成记录和最终行程总结；
- 管理员总览、Provider 健康检查和可审计的可恢复管理动作。

这些能力都应复用同一套 TripState、权限、约束校验、审批和版本事件模型，而不是重新建立互相独立的状态来源。

## 当前实现边界

本仓库是 TripMind 的前端交互原型，完整展示了从 Chatbox 开始，到行程生成、Harmony、Energy、暴雨重排、预算复核和版本审批的用户体验。为了做到可重复演示，当前实现使用固定 Penang Fixture 和浏览器本地状态。

以下能力尚未接入真实服务：

- 真实 LLM、实时对话记忆和服务器端 Agent；
- 真实账号、认证、数据库和跨设备同步；
- 真实地图、地点、路线、天气和价格接口；
- 真实预订、付款、票务或住宿交易；
- 真实邀请加入、成员权限和群组反馈；
- 真实的 Discover / Surprise Me 推荐；
- 完整离线编辑、后台同步和推送通知。

因此页面中出现的路线、费用、天气、Harmony、Energy 和满意度数值只能用于产品体验与流程演示，不能视为实时旅行建议、医疗建议或报价。

## 相关文档

- [产品实施计划](./docx/plan.md)：定位、目标用户、MVP 范围、数据模型、API 策略和验收标准。
- [Prototype 计划](./docx/prototype-plan.md)：八个核心画面、演示脚本和原型验收标准。
- [Prototype 设计说明](./docx/prototype.md)：页面结构、文案、交互和视觉规范。
- [数据流示意图](./dataflow.png)：从用户输入到行程状态和审批的流程示意。

## License

当前仓库未单独声明开源许可证。如需公开发布或被其他项目复用，请先补充许可证、第三方依赖归属和数据来源说明。
