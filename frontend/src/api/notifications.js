// frontend/src/api/notifications.js
import { getAuth } from 'firebase/auth';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://bloomence-mss1.onrender.com';

export async function registerEmail(name, email) {
  const token = await getAuth().currentUser.getIdToken();
  const res = await fetch(`${BASE_URL}/api/notifications/register`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'register failed');
  return res.json();
}

export async function seen() {
  const token = await getAuth().currentUser.getIdToken();
  const res = await fetch(`${BASE_URL}/api/notifications/seen`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'seen failed');
  return res.json();
}

export async function saveResult({ questionnaireType, totalScore, userName, userEmail }) {
  const token = await getAuth().currentUser.getIdToken();
  const res = await fetch(`${BASE_URL}/api/results/save`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ questionnaireType, totalScore, userName, userEmail }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'save result failed');
  return res.json();
}
