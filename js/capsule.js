import { auth } from "../js/firebase.js";
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";

// Initialize the database and storage
const db = getDatabase();
const storage = getStorage();

document.addEventListener("DOMContentLoaded", () => {
    const loginStatus = document.getElementById("loginStatus");
    const capsuleForm = document.getElementById("capsuleForm");
    const capsuleList = document.getElementById("capsuleList");

    if (!loginStatus || !capsuleForm || !capsuleList) {
        console.error("Required DOM elements are missing.");
        return;
    }

    // Listen for user authentication state
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            loginStatus.textContent = `Logged in as: ${user.email}`;

            // Load existing capsules for the logged-in user
            loadUserCapsules(user.uid);

            // Handle form submission
            capsuleForm.addEventListener("submit", async (event) => {
                event.preventDefault();

                const message = document.getElementById("message").value;
                const openDate = document.getElementById("openDate").value;
                const imageUpload = document.getElementById("imageUpload").files[0];

                if (!message.trim() || !openDate) {
                    alert("Message and open date are required!");
                    return;
                }

                try {
                    // Reference to the user's folder in the database
                    const userRef = ref(db, `capsules/${user.uid}`);

                    // Upload image if available and get its URL
                    let imageUrl = null;
                    if (imageUpload) {
                        const imgRef = storageRef(storage, `capsule_images/${user.uid}/${imageUpload.name}`);
                        const snapshot = await uploadBytes(imgRef, imageUpload);
                        imageUrl = await getDownloadURL(snapshot.ref);
                    }

                    // Create capsule data
                    const capsuleData = {
                        message: message,
                        openDate: openDate,
                        timestamp: Date.now(),
                        imageUrl: imageUrl, // Include image URL if available
                    };

                    // Save capsule data under the user's folder
                    await push(userRef, capsuleData);

                    // Display capsule in the list
                    addCapsuleToList(message, openDate, imageUrl);

                    alert("Capsule saved successfully!");
                    capsuleForm.reset();
                } catch (error) {
                    console.error("Error saving capsule:", error);
                    alert("Failed to save capsule. Please try again.");
                }
            });
        } else {
            loginStatus.textContent = "Not logged in. Please log in to create a capsule.";
            console.log("No user is logged in.");
        }
    });

    // Function to load all capsules for a user
    async function loadUserCapsules(uid) {
        try {
            const userRef = ref(db, `capsules/${uid}`);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
                const capsules = snapshot.val();
                Object.values(capsules).forEach((capsule) => {
                    addCapsuleToList(capsule.message, capsule.openDate, capsule.imageUrl);
                });
            } else {
                console.log("No capsules found for this user.");
            }
        } catch (error) {
            console.error("Error loading user capsules:", error);
        }
    }

    // Function to add a capsule to the list
    function addCapsuleToList(message, openDate, imageUrl) {
        const listItem = document.createElement("li");
        listItem.textContent = `Message: ${message}, Open Date: ${openDate}`;

        if (imageUrl) {
            const img = document.createElement("img");
            img.src = imageUrl;
            img.alt = "Capsule Image";
            img.style.maxWidth = "100px";
            img.style.display = "block";
            listItem.appendChild(img);
        }

        capsuleList.appendChild(listItem);
    }
});
