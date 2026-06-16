import { useEffect, useState } from "react";
import { Badge } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../api/axios";

import { AddStaff } from "../../components/account/AddStaff";
import { EditStaff } from "../../components/account/EditStaff";
import { DeleteStaff } from "../../components/account/DeleteStaff";

export function Staff() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/staff");
      const dataset = response.data.data ? response.data.data : response.data;
      setUsers(dataset);
    } catch (err) {
      console.error(err);
      setError("Unable to sync active staff directories.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStaffAdded = (newUser) => setUsers((prev) => [newUser, ...prev]);
  const handleStaffUpdated = (updatedUser) => setUsers((prev) => prev.map((u) => u.id === updatedUser.id ? updatedUser : u));
  const handleStaffDeleted = (deletedId) => setUsers((prev) => prev.filter((u) => u.id !== deletedId));

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">User Management</h1>
          <p className="text-sm mt-0.5 text-gray-500">Configure administrator access and operational staff roles</p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <FontAwesomeIcon icon="user-plus" className="w-3.5 h-3.5" />
          Add User Account
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">{error}</div>
      )}

      <div className="rounded-xl border overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">System Access Role</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 animate-pulse">Syncing directory profiles...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No personnel accounts located.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">#{user.id}</td>
                    <td className="px-4 py-3 font-semibold text-cyan-800">@{user.username}</td>
                    <td className="px-4 py-3 text-gray-800">{user.fullname}</td>
                    <td className="px-4 py-3">
                      <Badge color={user.role === 'admin' ? 'purple' : 'blue'} variant="light" size="xs" className="uppercase font-bold">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => { setSelectedUser(user); setIsEditOpen(true); }}
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Modify Account Properties"
                        >
                          <FontAwesomeIcon icon="user-pen" className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { setSelectedUser(user); setIsDeleteOpen(true); }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Revoke User Access"
                        >
                          <FontAwesomeIcon icon="user-minus" className="w-3.5 h-3.5" />
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

      <AddStaff isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onStaffAdded={handleStaffAdded} />
      <EditStaff isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setSelectedUser(null); }} user={selectedUser} onStaffUpdated={handleStaffUpdated} />
      <DeleteStaff isOpen={isDeleteOpen} onClose={() => { setIsDeleteOpen(false); setSelectedUser(null); }} user={selectedUser} onStaffDeleted={handleStaffDeleted} />
    </div>
  );
}