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
  let originalPhotos = []; // Store original photos without frames
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
      
      // Đợi webcam sẵn sàng
      await new Promise((resolve) => {
        webcam.onloadedmetadata = () => {
          console.log('Webcam loaded:', webcam.videoWidth, 'x', webcam.videoHeight);
          overlayCanvas.width = webcam.videoWidth;
          overlayCanvas.height = webcam.videoHeight;
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
    
    // Trả về URL của ảnh thay vì đối tượng img
    return canvas.toDataURL('image/jpeg');
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
    img.onload = () => {
      console.log(`Preview image ${index + 1} loaded:`, img.width, 'x', img.height);
    };
    img.onerror = (err) => {
      console.error(`Error loading preview image ${index + 1}:`, err);
    };

    photoContainer.appendChild(img);
    container.appendChild(photoContainer);
  }

  // === Apply frame to photo ===
  function applyFrameToPhoto(photoData, framePath) {
    return new Promise((resolve) => {
      console.log('Applying frame:', framePath);
      
      if (!framePath) {
        console.log('No frame selected, returning original photo');
        resolve(photoData);
        return;
      }

      const img = new Image();
      img.onload = () => {
        console.log('Frame loaded:', img.width, 'x', img.height);
        
        const canvas = document.createElement('canvas');
        canvas.width = 150;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');

        // Draw the photo
        const photoImg = new Image();
        photoImg.onload = () => {
          console.log('Photo loaded:', photoImg.width, 'x', photoImg.height);
          
          // Calculate aspect ratio and dimensions
          const photoAspectRatio = photoImg.width / photoImg.height;
          const targetAspectRatio = canvas.width / canvas.height;
          
          let sourceX = 0, sourceY = 0, sourceWidth = photoImg.width, sourceHeight = photoImg.height;
          let destX = 0, destY = 0, destWidth = canvas.width, destHeight = canvas.height;
          
          if (photoAspectRatio > targetAspectRatio) {
            // Photo is wider than target
            destWidth = canvas.height * photoAspectRatio;
            destX = (canvas.width - destWidth) / 2;
          } else {
            // Photo is taller than target
            destHeight = canvas.width / photoAspectRatio;
            destY = (canvas.height - destHeight) / 2;
          }

          console.log('Drawing photo with dimensions:', {
            source: { x: sourceX, y: sourceY, width: sourceWidth, height: sourceHeight },
            dest: { x: destX, y: destY, width: destWidth, height: destHeight }
          });

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw the photo with proper scaling
          ctx.drawImage(
            photoImg,
            sourceX, sourceY, sourceWidth, sourceHeight,
            destX, destY, destWidth, destHeight
          );
          
          // Draw the frame on top
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Verify the canvas has content
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const hasContent = imageData.data.some(pixel => pixel !== 0);
          console.log('Canvas has content:', hasContent);
          
          const result = canvas.toDataURL('image/png');
          console.log('Frame applied successfully');
          resolve(result);
        };
        photoImg.onerror = (err) => {
          console.error('Error loading photo:', err);
          resolve(photoData);
        };
        photoImg.src = photoData;
      };
      img.onerror = (err) => {
        console.error('Error loading frame:', err);
        resolve(photoData);
      };
      img.src = framePath;
    });
  }

  // === Frame selection handler ===
  frameSelect.addEventListener('change', async () => {
    console.log('Frame selection changed:', frameSelect.value);
    
    if (capturedPhotos.length === 0) {
      console.log('No photos to apply frame to');
      return;
    }

    const selectedFrame = frameSelect.value;
    
    console.log('Applying new frame to', originalPhotos.length, 'photos');
    
    // Apply new frame to all photos
    const newPhotos = await Promise.all(
      originalPhotos.map((photo, index) => {
        console.log(`Applying frame to photo ${index + 1}`);
        return applyFrameToPhoto(photo, selectedFrame);
      })
    );
    
    console.log('All frames applied');
    capturedPhotos = newPhotos;

    // Update preview
    console.log('Updating preview');
    const previewContainer = document.querySelector('.preview-container');
    if (previewContainer) {
      // Clear existing preview
      previewContainer.innerHTML = '';
      
      // Add each photo to preview
      capturedPhotos.forEach((photo, index) => {
        addPhotoToPreview(previewContainer, photo, index);
      });
    }

    // Update combined image
    console.log('Creating combined image');
    await createCombinedImage();
    
    // Update download section if it exists
    const downloadSection = document.querySelector('.download-section');
    if (downloadSection) {
      console.log('Updating download section');
      const finalImg = downloadSection.querySelector('img');
      if (finalImg) {
        finalImg.src = combinedCanvas.toDataURL('image/png');
      }
    }
  });

  // === Reset button handler ===
  resetBtn.addEventListener('click', () => {
    if (isCapturing) return;
    
    // Xóa cả preview và download section
    photoStrip.innerHTML = '';
    capturedPhotos = [];
    originalPhotos = [];
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
  });

  // === Photo capture sequence ===
  async function takePhotoSequence() {
    if (isCapturing) return;
    isCapturing = true;

    // Kiểm tra webcam đã sẵn sàng
    if (webcam.readyState !== webcam.HAVE_ENOUGH_DATA) {
      console.log('Webcam chưa sẵn sàng, vui lòng đợi...');
      isCapturing = false;
      return;
    }

    // Disable all controls
    captureBtn.disabled = true;
    resetBtn.disabled = true;
    filterSelect.disabled = true;
    frameSelect.disabled = true;

    // Set visual feedback for disabled state
    captureBtn.style.opacity = '0.5';
    resetBtn.style.opacity = '0.5';
    filterSelect.style.opacity = '0.5';
    frameSelect.style.opacity = '0.5';
    captureBtn.style.cursor = 'not-allowed';
    resetBtn.style.cursor = 'not-allowed';
    filterSelect.style.cursor = 'not-allowed';
    frameSelect.style.cursor = 'not-allowed';

    // Create new preview container
    const previewContainer = document.createElement('div');
    previewContainer.className = 'preview-container';
    photoStrip.innerHTML = '';
    photoStrip.appendChild(previewContainer);

    capturedPhotos = [];
    originalPhotos = [];

    try {
      for (let i = 0; i < 4; i++) {
        // Hiển thị countdown
        for (let j = 3; j >= 0; j--) {
          countdownEl.textContent = j;
          countdownEl.classList.remove('hidden');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        countdownEl.classList.add('hidden');

        // Đợi 0.5 giây trước khi chụp
        await new Promise(resolve => setTimeout(resolve, 500));

        // Kiểm tra webcam trước khi chụp
        if (webcam.readyState !== webcam.HAVE_ENOUGH_DATA) {
          console.log('Webcam chưa sẵn sàng, bỏ qua lần chụp này');
          continue;
        }

        // Capture photo
        const photoData = capturePhoto();
        originalPhotos.push(photoData);

        // Apply current frame
        const selectedFrame = frameSelect.value;
        const framedPhoto = await applyFrameToPhoto(photoData, selectedFrame);
        capturedPhotos.push(framedPhoto);

        // Add photo to preview
        addPhotoToPreview(previewContainer, framedPhoto, i);

        // Show flash effect
        showFlash();

        // Đợi 1 giây trước khi bắt đầu countdown tiếp theo
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Create combined image
      await createCombinedImage();

      // Show download and retake buttons
      showDownloadCombined();
    } catch (error) {
      console.error('Error during photo capture:', error);
    } finally {
      // Re-enable all controls
      captureBtn.disabled = false;
      resetBtn.disabled = false;
      filterSelect.disabled = false;
      frameSelect.disabled = false;

      // Reset visual feedback
      captureBtn.style.opacity = '1';
      resetBtn.style.opacity = '1';
      filterSelect.style.opacity = '1';
      frameSelect.style.opacity = '1';
      captureBtn.style.cursor = 'pointer';
      resetBtn.style.cursor = 'pointer';
      filterSelect.style.cursor = 'pointer';
      frameSelect.style.cursor = 'pointer';

      isCapturing = false;
    }
  }

  // === Event handlers ===
  captureBtn.addEventListener('click', () => {
    if (isCapturing) return;
    console.log("Đã nhấn nút chụp ảnh");
    takePhotoSequence();
  });

  // === Initialize ===
  startWebcam();
  setupFilters();
  
  // Ẩn nút làm lại khi khởi động
  resetBtn.style.display = 'none';

  // === Create combined 4-in-1 image ===
  function createCombinedImage() {
    return new Promise((resolve) => {
      console.log('Creating combined image');
      
      // Set canvas size for vertical layout with smaller dimensions
      combinedCanvas.width = 150;
      combinedCanvas.height = 600;
      combinedCtx.fillStyle = '#ffffff';
      combinedCtx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

      const sectionHeight = combinedCanvas.height / 4;

      const loadPromises = capturedPhotos.map((photoData, index) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            console.log(`Drawing photo ${index + 1} to combined image`);
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
          img.onerror = (err) => {
            console.error(`Error loading photo ${index + 1}:`, err);
            resolve();
          };
          img.src = photoData;
        });
      });

      Promise.all(loadPromises).then(async () => {
        // Áp dụng khung ảnh cho ảnh kết hợp
        const selectedFrame = frameSelect.value;
        if (selectedFrame) {
          console.log('Applying frame to combined image');
          const frameImg = new Image();
          frameImg.onload = () => {
            // Draw the frame on top of the combined image
            combinedCtx.drawImage(frameImg, 0, 0, combinedCanvas.width, combinedCanvas.height);
            console.log('Frame applied to combined image');
            resolve();
          };
          frameImg.onerror = (err) => {
            console.error('Error applying frame to combined image:', err);
            resolve();
          };
          frameImg.src = selectedFrame;
        } else {
          console.log('No frame selected for combined image');
          resolve();
        }
      });
    });
  }

  // === Show download section ===
  function showDownloadCombined() {
    // Xóa preview và hiển thị download section
    photoStrip.innerHTML = '';

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
});
