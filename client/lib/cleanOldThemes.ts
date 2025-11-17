// Clean old localStorage themes that were created as placeholders
export const cleanOldLocalStorageThemes = () => {
  try {
    console.log("🧹 Cleaning old localStorage themes...");
    
    // Get all localStorage keys
    const keys = Object.keys(localStorage);
    let cleaned = 0;
    
    // Remove curriculum-related localStorage items
    keys.forEach(key => {
      if (
        key.startsWith('curriculum_') ||
        key.startsWith('ai_generated_content_') ||
        key.startsWith('ai_content_index') ||
        key.startsWith('generated_content_')
      ) {
        localStorage.removeItem(key);
        cleaned++;
      }
    });
    
    console.log(`✅ Cleaned ${cleaned} old theme entries from localStorage`);
    return cleaned;
  } catch (error) {
    console.error("Error cleaning localStorage:", error);
    return 0;
  }
};

// Initialize cleanup on app load
export const initializeCleanup = () => {
  // Only clean once per session
  const sessionKey = 'themes_cleaned_session';
  if (!sessionStorage.getItem(sessionKey)) {
    cleanOldLocalStorageThemes();
    sessionStorage.setItem(sessionKey, 'true');
  }
};
