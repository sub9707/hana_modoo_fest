// src/components/admin/ExcelDownloadButton.tsx
'use client'

import { useState } from 'react';
import { Download } from 'lucide-react';
import { exportGA4DataToExcel } from '@/app/(dashboard)/admin/dashboard/actions';

interface ExcelDownloadButtonProps {
  startDate: string;
  endDate: string;
}

export function ExcelDownloadButton({ startDate, endDate }: ExcelDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      const result = await exportGA4DataToExcel(startDate, endDate);

      if (result.success && result.data && result.filename) {
        // number[] 배열을 Uint8Array로 변환
        const uint8Array = new Uint8Array(result.data);
        
        // Blob 생성
        const blob = new Blob([uint8Array], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        // 다운로드 링크 생성 및 클릭
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        
        // 정리
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        setError(result.error || 'Excel 파일 다운로드에 실패했습니다.');
      }
    } catch (err) {
      console.error('Excel 다운로드 오류:', err);
      setError('Excel 파일 다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Download className={`h-4 w-4 ${isDownloading ? 'animate-bounce' : ''}`} />
        {isDownloading ? '다운로드 중...' : 'Excel 다운로드'}
      </button>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}