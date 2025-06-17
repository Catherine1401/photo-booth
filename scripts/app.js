document.addEventListener("DOMContentLoaded", () => {
  // === DOM elements ===
  const webcam = document.getElementById('webcam');
  const overlayCanvas = document.getElementById('overlay');
  const countdownEl = document.getElementById('countdown');
  const filterSelect = document.getElementById('filter-select');
  const frameSelect = document.getElementById('frame-select');
  const captureBtn = document.getElementById('capture-btn');
  const resetBtn = document.getElementById('reset-btn');
  const photoStrip = document.getElementById('photo-strip');

  if (!webcam || !overlayCanvas || !countdownEl || !filterSelect || !frameSelect || !captureBtn || !resetBtn || !photoStrip) {
    console.error('Required DOM elements not found');
    return;
  }

  const overlayCtx = overlayCanvas.getContext('2d');
  if (!overlayCtx) {
    console.error('Could not get 2D context for overlay canvas');
    return;
  }

  let filterValue = 'none';
  let frameImage = null;
  let combinedCanvas = document.createElement('canvas');
  let combinedCtx = combinedCanvas.getContext('2d');
  let isCapturing = false;
  let capturedPhotos = [];
  let previewContainer = null;

  // === Webcam setup ===
  async function startWebcam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      webcam.srcObject = stream;
      webcam.play().catch(err => {
        console.error('Error playing video:', err);
        alert('Không thể phát video: ' + err.message);
      });

      webcam.addEventListener('loadedmetadata', () => {
        console.log('Webcam loaded:', webcam.videoWidth, 'x', webcam.videoHeight);
        overlayCanvas.width = webcam.videoWidth;
        overlayCanvas.height = webcam.videoHeight;
        captureBtn.disabled = false;
      });
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
      updateCountdownOverlay(current);

      const timer = setInterval(() => {
        current--;
        if (current < 0) {
          clearInterval(timer);
          overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
          resolve();
        } else {
          updateCountdownOverlay(current);
        }
      }, 1000);
    });
  }

  // === Countdown overlay ===
  function updateCountdownOverlay(number) {
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
    const centerX = overlayCanvas.width / 2;
    const centerY = overlayCanvas.height / 2;
    
    overlayCtx.font = 'bold 120px Arial';
    overlayCtx.fillStyle = 'white';
    overlayCtx.textAlign = 'center';
    overlayCtx.textBaseline = 'middle';
    overlayCtx.fillText(number.toString(), centerX, centerY);
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
    if (filterSelect.value) {
      applyFilterToContext(context, filterSelect.value);
    }
    
    // Vẽ ảnh từ webcam lên canvas
    context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
    
    const img = document.createElement('img');
    img.src = canvas.toDataURL('image/jpeg');
    
    return img;
  }

  // === Create preview container ===
  function createPreviewContainer() {
    const container = document.createElement('div');
    container.className = 'preview-container';
    return container;
  }

  // === Add photo to preview ===
  function addPhotoToPreview(container, photo, index) {
    if (!container) {
      console.error('Preview container is null');
      return;
    }

    const photoContainer = document.createElement('div');
    photoContainer.className = 'photo-container';

    const img = new Image();
    img.src = photo;
    img.alt = `Ảnh ${index + 1}`;

    photoContainer.appendChild(img);
    container.appendChild(photoContainer);
  }

  // === Create combined 4-in-1 image ===
  function createCombinedImage() {
    return new Promise((resolve) => {
      // Set canvas size for vertical layout with smaller dimensions
      combinedCanvas.width = 150; // Giảm kích thước xuống
      combinedCanvas.height = 600; // Giảm kích thước xuống
      combinedCtx.fillStyle = '#ffffff';
      combinedCtx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

      const sectionHeight = combinedCanvas.height / 4;

      const loadPromises = capturedPhotos.map((photo, index) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const y = index * sectionHeight;
            
            combinedCtx.fillStyle = '#f0f0f0';
            combinedCtx.fillRect(0, y, combinedCanvas.width, sectionHeight);

            const photoAspectRatio = img.naturalWidth / img.naturalHeight;
            const targetAspectRatio = combinedCanvas.width / sectionHeight;
            
            let sourceX = 0, sourceY = 0, sourceWidth = img.naturalWidth, sourceHeight = img.naturalHeight;
            
            if (photoAspectRatio > targetAspectRatio) {
              sourceWidth = img.naturalHeight * targetAspectRatio;
              sourceX = (img.naturalWidth - sourceWidth) / 2;
            } else {
              sourceHeight = img.naturalWidth / targetAspectRatio;
              sourceY = (img.naturalHeight - sourceHeight) / 2;
            }

            // Áp dụng filter cho context trước khi vẽ
            if (filterSelect.value) {
              applyFilterToContext(combinedCtx, filterSelect.value);
            }

            combinedCtx.drawImage(
              img,
              sourceX, sourceY, sourceWidth, sourceHeight,
              0, y, combinedCanvas.width, sectionHeight
            );

            // Reset filter sau khi vẽ
            combinedCtx.filter = 'none';
            
            resolve();
          };
          img.src = photo.src;
        });
      });

      Promise.all(loadPromises).then(() => {
        if (frameImage) {
          combinedCtx.drawImage(frameImage, 0, 0, combinedCanvas.width, combinedCanvas.height);
        }
        resolve();
      });
    });
  }

  // === Show download section ===
  function showDownloadCombined() {
    const container = document.createElement('div');
    container.className = 'download-section';

    const finalImg = new Image();
    finalImg.src = combinedCanvas.toDataURL('image/png');
    finalImg.alt = 'Khung 4 ảnh';

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = '⬇️ Tải Khung 4 Ảnh';
    downloadBtn.onclick = () => {
      const link = document.createElement('a');
      link.href = finalImg.src;
      link.download = 'photobooth_4in1.png';
      link.click();
    };

    buttonContainer.appendChild(downloadBtn);
    container.appendChild(finalImg);
    container.appendChild(buttonContainer);
    photoStrip.appendChild(container);

    // Ẩn nút chụp ảnh và hiện nút làm lại
    captureBtn.style.display = 'none';
    resetBtn.style.display = 'block';
  }

  // === Frame selection handler ===
  frameSelect.addEventListener('change', (e) => {
    const path = e.target.value;
    frameImage = path ? new Image() : null;
    if (frameImage) {
      frameImage.onload = () => console.log('Frame loaded successfully');
      frameImage.onerror = (err) => {
        console.error('Error loading frame:', err);
        alert('Không thể tải khung ảnh: ' + err.message);
      };
      frameImage.src = path;
    }
  });

  // === Photo capture sequence ===
  function takePhotoSequence() {
    if (isCapturing) return;
    
    isCapturing = true;
    
    // Vô hiệu hóa tất cả điều khiển
    captureBtn.disabled = true;
    captureBtn.style.opacity = '0.5';
    captureBtn.style.cursor = 'not-allowed';
    
    resetBtn.disabled = true;
    resetBtn.style.opacity = '0.5';
    resetBtn.style.cursor = 'not-allowed';
    
    filterSelect.disabled = true;
    filterSelect.style.opacity = '0.5';
    filterSelect.style.cursor = 'not-allowed';
    
    frameSelect.disabled = true;
    frameSelect.style.opacity = '0.5';
    frameSelect.style.cursor = 'not-allowed';
    
    // Tạo preview container mới mỗi lần chụp
    previewContainer = createPreviewContainer();
    photoStrip.innerHTML = ''; // Xóa nội dung cũ
    photoStrip.appendChild(previewContainer);
    
    capturedPhotos = [];
    
    const totalPhotos = 4;
    let currentPhoto = 0;
    
    const captureNextPhoto = async () => {
      if (currentPhoto < totalPhotos) {
        await countdown(3);
        showFlash();
        
        const img = capturePhoto();
        capturedPhotos.push(img);
        
        addPhotoToPreview(previewContainer, img.src, currentPhoto);
        currentPhoto++;
        
        if (currentPhoto < totalPhotos) {
          captureNextPhoto();
        } else {
          isCapturing = false;
          
          // Kích hoạt lại tất cả điều khiển
          captureBtn.disabled = false;
          captureBtn.style.opacity = '1';
          captureBtn.style.cursor = 'pointer';
          
          resetBtn.disabled = false;
          resetBtn.style.opacity = '1';
          resetBtn.style.cursor = 'pointer';
          
          filterSelect.disabled = false;
          filterSelect.style.opacity = '1';
          filterSelect.style.cursor = 'pointer';
          
          frameSelect.disabled = false;
          frameSelect.style.opacity = '1';
          frameSelect.style.cursor = 'pointer';
          
          await createCombinedImage();
          showDownloadCombined();
          
          setTimeout(() => {
            if (previewContainer) {
              previewContainer.remove();
              previewContainer = null;
            }
          }, 1000);
        }
      }
    };

    captureNextPhoto();
  }

  // === Event handlers ===
  captureBtn.addEventListener('click', () => {
    if (isCapturing) return;
    console.log("Đã nhấn nút chụp ảnh");
    takePhotoSequence();
  });

  resetBtn.addEventListener('click', () => {
    if (isCapturing) return;
    
    photoStrip.innerHTML = '';
    capturedPhotos = [];
    if (previewContainer) {
      previewContainer.remove();
      previewContainer = null;
    }
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
    // Kích hoạt lại tất cả điều khiển
    captureBtn.disabled = false;
    captureBtn.style.opacity = '1';
    captureBtn.style.cursor = 'pointer';
    
    resetBtn.disabled = false;
    resetBtn.style.opacity = '1';
    resetBtn.style.cursor = 'pointer';
    
    filterSelect.disabled = false;
    filterSelect.style.opacity = '1';
    filterSelect.style.cursor = 'pointer';
    
    frameSelect.disabled = false;
    frameSelect.style.opacity = '1';
    frameSelect.style.cursor = 'pointer';
    
    // Hiện nút chụp ảnh và ẩn nút làm lại
    captureBtn.style.display = 'block';
    resetBtn.style.display = 'none';
    
    takePhotoSequence();
  });

  // === Initialize ===
  startWebcam();
  setupFilters();
  
  // Ẩn nút làm lại khi khởi động
  resetBtn.style.display = 'none';
});
