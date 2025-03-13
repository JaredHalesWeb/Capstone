import axios from "axios";

// For localStorage or sessionStorage
export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function getCurrentUser() {
  // If token is stored, decode or store relevant user info from login
  const token = getToken();
  if (!token) return null;
  try {
    // You could decode the JWT and store user info, or store user object in localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    return user;
  } catch (e) {
    return null;
  }
}

export async function login(username, password) {
  const response = await axios.post("/api/auth/login", { username, password });
  return response.data; 
}

export async function register(data) {
  const response = await axios.post("/api/auth/register", data);
  return response.data;
}
