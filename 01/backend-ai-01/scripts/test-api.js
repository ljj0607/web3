#!/usr/bin/env node

/**
 * Simple script to test the GraphQL API
 * Usage: node scripts/test-api.js [endpoint]
 */

const endpoint = process.argv[2] || 'http://localhost:8787/graphql';

async function testAPI() {
  console.log(`Testing API at: ${endpoint}\n`);

  // Test 1: Health Check
  console.log('1. Testing Health Check...');
  try {
    const healthResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query { health { status timestamp version } }`
      })
    });
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.data.health);
  } catch (error) {
    console.error('❌ Health Check failed:', error.message);
  }

  console.log();

  // Test 2: Hello Query
  console.log('2. Testing Hello Query...');
  try {
    const helloResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query { hello }`
      })
    });
    const helloData = await helloResponse.json();
    console.log('✅ Hello Query:', helloData.data.hello);
  } catch (error) {
    console.error('❌ Hello Query failed:', error.message);
  }

  console.log();

  // Test 3: Send Message
  console.log('3. Testing Send Message...');
  try {
    const messageResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `mutation SendMessage($message: String!) {
          sendMessage(message: $message) {
            response
            error
          }
        }`,
        variables: {
          message: "What is GraphQL in one sentence?"
        }
      })
    });
    const messageData = await messageResponse.json();
    
    if (messageData.data?.sendMessage?.error) {
      console.log('⚠️  Send Message returned error:', messageData.data.sendMessage.error);
      console.log('   Make sure DEEPSEEK_API_KEY is configured');
    } else {
      console.log('✅ Send Message Response:', messageData.data.sendMessage.response);
    }
  } catch (error) {
    console.error('❌ Send Message failed:', error.message);
  }

  console.log();

  // Test 4: Empty Message (Error Case)
  console.log('4. Testing Empty Message (should return error)...');
  try {
    const emptyResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `mutation { sendMessage(message: "") { response error } }`
      })
    });
    const emptyData = await emptyResponse.json();
    
    if (emptyData.data?.sendMessage?.error) {
      console.log('✅ Empty Message Error (expected):', emptyData.data.sendMessage.error);
    } else {
      console.log('❌ Empty Message should have returned an error');
    }
  } catch (error) {
    console.error('❌ Empty Message test failed:', error.message);
  }

  console.log('\n=== API Test Complete ==="');
}

// Run tests
testAPI().catch(console.error);