import { useState, useEffect } from "react";
import { Modal, TextInput, Textarea, NumberInput, Button, FileInput } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../api/axios";

export function EditItem({ isOpen, onClose, item, onItemUpdated }) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0.00);
  const [pictureFile, setPictureFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setCategories(item.categories || "");
      setDescription(item.description || "");
      setQuantity(item.quantity || 0);
      setPrice(item.price || 0.00);
      setPictureFile(null);
      setError("");
    }
  }, [item]);

  if (!item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("name", name.trim());
    data.append("categories", categories.trim());
    data.append("description", description.trim());
    data.append("quantity", Number(quantity));
    data.append("price", Number(price));

    data.append("_method", "PUT");

    if (pictureFile) {
      data.append("picture", pictureFile);
    }

    try {
      const response = await api.post(`/inventories/${item.id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedData = response.data.data ? response.data.data : response.data;
      
      onItemUpdated(updatedData);
      onClose();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data?.errors) {
        setError(Object.values(err.response.data.errors).flat().join(" "));
      } else {
        setError(err.response?.data?.message || "Failed to update item.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title={<span className="font-semibold text-gray-800">Edit Inventory Item</span>} centered size="md">
      {error && (
        <div className="mb-4 p-2.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          label="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <TextInput
          label="Category"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          required
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            label="Quantity"
            min={0}
            value={quantity}
            onChange={(val) => setQuantity(Number(val))}
            required
          />

          <NumberInput
            label="Price ($)"
            min={0}
            decimalScale={2}
            value={price}
            onChange={(val) => setPrice(Number(val))}
            required
          />
        </div>

        <FileInput
          label="Replace Product Picture (Optional)"
          placeholder="Choose new image file"
          accept="image/*"
          clearable
          value={pictureFile}
          onChange={setPictureFile}
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="subtle" color="gray" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" color="cyan" loading={loading} leftSection={<FontAwesomeIcon icon="pen-to-square" className="w-3.5 h-3.5" />}>
            Update Item
          </Button>
        </div>
      </form>
    </Modal>
  );
}