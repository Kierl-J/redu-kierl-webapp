import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const firebaseConfig = {
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

export default async function handler(req, res) {
    const { uid } = req.query;

    if (!uid) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }

        const userData = userDoc.data();
        res.status(200).json({ coins: userData.coins || 0 });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch coin data" });
    }
}
