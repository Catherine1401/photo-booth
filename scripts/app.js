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
      webcam.classList.forEach(className => {
        if (className.startsWith('filter-')) {
          webcam.classList.remove(className);
        }
      });
      
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

  // === Capture photo ===
  function capturePhoto() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = webcam.videoWidth;
    canvas.height = webcam.videoHeight;
    
    context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
    
    const img = document.createElement('img');
    img.src = canvas.toDataURL('image/jpeg');
    
    if (filterSelect.value) {
      applyFilterToPhoto(img, filterSelect.value);
    }
    
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

            combinedCtx.drawImage(
              img,
              sourceX, sourceY, sourceWidth, sourceHeight,
              0, y, combinedCanvas.width, sectionHeight
            );
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
    captureBtn.disabled = true;
    
    if (!previewContainer) {
      previewContainer = createPreviewContainer();
      photoStrip.appendChild(previewContainer);
    }
    
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
          captureBtn.disabled = false;
          
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
    console.log("Đã nhấn nút chụp ảnh");
    takePhotoSequence();
  });

  resetBtn.addEventListener('click', () => {
    photoStrip.innerHTML = '';
    captureBtn.disabled = false;
    capturedPhotos = [];
    if (previewContainer) {
      previewContainer.remove();
      previewContainer = null;
    }
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    takePhotoSequence();
  });

  // === Initialize ===
  startWebcam();
  setupFilters();
});
