import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin (using environment variables for security)
const app = initializeApp({
    credential: applicationDefault(),
});
const db = getFirestore();

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { uid, email } = req.body;

    if (!uid || !email) {
        return res.status(400).json({ error: "Invalid request data." });
    }

    try {
        const userRef = db.collection("users").doc(uid);
        await userRef.set({
            email: email,
            coins: 1000 // Securely assign starting coins
        });

        res.status(200).json({ coins: 1000 });
    } catch (error) {
        console.error("Error assigning coins:", error);
        res.status(500).json({ error: "Failed to assign coins." });
    }
}
