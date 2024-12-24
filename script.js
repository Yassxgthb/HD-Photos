const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const processBtn = document.getElementById('processBtn');
const downloadBtn = document.getElementById('downloadBtn');
const canvas = document.getElementById('photoCanvas');
const ctx = canvas.getContext('2d');
const particleCanvas = document.getElementById('particleCanvas');
const particleCtx = particleCanvas.getContext('2d');
let particles = [];
let imageLoaded = false;

// Drag-and-Drop Handlers
dropZone.addEventListener('click', () => {
    fileInput.click();
});

dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('dragging');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragging');
});

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('dragging');
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        handleFileUpload(files[0]);
    }
});

// File Upload Logic
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    handleFileUpload(file);
});

function handleFileUpload(file) {
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                canvas.style.display = 'block';
                processBtn.style.display = 'inline-block';
                downloadBtn.style.display = 'none';
                imageLoaded = true;
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    }
}

// Enhance Photo
processBtn.addEventListener('click', () => {
    if (imageLoaded) {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const enhancedCanvas = enhancePhoto(imgData, canvas.width, canvas.height);
        const enhancedURL = enhancedCanvas.toDataURL();

        // Update canvas with enhanced image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(enhancedCanvas, 0, 0, enhancedCanvas.width, enhancedCanvas.height);

        // Display download button with the enhanced photo
        downloadBtn.href = enhancedURL;
        downloadBtn.style.display = 'inline-block';
    }
});

function enhancePhoto(imgData, width, height) {
    const enhancedCanvas = document.createElement('canvas');
    const enhancedCtx = enhancedCanvas.getContext('2d');

    // Peningkatan resolusi
    const upscaleFactor = 2;
    enhancedCanvas.width = width * upscaleFactor;
    enhancedCanvas.height = height * upscaleFactor;

    const img = new Image();
    img.src = canvas.toDataURL();
    enhancedCtx.drawImage(img, 0, 0, enhancedCanvas.width, enhancedCanvas.height);

    // Penajaman warna
    const sharpenedData = enhancedCtx.getImageData(0, 0, enhancedCanvas.width, enhancedCanvas.height);
    const data = sharpenedData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(data[i] + 20, 255); // Red
        data[i + 1] = Math.min(data[i + 1] + 20, 255); // Green
        data[i + 2] = Math.min(data[i + 2] + 20, 255); // Blue
    }
    enhancedCtx.putImageData(sharpenedData, 0, 0);

    return enhancedCanvas;
}

// Particle Animation
function createParticles() {
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * particleCanvas.width,
            y: Math.random() * particleCanvas.height,
            r: Math.random() * 3 + 1,
            d: Math.random() * 50
        });
    }
}

function drawParticles() {
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach((p) => {
        particleCtx.beginPath();
        particleCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        particleCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        particleCtx.fill();
    });
}

function updateParticles() {
    particles.forEach((p) => {
        p.y += Math.cos(p.d) + 1;
        if (p.y > particleCanvas.height) {
            p.y = 0;
            p.x = Math.random() * particleCanvas.width;
        }
    });
}

function animateParticles() {
    drawParticles();
    updateParticles();
    requestAnimationFrame(animateParticles);
}

particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;
createParticles();
animateParticles();
