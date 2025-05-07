export default async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    const safeArea = Math.max(image.width, image.height) * 2;
    canvas.width = safeArea;
    canvas.height = safeArea;
  
    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);
    ctx.drawImage(image, (safeArea - image.width) / 2, (safeArea - image.height) / 2);
  
    const data = ctx.getImageData(0, 0, safeArea, safeArea);
  
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.putImageData(
      data,
      Math.round(-pixelCrop.x + (safeArea - image.width) / 2),
      Math.round(-pixelCrop.y + (safeArea - image.height) / 2)
    );
  
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        resolve(url);
      }, 'image/jpeg');
    });
  }
  
  function createImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', reject);
      image.setAttribute('crossOrigin', 'anonymous'); // para evitar problemas CORS
      image.src = url;
    });
  }
  