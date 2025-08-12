## 项目启动
```bash
cd frontend-ai-01
npm install
cp .env.example .env.local
npm start
```

## 打包
```bash
npm run build
```
## 地址
本地: `https://frontend-ai-01.pages.dev`
Pages：`https://frontend-ai-01.pages.dev/`
线上：`https://chatai.jinger.bar/`

## Testing
```bash
npm test
```
## 部署
```bash
npm install -g wrangler
wrangler login
npm run build
