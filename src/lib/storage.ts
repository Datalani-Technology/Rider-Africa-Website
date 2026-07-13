// Firebase Storage upload helpers — bucket: riderafrica-4e655.firebasestorage.app
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadPawnFile(
  submissionId: string,
  category: string,
  file: File,
): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `pawn_submissions/${submissionId}/${category}/${Date.now()}_${safeName}`;
  const snapshot = await uploadBytes(ref(storage, path), file);
  return getDownloadURL(snapshot.ref);
}

export async function uploadPawnPhoto(
  submissionId: string,
  index: number,
  file: File,
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `pawn_submissions/${submissionId}/photos/photo_${index}.${ext}`;
  const snapshot = await uploadBytes(ref(storage, path), file);
  return getDownloadURL(snapshot.ref);
}

export async function uploadShopProductImage(
  productId: string,
  file: File,
): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `shop_products/${productId}/${Date.now()}_${safeName}`;
  const snapshot = await uploadBytes(ref(storage, path), file);
  return getDownloadURL(snapshot.ref);
}
