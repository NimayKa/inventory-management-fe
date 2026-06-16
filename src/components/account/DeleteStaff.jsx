import { useState } from "react";
import { Modal, Button, Text } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../api/axios";

export function DeleteStaff({ isOpen, onClose, user, onStaffDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) return null;

  const handleConfirmDelete = async () => {
    setLoading(true);
    setError("");

    try {
      await api.delete(`/staff/${user.id}`);
      onStaffDeleted(user.id);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to remove staff account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={<span className="font-semibold text-red-600 flex items-center gap-2"><FontAwesomeIcon icon="triangle-exclamation" /> Revoke Account Access</span>}
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
          Are you sure you want to permanently delete <span className="font-semibold text-gray-900">"{user.fullname}" (@{user.username})</span>? This user will immediately lose access to the panel framework dashboard metrics.
        </Text>

        <div className="flex justify-end gap-3 mt-2">
          <Button variant="subtle" color="gray" onClick={onClose} disabled={loading} size="sm">
            Cancel
          </Button>
          <Button color="red" onClick={handleConfirmDelete} loading={loading} size="sm" leftSection={<FontAwesomeIcon icon="user-minus" className="w-3.5 h-3.5" />}>
            Revoke Access
          </Button>
        </div>
      </div>
    </Modal>
  );
}