import { auth } from "../js/firebase.js";
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";

const db = getDatabase();
const storage = getStorage();

document.addEventListener("DOMContentLoaded", () => {
    const loginStatus = document.getElementById("loginStatus");
    const signOutButton = document.getElementById("signOutButton");
    const capsuleForm = document.getElementById("capsuleForm");
    const capsuleList = document.getElementById("capsuleList");
    const titleInput = document.getElementById("title");
    const messageInput = document.getElementById("message");
    const openDateInput = document.getElementById("openDate");
    const imageUploadInput = document.getElementById("imageUpload");
    const progressBar = document.getElementById("progressBar");

    signOutButton.style.display = "none";

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            loginStatus.textContent = `Logged in as: ${user.email}`;
            signOutButton.style.display = "inline-block";
            loadUserCapsules(user.uid);

            capsuleForm.addEventListener("submit", async (event) => {
                event.preventDefault();

                const title = titleInput.value.trim();
                const message = document.getElementById("message").value;
                const openDate = openDateInput.value;
                const imageUpload = imageUploadInput.files[0];

                if (!title || !message.trim() || !openDate) {
                    alert("Title, message, and open date are required!");
                    return;
                }

                const userRef = ref(db, `capsules/${user.uid}`);
                let imageUrl = null;

                try {
                    if (imageUpload) {
                        const imgRef = storageRef(storage, `capsule_images/${user.uid}/${imageUpload.name}`);
                        const uploadTask = uploadBytesResumable(imgRef, imageUpload);

                        uploadTask.on(
                            "state_changed",
                            (snapshot) => {
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                progressBar.value = progress;
                                progressBar.style.display = "block";
                            },
                            (error) => {
                                console.error("Error uploading file:", error);
                                progressBar.style.display = "none";
                            },
                            async () => {
                                imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                                const capsuleData = { title, message, openDate, timestamp: Date.now(), imageUrl };
                                await push(userRef, capsuleData);
                                addCapsuleToList(capsuleData, true);
                                capsuleForm.reset();
                                titleInput.value = "";
                                progressBar.style.display = "none";
                                alert("Capsule saved!");
                            }
                        );
                    } else {
                        const capsuleData = { title, message, openDate, timestamp: Date.now(), imageUrl };
                        await push(userRef, capsuleData);
                        addCapsuleToList(capsuleData, true);
                        capsuleForm.reset();
                        titleInput.value = "";
                        alert("Capsule saved!");
                    }
                } catch (error) {
                    console.error("Error saving capsule:", error);
                }
            });
        } else {
            loginStatus.textContent = "Not logged in. Please log in to create a capsule.";
            signOutButton.style.display = "none";

            titleInput.disabled = true;
            messageInput.disabled = true; 
            openDateInput.disabled = true;
            imageUploadInput.disabled = true;
            submitButton.disabled = true;
        }
    });

    signOutButton.addEventListener("click", async () => {
        try {
            await auth.signOut();
            loginStatus.textContent = "Not logged in. Please log in to create a capsule.";
            signOutButton.style.display = "none";
            capsuleList.innerHTML = "";
        } catch (error) {
            console.error("Error signing out:", error);
        }
    });

    async function loadUserCapsules(uid) {
        try {
            const userRef = ref(db, `capsules/${uid}`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                const capsules = snapshot.val();
                Object.values(capsules).forEach((capsule) => {
                    addCapsuleToList(capsule, false);
                });
            }
        } catch (error) {
            console.error("Error loading user capsules:", error);
        }
    }

    function addCapsuleToList(capsule, isNew) {
        const listItem = document.createElement("li");

        listItem.innerHTML = `
            <h3>${capsule.title}</h3>
            <p>Open Date: ${capsule.openDate}</p>
        `;

        const openButton = document.createElement("button");
        openButton.textContent = "Open Capsule";

        const today = new Date();
        const openDate = new Date(capsule.openDate);

        if (today < openDate) {
            openButton.disabled = true;
            openButton.textContent = "This capsule cannot be opened yet!";
        } else {
            openButton.addEventListener("click", () => {
                listItem.innerHTML += ` 
                    <p>Message: ${capsule.message}</p>
                    ${capsule.imageUrl ? `<img src="${capsule.imageUrl}" alt="Capsule Image" style="max-width: 100px; display: block;">` : ""}
                `;
            });
        }

        listItem.appendChild(openButton);
        capsuleList.appendChild(listItem);
    }
});