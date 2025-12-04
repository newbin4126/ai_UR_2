
import React, { useState } from 'react';
import { ColumnStats } from '../types';

interface VariableSelectorProps {
  columns: string[];
  stats: Record<string, ColumnStats>;
  initialTarget?: string | null;
  initialFeatures?: string[];
  onConfirm: (target: string, features: string[]) => void;
}

export const VariableSelector: React.FC<VariableSelectorProps> = ({ 
  columns, 
  stats, 
  initialTarget,
  initialFeatures,
  onConfirm 
}) => {
  const [target, setTarget] = useState<string | null>(initialTarget || null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initialFeatures || []);

  const handleFeatureToggle = (col: string) => {
    if (col === target) return; // Can't select target as feature
    setSelectedFeatures(prev => 
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  const handleTargetChange = (col: string) => {
    setTarget(col);
    // Remove from features if it was selected
    setSelectedFeatures(prev => prev.filter(c => c !== col));
  };

  const isValid = target !== null && selectedFeatures.length > 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">분석 설정</h2>
        <p className="text-slate-500">예측하려는 변수(타겟)와 이에 영향을 미치는 요인(특징)을 선택하세요.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Target Column Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <h3 className="font-semibold text-blue-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs">1</span>
              타겟 변수 선택
            </h3>
            <p className="text-xs text-blue-600 mt-1">분석하려는 결과 (예: 진단명)</p>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {columns.map(col => (
              <label 
                key={`target-${col}`}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors border ${target === col ? 'bg-blue-50 border-blue-500' : 'hover:bg-slate-50 border-transparent'}`}
              >
                <input 
                  type="radio" 
                  name="target" 
                  value={col} 
                  checked={target === col}
                  onChange={() => handleTargetChange(col)}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium text-slate-700">{col}</div>
                  <div className="text-xs text-slate-500 flex gap-2 mt-0.5">
                    <span className="uppercase tracking-wider">{stats[col].type === 'numeric' ? '수치형' : '범주형'}</span>
                    <span>•</span>
                    <span>{stats[col].uniqueCount}개 고유값</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Feature Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
           <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs">2</span>
              특징 변수 선택
            </h3>
            <p className="text-xs text-slate-500 mt-1">타겟에 영향을 줄 수 있는 변수들</p>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {columns.map(col => {
              const isTarget = col === target;
              return (
                <label 
                  key={`feature-${col}`}
                  className={`flex items-center p-3 rounded-lg transition-colors border ${selectedFeatures.includes(col) ? 'bg-slate-100 border-slate-400' : 'hover:bg-slate-50 border-transparent'} ${isTarget ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <input 
                    type="checkbox" 
                    value={col} 
                    checked={selectedFeatures.includes(col)}
                    onChange={() => handleFeatureToggle(col)}
                    disabled={isTarget}
                    className="w-4 h-4 text-slate-600 rounded border-slate-300 focus:ring-slate-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-medium text-slate-700">{col} {isTarget && '(타겟)'}</div>
                     <div className="text-xs text-slate-500 flex gap-2 mt-0.5">
                        <span className="uppercase tracking-wider">{stats[col].type === 'numeric' ? '수치형' : '범주형'}</span>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end sticky bottom-4">
        <button
          disabled={!isValid}
          onClick={() => target && onConfirm(target, selectedFeatures)}
          className={`
            px-8 py-3 rounded-lg font-semibold shadow-lg transition-all transform
            ${isValid 
              ? 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-1' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
          `}
        >
          분석 대시보드 생성
        </button>
      </div>
    </div>
  );
};
