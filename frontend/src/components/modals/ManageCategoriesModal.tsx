interface Category {
  id: number;
  category: string;
}

interface ManageCategoriesModalProps {
  isOpen: boolean;
  allCategories: Category[];
  selectedCategories: number[];
  onClose: () => void;
  onSave: () => void;
  onToggleCategory: (categoryId: number) => void;
}

export default function ManageCategoriesModal({
  isOpen,
  allCategories,
  selectedCategories,
  onClose,
  onSave,
  onToggleCategory,
}: ManageCategoriesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Manage Technician Offices
        </h3>
        <div className="mb-6 max-h-60 overflow-y-auto border rounded p-2">
          {allCategories.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No offices available
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {allCategories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => onToggleCategory(cat.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{cat.category}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={selectedCategories.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
