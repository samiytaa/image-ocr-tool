// 支持 Unicode 的 Base64 编码/解码函数
export const encodeBase64 = (str: string): string => {
  const utf8Bytes = new TextEncoder().encode(str);
  let binaryString = '';
  utf8Bytes.forEach(byte => {
    binaryString += String.fromCharCode(byte);
  });
  return btoa(binaryString);
};

export const decodeBase64 = (str: string): string => {
  const binaryString = atob(str);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
};

// 加密的默认配置
const ENCRYPTED_DEFAULT_CONFIG = {
  endpoint: 'aHR0cHM6Ly9ja2ZmLmRldi92MQ==',
  apiKey: 'c2stV3ZiTkZ1N2ZhQTV2UDZERnhWU2l5S0IxMUF4anBMN21HWFNjUkVZSVA2akdjd0lq',
  model: 'W2djbGnovYbtIGdlbWluaS0zLjEtZmxhc2gtbGl0ZS1wcmV2aWV3'
};

// 解密函数
export const decryptConfig = () => {
  try {
    return {
      endpoint: decodeBase64(ENCRYPTED_DEFAULT_CONFIG.endpoint),
      apiKey: decodeBase64(ENCRYPTED_DEFAULT_CONFIG.apiKey),
      model: decodeBase64(ENCRYPTED_DEFAULT_CONFIG.model)
    };
  } catch (e) {
    console.error('解密配置失败:', e);
    return {
      endpoint: '',
      apiKey: '',
      model: ''
    };
  }
};
