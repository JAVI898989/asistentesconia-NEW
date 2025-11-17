import {
  auth as nhostAuth,
  graphql as nhostGraphql,
  storage as nhostStorage,
  NHOST_BASE_URL,
  NHOST_AUTH_URL,
} from "./nhost";

export type { SimpleAuthUser, AuthSession } from "./nhost";

export interface AuthError {
  code: string;
  message: string;
}

export interface CombinedUserProfile {
  auth: {
    id: string;
    email: string | null;
    display_name: string | null;
    default_role: string | null;
    locale?: string | null;
    metadata?: Record<string, any> | null;
  } | null;
  profile: {
    id: string;
    auth_id: string;
    email: string;
    display_name: string | null;
    role: string;
    subscription_status: string | null;
    subscription_tier: string | null;
    subscription_start_date: string | null;
    subscription_end_date: string | null;
    created_at: string;
    updated_at: string;
  } | null;
  subscriptions: Array<{
    id: string;
    tier: string;
    status: string;
    billing_cycle: string;
    created_at: string;
    updated_at: string;
  }>;
}

export const auth = nhostAuth;
export const gql = nhostGraphql;
export const storage = nhostStorage;

export const db = {
  _isNhost: true,
} as const;

export type FirebaseUser = import("./nhost").SimpleAuthUser;

type GraphqlVariables = Record<string, any> | undefined;

type GraphqlResponse<T> = T;

const mapUnknownError = (error: unknown): AuthError => {
  if (!error) {
    return { code: "unknown", message: "Error desconocido" };
  }
  if (error instanceof Error) {
    return { code: error.name || "error", message: error.message };
  }
  if (typeof error === "string") {
    return { code: "error", message: error };
  }
  try {
    return {
      code: "error",
      message: JSON.stringify(error),
    };
  } catch (stringifyError) {
    console.warn("⚠️ No se pudo serializar el error de autenticación", stringifyError);
    return {
      code: "error",
      message: "Error desconocido",
    };
  }
};

const requestGraphql = async <T>(query: string, variables?: GraphqlVariables): Promise<GraphqlResponse<T>> => {
  try {
    const response = await nhostGraphql.request(query, variables);
    return response as T;
  } catch (error) {
    console.error("❌ GraphQL error:", error);
    throw error;
  }
};

export const fetchUserData = async (authId: string): Promise<CombinedUserProfile | null> => {
  const profileData = await requestGraphql<{
    auth_users_by_pk: CombinedUserProfile["auth"] | null;
    users: NonNullable<CombinedUserProfile["profile"]>[];
  }>(
    `
      query GetUserProfile($authId: uuid!) {
        auth_users_by_pk(id: $authId) {
          id
          email
          display_name
          default_role
          locale
          metadata
        }
        users(where: { auth_id: { _eq: $authId } }, limit: 1) {
          id
          auth_id
          email
          display_name
          role
          subscription_status
          subscription_tier
          subscription_start_date
          subscription_end_date
          created_at
          updated_at
        }
      }
    `,
    { authId },
  );

  const authUser = profileData?.auth_users_by_pk ?? null;
  const profile = profileData?.users?.[0] ?? null;

  if (!authUser && !profile) {
    return null;
  }

  let subscriptions: CombinedUserProfile["subscriptions"] = [];

  if (profile?.id) {
    const subscriptionData = await requestGraphql<{
      subscriptions: CombinedUserProfile["subscriptions"];
    }>(
      `
        query GetUserActiveSubscriptions($userId: uuid!) {
          subscriptions(
            where: {
              user_id: { _eq: $userId }
              status: { _in: ["completed", "active"] }
            }
            order_by: { created_at: desc }
          ) {
            id
            tier
            status
            billing_cycle
            created_at
            updated_at
          }
        }
      `,
      { userId: profile.id },
    );

    subscriptions = subscriptionData?.subscriptions ?? [];
  }

  return {
    auth: authUser,
    profile,
    subscriptions,
  };
};

export const saveChatHistory = async (userId: string, assistantId: string, messages: any[]) => {
  const response = await requestGraphql<{
    insert_chat_history_one: { id: string } | null;
  }>(
    `
      mutation SaveChat(
        $user_id: uuid!
        $assistant_id: String!
        $messages: jsonb!
      ) {
        insert_chat_history_one(
          object: {
            user_id: $user_id
            assistant_id: $assistant_id
            messages: $messages
          }
          on_conflict: {
            constraint: chat_history_user_id_assistant_id_key
            update_columns: [messages, last_updated]
          }
        ) {
          id
        }
      }
    `,
    { user_id: userId, assistant_id: assistantId, messages },
  );

  return response.insert_chat_history_one;
};

export const fetchChatHistory = async (userId: string, assistantId: string) => {
  const response = await requestGraphql<{
    chat_history: Array<{ messages: any[] }>;
  }>(
    `
      query GetChatHistory($user_id: uuid!, $assistant_id: String!) {
        chat_history(
          where: {
            user_id: { _eq: $user_id }
            assistant_id: { _eq: $assistant_id }
          }
          limit: 1
        ) {
          messages
        }
      }
    `,
    { user_id: userId, assistant_id: assistantId },
  );

  return response?.chat_history?.[0]?.messages ?? [];
};

export const updateUserProgress = async (userId: string, assistantId: string, progressData: any) => {
  const response = await requestGraphql<{
    update_user_progress: { affected_rows: number } | null;
  }>(
    `
      mutation UpdateProgress(
        $user_id: uuid!
        $assistant_id: String!
        $data: user_progress_set_input!
      ) {
        update_user_progress(
          where: {
            _and: [
              { user_id: { _eq: $user_id } }
              { assistant_id: { _eq: $assistant_id } }
            ]
          }
          _set: $data
        ) {
          affected_rows
        }
      }
    `,
    {
      user_id: userId,
      assistant_id: assistantId,
      data: progressData,
    },
  );

  return response?.update_user_progress;
};

export const fetchAssistants = async () => {
  const response = await requestGraphql<{
    assistants: Array<{
      id: string;
      assistant_id: string;
      name: string;
      description: string | null;
      avatar_url: string | null;
      category: string | null;
      price_monthly: number | null;
      price_annual: number | null;
    }>;
  }>(
    `
      query GetAssistants {
        assistants(where: { status: { _eq: "active" } }) {
          id
          assistant_id
          name
          description
          avatar_url
          category
          price_monthly
          price_annual
        }
      }
    `,
  );

  return response?.assistants ?? [];
};

export const onAuthStateChanged = auth.onAuthStateChanged;
export const signOut = auth.signOut;
export const signIn = auth.signIn;
export const signUp = auth.signUp;
export const getCurrentUser = () => auth.user;
export const getAccessToken = auth.getAccessToken;
export const getDecodedClaims = auth.getDecodedClaims;
export const getSession = auth.getSession;

export const onAuthChange = (callback: (user: import("./nhost").SimpleAuthUser | null) => void) =>
  auth.onAuthStateChanged(callback);

export const logoutUser = async () => {
  const { error } = await auth.signOut();
  if (error) {
    throw mapUnknownError(error);
  }
};

export const loginUser = async (email: string, password: string) => {
  const { session, error } = await auth.signIn(email, password);
  if (error || !session) {
    throw mapUnknownError(error);
  }
  return session;
};

export const registerUser = async (email: string, password: string, displayName?: string) => {
  const { session, error } = await auth.signUp(email, password, displayName);
  if (error || !session) {
    throw mapUnknownError(error);
  }
  return session;
};

export const emergencyAuthReset = async () => {
  try {
    await auth.signOut();
  } finally {
    localStorage.removeItem("nhost_session");
  }
  return "✅ Sesión reiniciada y caché limpiada.";
};

const checkEndpoint = async (url: string) => {
  try {
    const response = await fetch(url, { method: "GET", mode: "cors" });
    return response.ok
      ? `✅ Endpoint alcanzable: ${url}`
      : `❌ Endpoint responde con estado ${response.status}: ${url}`;
  } catch (error: any) {
    return `❌ Error al consultar ${url}: ${error?.message || "desconocido"}`;
  }
};

export const quickNetworkFix = async () => {
  const report: string[] = [];
  report.push(navigator.onLine ? "✅ Conexión a internet detectada." : "❌ Sin conexión a internet.");
  if (!NHOST_BASE_URL) {
    report.push("❌ Falta configurar VITE_NHOST_BACKEND_URL o VITE_NHOST_SUBDOMAIN.");
    return report.join("\n");
  }
  report.push(await checkEndpoint(NHOST_BASE_URL));
  report.push(await checkEndpoint(`${NHOST_AUTH_URL}/healthz`));
  return report.join("\n");
};

export const diagnoseConnection = async () => {
  const report: string[] = [];
  report.push("🩺 Diagnóstico avanzado iniciado...");
  report.push(await quickNetworkFix());
  try {
    const pingStart = performance.now();
    await nhostGraphql.request("query HealthCheck { __typename }");
    const latency = Math.round(performance.now() - pingStart);
    report.push(`✅ GraphQL operativo (latencia ~${latency}ms).`);
  } catch (error: any) {
    report.push(`❌ Error en petición GraphQL: ${error?.message || "desconocido"}`);
  }
  return report.join("\n");
};
