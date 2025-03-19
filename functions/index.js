/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// Secure Cloud Function to assign initial coins
exports.createUserWithCoins = functions.auth.user().onCreate(async (user) => {
    try {
        await db.collection("users").doc(user.uid).set({
            email: user.email,
            coins: 100, // Default starting coins
        });
        console.log(`✅ User ${user.email} added with 100 coins.`);
    } catch (error) {
        console.error(`❌ Error assigning coins: ${error.message}`);
    }
});
