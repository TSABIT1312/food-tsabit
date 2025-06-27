import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../config/firebase';

export const uploadImageToStorage = async (file: File, path: string): Promise<string> => {
  try {
    const fileRef = ref(storage, `${path}/${file.name}`);
    await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(fileRef);
    return downloadUrl;
  } catch (error) {
    console.error('Upload image error:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};
