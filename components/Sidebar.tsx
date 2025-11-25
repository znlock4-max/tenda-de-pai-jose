import React from 'react';
import { ORIXAS, HERBS_SAMPLE } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside 
        className={`
          fixed md:relative z-50 h-full w-80 bg-stone-100 border-r border-stone-300 shadow-xl transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          overflow-y-auto custom-scrollbar
        `}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-umbanda-brown">Biblioteca da Tenda</h2>
            <button onClick={toggleSidebar} className="md:hidden text-stone-500 hover:text-stone-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-umbanda-green mb-4 border-b border-stone-300 pb-2">Orixás Principais</h3>
            <div className="space-y-4">
              {ORIXAS.map((orixa) => (
                <div key={orixa.name} className="bg-white p-3 rounded-lg shadow-sm border border-stone-200">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={orixa.image} alt={orixa.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-stone-800">{orixa.name}</h4>
                      <p className="text-xs text-stone-500">{orixa.day}</p>
                    </div>
                  </div>
                  <p className="text-sm text-stone-600 mb-1">{orixa.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-[10px] px-2 py-1 bg-stone-100 rounded-full text-stone-600 border border-stone-200">{orixa.element}</span>
                    <span className="text-[10px] px-2 py-1 bg-stone-100 rounded-full text-stone-600 border border-stone-200">{orixa.colors}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-umbanda-green mb-4 border-b border-stone-300 pb-2">Ervas & Usos</h3>
            <ul className="space-y-3">
              {HERBS_SAMPLE.map((herb) => (
                <li key={herb.name} className="bg-white p-3 rounded-lg border-l-4 border-umbanda-green shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-stone-800">{herb.name}</span>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400">{herb.type}</span>
                  </div>
                  <p className="text-sm text-stone-600">{herb.usage}</p>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-8 p-4 bg-umbanda-brown/10 rounded-lg text-center">
            <p className="text-xs text-stone-600 italic font-serif">
              "A caridade é o amor em ação."
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
