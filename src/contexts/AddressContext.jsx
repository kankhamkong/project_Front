import axios from 'axios';
import React, { createContext, useState, useEffect } from 'react';

const AddressContext = createContext();

function AddressContextProvider(props) {
    const [addresses, setAddresses] = useState([]);
    const [refreshAddress, setRefreshAddress] = useState(false);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const rs = await axios.get('http://localhost:8889/address/address', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                    });
                    console.log("Data=",rs.data)
                    setAddresses(rs.data.addresses|| []);
                } else {
                    setAddresses([]);
                }
            } catch (error) {
                console.log('Error fetching address data:', error);
                setAddresses([]);
            }
        };
        fetchAddresses();
    }, [refreshAddress]);

    const addToAddress = async (input) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const rs = await axios.post('http://localhost:8889/address/address', input, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                setAddresses(prev => [...prev, rs.data.address]);
                setRefreshAddress(!refreshAddress);
            } else {
                console.log('Unauthorized to add address');
            }
        } catch (error) {
            console.log('Error adding address:', error);
        }
    };

    const updateAddress = async (id, input) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const rs = await axios.put(`http://localhost:8889/address/address/${id}`, input, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                setAddresses(prev => prev.map(addr => addr.id === id ? rs.data.address : addr));
                setRefreshAddress(!refreshAddress);
            } else {
                console.log('Unauthorized to update address');
            }
        } catch (error) {
            console.log('Error updating address:', error);
        }
    };

    return (
        <AddressContext.Provider value={{ addresses, addToAddress, updateAddress }}>
            {props.children}
        </AddressContext.Provider>
    );
}

export default AddressContext;
export { AddressContextProvider };
