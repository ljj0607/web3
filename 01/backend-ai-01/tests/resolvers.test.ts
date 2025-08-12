import { resolvers } from '../src/resolvers';
import { Context } from '../src/context';

describe('Resolvers', () => {
  describe('Query', () => {
    it('should return hello message', () => {
      const result = resolvers.Query.hello();
      expect(result).toBe('Hello from AI Chat Backend!');
    });

    it('should return health status', () => {
      const result = resolvers.Query.health();
      expect(result.status).toBe('healthy');
      expect(result.version).toBe('1.0.0');
      expect(result.timestamp).toBeDefined();
    });
  });

  describe('Mutation', () => {
    it('should validate empty messages', async () => {
      const mockContext = {
        openai: {},
        env: { DEEPSEEK_API_KEY: 'test-key' },
      } as Context;

      const result = await resolvers.Mutation.sendMessage(
        {},
        { message: '' },
        mockContext
      );

      expect(result.error).toBe('Message cannot be empty');
      expect(result.response).toBe('');
    });

    it('should handle missing API key', async () => {
      const mockContext = {
        openai: {},
        env: { DEEPSEEK_API_KEY: '' },
      } as Context;

      const result = await resolvers.Mutation.sendMessage(
        {},
        { message: 'Hello' },
        mockContext
      );

      expect(result.error).toContain('OpenAI API key is not configured');
      expect(result.response).toBe('');
    });
  });
});