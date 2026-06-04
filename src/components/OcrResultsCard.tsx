import React from 'react';
import { FileText, Tag, Gift, Award, Grid, AlignLeft, Compass, Clipboard, CheckCircle, Layers } from 'lucide-react';
import { OcrFormData } from '../types';

interface OcrResultsCardProps {
  rawOcrText: string;
  formData: OcrFormData;
  onFormChange: (data: OcrFormData) => void;
  editingId?: string | null;
  onSaveBatch?: () => void;
  onCancelEdit?: () => void;
}

export default function OcrResultsCard({
  rawOcrText,
  formData,
  onFormChange,
  editingId = null,
  onSaveBatch,
  onCancelEdit
}: OcrResultsCardProps) {
  const handleInputChange = (field: keyof OcrFormData, value: string) => {
    onFormChange({
      ...formData,
      [field]: value
    });
  };


  return (
    <div className="classical-card overflow-hidden transition-all duration-300 hover:shadow-sm">
      
      {/* Header featuring soft icons and traditional Chinese calligraphy header style */}
      <div className="flex items-center gap-2.5 px-6 py-4 bg-[#f4ebd0] border-b border-[#ebdcae]">
        <FileText className="w-4.5 h-4.5 text-[#9e2a2b] stroke-[2]" />
        <h3 className="font-heading font-black text-sm tracking-wide text-[#2b2621]">
          识别数据
        </h3>
      </div>

      <div className="p-6 space-y-5">
        {/* 3 Names Custom Suffix Row - label gap shortened */}
        <div className="space-y-1.5">
          <div className="grid grid-cols-3 gap-4">
            {/* Name 1 */}
            <div className="space-y-1">
              <label htmlFor="name1" className="block text-xs font-bold text-stone-605 select-none">
                名称1
              </label>
              <input
                type="text"
                id="name1"
                placeholder="名称1"
                className="w-full h-10 px-3 bg-white hover:bg-[#fdfaf5] focus:bg-white text-xs text-stone-850 rounded-md border border-[#e2d9c5] focus:border-[#9e2a2b] focus:outline-hidden transition-all placeholder:text-stone-400 font-medium font-serif"
                value={formData.name1}
                onChange={(e) => handleInputChange('name1', e.target.value)}
              />
            </div>

            {/* Name 2 */}
            <div className="space-y-1">
              <label htmlFor="name2" className="block text-xs font-bold text-stone-605 select-none">
                名称2
              </label>
              <input
                type="text"
                id="name2"
                placeholder="名称2"
                className="w-full h-10 px-3 bg-white hover:bg-[#fdfaf5] focus:bg-white text-xs text-stone-850 rounded-md border border-[#e2d9c5] focus:border-[#9e2a2b] focus:outline-hidden transition-all placeholder:text-stone-400 font-medium font-serif"
                value={formData.name2}
                onChange={(e) => handleInputChange('name2', e.target.value)}
              />
            </div>

            {/* Name 3 */}
            <div className="space-y-1">
              <label htmlFor="name3" className="block text-xs font-bold text-stone-605 select-none">
                名称3
              </label>
              <input
                type="text"
                id="name3"
                placeholder="名称3"
                className="w-full h-10 px-3 bg-white hover:bg-[#fdfaf5] focus:bg-white text-xs text-stone-850 rounded-md border border-[#e2d9c5] focus:border-[#9e2a2b] focus:outline-hidden transition-all placeholder:text-stone-400 font-medium font-serif"
                value={formData.name3}
                onChange={(e) => handleInputChange('name3', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Detailed Info Section */}
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 用处 */}
            <div className="space-y-1">
              <label htmlFor="usage" className="block text-xs font-bold text-stone-605 flex items-center gap-1.5 select-none">
                <Tag className="w-3.5 h-3.5 text-[#a8885d]" />
                用处
              </label>
              <input
                type="text"
                id="usage"
                placeholder="例如: 左慈·自由摆放家具"
                className="w-full h-10 px-3.5 bg-white hover:bg-[#fdfaf5] focus:bg-white text-xs text-[#2b2621] rounded-md border border-[#e2d9c5] focus:border-[#9e2a2b] focus:outline-hidden transition-all font-medium"
                value={formData.usage}
                onChange={(e) => handleInputChange('usage', e.target.value)}
              />
            </div>

            {/* 获取 */}
            <div className="space-y-1">
              <label htmlFor="obtain" className="block text-xs font-bold text-stone-620 flex items-center gap-1.5 select-none">
                <Gift className="w-3.5 h-3.5 text-[#ebdcae] shrink-0" />
                获取方式
              </label>
              <input
                type="text"
                id="obtain"
                placeholder="例如: 【起居】家具打造"
                className="w-full h-10 px-3.5 bg-white hover:bg-[#fdfaf5] focus:bg-white text-xs text-[#2b2621] rounded-md border border-[#e2d9c5] focus:border-[#9e2a2b] focus:outline-hidden transition-all font-medium"
                value={formData.obtain}
                onChange={(e) => handleInputChange('obtain', e.target.value)}
              />
            </div>
          </div>

          {/* 描述 Textarea */}
          <div className="space-y-1">
            <label htmlFor="description" className="block text-xs font-bold text-stone-620 flex items-center gap-1.5 select-none">
              <AlignLeft className="w-3.5 h-3.5 text-[#a8885d]" />
              描述说明
            </label>
            <textarea
              id="description"
              placeholder="请输入家具描述内容..."
              className="w-full h-20 px-3.5 py-2 bg-white hover:bg-[#fdfaf5] focus:bg-white text-xs text-[#2b2621] rounded-md border border-[#e2d9c5] focus:border-[#9e2a2b] focus:outline-hidden transition-all resize-y font-medium leading-relaxed"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          {/* Bottom stats layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 品质 */}
            <div className="space-y-1">
              <label htmlFor="quality" className="block text-xs font-bold text-stone-620 flex items-center gap-1.5 select-none">
                <Award className="w-3.5 h-3.5 text-[#9e2a2b]" />
                品质
              </label>
              <input
                type="text"
                id="quality"
                placeholder="紫 / 绿 / 蓝 / 橙"
                className="w-full h-10 px-3.5 bg-white hover:bg-[#fdfaf5] focus:bg-white text-xs text-[#2b2621] rounded-md border border-[#e2d9c5] focus:border-[#9e2a2b] focus:outline-hidden transition-all font-medium"
                value={formData.quality}
                onChange={(e) => handleInputChange('quality', e.target.value)}
              />
            </div>

            {/* 占格数 */}
            <div className="space-y-1">
              <label htmlFor="gridSize" className="block text-xs font-bold text-stone-620 flex items-center gap-1.5 select-none">
                <Grid className="w-3.5 h-3.5 text-[#1d4436]" />
                占格数
              </label>
              <input
                type="text"
                id="gridSize"
                placeholder="例如: 2*2"
                className="w-full h-10 px-3.5 bg-white hover:bg-[#fdfaf5] focus:bg-white text-xs text-[#2b2621] rounded-md border border-[#e2d9c5] focus:border-[#9e2a2b] focus:outline-hidden transition-all font-medium"
                value={formData.gridSize}
                onChange={(e) => handleInputChange('gridSize', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Save/Batch Controls */}
        {onSaveBatch && (
          <div className="pt-4.5 flex gap-3">
            {editingId ? (
              <>
                <button
                  type="button"
                  onClick={onSaveBatch}
                  className="flex-1 h-11 bg-[#1d4436] hover:bg-[#153429] text-white font-bold text-xs tracking-wide rounded-md shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
                >
                  <CheckCircle className="w-4 h-4 text-[#ebdcae]" />
                  更新
                </button>
                {onCancelEdit && (
                  <button
                    type="button"
                    onClick={onCancelEdit}
                    className="py-3 px-4 bg-white hover:bg-[#fdfaf5] text-stone-605 font-bold text-xs border border-[#ebdcae] rounded-md transition-transform flex items-center justify-center cursor-pointer h-11 active:scale-95"
                  >
                    取消
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                disabled={!formData.name1.trim() && !formData.name2.trim() && !formData.name3.trim()}
                onClick={onSaveBatch}
                className="w-full h-11 bg-[#9e2a2b] hover:bg-[#802021] disabled:bg-stone-100 disabled:text-stone-300 disabled:border-stone-200 disabled:cursor-not-allowed text-white font-bold text-xs tracking-wide rounded-md shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
              >
                <Layers className="w-4 h-4 text-[#ebdcae]" />
                暂存
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

