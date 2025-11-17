import { Request, Response } from "express";
let adminPromise: Promise<any> | null = null;

async function getAdmin() {
  if (!adminPromise) {
    adminPromise = import("firebase-admin").then((mod) => {
      const admin = mod.default ?? mod;
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID || "cursor-64188",
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          }),
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "cursor-64188.appspot.com",
        });
      }
      return admin;
    });
  }
  return adminPromise;
}

export async function uploadTemarioHandler(req: Request, res: Response) {
  try {
    const { assistantSlug, topicId, filename, contentBase64, contentType } = req.body;
    if (!assistantSlug || !topicId || !filename || !contentBase64) {
      return res.status(400).json({ success: false, error: "Missing parameters" });
    }

    const admin = await getAdmin();
    const bucket = admin.storage().bucket();

    const storagePath = `assistants/${assistantSlug}/topics/${topicId}/${filename}`;
    const file = bucket.file(storagePath);

    const buffer = Buffer.from(contentBase64, "base64");

    await file.save(buffer, {
      metadata: {
        contentType: contentType || "application/pdf",
      },
      resumable: false,
    });

    // Make file readable via a signed URL (long expiry)
    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: "01-01-2505",
    });

    return res.json({ success: true, url: signedUrl, storagePath });
  } catch (error: any) {
    console.error("uploadTemarioHandler error:", error);
    return res.status(500).json({ success: false, error: error?.message || String(error) });
  }
}
