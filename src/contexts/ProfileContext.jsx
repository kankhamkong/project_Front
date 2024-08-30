import React, { useEffect, useState, createContext, useContext } from 'react';
import axios from 'axios';

// Create ProfileContext
const ProfileContext = createContext();

export function ProfileContextProvider(props) {
  const [profile, setProfile] = useState(null); // Changed from profileUser to profile
  const [refreshProfile, setRefreshProfile] = useState(false); // Changed from refreshProfileUser to refreshProfile

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Fetch user profile data
          const rs = await axios.get('http://localhost:8889/auth/Profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Log response data for debugging
          console.log("data=", rs);

          if (rs.data && rs.data.profile) { // Changed from profileUser to profile
            setProfile(rs.data.profile); // Set profile data
          } else {
            setProfile({}); // Set to empty object if no data received
          }
        } else {
          setProfile({}); // Handle case where token is not available
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setProfile({}); // Set to empty object in case of error
      }
    };
    fetchProfile();
  }, [refreshProfile]);

  const addToProfile = async (input) => { // Changed from addToProfileUser to addToProfile
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:8889/auth/Profile`,
        input,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(prevProfile => [...(prevProfile || []), response.data]); // Add new data to existing array or initialize if empty
      setRefreshProfile(!refreshProfile);
    } catch (error) {
      console.error("Error adding to profile:", error);
    }
  };

  const updateProfile = async (id, input) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8889/auth/Profile/${id}`,
        input,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("java=", response);
      if (response.data && response.data.profile) { // Changed from profileUser to profile
        setProfile(response.data.profile); // Update the state with new data
      } else {
        console.warn('No profile data returned from the update operation.');
        setProfile({}); // Fallback to an empty state
      }

      setRefreshProfile(!refreshProfile);
      console.log(setProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, addToProfile, updateProfile,setRefreshProfile }}>
      {props.children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
