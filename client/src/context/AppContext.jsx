/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem('buspass')) || null
  );

  const [loading, setLoading] = useState(false);

  const logoutUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAuthUser(null);
      localStorage.removeItem('buspass');
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const usePreviewImage = () => {
    const [profileUrl, setProfileUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onloadend = () => {
          setProfileUrl(reader.result);
        };
        setSelectedFile(file);
        reader.readAsDataURL(file);
      } else {
        toast.error('Invalid file type. Please select an image file');
        setProfileUrl('');
      }
    };
    return {
      handleImageChange,
      profileUrl,
      setProfileUrl,
      selectedFile,
      setSelectedFile,
    };
  };

  return (
    <AppContext.Provider
      value={{ authUser, setAuthUser, logoutUser, loading, usePreviewImage }}
    >
      {children}
    </AppContext.Provider>
  );
};
