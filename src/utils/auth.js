import { toast } from "react-toastify";

const TOKEN_KEY = "token";
const ADMIN_TOKEN_KEY = "admin_token";

const logoutAndRedirect = (message) => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_TOKEN_KEY);

  if (message) {
    toast.error(message);
  }

  window.location.href = "/login";
};

export const httpInterceptor = {
  request: (config) => {
    if (typeof window === "undefined") {
      return config;
    }

    const token =
      localStorage.getItem(TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY);

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        if (payload.exp && payload.exp < currentTime) {
          logoutAndRedirect("Sua sessão expirou. Redirecionando para login...");
          return Promise.reject(new Error("Token expirado"));
        }

        config.headers["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        console.error("Erro ao processar token:", error);
        logoutAndRedirect("Token inválido. Redirecionando para login...");
        return Promise.reject(new Error("Token inválido"));
      }
    }

    return config;
  },

  response: (response) => {
    return response;
  },

  responseError: (error) => {
    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    if (error.response) {
      const status = error.response.status;

      if (status === 401 || status === 403) {
        logoutAndRedirect("Sessão inválida. Faça login novamente.");
        return Promise.reject(error);
      }

      if (status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
      }
    } else if (error.request) {
      toast.error("Erro de conexão. Verifique sua internet.");
    }

    return Promise.reject(error);
  },
};

export const setupHttpInterceptors = (axiosInstance) => {
  if (axiosInstance?.interceptors) {
    axiosInstance.interceptors.request.use(httpInterceptor.request, (error) =>
      Promise.reject(error)
    );

    axiosInstance.interceptors.response.use(
      httpInterceptor.response,
      httpInterceptor.responseError
    );
  }
};

export function getUser() {
  if (typeof window === "undefined") {
    return null;
  }
  const token = localStorage.getItem("token") || localStorage.getItem("admin_token");
  if (token) {
    try {
      const payloadBase64 = token.split(".")[1];
      if (!payloadBase64) return null;
      return JSON.parse(atob(payloadBase64));
    } catch (e) {
      console.error("Erro ao decodificar o token:", e);
      return null;
    }
  }
  return null;
}

export function getUserIdFromToken() {
  const userPayload = getUser();
  if (userPayload) {
    return userPayload.id || userPayload.user_id || userPayload.sub || null;
  }
  return null;
}