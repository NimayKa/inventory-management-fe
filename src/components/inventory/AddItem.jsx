import { useState } from "react";
import { Modal, TextInput, Textarea, NumberInput, Button, FileInput } from "@mantine/core"; // Imported FileInput
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../api/axios";

export function AddItem({ isOpen, onClose, onItemAdded }) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState(""); 
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0.00);
  const [pictureFile, setPictureFile] = useState(null); 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    

    if (pictureFile) {
      data.append("picture", pictureFile);
    }

    try {
      const response = await api.post("/inventories", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setName("");
      setCategories("");
      setDescription("");
      setQuantity(0);
      setPrice(0.00);
      setPictureFile(null);
      
      const addedData = response.data.data ? response.data.data : response.data;
      onItemAdded(addedData);
      onClose();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data?.errors) {
        const serverErrors = err.response.data.errors;
        setError(Object.values(serverErrors).flat().join(" "));
      } else {
        setError(err.response?.data?.message || "Failed to upload item.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Add New Inventory Item" centered size="md">
      {error && (
        <div className="mb-4 p-2.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          label="Item Name"
          placeholder="e.g. Wireless Logitech Mouse"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <TextInput
          label="Category"
          placeholder="e.g. electronics"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          required
        />

        <Textarea
          label="Description"
          placeholder="e.g. Ergonomic wireless mouse"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            label="Quantity"
            placeholder="50"
            min={0}
            value={quantity}
            onChange={(val) => setQuantity(Number(val))}
            required
          />

          <NumberInput
            label="Price ($)"
            placeholder="25.99"
            min={0}
            decimalScale={2}
            value={price}
            onChange={(val) => setPrice(Number(val))}
            required
          />
        </div>

        <FileInput
          label="Product Picture"
          placeholder="Choose an image file"
          accept="image/*"
          clearable
          value={pictureFile}
          onChange={setPictureFile}
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="subtle" color="gray" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" color="green" loading={loading} leftSection={<FontAwesomeIcon icon="plus" className="w-3.5 h-3.5" />}>
            Save Item
          </Button>
        </div>
      </form>
    </Modal>
  );
}