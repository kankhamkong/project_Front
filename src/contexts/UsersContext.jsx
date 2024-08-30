import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const UsersContext = createContext();

function UsersContextProvider(props) {
    const [users, setUsers] = useState([]);
    const [refreshUsers, setRefreshUsers] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const rs = await axios.get('http://localhost:8889/auth/users', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUsers(rs.data.users || []);
                } else {
                    setUsers([]);
                }
            } catch (error) {
                console.error('Error fetching users:', error.message);
                setUsers([]);
            }
        };
        fetchUsers();
    }, [refreshUsers]);

    const updateUsers = async (id, input) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await axios.put(`http://localhost:8889/auth/users/${id}`, input, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRefreshUsers((prev) => !prev);
            }
        } catch (error) {
            console.error('Error updating user:', error.message);
        }
    };

    return (
        <UsersContext.Provider value={{ users, updateUsers,setRefreshUsers}}>
            {props.children}
        </UsersContext.Provider>
    );
}

export default UsersContext;
export { UsersContextProvider};
