import { ApiConfig, OcrFormData, OcrResult } from '../types';

// Retry helper function
const fetchWithRetry = async (
  url: string, 
  options: RequestInit, 
  maxRetries: number = 2,
  retryDelay: number = 1000
): Promise<Response> => {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      // If 503, retry; otherwise return response
      if (response.status !== 503 || i === maxRetries) {
        return response;
      }
      
      console.log(`服务暂时不可用 (503)，${retryDelay}ms 后重试... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      retryDelay *= 2; // Exponential backoff
    } catch (error) {
      if (i === maxRetries) throw error;
      console.log(`请求失败，${retryDelay}ms 后重试... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      retryDelay *= 2;
    }
  }
  throw new Error('Max retries exceeded');
};

// Perform multi-modal OCR based on API settings
export const performOcrOnBase64 = async (
  base64Image: string,
  apiConfig: ApiConfig,
  option1: string,
  option2: string,
  option3: string
): Promise<OcrFormData | null> => {
  try {
    const prompt = `请识别这张游戏家具图片中的信息，并严格按照以下JSON格式输出，不要添加任何其他内容：

{
  "name": "家具名称（图片顶部的标题）",
  "usage": "用处（绿色文字，例如：左慈·自由摆放家具）",
  "description": "描述（主要文字内容）",
  "obtain": "获取方式（底部按钮左侧的文字，例如：【起居】家具打造）",
  "quality": "品质（根据左上角圆形头像的背景色判断，紫色=紫，绿色=绿，蓝色=蓝，橙色=橙）",
  "gridSize": "占格数（右上角显示的格子数，例如：2*2）"
}

请直接输出JSON，不要包含markdown代码块标记。`;

    const cleanEndpoint = apiConfig.endpoint.replace(/\/$/, '');
    const chatUrl = `${cleanEndpoint}/chat/completions`;

    const response = await fetchWithRetry(chatUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiConfig.apiKey}`
      },
      body: JSON.stringify({
        model: apiConfig.model,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }],
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      if (response.status === 503) {
        throw new Error(`服务暂时不可用 (503)，请稍后重试。可能原因：\n1. API服务器正在维护\n2. 请求过多，服务器过载\n3. 网络连接问题\n\n详细信息: ${errorText}`);
      }
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const responseData = await response.json();
    let resText = responseData.choices[0].message.content;

    // Try parsing JSON format
    let cleanJsonText = resText.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanJsonText) as OcrResult;

    return processOcrResult(parsed, option1, option2, option3);
  } catch (err) {
    console.error('OCR Error:', err);
    
    // 提供更详细的错误信息
    if (err instanceof Error) {
      if (err.message.includes('503')) {
        console.error('提取 加载失败: API 服务暂时不可用，请稍后重试');
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        console.error('提取 加载失败: 网络连接失败，请检查网络连接');
      } else if (err.message.includes('401') || err.message.includes('403')) {
        console.error('提取 加载失败: API 密钥无效或权限不足');
      } else {
        console.error(`提取 加载失败: ${err.message}`);
      }
    }
    
    return null;
  }
};

// 批量处理多张图片（一次API调用）
export const performBatchOcrOnBase64 = async (
  base64Images: string[],
  apiConfig: ApiConfig,
  option1: string,
  option2: string,
  option3: string
): Promise<(OcrFormData | null)[]> => {
  try {
    const prompt = `请识别这${base64Images.length}张游戏家具图片中的信息。对每张图片，按照以下JSON格式识别，最终返回一个JSON数组，数组中每个元素对应一张图片的识别结果：

[
  {
    "name": "家具名称（图片顶部的标题）",
    "usage": "用处（绿色文字，例如：左慈·自由摆放家具）",
    "description": "描述（主要文字内容）",
    "obtain": "获取方式（底部按钮左侧的文字，例如：【起居】家具打造）",
    "quality": "品质（根据左上角圆形头像的背景色判断，紫色=紫，绿色=绿，蓝色=蓝，橙色=橙）",
    "gridSize": "占格数（右上角显示的格子数，例如：2*2）"
  },
  ... (后续图片的识别结果)
]

重要说明：
1. 请按照图片的顺序依次识别
2. 返回的数组长度必须等于图片数量(${base64Images.length})
3. 如果某张图片无法识别，对应位置返回null
4. 请直接输出JSON数组，不要包含markdown代码块标记`;

    const cleanEndpoint = apiConfig.endpoint.replace(/\/$/, '');
    const chatUrl = `${cleanEndpoint}/chat/completions`;

    // 构建包含所有图片的content数组
    const content: any[] = [
      {
        type: 'text',
        text: prompt
      }
    ];

    // 添加所有图片
    for (const base64Image of base64Images) {
      content.push({
        type: 'image_url',
        image_url: {
          url: `data:image/jpeg;base64,${base64Image}`
        }
      });
    }

    const response = await fetchWithRetry(chatUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiConfig.apiKey}`
      },
      body: JSON.stringify({
        model: apiConfig.model,
        messages: [{
          role: 'user',
          content: content
        }],
        max_tokens: 4000 * base64Images.length // 根据图片数量调整max_tokens
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      if (response.status === 503) {
        throw new Error(`服务暂时不可用 (503)，请稍后重试。可能原因：\n1. API服务器正在维护\n2. 请求过多，服务器过载\n3. 网络连接问题\n\n详细信息: ${errorText}`);
      }
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const responseData = await response.json();
    let resText = responseData.choices[0].message.content;

    // 清理JSON格式
    let cleanJsonText = resText.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
    const parsedArray = JSON.parse(cleanJsonText) as (OcrResult | null)[];

    // 处理每个识别结果
    const results: (OcrFormData | null)[] = [];
    for (const parsed of parsedArray) {
      if (parsed === null) {
        results.push(null);
      } else {
        results.push(processOcrResult(parsed, option1, option2, option3));
      }
    }

    return results;
  } catch (err) {
    console.error('Batch OCR Error:', err);
    
    if (err instanceof Error) {
      if (err.message.includes('503')) {
        console.error('批量提取失败: API 服务暂时不可用，请稍后重试');
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        console.error('批量提取失败: 网络连接失败，请检查网络连接');
      } else if (err.message.includes('401') || err.message.includes('403')) {
        console.error('批量提取失败: API 密钥无效或权限不足');
      } else {
        console.error(`批量提取失败: ${err.message}`);
      }
    }
    
    // 返回全null数组
    return new Array(base64Images.length).fill(null);
  }
};

// 提取处理OCR结果的公共逻辑
function processOcrResult(
  parsed: OcrResult,
  option1: string,
  option2: string,
  option3: string
): OcrFormData {
  // Process color prefixes & options
  let prefix = parsed.name || '';
  if (parsed.name) {
    const separators = ['·', '・', '.', '·'];
    for (let sep of separators) {
      if (parsed.name.includes(sep)) {
        prefix = parsed.name.split(sep)[0];
        break;
      }
    }
  }

  const suf1 = option1.trim();
  const suf2 = option2.trim();
  const suf3 = option3.trim();

  const n1 = suf1 ? (prefix ? `${prefix}·${suf1}` : `${parsed.name}·${suf1}`) : `${parsed.name}1`;
  const n2 = suf2 ? (prefix ? `${prefix}·${suf2}` : `${parsed.name}·${suf2}`) : `${parsed.name}2`;
  const n3 = suf3 ? (prefix ? `${prefix}·${suf3}` : `${parsed.name}·${suf3}`) : `${parsed.name}3`;

  // 提取获取方式的前缀（例如：【起居】、【左慈】等）
  let obtainPrefix = '';
  const obtainMatch = (parsed.obtain || '').match(/【([^】]+)】/);
  if (obtainMatch) {
    obtainPrefix = obtainMatch[0]; // 保留【】符号
  }

  // 设置三条数据的获取方式
  const obtain1 = obtainPrefix ? `${obtainPrefix}家具打造` : parsed.obtain || '';
  const obtain2 = obtainPrefix ? `${obtainPrefix}家具染色` : parsed.obtain || '';
  const obtain3 = obtainPrefix ? `${obtainPrefix}家具染色` : parsed.obtain || '';

  return {
    name1: n1,
    name2: n2,
    name3: n3,
    usage: parsed.usage || '',
    description: parsed.description || '',
    obtain: parsed.obtain || '',
    obtain1: obtain1,
    obtain2: obtain2,
    obtain3: obtain3,
    quality: parsed.quality || '',
    gridSize: parsed.gridSize || ''
  };
}
