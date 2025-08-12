import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

// Simple in-memory storage for conversation history
// Note: This will reset when the worker restarts
// For production, consider using Cloudflare KV or Durable Objects
const conversationHistory = new Map<string, ChatCompletionMessageParam[]>();

export function getConversationHistory(sessionId: string): ChatCompletionMessageParam[] {
  return conversationHistory.get(sessionId) || [];
}

export function addToConversationHistory(
  sessionId: string,
  message: ChatCompletionMessageParam
): void {
  const history = getConversationHistory(sessionId);
  history.push(message);
  
  // Keep only last 10 messages to avoid token limits
  if (history.length > 10) {
    history.shift();
  }
  
  conversationHistory.set(sessionId, history);
}

export function clearConversationHistory(sessionId: string): void {
  conversationHistory.delete(sessionId);
}