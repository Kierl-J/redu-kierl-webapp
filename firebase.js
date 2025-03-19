// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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

document.addEventListener('DOMContentLoaded', () => {
    const coinDisplay = document.getElementById('coinCount');
    const visitFacebookBtn = document.getElementById('visitFacebookBtn');
    const welcomeMessage = document.getElementById('welcomeMessage');

    async function loadCoins(userId) {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            // Update coin display
            if (coinDisplay) {
                coinDisplay.textContent = data.coins || 0;
            }

            if (data.gcashNumber && welcomeMessage) {
                welcomeMessage.textContent = `Gcash Number: ${data.gcashNumber}`;
            }
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
            if (visitFacebookBtn) {
                visitFacebookBtn.classList.add('disabled');
                visitFacebookBtn.disabled = true;
            }
            return;
        }

        const visited = confirm("Click OK to visit Facebook. You will earn a coin!");
        if (visited) {
            window.open('https://facebook.com', '_blank');

            await updateDoc(docRef, {
                coins: (data.coins || 0) + 1,
                lastVisit: now.toISOString()
            });

            if (visitFacebookBtn) {
                visitFacebookBtn.classList.add('disabled');
                visitFacebookBtn.disabled = true;
            }

            loadCoins(userId); // Refresh coin count
        }
    }

    window.buyItem = async function buyItem(item, price) {
        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in to purchase items.");
            return;
        }

        const userId = user.uid;
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();

        if (data.coins < price) {
            alert("You don't have enough coins to buy this item.");
            return;
        }

        // Deduct coins and update the purchase
        const updatedCoins = data.coins - price;
        await updateDoc(docRef, {
            coins: updatedCoins
        });

        // Display success message
        alert(`Successfully purchased a ${item}!`);
        loadCoins(userId); // Refresh coin count after purchase
    }

    window.logoutUser = function logoutUser() {
        signOut(auth).then(() => {
            alert("You have been logged out.");
            window.location.href = "index.html"; // Redirect to login page
        }).catch((error) => {
            alert("Error logging out: " + error.message);
        });
    };

    onAuthStateChanged(auth, (user) => {
        if (user) {
            loadCoins(user.uid);
        } else {
            if (coinDisplay) {
                coinDisplay.textContent = "0";
            }
        }
    });
});
