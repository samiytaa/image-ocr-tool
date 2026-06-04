# API 配置说明

## 当前遇到的 503 错误

如果您看到 **503 Service Unavailable** 错误，这意味着 API 服务暂时不可用。可能的原因：

1. **服务器维护** - API 提供商正在进行维护
2. **请求过多** - 服务器负载过高
3. **网络问题** - 您的网络无法访问该服务
4. **API 密钥配额用尽** - 您的 API 使用额度已达上限

## 解决方案

### 方案 1: 等待并重试
应用已经添加了自动重试功能，会在 503 错误时自动重试 2 次。如果仍然失败，请等待几分钟后再试。

### 方案 2: 使用替代 API 服务

您可以切换到其他支持 OpenAI 格式的视觉模型 API，例如：

#### OpenAI 官方 API
```
端点: https://api.openai.com/v1
模型: gpt-4-vision-preview 或 gpt-4o
API 密钥: 您的 OpenAI API 密钥
```

#### Google Gemini API (通过兼容接口)
```
端点: https://generativelanguage.googleapis.com/v1beta/openai/
模型: gemini-pro-vision
API 密钥: 您的 Google API 密钥
```

#### 其他兼容服务
- Claude API (通过代理)
- 阿里云通义千问
- 百度文心一言
- 讯飞星火

### 方案 3: 检查网络连接

1. 确认您能访问外网
2. 检查是否需要代理设置
3. 尝试在浏览器中直接访问 API 端点

### 方案 4: 验证 API 密钥

1. 检查 API 密钥是否正确
2. 确认密钥是否有足够的配额
3. 验证密钥是否有访问视觉模型的权限

## 修改配置

在应用界面中：
1. 点击顶部的 "API 配置" 按钮
2. 输入新的 API 端点、密钥和模型名称
3. 点击"测试连接"验证配置
4. 保存配置

## 技术细节

当前应用使用的是兼容 OpenAI Chat Completions API 格式的接口，支持多模态（图像+文本）输入。

请求格式：
```json
POST {endpoint}/chat/completions
Headers:
  Content-Type: application/json
  Authorization: Bearer {apiKey}
Body:
{
  "model": "{model}",
  "messages": [{
    "role": "user",
    "content": [
      {"type": "text", "text": "提示词"},
      {"type": "image_url", "image_url": {"url": "data:image/jpeg;base64,..."}}
    ]
  }],
  "max_tokens": 2000
}
```

任何支持此格式的 API 服务都可以使用。
