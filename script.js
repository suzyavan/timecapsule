function saveCapsule(message, openDate, image) {
    const capsules = JSON.parse(localStorage.getItem('capsules')) || [];
    capsules.push({
        message,
        timestamp: Date.now(),
        openDate: new Date(openDate).getTime(),
        image
    });
    localStorage.setItem('capsules', JSON.stringify(capsules));
}

function displayCapsules() {
    const capsuleList = document.getElementById('capsuleList');
    capsuleList.innerHTML = '';
    const capsules = JSON.parse(localStorage.getItem('capsules')) || [];

    capsules.forEach(capsule => {
        const li = document.createElement('li');
        const isOpen = Date.now() >= capsule.openDate;

        li.innerHTML = isOpen 
            ? `Capsule Opened: <strong>${capsule.message}</strong> (Opened on: ${new Date(capsule.timestamp).toLocaleString()})` + 
              (capsule.image ? `<br><img src="${capsule.image}" alt="Capsule Image" style="max-width: 300px;"/>` : '') 
            : `This capsule is sealed until ${new Date(capsule.openDate).toLocaleString()}. ` +
              `<button onclick="openCapsule(this)">Open Capsule</button>`;
        
        capsuleList.appendChild(li);
    });
}

function openCapsule(button) {
    const li = button.parentElement;
    const capsule = JSON.parse(localStorage.getItem('capsules'))[Array.from(li.parentElement.children).indexOf(li)];
    li.innerHTML = `Capsule Opened: <strong>${capsule.message}</strong> (Opened on: ${new Date(capsule.timestamp).toLocaleString()})` +
                   (capsule.image ? `<br><img src="${capsule.image}" alt="Capsule Image" style="max-width: 300px;"/>` : '');
}

document.getElementById('imageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => this.dataset.image = reader.result;
        reader.readAsDataURL(file);
    }
});

document.getElementById('capsuleForm').addEventListener('submit', function(event) {
    event.preventDefault();
    saveCapsule(
        document.getElementById('message').value,
        document.getElementById('openDate').value,
        document.getElementById('imageUpload').dataset.image || ''
    );
    displayCapsules();
    this.reset();
});

window.onload = displayCapsules;
