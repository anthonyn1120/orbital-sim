'use client';

interface ViewModeToggleProps {
  viewMode: '2D' | '3D';
  onToggle: () => void;
}

export function ViewModeToggle({ viewMode, onToggle }: ViewModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 left-4 z-10 px-4 py-2 bg-gray-800/90 backdrop-blur-sm border border-gray-600 rounded-lg text-white font-medium shadow-lg transition-all hover:bg-gray-700 hover:border-cyan-500 group"
    >
      <div className="flex items-center gap-2">
        <div className="relative w-10 h-6 bg-gray-700 rounded-full transition-colors group-hover:bg-gray-600">
          <div
            className={`absolute top-1 w-4 h-4 bg-cyan-500 rounded-full transition-all duration-300 ${
              viewMode === '3D' ? 'left-1' : 'left-5'
            }`}
          />
        </div>
        <span className="text-sm">
          {viewMode === '2D' ? '2D View' : '3D View'}
        </span>
      </div>
    </button>
  );
}
