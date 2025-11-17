import { useEffect, useState } from "react";
import { auth, gql } from "@/lib/simpleAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminInit() {
  const [isLoading, setIsLoading] = useState(false);
  const [adminCreated, setAdminCreated] = useState(false);

  // Check if admin already exists
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await gql.request(
          `
            query CheckAdmin {
              users(where: { role: { _eq: "admin" } }) {
                id
              }
            }
          `
        );
        if (response.data?.users?.length > 0) {
          setAdminCreated(true);
        }
      } catch (error) {
        console.error("Error checking admin:", error);
      }
    };

    checkAdmin();
  }, []);

  const createAdminUser = async () => {
    setIsLoading(true);
    try {
      // Step 1: Sign up the admin user with Nhost Auth
      const signUpResponse = await auth.signUp({
        email: "admin@admin.com",
        password: "admin123",
        options: {
          displayName: "Admin",
        },
      });

      if (!signUpResponse.session) {
        throw new Error("Failed to create auth user");
      }

      const authUserId = signUpResponse.session.user.id;

      // Step 2: Create the user record in the database
      const createUserResponse = await gql.request(
        `
          mutation CreateAdmin($auth_id: uuid!, $email: String!, $role: String!) {
            insert_users_one(
              object: {
                auth_id: $auth_id
                email: $email
                display_name: "Admin"
                role: $role
              }
            ) {
              id
              email
              role
            }
          }
        `,
        {
          auth_id: authUserId,
          email: "admin@admin.com",
          role: "admin",
        }
      );

      if (createUserResponse.data?.insert_users_one) {
        setAdminCreated(true);
        toast.success("Admin user created: admin@admin.com / admin123");
      } else {
        throw new Error("Failed to create user record");
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to create admin: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (adminCreated) {
    return (
      <div className="p-4 bg-green-50 text-green-800 rounded">
        ✅ Admin user already exists (admin@admin.com)
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-50 text-blue-800 rounded space-y-3">
      <p>Admin user not found. Click below to create it:</p>
      <Button
        onClick={createAdminUser}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? "Creating..." : "Create Admin User"}
      </Button>
      <p className="text-sm text-blue-700">
        Email: admin@admin.com | Password: admin123
      </p>
    </div>
  );
}
