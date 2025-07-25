"use client";

import { useEffect, useState } from "react";

const UseProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfileFromStorage = () => {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        setProfileData(null);
        setLoading(false);
        return;
      }

      const storedData = localStorage.getItem("profileData");
      if (storedData && storedData !== "{}" && storedData !== "null" && storedData !== "undefined") {
        let parsedData;
        try {
          parsedData = JSON.parse(storedData);
        } catch (parseError) {
          console.error("Erro ao fazer parse do profileData:", parseError);
          localStorage.removeItem("profileData"); 
          setProfileData(null);
          setLoading(false);
          return;
        }
        
        if (parsedData && typeof parsedData === 'object' && !Array.isArray(parsedData)) {
          if (!parsedData.token) {
            const adminToken = localStorage.getItem('admin_token');
            const userToken = localStorage.getItem('token');
            const token = adminToken || userToken;
            
            if (token) {
              parsedData.token = token;
              parsedData.tokenType = adminToken ? 'admin' : 'user';
            }
          }
          
          setProfileData(parsedData);
        } else {
          console.warn("Dados do perfil inválidos:", parsedData);
          localStorage.removeItem("profileData");
          setProfileData(null);
        }
      } else {
        setProfileData(null);
      }
    } catch (err) {
      console.error("Erro ao carregar perfil do localStorage:", err);
      setError("Erro ao carregar dados do perfil");
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  const saveProfileToStorage = (data) => {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        console.warn("localStorage não está disponível");
        return;
      }

      localStorage.setItem("profileData", JSON.stringify(data));
      
      if (data.token) {
        if (data.tokenType === 'admin' || data.user?.role === 'admin' || data.role === 'admin') {
          localStorage.setItem('admin_token', data.token);
          localStorage.removeItem('token');
        } else {
          localStorage.setItem('token', data.token);
          localStorage.removeItem('admin_token'); 
        }
      }
      
      setProfileData(data);
      setError(null);
    } catch (err)      {
      console.error("Erro ao salvar perfil no localStorage:", err);
      setError("Erro ao salvar dados do perfil");
    }
  };

  const clearProfile = () => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem("profileData");
        localStorage.removeItem("token");
        localStorage.removeItem("admin_token");
      }
      setProfileData(null);
      setError(null);
    } catch (err) {
      console.error("Erro ao limpar perfil:", err);
      setError("Erro ao limpar dados do perfil");
    }
  };

  const updateProfile = (updatedData) => {
    const newProfileData = { ...profileData, ...updatedData };
    saveProfileToStorage(newProfileData);
  };

  useEffect(() => {
    loadProfileFromStorage();
  }, []);

  const isLoggedIn = profileData !== null && Object.keys(profileData).length > 0;

  const getUserData = () => profileData?.user || profileData;
  
  const getUserName = () => {
    const userData = getUserData();
    return userData?.nome || userData?.name || "Usuário";
  };
  
  const getUserEmail = () => {
    const userData = getUserData();
    return userData?.email || "";
  };
  
  const getUserId = () => {
    const userData = getUserData();
    return userData?.id || null;
  };
  
  const getUserRole = () => {
    const userData = getUserData();
    return userData?.role || userData?.tipo || "user";
  };

  const getToken = () => {
       if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const adminToken = localStorage.getItem('admin_token');
      const userToken = localStorage.getItem('token');
      return adminToken || userToken || null;
    }
    
    return null;
  };

  const getTokenType = () => {
    if (profileData?.tokenType) {
      return profileData.tokenType;
    }
    
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const adminToken = localStorage.getItem('admin_token');
      const userToken = localStorage.getItem('token');
      
      if (adminToken) return 'admin';
      if (userToken) return 'user';
    }
    
    return null;
  };

  const isAdmin = () => {
    const tokenType = getTokenType();
    const userRole = getUserRole();
    return tokenType === 'admin' || userRole === 'admin';
  };

  return {
    profileData,
    loading,
    error,
    isLoggedIn,
    saveProfile: saveProfileToStorage,
    updateProfile,
    clearProfile,
    loadProfile: loadProfileFromStorage,
    getUserName,
    getUserEmail,
    getUserId,
    getUserRole,
    getUserData,
    getToken,
    getTokenType,
    isAdmin,
  };
};
export default UseProfile;