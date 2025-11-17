import axios from 'axios';

const NHOST_SUBDOMAIN = process.env.NHOST_SUBDOMAIN || 'xxxhgktsthejyofspck';
const NHOST_REGION = process.env.NHOST_REGION || 'eu-central-1';
const NHOST_ADMIN_SECRET = process.env.NHOST_ADMIN_SECRET || 'admin_secret_asistentesconia_2025';

export const NHOST_GRAPHQL_URL = `https://${NHOST_SUBDOMAIN}.graphql.${NHOST_REGION}.nhost.run/v1/graphql`;
export const NHOST_AUTH_URL = `https://${NHOST_SUBDOMAIN}.auth.${NHOST_REGION}.nhost.run`;
export const NHOST_STORAGE_URL = `https://${NHOST_SUBDOMAIN}.storage.${NHOST_REGION}.nhost.run`;

// GraphQL client
export const graphqlRequest = async (query: string, variables?: any) => {
  try {
    const response = await axios.post(
      NHOST_GRAPHQL_URL,
      {
        query,
        variables,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': NHOST_ADMIN_SECRET,
        },
      }
    );

    if (response.data.errors) {
      console.error('GraphQL Error:', response.data.errors);
      throw new Error(`GraphQL Error: ${response.data.errors[0].message}`);
    }

    return response.data.data;
  } catch (error) {
    console.error('GraphQL Request Error:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId: string) => {
  const data = await graphqlRequest(
    `
      query GetUser($id: uuid!) {
        users(where: { id: { _eq: $id } }) {
          id
          email
          display_name
          role
          subscription_status
          subscription_tier
          created_at
        }
      }
    `,
    { id: userId }
  );
  return data.users?.[0];
};

// Get user by email
export const getUserByEmail = async (email: string) => {
  const data = await graphqlRequest(
    `
      query GetUserByEmail($email: String!) {
        users(where: { email: { _eq: $email } }) {
          id
          email
          display_name
          role
          subscription_status
          subscription_tier
          created_at
        }
      }
    `,
    { email }
  );
  return data.users?.[0];
};

// Create or update user
export const createOrUpdateUser = async (
  authId: string,
  email: string,
  displayName?: string,
  role: string = 'alumno'
) => {
  const data = await graphqlRequest(
    `
      mutation CreateUser(
        $auth_id: uuid!
        $email: String!
        $display_name: String
        $role: String!
      ) {
        insert_users_one(
          object: {
            auth_id: $auth_id
            email: $email
            display_name: $display_name
            role: $role
          }
          on_conflict: {
            constraint: users_email_key
            update_columns: [display_name, role]
          }
        ) {
          id
          email
          role
        }
      }
    `,
    { auth_id: authId, email, display_name: displayName, role }
  );
  return data.insert_users_one;
};

// Update user subscription
export const updateUserSubscription = async (
  userId: string,
  tier: string,
  billingCycle: string,
  status: string
) => {
  const data = await graphqlRequest(
    `
      mutation UpdateSubscription(
        $id: uuid!
        $tier: String!
        $status: String!
        $start_date: timestamptz!
      ) {
        update_users(
          where: { id: { _eq: $id } }
          _set: {
            subscription_tier: $tier
            subscription_status: $status
            subscription_start_date: $start_date
          }
        ) {
          affected_rows
        }
      }
    `,
    {
      id: userId,
      tier,
      status,
      start_date: new Date().toISOString(),
    }
  );
  return data.update_users;
};

// Get assistants
export const getAssistants = async () => {
  const data = await graphqlRequest(
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
    `
  );
  return data.assistants || [];
};

// Create subscription record
export const createSubscription = async (
  userId: string,
  tier: string,
  billingCycle: string,
  amount: number,
  stripeSessionId?: string,
  stripeCustomerId?: string
) => {
  const data = await graphqlRequest(
    `
      mutation CreateSubscription(
        $user_id: uuid!
        $tier: String!
        $billing_cycle: String!
        $amount: Int!
        $stripe_session_id: String
        $stripe_customer_id: String
      ) {
        insert_subscriptions_one(
          object: {
            user_id: $user_id
            tier: $tier
            billing_cycle: $billing_cycle
            amount: $amount
            stripe_session_id: $stripe_session_id
            stripe_customer_id: $stripe_customer_id
            status: "pending"
          }
        ) {
          id
          status
        }
      }
    `,
    {
      user_id: userId,
      tier,
      billing_cycle: billingCycle,
      amount,
      stripe_session_id: stripeSessionId,
      stripe_customer_id: stripeCustomerId,
    }
  );
  return data.insert_subscriptions_one;
};

// Update subscription status
export const updateSubscriptionStatus = async (
  subscriptionId: string,
  status: string
) => {
  const data = await graphqlRequest(
    `
      mutation UpdateSubscription($id: uuid!, $status: String!) {
        update_subscriptions(
          where: { id: { _eq: $id } }
          _set: { status: $status }
        ) {
          affected_rows
        }
      }
    `,
    { id: subscriptionId, status }
  );
  return data.update_subscriptions;
};

// Verify JWT token
export const verifyAuthToken = async (token: string) => {
  try {
    const response = await axios.get(
      `${NHOST_AUTH_URL}/user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

// Extract user ID from auth header
export const getUserIdFromRequest = (req: any): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.replace('Bearer ', '');
  // The token is a JWT, but we can extract user ID from headers
  // For now, rely on x-user-id header that should be set by Nhost middleware
  return req.headers['x-user-id'] || null;
};

export default {
  graphqlRequest,
  getUserById,
  getUserByEmail,
  createOrUpdateUser,
  updateUserSubscription,
  getAssistants,
  createSubscription,
  updateSubscriptionStatus,
  verifyAuthToken,
  getUserIdFromRequest,
};
