import { useState } from "react";
import { Modal, TextInput, PasswordInput, Select, Button, FileInput } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../api/axios";

export function AddStaff({ isOpen, onClose, onStaffAdded }) {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [pictureFile, setPictureFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter your password.");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("username", username.trim());
    data.append("fullname", fullname.trim());
    data.append("email", email.trim());
    data.append("role", role);
    data.append("password", password);
    if (pictureFile) {
      data.append("picture", pictureFile);
    }

    try {
      const response = await api.post("/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const addedUser = response.data.data ? response.data.data : response.data;

      setUsername("");
      setFullname("");
      setEmail("");
      setRole("staff");
      setPassword("");
      setConfirmPassword("");
      setPictureFile(null);

      onStaffAdded(addedUser);
      onClose();
    } catch (err) {
      if (err.response && err.response.data?.errors) {
        setError(Object.values(err.response.data.errors).flat().join(" "));
      } else {
        setError(err.response?.data?.message || "Failed to create staff account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title={<span className="font-semibold text-gray-800">Add New Staff Account</span>} centered size="md">
      {error && <div className="mb-4 p-2.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput label="Username" placeholder="e.g. john_doe" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <TextInput label="Full Name" placeholder="e.g. John Doe" value={fullname} onChange={(e) => setFullname(e.target.value)} required />
        <TextInput label="Email Address" placeholder="e.g. john@company.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Select label="System Access Role" value={role} onChange={setRole} data={[{ value: 'staff', label: 'Staff Member' }, { value: 'admin', label: 'System Administrator' }]} required />
        
        <PasswordInput label="Account Password" placeholder="Minimum 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
        
        <PasswordInput 
          label="Re-enter Password" 
          placeholder="Confirm your password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
        />
        
        <FileInput label="Profile Picture (Optional)" placeholder="Choose an avatar image" accept="image/*" clearable value={pictureFile} onChange={setPictureFile} />

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="subtle" color="gray" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" color="cyan" loading={loading} leftSection={<FontAwesomeIcon icon="user-plus" />}>Create Account</Button>
        </div>
      </form>
    </Modal>
  );
}