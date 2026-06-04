import { useState, useEffect } from 'react';
import { NameConfigsMap } from '../types';

export const usePresetConfig = (showToast: (message: string) => void) => {
  const [option1, setOption1] = useState('清醪');
  const [option2, setOption2] = useState('糯雪');
  const [option3, setOption3] = useState('琼肪');
  const [nameConfigs, setNameConfigs] = useState<NameConfigsMap>({});
  const [selectedConfigKey, setSelectedConfigKey] = useState('');

  // 加载配置
  useEffect(() => {
    const savedNames = localStorage.getItem('nameConfigs');
    if (savedNames) {
      try {
        const parsed = JSON.parse(savedNames) as NameConfigsMap;
        setNameConfigs(parsed);

        const lastConfig = localStorage.getItem('lastSelectedConfig');
        if (lastConfig && parsed[lastConfig]) {
          setSelectedConfigKey(lastConfig);
          setOption1(parsed[lastConfig].option1 || '');
          setOption2(parsed[lastConfig].option2 || '');
          setOption3(parsed[lastConfig].option3 || '');
        }
      } catch (e) {
        console.error('Failed to load nameConfigs:', e);
      }
    }
  }, []);

  const handleSelectConfig = (key: string) => {
    setSelectedConfigKey(key);
    if (key && nameConfigs[key]) {
      const config = nameConfigs[key];
      setOption1(config.option1 || '');
      setOption2(config.option2 || '');
      setOption3(config.option3 || '');
      localStorage.setItem('lastSelectedConfig', key);
      showToast(`已加载预设 "${key}"`);
    } else {
      localStorage.removeItem('lastSelectedConfig');
    }
  };

  const handleSavePresetConfig = () => {
    const o1 = option1.trim();
    const o2 = option2.trim();
    const o3 = option3.trim();

    if (!o1 && !o2 && !o3) {
      alert('请至少填写一个颜色后缀');
      return;
    }

    const configName = prompt('请输入方案名称（例如：暖炉套、瓷茶套）：');
    
    if (!configName) {
      return;
    }

    const trimmedName = configName.trim();
    if (!trimmedName) {
      alert('方案名称不能为空');
      return;
    }

    const updated = {
      ...nameConfigs,
      [trimmedName]: { option1: o1, option2: o2, option3: o3 }
    };

    setNameConfigs(updated);
    localStorage.setItem('nameConfigs', JSON.stringify(updated));
    setSelectedConfigKey(trimmedName);
    showToast(`预设 "${trimmedName}" 已保存`);
  };

  const handleDeletePresetConfig = () => {
    if (!selectedConfigKey) {
      alert('请先选择要删除的配置');
      return;
    }
    if (!confirm(`确定要删除配置 "${selectedConfigKey}" 吗？`)) {
      return;
    }

    const updated = { ...nameConfigs };
    delete updated[selectedConfigKey];

    setNameConfigs(updated);
    localStorage.setItem('nameConfigs', JSON.stringify(updated));
    
    if (localStorage.getItem('lastSelectedConfig') === selectedConfigKey) {
      localStorage.removeItem('lastSelectedConfig');
    }

    setSelectedConfigKey('');
    setOption1('');
    setOption2('');
    setOption3('');
    showToast(`预设 "${selectedConfigKey}" 已删除`);
  };

  return {
    option1,
    setOption1,
    option2,
    setOption2,
    option3,
    setOption3,
    nameConfigs,
    selectedConfigKey,
    handleSelectConfig,
    handleSavePresetConfig,
    handleDeletePresetConfig
  };
};
