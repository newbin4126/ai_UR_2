import React, { useCallback, useState } from 'react';

interface FileUploaderProps {
  onFileLoaded: (content: string | ArrayBuffer, fileName: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = (file: File) => {
    setLoading(true);
    const reader = new FileReader();
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    reader.onload = (e) => {
      const result = e.target?.result;
      if (result) {
        onFileLoaded(result, file.name);
      }
      setLoading(false);
    };

    if (isExcel) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [onFileLoaded]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">데이터 업로드</h2>
        <p className="text-slate-500">분석을 시작하려면 CSV 또는 Excel 파일을 업로드하세요.</p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ease-in-out cursor-pointer
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-xl' 
            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50 bg-white shadow-sm'}
        `}
      >
        <input
          type="file"
          accept=".csv,.txt,.xlsx,.xls"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleInputChange}
        />
        
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
             <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-blue-600 font-medium">데이터셋 처리 중...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-slate-700">파일을 여기에 드래그 앤 드롭하세요</p>
              <p className="text-sm text-slate-500 mt-1">또는 클릭하여 컴퓨터에서 파일 선택</p>
            </div>
            <div className="pt-4">
              <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-semibold rounded-full">지원 형식: CSV, Excel (.xlsx, .xls)</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Demo Data Button */}
      <div className="mt-8 text-center">
        <button 
          onClick={() => {
            const demoCSV = `id,diagnosis,radius_mean,texture_mean,perimeter_mean,area_mean,smoothness_mean
1,M,17.99,10.38,122.8,1001,0.1184
2,M,20.57,17.77,132.9,1326,0.08474
3,M,19.69,21.25,130,1203,0.1096
4,M,11.42,20.38,77.58,386.1,0.1425
5,M,20.29,14.34,135.1,1297,0.1003
6,B,12.45,15.7,82.57,477.1,0.1278
7,B,18.25,19.98,119.6,1040,0.09463
8,M,13.71,20.83,90.2,577.9,0.1189
9,B,13,21.82,87.5,519.8,0.1273
10,B,12.46,24.04,83.97,475.9,0.1186`;
            onFileLoaded(demoCSV, "breast_cancer_demo.csv");
          }}
          className="text-sm text-blue-600 hover:text-blue-800 underline underline-offset-2"
        >
          유방암 데모 데이터셋 불러오기
        </button>
      </div>
    </div>
  );
};