import { useState, useEffect } from "react";
import { Modal, TextInput, PasswordInput, Select, Button, FileInput } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../api/axios";

export function EditStaff({ isOpen, onClose, user, onStaffUpdated }) {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
  const [password, setPassword] = useState("");
  const [pictureFile, setPictureFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setFullname(user.fullname || "");
      setEmail(user.email || "");
      setRole(user.role || "staff");
      setPassword("");
      setPictureFile(null);
      setError("");
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("username", username.trim());
    data.append("fullname", fullname.trim());
    data.append("email", email.trim());
    data.append("role", role);
    data.append("_method", "PUT");
    if (password.trim() !== "") {
      data.append("password", password);
    }
    if (pictureFile) {
      data.append("picture", pictureFile);
    }

    try {
      const response = await api.post(`/staff/${user.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedUser = response.data.data ? response.data.data : response.data;
      onStaffUpdated(updatedUser);
      onClose();
    } catch (err) {
      if (err.response && err.response.data?.errors) {
        setError(Object.values(err.response.data.errors).flat().join(" "));
      } else {
        setError(err.response?.data?.message || "Failed to update account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title={<span className="font-semibold text-gray-800">Edit Staff Account</span>} centered size="md">
      {error && <div className="mb-4 p-2.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <TextInput label="Full Name" value={fullname} onChange={(e) => setFullname(e.target.value)} required />
        <TextInput label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Select label="System Access Role" value={role} onChange={setRole} data={[{ value: 'staff', label: 'Staff Member' }, { value: 'admin', label: 'System Administrator' }]} required />
        <PasswordInput label="Reset Password (Leave blank to keep unchanged)" placeholder="Enter new password if changing" value={password} onChange={(e) => setPassword(e.target.value)} />
        <FileInput label="Replace Profile Picture (Optional)" placeholder="Choose new avatar image" accept="image/*" clearable value={pictureFile} onChange={setPictureFile} />

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="subtle" color="gray" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" color="cyan" loading={loading} leftSection={<FontAwesomeIcon icon="user-pen" />}>Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
}