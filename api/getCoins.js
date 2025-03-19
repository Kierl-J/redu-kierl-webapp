import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAz_xAszHY5",
    authDomain: "redu-kierl.firebaseapp.com",
    projectId: "redu-kierl",
    storageBucket: "redu-kierl.firebasestorage.app",
    messagingSenderId: "858929548345",
    appId: "1:858929548345:web:5be516413be06d9a7e11e8",
    measurementId: "G-YRN2FT696V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        const userRef = doc(db, "users", email);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            res.status(200).json({ coins: userData.coins || 0 });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching coins:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
