import { ApiConfig, OcrFormData, OcrResult } from '../types';

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

    const response = await fetch(chatUrl, {
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
      throw new Error(`HTTP ${response.status}`);
    }

    const responseData = await response.json();
    let resText = responseData.choices[0].message.content;

    // Try parsing JSON format
    let cleanJsonText = resText.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanJsonText) as OcrResult;

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

    return {
      name1: n1,
      name2: n2,
      name3: n3,
      usage: parsed.usage || '',
      description: parsed.description || '',
      obtain: parsed.obtain || '',
      quality: parsed.quality || '',
      gridSize: parsed.gridSize || ''
    };
  } catch (err) {
    console.error('OCR Error:', err);
    return null;
  }
};
