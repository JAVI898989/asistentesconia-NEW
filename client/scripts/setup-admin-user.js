import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBNPWw8qs9hWDK0GlY0gGLcnKlJlHq3GG8",
  authDomain: "temarios-oposiciones.firebaseapp.com",
  projectId: "temarios-oposiciones",
  storageBucket: "temarios-oposiciones.appspot.com",
  messagingSenderId: "1008901921444",
  appId: "1:1008901921444:web:e85e0d0b0f0e7b97b8e4d8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setupAdminUser() {
  try {
    // Set up admin user - replace with actual user ID
    const userId = "vhgGZ5lJsdN9g8OOxz7TE3KSe0n2"; // Current user from logs
    
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      email: "admin@example.com", // Replace with actual email
      role: "admin",
      roles: ["admin"],
      isAdmin: true,
      adminSince: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });

    console.log("✅ Admin user setup completed");
    console.log("🔧 User ID:", userId);
    console.log("👑 Role: admin");
    
  } catch (error) {
    console.error("❌ Error setting up admin user:", error);
  }
}

// Export for use
export { setupAdminUser };

// Run if this script is executed directly
if (typeof window === 'undefined') {
  setupAdminUser().then(() => process.exit(0));
}
