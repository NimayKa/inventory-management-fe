import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '../../api/axios';
import { ViewItem } from '../../components/inventory/ViewItem';

export function SearchResult() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || ''; 
  
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await api.get(`/inventories?search=${encodeURIComponent(searchQuery)}`);
        const fetchedData = response.data.data ? response.data.data : response.data;
        setItems(fetchedData);
      } catch (err) {
        console.error("Search failed:", err);
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const handleDelete = (id) => {
    console.log("Delete", id);
  };

  const [selectedItem, setSelectedItem] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleOpenViewModal = (item) => {
    setSelectedItem(item);
    setIsViewOpen(true);   
  };

  const handleEdit = (id) => {
    console.log("Edit", id);
  };

  return (
    <div className="p-6 w-full">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Search Results</h1>
        <p className="text-sm mt-0.5 text-gray-500">
          Showing results for: <span className="font-semibold text-cyan-700">"{searchQuery}"</span>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="rounded-xl border overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500 animate-pulse">
                    Searching database records...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <FontAwesomeIcon icon="box-open" className="w-10 h-10" />
                      <p className="text-sm font-medium">No matching items found</p>
                      <Link to="/inventory" className="text-xs text-cyan-600 hover:underline">
                        Return to inventory list
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{item.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                    <td className="px-4 py-3 text-gray-500 capitalize">{item.categories}</td>
                    <td className="px-4 py-3 text-gray-700">{item.quantity}</td>
                    <td className="px-4 py-3 text-gray-700">${Number(item.price).toFixed(2)}</td>
                    <td className="px-4 py-3 ">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleOpenViewModal(item)}
                          className="p-1.5 text-gray-500 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-colors"
                          title="View Item Details"
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
      </div>
      <ViewItem 
              isOpen={isViewOpen} 
              onClose={() => {
                setIsViewOpen(false);
                setSelectedItem(null); // Wipe state clear when closed
              }} 
              item={selectedItem}
            />
    </div>
  );
}