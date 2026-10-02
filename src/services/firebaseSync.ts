import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { DatabaseRecord, EmailAccount, DnsRecord, CronJob } from '../types/cpanel';

export async function syncDatabaseRecord(userId: string, database: DatabaseRecord) {
  const path = `users/${userId}/databases/${database.name}`;
  try {
    await setDoc(doc(db, 'users', userId, 'databases', database.name), {
      ...database,
      userId,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteDatabaseRecord(userId: string, databaseName: string) {
  const path = `users/${userId}/databases/${databaseName}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'databases', databaseName));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function syncEmailAccount(userId: string, email: EmailAccount) {
  const path = `users/${userId}/emails/${email.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'emails', email.id), {
      ...email,
      userId,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteEmailAccount(userId: string, emailId: string) {
  const path = `users/${userId}/emails/${emailId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'emails', emailId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function syncDnsRecord(userId: string, record: DnsRecord) {
  const path = `users/${userId}/dns_records/${record.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'dns_records', record.id), {
      ...record,
      userId,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteDnsRecord(userId: string, recordId: string) {
  const path = `users/${userId}/dns_records/${recordId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'dns_records', recordId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function syncCronJob(userId: string, job: CronJob) {
  const path = `users/${userId}/cron_jobs/${job.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'cron_jobs', job.id), {
      ...job,
      userId,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteCronJob(userId: string, jobId: string) {
  const path = `users/${userId}/cron_jobs/${jobId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'cron_jobs', jobId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}
