import {
  db,
  safeFirebaseOperation,
  handleFirebaseError,
  getDomainAuthInstructions,
} from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  getDocs,
  addDoc,
  DocumentData,
  QueryConstraint,
} from "firebase/firestore";

// Enhanced Firestore wrapper that handles domain authorization issues
class FirestoreWrapper {
  private isConnected: boolean = false;
  private connectionTested: boolean = false;

  async testConnection(): Promise<boolean> {
    if (this.connectionTested) {
      return this.isConnected;
    }

    try {
      if (!db || db === null) {
        console.error("❌ Firestore not initialized");
        this.isConnected = false;
        this.connectionTested = true;
        return false;
      }

      console.log("🔍 Testing Firestore connection...");

      // Try a simple read operation
      const testDoc = doc(db, "test", "connection");
      await getDoc(testDoc);

      console.log("✅ Firestore connection successful");
      this.isConnected = true;
      this.connectionTested = true;
      return true;
    } catch (error: any) {
      console.error("❌ Firestore connection test failed:", error);
      this.isConnected = false;
      this.connectionTested = true;
      return false;
    }
  }

  async getDocument(
    collectionName: string,
    documentId: string,
  ): Promise<DocumentData | null> {
    const isConnected = await this.testConnection();

    if (!isConnected) {
      console.warn("🔄 Firestore not connected, returning null");
      return null;
    }

    return safeFirebaseOperation(async () => {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    });
  }

  async setDocument(
    collectionName: string,
    documentId: string,
    data: DocumentData,
  ): Promise<boolean> {
    const isConnected = await this.testConnection();

    if (!isConnected) {
      console.warn("🔄 Firestore not connected, operation skipped");
      return false;
    }

    try {
      await safeFirebaseOperation(async () => {
        const docRef = doc(db, collectionName, documentId);
        await setDoc(docRef, data);
      });
      return true;
    } catch (error) {
      console.error("Failed to set document:", error);
      return false;
    }
  }

  async updateDocument(
    collectionName: string,
    documentId: string,
    data: Partial<DocumentData>,
  ): Promise<boolean> {
    const isConnected = await this.testConnection();

    if (!isConnected) {
      console.warn("🔄 Firestore not connected, operation skipped");
      return false;
    }

    try {
      await safeFirebaseOperation(async () => {
        const docRef = doc(db, collectionName, documentId);
        await updateDoc(docRef, data);
      });
      return true;
    } catch (error) {
      console.error("Failed to update document:", error);
      return false;
    }
  }

  async deleteDocument(
    collectionName: string,
    documentId: string,
  ): Promise<boolean> {
    const isConnected = await this.testConnection();

    if (!isConnected) {
      console.warn("🔄 Firestore not connected, operation skipped");
      return false;
    }

    try {
      await safeFirebaseOperation(async () => {
        const docRef = doc(db, collectionName, documentId);
        await deleteDoc(docRef);
      });
      return true;
    } catch (error) {
      console.error("Failed to delete document:", error);
      return false;
    }
  }

  async getCollection(
    collectionName: string,
    ...queryConstraints: QueryConstraint[]
  ): Promise<DocumentData[]> {
    const isConnected = await this.testConnection();

    if (!isConnected) {
      console.warn("🔄 Firestore not connected, returning empty array");
      return [];
    }

    return (
      safeFirebaseOperation(async () => {
        const collectionRef = collection(db, collectionName);
        const q = query(collectionRef, ...queryConstraints);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }) || []
    );
  }

  async addDocument(
    collectionName: string,
    data: DocumentData,
  ): Promise<string | null> {
    const isConnected = await this.testConnection();

    if (!isConnected) {
      console.warn("🔄 Firestore not connected, operation skipped");
      return null;
    }

    try {
      const result = await safeFirebaseOperation(async () => {
        const collectionRef = collection(db, collectionName);
        const docRef = await addDoc(collectionRef, data);
        return docRef.id;
      });
      return result || null;
    } catch (error) {
      console.error("Failed to add document:", error);
      return null;
    }
  }

  // Get connection status
  getConnectionStatus(): { connected: boolean; tested: boolean } {
    return {
      connected: this.isConnected,
      tested: this.connectionTested,
    };
  }

  // Reset connection status (useful for retrying)
  resetConnection(): void {
    this.isConnected = false;
    this.connectionTested = false;
  }
}

// Export singleton instance
export const firestoreWrapper = new FirestoreWrapper();

// Convenience exports for common operations
export const getDoc_ = (collection: string, id: string) =>
  firestoreWrapper.getDocument(collection, id);

export const setDoc_ = (collection: string, id: string, data: DocumentData) =>
  firestoreWrapper.setDocument(collection, id, data);

export const updateDoc_ = (
  collection: string,
  id: string,
  data: Partial<DocumentData>,
) => firestoreWrapper.updateDocument(collection, id, data);

export const deleteDoc_ = (collection: string, id: string) =>
  firestoreWrapper.deleteDocument(collection, id);

export const getCollection_ = (
  collection: string,
  ...constraints: QueryConstraint[]
) => firestoreWrapper.getCollection(collection, ...constraints);

export const addDoc_ = (collection: string, data: DocumentData) =>
  firestoreWrapper.addDocument(collection, data);
