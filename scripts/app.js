// DOM elements
const webcam = document.getElementById('webcam');
const overlayCanvas = document.getElementById('overlay');
const countdownEl = document.getElementById('countdown');
const filterSelect = document.getElementById('filter-select');
const frameSelect = document.getElementById('frame-select');
const captureBtn = document.getElementById('capture-btn');
const resetBtn = document.getElementById('reset-btn');
const photoStrip = document.getElementById('photo-strip');

const overlayCtx = overlayCanvas.getContext('2d');
let filterValue = 'none';
let frameImage = null;

// Khởi động webcam
async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    webcam.srcObject = stream;

    webcam.addEventListener('loadedmetadata', () => {
      overlayCanvas.width = webcam.videoWidth;
      overlayCanvas.height = webcam.videoHeight;
    });
  } catch (err) {
    alert('Không thể truy cập webcam: ' + err.message);
  }
}

// Countdown 3-2-1
function countdown(seconds) {
  return new Promise((resolve) => {
    let current = seconds;
    countdownEl.textContent = current;
    countdownEl.classList.remove('hidden');

    const interval = setInterval(() => {
      current--;
      if (current === 0) {
        clearInterval(interval);
        countdownEl.classList.add('hidden');
        resolve();
      } else {
        countdownEl.textContent = current;
      }
    }, 1000);
  });
}

// Áp dụng filter và khung, rồi chụp ảnh
async function takePhotoSequence() {
  captureBtn.disabled = true;
  resetBtn.classList.remove('hidden');
  photoStrip.innerHTML = ''; // Clear old photos

  for (let i = 1; i <= 4; i++) {
    await countdown(3);
    const photo = await capturePhoto();
    addPhotoToStrip(photo, i);
    await new Promise((r) => setTimeout(r, 300)); // delay nhỏ giữa các ảnh
  }
}

// Chụp 1 ảnh từ video
async function capturePhoto() {
  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  // Áp filter
  overlayCtx.filter = filterValue;
  overlayCtx.drawImage(webcam, 0, 0, overlayCanvas.width, overlayCanvas.height);
  overlayCtx.filter = 'none';

  // Thêm khung nếu có
  if (frameImage) {
    overlayCtx.drawImage(frameImage, 0, 0, overlayCanvas.width, overlayCanvas.height);
  }

  return overlayCanvas.toDataURL('image/png');
}

// Thêm ảnh vào giao diện + nút tải
function addPhotoToStrip(dataURL, index) {
  const container = document.createElement('div');
  container.className = 'photo-container';

  const img = document.createElement('img');
  img.src = dataURL;
  img.alt = `Ảnh ${index}`;

  const downloadBtn = document.createElement('button');
  downloadBtn.textContent = '⬇️ Tải PNG';
  downloadBtn.onclick = () => {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `photo_${index}.png`;
    link.click();
  };

  container.appendChild(img);
  container.appendChild(downloadBtn);
  photoStrip.appendChild(container);
}

// Sự kiện: thay đổi filter
filterSelect.addEventListener('change', (e) => {
  filterValue = e.target.value;
  webcam.style.filter = filterValue;
});

// Sự kiện: thay đổi khung ảnh
frameSelect.addEventListener('change', (e) => {
  const path = e.target.value;
  if (!path) {
    frameImage = null;
    return;
  }
  frameImage = new Image();
  frameImage.src = path;
});

// Sự kiện: chụp ảnh
captureBtn.addEventListener('click', () => {
  takePhotoSequence();
});

// Sự kiện: chụp lại
resetBtn.addEventListener('click', () => {
  photoStrip.innerHTML = '';
  resetBtn.classList.add('hidden');
  captureBtn.disabled = false;
});

// Khởi động
startWebcam();
