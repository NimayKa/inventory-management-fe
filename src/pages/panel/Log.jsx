import { useEffect, useState } from 'react';
import { Modal, Button, Text, Badge } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '../../api/axios';

export function LogPage() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/logs');
      const data = response.data.data ? response.data.data : response.data;
      setLogs(data);
    } catch (err) {
      console.error("Failed fetching activity logs:", err);
      setError("Unable to sync activity stream records.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDelete = (log) => {
    setLogToDelete(log);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!logToDelete) return;
    setDeleteLoading(true);

    try {
      await api.delete(`/inventory-logs/${logToDelete.id}`);
      
      setLogs((prevLogs) => prevLogs.filter((l) => l.id !== logToDelete.id));
      setIsDeleteOpen(false);
      setLogToDelete(null);
    } catch (err) {
      console.error("Deletion task error:", err);
      alert(err.response?.data?.message || "Could not eliminate selected log reference entry.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getActionBadgeColor = (action) => {
    switch (action?.toLowerCase()) {
      case 'create': return 'green';
      case 'update': return 'amber';
      case 'delete': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Inventory Audit Logs</h1>
          <p className="text-sm mt-0.5 text-gray-500">Track and monitor stock manipulation histories</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="rounded-xl border overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Item Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Inv ID</th>
                <th className="px-4 py-3">Changed By</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-500 animate-pulse">
                    Synchronizing ledger tables...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-gray-400">
                    <FontAwesomeIcon icon="clipboard-list" className="w-8 h-8 mb-2 block mx-auto text-gray-300" />
                    No historical modifications logged yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">#{log.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{log.name}</td>
                    <td className="px-4 py-3 text-gray-500 capitalize">{log.categories}</td>
                    <td className="px-4 py-3">
                      <Badge color={getActionBadgeColor(log.action)} variant="light" size="xs" className="uppercase font-bold">
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-xs truncate" title={log.description}>
                      {log.description}
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{log.quantity}</td>
                    <td className="px-4 py-3 text-emerald-700">${Number(log.price).toFixed(2)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">#{log.inventory_id}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">User #{log.changed_by}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleOpenDelete(log)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Log Entry"
                      >
                        <FontAwesomeIcon icon="trash-can" className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        opened={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title={
          <span className="font-semibold text-red-600 flex items-center gap-2">
            <FontAwesomeIcon icon="triangle-exclamation" /> Clear Log Entry
          </span>
        }
        centered
        size="sm"
        radius="md"
      >
        <div className="flex flex-col gap-4 py-1">
          <Text size="sm" className="text-gray-600 leading-relaxed">
            Are you sure you want to permanently clear the audit tracking metadata entry index line <span className="font-semibold text-gray-900">"#{logToDelete?.id}"</span>? This will reduce tracking transparency.
          </Text>

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="subtle" color="gray" onClick={() => setIsDeleteOpen(false)} disabled={deleteLoading} size="sm">
              Cancel
            </Button>
            <Button color="red" onClick={handleConfirmDelete} loading={deleteLoading} size="sm" leftSection={<FontAwesomeIcon icon="trash-can" className="w-3.5 h-3.5" />}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}