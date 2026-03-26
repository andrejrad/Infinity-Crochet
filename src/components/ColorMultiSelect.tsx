import { useState } from 'react';

interface ColorMultiSelectProps {
  selectedColors: string[];
  onChange: (colors: string[]) => void;
  label: string;
}

const AVAILABLE_COLORS = [
  { name: 'Red', value: 'red', hex: '#EF4444' },
  { name: 'Pink', value: 'pink', hex: '#EC4899' },
  { name: 'Purple', value: 'purple', hex: '#A855F7' },
  { name: 'Blue', value: 'blue', hex: '#3B82F6' },
  { name: 'Light Blue', value: 'light-blue', hex: '#0EA5E9' },
  { name: 'Teal', value: 'teal', hex: '#14B8A6' },
  { name: 'Green', value: 'green', hex: '#10B981' },
  { name: 'Yellow', value: 'yellow', hex: '#EAB308' },
  { name: 'Orange', value: 'orange', hex: '#F97316' },
  { name: 'Brown', value: 'brown', hex: '#A16207' },
  { name: 'Gray', value: 'gray', hex: '#6B7280' },
  { name: 'Black', value: 'black', hex: '#1F2937' },
  { name: 'White', value: 'white', hex: '#F9FAFB' },
  { name: 'Cream', value: 'cream', hex: '#FEF3C7' },
  { name: 'Beige', value: 'beige', hex: '#D6C9B5' },
  { name: 'Lavender', value: 'lavender', hex: '#C4B5FD' },
  { name: 'Mint', value: 'mint', hex: '#A7F3D0' },
  { name: 'Peach', value: 'peach', hex: '#FED7AA' },
];

export default function ColorMultiSelect({ selectedColors, onChange, label }: ColorMultiSelectProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleColor = (colorValue: string) => {
    if (selectedColors.includes(colorValue)) {
      onChange(selectedColors.filter(c => c !== colorValue));
    } else {
      onChange([...selectedColors, colorValue]);
    }
  };

  const selectAll = () => {
    onChange(AVAILABLE_COLORS.map(c => c.value));
  };

  const deselectAll = () => {
    onChange([]);
  };

  const allSelected = selectedColors.length === AVAILABLE_COLORS.length;

  return (
    <div className="relative">
      <label className="block text-xs text-gray-600 mb-1">{label}</label>
      
      <div
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent cursor-pointer bg-white min-h-[42px] flex items-center justify-between"
      >
        <div className="flex flex-wrap gap-1">
          {selectedColors.length === 0 ? (
            <span className="text-gray-400 text-sm">Select colors...</span>
          ) : selectedColors.length <= 3 ? (
            selectedColors.map(colorValue => {
              const color = AVAILABLE_COLORS.find(c => c.value === colorValue);
              return color ? (
                <span
                  key={colorValue}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-xs"
                >
                  <span
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.hex }}
                  />
                  {color.name}
                </span>
              ) : null;
            })
          ) : (
            <span className="text-sm text-gray-700">
              {selectedColors.length} colors selected
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute z-20 w-full min-w-[280px] mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-72 overflow-y-auto">
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-2 flex gap-2">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); allSelected ? deselectAll() : selectAll(); }}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-purple hover:bg-purple hover:text-white border border-purple rounded transition-colors"
              >
                {allSelected ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="p-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_COLORS.map(color => {
                const isSelected = selectedColors.includes(color.value);
                return (
                  <label
                    key={color.value}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50 ${
                      isSelected ? 'bg-purple-50 border border-purple' : 'border border-transparent'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleColor(color.value)}
                      className="w-4 h-4 text-purple border-gray-300 rounded focus:ring-2 focus:ring-purple flex-shrink-0"
                    />
                    <span
                      className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-sm text-gray-700 flex-1 min-w-0">{color.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export { AVAILABLE_COLORS };
