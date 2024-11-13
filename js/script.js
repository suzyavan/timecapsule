// Initialize an array to hold capsules
let capsules = [];

// Handle form submission to save a new capsule
document.getElementById('capsuleForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const message = document.getElementById('message').value;
    const openDate = document.getElementById('openDate').value;
    const imageUpload = document.getElementById('imageUpload').files[0];

    // Create capsule object
    const capsule = {
        message,
        openDate,
        imageUrl: imageUpload ? URL.createObjectURL(imageUpload) : '' // Temporary URL for preview
    };

    // Save capsule to array (this could be replaced with localStorage if needed)
    capsules.push(capsule);

    // Display capsule in the list
    displayCapsules();

    // Clear the form
    document.getElementById('capsuleForm').reset();
    alert("Capsule saved successfully!");
});

// Function to display capsules with an "Open Capsule" button and open date
function displayCapsules() {
    const capsuleList = document.getElementById('capsuleList');
    capsuleList.innerHTML = ''; // Clear existing list

    // Loop through capsules and add them to the list
    capsules.forEach((capsule, index) => {
        const listItem = document.createElement('li');
        
        // Display the open date as a suspense message
        const suspenseMessage = document.createElement('p');
        suspenseMessage.innerHTML = `<strong>Available on:</strong> ${capsule.openDate}`;
        
        // Set up the "Open Capsule" button
        const openButton = document.createElement('button');
        openButton.textContent = 'Open Capsule';
        openButton.addEventListener('click', () => {
            // Check if the current date is on or after the open date
            const currentDate = new Date().toISOString().split('T')[0];
            if (currentDate >= capsule.openDate) {
                // Display capsule details if open date is reached
                listItem.innerHTML = ` 
                    <p><strong>Message:</strong> ${capsule.message}</p>
                    <p><strong>Open Date:</strong> ${capsule.openDate}</p>
                    ${capsule.imageUrl ? `<img src="${capsule.imageUrl}" alt="Capsule Image" width="100">` : ''}
                `;
            } else {
                // Notify user if it's too early to open the capsule
                alert("It's too early to open this capsule!");
            }
        });

        // Add suspense message and button to the list item
        listItem.appendChild(suspenseMessage);
        listItem.appendChild(openButton);
        capsuleList.appendChild(listItem);
    });
}
