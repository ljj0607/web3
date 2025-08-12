import { Context } from './context';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

interface SendMessageArgs {
  message: string;
}

export const resolvers = {
  Query: {
    hello: () => 'Hello from AI Chat Backend (Powered by DeepSeek)!',
    health: () => ({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    }),
  },
  Mutation: {
    sendMessage: async (
      _: unknown,
      { message }: SendMessageArgs,
      context: Context
    ) => {
      try {
        // Validate input
        if (!message || message.trim().length === 0) {
          return {
            response: '',
            error: 'Message cannot be empty',
          };
        }

        console.log('🔍 Debug info:', {
          messageLength: message.length,
          hasApiKey: !!context.env.DEEPSEEK_API_KEY,
          apiKeyPrefix: context.env.DEEPSEEK_API_KEY?.substring(0, 10) + '...',
        });

        // Check for API key
        if (!context.env.DEEPSEEK_API_KEY || context.env.DEEPSEEK_API_KEY === 'dummy-key') {
          console.error('DeepSeek API key is not configured');
          return {
            response: `🤖 模拟助手回复：我收到了您的消息 "${message}"。

要使用真实的 AI 响应，请：
1. 注册 DeepSeek 账号：https://platform.deepseek.com
2. 获取 API Key（新用户有免费额度）
3. 在 .dev.vars 文件中设置 DEEPSEEK_API_KEY=sk-xxxxx`,
            error: null,  // 返回模拟响应而不是错误
          };
        }

        console.log('✅ API密钥已配置，正在调用DeepSeek API...');

        // Create messages array for DeepSeek
        const messages: ChatCompletionMessageParam[] = [
          {
            role: 'system',
            content: '你是一个友好、有帮助的 AI 助手。请用清晰、准确的方式回复用户。如果用户使用中文，请用中文回复；如果用户使用英文，请用英文回复。支持 Markdown 格式输出。',
          },
          {
            role: 'user',
            content: message,
          },
        ];

        // Call DeepSeek API (using OpenAI SDK with DeepSeek endpoint)
        const completion = await context.deepseek.chat.completions.create({
          model: 'deepseek-chat',  // DeepSeek 模型名称
          messages,
          temperature: 0.7,
          max_tokens: 2000,  // DeepSeek 支持更多 tokens
          stream: false,
        });

        const response = completion.choices[0]?.message?.content || '没有生成响应';
        
        console.log('🎉 DeepSeek API调用成功:', {
          responseLength: response.length,
          usage: completion.usage,
        });

        return {
          response,
          error: null,
        };
      } catch (error) {
        console.error('💥 sendMessage解析器错误:', error);
        
        // Handle specific error types
        if (error instanceof Error) {
          // API 密钥无效
          if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            return {
              response: '',
              error: 'DeepSeek API 密钥无效。请检查您的 DEEPSEEK_API_KEY 配置。',
            };
          }
          
          // 余额不足
          if (error.message.includes('402') || error.message.includes('insufficient') || error.message.includes('balance')) {
            return {
              response: '',
              error: 'DeepSeek API 余额不足。请检查您的账户余额或使用免费额度。访问：https://platform.deepseek.com',
            };
          }
          
          // 速率限制
          if (error.message.includes('429') || error.message.includes('rate')) {
            return {
              response: `🤖 系统繁忙：由于请求过多，让我用模拟方式回复您。

您说："${message}"

这听起来很有趣！请稍后再试真实的 AI 响应。`,
              error: null,
            };
          }
          
          // 网络超时
          if (error.message.includes('timeout')) {
            return {
              response: '',
              error: '请求超时，请稍后再试。',
            };
          }
          
          // 网络错误
          if (error.message.includes('fetch') || error.message.includes('network')) {
            return {
              response: '',
              error: '网络连接错误，请检查网络设置。',
            };
          }
        }

        // 记录详细错误信息用于调试
        console.error('详细错误信息:', {
          name: error?.name,
          message: error?.message,
          stack: error?.stack,
        });

        // 未知错误 - 返回友好的模拟响应
        return {
          response: `🤖 模拟助手：我收到了您的消息 "${message}"。系统暂时无法连接到 AI 服务，但我会尽力帮助您！

错误详情（用于调试）：${error?.message || '未知错误'}`,
          error: null,
        };
      }
    },
  },
};
