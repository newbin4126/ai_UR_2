import React from 'react';

interface OnboardingProps {
  onClose: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden animate-fade-in-up">
        <div className="bg-blue-600 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">UR에 오신 것을 환영합니다</h2>
          <p className="text-blue-100">간편한 의료 데이터 분석.</p>
        </div>
        <div className="p-8">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">1</div>
              <div>
                <h4 className="font-semibold text-slate-900">데이터 업로드</h4>
                <p className="text-sm text-slate-500">의료 기록이 담긴 CSV 또는 Excel 파일을 드래그 앤 드롭하세요.</p>
              </div>
            </div>
             <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">2</div>
              <div>
                <h4 className="font-semibold text-slate-900">변수 선택</h4>
                <p className="text-sm text-slate-500">예측할 항목(예: 진단)과 영향 요인을 선택하세요.</p>
              </div>
            </div>
             <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">3</div>
              <div>
                <h4 className="font-semibold text-slate-900">인사이트 확인</h4>
                <p className="text-sm text-slate-500">자동화된 그래프, 통계, AI 기반 설명을 확인하세요.</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full mt-8 bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
};