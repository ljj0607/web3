## 项目启动
```bash
cd backend-ai-01
npm install
npm run dev
npm run deploy
```

## 写入本地文件
```bash
echo "DEEPSEEK_API_KEY=sk-your-actual-api-key-here" > .dev.vars
```

## 测试文件
```bash
# Run the test script
node scripts/test-deepseek-api.js
```

## 地址
本地： `http://localhost:8787/graphql`
Workers： `https://backend-ai-01.leijingjing691.workers.dev/graphql`
线上：`https://chatai.jinger.bar/`

### Method 3: Using cURL
```bash
curl -X POST http://localhost:8787/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { sendMessage(message: \"Hello! Please introduce yourself\") { response error } }"
  }'
```

## 部署
```bash
wrangler log
wrangler secret put DEEPSEEK_API_KEY
wrangler run deploy
```

### Queries

```graphql
type Query {
  hello: String!
  health: HealthStatus!
}

type HealthStatus {
  status: String!
  timestamp: String!
  version: String!
}
```

### Mutations

```graphql
type Mutation {
  sendMessage(message: String!): ChatResponse!
}

type ChatResponse {
  response: String!
  error: String
}
```

### 测试

```graphql
mutation TestChat {
  sendMessage(message: "你好，请介绍一下你自己") {
    response
    error
  }
}