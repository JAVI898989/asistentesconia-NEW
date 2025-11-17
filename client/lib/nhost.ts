// Nhost client implementation using fetch API
// No external dependencies required

const rawBackendUrl = import.meta.env.VITE_NHOST_BACKEND_URL?.replace(/\/$/, "");
const NHOST_SUBDOMAIN = import.meta.env.VITE_NHOST_SUBDOMAIN;
const NHOST_REGION = import.meta.env.VITE_NHOST_REGION;

const derivedBaseUrl = (() => {
  if (rawBackendUrl) {
    return rawBackendUrl;
  }
  if (NHOST_SUBDOMAIN) {
    const regionSegment = NHOST_REGION ? `.${NHOST_REGION}` : "";
    return `https://${NHOST_SUBDOMAIN}${regionSegment}.nhost.run`;
  }
  console.warn(
    "⚠️ VITE_NHOST_BACKEND_URL o VITE_NHOST_SUBDOMAIN no están definidos. Configura tus variables de entorno de Nhost.",
  );
  return "";
})();

export const NHOST_BASE_URL = derivedBaseUrl;
export const NHOST_AUTH_URL = `${NHOST_BASE_URL}/v1/auth`;
export const NHOST_GRAPHQL_URL = `${NHOST_BASE_URL}/v1/graphql`;
export const NHOST_STORAGE_URL = `${NHOST_BASE_URL}/v1/storage`;
export const NHOST_FUNCTIONS_URL = `${NHOST_BASE_URL}/v1/functions`;

const SESSION_STORAGE_KEY = "nhost_session";

export interface SimpleAuthUser {
  id: string;
  uid: string;
  email: string | null;
  displayName?: string | null;
  defaultRole?: string | null;
  roles?: string[];
  metadata?: Record<string, any> | null;
}

export interface AuthSession {
  user: SimpleAuthUser;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: number | null;
}

type RawNhostSession = {
  accessToken: string;
  accessTokenExpiresIn?: number;
  refreshToken?: string | null;
  user: Record<string, any>;
};

let currentSession: AuthSession | null = null;
let authStateCallbacks: Array<(user: SimpleAuthUser | null) => void> = [];
let refreshPromise: Promise<AuthSession | null> | null = null;

const toSimpleUser = (user: Record<string, any>): SimpleAuthUser => ({
  id: user.id,
  uid: user.id,
  email: user.email ?? null,
  displayName: user.displayName ?? user.locale ?? null,
  defaultRole: user.defaultRole ?? user.default_role ?? null,
  roles:
    user.roles ??
    user.allowedRoles ??
    user["x-hasura-allowed-roles"] ??
    user?.metadata?.roles ??
    null,
  metadata: user.metadata ?? null,
});

const buildSession = (payload: { session?: RawNhostSession } | RawNhostSession | null): AuthSession | null => {
  if (!payload) return null;
  const session = "session" in payload ? payload.session : payload;
  if (!session || !session.accessToken || !session.user) {
    return null;
  }

  const expiresInMs = session.accessTokenExpiresIn
    ? session.accessTokenExpiresIn * 1000
    : null;

  return {
    user: toSimpleUser(session.user),
    accessToken: session.accessToken,
    refreshToken: session.refreshToken ?? null,
    expiresAt: expiresInMs ? Date.now() + expiresInMs : null,
  };
};

const persistSession = (session: AuthSession | null) => {
  if (!session) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

const emitAuthChange = () => {
  authStateCallbacks.forEach((cb) => cb(auth.user));
  window.dispatchEvent(
    new CustomEvent("authStateChanged", { detail: auth.user }),
  );
};

const restoreSession = () => {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return;
    const parsed: AuthSession = JSON.parse(stored);
    currentSession = parsed;
    auth.user = parsed.user;
  } catch (error) {
    console.warn("⚠️ No se pudo restaurar la sesión de Nhost:", error);
    currentSession = null;
    auth.user = null;
  }
};

const decodeJwtPayload = (token: string) => {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded);
  } catch (error) {
    console.warn("⚠️ No se pudo decodificar el token de Nhost:", error);
    return null;
  }
};

const ensureValidSession = async (): Promise<AuthSession | null> => {
  if (!currentSession) return null;
  if (!currentSession.expiresAt || currentSession.expiresAt > Date.now() + 15000) {
    return currentSession;
  }

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = refreshSession();
  const refreshed = await refreshPromise;
  refreshPromise = null;
  return refreshed;
};

const refreshSession = async (): Promise<AuthSession | null> => {
  if (!currentSession?.refreshToken) {
    signOutLocally();
    return null;
  }

  try {
    const response = await fetch(`${NHOST_AUTH_URL}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: currentSession.refreshToken }),
    });

    if (!response.ok) {
      throw new Error("No se pudo refrescar la sesión de Nhost");
    }

    const data = await response.json();
    const session = buildSession(data);
    if (!session) {
      throw new Error("Respuesta de refresh inválida");
    }

    currentSession = session;
    auth.user = session.user;
    persistSession(session);
    emitAuthChange();
    return session;
  } catch (error) {
    console.error("❌ Error refrescando la sesión de Nhost:", error);
    signOutLocally();
    return null;
  }
};

const signOutLocally = () => {
  currentSession = null;
  auth.user = null;
  persistSession(null);
  emitAuthChange();
};

restoreSession();

const parseErrorMessage = async (response: Response) => {
  try {
    const data = await response.json();
    return data?.error || data?.message || response.statusText;
  } catch (error) {
    return response.statusText;
  }
};

export const auth = {
  user: currentSession?.user ?? null as SimpleAuthUser | null,

  getSession: async () => {
    await ensureValidSession();
    return currentSession;
  },

  getAccessToken: async (options?: { forceRefresh?: boolean }) => {
    if (!currentSession) return null;
    if (options?.forceRefresh) {
      await refreshSession();
    } else {
      await ensureValidSession();
    }
    return currentSession?.accessToken ?? null;
  },

  getDecodedClaims: async (options?: { forceRefresh?: boolean }) => {
    const token = await auth.getAccessToken(options);
    if (!token) return null;
    return decodeJwtPayload(token);
  },

  onAuthStateChanged: (callback: (user: SimpleAuthUser | null) => void) => {
    authStateCallbacks.push(callback);
    callback(auth.user);
    return () => {
      authStateCallbacks = authStateCallbacks.filter((cb) => cb !== callback);
    };
  },

  signUp: async (email: string, password: string, displayName?: string) => {
    try {
      const response = await fetch(`${NHOST_AUTH_URL}/sign-up/email-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          options: {
            displayName,
          },
        }),
      });

      if (!response.ok) {
        const message = await parseErrorMessage(response);
        throw new Error(message || "No se pudo crear la cuenta");
      }

      const data = await response.json();
      const session = buildSession(data);
      if (!session) {
        throw new Error("Respuesta de registro inválida");
      }

      currentSession = session;
      auth.user = session.user;
      persistSession(session);
      emitAuthChange();

      return { session, error: null };
    } catch (error) {
      console.error("❌ Error registrando usuario en Nhost:", error);
      return { session: null, error };
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const response = await fetch(`${NHOST_AUTH_URL}/sign-in/email-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const message = await parseErrorMessage(response);
        throw new Error(message || "Credenciales incorrectas");
      }

      const data = await response.json();
      const session = buildSession(data);
      if (!session) {
        throw new Error("Respuesta de login inválida");
      }

      currentSession = session;
      auth.user = session.user;
      persistSession(session);
      emitAuthChange();

      return { session, error: null };
    } catch (error) {
      console.error("❌ Error iniciando sesión en Nhost:", error);
      return { session: null, error };
    }
  },

  signOut: async () => {
    try {
      if (currentSession?.accessToken) {
        await fetch(`${NHOST_AUTH_URL}/signout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentSession.accessToken}`,
          },
        });
      }
    } catch (error) {
      console.warn("⚠️ Error al cerrar sesión en Nhost (continuando):", error);
    } finally {
      signOutLocally();
      return { error: null };
    }
  },
};

// GraphQL client
export const graphql = {
  request: async (query: string, variables?: any) => {
    try {
      await ensureValidSession();

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (currentSession?.accessToken) {
        headers.Authorization = `Bearer ${currentSession.accessToken}`;
      }

      const response = await fetch(NHOST_GRAPHQL_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        const message = await parseErrorMessage(response);
        throw new Error(message || "Error en petición GraphQL");
      }

      const data = await response.json();

      if (data.errors) {
        console.error("GraphQL Error:", data.errors);
        throw new Error(data.errors[0]?.message || "GraphQL desconocido");
      }

      return data.data;
    } catch (error) {
      console.error("GraphQL Request Error:", error);
      throw error;
    }
  },
};

// Storage client
export const storage = {
  upload: async (bucketName: string, fileName: string, file: File) => {
    try {
      await ensureValidSession();

      const formData = new FormData();
      formData.append("file", file, fileName);

      const headers: Record<string, string> = {};
      if (currentSession?.accessToken) {
        headers.Authorization = `Bearer ${currentSession.accessToken}`;
      }

      const response = await fetch(
        `${NHOST_STORAGE_URL}/files?bucket_id=${encodeURIComponent(bucketName)}`,
        {
          method: "POST",
          headers,
          body: formData,
        },
      );

      if (!response.ok) {
        const message = await parseErrorMessage(response);
        throw new Error(message || "Error subiendo archivo a Nhost");
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error en upload de Nhost Storage:", error);
      return { data: null, error };
    }
  },

  delete: async (bucketName: string, fileId: string) => {
    try {
      await ensureValidSession();

      const headers: Record<string, string> = {};
      if (currentSession?.accessToken) {
        headers.Authorization = `Bearer ${currentSession.accessToken}`;
      }

      const response = await fetch(
        `${NHOST_STORAGE_URL}/files/${encodeURIComponent(fileId)}?bucket_id=${encodeURIComponent(bucketName)}`,
        {
          method: "DELETE",
          headers,
        },
      );

      if (!response.ok) {
        const message = await parseErrorMessage(response);
        throw new Error(message || "Error eliminando archivo en Nhost");
      }

      return { error: null };
    } catch (error) {
      console.error("❌ Error en delete de Nhost Storage:", error);
      return { error };
    }
  },
};

export default {
  auth,
  graphql,
  storage,
};
