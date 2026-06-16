import { Modal, Button, Text, Badge, Divider } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function ViewItem({ isOpen, onClose, item }) {
  // If no item is selected yet, return null to prevent crashing
  if (!item) return null;

  const imageUrl = item.picture && item.picture !== "default.jpg"
    ? `http://localhost:8000/storage/items/${item.picture}`
    : "https://placehold.co/600x400?text=No+Image+Available";

  return (
    <Modal 
      opened={isOpen} 
      onClose={onClose} 
      title={<span className="font-semibold text-lg text-gray-800">Product Details</span>}
      centered 
      size="md"
      radius="lg"
    >
      <div className="flex flex-col gap-5">
        
        {/* Product Image Display Box */}
        <div className="w-full h-48 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
          <img 
            src={imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback placeholder if image fails to load physically from server
              e.target.src = "https://placehold.co/600x400?text=Image+Not+Found";
            }}
          />
        </div>

        {/* Title and Category Section */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-bold text-gray-900 capitalize">{item.name}</h2>
            <Badge color="cyan" variant="light" size="md" className="capitalize">
              {item.categories}
            </Badge>
          </div>
          <p className="text-xs text-gray-400 mt-1 font-mono">Item ID: #{item.id}</p>
        </div>

        <Divider />

        {/* Stock and Financial Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 font-medium mb-1">Current Stock</p>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon="boxes-stacked" className="text-cyan-700 w-4 h-4" />
              <span className={`text-lg font-bold ${item.quantity === 0 ? 'text-red-500' : 'text-gray-800'}`}>
                {item.quantity} units
              </span>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 font-medium mb-1">Unit Price</p>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon="tag" className="text-emerald-600 w-4 h-4" />
              <span className="text-lg font-bold text-emerald-700">
                ${Number(item.price).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1">Description</p>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 min-h-17.5">
            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
              {item.description || "No product specifications or summary provided for this item."}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end mt-2">
          <Button variant="filled" color="gray" radius="md" onClick={onClose} className="px-5">
            Close View
          </Button>
        </div>

      </div>
    </Modal>
  );
}