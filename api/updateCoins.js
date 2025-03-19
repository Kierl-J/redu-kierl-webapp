import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
const firebaseConfig = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
if (!firebaseConfig) throw new Error("FIREBASE_SERVICE_ACCOUNT is missing");

initializeApp({
    credential: admin.credential.cert(firebaseConfig)
});

const db = getFirestore();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { email, coins } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        const userRef = db.collection("users").doc(email);
        await userRef.set({ coins: coins || 0 }, { merge: true });
        res.status(200).json({ success: true, message: `Coins updated for ${email}` });
    } catch (error) {
        res.status(500).json({ error: "Failed to update coins", details: error.message });
    }
}
