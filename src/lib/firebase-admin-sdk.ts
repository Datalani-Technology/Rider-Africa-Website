// Real Firebase Admin SDK — server-only, elevated access that bypasses Firestore
// security rules (unlike src/lib/firestore.ts, which uses the public client SDK and
// is correctly blocked by rules from reading privileged collections like
// pawn_submissions / shop_orders). Used by admin API routes only.
//
// Credentials, in priority order:
//   1. FIREBASE_SERVICE_ACCOUNT_KEY — full service-account JSON as one env var
//   2. FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY — individual fields
//   3. Application Default Credentials — auto-available when deployed on Firebase
//      App Hosting / Cloud Functions / Cloud Run in the same GCP project; no
//      manual key needed there. Not available in plain local dev.
import { getApps, initializeApp, cert, applicationDefault, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let _app: App | undefined;
let _db: Firestore | undefined;

function getAdminApp(): App {
  if (_app) return _app;
  if (getApps().length) { _app = getApps()[0]; return _app; }

  const projectId = process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (serviceAccountJson) {
    _app = initializeApp({ credential: cert(JSON.parse(serviceAccountJson)), projectId });
  } else if (clientEmail && privateKey) {
    _app = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey: privateKey.replace(/\\n/g, "\n") }),
      projectId,
    });
  } else {
    _app = initializeApp({ projectId, credential: applicationDefault() });
  }
  return _app;
}

export function getAdminDb(): Firestore {
  if (!_db) _db = getFirestore(getAdminApp());
  return _db;
}
