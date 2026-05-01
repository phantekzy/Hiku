const BASE_URL = "/api";

function getToken(): string | null {
  return localStorage.getItem("hiku_token");
}
