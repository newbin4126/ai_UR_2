import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
              U
            </div>
            <span className="font-semibold text-lg tracking-tight text-slate-800">UR</span>
          </div>
          <nav className="flex gap-6 text-sm font-medium text-slate-500">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">문서</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">지원</span>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-slate-900 text-slate-400 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6">
          <a 
            href="https://youtube.com/shorts/qPaP36Gf--c?si=7ZrMnD_0rUHh5yv2" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-red-600 transition-colors transform hover:scale-110 duration-200"
            aria-label="YouTube 영상 보기"
          >
            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <p className="text-sm">&copy; {new Date().getFullYear()} UR Analytics. team DBDB. AI - final assignment</p>
        </div>
      </footer>
    </div>
  );
};