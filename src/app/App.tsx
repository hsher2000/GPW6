import {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
} from "react";
import { supabase } from "../lib/supabase";

import {
  X,
  Play,
  Settings,
  Grid,
  User,
  Shield,
  Plus,
  Trash2,
  Edit3,
  Save,
  Clock,
  Cpu,
  Zap,
  Code,
  Lock,
  ChevronRight,
  Film,
  Tag,
  AlertTriangle,
  Gamepad2,
  Terminal,
  Eye,
  EyeOff,
  Activity,
  Database,
  Globe,
  Award,
  ChevronLeft,
  Layers,
  Target,
  Radio,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Game {
  id: string;
  title: string;
  subtitle: string;
  genre: string;
  engine: string;
  startDate: string;
  endDate: string;
  status: "completed" | "in-progress" | "prototype";
  description: string;
  analysis: string;
  optimization: string;
  implementation: string;
  implImages: string[];
  screenshots: string[];
  videoUrl: string;
  tags: string[];
  teamSize: number;
  role: string;
  platforms: string[];
  highlights: string[];
}

type NavSection = "portfolio" | "about" | "admin";
type ModalTab =
  | "overview"
  | "analysis"
  | "optimization"
  | "implementation"
  | "media";
type Lang = "en" | "cn";

// ─── i18n ─────────────────────────────────────────────────────────────────────

const GENRE_LABELS: Record<string, { en: string; cn: string }> =
  {
    All: { en: "All", cn: "全部" },
    Action: { en: "Action", cn: "动作" },
    Adventure: { en: "Adventure", cn: "冒险" },
    RPG: { en: "RPG", cn: "角色扮演" },
    Strategy: { en: "Strategy", cn: "策略" },
    Simulation: { en: "Simulation", cn: "模拟" },
    Sports: { en: "Sports", cn: "体育" },
    Racing: { en: "Racing", cn: "赛车" },
    Fighting: { en: "Fighting", cn: "格斗" },
    Shooter: { en: "Shooter", cn: "射击" },
    Platformer: { en: "Platformer", cn: "平台跳跃" },
    Puzzle: { en: "Puzzle", cn: "益智" },
    Horror: { en: "Horror", cn: "恐怖" },
    Stealth: { en: "Stealth", cn: "潜行" },
    "Open World": { en: "Open World", cn: "开放世界" },
    Roguelike: { en: "Roguelike", cn: "肉鸽" },
    "Tower Defense": { en: "Tower Defense", cn: "塔防" },
    Survival: { en: "Survival", cn: "生存" },
    Sandbox: { en: "Sandbox", cn: "沙盒" },
  };

function tGenre(genre: string, lang: Lang): string {
  return GENRE_LABELS[genre]?.[lang] ?? genre;
}

const T = {
  en: {
    navPortfolio: "PORTFOLIO",
    navAbout: "ABOUT",
    navAdmin: "ADMIN CMS",
    sysOk: "SYS_OK",
    heroTag: "// GAME_DEVELOPER_PORTFOLIO",
    heroH1: ["FORGE", "GREAT", "GAMES"],
    heroDesc: (n: number) =>
      `Systems programming, AI, and engine architecture across ${n} shipped titles. Specializing in high-performance simulation, emergent gameplay systems, and real-time multiplayer.`,
    statShipped: "SHIPPED",
    statEngines: "ENGINES",
    statPlatforms: "PLATFORMS",
    statYrs: "YRS EXP",
    filterLabel: "FILTER_BY_GENRE",
    filterAll: (n: number) => `ALL (${n})`,
    filterResults: (n: number) => `${n} RESULTS`,
    noResults: "NO_RESULTS_FOUND // ADJUST FILTER PARAMETERS",
    cardTeam: "TEAM",
    cardRole: "ROLE",
    cardPlat: "PLAT",
    statusCompleted: "COMPLETED",
    statusInProgress: "IN PROGRESS",
    statusPrototype: "PROTOTYPE",
    tabOverview: "OVERVIEW",
    tabAnalysis: "ANALYSIS",
    tabOptimization: "OPTIMIZATION",
    tabImpl: "IMPL.",
    tabMedia: "MEDIA",
    keyMetrics: "// KEY_METRICS",
    gameplayDemo: "// GAMEPLAY_DEMO",
    videoMissing: "VIDEO_URL_NOT_CONFIGURED",
    contentLabel: (tab: string) =>
      `// ${tab.toUpperCase()}_NOTES`,
    sidebarInfo: "PROJECT_INFO",
    sidebarPlatforms: "PLATFORMS",
    sidebarTags: "TECH_TAGS",
    metaEngine: "ENGINE",
    metaGenre: "GENRE",
    metaRole: "ROLE",
    metaTeamSize: "TEAM_SIZE",
    metaTimeline: "TIMELINE",
    metaDevs: (n: number) => `${n} dev${n !== 1 ? "s" : ""}`,
    aboutTag: "// ABOUT",
    aboutH: ["GAMES", "UX", "DESIGN"],
    aboutP: [
      "I have years of experience conducting in-depth research on game user experience and interaction design. Since 2018, I have thoroughly tested a full range of mobile and console games across casual, FPS, SLG, action, RPG and AAA console categories, logging extensive long-term playtime.",
      "I am adept at breaking down core design logic of various games, focusing on UI interaction, level rhythm, audio-visual and haptic immersive design, gameplay mechanics and commercial monetization systems. Familiar with multiple product formats including merge games, classic shooters, sandbox strategy, single-player console games and VR immersive works, I can horizontally compare the strengths and weaknesses of different game genres.",
      "I possess a comprehensive framework for game experience review, able to deliver multi-dimensional analysis based on player feelings, progression systems, monetization logic and interaction details. With abundant first-hand player research insights, I am a strong fit for positions related to game interaction design, game planning and product analysis.",
    ],
    techStack: "// TECHNICAL_STACK",
    skillCats: [
      "ENGINE",
      "INTERACTION SYSTEMS",
      "UX TOOLCHAIN",
      "AI ASSISTANT TOOLS",
    ],
    skillItems: [
      ["Unity 2022 LTS", "Godot 4", "WebGL", "Electron"],
      [
        "Component-based UI Architecture",
        "State-Driven Interaction",
        "Procedural UI Generation",
        "Interaction Behavior Trees",
        "GPU UI Rendering",
      ],
      [
        "Figma Interactive Prototyping",
        "Framer",
        "UMG/UGUI",
        "RenderDoc",
        "Performance Analysis Suite (Unreal Insights / Unity Profiler / PIX / VTune)",
      ],
      [
        "OpenAI Codex",
        "GitHub Copilot",
        "Midjourney",
        "Figma AI Plugins",
        "Cursor AI",
        "Unreal GenAI Plugins",
      ],
    ],
    adminAccess: "ADMIN_ACCESS",
    enterCode: "ENTER CLEARANCE CODE:",
    authenticate: "AUTHENTICATE",
    demoPass: "",
    accessDenied: "ACCESS_DENIED // INVALID_CREDENTIALS",
    cmsPanel: "CMS_CONTROL_PANEL",
    gameEntries: (n: number) => `GAME ENTRIES (${n})`,
    addGame: "ADD GAME",
    savedLabel: "SAVED",
    editBtn: "EDIT",
    delBtn: "DEL",
    backBtn: "← BACK",
    editingTitle: (t: string) => `EDITING: ${t}`,
    addNewGame: "ADD NEW GAME",
    saveChanges: "SAVE CHANGES",
    createEntry: "CREATE ENTRY",
    cancel: "CANCEL",
    deleteConfirm: "Delete this game entry?",
    formBasicInfo: "BASIC INFO",
    formContent: "CONTENT",
    formMedia: "MEDIA",
    fTitle: "TITLE *",
    fSubtitle: "SUBTITLE",
    fEngine: "ENGINE *",
    fRole: "ROLE",
    fStart: "START DATE (YYYY-MM)",
    fEnd: "END DATE (YYYY-MM)",
    fGenre: "GENRE",
    fStatus: "STATUS",
    fTeam: "TEAM SIZE",
    fPlatforms: "PLATFORMS (comma-separated)",
    fTags: "TAGS (comma-separated)",
    fMetrics: "KEY METRICS (comma-separated)",
    fDesc: "DESCRIPTION",
    fAnalysis: "PROJECT ANALYSIS",
    fOpt: "OPTIMIZATION STRATEGIES",
    fImpl: "IMPLEMENTATION DETAILS",
    fImplImg1: "IMPLEMENTATION IMAGE 1 URL",
    fImplImg2: "IMPLEMENTATION IMAGE 2 URL",
    fImplImg3: "IMPLEMENTATION IMAGE 3 URL",
    fShot1: "SCREENSHOT 1 URL",
    fShot2: "SCREENSHOT 2 URL",
    fShot3: "SCREENSHOT 3 URL",
    fVideo: "VIDEO EMBED URL (YouTube /embed/...)",
    sCompleted: "Completed",
    sInProgress: "In Progress",
    sPrototype: "Prototype",
    footerCopy:
      "GAME_EXPERIENCE_DESIGN © 2026 // ALL_RIGHTS_RESERVED",
    footerBuilt: "BUILT_WITH: React + TypeScript + Tailwind",
    wchatGuideTitle: "WECHAT OFFICIAL ACCOUNT MEDIA",
    wchatGuideImg:
      "Images: paste mmbiz.qpic.cn/... URLs directly from WeChat articles",
    wchatGuideVideoTencent:
      "Videos (recommended): paste v.qq.com page link — auto-converts to embed",
    wchatGuideVideoWx:
      "WeChat internal videos (mp.weixin.qq.com): rendered as an external link",
    convertToEmbed: "CONVERT TO EMBED ↗",
    openExternal: "OPEN VIDEO ↗",
    urlConverted: "Converted to embed URL",
    imgPreviewFail: "Preview unavailable",
  },
  cn: {
    navPortfolio: "作品集",
    navAbout: "关于",
    navAdmin: "管理系统",
    sysOk: "系统正常",
    heroTag: "// 游戏作品集",
    heroH1: ["以体验铸精品", "造极致卓越游戏"],
    heroDesc: (n: number) =>
      `深耕全品类游戏，擅长 ${n} 款游戏，交互玩法商业化多维拆解分析。`,
    statShipped: "已发布",
    statEngines: "引擎",
    statPlatforms: "平台",
    statYrs: "年经验",
    filterLabel: "按类型筛选",
    filterAll: (n: number) => `全部 (${n})`,
    filterResults: (n: number) => `${n} 个结果`,
    noResults: "暂无结果 // 请调整筛选条件",
    cardTeam: "团队",
    cardRole: "职位",
    cardPlat: "平台",
    statusCompleted: "已完成",
    statusInProgress: "进行中",
    statusPrototype: "原型",
    tabOverview: "概览",
    tabAnalysis: "分析",
    tabOptimization: "优化",
    tabImpl: "实现",
    tabMedia: "媒体",
    keyMetrics: "// 关键指标",
    gameplayDemo: "// 演示视频",
    videoMissing: "视频地址未配置",
    contentLabel: (tab: string) =>
      ({
        analysis: "// 分析笔记",
        optimization: "// 优化笔记",
        implementation: "// 实现笔记",
      })[tab] ?? `// ${tab.toUpperCase()}`,
    sidebarInfo: "项目信息",
    sidebarPlatforms: "平台",
    sidebarTags: "技术标签",
    metaEngine: "引擎",
    metaGenre: "类型",
    metaRole: "职位",
    metaTeamSize: "团队规模",
    metaTimeline: "时间线",
    metaDevs: (n: number) => `${n} 人`,
    aboutTag: "// 个人简介",
    aboutH: ["游戏", "UX", "设计师"],
    aboutP: [
      "深耕游戏行业体验与交互研究，多年持续深度体验手游、主机全品类游戏，覆盖休闲、FPS、SLG、动作、角色扮演、主机 3A 等赛道，游玩跨度自 2018 年至今，累计大量长线深度游玩时长。",
      "擅长拆解各类游戏核心设计逻辑，重点研究界面交互、关卡节奏、视听触觉沉浸设计、玩法机制与商业化付费体系；熟悉二合一类、传统射击、沙盘策略、主机单机、VR 沉浸式等多元产品模式，能够横向对比不同品类产品优势与短板。",
      "具备完整游戏体验复盘视角，可从玩家感受、段位进度、付费逻辑、交互细节多维度输出分析，拥有丰富的游戏用户视角调研积累，适配游戏交互、策划、产品分析相关工作。 ",
    ],
    techStack: "// 技术栈",
    skillCats: ["引擎", "交互系统", "UX 工具链", "AI 辅助工具"],
    skillItems: [
      ["Unity 2022 LTS", "Godot 4", "WebGL", "Electron"],
      [
        "基于组件的 UI 架构",
        "状态驱动交互",
        "程序化 UI 生成",
        "交互行为树",
        "GPU UI 渲染",
      ],
      [
        "Figma 交互原型",
        "Framer",
        "UMG/UGUI",
        "RenderDoc",
        "性能分析套件（Unreal Insights / Unity Profiler / PIX / VTune）",
      ],
      [
        "OpenAI Codex",
        "GitHub Copilot",
        "Midjourney",
        "Figma AI 插件",
        "Cursor AI",
        "Unreal GenAI 插件",
      ],
    ],
    adminAccess: "管理员访问",
    enterCode: "输入验证码：",
    authenticate: "验证登录",
    demoPass: "",
    accessDenied: "访问拒绝 // 凭据无效",
    cmsPanel: "内容管理面板",
    gameEntries: (n: number) => `游戏条目 (${n})`,
    addGame: "添加游戏",
    savedLabel: "已保存",
    editBtn: "编辑",
    delBtn: "删除",
    backBtn: "← 返回",
    editingTitle: (t: string) => `编辑：${t}`,
    addNewGame: "添加新游戏",
    saveChanges: "保存更改",
    createEntry: "创建条目",
    cancel: "取消",
    deleteConfirm: "确定删除此游戏条目？",
    formBasicInfo: "基本信息",
    formContent: "内容",
    formMedia: "媒体",
    fTitle: "标题 *",
    fSubtitle: "副标题",
    fEngine: "引擎 *",
    fRole: "职位",
    fStart: "开始日期 (YYYY-MM)",
    fEnd: "结束日期 (YYYY-MM)",
    fGenre: "类型",
    fStatus: "状态",
    fTeam: "团队规模",
    fPlatforms: "平台（逗号分隔）",
    fTags: "标签（逗号分隔）",
    fMetrics: "关键指标（逗号分隔）",
    fDesc: "项目描述",
    fAnalysis: "项目分析",
    fOpt: "优化策略",
    fImpl: "实现细节",
    fImplImg1: "实现图片1 URL",
    fImplImg2: "实现图片2 URL",
    fImplImg3: "实现图片3 URL",
    fShot1: "截图1 URL",
    fShot2: "截图2 URL",
    fShot3: "截图3 URL",
    fVideo: "视频嵌入地址（YouTube /embed/...）",
    sCompleted: "已完成",
    sInProgress: "进行中",
    sPrototype: "原型",
    footerCopy: "游戏体验设计 © 2026 // 版权所有",
    footerBuilt: "基于：React + TypeScript + Tailwind 构建",
    wchatGuideTitle: "微信公众号媒体资源",
    wchatGuideImg:
      "图片：直接粘贴文章中的图片链接（mmbiz.qpic.cn/...）",
    wchatGuideVideoTencent:
      "视频（推荐）：粘贴腾讯视频页面链接（v.qq.com/x/page/...），自动转换为嵌入格式",
    wchatGuideVideoWx:
      "微信内部视频（mp.weixin.qq.com）：以外部跳转链接形式展示",
    convertToEmbed: "转换为嵌入链接 ↗",
    openExternal: "打开视频 ↗",
    urlConverted: "已转换为嵌入链接",
    imgPreviewFail: "预览不可用",
  },
} as const;

type Tr = typeof T.en;

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Tr;
}>({
  lang: "en",
  setLang: () => {},
  t: T.en,
});

function useLang() {
  return useContext(LangContext);
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_GAMES: Game[] = [
  {
    id: "1",
    title: "NEXUS PROTOCOL",
    subtitle: "Tactical FPS with adaptive AI squads",
    genre: "Shooter",
    engine: "Unreal Engine 5",
    startDate: "2023-03",
    endDate: "2024-01",
    status: "completed",
    description:
      "A near-future tactical FPS where players command adaptive AI squads against a rogue neural network. Features fully destructible environments powered by Chaos Physics and real-time global illumination via Lumen.",
    analysis:
      "Core challenge was achieving sub-16ms frame times while running 12 independent AI agents with full NavMesh pathfinding. Profiling revealed 40% of CPU time was spent in collision queries. Switched to async spatial hashing with frame-distributed updates, reducing agent overhead by 62%. Memory budget required careful streaming — implemented a predictive asset loader based on player trajectory and eyeline vectors.",
    optimization:
      "Implemented GPU-driven rendering pipeline cutting draw calls from 3,200 to 480 per frame. Replaced per-bone physics simulation with procedural secondary motion using spring dampers. Nanite virtualized geometry allowed 50M+ polygon environments at stable 60fps. Custom LOD bias system per material type reduced VRAM usage by 28%.",
    implementation:
      "AI decision making uses Utility AI with a weighted scoring system across 18 contextual factors. Squad coordination implemented via Blackboard sharing over a shared spatial awareness grid. Cover system uses async raycasting with pre-baked cover point metadata. Replication uses delta compression with client-side prediction for 128-tick servers.",
    screenshots: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&h=560&fit=crop&auto=format",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["FPS", "AI", "Multiplayer", "UE5", "Destructible"],
    teamSize: 4,
    role: "Lead Programmer",
    platforms: ["PC", "Xbox Series X"],
    highlights: [
      "62% AI CPU reduction",
      "480 draw calls/frame",
      "128-tick servers",
    ],
  },
  {
    id: "2",
    title: "VOID CRAWLER",
    subtitle:
      "Procedural roguelike with entropy-based generation",
    genre: "Roguelike",
    engine: "Godot 4",
    startDate: "2022-06",
    endDate: "2023-02",
    status: "completed",
    description:
      "A dark sci-fi roguelike where every dungeon is generated from a unique entropy seed that governs not just layout but enemy behavior, loot probability curves, and environmental hazards. 140+ room archetypes.",
    analysis:
      "Procedural generation required a seeded determinism system reproducible across platforms. Custom wave function collapse implementation with backtracking handles up to 512×512 tile spaces in under 80ms. Balancing loot curves proved hardest — implemented a Monte Carlo simulation pipeline that runs 10,000 virtual playthroughs per seed to validate challenge curves before shipping a generation config.",
    optimization:
      "Tile rendering uses chunk-based dirty-flagging — only re-renders affected 32×32 tile chunks on mutation. Enemy behavior runs on a priority queue scheduler allowing 80+ active agents at 60fps on mid-range hardware. Asset streaming uses a ring-buffer preloader keyed to room adjacency graph traversal depth.",
    implementation:
      "Room generation uses a constraint propagation algorithm with domain reduction. Enemy AI implemented as a stack-based finite state machine with interrupt priority layers. Combat uses a real-time simulation tick at 20hz with interpolated rendering at display refresh rate. Save system serializes full game state including RNG stream position for perfect resume fidelity.",
    screenshots: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=560&fit=crop&auto=format",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: [
      "Roguelike",
      "Procedural",
      "Solo",
      "Godot",
      "Dark Sci-Fi",
    ],
    teamSize: 1,
    role: "Solo Developer",
    platforms: ["PC", "Linux", "Web"],
    highlights: [
      "140+ room archetypes",
      "80ms generation time",
      "10K virtual playthroughs",
    ],
  },
  {
    id: "3",
    title: "IRON SIEGE",
    subtitle: "Large-scale RTS with emergent faction politics",
    genre: "Strategy",
    engine: "Unity 2022 LTS",
    startDate: "2023-01",
    endDate: "2023-11",
    status: "completed",
    description:
      "A classical RTS supporting 8-player battles with 2,000+ simultaneous units. Emergent diplomacy system where AI factions form alliances based on resource scarcity and threat modeling. Built for competitive esports.",
    analysis:
      "Supporting 2,000 simultaneous units required abandoning Unity's built-in physics for a custom ECS-based movement system. Flocking algorithm based on Boid rules with group cohesion weights. Biggest challenge was rendering — moved to GPU instancing with indirect draw calls. The diplomatic AI required 6 iterations to avoid degenerate alliance loops that would lock players out.",
    optimization:
      "Implemented a custom spatial hash grid for unit-vs-unit queries, reducing O(n²) collision checks to O(n log n). Pathfinding uses flow field computation shared across units of the same faction rather than per-unit A*. GPU culling removes off-screen units before draw submission. Simulation runs on a fixed 10hz tick, fully decoupled from the 60fps render loop.",
    implementation:
      "ECS architecture uses archetype-based storage for cache-friendly iteration over 2,000+ entities. Command system uses a lockstep protocol with CRC verification for deterministic multiplayer. Fog of war implemented as a 512×512 bitfield updated on a background thread. Terrain deformation uses mesh decimation with normal map baking at runtime.",
    screenshots: [
      "https://images.unsplash.com/photo-1536152470836-b962db5bd0d2?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=900&h=560&fit=crop&auto=format",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: [
      "RTS",
      "Multiplayer",
      "ECS",
      "Esports",
      "AI Factions",
    ],
    teamSize: 6,
    role: "Systems Programmer",
    platforms: ["PC"],
    highlights: [
      "2,000+ simultaneous units",
      "8-player support",
      "10hz sim / 60fps render",
    ],
  },
  {
    id: "4",
    title: "PHANTOM DRIFT",
    subtitle:
      "Neon city street racing with dynamic weather systems",
    genre: "Racing",
    engine: "Unity 2022 LTS",
    startDate: "2022-01",
    endDate: "2022-09",
    status: "completed",
    description:
      "A high-speed street racing game set in a perpetually rain-soaked cyberpunk megalopolis. Physically accurate tire simulation, 24-player online races, and a procedurally updated weather and traffic system.",
    analysis:
      "Achieving realistic drift physics required Pacejka Magic Formula tire modeling rather than Unity's default wheel colliders. Wet surface traction uses a lookup table generated from polynomial approximations of rubber compound behavior at 0°C to 50°C. Online latency compensation was critical — implemented rollback netcode with a 6-frame buffer and input prediction.",
    optimization:
      "Traffic system uses a hierarchical LOD: full physics within 200m, simplified kinematic agents 200–800m, sprite-based billboards beyond. Headlight rendering switched from shadow-mapped spotlights to signed-distance field cookies, saving 3.2ms per frame. Reflection probes use parallel projection approximation rather than real-time capture.",
    implementation:
      "Vehicle controller built around a rigid body with 4 wheel ray-casts and full suspension simulation. Drift angle calculated from slip angle across rear axle, feeding a torque vectoring system. Weather transitions use a volumetric cloud SDF lerped over 90 seconds. Track generation uses a bezier spline system with banked curve calculation and barrier placement.",
    screenshots: [
      "https://images.unsplash.com/photo-1614680889531-e51f97d843f6?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1481681153217-38e8c33f2260?w=900&h=560&fit=crop&auto=format",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: [
      "Racing",
      "Physics",
      "Multiplayer",
      "Cyberpunk",
      "Online",
    ],
    teamSize: 3,
    role: "Lead Developer",
    platforms: ["PC", "PlayStation 5"],
    highlights: [
      "Pacejka tire physics",
      "24-player online",
      "6-frame rollback netcode",
    ],
  },
  {
    id: "5",
    title: "STELLAR COLLAPSE",
    subtitle:
      "Gravity-manipulation puzzle game set in dying stars",
    genre: "Puzzle",
    engine: "Custom WebGL (TypeScript)",
    startDate: "2023-04",
    endDate: "2023-08",
    status: "completed",
    description:
      "A minimalist browser-based puzzle game where players manipulate gravitational fields to guide matter into stellar cores. 80 handcrafted levels with emergent solutions. Runs at 60fps in WebGL2 with custom shader pipelines.",
    analysis:
      "Custom physics simulation needed to be deterministic for puzzle validation while being visually continuous. Used a Verlet integration scheme with constraint solving for 500+ particle interactions per frame. Puzzle design required a formal verification system — built a constraint solver in Python to prove each level has at least one solution before it ships.",
    optimization:
      "Particle simulation runs on a WebGL compute shader (via transform feedback) rather than CPU. Spatial bucketing reduces neighbor queries from O(n²) to O(n). GLSL shader for gravitational field visualization uses domain-warped noise with analytical derivatives for smooth normals. Bundle size kept to 180KB gzipped with tree-shaking and asset inlining.",
    implementation:
      "Game loop decouples physics (fixed 60hz) from render (RAF). Gravity wells implemented as point masses in an n-body solver truncated at 12 influencers per particle. Level format is a declarative JSON schema validated against JSON Schema before parsing. Save state uses localStorage with LZ compression for level completions and best-solution replay data.",
    screenshots: [
      "https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1614680889531-e51f97d843f6?w=900&h=560&fit=crop&auto=format",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["Puzzle", "WebGL", "Physics", "Browser", "Solo"],
    teamSize: 1,
    role: "Solo Developer",
    platforms: ["Web", "PC"],
    highlights: [
      "180KB bundle size",
      "500+ particles @ 60fps",
      "Formal puzzle verification",
    ],
  },
  {
    id: "6",
    title: "SHADOW PROTOCOL",
    subtitle: "Third-person stealth with systemic AI awareness",
    genre: "Stealth",
    engine: "Unreal Engine 5",
    startDate: "2024-01",
    endDate: "2024-09",
    status: "in-progress",
    description:
      "A Cold War-era stealth game with a deeply systemic AI awareness model. Guards share partial information across alert networks, investigate environmental anomalies, and adapt patrol patterns based on incident history during a session.",
    analysis:
      "The systemic AI required modeling information propagation — guards don't share perfect data, only what they directly witnessed, with degrading certainty over time. Implemented a belief system using Bayesian probability distributions over player position. Each guard maintains a private belief state that gets merged with radioed reports using a confidence weighting scheme.",
    optimization:
      "Stealth games demand expensive sight-line checks. Implemented hierarchical occlusion culling using portal graph traversal before issuing ray-casts. Moved guard sensory evaluation to a staggered async queue processed over 3 frames to spread CPU load. AI memory is stored in a compact bitfield per tile for the alert-history map, using 64KB for a 512×512 tile level.",
    implementation:
      "Guard AI uses a Hierarchical Task Network planner for high-level goal execution, backed by a behavior tree for reactive behaviors. Sound propagation uses a pre-baked impulse response convolved with event intensity at runtime. Environment interaction system uses an interface-based component model allowing any actor to register as an interactable with cost/benefit metadata queried by AI planners.",
    screenshots: [
      "https://images.unsplash.com/photo-1574173366424-94c06e9a6b8e?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=560&fit=crop&auto=format",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["Stealth", "AI", "UE5", "Systemic", "Cold War"],
    teamSize: 5,
    role: "AI Programmer",
    platforms: ["PC", "PlayStation 5", "Xbox Series X"],
    highlights: [
      "Bayesian belief system",
      "HTN planner",
      "Portal-based occlusion",
    ],
  },
  {
    id: "7",
    title: "GRID WARS",
    subtitle:
      "Asymmetric hex-grid strategy with fog of information",
    genre: "Strategy",
    engine: "Unity 2022 LTS",
    startDate: "2022-03",
    endDate: "2022-11",
    status: "completed",
    description:
      "An asymmetric turn-based strategy game on a hex grid where each faction has unique movement rules, resource types, and information access. Information asymmetry is the core mechanic — knowing less than your opponent is a strategic resource.",
    analysis:
      "Information asymmetry required separating game state into public and private layers per player. Challenge was ensuring the AI never accessed information its faction couldn't legitimately know. Implemented a perception filter that wraps all state access through a per-player lens. AI difficulty tuned by expanding/contracting the information aperture rather than giving it omniscient cheats.",
    optimization:
      "Hex pathfinding uses A* with a precomputed hex cost table. Influence map for AI territory assessment baked every 3 turns rather than per-action. Game state serialization uses a custom binary format (1,200 bytes per full state vs 8KB JSON) enabling fast undo trees and networked state sync.",
    implementation:
      "Hex grid implemented as axial coordinate system with cube coordinate conversions for range queries. Unit types use a data-driven design pattern — each unit archetype is a ScriptableObject with no code, only data. Replay system records all decisions as a compressed event log that can be replayed at variable speed.",
    screenshots: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1536152470836-b962db5bd0d2?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&h=560&fit=crop&auto=format",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: [
      "Strategy",
      "Hex Grid",
      "Asymmetric",
      "Turnbased",
      "AI",
    ],
    teamSize: 2,
    role: "Game Designer & Developer",
    platforms: ["PC", "Mobile"],
    highlights: [
      "Perception filter system",
      "1,200B binary state",
      "Info asymmetry mechanics",
    ],
  },
  {
    id: "8",
    title: "ECHO CHAMBER",
    subtitle:
      "Psychological horror driven by audio-reactive environments",
    genre: "Horror",
    engine: "Godot 4",
    startDate: "2023-05",
    endDate: "2023-10",
    status: "completed",
    description:
      "A first-person psychological horror game where the environment physically responds to sound. Loud footsteps wake dormant entities. Silence reveals hidden passages. The game processes microphone input to alter game state in real time.",
    analysis:
      "Real-time microphone input introduced significant cross-platform variance. Implemented adaptive gain normalization using a 5-second rolling RMS window to handle different microphone sensitivities. The biggest design challenge was preventing the mechanic from feeling punishing — added a grace period system and visual feedback for the sound threshold before negative consequences trigger.",
    optimization:
      "Audio analysis uses an FFT computed on a 1024-sample window at 48kHz, with band-pass filters isolating the 80–3,000hz range relevant for gameplay. Environmental geometry deformation uses a vertex shader driven by a per-room float parameter updated from the audio analysis. Occlusion queries prevent unnecessary environmental reactions in rooms the player isn't in.",
    implementation:
      "Microphone capture implemented via Godot AudioStreamMicrophone with custom GDExtension for FFT. Entity behavior uses a stimulus-response architecture — entities register interest in stimuli types and receive normalized intensity values. Environment interaction uses an observer pattern with event buses per room zone. Procedural sound design uses granular synthesis to create responsive ambient audio.",
    screenshots: [
      "https://images.unsplash.com/photo-1574173366424-94c06e9a6b8e?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1481681153217-38e8c33f2260?w=900&h=560&fit=crop&auto=format",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["Horror", "Audio", "Solo", "Godot", "Microphone"],
    teamSize: 1,
    role: "Solo Developer",
    platforms: ["PC", "Linux"],
    highlights: [
      "Live microphone input",
      "FFT band analysis",
      "Audio-reactive environments",
    ],
  },
  {
    id: "9",
    title: "APEX RUNNER",
    subtitle:
      "Momentum-based platformer with procedural parkour chaining",
    genre: "Platformer",
    engine: "Unity 2021 LTS",
    startDate: "2021-04",
    endDate: "2021-12",
    status: "completed",
    description:
      "A momentum-based 3D platformer where the environment is procedurally annotated for parkour routes. Players chain vaults, wall-runs, and slides — the game adapts its music tempo and camera behavior to the player's momentum state.",
    analysis:
      "Momentum preservation required a custom kinematic controller rather than Unity's CharacterController — needed to maintain velocity across state transitions (run→jump→wallrun) without artificial resets. The camera system was the most iterated component, going through 11 prototypes before landing on a spring-damper follow camera with momentum-based look-ahead.",
    optimization:
      "Environment annotation for parkour uses a pre-baked geometry analysis pass that tags surfaces with affordance metadata (wall-run surface, vault height, slide angle). At runtime, context-sensitive prompts are evaluated from a priority queue sorted by player proximity and current velocity vector. This avoids per-frame raycasting against all surfaces.",
    implementation:
      "Custom kinematic character controller uses a state machine with 14 states and explicit transition logic. Momentum vector is preserved across state changes using velocity projection onto the new movement surface normal. Procedural music system uses horizontal re-orchestration — stems layer in based on player speed quantized to 4 BPM breakpoints. Level design tooling built as a Unity Editor extension.",
    screenshots: [
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&h=560&fit=crop&auto=format",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: [
      "Platformer",
      "Parkour",
      "Momentum",
      "Unity",
      "Procedural",
    ],
    teamSize: 3,
    role: "Lead Developer",
    platforms: ["PC", "Nintendo Switch"],
    highlights: [
      "14-state kinematic controller",
      "11 camera prototypes",
      "Adaptive music stems",
    ],
  },
  {
    id: "10",
    title: "QUANTUM BREACH",
    subtitle:
      "Terminal-based hacking sim with real network topology",
    genre: "Simulation",
    engine: "Electron + React + Three.js",
    startDate: "2024-02",
    endDate: "2024-07",
    status: "completed",
    description:
      "A hacking simulator presented as a real terminal interface. Players navigate procedurally generated network topologies visualized in 3D, exploit simulated vulnerabilities using actual security concepts, and race against trace timers.",
    analysis:
      "The core design tension was authenticity vs. accessibility. Real hacking requires deep knowledge — the game needed to teach concepts through play. Implemented a progressive revelation system where the first 15 minutes introduce concepts in safe sandbox networks before exposing the full tool suite. User testing showed 80% completion rate in the tutorial compared to 35% with an earlier direct-start design.",
    optimization:
      "3D network graph visualization uses a force-directed layout computed on a Web Worker to avoid blocking the UI thread. Node rendering uses instanced PointCloud geometry reducing draw calls from O(nodes) to 1. Network simulation runs in a SharedArrayBuffer updated from the worker, read by the render thread without copying.",
    implementation:
      "Terminal emulator built from scratch using a canvas-based renderer for performance — DOM-based terminals lagged at 10,000 lines/second scroll. Network topology generator uses a Watts-Strogatz small-world graph algorithm. Vulnerability system uses a database of 40 simulated CVEs with real CVSS scoring. Trace system implements a bidirectional Dijkstra from target to player with real-time propagation.",
    screenshots: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1574173366424-94c06e9a6b8e?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&h=560&fit=crop&auto=format",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: [
      "Hacking",
      "Terminal",
      "Solo",
      "Electron",
      "Simulation",
    ],
    teamSize: 1,
    role: "Solo Developer",
    platforms: ["PC", "Linux", "Mac"],
    highlights: [
      "Canvas terminal renderer",
      "Force-directed 3D graphs",
      "40 simulated CVEs",
    ],
  },
  {
    id: "11",
    title: "MECH UPRISING",
    subtitle:
      "Third-person mech shooter with modular loadout destruction",
    genre: "Action",
    engine: "Unity 2022 LTS",
    startDate: "2022-05",
    endDate: "2023-01",
    status: "completed",
    description:
      "A third-person mech shooter where every component of your mech — legs, arms, torso, sensors — can be independently damaged or destroyed, altering your movement and combat capabilities. 6v6 competitive with ranked matchmaking.",
    analysis:
      "Modular mech damage required a component graph where each node tracks its own health and propagates functional dependencies. Destroying a mech's sensor array disables lock-on targeting. Destroying a leg changes movement parameters and enables opponents to predict your paths. Balancing 42 mech chassis × 120 weapon modules required statistical simulation of 2M loadout combinations.",
    optimization:
      "Mech rendering uses a custom shader that samples a damage texture atlas to show localized scorching and deformation without geometry modification. Network replication prioritizes component health deltas over full state sync — damaged components are flagged dirty and sent on the next tick. Physics for mech movement runs at 120hz with render interpolation.",
    implementation:
      "Component system uses a directed acyclic graph where each part registers dependencies on others. Damage propagation traverses the DAG and computes capability degradation as a weighted sum of intact dependencies. Combat log system records every hit with positional data, damage type, and component state for post-match analysis and anti-cheat validation.",
    screenshots: [
      "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&h=560&fit=crop&auto=format",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: [
      "Mech",
      "Shooter",
      "Multiplayer",
      "Modular",
      "Competitive",
    ],
    teamSize: 4,
    role: "Combat Systems",
    platforms: ["PC", "Xbox Series X"],
    highlights: [
      "42 chassis × 120 weapons",
      "DAG damage propagation",
      "2M loadout simulations",
    ],
  },
  {
    id: "12",
    title: "DARK HARVEST",
    subtitle:
      "Survival horror with ecosystem-driven threat generation",
    genre: "Survival",
    engine: "Godot 4",
    startDate: "2023-06",
    endDate: "2024-02",
    status: "completed",
    description:
      "A survival horror game in a living ecosystem where threat generation emerges from resource depletion dynamics. Overhunt prey species and their predators migrate toward the player. Ignore the cold and hypothermia degrades your perception.",
    analysis:
      "Ecosystem simulation needed to feel organic without being opaque to the player. Implemented a Lotka-Volterra predator-prey model with 8 species across 4 trophic levels. Tuning the model to create tension without guaranteed death required 400+ simulation runs and a custom balancing tool built in Python that visualized population dynamics over 30 in-game days.",
    optimization:
      "Ecosystem simulation runs on a spatial grid updated in 16×16 tile chunks. Only chunks within 1,200m of the player are fully simulated; beyond that, a statistical approximation model is used. Hypothermia system samples the player's recent velocity and proximity to heat sources using a 60-second exponential moving average rather than per-frame computation.",
    implementation:
      "Ecosystem implemented as a system of differential equations solved with RK4 integration at 1hz. Species population represented as floating-point density per tile, not individual agents, for scalability. Threat generation samples ecosystem state to spawn entities at ecologically plausible locations. Environmental hazards (cold, hunger) use a status effect stack with per-tick delta application.",
    screenshots: [
      "https://images.unsplash.com/photo-1481681153217-38e8c33f2260?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1574173366424-94c06e9a6b8e?w=900&h=560&fit=crop&auto=format",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: [
      "Survival",
      "Ecosystem",
      "Horror",
      "Godot",
      "Simulation",
    ],
    teamSize: 3,
    role: "Systems Designer",
    platforms: ["PC", "Linux"],
    highlights: [
      "8-species ecosystem model",
      "Lotka-Volterra simulation",
      "400+ balance runs",
    ],
  },
  {
    id: "13",
    title: "CHROME CITY",
    subtitle:
      "Open-world cyberpunk RPG with emergent reputation systems",
    genre: "Open World",
    engine: "Unreal Engine 5",
    startDate: "2024-01",
    endDate: "2024-12",
    status: "in-progress",
    description:
      "An open-world action RPG set in a stratified cyberpunk megacity. Faction reputation is computed dynamically from player actions and propagated through a social graph — word travels, deals sour, allies turn enemies based on what you do and who sees it.",
    analysis:
      "The social graph for reputation propagation has 2,400+ NPC nodes with 8,000+ weighted relationship edges. Reputation events propagate via graph traversal with decay functions based on relationship strength and time. The biggest technical risk was keeping the graph consistent across save/load and fast-travel — implemented a lazy evaluation system that defers propagation until the affected NPCs are in simulation range.",
    optimization:
      "City streaming uses Unreal Engine's World Partition system with custom priority scoring based on player velocity vector projection. NPC simulation uses three LOD tiers: full behavior within 80m, simplified routine execution to 400m, statistical population simulation beyond. Reflection capture uses DDGI probe volumes anchored to building zones rather than per-room probes.",
    implementation:
      "Reputation graph implemented as an adjacency list with half-edge representation for fast traversal. Propagation algorithm uses a modified Bellman-Ford with a dampening factor per hop to prevent event amplification. Quest system uses a declarative event-condition system — quests register interest in world state predicates and activate when conditions are met without polling.",
    screenshots: [
      "https://images.unsplash.com/photo-1655720031006-7ee2b8c1a3a9?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1481681153217-38e8c33f2260?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1614680889531-e51f97d843f6?w=900&h=560&fit=crop&auto=format",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["Open World", "RPG", "UE5", "Faction", "Cyberpunk"],
    teamSize: 8,
    role: "Lead Developer",
    platforms: ["PC", "PlayStation 5", "Xbox Series X"],
    highlights: [
      "2,400 NPC social graph",
      "8,000+ relationship edges",
      "DDGI probe volumes",
    ],
  },
  {
    id: "14",
    title: "PIXEL BASTION",
    subtitle:
      "Infinite-scaling tower defense with mutation-based enemy evolution",
    genre: "Tower Defense",
    engine: "Unity 2021 LTS",
    startDate: "2021-01",
    endDate: "2021-08",
    status: "completed",
    description:
      "A tower defense game where enemy waves evolve through a mutation system — enemies that survive longer develop resistances to the damage types that hurt them most. The meta-game is adapting your tower configuration to a shifting enemy population.",
    analysis:
      "The mutation system needed to be perceivable to the player without being random. Implemented a weighted trait inheritance model where traits of surviving enemies are overrepresented in the next wave's gene pool. Visual design challenge: mutations needed to be legible in a top-down pixel art style — solved with a procedural color shift and outline thickness variation per trait.",
    optimization:
      "Tower targeting uses a spatial priority queue per tower type — tower archetypes register preferred target predicates (lowest health, highest speed, etc.) and the priority queue is rebuilt only when the enemy set in range changes. At 500+ simultaneous enemies, moved pathfinding to a pre-computed flow field refreshed when the maze layout changes.",
    implementation:
      "Mutation system uses a trait-gene model where each enemy has a fixed-length genome of 12 traits. Survival weighted the gene pool using tournament selection. Wave composition uses a knapsack solver to hit a target difficulty budget using the current generation's trait distribution. Tower synergy system computes aura effects via a precomputed neighbor cache per cell.",
    screenshots: [
      "https://images.unsplash.com/photo-1536152470836-b962db5bd0d2?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&h=560&fit=crop&auto=format",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: [
      "Tower Defense",
      "Evolution",
      "Pixel Art",
      "Solo",
      "Procedural",
    ],
    teamSize: 1,
    role: "Solo Developer",
    platforms: ["PC", "Web", "Mobile"],
    highlights: [
      "12-trait genome system",
      "500+ enemies, stable 60fps",
      "Tournament selection AI",
    ],
  },
  {
    id: "15",
    title: "NEURAL STORM",
    subtitle:
      "Mind palace puzzle-RPG with synaptic ability evolution",
    genre: "RPG",
    engine: "Unity 2022 LTS",
    startDate: "2023-02",
    endDate: "2023-09",
    status: "completed",
    description:
      "An RPG set inside a deteriorating mind palace where abilities are formed by connecting memory fragments. Puzzle rooms require building logical chains between memory nodes — the chains you build become your combat abilities in adjacent combat encounters.",
    analysis:
      "The dual puzzle/combat design required careful economy design — the most powerful puzzle solutions needed to also create interesting combat restrictions. Built an automated value function for puzzle-built ability chains using Monte Carlo tree search to evaluate them against the upcoming combat scenario, flagging cases where either the puzzle or combat would be trivial.",
    optimization:
      "Mind palace rendering uses a portal-based visibility system since rooms are not spatially adjacent in a traditional sense. Memory node connections render using a procedural spline system with LOD reduction beyond 3 hops from the player. Combat effects use a particle pooling system with 256 pre-allocated emitters shared across all ability types.",
    implementation:
      "Ability generation uses a graph rewriting system that transforms the player's memory connection pattern into an ability descriptor — shape, magnitude, timing, and area computed from graph properties like centrality and cycle count. Combat uses a timeline-based action resolution system where abilities queue on a shared initiative track with interrupt logic.",
    screenshots: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&h=560&fit=crop&auto=format",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["Puzzle", "RPG", "Mind Palace", "Graph", "MCTS"],
    teamSize: 2,
    role: "Lead Developer",
    platforms: ["PC", "Nintendo Switch"],
    highlights: [
      "Graph-to-ability generation",
      "MCTS balancing",
      "Portal visibility system",
    ],
  },
  {
    id: "16",
    title: "VENOM STRIKE",
    subtitle:
      "2.5D fighting game with venom-stack combo physics",
    genre: "Fighting",
    engine: "Unity 2022 LTS",
    startDate: "2022-07",
    endDate: "2023-03",
    status: "completed",
    description:
      "A 2.5D fighting game with 12 playable characters, each with unique venom mechanics — toxic stacks that modify hit properties, altering knockback physics, hitstun duration, and visual effects. Targets the competitive scene with 6-frame input windows.",
    analysis:
      "Frame-perfect input handling required sub-frame input buffering with a 6-frame window and priority resolution for simultaneous inputs. Hit detection uses box collider pairs evaluated on physics frames rather than per-render-frame, with interpolated position queries to handle fast movement. Venom stacking required extensive balance work — 12 characters × 6 venom types produced 72 interaction cases requiring individual tuning.",
    optimization:
      "Character animation uses a custom state machine with blend trees driven by a normalized input vector rather than Unity Animator — this reduced animation overhead by 70% and gave deterministic frame counts. Hit sparks and venom effects use a GPU particle system with a fixed pool of 512 emitters, recycled using a free list allocator.",
    implementation:
      "Input system implements a circular buffer storing 16 frames of input state with per-frame device polling at 1000hz using raw input API. Move recognition uses a finite automaton evaluating the input buffer each frame — each move is a pattern automaton that accepts the buffer as input. Online play uses GGPO rollback netcode with 60hz simulation and input delay of 2 frames as baseline.",
    screenshots: [
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&h=560&fit=crop&auto=format",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["Fighting", "Competitive", "Online", "GGPO", "2.5D"],
    teamSize: 5,
    role: "Physics & Animation",
    platforms: ["PC", "PlayStation 5", "Xbox Series X"],
    highlights: [
      "GGPO rollback netcode",
      "1000hz input polling",
      "72 venom interaction cases",
    ],
  },
  {
    id: "17",
    title: "ORBITAL DECAY",
    subtitle:
      "Hard-science space simulation with Newtonian orbital mechanics",
    genre: "Simulation",
    engine: "Godot 4",
    startDate: "2024-03",
    endDate: "2024-11",
    status: "in-progress",
    description:
      "A hard-science space simulation game where all flight is governed by real Newtonian orbital mechanics. Players plan burns using porkchop plots, manage propellant margins, and rendezvous with derelicts using actual transfer orbit calculations.",
    analysis:
      "The core tension was making real orbital mechanics feel like gameplay rather than homework. Implemented an autopilot suggestion system that proposes optimal burns and visualizes the resulting trajectory in real time. The challenge was making the autopilot helpful without making it the game — it advises, but the player executes, and execution skill determines propellant efficiency.",
    optimization:
      "N-body gravitational simulation for the solar system uses a Barnes-Hut tree structure reducing O(n²) force calculations to O(n log n). Trajectory prediction uses patched-conic approximation for multi-body predictions up to 1,000 days in under 8ms. Rendering uses a logarithmic depth buffer to handle the 12-order-of-magnitude scale range from millimeters to AU.",
    implementation:
      "Orbital mechanics engine uses double-precision floating point with origin shifting to avoid precision loss at large distances. Ships are simulated in their gravitational sphere-of-influence frame, with frame transitions handled by hyperbolic escape/capture at SOI boundaries. Delta-v budget system tracks propellant mass using the Tsiolkovsky rocket equation updated each burn frame.",
    screenshots: [
      "https://images.unsplash.com/photo-1614680889531-e51f97d843f6?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&h=560&fit=crop&auto=format",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: [
      "Space",
      "Simulation",
      "Orbital",
      "Hard Science",
      "Solo",
    ],
    teamSize: 1,
    role: "Solo Developer",
    platforms: ["PC", "Linux"],
    highlights: [
      "Barnes-Hut n-body sim",
      "1,000-day trajectory in 8ms",
      "Log depth buffer",
    ],
  },
  {
    id: "18",
    title: "DUNGEON MATRIX",
    subtitle:
      "Isometric dungeon crawler with live-code-style ability scripting",
    genre: "Adventure",
    engine: "Unity 2022 LTS",
    startDate: "2023-08",
    endDate: "2024-03",
    status: "completed",
    description:
      "An isometric dungeon crawler where players script their own abilities using a visual programming interface. Chain conditions, triggers, and effects to build custom spells and traps. The engine evaluates scripts at runtime using a sandboxed interpreter.",
    analysis:
      "Sandboxed script execution required preventing infinite loops, excessive resource access, and cross-player state pollution. Implemented an instruction-counting timeout that halts scripts exceeding 10,000 ops per frame. The visual programming interface went through 8 major design iterations — the breakthrough was adopting a node-based graph model with type-colored connection ports after 4 failed text/card-based approaches.",
    optimization:
      "Script compilation happens once when the player finalizes an ability — the AST is lowered to a compact bytecode VM with 24 opcodes. VM execution averages 0.4ms per script invocation. Dungeon generation uses a BSP tree for room placement with a minimum spanning tree connecting rooms, ensuring full connectivity with one guaranteed long path.",
    implementation:
      "Bytecode VM uses a register-based architecture with 8 general-purpose registers and 4 game-state registers (self, target, position, context). Script graphs are serialized as a node-edge list and compiled to bytecode at save time. Online co-op uses state snapshot synchronization at 20hz with ability scripts replicated as compiled bytecode rather than source, ensuring determinism.",
    screenshots: [
      "https://images.unsplash.com/photo-1574173366424-94c06e9a6b8e?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=560&fit=crop&auto=format",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: [
      "Dungeon",
      "Scripting",
      "Isometric",
      "RPG",
      "Visual Programming",
    ],
    teamSize: 2,
    role: "Engine & Systems",
    platforms: ["PC", "Mac"],
    highlights: [
      "Custom bytecode VM",
      "24-opcode ISA",
      "BSP dungeon generation",
    ],
  },
  {
    id: "19",
    title: "FRACTURE POINT",
    subtitle:
      "5v5 tactical shooter with breach-and-clear micro-physics",
    genre: "Shooter",
    engine: "Unreal Engine 5",
    startDate: "2024-04",
    endDate: "2024-12",
    status: "in-progress",
    description:
      "A 5v5 tactical shooter focused on entry and defense of tight spaces. Every wall segment has a structural integrity value — destroy the right load-bearing elements and the ceiling collapses. Sound travels realistically through breached openings.",
    analysis:
      "Structural integrity simulation required computing load paths through a building's geometry. Modeled buildings as constraint graphs where nodes are wall segments and edges carry compressive load. Destroying a high-load node triggers a cascade collapse evaluated via topological sort on the load graph. The challenge was keeping this responsive — collapse evaluation completes in under 2ms for a full floor plan.",
    optimization:
      "Wall destruction uses a pre-fractured Voronoi mesh rather than runtime fracturing — all possible shards are pre-computed at build time and revealed by enabling the appropriate renderers. Sound propagation uses a precomputed reverb impulse response per room pair, blended based on currently open portals between them. Network traffic is aggressively culled — destruction events only sent to players within audible range.",
    implementation:
      "Structural load simulation uses sparse matrix methods for the constraint graph — only dirty nodes recomputed on each destruction event. Ballistic penetration uses a layer-cake material model where bullets lose velocity per material layer traversed, supporting realistic wall penetration through multiple surfaces. Anti-cheat uses server-authoritative hit validation with a 150ms client-side lag compensation window.",
    screenshots: [
      "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=900&h=560&fit=crop&auto=format",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: [
      "Tactical",
      "FPS",
      "Destruction",
      "UE5",
      "Multiplayer",
    ],
    teamSize: 6,
    role: "Network Programmer",
    platforms: ["PC"],
    highlights: [
      "Load-path constraint graphs",
      "Pre-fractured Voronoi mesh",
      "2ms collapse eval",
    ],
  },
  {
    id: "20",
    title: "BLOOD MERIDIAN",
    subtitle:
      "Dark fantasy action RPG with wound-based combat simulation",
    genre: "RPG",
    engine: "Unreal Engine 5",
    startDate: "2024-02",
    endDate: "2025-01",
    status: "in-progress",
    description:
      "A dark fantasy action RPG where wounds are simulated per body region with separate HP, bleed rate, and mobility impact. Bind wounds mid-combat to slow blood loss, or risk death by attrition. Combat is slow, deliberate, and lethal.",
    analysis:
      "Wound simulation required a body model with 18 independent regions, each tracking damage type accumulation and bleed rate. The hardest design problem was pacing — granular wound simulation made early combat feel dangerous to the point of frustration. Solved by segmenting difficulty through wound type introduction: blunt damage only in the tutorial zone, piercing in mid-game, lacerations in endgame.",
    optimization:
      "Character physics uses a custom ragdoll system that blends procedural hit reaction and authored animations using inverse kinematics. Blood simulation uses GPU particle systems with surface-following shaders that project particles onto the world geometry using depth buffer reconstruction. Animation state machine optimized to avoid redundant transition evaluations using dirty flags per bone group.",
    implementation:
      "Wound system stores a damage accumulator per region per damage type, feeding a bleed-rate formula derived from piercing depth and vessel proximity (precomputed per region). Combat uses a stamina-gated action system where every swing costs stamina relative to weapon weight and current wound load. Skill tree uses a dependency graph with gated unlock conditions evaluated lazily on access.",
    screenshots: [
      "https://images.unsplash.com/photo-1481681153217-38e8c33f2260?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=560&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1574173366424-94c06e9a6b8e?w=900&h=560&fit=crop&auto=format",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: [
      "Action RPG",
      "Dark Fantasy",
      "Simulation",
      "UE5",
      "Combat",
    ],
    teamSize: 5,
    role: "Lead Developer",
    platforms: ["PC", "PlayStation 5"],
    highlights: [
      "18-region wound model",
      "GPU blood simulation",
      "Stamina-gated combat",
    ],
  },
];

const STORAGE_KEY = "game_portfolio_cms_v1";
const GENRES = [
  "All",
  "Action",
  "Adventure",
  "RPG",
  "Strategy",
  "Simulation",
  "Sports",
  "Racing",
  "Fighting",
  "Shooter",
  "Platformer",
  "Puzzle",
  "Horror",
  "Stealth",
  "Open World",
  "Roguelike",
  "Tower Defense",
  "Survival",
  "Sandbox",
];

// ─── Utils ────────────────────────────────────────────────────────────────────

async function loadGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) return SEED_GAMES;

  return data.map((g: any) => ({
    ...g,
    implImages: g.impl_images ?? g.implImages ?? [],
    videoUrl: g.video_url ?? g.videoUrl ?? "",
  }));
}

async function saveGames(games: Game[]) {
  await supabase.from("games").upsert(
    games.map((g) => ({
      ...g,
      impl_images: g.implImages,
      video_url: g.videoUrl,
    }))
  );
}

function genId() {
  return (
    Math.random().toString(36).slice(2) +
    Date.now().toString(36)
  );
}

// ─── Media URL utilities ──────────────────────────────────────────────────────

type MediaSource =
  | "youtube"
  | "tencent-video"
  | "wechat-video"
  | "wechat-image"
  | "image"
  | "video"
  | "other";

function detectMediaSource(url: string): MediaSource {
  const u = url.trim();
  if (!u) return "other";
  if (/youtube\.com\/embed|youtu\.be\//.test(u))
    return "youtube";
  if (/v\.qq\.com/.test(u)) return "tencent-video";
  if (
    /mp\.weixin\.qq\.com\/(mp|s)/.test(u) ||
    /wxv_\w+/.test(u)
  )
    return "wechat-video";
  if (/mmbiz\.qpic\.cn/.test(u)) return "wechat-image";
  if (/\.(jpe?g|png|gif|webp|bmp|avif|svg)(\?|$)/i.test(u))
    return "image";
  if (/\.(mp4|webm|ogg|mov|m4v|mkv)(\?|$)/i.test(u))
    return "video";
  return "other";
}

function normalizeTencentUrl(url: string): string {
  const m = url.match(
    /v\.qq\.com\/x\/(?:page|cover\/[^/]+)\/([^./?&#]+)/,
  );
  if (m)
    return `https://v.qq.com/txp/iframe/player.html?vid=${m[1]}&tiny=0&auto=0`;
  return url;
}

const SOURCE_META: Record<
  MediaSource,
  { label: string; color: string }
> = {
  youtube: { label: "YouTube", color: "#FF3B30" },
  "tencent-video": { label: "腾讯视频", color: "#FF6B00" },
  "wechat-video": { label: "微信视频", color: "#07C160" },
  "wechat-image": { label: "微信图片", color: "#07C160" },
  image: { label: "Image", color: "#00D9FF" },
  video: { label: "Video", color: "#00D9FF" },
  other: { label: "URL", color: "#4A6A7A" },
};

const STATUS_CONFIG = {
  completed: { color: "#00FF94", bg: "rgba(0,255,148,0.08)" },
  "in-progress": {
    color: "#FFE600",
    bg: "rgba(255,230,0,0.08)",
  },
  prototype: { color: "#FF2D55", bg: "rgba(255,45,85,0.08)" },
};

function statusLabel(status: Game["status"], t: Tr): string {
  if (status === "completed") return t.statusCompleted;
  if (status === "in-progress") return t.statusInProgress;
  return t.statusPrototype;
}

// ─── HUD Corner Brackets ──────────────────────────────────────────────────────

function HUDCorners({
  color = "#00D9FF",
  size = 12,
  thickness = 1.5,
}: {
  color?: string;
  size?: number;
  thickness?: number;
}) {
  const s = `${size}px`;
  const t = `${thickness}px`;
  return (
    <>
      <span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: s,
          height: s,
          borderTop: `${t} solid ${color}`,
          borderLeft: `${t} solid ${color}`,
        }}
      />
      <span
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: s,
          height: s,
          borderTop: `${t} solid ${color}`,
          borderRight: `${t} solid ${color}`,
        }}
      />
      <span
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: s,
          height: s,
          borderBottom: `${t} solid ${color}`,
          borderLeft: `${t} solid ${color}`,
        }}
      />
      <span
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: s,
          height: s,
          borderBottom: `${t} solid ${color}`,
          borderRight: `${t} solid ${color}`,
        }}
      />
    </>
  );
}

// ─── System Clock ─────────────────────────────────────────────────────────────

function SystemClock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");
  const ss = String(time.getSeconds()).padStart(2, "0");
  return (
    <span
      style={{
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "11px",
        color: "#00D9FF",
        letterSpacing: "0.1em",
      }}
    >
      {hh}:{mm}:{ss}
    </span>
  );
}

// ─── Responsive hook ─────────────────────────────────────────────────────────

function useWindowWidth() {
  const [w, setW] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1280,
  );
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return w;
}

// ─── Scanlines ────────────────────────────────────────────────────────────────

function Scanlines() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
      }}
    />
  );
}

// ─── HUD Navigation ───────────────────────────────────────────────────────────

interface HUDNavProps {
  active: NavSection;
  onNav: (s: NavSection) => void;
}

function HUDNav({ active, onNav }: HUDNavProps) {
  const { lang, setLang, t } = useLang();
  const [blink, setBlink] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const w = useWindowWidth();
  const isMobile = w < 640;

  useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), 600);
    return () => clearInterval(id);
  }, []);

  const navItems: {
    id: NavSection;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "portfolio",
      label: t.navPortfolio,
      icon: <Grid size={14} />,
    },
    {
      id: "about",
      label: t.navAbout,
      icon: <User size={14} />,
    },
    {
      id: "admin",
      label: t.navAdmin,
      icon: <Settings size={14} />,
    },
  ];

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "rgba(4,8,15,0.95)",
        borderBottom: "1px solid rgba(0,217,255,0.18)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 16px",
          height: 56,
          display: "flex",
          alignItems: "center",
          gap: 16,
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              background: "#00D9FF",
              boxShadow: "0 0 8px #00D9FF",
              borderRadius: "50%",
              opacity: blink ? 1 : 0.2,
              transition: "opacity 0.1s",
            }}
          />
          <span
            style={{
              fontFamily: "Chakra Petch, sans-serif",
              fontWeight: 700,
              fontSize: isMobile ? 13 : 15,
              color: "#fff",
              letterSpacing: "0.12em",
            }}
          >
            DEV<span style={{ color: "#00D9FF" }}>FORGE</span>
          </span>
          {!isMobile && (
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 10,
                color: "#4A6A7A",
                letterSpacing: "0.08em",
                marginLeft: 4,
              }}
            >
              PORTFOLIO_v2.4.1
            </span>
          )}
        </div>

        {/* Desktop Nav */}
        {!isMobile && (
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNav(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "8px 14px",
                  fontFamily:
                    lang === "cn"
                      ? "'Noto Sans SC', sans-serif"
                      : "Chakra Petch, sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing:
                    lang === "cn" ? "0.04em" : "0.1em",
                  background:
                    active === item.id
                      ? "rgba(0,217,255,0.1)"
                      : "transparent",
                  color:
                    active === item.id ? "#00D9FF" : "#4A6A7A",
                  border: "none",
                  borderBottom:
                    active === item.id
                      ? "2px solid #00D9FF"
                      : "2px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          {!isMobile && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Radio size={10} style={{ color: "#00FF94" }} />
                <span
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: 10,
                    color: "#4A6A7A",
                    letterSpacing: "0.06em",
                  }}
                >
                  {t.sysOk}
                </span>
              </div>
              <SystemClock />
            </>
          )}
          {/* Language toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              border: "1px solid rgba(0,217,255,0.2)",
              overflow: "hidden",
            }}
          >
            {(["en", "cn"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding: "4px 8px",
                  fontFamily:
                    l === "cn"
                      ? "'Noto Sans SC', sans-serif"
                      : "Chakra Petch, sans-serif",
                  fontSize: l === "cn" ? 11 : 10,
                  fontWeight: 700,
                  background:
                    lang === l ? "#00D9FF" : "transparent",
                  color: lang === l ? "#04080F" : "#4A6A7A",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.12s",
                }}
              >
                {l === "en" ? "EN" : "中"}
              </button>
            ))}
          </div>
          {/* Mobile hamburger */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen((o) => !o)}
              style={{
                background: "transparent",
                border: "1px solid rgba(0,217,255,0.2)",
                color: "#4A6A7A",
                cursor: "pointer",
                padding: "6px 8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {menuOpen ? <X size={16} /> : <Grid size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMobile && menuOpen && (
        <div
          style={{
            background: "rgba(4,8,15,0.98)",
            borderTop: "1px solid rgba(0,217,255,0.12)",
            padding: "8px 0",
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNav(item.id);
                setMenuOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "12px 20px",
                fontFamily:
                  lang === "cn"
                    ? "'Noto Sans SC', sans-serif"
                    : "Chakra Petch, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                background:
                  active === item.id
                    ? "rgba(0,217,255,0.08)"
                    : "transparent",
                color:
                  active === item.id ? "#00D9FF" : "#8BB0C2",
                border: "none",
                borderLeft:
                  active === item.id
                    ? "2px solid #00D9FF"
                    : "2px solid transparent",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ gameCount }: { gameCount: number }) {
  const { lang, t } = useLang();
  const [glitch, setGlitch] = useState(false);
  const isCN = lang === "cn";
  const w = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w < 900;

  useEffect(() => {
    const trigger = () => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    };
    const id = setInterval(
      trigger,
      4000 + Math.random() * 3000,
    );
    return () => clearInterval(id);
  }, []);

  const stats = [
    { label: t.statShipped, value: String(gameCount) },
    { label: t.statEngines, value: "5" },
    { label: t.statPlatforms, value: "8" },
    { label: t.statYrs, value: "6" },
  ];

  return (
    <section
      style={{
        paddingTop: isMobile ? 80 : 120,
        paddingBottom: isMobile ? 48 : 80,
        paddingLeft: isMobile ? 16 : 24,
        paddingRight: isMobile ? 16 : 24,
        maxWidth: 1440,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isTablet ? "1fr" : "1fr auto",
        alignItems: "end",
        gap: isTablet ? 32 : 48,
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 40,
              height: 1,
              background: "#00D9FF",
            }}
          />
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 11,
              color: "#00D9FF",
              letterSpacing: "0.12em",
            }}
          >
            {t.heroTag}
          </span>
        </div>
        <h1
          style={{
            fontFamily: isCN
              ? "'Noto Sans SC', sans-serif"
              : "Chakra Petch, sans-serif",
            fontWeight: 700,
            fontSize: isCN
              ? "clamp(40px, 5.5vw, 80px)"
              : "clamp(42px, 6vw, 88px)",
            lineHeight: 1.1,
            color: "#fff",
            letterSpacing: isCN ? "0.02em" : "-0.02em",
            marginBottom: 24,
            filter: glitch
              ? "hue-rotate(90deg) saturate(3)"
              : "none",
            transform: glitch ? "translateX(-2px)" : "none",
            transition: glitch
              ? "none"
              : "filter 0.1s, transform 0.1s",
            textShadow: glitch
              ? "2px 0 #FF2D55, -2px 0 #00D9FF"
              : "none",
          }}
        >
          {t.heroH1[0]}
          <br />
          <span style={{ color: "#00D9FF" }}>
            {t.heroH1[1]}
          </span>
          <br />
          {t.heroH1[2]}
        </h1>
        <p
          style={{
            fontFamily: isCN
              ? "'Noto Sans SC', sans-serif"
              : "Outfit, sans-serif",
            fontSize: 15,
            color: "#4A6A7A",
            lineHeight: 1.8,
            maxWidth: 500,
            marginBottom: 0,
          }}
        >
          {t.heroDesc(gameCount)}
        </p>
      </div>

      <div style={{ position: "relative", padding: 20 }}>
        <HUDCorners color="#00D9FF" size={16} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1,
            background: "rgba(0,217,255,0.08)",
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: "16px 20px",
                background: "#04080F",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "Chakra Petch, sans-serif",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#00D9FF",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: isCN
                    ? "'Noto Sans SC', sans-serif"
                    : "JetBrains Mono, monospace",
                  fontSize: 10,
                  color: "#4A6A7A",
                  letterSpacing: "0.06em",
                  marginTop: 6,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────

interface FilterBarProps {
  selected: string;
  onSelect: (g: string) => void;
  counts: Record<string, number>;
}

function FilterBar({
  selected,
  onSelect,
  counts,
}: FilterBarProps) {
  const { lang, t } = useLang();
  const isCN = lang === "cn";
  const scrollRef = useRef<HTMLDivElement>(null);
  const uniqueGenres = [
    "All",
    ...Array.from(
      new Set(Object.keys(counts).filter((k) => k !== "All")),
    ),
  ];

  return (
    <div
      style={{
        padding: "0 24px",
        marginBottom: 40,
        maxWidth: 1440,
        margin: "0 auto 40px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <Tag size={12} style={{ color: "#4A6A7A" }} />
        <span
          style={{
            fontFamily: isCN
              ? "'Noto Sans SC', sans-serif"
              : "JetBrains Mono, monospace",
            fontSize: 10,
            color: "#4A6A7A",
            letterSpacing: isCN ? "0.04em" : "0.1em",
          }}
        >
          {t.filterLabel}
        </span>
        <div
          style={{
            flex: 1,
            height: 1,
            background: "rgba(0,217,255,0.1)",
          }}
        />
        <span
          style={{
            fontFamily: isCN
              ? "'Noto Sans SC', sans-serif"
              : "JetBrains Mono, monospace",
            fontSize: 10,
            color: "#4A6A7A",
          }}
        >
          {t.filterResults(counts[selected] ?? counts["All"])}
        </span>
      </div>
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: 6,
          overflowX: "auto",
          paddingBottom: 4,
          scrollbarWidth: "none",
        }}
      >
        {uniqueGenres.map((genre) => {
          const label =
            genre === "All"
              ? t.filterAll(counts["All"])
              : tGenre(genre, lang).toUpperCase();
          return (
            <button
              key={genre}
              onClick={() => onSelect(genre)}
              style={{
                flexShrink: 0,
                padding: "6px 14px",
                fontFamily: isCN
                  ? "'Noto Sans SC', sans-serif"
                  : "Chakra Petch, sans-serif",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: isCN ? "0.02em" : "0.08em",
                background:
                  selected === genre
                    ? "#00D9FF"
                    : "transparent",
                color:
                  selected === genre ? "#04080F" : "#4A6A7A",
                border: `1px solid ${selected === genre ? "#00D9FF" : "rgba(0,217,255,0.18)"}`,
                cursor: "pointer",
                transition: "all 0.12s",
              }}
              onMouseEnter={(e) => {
                if (selected !== genre) {
                  (
                    e.currentTarget as HTMLButtonElement
                  ).style.borderColor = "rgba(0,217,255,0.5)";
                  (
                    e.currentTarget as HTMLButtonElement
                  ).style.color = "#8BB0C2";
                }
              }}
              onMouseLeave={(e) => {
                if (selected !== genre) {
                  (
                    e.currentTarget as HTMLButtonElement
                  ).style.borderColor = "rgba(0,217,255,0.18)";
                  (
                    e.currentTarget as HTMLButtonElement
                  ).style.color = "#4A6A7A";
                }
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Game Card ────────────────────────────────────────────────────────────────

interface GameCardProps {
  game: Game;
  index: number;
  onClick: () => void;
}

function GameCard({ game, index, onClick }: GameCardProps) {
  const { lang, t } = useLang();
  const isCN = lang === "cn";
  const [hover, setHover] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const status = STATUS_CONFIG[game.status];

  useEffect(() => {
    if (!hover) return;
    const id = setInterval(
      () => setImgIdx((i) => (i + 1) % game.screenshots.length),
      1800,
    );
    return () => clearInterval(id);
  }, [hover, game.screenshots.length]);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setImgIdx(0);
      }}
      style={{
        position: "relative",
        cursor: "pointer",
        background: hover ? "#0A1520" : "#080F1A",
        border: `1px solid ${hover ? "rgba(0,217,255,0.35)" : "rgba(0,217,255,0.1)"}`,
        transition: "all 0.2s",
        transform: hover ? "translateY(-2px)" : "none",
        boxShadow: hover
          ? "0 8px 40px rgba(0,217,255,0.08)"
          : "none",
      }}
    >
      <HUDCorners
        color={hover ? "#00D9FF" : "rgba(0,217,255,0.4)"}
        size={10}
        thickness={1}
      />

      {/* Index label */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          zIndex: 2,
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 9,
          color: "#4A6A7A",
          letterSpacing: "0.06em",
        }}
      >
        [{String(index + 1).padStart(2, "0")}]
      </div>

      {/* Screenshot */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%",
          overflow: "hidden",
          background: "#04080F",
        }}
      >
        {game.screenshots.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${game.title} screenshot ${i + 1}`}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: i === imgIdx ? 1 : 0,
              transition: "opacity 0.4s",
              filter: "saturate(0.7) brightness(0.8)",
            }}
          />
        ))}
        {/* Overlay gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, transparent 50%, rgba(8,15,26,0.9) 100%)",
          }}
        />

        {/* Status badge */}
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            padding: "3px 8px",
            fontFamily: isCN
              ? "'Noto Sans SC', sans-serif"
              : "JetBrains Mono, monospace",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: isCN ? "0.04em" : "0.1em",
            color: status.color,
            background: status.bg,
            border: `1px solid ${status.color}33`,
          }}
        >
          {statusLabel(game.status, t)}
        </div>

        {/* Screenshot dots */}
        {game.screenshots.length > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 4,
            }}
          >
            {game.screenshots.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background:
                    i === imgIdx
                      ? "#00D9FF"
                      : "rgba(255,255,255,0.3)",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "14px 16px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "Chakra Petch, sans-serif",
                fontSize: 15,
                fontWeight: 700,
                color: hover ? "#fff" : "#C8DFE8",
                letterSpacing: "0.05em",
                marginBottom: 3,
                transition: "color 0.15s",
              }}
            >
              {game.title}
            </h3>
            <p
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: 12,
                color: "#4A6A7A",
                lineHeight: 1.4,
              }}
            >
              {game.subtitle}
            </p>
          </div>
          <ChevronRight
            size={14}
            style={{
              color: hover ? "#00D9FF" : "#4A6A7A",
              flexShrink: 0,
              marginTop: 2,
              transition: "color 0.15s",
            }}
          />
        </div>

        {/* Meta row */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: isCN
                ? "'Noto Sans SC', sans-serif"
                : "JetBrains Mono, monospace",
              fontSize: 10,
              color: "#00D9FF",
              background: "rgba(0,217,255,0.06)",
              padding: "2px 7px",
              border: "1px solid rgba(0,217,255,0.15)",
            }}
          >
            {tGenre(game.genre, lang).toUpperCase()}
          </span>
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 10,
              color: "#4A6A7A",
              padding: "2px 7px",
              border: "1px solid rgba(0,217,255,0.08)",
            }}
          >
            {game.engine}
          </span>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 1,
            background: "rgba(0,217,255,0.05)",
          }}
        >
          {[
            { label: t.cardTeam, value: `×${game.teamSize}` },
            {
              label: t.cardRole,
              value: game.role.split(" ")[0],
            },
            {
              label: t.cardPlat,
              value: `${game.platforms.length}`,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: "6px 8px",
                background: "#04080F",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 11,
                  color: "#C8DFE8",
                  fontWeight: 700,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: isCN
                    ? "'Noto Sans SC', sans-serif"
                    : "JetBrains Mono, monospace",
                  fontSize: 9,
                  color: "#4A6A7A",
                  letterSpacing: isCN ? "0.02em" : "0.08em",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Games Grid ───────────────────────────────────────────────────────────────

interface GamesGridProps {
  games: Game[];
  onSelect: (g: Game) => void;
}

function GamesGrid({ games, onSelect }: GamesGridProps) {
  const { t } = useLang();
  const [filter, setFilter] = useState("All");
  const w = useWindowWidth();
  const isMobile = w < 640;

  const counts: Record<string, number> = { All: games.length };
  games.forEach((g) => {
    counts[g.genre] = (counts[g.genre] ?? 0) + 1;
  });

  const filtered =
    filter === "All"
      ? games
      : games.filter((g) => g.genre === filter);

  return (
    <section
      style={{
        maxWidth: 1440,
        margin: "0 auto",
        padding: isMobile ? "0 12px 60px" : "0 24px 80px",
      }}
    >
      <FilterBar
        selected={filter}
        onSelect={setFilter}
        counts={counts}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 1,
          background: "rgba(0,217,255,0.06)",
        }}
      >
        {filtered.map((game, i) => (
          <GameCard
            key={game.id}
            game={game}
            index={games.indexOf(game)}
            onClick={() => onSelect(game)}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "80px 0",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 12,
            color: "#4A6A7A",
            letterSpacing: "0.1em",
          }}
        >
          {t.noResults}
        </div>
      )}
    </section>
  );
}

// ─── Game Modal ───────────────────────────────────────────────────────────────

interface GameModalProps {
  game: Game;
  onClose: () => void;
}

function GameModal({ game, onClose }: GameModalProps) {
  const { lang, t } = useLang();
  const isCN = lang === "cn";
  const [tab, setTab] = useState<ModalTab>("overview");
  const [imgIdx, setImgIdx] = useState(0);
  const status = STATUS_CONFIG[game.status];
  const w = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w < 900;

  const tabs: {
    id: ModalTab;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "overview",
      label: t.tabOverview,
      icon: <Layers size={12} />,
    },
    {
      id: "analysis",
      label: t.tabAnalysis,
      icon: <Activity size={12} />,
    },
    {
      id: "optimization",
      label: t.tabOptimization,
      icon: <Zap size={12} />,
    },
    {
      id: "implementation",
      label: t.tabImpl,
      icon: <Code size={12} />,
    },
    {
      id: "media",
      label: t.tabMedia,
      icon: <Film size={12} />,
    },
  ];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
        padding: isMobile ? 0 : 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(4,8,15,0.92)",
          backdropFilter: "blur(8px)",
        }}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: isMobile ? "100%" : 1100,
          maxHeight: isMobile ? "92vh" : "90vh",
          background: "#080F1A",
          border: isMobile
            ? "none"
            : "1px solid rgba(0,217,255,0.25)",
          borderTop: "1px solid rgba(0,217,255,0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 0 80px rgba(0,217,255,0.08)",
        }}
      >
        <HUDCorners color="#00D9FF" size={16} thickness={1.5} />

        {/* Modal Header */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid rgba(0,217,255,0.12)",
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexShrink: 0,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 10,
                  color: "#4A6A7A",
                }}
              >
                ID:{game.id.slice(0, 8)}
              </span>
              <span
                style={{
                  width: 1,
                  height: 12,
                  background: "rgba(0,217,255,0.2)",
                }}
              />
              <span
                style={{
                  fontFamily: isCN
                    ? "'Noto Sans SC', sans-serif"
                    : "JetBrains Mono, monospace",
                  fontSize: 10,
                  color: status.color,
                }}
              >
                {statusLabel(game.status, t)}
              </span>
            </div>
            <h2
              style={{
                fontFamily: "Chakra Petch, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "0.05em",
              }}
            >
              {game.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid rgba(0,217,255,0.2)",
              color: "#4A6A7A",
              cursor: "pointer",
              padding: 8,
              display: "flex",
              alignItems: "center",
              transition: "all 0.12s",
            }}
            onMouseEnter={(e) => {
              (
                e.currentTarget as HTMLButtonElement
              ).style.borderColor = "#FF2D55";
              (
                e.currentTarget as HTMLButtonElement
              ).style.color = "#FF2D55";
            }}
            onMouseLeave={(e) => {
              (
                e.currentTarget as HTMLButtonElement
              ).style.borderColor = "rgba(0,217,255,0.2)";
              (
                e.currentTarget as HTMLButtonElement
              ).style.color = "#4A6A7A";
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Bar */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid rgba(0,217,255,0.12)",
            flexShrink: 0,
            overflowX: "auto",
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? 0 : 6,
                padding: isMobile ? "10px 12px" : "10px 20px",
                fontFamily: "Chakra Petch, sans-serif",
                fontSize: isMobile ? 10 : 11,
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: tab === t.id ? "#00D9FF" : "#4A6A7A",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${tab === t.id ? "#00D9FF" : "transparent"}`,
                cursor: "pointer",
                transition: "all 0.12s",
                flexShrink: 0,
              }}
            >
              {t.icon}
              {!isMobile && (
                <span style={{ marginLeft: 6 }}>{t.label}</span>
              )}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isTablet ? "1fr" : "1fr 360px",
            flex: 1,
            overflow: "hidden",
          }}
        >
          {/* Main content */}
          <div style={{ overflowY: "auto", padding: 24 }}>
            {tab === "overview" && (
              <div>
                <p
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: 15,
                    color: "#8BB0C2",
                    lineHeight: 1.8,
                    marginBottom: 24,
                  }}
                >
                  {game.description}
                </p>
                {/* Screenshots */}
                <div
                  style={{
                    position: "relative",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      paddingTop: "56.25%",
                      background: "#04080F",
                      overflow: "hidden",
                    }}
                  >
                    {game.screenshots.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`Screenshot ${i + 1}`}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          opacity: i === imgIdx ? 1 : 0,
                          transition: "opacity 0.35s",
                          filter: "saturate(0.8)",
                        }}
                      />
                    ))}
                    <button
                      onClick={() =>
                        setImgIdx(
                          (i) =>
                            (i - 1 + game.screenshots.length) %
                            game.screenshots.length,
                        )
                      }
                      style={{
                        position: "absolute",
                        left: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "rgba(4,8,15,0.8)",
                        border: "1px solid rgba(0,217,255,0.2)",
                        color: "#00D9FF",
                        cursor: "pointer",
                        padding: 8,
                        display: "flex",
                      }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setImgIdx(
                          (i) =>
                            (i + 1) % game.screenshots.length,
                        )
                      }
                      style={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "rgba(4,8,15,0.8)",
                        border: "1px solid rgba(0,217,255,0.2)",
                        color: "#00D9FF",
                        cursor: "pointer",
                        padding: 8,
                        display: "flex",
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      marginTop: 8,
                    }}
                  >
                    {game.screenshots.map((src, i) => (
                      <div
                        key={i}
                        onClick={() => setImgIdx(i)}
                        style={{
                          flex: 1,
                          paddingTop: "16%",
                          position: "relative",
                          cursor: "pointer",
                          border: `1px solid ${i === imgIdx ? "#00D9FF" : "rgba(0,217,255,0.1)"}`,
                          overflow: "hidden",
                          background: "#04080F",
                        }}
                      >
                        <img
                          src={src}
                          alt=""
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: 0.7,
                            filter: "saturate(0.6)",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Highlights */}
                <div style={{ marginTop: 20 }}>
                  <div
                    style={{
                      fontFamily: isCN
                        ? "'Noto Sans SC', sans-serif"
                        : "JetBrains Mono, monospace",
                      fontSize: 10,
                      color: "#4A6A7A",
                      letterSpacing: isCN ? "0.04em" : "0.1em",
                      marginBottom: 10,
                    }}
                  >
                    {t.keyMetrics}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    {game.highlights.map((h, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "6px 12px",
                          background: "rgba(0,217,255,0.05)",
                          border:
                            "1px solid rgba(0,217,255,0.12)",
                        }}
                      >
                        <Target
                          size={10}
                          style={{ color: "#00D9FF" }}
                        />
                        <span
                          style={{
                            fontFamily:
                              "JetBrains Mono, monospace",
                            fontSize: 11,
                            color: "#C8DFE8",
                          }}
                        >
                          {h}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {(tab === "analysis" ||
              tab === "optimization" ||
              tab === "implementation") && (
              <div>
                <div
                  style={{
                    fontFamily: isCN
                      ? "'Noto Sans SC', sans-serif"
                      : "JetBrains Mono, monospace",
                    fontSize: 10,
                    color: "#4A6A7A",
                    letterSpacing: isCN ? "0.04em" : "0.1em",
                    marginBottom: 16,
                  }}
                >
                  {t.contentLabel(tab)}
                </div>
                <div
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: 14,
                    color: "#8BB0C2",
                    lineHeight: 1.9,
                    borderLeft: "2px solid rgba(0,217,255,0.2)",
                    paddingLeft: 20,
                  }}
                >
                  {tab === "analysis" && game.analysis}
                  {tab === "optimization" && game.optimization}
                  {tab === "implementation" &&
                    game.implementation}
                </div>
                {tab === "implementation" &&
                  (() => {
                    const imgs = (game.implImages ?? []).filter(
                      Boolean,
                    );
                    if (!imgs.length) return null;
                    return (
                      <div
                        style={{
                          marginTop: 24,
                          display: "flex",
                          flexDirection: "column",
                          gap: 12,
                        }}
                      >
                        {imgs.map((src, i) => (
                          <a
                            key={i}
                            href={src}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "block",
                              border:
                                "1px solid rgba(0,217,255,0.12)",
                            }}
                          >
                            <img
                              src={src}
                              alt={`Implementation ${i + 1}`}
                              style={{
                                width: "100%",
                                height: "auto",
                                display: "block",
                              }}
                            />
                          </a>
                        ))}
                      </div>
                    );
                  })()}
              </div>
            )}
            {tab === "media" && (
              <div>
                <div
                  style={{
                    fontFamily: isCN
                      ? "'Noto Sans SC', sans-serif"
                      : "JetBrains Mono, monospace",
                    fontSize: 10,
                    color: "#4A6A7A",
                    letterSpacing: isCN ? "0.04em" : "0.1em",
                    marginBottom: 16,
                  }}
                >
                  {t.gameplayDemo}
                </div>
                <VideoPlayer
                  videoUrl={game.videoUrl}
                  title={game.title}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          {!isTablet && (
            <div
              style={{
                borderLeft: "1px solid rgba(0,217,255,0.1)",
                padding: 20,
                overflowY: "auto",
                background: "rgba(4,8,15,0.4)",
              }}
            >
              <SidebarSection label={t.sidebarInfo}>
                <MetaRow
                  label={t.metaEngine}
                  value={game.engine}
                />
                <MetaRow
                  label={t.metaGenre}
                  value={tGenre(game.genre, lang)}
                />
                <MetaRow label={t.metaRole} value={game.role} />
                <MetaRow
                  label={t.metaTeamSize}
                  value={t.metaDevs(game.teamSize)}
                />
                <MetaRow
                  label={t.metaTimeline}
                  value={`${game.startDate} → ${game.endDate}`}
                />
              </SidebarSection>
              <SidebarSection label={t.sidebarPlatforms}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                  }}
                >
                  {game.platforms.map((p) => (
                    <span
                      key={p}
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: 10,
                        color: "#8BB0C2",
                        padding: "3px 8px",
                        border:
                          "1px solid rgba(0,217,255,0.15)",
                        background: "rgba(0,217,255,0.04)",
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </SidebarSection>
              <SidebarSection label={t.sidebarTags}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                  }}
                >
                  {game.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: 10,
                        color: "#4A6A7A",
                        padding: "3px 8px",
                        border:
                          "1px solid rgba(0,217,255,0.08)",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </SidebarSection>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 9,
          color: "#4A6A7A",
          letterSpacing: "0.12em",
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {label}
        <div
          style={{
            flex: 1,
            height: 1,
            background: "rgba(0,217,255,0.1)",
          }}
        />
      </div>
      {children}
    </div>
  );
}

function MetaRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 8,
        alignItems: "flex-start",
      }}
    >
      <span
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 10,
          color: "#4A6A7A",
          letterSpacing: "0.06em",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "Outfit, sans-serif",
          fontSize: 12,
          color: "#C8DFE8",
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────

function About() {
  const { lang, t } = useLang();
  const isCN = lang === "cn";
  const skillItems = t.skillItems;
  const w = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w < 900;

  return (
    <section
      style={{
        maxWidth: 1440,
        margin: "0 auto",
        padding: isMobile ? "40px 16px 60px" : "60px 24px 80px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr",
          gap: isTablet ? 40 : 80,
          alignItems: "start",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 40,
                height: 1,
                background: "#00D9FF",
              }}
            />
            <span
              style={{
                fontFamily: isCN
                  ? "'Noto Sans SC', sans-serif"
                  : "JetBrains Mono, monospace",
                fontSize: 11,
                color: "#00D9FF",
                letterSpacing: isCN ? "0.04em" : "0.12em",
              }}
            >
              {t.aboutTag}
            </span>
          </div>
          <h2
            style={{
              fontFamily: isCN
                ? "'Noto Sans SC', sans-serif"
                : "Chakra Petch, sans-serif",
              fontSize: isCN ? 36 : 40,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: isCN ? "0.04em" : "-0.01em",
              marginBottom: 24,
              lineHeight: 1.2,
            }}
          >
            {t.aboutH[0]}
            <br />
            {t.aboutH[1]}
            <br />
            <span style={{ color: "#00D9FF" }}>
              {t.aboutH[2]}
            </span>
          </h2>
          <div
            style={{
              fontFamily: isCN
                ? "'Noto Sans SC', sans-serif"
                : "Outfit, sans-serif",
              fontSize: 15,
              color: "#4A6A7A",
              lineHeight: 1.9,
            }}
          >
            {t.aboutP.map((p, i) => (
              <p
                key={i}
                style={{
                  marginBottom:
                    i < t.aboutP.length - 1 ? 16 : 0,
                }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        <div>
          <div
            style={{
              fontFamily: isCN
                ? "'Noto Sans SC', sans-serif"
                : "JetBrains Mono, monospace",
              fontSize: 10,
              color: "#4A6A7A",
              letterSpacing: isCN ? "0.04em" : "0.1em",
              marginBottom: 20,
            }}
          >
            {t.techStack}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              background: "rgba(0,217,255,0.06)",
            }}
          >
            {t.skillCats.map((cat, i) => (
              <div
                key={cat}
                style={{
                  background: "#080F1A",
                  padding: "16px 20px",
                }}
              >
                <div
                  style={{
                    fontFamily: isCN
                      ? "'Noto Sans SC', sans-serif"
                      : "JetBrains Mono, monospace",
                    fontSize: 10,
                    color: "#00D9FF",
                    letterSpacing: isCN ? "0.04em" : "0.1em",
                    marginBottom: 10,
                  }}
                >
                  {cat}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                  }}
                >
                  {skillItems[i].map((item) => (
                    <span
                      key={item}
                      style={{
                        fontFamily: "Outfit, sans-serif",
                        fontSize: 13,
                        color: "#8BB0C2",
                        padding: "4px 10px",
                        background: "rgba(0,217,255,0.04)",
                        border: "1px solid rgba(0,217,255,0.1)",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Admin CMS ────────────────────────────────────────────────────────────────

const BLANK_GAME: Omit<Game, "id"> = {
  title: "",
  subtitle: "",
  genre: "Shooter",
  engine: "",
  startDate: "",
  endDate: "",
  status: "prototype",
  description: "",
  analysis: "",
  optimization: "",
  implementation: "",
  implImages: ["", "", ""],
  screenshots: ["", "", ""],
  videoUrl: "",
  tags: [],
  teamSize: 1,
  role: "",
  platforms: [],
  highlights: [],
};

interface AdminProps {
  games: Game[];
  onSave: (games: Game[]) => void;
}

function Admin({ games, onSave }: AdminProps) {
  const { lang, t } = useLang();
  const isCN = lang === "cn";
  const w = useWindowWidth();
  const isMobile = w < 640;
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [view, setView] = useState<"list" | "edit" | "add">(
    "list",
  );
  const [editing, setEditing] = useState<Game | null>(null);
  const [form, setForm] =
    useState<Omit<Game, "id">>(BLANK_GAME);
  const [saved, setSaved] = useState(false);

  const handleAuth = () => {
    if (pw === "ADMIN" || pw === "admin") {
      setAuthed(true);
      setPwErr(false);
    } else {
      setPwErr(true);
    }
  };

  const startEdit = (g: Game) => {
    setEditing(g);
    setForm({ implImages: ["", "", ""], ...g });
    setView("edit");
  };

  const startAdd = () => {
    setEditing(null);
    setForm({ ...BLANK_GAME });
    setView("add");
  };

  const handleDelete = (id: string) => {
    if (!window.confirm(t.deleteConfirm)) return;
    onSave(games.filter((g) => g.id !== id));
  };

  const handleSaveForm = () => {
    if (view === "edit" && editing) {
      onSave(
        games.map((g) =>
          g.id === editing.id ? { ...form, id: editing.id } : g,
        ),
      );
    } else {
      onSave([...games, { ...form, id: genId() }]);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setView("list");
  };

  const setField = <K extends keyof typeof form>(
    k: K,
    v: (typeof form)[K],
  ) => setForm((f) => ({ ...f, [k]: v }));

  if (!authed) {
    return (
      <div
        style={{
          maxWidth: 420,
          margin: "60px auto",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            position: "relative",
            background: "#080F1A",
            border: "1px solid rgba(0,217,255,0.2)",
            padding: 28,
          }}
        >
          <HUDCorners color="#00D9FF" size={14} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 28,
            }}
          >
            <Shield size={16} style={{ color: "#00D9FF" }} />
            <span
              style={{
                fontFamily: isCN
                  ? "'Noto Sans SC', sans-serif"
                  : "Chakra Petch, sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: isCN ? "0.04em" : "0.1em",
              }}
            >
              {t.adminAccess}
            </span>
          </div>
          <div
            style={{
              fontFamily: isCN
                ? "'Noto Sans SC', sans-serif"
                : "JetBrains Mono, monospace",
              fontSize: 11,
              color: "#4A6A7A",
              marginBottom: 16,
            }}
          >
            {t.enterCode}
          </div>
          <div
            style={{ position: "relative", marginBottom: 20 }}
          >
            <input
              type={showPw ? "text" : "password"}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleAuth()
              }
              placeholder="••••••"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 40px 12px 14px",
                background: "rgba(0,217,255,0.04)",
                border: `1px solid ${pwErr ? "#FF2D55" : "rgba(0,217,255,0.2)"}`,
                color: "#C8DFE8",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 14,
                letterSpacing: "0.1em",
                outline: "none",
              }}
            />
            <button
              onClick={() => setShowPw((s) => !s)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "#4A6A7A",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {showPw ? (
                <EyeOff size={14} />
              ) : (
                <Eye size={14} />
              )}
            </button>
          </div>
          {pwErr && (
            <div
              style={{
                fontFamily: isCN
                  ? "'Noto Sans SC', sans-serif"
                  : "JetBrains Mono, monospace",
                fontSize: 10,
                color: "#FF2D55",
                marginBottom: 16,
                letterSpacing: isCN ? "0.02em" : "0.08em",
              }}
            >
              {t.accessDenied}
            </div>
          )}
          <button
            onClick={handleAuth}
            style={{
              width: "100%",
              padding: "12px",
              background: "#00D9FF",
              color: "#04080F",
              fontFamily: isCN
                ? "'Noto Sans SC', sans-serif"
                : "Chakra Petch, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: isCN ? "0.04em" : "0.1em",
              border: "none",
              cursor: "pointer",
              transition: "background 0.12s",
            }}
            onMouseEnter={(e) =>
              ((
                e.currentTarget as HTMLButtonElement
              ).style.background = "#33E4FF")
            }
            onMouseLeave={(e) =>
              ((
                e.currentTarget as HTMLButtonElement
              ).style.background = "#00D9FF")
            }
          >
            {t.authenticate}
          </button>
          <div
            style={{
              marginTop: 16,
              fontFamily: isCN
                ? "'Noto Sans SC', sans-serif"
                : "JetBrains Mono, monospace",
              fontSize: 10,
              color: "#4A6A7A",
              textAlign: "center",
            }}
          >
            {t.demoPass}
          </div>
        </div>
      </div>
    );
  }

  if (view === "list") {
    return (
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: `40px ${isCN ? 16 : 24}px 80px`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <Database
                size={14}
                style={{ color: "#00D9FF" }}
              />
              <span
                style={{
                  fontFamily: isCN
                    ? "'Noto Sans SC', sans-serif"
                    : "JetBrains Mono, monospace",
                  fontSize: 11,
                  color: "#00D9FF",
                  letterSpacing: isCN ? "0.04em" : "0.1em",
                }}
              >
                {t.cmsPanel}
              </span>
            </div>
            <h2
              style={{
                fontFamily: isCN
                  ? "'Noto Sans SC', sans-serif"
                  : "Chakra Petch, sans-serif",
                fontSize: 28,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {t.gameEntries(games.length)}
            </h2>
          </div>
          <div style={{ flex: 1 }} />
          {saved && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#00FF94",
                fontFamily: isCN
                  ? "'Noto Sans SC', sans-serif"
                  : "JetBrains Mono, monospace",
                fontSize: 11,
              }}
            >
              <Award size={12} /> {t.savedLabel}
            </div>
          )}
          <button
            onClick={startAdd}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              background: "#00D9FF",
              color: "#04080F",
              fontFamily: isCN
                ? "'Noto Sans SC', sans-serif"
                : "Chakra Petch, sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: isCN ? "0.04em" : "0.08em",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Plus size={14} /> {t.addGame}
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            background: "rgba(0,217,255,0.05)",
          }}
        >
          {games.map((g, i) => {
            const st = STATUS_CONFIG[g.status];
            return (
              <div
                key={g.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "1fr auto auto"
                    : "40px 1fr auto auto auto",
                  gap: isMobile ? 10 : 16,
                  alignItems: "center",
                  padding: "12px 16px",
                  background: "#080F1A",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) =>
                  ((
                    e.currentTarget as HTMLDivElement
                  ).style.background = "#0A1520")
                }
                onMouseLeave={(e) =>
                  ((
                    e.currentTarget as HTMLDivElement
                  ).style.background = "#080F1A")
                }
              >
                {!isMobile && (
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 11,
                      color: "#4A6A7A",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                )}
                <div>
                  <div
                    style={{
                      fontFamily: "Chakra Petch, sans-serif",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#C8DFE8",
                      marginBottom: 2,
                    }}
                  >
                    {g.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 10,
                      color: "#4A6A7A",
                    }}
                  >
                    {g.engine} · {g.genre}
                  </div>
                </div>
                {!isMobile && (
                  <span
                    style={{
                      fontFamily: isCN
                        ? "'Noto Sans SC', sans-serif"
                        : "JetBrains Mono, monospace",
                      fontSize: 10,
                      color: st.color,
                      padding: "2px 8px",
                      border: `1px solid ${st.color}33`,
                    }}
                  >
                    {statusLabel(g.status, t)}
                  </span>
                )}
                <button
                  onClick={() => startEdit(g)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: isMobile ? "8px" : "6px 12px",
                    background: "transparent",
                    border: "1px solid rgba(0,217,255,0.2)",
                    color: "#4A6A7A",
                    fontFamily: isCN
                      ? "'Noto Sans SC', sans-serif"
                      : "Chakra Petch, sans-serif",
                    fontSize: 10,
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                    transition: "all 0.12s",
                  }}
                  onMouseEnter={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.borderColor = "#00D9FF";
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.color = "#00D9FF";
                  }}
                  onMouseLeave={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.borderColor = "rgba(0,217,255,0.2)";
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.color = "#4A6A7A";
                  }}
                >
                  <Edit3 size={11} /> {!isMobile && t.editBtn}
                </button>
                <button
                  onClick={() => handleDelete(g.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: isMobile ? "8px" : "6px 12px",
                    background: "transparent",
                    border: "1px solid rgba(255,45,85,0.2)",
                    color: "#4A6A7A",
                    fontFamily: isCN
                      ? "'Noto Sans SC', sans-serif"
                      : "Chakra Petch, sans-serif",
                    fontSize: 10,
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                    transition: "all 0.12s",
                  }}
                  onMouseEnter={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.borderColor = "#FF2D55";
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.color = "#FF2D55";
                  }}
                  onMouseLeave={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.borderColor = "rgba(255,45,85,0.2)";
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.color = "#4A6A7A";
                  }}
                >
                  <Trash2 size={11} /> {!isMobile && t.delBtn}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Edit / Add form
  const isEdit = view === "edit";
  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: `40px ${isMobile ? 16 : 24}px 80px`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 32,
        }}
      >
        <button
          onClick={() => setView("list")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            background: "transparent",
            border: "1px solid rgba(0,217,255,0.2)",
            color: "#4A6A7A",
            fontFamily: isCN
              ? "'Noto Sans SC', sans-serif"
              : "Chakra Petch, sans-serif",
            fontSize: 10,
            cursor: "pointer",
            letterSpacing: "0.06em",
          }}
        >
          {t.backBtn}
        </button>
        <h2
          style={{
            fontFamily: isCN
              ? "'Noto Sans SC', sans-serif"
              : "Chakra Petch, sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {isEdit
            ? t.editingTitle(editing?.title ?? "")
            : t.addNewGame}
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          background: "rgba(0,217,255,0.05)",
        }}
      >
        <FormSection label={t.formBasicInfo}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <FormField
              label={t.fTitle}
              value={form.title}
              onChange={(v) => setField("title", v)}
            />
            <FormField
              label={t.fSubtitle}
              value={form.subtitle}
              onChange={(v) => setField("subtitle", v)}
            />
            <FormField
              label={t.fEngine}
              value={form.engine}
              onChange={(v) => setField("engine", v)}
            />
            <FormField
              label={t.fRole}
              value={form.role}
              onChange={(v) => setField("role", v)}
            />
            <FormField
              label={t.fStart}
              value={form.startDate}
              onChange={(v) => setField("startDate", v)}
            />
            <FormField
              label={t.fEnd}
              value={form.endDate}
              onChange={(v) => setField("endDate", v)}
            />
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: isCN
                    ? "'Noto Sans SC', sans-serif"
                    : "JetBrains Mono, monospace",
                  fontSize: 9,
                  color: "#4A6A7A",
                  letterSpacing: "0.1em",
                  marginBottom: 6,
                }}
              >
                {t.fGenre}
              </label>
              <select
                value={form.genre}
                onChange={(e) =>
                  setField("genre", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(0,217,255,0.04)",
                  border: "1px solid rgba(0,217,255,0.2)",
                  color: "#C8DFE8",
                  fontFamily: "Outfit, sans-serif",
                  fontSize: 13,
                  outline: "none",
                }}
              >
                {GENRES.filter((g) => g !== "All").map((g) => (
                  <option key={g} value={g}>
                    {tGenre(g, lang)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: isCN
                    ? "'Noto Sans SC', sans-serif"
                    : "JetBrains Mono, monospace",
                  fontSize: 9,
                  color: "#4A6A7A",
                  letterSpacing: "0.1em",
                  marginBottom: 6,
                }}
              >
                {t.fStatus}
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setField(
                    "status",
                    e.target.value as Game["status"],
                  )
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(0,217,255,0.04)",
                  border: "1px solid rgba(0,217,255,0.2)",
                  color: "#C8DFE8",
                  fontFamily: "Outfit, sans-serif",
                  fontSize: 13,
                  outline: "none",
                }}
              >
                <option value="completed">
                  {t.sCompleted}
                </option>
                <option value="in-progress">
                  {t.sInProgress}
                </option>
                <option value="prototype">
                  {t.sPrototype}
                </option>
              </select>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: isCN
                    ? "'Noto Sans SC', sans-serif"
                    : "JetBrains Mono, monospace",
                  fontSize: 9,
                  color: "#4A6A7A",
                  letterSpacing: "0.1em",
                  marginBottom: 6,
                }}
              >
                {t.fTeam}
              </label>
              <input
                type="number"
                min={1}
                value={form.teamSize}
                onChange={(e) =>
                  setField("teamSize", Number(e.target.value))
                }
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  background: "rgba(0,217,255,0.04)",
                  border: "1px solid rgba(0,217,255,0.2)",
                  color: "#C8DFE8",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <FormField
              label={t.fPlatforms}
              value={form.platforms.join(", ")}
              onChange={(v) =>
                setField(
                  "platforms",
                  v
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <FormField
              label={t.fTags}
              value={form.tags.join(", ")}
              onChange={(v) =>
                setField(
                  "tags",
                  v
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <FormField
              label={t.fMetrics}
              value={form.highlights.join(", ")}
              onChange={(v) =>
                setField(
                  "highlights",
                  v
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
            />
          </div>
        </FormSection>

        <FormSection label={t.formContent}>
          <FormTextarea
            label={t.fDesc}
            value={form.description}
            onChange={(v) => setField("description", v)}
            rows={4}
          />
          <FormTextarea
            label={t.fAnalysis}
            value={form.analysis}
            onChange={(v) => setField("analysis", v)}
            rows={6}
          />
          <FormTextarea
            label={t.fOpt}
            value={form.optimization}
            onChange={(v) => setField("optimization", v)}
            rows={6}
          />
          <FormTextarea
            label={t.fImpl}
            value={form.implementation}
            onChange={(v) => setField("implementation", v)}
            rows={6}
          />
          <ImageUrlField
            label={t.fImplImg1}
            value={(form.implImages ?? [])[0] ?? ""}
            onChange={(v) =>
              setField("implImages", [
                v,
                (form.implImages ?? [])[1] ?? "",
                (form.implImages ?? [])[2] ?? "",
              ])
            }
          />
          <ImageUrlField
            label={t.fImplImg2}
            value={(form.implImages ?? [])[1] ?? ""}
            onChange={(v) =>
              setField("implImages", [
                (form.implImages ?? [])[0] ?? "",
                v,
                (form.implImages ?? [])[2] ?? "",
              ])
            }
          />
          <ImageUrlField
            label={t.fImplImg3}
            value={(form.implImages ?? [])[2] ?? ""}
            onChange={(v) =>
              setField("implImages", [
                (form.implImages ?? [])[0] ?? "",
                (form.implImages ?? [])[1] ?? "",
                v,
              ])
            }
          />
        </FormSection>

        <FormSection label={t.formMedia}>
          <WeChatGuide />
          <ImageUrlField
            label={t.fShot1}
            value={form.screenshots[0] ?? ""}
            onChange={(v) =>
              setField("screenshots", [
                v,
                form.screenshots[1] ?? "",
                form.screenshots[2] ?? "",
              ])
            }
          />
          <ImageUrlField
            label={t.fShot2}
            value={form.screenshots[1] ?? ""}
            onChange={(v) =>
              setField("screenshots", [
                form.screenshots[0] ?? "",
                v,
                form.screenshots[2] ?? "",
              ])
            }
          />
          <ImageUrlField
            label={t.fShot3}
            value={form.screenshots[2] ?? ""}
            onChange={(v) =>
              setField("screenshots", [
                form.screenshots[0] ?? "",
                form.screenshots[1] ?? "",
                v,
              ])
            }
          />
          <div style={{ marginTop: 8 }}>
            <VideoUrlField
              label={t.fVideo}
              value={form.videoUrl}
              onChange={(v) => setField("videoUrl", v)}
            />
          </div>
        </FormSection>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button
          onClick={handleSaveForm}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 24px",
            background: "#00D9FF",
            color: "#04080F",
            fontFamily: isCN
              ? "'Noto Sans SC', sans-serif"
              : "Chakra Petch, sans-serif",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: isCN ? "0.04em" : "0.1em",
            border: "none",
            cursor: "pointer",
          }}
        >
          <Save size={14} />{" "}
          {isEdit ? t.saveChanges : t.createEntry}
        </button>
        <button
          onClick={() => setView("list")}
          style={{
            padding: "12px 24px",
            background: "transparent",
            color: "#4A6A7A",
            fontFamily: isCN
              ? "'Noto Sans SC', sans-serif"
              : "Chakra Petch, sans-serif",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: isCN ? "0.04em" : "0.1em",
            border: "1px solid rgba(0,217,255,0.2)",
            cursor: "pointer",
          }}
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
}

function FormSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ background: "#080F1A", padding: "20px 24px" }}
    >
      <div
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 9,
          color: "#00D9FF",
          letterSpacing: "0.15em",
          marginBottom: 16,
        }}
      >
        // {label}
      </div>
      {children}
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 9,
          color: "#4A6A7A",
          letterSpacing: "0.1em",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "10px 12px",
          background: "rgba(0,217,255,0.04)",
          border: "1px solid rgba(0,217,255,0.2)",
          color: "#C8DFE8",
          fontFamily: "Outfit, sans-serif",
          fontSize: 13,
          outline: "none",
          transition: "border-color 0.12s",
        }}
        onFocus={(e) =>
          (e.target.style.borderColor = "rgba(0,217,255,0.5)")
        }
        onBlur={(e) =>
          (e.target.style.borderColor = "rgba(0,217,255,0.2)")
        }
      />
    </div>
  );
}

function FormTextarea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label
        style={{
          display: "block",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 9,
          color: "#4A6A7A",
          letterSpacing: "0.1em",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "10px 12px",
          background: "rgba(0,217,255,0.04)",
          border: "1px solid rgba(0,217,255,0.2)",
          color: "#C8DFE8",
          fontFamily: "Outfit, sans-serif",
          fontSize: 13,
          outline: "none",
          resize: "vertical",
          lineHeight: 1.7,
          transition: "border-color 0.12s",
        }}
        onFocus={(e) =>
          (e.target.style.borderColor = "rgba(0,217,255,0.5)")
        }
        onBlur={(e) =>
          (e.target.style.borderColor = "rgba(0,217,255,0.2)")
        }
      />
    </div>
  );
}

// ─── Smart media fields ───────────────────────────────────────────────────────

function SourceBadge({ url }: { url: string }) {
  const src = detectMediaSource(url);
  const meta = SOURCE_META[src];
  if (!url.trim()) return null;
  return (
    <span
      style={{
        padding: "1px 7px",
        fontSize: 9,
        fontFamily: "JetBrains Mono, monospace",
        fontWeight: 700,
        letterSpacing: "0.08em",
        color: meta.color,
        border: `1px solid ${meta.color}44`,
        background: `${meta.color}10`,
      }}
    >
      {meta.label}
    </span>
  );
}

function ImageUrlField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [imgOk, setImgOk] = useState<boolean | null>(null);
  const src = detectMediaSource(value);
  const isImg = src === "wechat-image" || src === "image";
  const { t } = useLang();

  useEffect(() => {
    setImgOk(null);
  }, [value]);

  return (
    <div style={{ marginBottom: 8 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 5,
        }}
      >
        <label
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 9,
            color: "#4A6A7A",
            letterSpacing: "0.1em",
          }}
        >
          {label}
        </label>
        <SourceBadge url={value} />
        {isImg && imgOk === false && (
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 9,
              color: "#FF2D55",
            }}
          >
            {t.imgPreviewFail}
          </span>
        )}
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "flex-start",
        }}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            boxSizing: "border-box",
            padding: "10px 12px",
            background: "rgba(0,217,255,0.04)",
            border: "1px solid rgba(0,217,255,0.2)",
            color: "#C8DFE8",
            fontFamily: "Outfit, sans-serif",
            fontSize: 13,
            outline: "none",
            transition: "border-color 0.12s",
          }}
          onFocus={(e) =>
            (e.target.style.borderColor = "rgba(0,217,255,0.5)")
          }
          onBlur={(e) =>
            (e.target.style.borderColor = "rgba(0,217,255,0.2)")
          }
        />
        {isImg && value.trim() && (
          <div
            style={{
              flexShrink: 0,
              width: 72,
              height: 44,
              background: "#04080F",
              border: "1px solid rgba(0,217,255,0.15)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <img
              src={value}
              alt="preview"
              onLoad={() => setImgOk(true)}
              onError={() => setImgOk(false)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: imgOk === false ? "none" : "block",
              }}
            />
            {imgOk === false && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{ fontSize: 16, color: "#FF2D55" }}
                >
                  ✕
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function VideoUrlField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const { t } = useLang();
  const src = detectMediaSource(value);
  const canConvert =
    src === "tencent-video" && !value.includes("/txp/iframe");
  const [converted, setConverted] = useState(false);

  const handleConvert = () => {
    const embed = normalizeTencentUrl(value);
    onChange(embed);
    setConverted(true);
    setTimeout(() => setConverted(false), 2500);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 5,
        }}
      >
        <label
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 9,
            color: "#4A6A7A",
            letterSpacing: "0.1em",
          }}
        >
          {label}
        </label>
        <SourceBadge url={value} />
        {converted && (
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 9,
              color: "#00FF94",
            }}
          >
            {t.urlConverted}
          </span>
        )}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            boxSizing: "border-box",
            padding: "10px 12px",
            background: "rgba(0,217,255,0.04)",
            border: "1px solid rgba(0,217,255,0.2)",
            color: "#C8DFE8",
            fontFamily: "Outfit, sans-serif",
            fontSize: 13,
            outline: "none",
            transition: "border-color 0.12s",
          }}
          onFocus={(e) =>
            (e.target.style.borderColor = "rgba(0,217,255,0.5)")
          }
          onBlur={(e) =>
            (e.target.style.borderColor = "rgba(0,217,255,0.2)")
          }
        />
        {canConvert && (
          <button
            onClick={handleConvert}
            style={{
              flexShrink: 0,
              padding: "0 12px",
              background: "rgba(255,107,0,0.1)",
              border: "1px solid #FF6B00",
              color: "#FF6B00",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.06em",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.12s",
            }}
            onMouseEnter={(e) => {
              (
                e.currentTarget as HTMLButtonElement
              ).style.background = "rgba(255,107,0,0.2)";
            }}
            onMouseLeave={(e) => {
              (
                e.currentTarget as HTMLButtonElement
              ).style.background = "rgba(255,107,0,0.1)";
            }}
          >
            {t.convertToEmbed}
          </button>
        )}
        {src === "wechat-video" && value.trim() && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flexShrink: 0,
              padding: "0 12px",
              display: "flex",
              alignItems: "center",
              background: "rgba(7,193,96,0.1)",
              border: "1px solid #07C160",
              color: "#07C160",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "all 0.12s",
            }}
          >
            {t.openExternal}
          </a>
        )}
      </div>
    </div>
  );
}

function WeChatGuide() {
  const { lang, t } = useLang();
  const isCN = lang === "cn";
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        marginBottom: 16,
        border: "1px solid rgba(7,193,96,0.2)",
        background: "rgba(7,193,96,0.04)",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: 12 }}>💬</span>
        <span
          style={{
            fontFamily: isCN
              ? "'Noto Sans SC', sans-serif"
              : "Chakra Petch, sans-serif",
            fontSize: 10,
            fontWeight: 700,
            color: "#07C160",
            letterSpacing: "0.06em",
            flex: 1,
          }}
        >
          {t.wchatGuideTitle}
        </span>
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            color: "#07C160",
          }}
        >
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && (
        <div
          style={{
            padding: "0 14px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {[
            t.wchatGuideImg,
            t.wchatGuideVideoTencent,
            t.wchatGuideVideoWx,
          ].map((line, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  color: "#07C160",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 10,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {i === 0 ? "IMG" : "VID"}
              </span>
              <span
                style={{
                  fontFamily: isCN
                    ? "'Noto Sans SC', sans-serif"
                    : "Outfit, sans-serif",
                  fontSize: 12,
                  color: "#4A6A7A",
                  lineHeight: 1.6,
                }}
              >
                {line}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── VideoPlayer ──────────────────────────────────────────────────────────────

function VideoPlayer({
  videoUrl,
  title,
}: {
  videoUrl: string;
  title: string;
}) {
  const { t } = useLang();
  if (!videoUrl) {
    return (
      <div
        style={{
          padding: "60px 0",
          textAlign: "center",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 12,
          color: "#4A6A7A",
        }}
      >
        {t.videoMissing}
      </div>
    );
  }
  const source = detectMediaSource(videoUrl);
  if (source === "video") {
    return (
      <div
        style={{
          background: "#04080F",
          border: "1px solid rgba(0,217,255,0.12)",
        }}
      >
        <video
          src={videoUrl}
          controls
          style={{
            width: "100%",
            display: "block",
            maxHeight: 480,
          }}
        >
          Your browser does not support video playback.
        </video>
      </div>
    );
  }
  if (source === "youtube" || source === "tencent-video") {
    const embedUrl =
      source === "tencent-video"
        ? normalizeTencentUrl(videoUrl)
        : videoUrl;
    return (
      <div
        style={{
          position: "relative",
          paddingTop: "56.25%",
          background: "#04080F",
          border: "1px solid rgba(0,217,255,0.12)",
        }}
      >
        <iframe
          src={embedUrl}
          title={`${title} gameplay demo`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  if (source === "wechat-video") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          padding: "48px 0",
          border: "1px solid rgba(7,193,96,0.25)",
          background: "rgba(7,193,96,0.04)",
        }}
      >
        <div
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            color: "#07C160",
            letterSpacing: "0.1em",
          }}
        >
          微信视频 / WECHAT VIDEO
        </div>
        <div
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: 13,
            color: "#8BB0C2",
            textAlign: "center",
            maxWidth: 320,
          }}
        >
          此视频托管在微信平台，需在外部打开
          <br />
          This video is hosted on WeChat and must be opened
          externally.
        </div>
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 24px",
            background: "#07C160",
            color: "#FFFFFF",
            fontFamily: "Chakra Petch, sans-serif",
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: "0.06em",
            textDecoration: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8.5 13.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm6 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm4.5 0c0 3.59-4.03 6.5-9 6.5-1.56 0-3.02-.38-4.28-1.03L2 20l1.13-3.38C2.41 15.59 2 14.09 2 12.5 2 8.91 6.03 6 11 6s9 2.91 9 6.5z" />
          </svg>
          {t.openExternal}
        </a>
      </div>
    );
  }
  // fallback: render as external link
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        padding: "48px 0",
        border: "1px solid rgba(0,217,255,0.12)",
      }}
    >
      <div
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 10,
          color: "#4A6A7A",
          letterSpacing: "0.1em",
        }}
      >
        EXTERNAL VIDEO
      </div>
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 24px",
          background: "rgba(0,217,255,0.08)",
          color: "#00D9FF",
          border: "1px solid rgba(0,217,255,0.3)",
          fontFamily: "Chakra Petch, sans-serif",
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: "0.06em",
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        {t.openExternal}
      </a>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const { lang, t } = useLang();
  const isCN = lang === "cn";
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(0,217,255,0.1)",
        padding: "24px",
        maxWidth: 1440,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: isCN
              ? "'Noto Sans SC', sans-serif"
              : "JetBrains Mono, monospace",
            fontSize: 10,
            color: "#4A6A7A",
            letterSpacing: isCN ? "0.02em" : "0.08em",
          }}
        >
          {t.footerCopy}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Terminal size={10} style={{ color: "#4A6A7A" }} />
          <span
            style={{
              fontFamily: isCN
                ? "'Noto Sans SC', sans-serif"
                : "JetBrains Mono, monospace",
              fontSize: 10,
              color: "#4A6A7A",
            }}
          >
            {t.footerBuilt}
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [section, setSection] =
    useState<NavSection>("portfolio");
  const [games, setGames] = useState<Game[]>(SEED_GAMES);

  useEffect(() => {
    loadGames().then(setGames);
  }, []);
  const [selected, setSelected] = useState<Game | null>(null);
  const [lang, setLang] = useState<Lang>("en");

  const handleSaveGames = useCallback((updated: Game[]) => {
    setGames(updated);
    void saveGames(updated);
  }, []);

  const langCtx = { lang, setLang, t: T[lang] as typeof T.en };

  return (
    <LangContext.Provider value={langCtx}>
      <div
        style={{
          minHeight: "100vh",
          background: "#04080F",
          position: "relative",
        }}
      >
        <Scanlines />
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            backgroundImage:
              "linear-gradient(rgba(0,217,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.02) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <HUDNav active={section} onNav={setSection} />
          <main style={{ paddingTop: 56 }}>
            {section === "portfolio" && (
              <>
                <Hero gameCount={games.length} />
                <GamesGrid
                  games={games}
                  onSelect={setSelected}
                />
              </>
            )}
            {section === "about" && <About />}
            {section === "admin" && (
              <Admin games={games} onSave={handleSaveGames} />
            )}
          </main>
          <Footer />
        </div>
        {selected && (
          <GameModal
            game={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </LangContext.Provider>
  );
}