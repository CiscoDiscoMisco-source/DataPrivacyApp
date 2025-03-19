import React, { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext';
import './Users.css';

const Users: React.FC = () => {
  const { client, loading, error } = useData();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await client.models.User.list();
        setUsers(result.data as any[]);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, [client]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="users">
      <h2>Users</h2>
      <div className="users-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-header">
              <h3>{user.firstName} {user.lastName}</h3>
              <span className={`status ${user.isActive ? 'active' : 'inactive'}`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="user-details">
              <p>Email: {user.email}</p>
              {user.isAdmin && <p className="admin-badge">Administrator</p>}
              <p>Account created: {new Date(user.createdAt).toLocaleDateString()}</p>
              {user.updatedAt && <p>Last updated: {new Date(user.updatedAt).toLocaleDateString()}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users; 