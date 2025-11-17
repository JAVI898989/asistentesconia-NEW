import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Firebase Collections Structure
export const COLLECTIONS = {
  ASSISTANTS: "asistentes",
  COURSES: "cursos",
  USERS: "usuarios",
  USER_PROGRESS: "progreso_usuarios",
  TEST_RESULTS: "resultados_tests",
  FINAL_EXAMS: "examenes_finales",
  CERTIFICATES: "certificados",
  PAYMENTS: "pagos",
  SUBSCRIPTIONS: "suscripciones",
} as const;

// Types for Firebase documents
export interface AssistantDocument {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  isPublic: boolean;
  isPaid?: boolean;
  monthlyPrice?: number;
  contextPrompt: string; // For chat restrictions
  createdAt: any;
  updatedAt: any;
}

export interface CourseDocument {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  isPaid: boolean;
  price?: number;
  totalThemes: number;
  estimatedHours: number;
  createdAt: any;
  updatedAt: any;
}

export interface UserProgressDocument {
  id: string;
  userId: string;
  assistantId?: string;
  courseId?: string;
  type: "assistant" | "course";
  completedTests: Record<string, number>; // themeId -> score (0-10)
  flashcardsProgress: Record<string, number>; // themeId -> completed count
  finalExamScore?: number;
  finalExamPassed?: boolean;
  finalExamAttempts: number;
  certificateId?: string;
  lastActivity: any;
  createdAt: any;
  updatedAt: any;
}

export interface TestResultDocument {
  id: string;
  userId: string;
  assistantId?: string;
  courseId?: string;
  themeId: string;
  score: number; // 0-10
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // seconds
  answers: Record<string, number>; // questionId -> selectedOption
  createdAt: any;
}

export interface FinalExamDocument {
  id: string;
  userId: string;
  assistantId?: string;
  courseId?: string;
  score: number; // 0-10
  passed: boolean; // score >= 8
  timeSpent: number; // seconds
  answers: Record<string, number>;
  attemptNumber: number;
  createdAt: any;
}

export interface CertificateDocument {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  assistantId?: string;
  courseId?: string;
  assistantName?: string;
  courseName?: string;
  type: "assistant" | "course";
  finalScore: number;
  completionDate: any;
  certificateUrl?: string; // PDF download URL
  isValid: boolean;
  generatedBy: "system" | "admin";
  createdAt: any;
}

export interface PaymentDocument {
  id: string;
  userId: string;
  userEmail: string;
  assistantId?: string;
  courseId?: string;
  type: "assistant_subscription" | "course_purchase";
  amount: number; // in euros
  currency: "EUR";
  status: "pending" | "completed" | "failed" | "cancelled";
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: any;
  updatedAt: any;
}

export interface SubscriptionDocument {
  id: string;
  userId: string;
  assistantId: string;
  status: "active" | "inactive" | "cancelled" | "expired";
  startDate: any;
  endDate: any;
  monthlyPrice: number;
  lastPaymentDate?: any;
  nextPaymentDate?: any;
  stripeSubscriptionId?: string;
  createdAt: any;
  updatedAt: any;
}

// Helper functions for Firebase operations
export const saveUserProgress = async (
  progress: Omit<UserProgressDocument, "id" | "createdAt" | "updatedAt">,
) => {
  try {
    const progressRef = collection(db, COLLECTIONS.USER_PROGRESS);
    const docRef = await addDoc(progressRef, {
      ...progress,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("✅ User progress saved:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error saving user progress:", error);
    throw error;
  }
};

export const updateUserProgress = async (
  progressId: string,
  updates: Partial<UserProgressDocument>,
) => {
  try {
    const progressRef = doc(db, COLLECTIONS.USER_PROGRESS, progressId);
    await updateDoc(progressRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    console.log("✅ User progress updated:", progressId);
  } catch (error) {
    console.error("❌ Error updating user progress:", error);
    throw error;
  }
};

export const saveTestResult = async (
  result: Omit<TestResultDocument, "id" | "createdAt">,
) => {
  try {
    const resultsRef = collection(db, COLLECTIONS.TEST_RESULTS);
    const docRef = await addDoc(resultsRef, {
      ...result,
      createdAt: serverTimestamp(),
    });
    console.log("✅ Test result saved:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error saving test result:", error);
    throw error;
  }
};

export const saveFinalExamResult = async (
  exam: Omit<FinalExamDocument, "id" | "createdAt">,
) => {
  try {
    const examsRef = collection(db, COLLECTIONS.FINAL_EXAMS);
    const docRef = await addDoc(examsRef, {
      ...exam,
      createdAt: serverTimestamp(),
    });
    console.log("✅ Final exam result saved:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error saving final exam result:", error);
    throw error;
  }
};

export const generateCertificate = async (
  certificate: Omit<CertificateDocument, "id" | "createdAt">,
) => {
  try {
    const certificatesRef = collection(db, COLLECTIONS.CERTIFICATES);
    const docRef = await addDoc(certificatesRef, {
      ...certificate,
      createdAt: serverTimestamp(),
    });
    console.log("✅ Certificate generated:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error generating certificate:", error);
    throw error;
  }
};

export const getUserProgress = async (
  userId: string,
  assistantId?: string,
  courseId?: string,
) => {
  try {
    const progressRef = collection(db, COLLECTIONS.USER_PROGRESS);
    let q;

    if (assistantId) {
      q = query(
        progressRef,
        where("userId", "==", userId),
        where("assistantId", "==", assistantId),
        where("type", "==", "assistant"),
      );
    } else if (courseId) {
      q = query(
        progressRef,
        where("userId", "==", userId),
        where("courseId", "==", courseId),
        where("type", "==", "course"),
      );
    } else {
      q = query(progressRef, where("userId", "==", userId));
    }

    const querySnapshot = await getDocs(q);
    const progress = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as UserProgressDocument[];

    return progress[0] || null; // Return first match or null
  } catch (error) {
    console.error("❌ Error getting user progress:", error);
    return null;
  }
};

export const getTestResults = async (
  userId: string,
  assistantId?: string,
  courseId?: string,
) => {
  try {
    const resultsRef = collection(db, COLLECTIONS.TEST_RESULTS);
    let q;

    if (assistantId) {
      q = query(
        resultsRef,
        where("userId", "==", userId),
        where("assistantId", "==", assistantId),
        orderBy("createdAt", "desc"),
      );
    } else if (courseId) {
      q = query(
        resultsRef,
        where("userId", "==", userId),
        where("courseId", "==", courseId),
        orderBy("createdAt", "desc"),
      );
    } else {
      q = query(
        resultsRef,
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TestResultDocument[];
  } catch (error) {
    console.error("❌ Error getting test results:", error);
    return [];
  }
};

export const getUserCertificates = async (userId: string) => {
  try {
    const certificatesRef = collection(db, COLLECTIONS.CERTIFICATES);
    const q = query(
      certificatesRef,
      where("userId", "==", userId),
      where("isValid", "==", true),
      orderBy("createdAt", "desc"),
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CertificateDocument[];
  } catch (error) {
    console.error("❌ Error getting certificates:", error);
    return [];
  }
};

export const checkFinalExamEligibility = async (
  userId: string,
  assistantId?: string,
  courseId?: string,
) => {
  try {
    const testResults = await getTestResults(userId, assistantId, courseId);

    // Group by theme and get highest score for each
    const themeScores: Record<string, number> = {};
    testResults.forEach((result) => {
      if (
        !themeScores[result.themeId] ||
        themeScores[result.themeId] < result.score
      ) {
        themeScores[result.themeId] = result.score;
      }
    });

    // Count themes with score >= 8
    const passedThemes = Object.values(themeScores).filter(
      (score) => score >= 8,
    ).length;
    const totalThemes = Object.keys(themeScores).length;

    // For eligibility, user needs to pass all available themes (minimum 20 for full courses)
    const isEligible =
      passedThemes >= Math.min(totalThemes, 20) && passedThemes >= 20;

    return {
      isEligible,
      passedThemes,
      totalThemes,
      themeScores,
    };
  } catch (error) {
    console.error("❌ Error checking final exam eligibility:", error);
    return {
      isEligible: false,
      passedThemes: 0,
      totalThemes: 0,
      themeScores: {},
    };
  }
};
