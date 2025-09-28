// src/components/admin/ExcelDownloadButton.tsx
'use client'

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { exportGA4DataToExcel } from '@/app/(dashboard)/admin/dashboard/actions';

interface ExcelDownloadButtonProps {
  startDate: string;
  endDate: string;
  className?: string;
}

interface ExportResult {
  success: boolean;
  data?: ArrayBuffer;
  filename?: string;
  error?: string;
}

export function ExcelDownloadButton({ startDate, endDate, className = '' }: ExcelDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleDownload = async (): Promise<void> => {
    if (isDownloading) return;

    setIsDownloading(true);
    
    try {
      const result: any = await exportGA4DataToExcel(startDate, endDate);
      
      if (!result.success || !result.data) {
        alert(result.error || '엑셀 파일 생성에 실패했습니다.');
        return;
      }

      // ArrayBuffer를 Uint8Array로 변환
      const uint8Array = new Uint8Array(result.data);
      
      // Blob 생성 및 다운로드
      const blob = new Blob([uint8Array], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename || 'GA4_통계.xlsx';
      
      // 다운로드 실행
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // URL 정리
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('다운로드 오류:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={`
        inline-flex items-center gap-2 px-4 py-2 
        bg-green-600 hover:bg-green-700 disabled:bg-green-400
        text-white font-medium rounded-lg
        transition-colors duration-200
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isDownloading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>생성 중...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>엑셀 다운로드</span>
        </>
      )}
    </button>
  );
}