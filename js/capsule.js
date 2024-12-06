import { auth } from "../js/firebase.js";
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";

// Initialize the database and storage
const db = getDatabase();
const storage = getStorage();

document.addEventListener("DOMContentLoaded", () => {
    const loginStatus = document.getElementById("loginStatus");
    const capsuleForm = document.getElementById("capsuleForm");
    const capsuleList = document.getElementById("capsuleList");
    const openDateInput = document.getElementById("openDate");
    const imageUploadInput = document.getElementById("imageUpload");
    const progressBar = document.getElementById("progressBar");

    if (!loginStatus || !capsuleForm || !capsuleList || !openDateInput || !imageUploadInput || !progressBar) {
        console.error("Required DOM elements are missing.");
        return;
    }

    // Set the minimum date for the date input
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    openDateInput.setAttribute("min", formattedToday);

    // Listen for user authentication state
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            loginStatus.textContent = `Logged in as: ${user.email}`;

            // Load existing capsules for the logged-in user
            loadUserCapsules(user.uid);

            // Validate file type on file selection
            imageUploadInput.addEventListener("change", () => {
                const file = imageUploadInput.files[0];
                if (file && !isValidImageFile(file)) {
                    alert("Only PNG, JPEG, or JPG files are allowed!");
                    imageUploadInput.value = ""; // Clear the invalid file
                }
            });

            // Handle form submission
            capsuleForm.addEventListener("submit", async (event) => {
                event.preventDefault();

                const message = document.getElementById("message").value;
                const openDate = openDateInput.value;
                const imageUpload = imageUploadInput.files[0];

                if (!message.trim() || !openDate) {
                    alert("Message and open date are required!");
                    return;
                }

                // Check file type before upload
                if (imageUpload && !isValidImageFile(imageUpload)) {
                    alert("Only PNG, JPEG, or JPG files are allowed!");
                    return;
                }

                try {
                    // Reference to the user's folder in the database
                    const userRef = ref(db, `capsules/${user.uid}`);

                    // Upload image if available and get its URL
                    let imageUrl = null;
                    if (imageUpload) {
                        const imgRef = storageRef(storage, `capsule_images/${user.uid}/${imageUpload.name}`);
                        const uploadTask = uploadBytesResumable(imgRef, imageUpload);

                        // Monitor upload progress
                        uploadTask.on(
                            "state_changed",
                            (snapshot) => {
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                progressBar.value = progress; // Update progress bar
                                progressBar.style.display = "block";
                            },
                            (error) => {
                                console.error("Error uploading file:", error);
                                alert("Failed to upload the image. Please try again.");
                                progressBar.style.display = "none";
                            },
                            async () => {
                                // Upload completed successfully
                                imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                                console.log("Image uploaded successfully. URL:", imageUrl);

                                // Add the capsule to the database
                                const capsuleData = {
                                    message: message,
                                    openDate: openDate,
                                    timestamp: Date.now(),
                                    imageUrl: imageUrl, // Use Firebase-generated URL
                                };

                                await push(userRef, capsuleData);

                                // Display capsule in the list
                                addCapsuleToList(message, openDate, imageUrl);

                                alert("Capsule saved successfully!");
                                capsuleForm.reset();
                                progressBar.style.display = "none"; // Hide progress bar
                            }
                        );

                        // Wait for the upload to complete
                        await uploadTask;
                    } else {
                        // Add capsule without image
                        const capsuleData = {
                            message: message,
                            openDate: openDate,
                            timestamp: Date.now(),
                            imageUrl: imageUrl, // Null if no image
                        };

                        await push(userRef, capsuleData);

                        // Display capsule in the list
                        addCapsuleToList(message, openDate, imageUrl);

                        alert("Capsule saved successfully!");
                        capsuleForm.reset();
                    }
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

    // Function to validate image file type
    function isValidImageFile(file) {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        return allowedTypes.includes(file.type);
    }

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

        // Log imageUrl for debugging
        console.log("Adding to list. Image URL:", imageUrl);

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