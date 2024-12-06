// Import the auth and db instances from firebase.js
import { auth, db } from "../js/firebase.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Listen for user authentication state
auth.onAuthStateChanged(async (user) => {
    if (user) {
        console.log("User is logged in:", user.uid);
        // Proceed to add or read data
        try {
            // Add document or other Firestore operations here
            await addDoc(collection(db, "timecapsule"), {  // Changed "capsule" to "timecapsule"
                userId: user.uid,
                content: "Your capsule content here",
                timestamp: new Date()
            });
            console.log("Document added successfully!");
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    } else {
        console.log("No user is logged in");
        // Handle the case where the user is not logged in
    }
});

// Add new capsule to Firestore
document.getElementById('capsuleForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) {
    alert("You need to be logged in to save a capsule.");
    return;
  }

  const message = document.getElementById('message').value;
  const openDate = document.getElementById('openDate').value;

  try {
    // Add document to Firestore
    await addDoc(collection(db, "timecapsule"), {  // Changed "capsule" to "timecapsule"
        userId: user.uid,  // Store the user's UID
        message,
        openDate,
        createdAt: new Date()
     });
     
    alert("Capsule saved successfully!");

    // Reload capsules after saving
    await loadCapsules(user.uid);
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Error saving capsule: " + error.message);
  }
});

// Load user's existing capsules from Firestore
async function loadCapsules(userId) {
    try {
      const querySnapshot = await getDocs(collection(db, "timecapsule"));  // Changed "capsule" to "timecapsule"
      const capsuleList = document.getElementById('capsuleList');
      capsuleList.innerHTML = ''; // Clear the list before adding new data
  
      querySnapshot.forEach((doc) => {
        const capsuleData = doc.data();
        if (capsuleData.userId === userId) {
          const li = document.createElement('li');
          li.textContent = `Message: ${capsuleData.message}, Open Date: ${capsuleData.openDate}, Created At: ${capsuleData.createdAt.toDate()}`;
          capsuleList.appendChild(li);
        }
      });
    } catch (error) {
      console.error("Error loading capsules: ", error);
      alert("Error loading capsules: " + error.message);
    }
}
