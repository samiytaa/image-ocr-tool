import React from 'react';
import { Heart } from 'lucide-react';

interface AppreciationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppreciationModal: React.FC<AppreciationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-[#fbfaf5] rounded-xl shadow-2xl max-w-lg w-full border-2 border-[#ebdcae] overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题栏 - 三国风格 */}
        <div className="bg-gradient-to-r from-[#9e2a2b] to-[#c44545] px-6 py-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 text-[#fbfaf5] text-6xl font-heading">⚔</div>
            <div className="absolute bottom-0 right-0 text-[#fbfaf5] text-6xl font-heading">⚔</div>
          </div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#fbfaf5] fill-[#fbfaf5] animate-pulse" />
              <h3 className="font-heading font-black text-[#fbfaf5] text-lg tracking-wide">
                🎭 军师求援奏章
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-[#fbfaf5] hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 内容区域 - 可滚动 */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* 三国风格开场白 - 气泡对话样式 */}
          <div className="space-y-2.5 pl-4">
            {/* 标题气泡 */}
            <div className="flex justify-start">
              <div className="relative bg-gradient-to-br from-[#fef6e8] to-[#fcecd0] px-4 py-2 rounded-2xl rounded-tl-sm border-2 border-[#d4c09d] shadow-md">
                <p className="font-heading text-[#2b2621] font-bold text-sm">
                  启禀主公 🎯
                </p>
                {/* 气泡尾巴 */}
                <div className="absolute -left-2 top-3 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-[#d4c09d]"></div>
                <div className="absolute -left-1.5 top-3 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[7px] border-r-[#fef6e8]"></div>
              </div>
            </div>

            {/* 第一条对话气泡 */}
            <div className="flex justify-start">
              <div className="relative bg-white px-4 py-2.5 rounded-2xl rounded-tl-sm border-2 border-[#d4c09d] shadow-md max-w-[85%]">
                <p className="text-[#2b2621] text-sm leading-relaxed">
                  🌙 <span className="font-bold">吾夜观天象</span>，见服务器气数将尽……
                </p>
                {/* 气泡尾巴 */}
                <div className="absolute -left-2 top-3 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-[#d4c09d]"></div>
                <div className="absolute -left-1.5 top-3 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[7px] border-r-white"></div>
              </div>
            </div>

            {/* 第二条对话气泡 - 强调样式 */}
            <div className="flex justify-start">
              <div className="relative bg-gradient-to-r from-[#9e2a2b] to-[#c44545] px-4 py-2.5 rounded-2xl rounded-tl-sm border-2 border-[#7a1f20] shadow-lg max-w-[85%]">
                <p className="text-[#fbfaf5] font-bold text-sm leading-relaxed">
                  ⚡ 每增<span className="text-base">10</span>元法力，可助工具稳定运行 <span className="text-base">10,000</span>次
                </p>
                {/* 气泡尾巴 */}
                <div className="absolute -left-2 top-3 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-[#7a1f20]"></div>
                <div className="absolute -left-1.5 top-3 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[7px] border-r-[#9e2a2b]"></div>
              </div>
            </div>
          </div>

          {/* 二维码图片 - 缩小尺寸 */}
          <div className="flex justify-center">
            <div className="relative p-3 bg-white rounded-lg shadow-lg border-2 border-[#d4c09d]">
              <img 
                src="/assets/IMG_20260605_040328.png" 
                alt="赞赏码" 
                className="w-48 h-auto rounded"
              />
              {/* 装饰性边角 */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-[3px] border-l-[3px] border-[#9e2a2b]"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-[3px] border-r-[3px] border-[#9e2a2b]"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-[3px] border-l-[3px] border-[#9e2a2b]"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-[3px] border-r-[3px] border-[#9e2a2b]"></div>
              
              {/* 金色光效 */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700]/5 to-transparent pointer-events-none"></div>
            </div>
          </div>

          {/* 底部郑重声明 - 精简版 */}
          <div className="text-center space-y-1.5 pt-2 border-t border-[#ebdcae]">
            <p className="font-heading text-[#9e2a2b] font-bold text-sm">
              🙏 主公之恩，铭记五内！
            </p>
            <p className="text-[10px] text-stone-500">
              您的每一分支持，都是持续更新的动力源泉
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
