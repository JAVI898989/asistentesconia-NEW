let db: any;

async function getFirestore() {
  if (!db) {
    const { initializeApp } = await import("firebase/app");
    const { getFirestore } = await import("firebase/firestore");

    const firebaseConfig = {
      apiKey: "AIzaSyDFP6aKC1xqvwJ1-e8xRl_K-mTKPgKGhFQ",
      authDomain: "cursor-64188.firebaseapp.com", 
      projectId: "cursor-64188",
      storageBucket: "cursor-64188.firebasestorage.app",
      messagingSenderId: "90000000000",
      appId: "1:90000000000:web:abcdef123456789",
    };

    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
  return db;
}

export async function validateReferralCode(code: string, buyerUserId: string): Promise<{
  isValid: boolean;
  referrerUserId?: string;
  referrerRole?: 'alumno' | 'academia';
  error?: string;
}> {
  try {
    const db = await getFirestore();
    const { doc, getDoc } = await import("firebase/firestore");

    // Normalize code
    const normalizedCode = code.trim().toUpperCase();

    // Get referral code document
    const codeRef = doc(db, 'referral_codes', normalizedCode);
    const codeSnap = await getDoc(codeRef);

    if (!codeSnap.exists()) {
      return { isValid: false, error: 'Código de referidos no encontrado' };
    }

    const codeData = codeSnap.data();

    // Check if code is active
    if (codeData.status !== 'active') {
      return { isValid: false, error: 'Código de referidos inactivo' };
    }

    // Prevent self-referral
    if (codeData.ownerUserId === buyerUserId) {
      return { isValid: false, error: 'No puedes usar tu propio código de referidos' };
    }

    // Get referrer user data
    const userRef = doc(db, 'users', codeData.ownerUserId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { isValid: false, error: 'Usuario referidor no encontrado' };
    }

    const userData = userSnap.data();

    return {
      isValid: true,
      referrerUserId: codeData.ownerUserId,
      referrerRole: userData.role || codeData.ownerRole,
    };

  } catch (error) {
    console.error('Error validating referral code:', error);
    return { isValid: false, error: 'Error al validar código de referidos' };
  }
}
