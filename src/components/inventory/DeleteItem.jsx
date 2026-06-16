import { useState } from "react";
import { Modal, Button, Text } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../api/axios";

export function DeleteItem({ isOpen, onClose, item, onItemDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!item) return null;

  const handleConfirmDelete = async () => {
    setLoading(true);
    setError("");

    try {
      await api.delete(`/inventories/${item.id}`);

      onItemDeleted(item.id);
      
      onClose();
    } catch (err) {
      console.error("Deletion failed:", err);
      setError(err.response?.data?.message || "An error occurred while deleting the item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <span className="font-semibold text-red-600 flex items-center gap-2">
          <FontAwesomeIcon icon="triangle-exclamation" /> 
          Delete Confirmation
        </span>
      }
      centered
      size="sm"
      radius="md"
    >
      <div className="flex flex-col gap-4 py-1">
        {error && (
          <div className="p-2.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <Text size="sm" className="text-gray-600 leading-relaxed">
          Are you sure you want to permanently remove <span className="font-semibold text-gray-900">"{item.name}"</span> from the inventory management records? This change cannot be undone.
        </Text>

        <div className="flex justify-end gap-3 mt-2">
          <Button 
            variant="subtle" 
            color="gray" 
            onClick={onClose} 
            disabled={loading}
            size="sm"
          >
            Cancel
          </Button>
          <Button 
            color="red" 
            onClick={handleConfirmDelete} 
            loading={loading}
            size="sm"
            leftSection={<FontAwesomeIcon icon="trash-can" className="w-3.5 h-3.5" />}
          >
            Confirm Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}