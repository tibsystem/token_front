"use client";

import { useEffect, useState } from "react";

const UseProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfileFromStorage = () => {
    try {
      const storedData = localStorage.getItem("profileData");
      if (storedData && storedData !== "{}") {
        const parsedData = JSON.parse(storedData);
        setProfileData(parsedData);
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
      localStorage.setItem("profileData", JSON.stringify(data));
      setProfileData(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao salvar perfil no localStorage:", err);
      setError("Erro ao salvar dados do perfil");
    }
  };

  const clearProfile = () => {
    try {
      localStorage.removeItem("profileData");
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

  const getToken = () => profileData?.token || null;

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
  };
};

export default UseProfile;