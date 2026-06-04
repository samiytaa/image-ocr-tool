import React from 'react';
import { Palette, Trash2 } from 'lucide-react';
import { NameConfig, NameConfigsMap } from '../types';

interface PresetOptionsCardProps {
  option1: string;
  setOption1: (val: string) => void;
  option2: string;
  setOption2: (val: string) => void;
  option3: string;
  setOption3: (val: string) => void;
  nameConfigs: NameConfigsMap;
  selectedConfigKey: string;
  onSelectConfig: (key: string) => void;
  onSaveConfig: () => void;
  onDeleteConfig: () => void;
}

export default function PresetOptionsCard({
  option1,
  setOption1,
  option2,
  setOption2,
  option3,
  setOption3,
  nameConfigs,
  selectedConfigKey,
  onSelectConfig,
  onSaveConfig,
  onDeleteConfig
}: PresetOptionsCardProps) {
  return (
    <div className="classical-card overflow-hidden transition-all duration-300 hover:shadow-sm">
      
      {/* Header with classical typography and background */}
      <div className="flex items-center gap-2.5 px-6 py-4 bg-[#f4ebd0] border-b border-[#ebdcae]">
        <Palette className="w-4.5 h-4.5 text-[#9e2a2b] stroke-[2]" />
        <h3 className="font-heading font-black text-sm tracking-wide text-[#2b2621]">
          男主家具颜色
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Colors Suffixes Inputs - always horizontal layout */}
        <div className="grid grid-cols-3 gap-4">
          {/* Option 1 */}
          <div>
            <label htmlFor="option1" className="block text-xs font-bold text-[#5c4a37] mb-2">
              名称1
            </label>
            <input
              type="text"
              id="option1"
              value={option1}
              onChange={(e) => setOption1(e.target.value)}
              placeholder="清醪"
              className="w-full h-9 px-3 bg-white text-xs text-stone-850 rounded-md border border-[#e2d9c5] focus:border-[#9e2a2b] focus:outline-hidden transition-all font-medium"
            />
          </div>

          {/* Option 2 */}
          <div>
            <label htmlFor="option2" className="block text-xs font-bold text-[#5c4a37] mb-2">
              名称2
            </label>
            <input
              type="text"
              id="option2"
              value={option2}
              onChange={(e) => setOption2(e.target.value)}
              placeholder="糯雪"
              className="w-full h-9 px-3 bg-white text-xs text-stone-850 rounded-md border border-[#e2d9c5] focus:border-[#9e2a2b] focus:outline-hidden transition-all font-medium"
            />
          </div>

          {/* Option 3 */}
          <div>
            <label htmlFor="option3" className="block text-xs font-bold text-[#5c4a37] mb-2">
              名称3
            </label>
            <input
              type="text"
              id="option3"
              value={option3}
              onChange={(e) => setOption3(e.target.value)}
              placeholder="琼肪"
              className="w-full h-9 px-3 bg-white text-xs text-stone-850 rounded-md border border-[#e2d9c5] focus:border-[#9e2a2b] focus:outline-hidden transition-all font-medium"
            />
          </div>
        </div>

        {/* Action Buttons - Load and Save Presets - Always in single row */}
        <div className="flex gap-3">
          {/* Load Config Dropdown */}
          <div className="flex-1 min-w-0">
            <select
              id="configSelect"
              value={selectedConfigKey}
              onChange={(e) => onSelectConfig(e.target.value)}
              className="w-full h-10 px-3 bg-white text-xs text-[#2b2621] font-medium rounded-md border border-[#e2d9c5] focus:border-[#9e2a2b] focus:outline-hidden transition-all cursor-pointer"
            >
              <option value="">-- 读取已保存的方案 --</option>
              {Object.keys(nameConfigs).map((key) => {
                const config = nameConfigs[key];
                const names = [config.option1, config.option2, config.option3].filter(n => n).join('、');
                return (
                  <option key={key} value={key}>
                    {key}（{names}）
                  </option>
                );
              })}
            </select>
          </div>

          {/* Save and Delete Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={onSaveConfig}
              className="h-10 px-5 bg-[#9e2a2b] hover:bg-[#802021] text-white font-bold text-xs rounded-md transition-transform flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-3xs whitespace-nowrap"
              title="保存当前方案"
            >
              保存
            </button>
            <button
              type="button"
              onClick={onDeleteConfig}
              disabled={!selectedConfigKey}
              className="h-10 w-10 bg-[#fcdcd3] hover:bg-[#f5b3a4] text-[#9e2a2b] border border-[#ebdcae]/50 rounded-md transition-transform flex items-center justify-center cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              title="删除选中的方案"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

