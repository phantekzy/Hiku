const BASE_URL = "/api";

function getToken(): string | null {
  return localStorage.getItem("hiku_token");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {}
