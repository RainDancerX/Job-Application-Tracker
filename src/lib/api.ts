import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from './firebase';
import type { JobApplication } from '@/types';

const APPLICATIONS_COLLECTION = 'job_applications';

export async function fetchApplications(): Promise<JobApplication[]> {
  try {
    const q = query(
      collection(db, APPLICATIONS_COLLECTION),
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
    const docRef = await addDoc(collection(db, APPLICATIONS_COLLECTION), {
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
    const docRef = doc(db, APPLICATIONS_COLLECTION, id);
    await updateDoc(docRef, application);
  } catch (error) {
    console.error('Error updating application:', error);
    throw error;
  }
}

export async function deleteApplication(id: string): Promise<void> {
  try {
    const docRef = doc(db, APPLICATIONS_COLLECTION, id);
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
    const q = query(
      collection(db, APPLICATIONS_COLLECTION),
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
