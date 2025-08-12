#!/usr/bin/env node

/**
 * DeepSeek API 完整测试脚本
 * 包括余额检查、模型列表和聊天完成测试
 */

const API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-6385b01e34cd4c3db0f07378ae77ede7';

async function makeRequest(url, options) {
  try {
    const response = await fetch(url, options);
    const data = await response.text();
    
    return {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
      data: data ? JSON.parse(data) : null
    };
  } catch (error) {
    return {
      error: error.message,
      status: null
    };
  }
}

async function testDeepSeekAPI() {
  console.log('🔄 DeepSeek API 完整测试开始...');
  console.log('🔑 API密钥:', API_KEY.substring(0, 15) + '...');
  console.log('='  .repeat(60));

  // 1. 测试模型列表 (通常免费)
  console.log('\n📋 1. 测试模型列表...');
  const modelsResult = await makeRequest('https://api.deepseek.com/v1/models', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
    },
  });

  if (modelsResult.ok) {
    console.log('✅ 模型列表获取成功');
    console.log('📊 可用模型:', modelsResult.data.data?.map(m => m.id).join(', '));
  } else {
    console.log('❌ 模型列表获取失败:', modelsResult.status, modelsResult.data);
  }

  // 2. 测试余额查询 (如果API支持)
  console.log('\n💰 2. 尝试查询账户余额...');
  const balanceResult = await makeRequest('https://api.deepseek.com/user/balance', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
    },
  });

  if (balanceResult.ok) {
    console.log('✅ 余额查询成功:', balanceResult.data);
  } else {
    console.log('⚠️ 余额查询失败 (可能不支持此API):', balanceResult.status);
  }

  // 3. 测试聊天完成 (需要余额)
  console.log('\n💬 3. 测试聊天完成...');
  const chatResult = await makeRequest('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: '请简单说一句话测试API连接'
        }
      ],
      max_tokens: 50,
      temperature: 0.1,
      stream: false,
    }),
  });

  console.log('📊 聊天API响应状态:', chatResult.status, chatResult.statusText);

  if (chatResult.ok) {
    console.log('✅ 聊天API调用成功!');
    console.log('🤖 AI回复:', chatResult.data.choices[0].message.content);
    console.log('📈 令牌使用:', chatResult.data.usage);
  } else {
    console.log('❌ 聊天API调用失败');
    console.log('📄 完整错误响应:', JSON.stringify(chatResult.data, null, 2));
    
    if (chatResult.status === 402) {
      console.log('\n💡 402错误分析:');
      console.log('   - 这确实是余额不足的错误');
      console.log('   - 即使能获取模型列表，聊天API仍需要付费');
      console.log('   - 请访问 https://platform.deepseek.com 检查余额');
      console.log('   - 新用户可能需要先充值才能使用聊天功能');
    }
  }

  // 4. 测试使用v1端点的兼容性
  console.log('\n🔄 4. 测试v1兼容端点...');
  const v1ChatResult = await makeRequest('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: '测试v1端点'
        }
      ],
      max_tokens: 30,
      temperature: 0.1,
    }),
  });

  console.log('📊 v1端点响应状态:', v1ChatResult.status, v1ChatResult.statusText);

  if (v1ChatResult.ok) {
    console.log('✅ v1端点也可以工作!');
    console.log('🤖 AI回复:', v1ChatResult.data.choices[0].message.content);
  } else {
    console.log('❌ v1端点失败:', v1ChatResult.data);
  }

  console.log('\n' + '=' .repeat(60));
  console.log('🎯 测试总结:');
  console.log(`   模型列表: ${modelsResult.ok ? '✅' : '❌'}`);
  console.log(`   余额查询: ${balanceResult.ok ? '✅' : '⚠️'}`);
  console.log(`   聊天API: ${chatResult.ok ? '✅' : '❌'}`);
  console.log(`   v1端点: ${v1ChatResult.ok ? '✅' : '❌'}`);

  if (!chatResult.ok && !v1ChatResult.ok) {
    console.log('\n🚨 建议操作:');
    console.log('1. 访问 https://platform.deepseek.com/usage 查看余额');
    console.log('2. 如果余额为0，请进行充值');
    console.log('3. 确认API密钥有聊天权限');
    console.log('4. 检查是否有地域限制');
  }
}

// 运行测试
testDeepSeekAPI().catch(console.error);
