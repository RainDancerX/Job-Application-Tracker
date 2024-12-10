import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  //   Timestamp,
  where,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import type { JobApplication } from '@/types';

const getUserCollection = () => {
  const user = auth.currentUser;
  if (!user?.email) {
    throw new Error('Please sign in to access your applications');
  }
  const safeEmail = user.email.replace(/[.#$[\]]/g, '_');
  return `users/${safeEmail}/job_applications`;
};

export async function fetchApplications(): Promise<JobApplication[]> {
  try {
    const collectionPath = getUserCollection();
    const q = query(
      collection(db, collectionPath),
      orderBy('applicationDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as JobApplication[];
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
}

export async function addApplication(
  application: Omit<JobApplication, 'id'>
): Promise<string> {
  try {
    const collectionPath = getUserCollection();
    const docRef = await addDoc(collection(db, collectionPath), {
      ...application,
      applicationDate:
        application.applicationDate || new Date().toISOString().split('T')[0],
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding application:', error);
    throw error;
  }
}

export async function updateApplication(
  id: string,
  application: Partial<JobApplication>
): Promise<void> {
  try {
    const collectionPath = getUserCollection();
    const docRef = doc(db, collectionPath, id);
    await updateDoc(docRef, application);
  } catch (error) {
    console.error('Error updating application:', error);
    throw error;
  }
}

export async function deleteApplication(id: string): Promise<void> {
  try {
    const collectionPath = getUserCollection();
    const docRef = doc(db, collectionPath, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting application:', error);
    throw error;
  }
}

export async function fetchApplicationsByStatus(
  status: JobApplication['status']
): Promise<JobApplication[]> {
  try {
    const collectionPath = getUserCollection();
    const q = query(
      collection(db, collectionPath),
      where('status', '==', status),
      orderBy('applicationDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as JobApplication[];
  } catch (error) {
    console.error('Error fetching applications by status:', error);
    throw error;
  }
}
