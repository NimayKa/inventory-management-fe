import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
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
  const [items] = useState([]);
  const [isLoading] = useState(true);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "name",
    direction: "ascending",
  });

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

  const handleView = (id) => {
    console.log("View", id);
  };

  const handleEdit = (id) => {
    console.log("Edit", id);
  };

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Inventory</h1>
          <p className="text-sm mt-0.5">Manage your stock items</p>
        </div>
        <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <FontAwesomeIcon icon="plus" className="w-3.5 h-3.5" />
          Add Item
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border  overflow-hidden">
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
                    <td className="px-4 py-3 text-white font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-gray-400 max-w-50 truncate">{item.description}</td>
                    <td className="px-4 py-3 text-white">{item.quantity}</td>
                    <td className="px-4 py-3 text-white">${Number(item.price).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(item.id)}
                          title="View"
                          className="p-1.5 rounded-md text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                        >
                          <FontAwesomeIcon icon="eye" className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEdit(item.id)}
                          title="Edit"
                          className="p-1.5 rounded-md text-gray-400 hover:text-orange-400 hover:bg-orange-400/10 transition-colors"
                        >
                          <FontAwesomeIcon icon="pen-to-square" className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                          className="p-1.5 rounded-md text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
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
    </div>
  );
}