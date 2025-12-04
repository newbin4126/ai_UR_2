
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { FileUploader } from './components/FileUploader';
import { VariableSelector } from './components/VariableSelector';
import { Dashboard } from './components/Dashboard';
import { Onboarding } from './components/Onboarding';
import { processFileContent, analyzeDataset } from './services/dataService';
import { AppStep, DatasetMeta, DataRow } from './types';

function App() {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
  const [data, setData] = useState<DataRow[]>([]);
  const [meta, setMeta] = useState<DatasetMeta | null>(null);
  
  const [targetVar, setTargetVar] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleFileLoaded = (content: string | ArrayBuffer, fileName: string) => {
    try {
      const parsedData = processFileContent(content, fileName);
      if (parsedData.length > 0) {
        const metadata = analyzeDataset(parsedData, fileName);
        setData(parsedData);
        setMeta(metadata);
        setStep(AppStep.SELECT_VARS);
      } else {
        alert("파일을 분석할 수 없습니다. 파일 형식을 확인해주세요.");
      }
    } catch (e) {
      console.error(e);
      alert("파일 분석 오류. 올바른 CSV 또는 Excel 파일인지 확인해주세요.");
    }
  };

  const handleVariablesConfirmed = (target: string, features: string[]) => {
    setTargetVar(target);
    setSelectedFeatures(features);
    setStep(AppStep.DASHBOARD);
  };

  return (
    <Layout>
      {showOnboarding && <Onboarding onClose={() => setShowOnboarding(false)} />}

      {/* Progress Stepper */}
      {!showOnboarding && (
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10"></div>
            
            {[AppStep.UPLOAD, AppStep.SELECT_VARS, AppStep.DASHBOARD].map((s, idx) => {
              const isActive = step === s;
              const isCompleted = 
                (step === AppStep.SELECT_VARS && idx === 0) ||
                (step === AppStep.DASHBOARD && idx < 2);
              
              let label = "업로드";
              if (s === AppStep.SELECT_VARS) label = "변수 선택";
              if (s === AppStep.DASHBOARD) label = "분석";

              return (
                <div key={s} className="flex flex-col items-center bg-slate-50 px-2">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors
                    ${isActive || isCompleted ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-400'}
                  `}>
                    {idx + 1}
                  </div>
                  <span className={`text-xs font-medium mt-2 ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="transition-opacity duration-500 ease-in-out">
        {step === AppStep.UPLOAD && (
          <FileUploader onFileLoaded={handleFileLoaded} />
        )}

        {step === AppStep.SELECT_VARS && meta && (
          <VariableSelector 
            columns={meta.columns} 
            stats={meta.stats} 
            initialTarget={targetVar}
            initialFeatures={selectedFeatures}
            onConfirm={handleVariablesConfirmed} 
          />
        )}

        {step === AppStep.DASHBOARD && meta && targetVar && (
          <Dashboard 
            data={data}
            meta={meta}
            target={targetVar}
            features={selectedFeatures}
            onReset={() => setStep(AppStep.SELECT_VARS)}
          />
        )}
      </div>
    </Layout>
  );
}

export default App;
