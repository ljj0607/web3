import OpenAI from 'openai';
import { Env } from './index';

export interface Context {
  deepseek: OpenAI;  // 改名为 deepseek 但仍使用 OpenAI SDK
  env: Env;
}

export function createContext(env: Env): Context {
  // 根据官方文档：https://api-docs.deepseek.com/
  // DeepSeek API 兼容 OpenAI SDK，使用正确的 baseURL
  const deepseek = new OpenAI({
    apiKey: env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com',  // 官方推荐的 baseURL
  });

  return {
    deepseek,
    env,
  };
}
