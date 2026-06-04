import React, { useState } from 'react';
import { Layers, Trash2, Edit3, Sparkles, Inbox, RefreshCw, Search, RotateCcw } from 'lucide-react';
import { SavedOcrItem } from '../types';

interface SavedItemsCardProps {
  items: SavedOcrItem[];
  onEdit: (item: SavedOcrItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  editingId: string | null;
}

export default function SavedItemsCard({
  items,
  onEdit,
  onDelete,
  onClearAll,
  editingId
}: SavedItemsCardProps) {
  
  const [searchQuery, setSearchQuery] = useState('');

  // Extract grouped title like "酸酸甜（清醪/糯雪/琼肪）"
  const getGroupedTitle = (item: SavedOcrItem) => {
    const fData = item.formData;
    let baseName = '';
    
    // Split by · to find the common prefix
    const parts1 = fData.name1.split('·');
    if (parts1.length > 1) {
      baseName = parts1[0];
    } else {
      baseName = fData.name1 || '常规家具';
    }

    const getSuffix = (fullName: string) => {
      const parts = fullName.split('·');
      return parts.length > 1 ? parts[1] : '';
    };

    const suf1 = getSuffix(fData.name1);
    const suf2 = getSuffix(fData.name2);
    const suf3 = getSuffix(fData.name3);

    const suffixes = [suf1, suf2, suf3].filter(Boolean);
    if (suffixes.length > 0) {
      return {
        prefix: baseName,
        suffixStr: `（${suffixes.join('/')}）`
      };
    }
    
    return {
      prefix: baseName,
      suffixStr: ''
    };
  };

  // 搜索过滤功能
  const filteredItems = items.filter(item => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const { prefix } = getGroupedTitle(item);
    
    return (
      prefix.toLowerCase().includes(query) ||
      item.formData.name1.toLowerCase().includes(query) ||
      item.formData.name2.toLowerCase().includes(query) ||
      item.formData.name3.toLowerCase().includes(query) ||
      item.formData.quality?.toLowerCase().includes(query) ||
      item.formData.obtain?.toLowerCase().includes(query) ||
      item.formData.usage?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="classical-card overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#f4ebd0] border-b border-[#ebdcae]">
        <div className="flex items-center gap-2.5">
          <Layers className="w-4.5 h-4.5 text-[#9e2a2b] stroke-[2]" />
          <h3 className="font-heading font-black text-sm tracking-wide text-[#2b2621] flex items-center gap-2">
            已暂存条目
            <span className="bg-[#9e2a2b] text-[#fbfaf5] text-[11px] px-2 py-0.2 rounded-full font-sans">
              {filteredItems.length}{searchQuery && `/${items.length}`}
            </span>
          </h3>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[#9e2a2b] hover:text-[#802021] bg-[#fcdcd3] hover:bg-[#f5b3a4] border border-[#f5b3a4] p-1.5 rounded transition-colors font-bold cursor-pointer"
            title="清空暂存"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 搜索框 */}
      {items.length > 0 && (
        <div className="px-6 pt-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索家具名称、品质、获取方式..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-[#ebdcae] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9e2a2b]/20 focus:border-[#9e2a2b] bg-white/60 placeholder:text-stone-400"
            />
          </div>
        </div>
      )}

      <div className={`px-6 pb-6 space-y-4 ${items.length === 0 ? 'pt-6' : 'pt-1'}`}>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center space-y-3 bg-[#fdfaf5] border border-dashed border-[#ebdcae]/60 rounded-lg">
            <Inbox className="w-10 h-10 text-stone-300" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-stone-650">暂无已存的合并数据条目</p>
              <p className="text-[11px] text-stone-400 max-w-[280px]">
                在右侧对图片进行 "智能属性识别 (OCR)" 后，点击 "暂存当前条目" 即可汇聚到此处统一查看与批量导出中。
              </p>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center space-y-3 bg-[#fdfaf5] border border-dashed border-[#ebdcae]/60 rounded-lg">
            <Search className="w-10 h-10 text-stone-300" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-stone-650">未找到匹配的家具条目</p>
              <p className="text-[11px] text-stone-400 max-w-[280px]">
                尝试使用其他关键词搜索
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-2 rounded-md border border-transparent hover:border-stone-200/50 transition-colors">
            {filteredItems.map((item) => {
              const { prefix, suffixStr } = getGroupedTitle(item);
              const isCurrentEditing = editingId === item.id;
              
              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isCurrentEditing
                      ? 'bg-[#f4ebd0]/35 border-[#9e2a2b] ring-1 ring-[#9e2a2b]/30'
                      : 'bg-[#fcfaf2]/60 hover:bg-white border-[#ebdcae]/75 shadow-xs hover:shadow-sm'
                  }`}
                >
                  {/* 简化版：只显示名称和操作按钮 */}
                  <div className="flex items-center justify-between gap-3 w-full">
                    {/* 左侧：家具名称 */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-black text-sm text-[#2b2621] flex items-center gap-1.5 flex-wrap">
                        <span className="text-[#9e2a2b] font-serif truncate">{prefix}</span>
                        {suffixStr && (
                          <span className="text-[#8c7a65] text-xs font-medium whitespace-nowrap">{suffixStr}</span>
                        )}
                        {isCurrentEditing && (
                          <span className="text-[9px] font-bold text-amber-800 bg-amber-100 border border-amber-250 px-1.5 py-0.5 rounded whitespace-nowrap">
                            编辑中
                          </span>
                        )}
                      </h4>
                    </div>

                    {/* 右侧：操作按钮 */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="p-1.5 bg-white hover:bg-[#fdfaf5] text-stone-600 hover:text-[#9e2a2b] border border-stone-200 hover:border-[#ebdcae] rounded transition-all active:scale-95 cursor-pointer shadow-xs"
                        title="编辑"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 bg-white hover:bg-[#fcdcd3]/40 text-stone-600 hover:text-[#9e2a2b] border border-stone-200 hover:border-[#fcdcd3] rounded transition-all active:scale-95 cursor-pointer shadow-xs"
                        title="删除"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
