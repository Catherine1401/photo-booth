// === Constants ===
const FRAME_TYPES = {
  NONE: 'none',
  WOOD: 'wood',
  VINTAGE: 'vintage',
  GOLD: 'gold',
  CLASSIC: 'classic',
  ELEGANT: 'elegant',
  ORNATE: 'ornate',
  FLORAL: 'floral',
  VICTORIAN: 'victorian',
  PINK_CUTE: 'pink_cute',
  PINK_FLORAL: 'pink_floral',
  PINK_HEART: 'pink_heart',
  KITTY: 'kitty',
  BUNNY: 'bunny',
  STAR: 'star',
  CLOUD: 'cloud',
  RAINBOW: 'rainbow'
};

// === Pattern Generators ===
function createWoodPattern(ctx, width, height) {
  const pattern = ctx.createLinearGradient(0, 0, width, height);
  pattern.addColorStop(0, '#8B4513');
  pattern.addColorStop(0.1, '#A0522D');
  pattern.addColorStop(0.2, '#8B4513');
  pattern.addColorStop(0.3, '#A0522D');
  pattern.addColorStop(0.4, '#8B4513');
  pattern.addColorStop(0.5, '#A0522D');
  pattern.addColorStop(0.6, '#8B4513');
  pattern.addColorStop(0.7, '#A0522D');
  pattern.addColorStop(0.8, '#8B4513');
  pattern.addColorStop(0.9, '#A0522D');
  pattern.addColorStop(1, '#8B4513');
  return pattern;
}

function createVintagePattern(ctx, width, height) {
  const pattern = ctx.createLinearGradient(0, 0, width, height);
  pattern.addColorStop(0, '#f5e6d3');
  pattern.addColorStop(0.2, '#f8e8d0');
  pattern.addColorStop(0.4, '#f5e6d3');
  pattern.addColorStop(0.6, '#f8e8d0');
  pattern.addColorStop(0.8, '#f5e6d3');
  pattern.addColorStop(1, '#f8e8d0');
  return pattern;
}

function createGoldPattern(ctx, width, height) {
  const pattern = ctx.createLinearGradient(0, 0, width, height);
  pattern.addColorStop(0, '#FFD700');
  pattern.addColorStop(0.2, '#D4AF37');
  pattern.addColorStop(0.4, '#FFD700');
  pattern.addColorStop(0.6, '#D4AF37');
  pattern.addColorStop(0.8, '#FFD700');
  pattern.addColorStop(1, '#D4AF37');
  return pattern;
}

function createOrnatePattern(ctx, width, height) {
  // Create base gradient
  const basePattern = ctx.createLinearGradient(0, 0, width, height);
  basePattern.addColorStop(0, '#D4AF37');
  basePattern.addColorStop(0.5, '#FFD700');
  basePattern.addColorStop(1, '#D4AF37');

  // Draw ornate border
  ctx.fillStyle = basePattern;
  ctx.fillRect(0, 0, width, height);

  // Add decorative elements
  ctx.strokeStyle = '#B8860B';
  ctx.lineWidth = 2;
  
  // Draw corner swirls
  const cornerSize = Math.min(width, height) * 0.2;
  for (let x = 0; x < width; x += cornerSize) {
    for (let y = 0; y < height; y += cornerSize) {
      if ((x === 0 || x === width - cornerSize) && 
          (y === 0 || y === height - cornerSize)) {
        drawCornerSwirl(ctx, x, y, cornerSize);
      }
    }
  }

  return basePattern;
}

function createFloralPattern(ctx, width, height) {
  // Create base gradient
  const basePattern = ctx.createLinearGradient(0, 0, width, height);
  basePattern.addColorStop(0, '#FFF8DC');
  basePattern.addColorStop(0.5, '#FFE4B5');
  basePattern.addColorStop(1, '#FFF8DC');

  // Draw base
  ctx.fillStyle = basePattern;
  ctx.fillRect(0, 0, width, height);

  // Add floral elements
  ctx.strokeStyle = '#DEB887';
  ctx.lineWidth = 1.5;
  
  // Draw floral border
  const borderSize = Math.min(width, height) * 0.15;
  for (let x = borderSize; x < width - borderSize; x += borderSize * 2) {
    drawFloralElement(ctx, x, borderSize, borderSize);
    drawFloralElement(ctx, x, height - borderSize, borderSize);
  }
  for (let y = borderSize; y < height - borderSize; y += borderSize * 2) {
    drawFloralElement(ctx, borderSize, y, borderSize);
    drawFloralElement(ctx, width - borderSize, y, borderSize);
  }

  return basePattern;
}

function createVictorianPattern(ctx, width, height) {
  // Create base gradient
  const basePattern = ctx.createLinearGradient(0, 0, width, height);
  basePattern.addColorStop(0, '#F5F5DC');
  basePattern.addColorStop(0.5, '#FAEBD7');
  basePattern.addColorStop(1, '#F5F5DC');

  // Draw base
  ctx.fillStyle = basePattern;
  ctx.fillRect(0, 0, width, height);

  // Add Victorian elements
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 2;
  
  // Draw corner decorations
  const cornerSize = Math.min(width, height) * 0.25;
  for (let x = 0; x < width; x += cornerSize) {
    for (let y = 0; y < height; y += cornerSize) {
      if ((x === 0 || x === width - cornerSize) && 
          (y === 0 || y === height - cornerSize)) {
        drawVictorianCorner(ctx, x, y, cornerSize);
      }
    }
  }

  return basePattern;
}

function createPinkCutePattern(ctx, width, height) {
  // Create base gradient
  const basePattern = ctx.createLinearGradient(0, 0, width, height);
  basePattern.addColorStop(0, '#FFB6C1');
  basePattern.addColorStop(0.5, '#FFC0CB');
  basePattern.addColorStop(1, '#FFB6C1');

  // Draw base
  ctx.fillStyle = basePattern;
  ctx.fillRect(0, 0, width, height);

  // Add cute elements
  ctx.strokeStyle = '#FF69B4';
  ctx.lineWidth = 2;
  
  // Draw hearts in corners
  const cornerSize = Math.min(width, height) * 0.2;
  for (let x = 0; x < width; x += cornerSize) {
    for (let y = 0; y < height; y += cornerSize) {
      if ((x === 0 || x === width - cornerSize) && 
          (y === 0 || y === height - cornerSize)) {
        drawHeart(ctx, x + cornerSize/2, y + cornerSize/2, cornerSize/2);
      }
    }
  }

  // Draw small hearts along borders
  const borderSize = Math.min(width, height) * 0.15;
  for (let x = borderSize; x < width - borderSize; x += borderSize) {
    drawHeart(ctx, x, borderSize, borderSize/3);
    drawHeart(ctx, x, height - borderSize, borderSize/3);
  }
  for (let y = borderSize; y < height - borderSize; y += borderSize) {
    drawHeart(ctx, borderSize, y, borderSize/3);
    drawHeart(ctx, width - borderSize, y, borderSize/3);
  }

  return basePattern;
}

function createPinkFloralPattern(ctx, width, height) {
  // Create base gradient
  const basePattern = ctx.createLinearGradient(0, 0, width, height);
  basePattern.addColorStop(0, '#FFE4E1');
  basePattern.addColorStop(0.5, '#FFF0F5');
  basePattern.addColorStop(1, '#FFE4E1');

  // Draw base
  ctx.fillStyle = basePattern;
  ctx.fillRect(0, 0, width, height);

  // Add floral elements
  ctx.strokeStyle = '#FF69B4';
  ctx.lineWidth = 1.5;
  
  // Draw flowers along borders
  const borderSize = Math.min(width, height) * 0.15;
  for (let x = borderSize; x < width - borderSize; x += borderSize * 1.5) {
    drawCuteFlower(ctx, x, borderSize, borderSize/2);
    drawCuteFlower(ctx, x, height - borderSize, borderSize/2);
  }
  for (let y = borderSize; y < height - borderSize; y += borderSize * 1.5) {
    drawCuteFlower(ctx, borderSize, y, borderSize/2);
    drawCuteFlower(ctx, width - borderSize, y, borderSize/2);
  }

  return basePattern;
}

function createPinkHeartPattern(ctx, width, height) {
  // Create base gradient
  const basePattern = ctx.createLinearGradient(0, 0, width, height);
  basePattern.addColorStop(0, '#FFB6C1');
  basePattern.addColorStop(0.5, '#FFC0CB');
  basePattern.addColorStop(1, '#FFB6C1');

  // Draw base
  ctx.fillStyle = basePattern;
  ctx.fillRect(0, 0, width, height);

  // Add heart pattern
  ctx.strokeStyle = '#FF69B4';
  ctx.lineWidth = 1;
  
  // Draw small hearts in pattern
  const heartSize = Math.min(width, height) * 0.1;
  for (let x = heartSize; x < width; x += heartSize * 2) {
    for (let y = heartSize; y < height; y += heartSize * 2) {
      drawSmallHeart(ctx, x, y, heartSize/2);
    }
  }

  return basePattern;
}

function createKittyPattern(ctx, width, height) {
  // Create base gradient
  const basePattern = ctx.createLinearGradient(0, 0, width, height);
  basePattern.addColorStop(0, '#FFE4E1');
  basePattern.addColorStop(0.5, '#FFF0F5');
  basePattern.addColorStop(1, '#FFE4E1');

  // Draw base
  ctx.fillStyle = basePattern;
  ctx.fillRect(0, 0, width, height);

  // Add kitty elements
  ctx.strokeStyle = '#FF69B4';
  ctx.lineWidth = 1.5;
  
  // Draw kitty faces in corners
  const cornerSize = Math.min(width, height) * 0.2;
  for (let x = 0; x < width; x += cornerSize) {
    for (let y = 0; y < height; y += cornerSize) {
      if ((x === 0 || x === width - cornerSize) && 
          (y === 0 || y === height - cornerSize)) {
        drawKittyFace(ctx, x + cornerSize/2, y + cornerSize/2, cornerSize/2);
      }
    }
  }

  // Draw small paw prints along borders
  const borderSize = Math.min(width, height) * 0.15;
  for (let x = borderSize; x < width - borderSize; x += borderSize) {
    drawPawPrint(ctx, x, borderSize, borderSize/3);
    drawPawPrint(ctx, x, height - borderSize, borderSize/3);
  }
  for (let y = borderSize; y < height - borderSize; y += borderSize) {
    drawPawPrint(ctx, borderSize, y, borderSize/3);
    drawPawPrint(ctx, width - borderSize, y, borderSize/3);
  }

  return basePattern;
}

function createBunnyPattern(ctx, width, height) {
  // Create base gradient
  const basePattern = ctx.createLinearGradient(0, 0, width, height);
  basePattern.addColorStop(0, '#F0F8FF');
  basePattern.addColorStop(0.5, '#E6E6FA');
  basePattern.addColorStop(1, '#F0F8FF');

  // Draw base
  ctx.fillStyle = basePattern;
  ctx.fillRect(0, 0, width, height);

  // Add bunny elements
  ctx.strokeStyle = '#9370DB';
  ctx.lineWidth = 1.5;
  
  // Draw bunny faces in corners
  const cornerSize = Math.min(width, height) * 0.2;
  for (let x = 0; x < width; x += cornerSize) {
    for (let y = 0; y < height; y += cornerSize) {
      if ((x === 0 || x === width - cornerSize) && 
          (y === 0 || y === height - cornerSize)) {
        drawBunnyFace(ctx, x + cornerSize/2, y + cornerSize/2, cornerSize/2);
      }
    }
  }

  // Draw carrots along borders
  const borderSize = Math.min(width, height) * 0.15;
  for (let x = borderSize; x < width - borderSize; x += borderSize * 1.5) {
    drawCarrot(ctx, x, borderSize, borderSize/2);
    drawCarrot(ctx, x, height - borderSize, borderSize/2);
  }
  for (let y = borderSize; y < height - borderSize; y += borderSize * 1.5) {
    drawCarrot(ctx, borderSize, y, borderSize/2);
    drawCarrot(ctx, width - borderSize, y, borderSize/2);
  }

  return basePattern;
}

function createStarPattern(ctx, width, height) {
  // Create base gradient
  const basePattern = ctx.createLinearGradient(0, 0, width, height);
  basePattern.addColorStop(0, '#E6E6FA');
  basePattern.addColorStop(0.5, '#F0F8FF');
  basePattern.addColorStop(1, '#E6E6FA');

  // Draw base
  ctx.fillStyle = basePattern;
  ctx.fillRect(0, 0, width, height);

  // Add star elements
  ctx.strokeStyle = '#9370DB';
  ctx.lineWidth = 1;
  
  // Draw stars in pattern
  const starSize = Math.min(width, height) * 0.1;
  for (let x = starSize; x < width; x += starSize * 2) {
    for (let y = starSize; y < height; y += starSize * 2) {
      drawStar(ctx, x, y, starSize/2);
    }
  }

  return basePattern;
}

function createCloudPattern(ctx, width, height) {
  // Create base gradient
  const basePattern = ctx.createLinearGradient(0, 0, width, height);
  basePattern.addColorStop(0, '#F0F8FF');
  basePattern.addColorStop(0.5, '#E6E6FA');
  basePattern.addColorStop(1, '#F0F8FF');

  // Draw base
  ctx.fillStyle = basePattern;
  ctx.fillRect(0, 0, width, height);

  // Add cloud elements
  ctx.strokeStyle = '#87CEEB';
  ctx.lineWidth = 1.5;
  
  // Draw clouds along borders
  const borderSize = Math.min(width, height) * 0.15;
  for (let x = borderSize; x < width - borderSize; x += borderSize * 2) {
    drawCloud(ctx, x, borderSize, borderSize);
    drawCloud(ctx, x, height - borderSize, borderSize);
  }
  for (let y = borderSize; y < height - borderSize; y += borderSize * 2) {
    drawCloud(ctx, borderSize, y, borderSize);
    drawCloud(ctx, width - borderSize, y, borderSize);
  }

  return basePattern;
}

function createRainbowPattern(ctx, width, height) {
  // Create base gradient
  const basePattern = ctx.createLinearGradient(0, 0, width, height);
  basePattern.addColorStop(0, '#FFE4E1');
  basePattern.addColorStop(0.5, '#F0F8FF');
  basePattern.addColorStop(1, '#FFE4E1');

  // Draw base
  ctx.fillStyle = basePattern;
  ctx.fillRect(0, 0, width, height);

  // Add rainbow elements
  const borderSize = Math.min(width, height) * 0.15;
  
  // Draw rainbow border
  const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
  const arcHeight = borderSize * 0.8;
  
  for (let i = 0; i < colors.length; i++) {
    ctx.beginPath();
    ctx.strokeStyle = colors[i];
    ctx.lineWidth = borderSize / colors.length;
    ctx.arc(width/2, height/2, 
      Math.min(width, height)/2 - borderSize + i * (borderSize / colors.length),
      0, Math.PI * 2);
    ctx.stroke();
  }

  // Draw small clouds in corners
  const cornerSize = Math.min(width, height) * 0.2;
  for (let x = 0; x < width; x += cornerSize) {
    for (let y = 0; y < height; y += cornerSize) {
      if ((x === 0 || x === width - cornerSize) && 
          (y === 0 || y === height - cornerSize)) {
        drawCloud(ctx, x + cornerSize/2, y + cornerSize/2, cornerSize/2);
      }
    }
  }

  return basePattern;
}

// === Helper Functions for Drawing Patterns ===
function drawCornerSwirl(ctx, x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(
    x + size * 0.5, y,
    x + size * 0.5, y + size * 0.5,
    x, y + size * 0.5
  );
  ctx.stroke();
}

function drawFloralElement(ctx, x, y, size) {
  ctx.beginPath();
  ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
  ctx.stroke();
  
  // Draw petals
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const petalX = x + Math.cos(angle) * size * 0.4;
    const petalY = y + Math.sin(angle) * size * 0.4;
    ctx.beginPath();
    ctx.arc(petalX, petalY, size * 0.2, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawVictorianCorner(ctx, x, y, size) {
  // Draw main corner element
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x, y + size);
  ctx.closePath();
  ctx.stroke();

  // Add decorative elements
  const spacing = size / 4;
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(x + spacing * i, y);
    ctx.lineTo(x, y + spacing * i);
    ctx.stroke();
  }
}

function drawHeart(ctx, x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.3);
  ctx.bezierCurveTo(
    x, y, 
    x - size, y, 
    x - size, y + size * 0.3
  );
  ctx.bezierCurveTo(
    x - size, y + size * 0.6, 
    x, y + size * 0.8, 
    x, y + size * 0.8
  );
  ctx.bezierCurveTo(
    x, y + size * 0.8, 
    x + size, y + size * 0.6, 
    x + size, y + size * 0.3
  );
  ctx.bezierCurveTo(
    x + size, y, 
    x, y, 
    x, y + size * 0.3
  );
  ctx.stroke();
}

function drawCuteFlower(ctx, x, y, size) {
  // Draw center
  ctx.beginPath();
  ctx.arc(x, y, size * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = '#FF69B4';
  ctx.fill();
  
  // Draw petals
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const petalX = x + Math.cos(angle) * size * 0.4;
    const petalY = y + Math.sin(angle) * size * 0.4;
    ctx.beginPath();
    ctx.arc(petalX, petalY, size * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#FFB6C1';
    ctx.fill();
  }
}

function drawSmallHeart(ctx, x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.3);
  ctx.bezierCurveTo(
    x, y, 
    x - size, y, 
    x - size, y + size * 0.3
  );
  ctx.bezierCurveTo(
    x - size, y + size * 0.6, 
    x, y + size * 0.8, 
    x, y + size * 0.8
  );
  ctx.bezierCurveTo(
    x, y + size * 0.8, 
    x + size, y + size * 0.6, 
    x + size, y + size * 0.3
  );
  ctx.bezierCurveTo(
    x + size, y, 
    x, y, 
    x, y + size * 0.3
  );
  ctx.fillStyle = '#FF69B4';
  ctx.fill();
}

function drawKittyFace(ctx, x, y, size) {
  // Draw face
  ctx.beginPath();
  ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
  ctx.stroke();
  
  // Draw ears
  ctx.beginPath();
  ctx.moveTo(x - size * 0.5, y - size * 0.5);
  ctx.lineTo(x - size * 0.8, y - size * 0.8);
  ctx.lineTo(x - size * 0.3, y - size * 0.3);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(x + size * 0.5, y - size * 0.5);
  ctx.lineTo(x + size * 0.8, y - size * 0.8);
  ctx.lineTo(x + size * 0.3, y - size * 0.3);
  ctx.stroke();
  
  // Draw eyes
  ctx.beginPath();
  ctx.arc(x - size * 0.3, y - size * 0.1, size * 0.1, 0, Math.PI * 2);
  ctx.arc(x + size * 0.3, y - size * 0.1, size * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = '#FF69B4';
  ctx.fill();
  
  // Draw nose
  ctx.beginPath();
  ctx.arc(x, y + size * 0.1, size * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = '#FF69B4';
  ctx.fill();
}

function drawPawPrint(ctx, x, y, size) {
  // Draw main pad
  ctx.beginPath();
  ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = '#FF69B4';
  ctx.fill();
  
  // Draw toe pads
  const toePositions = [
    {x: -0.3, y: -0.3},
    {x: 0.3, y: -0.3},
    {x: -0.3, y: 0.3},
    {x: 0.3, y: 0.3}
  ];
  
  toePositions.forEach(pos => {
    ctx.beginPath();
    ctx.arc(x + pos.x * size, y + pos.y * size, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawBunnyFace(ctx, x, y, size) {
  // Draw face
  ctx.beginPath();
  ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
  ctx.stroke();
  
  // Draw ears
  ctx.beginPath();
  ctx.moveTo(x - size * 0.3, y - size * 0.5);
  ctx.lineTo(x - size * 0.3, y - size * 1.2);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(x + size * 0.3, y - size * 0.5);
  ctx.lineTo(x + size * 0.3, y - size * 1.2);
  ctx.stroke();
  
  // Draw eyes
  ctx.beginPath();
  ctx.arc(x - size * 0.3, y - size * 0.1, size * 0.1, 0, Math.PI * 2);
  ctx.arc(x + size * 0.3, y - size * 0.1, size * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = '#9370DB';
  ctx.fill();
  
  // Draw nose
  ctx.beginPath();
  ctx.arc(x, y + size * 0.1, size * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = '#9370DB';
  ctx.fill();
}

function drawCarrot(ctx, x, y, size) {
  // Draw carrot body
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size * 0.5, y);
  ctx.lineTo(x - size * 0.5, y);
  ctx.closePath();
  ctx.fillStyle = '#FFA500';
  ctx.fill();
  
  // Draw carrot top
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x - size * 0.3, y - size * 1.2);
  ctx.lineTo(x + size * 0.3, y - size * 1.2);
  ctx.closePath();
  ctx.fillStyle = '#228B22';
  ctx.fill();
}

function drawStar(ctx, x, y, size) {
  const spikes = 5;
  const outerRadius = size;
  const innerRadius = size * 0.4;
  
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / spikes;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.closePath();
  ctx.fillStyle = '#9370DB';
  ctx.fill();
}

function drawCloud(ctx, x, y, size) {
  ctx.beginPath();
  ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
  ctx.arc(x + size * 0.4, y - size * 0.2, size * 0.4, 0, Math.PI * 2);
  ctx.arc(x + size * 0.4, y + size * 0.2, size * 0.4, 0, Math.PI * 2);
  ctx.arc(x - size * 0.4, y - size * 0.2, size * 0.4, 0, Math.PI * 2);
  ctx.arc(x - size * 0.4, y + size * 0.2, size * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = '#87CEEB';
  ctx.fill();
}

const FRAME_TEMPLATES = {
  [FRAME_TYPES.NONE]: null,
  [FRAME_TYPES.WOOD]: {
    border: '30px solid #8B4513',
    background: '#f8e8d0',
    padding: 50,
    patternGenerator: createWoodPattern
  },
  [FRAME_TYPES.VINTAGE]: {
    border: '40px solid #8B4513',
    background: '#f5e6d3',
    padding: 60,
    patternGenerator: createVintagePattern
  },
  [FRAME_TYPES.GOLD]: {
    border: '35px solid #D4AF37',
    background: '#FFD700',
    padding: 50,
    patternGenerator: createGoldPattern
  },
  [FRAME_TYPES.CLASSIC]: {
    border: '25px solid #2F4F4F',
    background: '#fff',
    padding: 40
  },
  [FRAME_TYPES.ELEGANT]: {
    border: '20px solid #000',
    background: '#fff',
    padding: 30
  },
  [FRAME_TYPES.ORNATE]: {
    border: '40px solid #D4AF37',
    background: '#FFD700',
    padding: 60,
    patternGenerator: createOrnatePattern
  },
  [FRAME_TYPES.FLORAL]: {
    border: '45px solid #DEB887',
    background: '#FFF8DC',
    padding: 65,
    patternGenerator: createFloralPattern
  },
  [FRAME_TYPES.VICTORIAN]: {
    border: '35px solid #8B4513',
    background: '#F5F5DC',
    padding: 55,
    patternGenerator: createVictorianPattern
  },
  [FRAME_TYPES.PINK_CUTE]: {
    border: '30px solid #FFB6C1',
    background: '#FFC0CB',
    padding: 45,
    patternGenerator: createPinkCutePattern
  },
  [FRAME_TYPES.PINK_FLORAL]: {
    border: '35px solid #FF69B4',
    background: '#FFE4E1',
    padding: 50,
    patternGenerator: createPinkFloralPattern
  },
  [FRAME_TYPES.PINK_HEART]: {
    border: '25px solid #FFB6C1',
    background: '#FFC0CB',
    padding: 40,
    patternGenerator: createPinkHeartPattern
  },
  [FRAME_TYPES.KITTY]: {
    border: '30px solid #FFB6C1',
    background: '#FFE4E1',
    padding: 45,
    patternGenerator: createKittyPattern
  },
  [FRAME_TYPES.BUNNY]: {
    border: '35px solid #9370DB',
    background: '#F0F8FF',
    padding: 50,
    patternGenerator: createBunnyPattern
  },
  [FRAME_TYPES.STAR]: {
    border: '25px solid #9370DB',
    background: '#E6E6FA',
    padding: 40,
    patternGenerator: createStarPattern
  },
  [FRAME_TYPES.CLOUD]: {
    border: '30px solid #87CEEB',
    background: '#F0F8FF',
    padding: 45,
    patternGenerator: createCloudPattern
  },
  [FRAME_TYPES.RAINBOW]: {
    border: '40px solid #FF69B4',
    background: '#FFE4E1',
    padding: 55,
    patternGenerator: createRainbowPattern
  }
};

// === DOM Elements ===
let webcam;
let countdownEl;
let filterSelect;
let frameSelect;
let captureBtn;
let photoStrip;
let previewContainer = null;
let loadingSpinner = null;
let countdownTimeSelect;
let flashDurationSelect;
let isFlipped = false;

// === State ===
let filterValue = 'none';
let isCapturing = false;
let capturedPhotos = [];
let originalPhotos = [];
let isProcessing = false;

// === Photo Data Structure ===
class PhotoData {
  constructor(imageData, filter, frame) {
    this.imageData = imageData;
    this.filter = filter;
    this.frame = frame;
    this.framedData = null; // Cache for framed image
  }

  async getFramedImage() {
    if (this.framedData) return this.framedData;
    
    this.framedData = await applyFrameToPhoto(this.imageData, this.frame);
    return this.framedData;
  }

  async updateFrame(newFrame) {
    this.frame = newFrame;
    this.framedData = null; // Clear cache when frame changes
    return this.getFramedImage();
  }
}

// === Initialize Application ===
document.addEventListener('DOMContentLoaded', () => {
  if (!initializeElements()) {
    console.error('Failed to initialize application');
    return;
  }

  setupEventListeners();
  startWebcam();
  setupFilters();
  setupFrames();
  createLoadingSpinner();
});

// === Element Initialization ===
function initializeElements() {
  try {
    webcam = document.getElementById('webcam');
    countdownEl = document.getElementById('countdown');
    filterSelect = document.getElementById('filter-select');
    frameSelect = document.getElementById('frame-select');
    captureBtn = document.getElementById('capture-btn');
    photoStrip = document.getElementById('photo-strip');
    countdownTimeSelect = document.getElementById('countdown-time');
    flashDurationSelect = document.getElementById('flash-duration');
    const flipBtn = document.getElementById('flip-btn');

    const elements = {
      webcam,
      countdownEl,
      filterSelect,
      frameSelect,
      captureBtn,
      photoStrip,
      countdownTimeSelect,
      flashDurationSelect,
      flipBtn
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

// === Loading Spinner ===
function createLoadingSpinner() {
  loadingSpinner = document.createElement('div');
  loadingSpinner.className = 'loading-spinner hidden';
  loadingSpinner.innerHTML = '<div class="spinner"></div>';
  document.body.appendChild(loadingSpinner);
}

function showLoading() {
  loadingSpinner.classList.remove('hidden');
  loadingSpinner.style.display = 'flex';
  loadingSpinner.style.justifyContent = 'center';
  loadingSpinner.style.alignItems = 'center';
  loadingSpinner.style.position = 'fixed';
  loadingSpinner.style.top = '20px';
  loadingSpinner.style.right = '20px';
  loadingSpinner.style.zIndex = '1000';
}

function hideLoading() {
  loadingSpinner.classList.add('hidden');
  loadingSpinner.style.display = 'none';
}

// === Event Listeners ===
function setupEventListeners() {
  captureBtn.addEventListener('click', takePhotoSequence);
  
  // Add hover effects
  captureBtn.addEventListener('mouseenter', () => {
    if (!isCapturing) {
      captureBtn.classList.add('hover');
    }
  });
  
  captureBtn.addEventListener('mouseleave', () => {
    captureBtn.classList.remove('hover');
  });

  // Add flip button event listener
  const flipBtn = document.getElementById('flip-btn');
  flipBtn.addEventListener('click', () => {
    if (isCapturing) return;
    isFlipped = !isFlipped;
    webcam.style.transform = isFlipped ? 'scaleX(-1)' : 'scaleX(1)';
  });

  // Add flash duration switch event listener
  const flashDuration = document.getElementById('flash-duration');
  flashDuration.checked = true; // Set default to high brightness
  flashDuration.addEventListener('change', (e) => {
    if (isCapturing) {
      e.preventDefault();
      e.target.checked = !e.target.checked;
      return;
    }
  });
}

// === Webcam Setup ===
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

    await new Promise((resolve) => {
      webcam.onloadedmetadata = () => {
        console.log('Webcam loaded:', webcam.videoWidth, 'x', webcam.videoHeight);
        captureBtn.disabled = false;
        resolve();
      };
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    
  } catch (err) {
    console.error('Webcam error:', err);
    alert('Không thể truy cập webcam: ' + err.message);
    captureBtn.disabled = true;
  }
}

// === Photo Capture ===
async function takePhotoSequence() {
  if (isCapturing) return;
  
  try {
    isCapturing = true;
    setUIState(true);
    
    // Clear existing preview and create new one
    if (previewContainer) {
      previewContainer.remove();
    }
    previewContainer = createPreviewContainer();
    photoStrip.appendChild(previewContainer);
    
    // Clear captured photos for new sequence
    capturedPhotos = [];
    originalPhotos = [];
    
    // Remove existing download button if any
    const downloadBtn = document.querySelector('.download-all-btn');
    if (downloadBtn) {
      downloadBtn.remove();
    }
    
    const initialCountdown = parseInt(countdownTimeSelect.value);
    await countdown(initialCountdown);
    
    for (let i = 0; i < 4; i++) {
      showFlash();
      
      // Capture photo with current filter
      const photo = capturePhoto();
      
      // Create PhotoData with current settings
      const photoData = new PhotoData(
        photo,
        filterSelect.value,
        frameSelect.value
      );
      
      // Get framed image
      const framedPhoto = await photoData.getFramedImage();
      
      // Store original photo data
      capturedPhotos.push(photoData);
      
      // Add to new preview
      addPhotoToPreview(previewContainer, framedPhoto, capturedPhotos.length - 1);

      if (i < 3) {
        await countdown(2);
      }
    }

    addDownloadButton();
    
  } catch (error) {
    console.error('Error taking photo:', error);
    alert('Có lỗi xảy ra khi chụp ảnh. Vui lòng thử lại.');
  } finally {
    isCapturing = false;
    setUIState(false);
  }
}

// === Photo Processing ===
function capturePhoto() {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  canvas.width = webcam.videoWidth;
  canvas.height = webcam.videoHeight;
  
  applyFilterToContext(context, filterSelect.value);
  
  // Handle flipped image capture
  if (isFlipped) {
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
  }
  
  context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
  
  return canvas.toDataURL('image/png');
}

// === Frame Setup ===
function setupFrames() {
  // Clear existing options
  frameSelect.innerHTML = '';
  
  // Add options from FRAME_TYPES with friendly names
  const frameNames = {
    [FRAME_TYPES.NONE]: 'Không khung',
    [FRAME_TYPES.WOOD]: 'Khung gỗ',
    [FRAME_TYPES.VINTAGE]: 'Khung cổ điển',
    [FRAME_TYPES.GOLD]: 'Khung vàng',
    [FRAME_TYPES.CLASSIC]: 'Khung cổ điển',
    [FRAME_TYPES.ELEGANT]: 'Khung thanh lịch',
    [FRAME_TYPES.ORNATE]: 'Khung hoa văn',
    [FRAME_TYPES.FLORAL]: 'Khung hoa',
    [FRAME_TYPES.VICTORIAN]: 'Khung Victorian',
    [FRAME_TYPES.PINK_CUTE]: 'Khung hồng dễ thương',
    [FRAME_TYPES.PINK_FLORAL]: 'Khung hoa hồng',
    [FRAME_TYPES.PINK_HEART]: 'Khung trái tim',
    [FRAME_TYPES.KITTY]: 'Khung mèo con',
    [FRAME_TYPES.BUNNY]: 'Khung thỏ con',
    [FRAME_TYPES.STAR]: 'Khung ngôi sao',
    [FRAME_TYPES.CLOUD]: 'Khung mây',
    [FRAME_TYPES.RAINBOW]: 'Khung cầu vồng'
  };
  
  Object.values(FRAME_TYPES).forEach(frameType => {
    const option = document.createElement('option');
    option.value = frameType;
    option.textContent = frameNames[frameType];
    frameSelect.appendChild(option);
  });

  // Validate frame type before applying
  frameSelect.addEventListener('change', () => {
    const selectedFrame = frameSelect.value;
    if (!FRAME_TYPES[selectedFrame.toUpperCase()]) {
      console.error(`Invalid frame type: ${selectedFrame}`);
      return;
    }
    
    if (capturedPhotos.length > 0) {
      updatePreviewWithFrame(selectedFrame);
    }
  });
}

// === Apply Frame to Photo ===
async function applyFrameToPhoto(photoData, frameType) {
  if (!frameType || frameType === FRAME_TYPES.NONE) return photoData;
  
  const frame = FRAME_TEMPLATES[frameType];
  if (!frame) {
    console.error(`Frame template not found for type: ${frameType}`);
    return photoData;
  }

  return new Promise((resolve, reject) => {
    const photoImg = new Image();
    photoImg.crossOrigin = 'anonymous';

    photoImg.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { alpha: false });
      
      const totalPadding = frame.padding * 2;
      const borderWidth = parseInt(frame.border);
      canvas.width = photoImg.width + totalPadding;
      canvas.height = photoImg.height + totalPadding;

      // Add rounded corners
      ctx.save();
      const radius = 20;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(canvas.width - radius, 0);
      ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
      ctx.lineTo(canvas.width, canvas.height - radius);
      ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
      ctx.lineTo(radius, canvas.height);
      ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.clip();

      // Draw outer border
      ctx.fillStyle = frame.border.split(' ')[2];
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw inner background with pattern if available
      if (frame.patternGenerator) {
        const pattern = frame.patternGenerator(
          ctx,
          canvas.width - borderWidth * 2,
          canvas.height - borderWidth * 2
        );
        ctx.fillStyle = pattern;
        ctx.fillRect(
          borderWidth,
          borderWidth,
          canvas.width - borderWidth * 2,
          canvas.height - borderWidth * 2
        );
      } else {
        ctx.fillStyle = frame.background;
        ctx.fillRect(
          borderWidth,
          borderWidth,
          canvas.width - borderWidth * 2,
          canvas.height - borderWidth * 2
        );
      }

      // Draw photo
      ctx.drawImage(photoImg, 
        frame.padding,
        frame.padding,
        photoImg.width,
        photoImg.height
      );

      // Add shadow
      ctx.restore();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      try {
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } catch (error) {
        console.error('Error converting canvas to data URL:', error);
        resolve(photoData);
      }
    };

    photoImg.onerror = () => {
      console.error('Error loading photo for frame application');
      resolve(photoData);
    };
    photoImg.src = photoData;
  });
}

// === UI Effects ===
function showFlash() {
  if (isCapturing) return;
  const flashDuration = document.getElementById('flash-duration');
  // Chỉ tạo flash khi switch được bật
  if (!flashDuration.checked) return;
  
  const flash = document.createElement('div');
  flash.className = 'flash';
  document.querySelector('.webcam-box').appendChild(flash);
  
  // Sử dụng độ sáng cao khi switch bật
  const duration = 1;
  
  requestAnimationFrame(() => {
    flash.style.opacity = duration.toString();
    setTimeout(() => {
      flash.style.opacity = '0';
      setTimeout(() => {
        flash.remove();
      }, 100);
    }, 100);
  });
}

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

// === Filter Handling ===
function setupFilters() {
  filterSelect.addEventListener('change', () => {
    const selectedFilter = filterSelect.value;
    webcam.style.filter = getFilterStyle(selectedFilter);
  });
}

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

function applyFilterToContext(context, filterName) {
  const filterStyle = getFilterStyle(filterName);
  if (filterStyle) {
    context.filter = filterStyle;
  }
}

// === Preview Handling ===
function createPreviewContainer() {
  const container = document.createElement('div');
  container.className = 'photo-container';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '20px';
  container.style.padding = '20px';
  container.style.backgroundColor = '#f5f5f5';
  container.style.borderRadius = '12px';
  container.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
  return container;
}

function addPhotoToPreview(container, photoUrl, index) {
  const photoWrapper = document.createElement('div');
  photoWrapper.className = 'photo-wrapper';
  photoWrapper.style.position = 'relative';
  photoWrapper.style.width = '100%';
  photoWrapper.style.maxWidth = '640px';
  photoWrapper.style.margin = '0 auto';
  photoWrapper.style.backgroundColor = 'white';
  photoWrapper.style.padding = '10px';
  photoWrapper.style.borderRadius = '12px';
  photoWrapper.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
  
  const img = document.createElement('img');
  img.src = photoUrl;
  img.className = 'fade-in';
  img.style.width = '100%';
  img.style.height = 'auto';
  img.style.borderRadius = '8px';
  img.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
  img.style.transition = 'transform 0.3s ease';
  
  // Add hover effect
  img.addEventListener('mouseenter', () => {
    img.style.transform = 'scale(1.02)';
  });
  
  img.addEventListener('mouseleave', () => {
    img.style.transform = 'scale(1)';
  });
  
  photoWrapper.appendChild(img);
  container.appendChild(photoWrapper);
  
  // Add animation
  photoWrapper.style.opacity = '0';
  photoWrapper.style.transform = 'translateY(20px)';
  photoWrapper.style.transition = 'opacity 0.5s, transform 0.5s';
  
  requestAnimationFrame(() => {
    photoWrapper.style.opacity = '1';
    photoWrapper.style.transform = 'translateY(0)';
  });
}

function showFullSize(photoUrl) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  
  const img = document.createElement('img');
  img.src = photoUrl;
  
  modal.appendChild(img);
  document.body.appendChild(modal);
  
  modal.onclick = () => modal.remove();
}

async function updatePreviewWithFrame(frameType) {
  if (!previewContainer) return;
  
  showLoading();
  previewContainer.innerHTML = '';

  try {
    for (let i = 0; i < capturedPhotos.length; i++) {
      const photo = capturedPhotos[i];
      const framedPhoto = await photo.updateFrame(frameType);
      addPhotoToPreview(previewContainer, framedPhoto, i);
    }
  } catch (error) {
    console.error('Error updating preview:', error);
  } finally {
    hideLoading();
  }
}

// === Download Functionality ===
function addDownloadButton() {
  const downloadBtn = document.createElement('button');
  downloadBtn.className = 'download-all-btn';
  downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
  downloadBtn.style.backgroundColor = '#2196F3';
  downloadBtn.style.color = 'white';
  downloadBtn.style.border = 'none';
  downloadBtn.style.padding = '12px 24px';
  downloadBtn.style.borderRadius = '6px';
  downloadBtn.style.cursor = 'pointer';
  downloadBtn.style.fontSize = '16px';
  downloadBtn.style.margin = '20px auto';
  downloadBtn.style.display = 'block';
  downloadBtn.style.transition = 'background-color 0.3s, transform 0.2s';
  
  // Add hover effect
  downloadBtn.addEventListener('mouseenter', () => {
    downloadBtn.style.backgroundColor = '#1976D2';
    downloadBtn.style.transform = 'scale(1.05)';
  });
  
  downloadBtn.addEventListener('mouseleave', () => {
    downloadBtn.style.backgroundColor = '#2196F3';
    downloadBtn.style.transform = 'scale(1)';
  });
  
  downloadBtn.onclick = showDownloadCombined;
  photoStrip.appendChild(downloadBtn);
}

async function showDownloadCombined() {
  showLoading();
  const combinedImage = await createCombinedImage();
  hideLoading();
  
  if (!combinedImage) return;

  const link = document.createElement('a');
  link.download = 'photo-strip.png';
  link.href = combinedImage;
  link.click();
}

async function createCombinedImage() {
  if (capturedPhotos.length === 0) return null;

  showLoading();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  try {
    // Get dimensions from first photo
    const firstPhoto = capturedPhotos[0];
    const firstFramedPhoto = await firstPhoto.getFramedImage();
    const firstImg = new Image();
    firstImg.src = firstFramedPhoto;
    
    await new Promise((resolve) => {
      firstImg.onload = () => {
        const photoWidth = firstImg.width;
        const photoHeight = firstImg.height;
        const padding = 20;
        const totalHeight = (photoHeight + padding) * capturedPhotos.length - padding;
        
        canvas.width = photoWidth;
        canvas.height = totalHeight;
        resolve();
      };
    });

    // Draw photos sequentially
    for (let i = 0; i < capturedPhotos.length; i++) {
      const photo = capturedPhotos[i];
      const framedPhoto = await photo.getFramedImage();
      const img = new Image();
      img.src = framedPhoto;
      
      await new Promise((resolve) => {
        img.onload = () => {
          const photoHeight = img.height;
          const padding = 20;
          ctx.drawImage(img, 0, i * (photoHeight + padding), img.width, photoHeight);
          resolve();
        };
      });
    }
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error creating combined image:', error);
    return null;
  } finally {
    hideLoading();
  }
}

// === UI State Management ===
function setUIState(isCapturing) {
  // Disable/Enable capture button
  captureBtn.disabled = isCapturing;
  captureBtn.classList.toggle('disabled', isCapturing);
  
  // Disable/Enable filter select
  filterSelect.disabled = isCapturing;
  filterSelect.classList.toggle('disabled', isCapturing);
  
  // Disable/Enable frame select
  frameSelect.disabled = isCapturing;
  frameSelect.classList.toggle('disabled', isCapturing);
  
  // Disable/Enable countdown time select
  countdownTimeSelect.disabled = isCapturing;
  countdownTimeSelect.classList.toggle('disabled', isCapturing);
  
  // Disable/Enable flash duration switch
  const flashDuration = document.getElementById('flash-duration');
  flashDuration.disabled = isCapturing;
  flashDuration.parentElement.classList.toggle('disabled', isCapturing);
  
  // Disable/Enable flip button
  const flipBtn = document.getElementById('flip-btn');
  flipBtn.disabled = isCapturing;
  flipBtn.classList.toggle('disabled', isCapturing);
  
  // Update button text and style
  if (isCapturing) {
    captureBtn.textContent = 'Taking Photos...';
    captureBtn.style.backgroundColor = '#666';
    captureBtn.style.cursor = 'not-allowed';
  } else {
    captureBtn.textContent = 'Take Photo';
    captureBtn.style.backgroundColor = '#007BFF';
    captureBtn.style.cursor = 'pointer';
  }
  
  // Show/hide loading spinner
  if (isCapturing) {
    showLoading();
  } else {
    hideLoading();
  }
}

// Sửa lại hàm adjustWebcamBrightness
function adjustWebcamBrightness() {
  if (isCapturing) return;
  const flashDuration = document.getElementById('flash-duration');
  if (flashDuration.checked) {
    // Tăng độ sáng của webcam
    webcam.style.filter = 'brightness(1.5)';
    setTimeout(() => {
      webcam.style.filter = 'brightness(1)';
    }, 100);
  }
}

// Thêm CSS để vô hiệu hóa hoàn toàn các controls
const style = document.createElement('style');
style.textContent = `
  .disabled {
    opacity: 0.6;
    cursor: not-allowed !important;
    pointer-events: none !important;
    user-select: none;
  }

  .switch.disabled {
    opacity: 0.6;
    pointer-events: none !important;
  }

  .switch.disabled .switch-slider {
    cursor: not-allowed;
    pointer-events: none !important;
  }

  .control-select:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    pointer-events: none !important;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    pointer-events: none !important;
  }
`;
document.head.appendChild(style);