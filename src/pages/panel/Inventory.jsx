import { useState, useMemo, useEffect } from "react"; 
import api from '../../api/axios';


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

import { SearchBar } from "../../components/Searchbar";
import { AddItem } from "../../components/inventory/AddItem";
import { ViewItem } from "../../components/inventory/ViewItem";
import { EditItem } from "../../components/inventory/EditItem";
import { DeleteItem } from "../../components/inventory/DeleteItem";


library.add(fas);

const COLUMNS = [
  { id: "id", label: "#", sortable: true },
  { id: "name", label: "Name", sortable: true },
  { id: "description", label: "Description", sortable: false },
  { id: "quantity", label: "Quantity", sortable: true },
  { id: "price", label: "Price", sortable: true },
  { id: "actions", label: "Actions", sortable: false },
];

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-700">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-700 rounded animate-pulse w-full max-w-30" />
        </td>
      ))}
    </tr>
  );
}

export function Inventory() {

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "name",
    direction: "ascending",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleItemAdded = (newItem) => {
    setItems((prevItems) => [newItem, ...prevItems]);
  };

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/inventories');
        
        const fetchedData = response.data.data ? response.data.data : response.data;
        setItems(fetchedData);
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setError("Failed to load inventory items. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const sortedItems = useMemo(() => {
    if (!items.length) return [];
    return [...items].sort((a, b) => {
      const first = String(a[sortDescriptor.column] ?? "");
      const second = String(b[sortDescriptor.column] ?? "");
      const cmp = first.localeCompare(second);
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [items, sortDescriptor]);

  const handleSort = (columnId) => {
    setSortDescriptor((prev) => ({
      column: columnId,
      direction:
        prev.column === columnId && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const handleDelete = (id) => {
    console.log("Delete", id);
  };

  const [selectedItem, setSelectedItem] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleOpenViewModal = (item) => {
    setSelectedItem(item);
    setIsViewOpen(true);   
  };

  const [editingItem, setEditingItem] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleItemUpdated = (updatedItem) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleItemDeleted = (deletedId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== deletedId));
  };

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Inventory</h1>
          <p className="text-sm mt-0.5">Manage your stock items</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <FontAwesomeIcon icon="plus" className="w-3.5 h-3.5" />
          Add Item
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <SearchBar onSearch={(query) => console.log("Searching for: ", query)} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b ">
                {COLUMNS.map((col) => (
                  <th
                    key={col.id}
                    onClick={() => col.sortable && handleSort(col.id)}
                    className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider select-none
                      ${col.sortable ? "cursor-pointer hover:text-gray-700 transition-colors" : ""}
                    `}
                  >
                    <span className="flex items-center gap-1.5">
                      {col.label}
                      {col.sortable && (
                        <span className="flex flex-col gap-px">
                          <FontAwesomeIcon
                            icon="chevron-up"
                            className={`w-2 h-2 transition-colors ${
                              sortDescriptor.column === col.id &&
                              sortDescriptor.direction === "ascending"
                                ? ""
                                : "text-gray-700"
                            }`}
                          />
                          <FontAwesomeIcon
                            icon="chevron-down"
                            className={`w-2 h-2 transition-colors ${
                              sortDescriptor.column === col.id &&
                              sortDescriptor.direction === "descending"
                                ? ""
                                : "text-gray-700"
                            }`}
                          />
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
              ) : sortedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                      <FontAwesomeIcon icon="box-open" className="w-10 h-10 text-gray-600" />
                      <p className="text-sm font-medium">No items yet</p>
                      <p className="text-xs text-gray-600">Add your first inventory item to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{item.id}</td>
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-gray-400 max-w-50 truncate">{item.description}</td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">${Number(item.price).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleOpenViewModal(item)}
                          className="p-1.5 text-gray-500 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-colors"
                          title="View Item Details"
                        >
                          <FontAwesomeIcon icon="eye" className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setIsEditOpen(true);
                          }}
                          className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit Item"
                        >
                          <FontAwesomeIcon icon="pen-to-square" className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingItem(item);
                            setIsDeleteOpen(true);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Item"
                        >
                          <FontAwesomeIcon icon="trash" className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-700 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {isLoading ? "Loading items..." : `${sortedItems.length} items total`}
          </p>
        </div>
      </div>

      <ViewItem 
        isOpen={isViewOpen} 
        onClose={() => {
          setIsViewOpen(false);
          setSelectedItem(null);
        }} 
        item={selectedItem}
      />
      <AddItem 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onItemAdded={handleItemAdded}
      />

      <EditItem
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingItem(null);
        }}
        item={editingItem}
        onItemUpdated={handleItemUpdated}
      />

      <DeleteItem
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingItem(null);
        }}
        item={deletingItem}
        onItemDeleted={handleItemDeleted}
      />
    </div>
  );
}