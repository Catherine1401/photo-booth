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
  let combinedCanvas, combinedCtx;
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

  // === Countdown 3-2-1 animation ===
  function countdown(seconds) {
    return new Promise((resolve) => {
      let current = seconds;
      countdownEl.textContent = current;
      countdownEl.classList.remove('hidden');

      const timer = setInterval(() => {
        current--;
        if (current === 0) {
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
    const filterSelect = document.getElementById('filter-select');
    const webcam = document.getElementById('webcam');
    
    filterSelect.addEventListener('change', () => {
      // Remove all filter classes
      webcam.classList.forEach(className => {
        if (className.startsWith('filter-')) {
          webcam.classList.remove(className);
        }
      });
      
      // Apply selected filter
      const selectedFilter = filterSelect.value;
      if (selectedFilter) {
        webcam.classList.add(`filter-${selectedFilter}`);
      }
    });
  }

  // === Apply filter to captured photos ===
  function applyFilterToPhoto(img, filterName) {
    if (filterName) {
      img.classList.add(`filter-${filterName}`);
    }
  }

  // === Update photo capture to include filter ===
  function capturePhoto() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const webcam = document.getElementById('webcam');
    const filterSelect = document.getElementById('filter-select');
    const selectedFilter = filterSelect.value;
    
    canvas.width = webcam.videoWidth;
    canvas.height = webcam.videoHeight;
    
    // Draw the current frame
    context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
    
    // Create new image
    const img = document.createElement('img');
    img.src = canvas.toDataURL('image/jpeg');
    
    // Apply selected filter
    if (selectedFilter) {
      applyFilterToPhoto(img, selectedFilter);
    }
    
    return img;
  }

  // === Create preview container ===
  function createPreviewContainer() {
    const container = document.createElement('div');
    container.className = 'preview-container';
    container.style.display = 'flex';
    container.style.flexDirection = 'row';
    container.style.flexWrap = 'wrap';
    container.style.justifyContent = 'center';
    container.style.gap = '10px';
    container.style.width = '100%';
    container.style.maxWidth = '800px';
    container.style.margin = '0 auto';
    container.style.padding = '10px';
    return container;
  }

  // === Add photo to preview ===
  function addPhotoToPreview(container, photo, index) {
    const photoContainer = document.createElement('div');
    photoContainer.className = 'photo-container';
    photoContainer.style.width = 'calc(50% - 5px)';
    photoContainer.style.minWidth = '200px';
    photoContainer.style.height = '0';
    photoContainer.style.paddingBottom = '75%'; // 4:3 aspect ratio
    photoContainer.style.position = 'relative';
    photoContainer.style.overflow = 'hidden';
    photoContainer.style.borderRadius = '8px';
    photoContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    photoContainer.style.backgroundColor = '#f0f0f0';

    const img = new Image();
    img.src = photo;
    img.style.position = 'absolute';
    img.style.top = '0';
    img.style.left = '0';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.alt = `Ảnh ${index + 1}`;

    photoContainer.appendChild(img);
    container.appendChild(photoContainer);
  }

  // === Update photo sequence to maintain filter ===
  function takePhotoSequence() {
    if (isCapturing) return;
    
    isCapturing = true;
    const captureButton = document.getElementById('capture-btn');
    captureButton.disabled = true;
    
    const totalPhotos = 4;
    let currentPhoto = 0;
    
    const captureInterval = setInterval(() => {
      if (currentPhoto < totalPhotos) {
        const img = capturePhoto();
        addPhotoToPreview(previewContainer, img.src, currentPhoto);
        currentPhoto++;
      } else {
        clearInterval(captureInterval);
        isCapturing = false;
        captureButton.disabled = false;
        showDownloadCombined();
      }
    }, 1000);
  }

  // === Hiển thị nút tải ảnh khung 4in1 ===
  function showDownloadCombined() {
    const container = document.createElement('div');
    container.className = 'photo-container';
    container.style.maxWidth = '800px';
    container.style.margin = '20px auto';
    container.style.padding = '0 10px';

    const finalImg = new Image();
    finalImg.src = combinedCanvas.toDataURL('image/png');
    finalImg.alt = 'Khung 4 ảnh';
    finalImg.style.width = '100%';
    finalImg.style.height = 'auto';
    finalImg.style.display = 'block';
    finalImg.style.borderRadius = '8px';
    finalImg.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = '⬇️ Tải Khung 4 Ảnh';
    downloadBtn.style.marginTop = '16px';
    downloadBtn.style.width = '100%';
    downloadBtn.style.padding = '12px';
    downloadBtn.style.borderRadius = '8px';
    downloadBtn.style.border = 'none';
    downloadBtn.style.background = '#4CAF50';
    downloadBtn.style.color = 'white';
    downloadBtn.style.cursor = 'pointer';
    downloadBtn.style.fontSize = '16px';
    downloadBtn.style.fontWeight = 'bold';
    downloadBtn.onclick = () => {
      const link = document.createElement('a');
      link.href = finalImg.src;
      link.download = 'photobooth_4in1.png';
      link.click();
    };

    container.appendChild(finalImg);
    container.appendChild(downloadBtn);
    photoStrip.appendChild(container);
  }

  // === Event: chọn khung ===
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

  // === Event: chụp ảnh ===
  captureBtn.addEventListener('click', () => {
    console.log("Đã nhấn nút chụp ảnh");
    takePhotoSequence();
  });

  // === Event: reset lại ===
  resetBtn.addEventListener('click', () => {
    photoStrip.innerHTML = '';
    resetBtn.classList.add('hidden');
    captureBtn.disabled = false;
    capturedPhotos = [];
    if (previewContainer) {
      previewContainer.remove();
      previewContainer = null;
    }
  });

  // === Start webcam when ready ===
  startWebcam();

  // === Initialize filters ===
  setupFilters();
});
