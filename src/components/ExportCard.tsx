import React, { useState } from 'react';
import { Download, Copy, Eye, FileSpreadsheet } from 'lucide-react';
import { OcrFormData, SavedOcrItem } from '../types';
import * as XLSX from 'xlsx';

interface ExportCardProps {
  formData: OcrFormData;
  savedItems: SavedOcrItem[];
  showSuccessToast: (msg: string) => void;
}

export default function ExportCard({ formData, savedItems = [], showSuccessToast }: ExportCardProps) {
  const [markdownPreview, setMarkdownPreview] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

  // Generate table rows array helper
  const getTableRows = () => {
    if (savedItems && savedItems.length > 0) {
      const rows: string[][] = [];
      savedItems.forEach(item => {
        const fd = item.formData;
        rows.push([fd.name1 || '', fd.usage || '', fd.description || '', fd.obtain || '', fd.gridSize || '', fd.quality || '']);
        rows.push([fd.name2 || '', fd.usage || '', fd.description || '', fd.obtain || '', fd.gridSize || '', fd.quality || '']);
        rows.push([fd.name3 || '', fd.usage || '', fd.description || '', fd.obtain || '', fd.gridSize || '', fd.quality || '']);
      });
      return rows;
    }
    return [
      [formData.name1 || '', formData.usage || '', formData.description || '', formData.obtain || '', formData.gridSize || '', formData.quality || ''],
      [formData.name2 || '', formData.usage || '', formData.description || '', formData.obtain || '', formData.gridSize || '', formData.quality || ''],
      [formData.name3 || '', formData.usage || '', formData.description || '', formData.obtain || '', formData.gridSize || '', formData.quality || '']
    ];
  };

  // Generate table preview format (Markdown style as requested in original)
  const handleGeneratePreview = () => {
    const headers = ['名称', '用处', '描述', '获取', '格数', '品质'];
    const rows = getTableRows();

    let md = `| ${headers.join(' | ')} |\n`;
    md += `| ${headers.map(() => '----').join(' | ')} |\n`;
    rows.forEach(row => {
      md += `| ${row.join(' | ')} |\n`;
    });

    setMarkdownPreview(md);
    setShowPreview(true);
  };

  // Download Excel Spreadsheet exactly matching original spreadsheet format and column spacing
  const handleDownloadExcel = () => {
    const headers = ['名称', '用处', '描述', '获取', '格数', '品质'];
    const rows = getTableRows();
    const data = [headers, ...rows];

    let filename = '';
    if (savedItems && savedItems.length > 0) {
      const firstItem = savedItems[0].formData;
      const corePrefix = firstItem.name1 ? firstItem.name1.split('·')[0] : '家具';
      filename = `${corePrefix}等共${savedItems.length}件家具_WIKI导入表.xlsx`;
    } else {
      const prefix = formData.name1 ? formData.name1.split('·')[0] : '表格';
      filename = `${prefix || '表格'}.xlsx`;
    }

    try {
      // Create Sheet
      const ws = XLSX.utils.aoa_to_sheet(data);

      // Set Column widths
      ws['!cols'] = [
        { wch: 25 }, // 名称
        { wch: 25 }, // 用处
        { wch: 50 }, // 描述
        { wch: 20 }, // 获取
        { wch: 10 }, // 格数
        { wch: 10 }  // 品质
      ];

      // Create Workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '家具信息');

      // Write and Download File
      XLSX.writeFile(wb, filename);
      showSuccessToast('Excel 表格已下载');
    } catch (err: any) {
      console.error('Download excel failed:', err);
      alert('下载 Excel 失败: ' + err.message);
    }
  };


  // Copy Table formatted with Tab-separation (which compiles as copy pasteable grid in excel)
  const handleCopyAsTable = () => {
    const headers = ['名称', '用处', '描述', '获取', '格数', '品质'];
    const rows = getTableRows();
    const data = [headers, ...rows];

    // Combine cell rows with tabs and line feeds
    const tsvText = data.map(row => row.join('\t')).join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(tsvText)
        .then(() => {
          showSuccessToast('表格已复制，可直接粘贴到 Excel');
        })
        .catch(err => {
          console.error('Clipboard copy failed, using fallback:', err);
          fallbackCopy(tsvText);
        });
    } else {
      fallbackCopy(tsvText);
    }
  };

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showSuccessToast('表格已复制，可直接粘贴到 Excel');
      } else {
        alert('复制失败，请手动选择并复制表格内容');
      }
    } catch (err) {
      console.error('Fallback copy fail:', err);
      alert('复制失败，请手动选择并复制表格内容');
    }
    document.body.removeChild(textarea);
  };

  return (
    <div className="classical-card overflow-hidden transition-all duration-300 hover:shadow-sm">
      
      {/* Header featuring soft icons and traditional Chinese calligraphy header style */}
      <div className="flex items-center gap-2.5 px-6 py-4 bg-[#f4ebd0] border-b border-[#ebdcae]">
        <FileSpreadsheet className="w-4.5 h-4.5 text-[#9e2a2b] stroke-[2]" />
        <h3 className="font-heading font-black text-sm tracking-wide text-[#2b2621]">
          导出
        </h3>
      </div>

      <div className="p-6 space-y-5">
        {/* Actions bar Layout - touch friendly button heights */}
        <div className="flex flex-col sm:flex-row gap-3.5">
          <button
            type="button"
            onClick={handleGeneratePreview}
            className="flex-1 py-3 px-4 bg-white hover:bg-[#fdfaf5] text-[#2b2621] font-bold text-xs border border-[#ebdcae] hover:border-[#9e2a2b] focus:outline-hidden rounded-md transition-transform flex items-center justify-center gap-2 cursor-pointer h-11 active:scale-95 shadow-3xs"
          >
            <Eye className="w-4 h-4 text-[#a8885d]" />
            预览
          </button>

          <button
            type="button"
            onClick={handleDownloadExcel}
            className="flex-1 py-3 px-4 bg-[#9e2a2b] hover:bg-[#802021] text-white font-bold text-xs rounded-md shadow-xs transition-transform flex items-center justify-center gap-2 cursor-pointer h-11 active:scale-95"
          >
            <Download className="w-4 h-4 text-[#ebdcae]" />
            下载 Excel
          </button>

          <button
            type="button"
            onClick={handleCopyAsTable}
            className="flex-1 py-3 px-4 bg-[#e2f0d9] hover:bg-[#d4eabf] text-[#1d4436] border border-[#c3e0b2] font-bold text-xs rounded-md transition-transform flex flex-col items-center justify-center gap-0.5 cursor-pointer h-11 active:scale-95"
          >
            <div className="flex items-center gap-2">
              <Copy className="w-4 h-4 text-[#1d4436]" />
              <span>复制</span>
            </div>
            <span className="text-[9px] text-[#1d4436]/60 font-normal">可直接粘贴到 Excel</span>
          </button>
        </div>

        {/* Markdown Grid Output Source Only */}
        {showPreview && (
          <div className="space-y-1 pt-1 select-none animate-fade-in">
            <span className="text-[11px] font-bold text-[#a8885d] block font-mono">
              Markdown 预览
            </span>
            <pre
              id="tablePreview"
              className="p-4 bg-[#1e1c18] text-[11px] font-mono border border-[#ebdcae]/60 rounded-md text-[#ebdcae] overflow-x-auto whitespace-pre max-h-40 leading-relaxed"
            >
              {markdownPreview}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

