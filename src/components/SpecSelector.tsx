import { PhotoSpec } from '@/types/photoSpec';

interface SpecSelectorProps {
  specs: PhotoSpec[];
  selectedSpec: PhotoSpec;
  onSelect: (spec: PhotoSpec) => void;
}

export default function SpecSelector({ specs, selectedSpec, onSelect }: SpecSelectorProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">选择规格</h2>
      <div className="grid grid-cols-2 gap-3">
        {specs.map((spec) => (
          <button
            key={spec.id}
            onClick={() => onSelect(spec)}
            className={`py-2 px-4 rounded-md border transition-colors ${
              selectedSpec.id === spec.id
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">{spec.name}</div>
            <div className="text-xs">{spec.size}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
