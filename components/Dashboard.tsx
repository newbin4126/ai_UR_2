
import React, { useState, useEffect } from 'react';
import { DataRow, DatasetMeta, PredictionResult } from '../types';
import { createHistogramData, runModelAnalysis } from '../services/dataService';
import { generateExplanation } from '../services/geminiService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ScatterChart, Scatter, ZAxis, Cell
} from 'recharts';

interface DashboardProps {
  data: DataRow[];
  meta: DatasetMeta;
  target: string;
  features: string[];
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, meta, target, features, onReset }) => {
  // Initialize with the first selected feature, or fallback to the first available column if needed
  const [activeFeature, setActiveFeature] = useState<string>(features[0] || meta.columns.filter(c => c !== target)[0]);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);
  const [showQualityTooltip, setShowQualityTooltip] = useState(false);
  
  // Real-time prediction state
  const [prediction, setPrediction] = useState<PredictionResult>({
    accuracy: 0,
    auc: 0,
    modelName: '모델 학습 중...',
    type: 'classification'
  });

  const targetStats = meta.stats[target];
  const featureStats = meta.stats[activeFeature];
  
  // Get all potential features (all columns except target) for visualization
  const allFeatures = meta.columns.filter(c => c !== target);

  // Run calculation when target or features (model inputs) change
  useEffect(() => {
    const result = runModelAnalysis(data, target, features);
    setPrediction(result);
  }, [data, target, features]);

  // Fetch explanation when active feature changes
  useEffect(() => {
    if (!activeFeature || !featureStats) return;
    
    let isMounted = true;
    const fetchExplanation = async () => {
      if (!showExplanation) return;
      
      setLoadingExplanation(true);
      const statsContext = `Target is ${target} (${targetStats.type}), Feature is ${activeFeature} (${featureStats.type}). Mean of feature: ${featureStats.mean?.toFixed(2) || 'N/A'}.`;
      
      const text = await generateExplanation(target, activeFeature, statsContext);
      if (isMounted) {
        setExplanation(text);
        setLoadingExplanation(false);
      }
    };
    fetchExplanation();
    return () => { isMounted = false; };
  }, [activeFeature, target, showExplanation, targetStats, featureStats]);

  // Prepare chart data
  const histogramData = createHistogramData(data, activeFeature);
  const maxCount = Math.max(...histogramData.map(d => d.count));
  
  // Custom label renderer for BarChart
  const renderCustomBarLabel = (props: any) => {
    const { x, y, width, value } = props;
    if (value !== maxCount) return null;
    return (
      <text x={x + width / 2} y={y - 5} fill="#1e40af" textAnchor="middle" fontSize={12} fontWeight="bold">
        {value}
      </text>
    );
  };
  
  // Prepare Relationship Data
  const relationshipData = data.map((row, i) => ({
    x: targetStats.type === 'categorical' ? row[target] : row[activeFeature],
    y: targetStats.type === 'categorical' ? row[activeFeature] : row[target],
    z: 1, // Size
  })).slice(0, 300); // Limit points for performance

  const isRegression = prediction.type === 'regression';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Bar: Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-500">분석 관계:</label>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md font-semibold text-sm">{target}</span>
            <span className="text-slate-400">대</span>
            <select 
              value={activeFeature}
              onChange={(e) => setActiveFeature(e.target.value)}
              className="px-3 py-1 border border-slate-300 rounded-md text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none max-w-[200px]"
            >
              {allFeatures.map(f => (
                <option key={f} value={f}>
                  {f} {features.includes(f) ? '(모델 포함)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
             onClick={onReset}
             className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
           >
             모델 변수 변경
           </button>
           
           <div className="h-6 w-px bg-slate-200 mx-1"></div>

           <span className="text-sm text-slate-500">AI 어시스턴트</span>
           <button 
             onClick={() => setShowExplanation(!showExplanation)}
             className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${showExplanation ? 'bg-blue-600' : 'bg-slate-300'}`}
           >
             <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${showExplanation ? 'translate-x-6' : 'translate-x-0'}`} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Stats & Prediction */}
        <div className="space-y-8">
            {/* Prediction Card */}
            <div className="bg-slate-850 text-white rounded-xl shadow-lg p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                <h3 className="text-sm uppercase tracking-wider text-slate-400 font-semibold mb-1">모델 성능 (선택된 변수 기반)</h3>
                <div className="flex items-end gap-2 mb-4">
                    <span className="text-4xl font-bold">{(prediction.accuracy * 100).toFixed(1)}%</span>
                    <span className="text-sm text-blue-400 mb-1">
                      {isRegression ? 'R² (설명력)' : '정확도 (Accuracy)'}
                    </span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: `${Math.max(0, prediction.accuracy * 100)}%` }}></div>
                </div>
                <div className="mt-4 flex justify-between text-xs text-slate-400">
                    {!isRegression && <span>AUC (추정): {prediction.auc.toFixed(2)}</span>}
                    {isRegression && <span>설명력(0~1): 1에 가까울수록 좋음</span>}
                    <span>{prediction.modelName}</span>
                </div>
            </div>

            {/* Feature Stats */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative">
                 <div className="flex justify-between items-center mb-4">
                   <div className="flex items-center gap-2">
                     <h3 className="font-semibold text-slate-900">데이터 품질: {activeFeature}</h3>
                     <div className="relative">
                       <button 
                         onMouseEnter={() => setShowQualityTooltip(true)}
                         onMouseLeave={() => setShowQualityTooltip(false)}
                         className="text-slate-400 hover:text-blue-500 transition-colors"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                         </svg>
                       </button>
                       {showQualityTooltip && (
                         <div className="absolute left-0 bottom-6 w-64 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-10 leading-relaxed">
                           <p className="mb-1"><strong className="text-blue-300">결측치:</strong> 비어있는 데이터의 개수입니다.</p>
                           <p className="mb-1"><strong className="text-blue-300">고유값:</strong> 중복을 제외한 데이터의 종류 수입니다.</p>
                           <p><strong className="text-blue-300">평균:</strong> 데이터의 산술적인 평균값입니다.</p>
                         </div>
                       )}
                     </div>
                   </div>
                   <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">{featureStats.type === 'numeric' ? '수치형' : '범주형'}</span>
                 </div>
                 
                 <div className="space-y-4 text-sm">
                    <div className="flex justify-between py-2 border-b border-slate-50">
                        <span className="text-slate-500">결측치</span>
                        <span className={`font-medium ${featureStats.missingCount > 0 ? 'text-red-500' : 'text-slate-700'}`}>
                            {featureStats.missingCount} ({((featureStats.missingCount / meta.rowCount) * 100).toFixed(1)}%)
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-50">
                        <span className="text-slate-500">고유값 개수</span>
                        <span className="font-medium text-slate-700">{featureStats.uniqueCount}</span>
                    </div>
                    {featureStats.mean && (
                         <div className="flex justify-between py-2 border-b border-slate-50">
                            <span className="text-slate-500">평균 (Mean)</span>
                            <span className="font-medium text-slate-700">{featureStats.mean.toFixed(4)}</span>
                        </div>
                    )}
                 </div>
            </div>

             {/* AI Explanation */}
            {showExplanation && (
                <div className="bg-blue-50 rounded-xl border border-blue-100 p-6 relative">
                     <div className="flex items-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <h3 className="font-bold text-blue-900">전문가 인사이트</h3>
                     </div>
                     <div className="text-sm text-blue-800 leading-relaxed">
                        {loadingExplanation ? (
                             <div className="animate-pulse flex space-x-4">
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-2 bg-blue-200 rounded"></div>
                                    <div className="h-2 bg-blue-200 rounded w-5/6"></div>
                                    <div className="h-2 bg-blue-200 rounded w-4/6"></div>
                                </div>
                             </div>
                        ) : (
                            explanation
                        )}
                     </div>
                     <div className="mt-3 text-xs text-blue-400 text-right">Powered by Gemini</div>
                </div>
            )}
        </div>

        {/* Right Col: Visualizations */}
        <div className="lg:col-span-2 space-y-8">
            {/* Distribution Plot */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h4 className="text-lg font-semibold text-slate-800 mb-6">{activeFeature}의 분포</h4>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={histogramData} margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="bin" tick={{fontSize: 12, fill: '#64748b'}} />
                            <YAxis tick={{fontSize: 12, fill: '#64748b'}} />
                            <Tooltip 
                                contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}}
                                itemStyle={{color: '#fff'}}
                                cursor={{fill: '#f1f5f9'}}
                            />
                            <Bar 
                                dataKey="count" 
                                name="빈도수" 
                                radius={[4, 4, 0, 0]}
                                label={renderCustomBarLabel}
                            >
                                {histogramData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.count === maxCount ? '#1e40af' : '#60a5fa'} 
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-slate-400 mt-4 text-center">데이터셋에서 {activeFeature} 값의 빈도를 보여줍니다.</p>
            </div>

            {/* Relationship Plot */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h4 className="text-lg font-semibold text-slate-800 mb-6">{target} vs {activeFeature}</h4>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis 
                                type={targetStats.type === 'categorical' ? 'category' : 'number'} 
                                dataKey="x" 
                                name={targetStats.type === 'categorical' ? target : activeFeature} 
                                tick={{fontSize: 12, fill: '#64748b'}} 
                            />
                            <YAxis 
                                type="number" 
                                dataKey="y" 
                                name={targetStats.type === 'categorical' ? activeFeature : target}
                                tick={{fontSize: 12, fill: '#64748b'}} 
                            />
                            <ZAxis type="number" range={[50, 50]} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} 
                                contentStyle={{backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b'}}
                            />
                            <Scatter name="값" data={relationshipData} fill="#2563eb" fillOpacity={0.6} />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-slate-400 mt-4 text-center">
                    {targetStats.type === 'categorical' 
                        ? `${activeFeature}가 다양한 ${target} 범주에 어떻게 분포하는지 시각화합니다.`
                        : `${target}와 ${activeFeature} 간의 상관관계 플롯입니다.`}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
