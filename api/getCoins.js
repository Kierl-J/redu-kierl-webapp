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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
    const { email } = req.query;

    if (!email) {
        res.status(400).json({ error: "Email is required." });
        return;
    }

    const userRef = doc(db, "users", email); // Updated to use email as doc ID
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const { coins } = userSnap.data();
        res.status(200).json({ coins });
    } else {
        res.status(404).json({ coins: 0 }); // Default value if user data not found
    }
}
