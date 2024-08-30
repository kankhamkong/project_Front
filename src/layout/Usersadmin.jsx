import React, { useState } from 'react';
import usersAuth from '../hooks/usersAuth';

export default function Usersadmin() {
  const { users, updateUsers, setRefreshUsers } = usersAuth();
  const [searchQuery, setSearchQuery] = useState(''); // State to manage the search query

  // Function to handle role change
  const handleRoleChange = (userId, newRole) => {
    updateUsers(userId, { role: newRole });
    setRefreshUsers(true); // Refresh the user list after updating
  };

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.id.toString().includes(searchQuery) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#592828] min-h-screen pt-24 p-2">
      <div className="max-w-[90rem] mx-auto mt-[3rem] bg-white p-4 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Users Management</h2>
        
        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="ค้นหา ID หรือ Username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[20rem] border border-gray-300 rounded px-4 py-2"
          />
        </div>
        
        {/* Users Table */}
        {filteredUsers.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">User</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="text-center">
                  <td className="py-2 px-4 border-b">{user.id}</td>
                  <td className="py-2 px-4 border-b">{user.username}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="User">User</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="DELIVERY">DELIVERY</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-red-500 mt-4">ไม่มีข้อมูล</p>
        )}
      </div>
    </div>
  );
}
