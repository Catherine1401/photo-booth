// === DOM elements ===
let webcam;
let countdownEl;
let filterSelect;
let frameSelect;
let captureBtn;
let resetBtn;
let photoStrip;

let filterValue = 'none';
let frameImage = null;
let combinedCanvas = document.createElement('canvas');
let combinedCtx = combinedCanvas.getContext('2d');
let isCapturing = false;
let capturedPhotos = [];
let originalPhotos = []; // Store original photos without frames
let previewContainer = null;

// === Initialize DOM elements ===
function initializeElements() {
  try {
    webcam = document.getElementById('webcam');
    countdownEl = document.getElementById('countdown');
    filterSelect = document.getElementById('filter-select');
    frameSelect = document.getElementById('frame-select');
    captureBtn = document.getElementById('capture-btn');
    resetBtn = document.getElementById('reset-btn');
    photoStrip = document.getElementById('photo-strip');

    // Kiểm tra từng element
    const elements = {
      webcam,
      countdownEl,
      filterSelect,
      frameSelect,
      captureBtn,
      resetBtn,
      photoStrip
    };

    for (const [name, element] of Object.entries(elements)) {
      if (!element) {
        throw new Error(`Element #${name} not found`);
      }
    }

    return true;
  } catch (error) {
    console.error('Failed to initialize elements:', error.message);
    return false;
  }
}

// === Webcam setup ===
async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      } 
    });
    
    webcam.srcObject = stream;
    
    // Đợi webcam sẵn sàng
    await new Promise((resolve) => {
      webcam.onloadedmetadata = () => {
        console.log('Webcam loaded:', webcam.videoWidth, 'x', webcam.videoHeight);
        captureBtn.disabled = false;
        resolve();
      };
    });

    // Đợi thêm 1 giây để đảm bảo webcam hoạt động ổn định
    await new Promise(resolve => setTimeout(resolve, 1000));
    
  } catch (err) {
    console.error('Webcam error:', err);
    alert('Không thể truy cập webcam: ' + err.message);
    captureBtn.disabled = true;
  }
}

// === Flash effect when taking photo ===
function showFlash() {
  const flash = document.createElement('div');
  flash.className = 'flash';
  document.querySelector('.webcam-box').appendChild(flash);
  
  requestAnimationFrame(() => {
    flash.style.opacity = '0.8';
    setTimeout(() => {
      flash.style.opacity = '0';
      setTimeout(() => {
        flash.remove();
      }, 100);
    }, 100);
  });
}

// === Countdown animation ===
function countdown(seconds) {
  return new Promise((resolve) => {
    let current = seconds;
    countdownEl.textContent = current;
    countdownEl.classList.remove('hidden');

    const timer = setInterval(() => {
      current--;
      if (current < 0) {
        clearInterval(timer);
        countdownEl.classList.add('hidden');
        resolve();
      } else {
        countdownEl.textContent = current;
      }
    }, 1000);
  });
}

// === Filter handling ===
function setupFilters() {
  filterSelect.addEventListener('change', () => {
    const selectedFilter = filterSelect.value;
    webcam.style.filter = getFilterStyle(selectedFilter);
  });
}

// === Get filter style based on filter name ===
function getFilterStyle(filterName) {
  const filterStyles = {
    // Basic Filters
    'normal': 'none',
    'grayscale': 'grayscale(100%)',
    'sepia': 'sepia(80%)',
    'invert': 'invert(100%)',
    
    // Instagram-like Filters
    'clarendon': 'contrast(120%) saturate(150%) brightness(110%)',
    'gingham': 'brightness(105%) contrast(110%) saturate(90%)',
    'moon': 'grayscale(100%) contrast(110%) brightness(110%)',
    'lark': 'contrast(90%) brightness(110%) saturate(90%)',
    'reyes': 'sepia(22%) contrast(110%) brightness(110%) saturate(75%)',
    'juno': 'contrast(120%) brightness(110%) saturate(130%) sepia(10%)',
    'slumber': 'brightness(105%) contrast(110%) saturate(85%) sepia(25%)',
    'crema': 'contrast(110%) brightness(110%) saturate(75%) sepia(20%)',
    'ludwig': 'contrast(105%) brightness(105%) saturate(110%)',
    'aden': 'contrast(90%) brightness(120%) saturate(85%) hue-rotate(-20deg)',
    'perpetua': 'contrast(110%) brightness(110%) saturate(90%) sepia(30%)',
    
    // Modern Filters
    'vintage': 'sepia(50%) contrast(120%) brightness(90%) saturate(80%)',
    'noir': 'grayscale(100%) contrast(150%) brightness(90%)',
    'dramatic': 'contrast(150%) brightness(90%) saturate(120%)',
    'portrait': 'contrast(120%) brightness(110%) saturate(110%)',
    'cinematic': 'contrast(130%) brightness(90%) saturate(110%)',
    'fashion': 'contrast(120%) brightness(110%) saturate(130%)',
    'editorial': 'contrast(130%) brightness(90%) saturate(110%)',
    
    // Seasonal Filters
    'summer': 'brightness(110%) saturate(150%) contrast(110%)',
    'autumn': 'sepia(30%) saturate(150%) contrast(110%) brightness(105%)',
    'winter': 'brightness(110%) saturate(80%) contrast(110%)',
    'spring': 'brightness(110%) saturate(130%) contrast(110%)',
    
    // Artistic Filters
    'cyberpunk': 'brightness(120%) saturate(200%) contrast(150%) hue-rotate(30deg)',
    'retro': 'sepia(50%) contrast(120%) brightness(90%) saturate(80%)',
    'neon': 'brightness(120%) saturate(200%) contrast(150%)',
    'pastel': 'brightness(110%) saturate(80%) contrast(90%)',
    'popart': 'saturate(200%) contrast(150%) brightness(110%)',
    
    // Mood Filters
    'moody': 'brightness(90%) contrast(120%) saturate(90%)',
    'sunset': 'sepia(30%) saturate(150%) brightness(110%) contrast(110%)',
    'tropical': 'brightness(110%) saturate(180%) contrast(110%)',
    'nordic': 'brightness(110%) saturate(90%) contrast(110%)',
    
    // Professional Filters
    'natural': 'contrast(110%) brightness(105%) saturate(110%)',
    'minimal': 'contrast(110%) brightness(110%) saturate(90%)',
    'urban': 'contrast(120%) brightness(90%) saturate(110%)',
    'lifestyle': 'contrast(110%) brightness(110%) saturate(120%)'
  };
  
  return filterStyles[filterName] || '';
}

// === Apply filter to canvas context ===
function applyFilterToContext(context, filterName) {
  const filterStyle = getFilterStyle(filterName);
  if (filterStyle) {
    context.filter = filterStyle;
  }
}

// === Capture photo ===
function capturePhoto() {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  canvas.width = webcam.videoWidth;
  canvas.height = webcam.videoHeight;
  
  // Áp dụng filter cho context trước khi vẽ
  applyFilterToContext(context, filterSelect.value);
  
  // Vẽ ảnh từ webcam
  context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
  
  return canvas.toDataURL('image/png');
}

// === Download photo ===
function downloadPhoto(photoUrl, index) {
  const link = document.createElement('a');
  link.href = photoUrl;
  link.download = `photo_${index + 1}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// === Add photo to preview ===
function addPhotoToPreview(container, photoUrl, index) {
  const photoWrapper = document.createElement('div');
  photoWrapper.className = 'photo-wrapper';
  
  const img = document.createElement('img');
  img.src = photoUrl;
  img.className = 'fade-in';
  
  photoWrapper.appendChild(img);
  container.appendChild(photoWrapper);
}

// === Create preview container ===
function createPreviewContainer() {
  const container = document.createElement('div');
  container.className = 'photo-container';
  return container;
}

// === Apply frame to photo ===
async function applyFrameToPhoto(photoData, framePath) {
  if (!framePath) return photoData;

  return new Promise((resolve, reject) => {
    const photoImg = new Image();
    photoImg.crossOrigin = 'anonymous';

    photoImg.onload = async () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = photoImg.width;
      canvas.height = photoImg.height;
      ctx.drawImage(photoImg, 0, 0, canvas.width, canvas.height);

      try {
        const frameImg = new Image();
        frameImg.crossOrigin = 'anonymous';

        frameImg.onload = () => {
          ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/png'));
        };

        frameImg.onerror = () => resolve(photoData);
        frameImg.src = framePath;
      } catch (error) {
        console.error('Frame application failed:', error);
        resolve(photoData);
      }
    };

    photoImg.onerror = () => resolve(photoData);
    photoImg.src = photoData;
  });
}

// === Create combined image ===
function createCombinedImage() {
  if (capturedPhotos.length === 0) return null;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Tính toán kích thước canvas
  const photoWidth = webcam.videoWidth;
  const photoHeight = webcam.videoHeight;
  const padding = 20;
  const totalHeight = (photoHeight + padding) * capturedPhotos.length - padding;
  
  canvas.width = photoWidth;
  canvas.height = totalHeight;
  
  // Vẽ từng ảnh
  capturedPhotos.forEach((photo, index) => {
    const img = new Image();
    img.src = photo;
    ctx.drawImage(img, 0, index * (photoHeight + padding), photoWidth, photoHeight);
  });
  
  return canvas.toDataURL('image/png');
}

// === Show download combined ===
function showDownloadCombined() {
  const combinedImage = createCombinedImage();
  if (!combinedImage) return;

  const link = document.createElement('a');
  link.download = 'photo-strip.png';
  link.href = combinedImage;
  link.click();
}

// === Take photo sequence ===
async function takePhotoSequence() {
  if (isCapturing) return;
  isCapturing = true;

  try {
    // Hiệu ứng đếm ngược ban đầu
    await countdown(3);
    
    // Chụp 4 ảnh liên tục
    for (let i = 0; i < 4; i++) {
      // Hiệu ứng flash
      showFlash();
      
      // Chụp ảnh
      const photo = capturePhoto();
      capturedPhotos.push(photo);
      
      // Áp dụng frame nếu có
      const framedPhoto = await applyFrameToPhoto(photo, frameSelect.value);
      
      // Thêm vào preview
      if (!previewContainer) {
        previewContainer = createPreviewContainer();
        photoStrip.appendChild(previewContainer);
      }
      
      addPhotoToPreview(previewContainer, framedPhoto, capturedPhotos.length - 1);

      // Nếu chưa phải ảnh cuối cùng thì đếm ngược 2 giây
      if (i < 3) {
        await new Promise(resolve => {
          let count = 2;
          const timer = setInterval(() => {
            countdownEl.textContent = count;
            countdownEl.classList.remove('hidden');
            count--;
            
            if (count < 0) {
              clearInterval(timer);
              countdownEl.classList.add('hidden');
              resolve();
            }
          }, 1000);
        });
      }
    }

    // Thêm nút tải ảnh sau khi chụp xong
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'download-all-btn';
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Tải tất cả ảnh';
    downloadBtn.onclick = showDownloadCombined;
    photoStrip.appendChild(downloadBtn);
    
  } catch (error) {
    console.error('Error taking photo:', error);
  } finally {
    isCapturing = false;
  }
}

// === Initialize application ===
document.addEventListener('DOMContentLoaded', () => {
  if (!initializeElements()) {
    console.error('Failed to initialize application');
    return;
  }

  // Event listeners
  captureBtn.addEventListener('click', takePhotoSequence);
  resetBtn.addEventListener('click', () => {
    capturedPhotos = [];
    originalPhotos = [];
    if (previewContainer) {
      previewContainer.remove();
      previewContainer = null;
    }
    // Xóa nút tải ảnh nếu có
    const downloadBtn = document.querySelector('.download-all-btn');
    if (downloadBtn) {
      downloadBtn.remove();
    }
  });

  // Start application
  startWebcam();
  setupFilters();
});