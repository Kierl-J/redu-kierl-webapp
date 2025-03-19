import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAz_xAszHY5r1OLDSM8PrCMZG_vFlUuJEg",
    authDomain: "redu-kierl.firebaseapp.com",
    projectId: "redu-kierl",
    storageBucket: "redu-kierl.firebasestorage.app",
    messagingSenderId: "858929548345",
    appId: "1:858929548345:web:5be516413be06d9a7e11e8",
    measurementId: "G-YRN2FT696V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function loadCoins(userId) {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById('coinCount').textContent = data.coins || 0;

        if (data.gcashNumber) {
            document.getElementById('welcomeMessage').textContent = `Welcome, Gcash Number: ${data.gcashNumber}!`;
        }

        const now = new Date();
        const lastVisit = data.lastVisit ? new Date(data.lastVisit) : null;
        if (lastVisit && now - lastVisit < 24 * 60 * 60 * 1000) {
            document.getElementById('visitFacebookBtn').disabled = true;
        }
    } else {
        await setDoc(docRef, { coins: 0, lastVisit: null, gcashNumber: "" });
    }
}

window.visitFacebook = async function visitFacebook() {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to earn coins.");
        return;
    }

    const userId = user.uid;
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    const now = new Date();
    const lastVisit = data.lastVisit ? new Date(data.lastVisit) : null;
    if (lastVisit && now - lastVisit < 24 * 60 * 60 * 1000) {
        alert("You've already earned a coin today. Try again tomorrow!");
        return;
    }

    const visited = confirm("Click OK to visit Facebook. You will earn a coin!");
    if (visited) {
        window.open('https://facebook.com', '_blank');
        await updateDoc(docRef, { coins: (data.coins || 0) + 1, lastVisit: now.toISOString() });
        loadCoins(userId);
    }
}

window.logoutUser = function logoutUser() {
    signOut(auth).then(() => {
        alert("You have been logged out.");
        window.location.reload();
    }).catch((error) => {
        alert("Logout failed, please try again.");
    });
}

window.saveGcashNumber = async function saveGcashNumber() {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to save your Gcash Number.");
        return;
    }

    const userId = user.uid;
    const gcashNumber = document.getElementById('gcashNumberInput').value.trim();
    if (!gcashNumber) {
        alert("Please enter your Gcash Number.");
        return;
    }

    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, { gcashNumber: gcashNumber });

    alert("Gcash Number saved successfully!");
    window.location.href = "dashboard.html";
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        loadCoins(user.uid);
    }
});
