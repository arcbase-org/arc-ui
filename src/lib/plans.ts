// Piani e modelli AI di ticly usati dai widget della dashboard.
// Versione ridotta di login.ticly.it/src/lib/plans.ts: solo i campi che servono ai widget.
// Non contiene ID di Stripe, costi dei modelli né le regole di calcolo dei crediti.

export type PlanId = "FREE" | "PLUS" | "PRO" | "MEGA" | "ULTRA";

export interface PlanConfig {
  id: PlanId;
  name: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  /** Piano minimo che dà accesso al modello */
  minPlan: PlanId;
}

export const TIER_LEVELS: Record<PlanId, number> = {
  FREE: 0,
  PLUS: 1,
  PRO: 2,
  MEGA: 3,
  ULTRA: 4,
};

export const PLANS: Record<PlanId, PlanConfig> = {
  FREE: { id: "FREE", name: "Free" },
  PLUS: { id: "PLUS", name: "AI Plus" },
  PRO: { id: "PRO", name: "Pro" },
  MEGA: { id: "MEGA", name: "Mega" },
  ULTRA: { id: "ULTRA", name: "AI Ultra" },
};

export const AI_MODELS: AIModel[] = [
  { id: "openrouter/free", name: "OpenRouter Free Auto (Raccomandato)", provider: "OpenRouter", minPlan: "FREE" },
  { id: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free", name: "NVIDIA Nemotron 3 Nano Omni", provider: "NVIDIA", minPlan: "FREE" },
  { id: "google/gemma-4-31b-it:free", name: "Google Gemma 4 31B", provider: "Google", minPlan: "FREE" },
  { id: "nvidia/nemotron-3.5-lightning:free", name: "NVIDIA Nemotron 3.5 Lightning (free)", provider: "NVIDIA", minPlan: "FREE" },
  { id: "nvidia/nemotron-3-ultra-550b-a55b:free", name: "NVIDIA Nemotron 3 Ultra (free)", provider: "NVIDIA", minPlan: "FREE" },
  { id: "nvidia/nemotron-3-super-120b-a12b:free", name: "NVIDIA Nemotron 3 Super", provider: "NVIDIA", minPlan: "FREE" },
  { id: "qwen/qwen3.7-flash", name: "Qwen3.7 Flash", provider: "Alibaba Cloud", minPlan: "PLUS" },
  { id: "openai/gpt-5.6-luna", name: "GPT-5.6 Luna", provider: "OpenAI", minPlan: "PLUS" },
  { id: "deepseek/deepseek-v4-pro", name: "DeepSeek V4 Pro", provider: "DeepSeek", minPlan: "PLUS" },
  { id: "qwen/qwen3.6-plus", name: "Qwen3.6 Plus", provider: "Alibaba Cloud", minPlan: "PLUS" },
  { id: "minimax/minimax-m3", name: "MiniMax M3", provider: "MiniMax", minPlan: "PRO" },
  { id: "moonshotai/kimi-k2.6", name: "Kimi K2.6", provider: "Moonshot AI", minPlan: "PRO" },
  { id: "qwen/qwen3.8-27b", name: "Qwen3.8 27B", provider: "Alibaba Cloud", minPlan: "PRO" },
  { id: "z-ai/glm-5.2", name: "GLM-5.2", provider: "Zhipu AI", minPlan: "PRO" },
  { id: "anthropic/claude-haiku-4.5", name: "Claude Haiku 4.5", provider: "Anthropic", minPlan: "PRO" },
  { id: "qwen/qwen3.8-max-0902", name: "Qwen3.8 Max", provider: "Alibaba Cloud", minPlan: "MEGA" },
  { id: "google/gemini-3.6-flash", name: "Gemini 3.6 Flash", provider: "Google", minPlan: "MEGA" },
  { id: "openai/gpt-5.6-terra", name: "GPT-5.6 Terra", provider: "OpenAI", minPlan: "MEGA" },
  { id: "google/gemini-3.1-pro-preview", name: "Gemini 3.1 Pro", provider: "Google", minPlan: "MEGA" },
  { id: "anthropic/claude-sonnet-5", name: "Claude Sonnet 5", provider: "Anthropic", minPlan: "MEGA" },
  { id: "anthropic/claude-opus-5", name: "Claude Opus 5", provider: "Anthropic", minPlan: "MEGA" },
  { id: "anthropic/claude-opus-4.8", name: "Claude Opus 4.8", provider: "Anthropic", minPlan: "MEGA" },
  { id: "openai/gpt-5.5", name: "GPT-5.5", provider: "OpenAI", minPlan: "MEGA" },
  { id: "openai/gpt-5.6-sol", name: "GPT-5.6 Sol", provider: "OpenAI", minPlan: "MEGA" },
  { id: "anthropic/claude-fable-5.1", name: "Claude Fable 5.1", provider: "Anthropic", minPlan: "ULTRA" },
  { id: "openai/gpt-6-astra", name: "GPT-6 Astra", provider: "OpenAI", minPlan: "ULTRA" },
  { id: "anthropic/claude-fable-5", name: "Claude Fable 5", provider: "Anthropic", minPlan: "ULTRA" },
];

export function hasTierAccess(userPlan: string | null | undefined, requiredPlan: PlanId): boolean {
  const normalizedUserPlan = (userPlan || "FREE").toUpperCase() as PlanId;
  const userLevel = TIER_LEVELS[normalizedUserPlan] ?? 0;
  const requiredLevel = TIER_LEVELS[requiredPlan] ?? 0;
  return userLevel >= requiredLevel;
}
