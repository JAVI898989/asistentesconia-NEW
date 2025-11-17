import express from 'express';
import { requireAdminOrBypass, adminBypassMiddleware } from '../lib/adminUtils';

const router = express.Router();

// Apply admin bypass middleware to all routes
router.use(adminBypassMiddleware);

// Example: Get assistant syllabus with admin bypass
router.get('/assistants/:id/syllabus', async (req, res) => {
  try {
    const { id: assistantId } = req.params;
    const { isAdmin, canAccess, adminCheck } = req;

    // Admin bypass - no subscription check needed
    if (isAdmin) {
      console.log(`🔓 Admin accessing syllabus for ${assistantId}`, {
        source: adminCheck.source,
        uid: adminCheck.uid
      });
      
      // Return all syllabus data without restrictions
      const allSyllabi = await getSyllabusData(assistantId, { includePrivate: true });
      return res.json({
        success: true,
        data: allSyllabi,
        adminAccess: true,
        message: 'Admin access - all content available'
      });
    }

    // Regular user - check subscription
    if (!canAccess) {
      return res.status(403).json({
        success: false,
        error: 'Subscription required',
        adminAccess: false
      });
    }

    // Return limited data for regular users
    const limitedSyllabi = await getSyllabusData(assistantId, { includePrivate: false });
    res.json({
      success: true,
      data: limitedSyllabi,
      adminAccess: false
    });

  } catch (error) {
    console.error('Error in syllabus API:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Example: Get specific syllabus PDF with admin bypass
router.get('/assistants/:id/syllabus/:slug/pdf', async (req, res) => {
  try {
    const { id: assistantId, slug } = req.params;
    const { isAdmin, canAccess, adminCheck } = req;

    // Admin bypass
    if (isAdmin) {
      console.log(`🔓 Admin accessing PDF for ${assistantId}/${slug}`, {
        source: adminCheck.source
      });
      
      const pdfUrl = await getPdfUrl(assistantId, slug);
      return res.json({
        success: true,
        pdfUrl,
        adminAccess: true,
        message: 'Admin access - PDF available'
      });
    }

    // Regular user subscription check
    if (!canAccess) {
      return res.status(403).json({
        success: false,
        error: 'Subscription required for PDF access',
        adminAccess: false
      });
    }

    const pdfUrl = await getPdfUrl(assistantId, slug);
    res.json({
      success: true,
      pdfUrl,
      adminAccess: false
    });

  } catch (error) {
    console.error('Error in PDF API:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Example: Start test with admin bypass
router.post('/tests/start', async (req, res) => {
  try {
    const { assistantId, testId } = req.body;
    const { isAdmin, canAccess, adminCheck } = req;

    // Admin bypass
    if (isAdmin) {
      console.log(`🔓 Admin starting test for ${assistantId}`, {
        source: adminCheck.source
      });
      
      const testSession = await startTestSession(assistantId, testId, {
        adminMode: true,
        unlimitedAttempts: true
      });
      
      return res.json({
        success: true,
        testSession,
        adminAccess: true,
        message: 'Admin mode - unlimited access'
      });
    }

    // Regular user checks
    if (!canAccess) {
      return res.status(403).json({
        success: false,
        error: 'Subscription required to start tests',
        adminAccess: false
      });
    }

    const testSession = await startTestSession(assistantId, testId, {
      adminMode: false,
      unlimitedAttempts: false
    });

    res.json({
      success: true,
      testSession,
      adminAccess: false
    });

  } catch (error) {
    console.error('Error starting test:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Placeholder functions - replace with actual implementations
async function getSyllabusData(assistantId: string, options: { includePrivate: boolean }) {
  // This would fetch from Firestore with appropriate filters
  return {
    assistantId,
    syllabi: [],
    includePrivate: options.includePrivate
  };
}

async function getPdfUrl(assistantId: string, slug: string) {
  // This would generate/retrieve PDF URL from Firebase Storage
  return `https://storage.googleapis.com/your-bucket/assistants/${assistantId}/syllabus/${slug}/v1.pdf`;
}

async function startTestSession(assistantId: string, testId: string, options: any) {
  // This would create a test session in Firestore
  return {
    sessionId: `session_${Date.now()}`,
    assistantId,
    testId,
    ...options
  };
}

export default router;
