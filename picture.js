export class Picture {
  constructor(url, width, height) {
    this.url = url;
    this.width = width;
    this.height = height;
    this.totalPixels = width * height;
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');
    this.img = new Image(); // Add img property
  }

  // Load the image from the specified URL
  load() {
    const colorPicker = document.getElementById('color-picker');

    // Add event listener to the image element
    this.canvas.addEventListener('click', event => this.getPixel(event, colorPicker));


    this.img.onload = () => {
      this.width = this.img.width;
      this.height = this.img.height;

      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.context.drawImage(this.img, 0, 0, this.width, this.height);
    };
    this.img.src = this.url;

  }

  // Save the modified image as a PNG file
  save() {
    const dataUrl = this.canvas.toDataURL();
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'modified_image.png';
    link.click();
  }


  setPixel(x, y, rgba) {
    const imageData = this.context.getImageData(0, 0, this.width, this.height);
    const index = (y * this.width + x) * 4;
    imageData.data[index] = rgba[0];   // Red
    imageData.data[index + 1] = rgba[1]; // Green
    imageData.data[index + 2] = rgba[2]; // Blue
    imageData.data[index + 3] = rgba[3]; // Alpha
    this.context.putImageData(imageData, 0, 0);
  }

  getPixel(event, destination) {
    const x = event.offsetX;
    const y = event.offsetY;
    const pixel = this.context.getImageData(x, y, 1, 1);
    const data = pixel.data;

    const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
    destination.style.background = rgba;
    destination.textContent = rgba;

    return rgba;
  }

  clear() {
  }

  // Adjust the brightness of the image
  brightness(value) {
    const imageData = this.context.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] += value;     // Red
      data[i + 1] += value; // Green
      data[i + 2] += value; // Blue
    }
    this.context.putImageData(imageData, 0, 0);
  }

  // Adjust the contrast of the image
  contrast(value) {
    const imageData = this.context.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;
    const factor = (259 * (value + 255)) / (255 * (259 - value));

    for (let i = 0; i < data.length; i += 4) {
      data[i] = factor * (data[i] - 128) + 128;       // Red
      data[i + 1] = factor * (data[i + 1] - 128) + 128; // Green
      data[i + 2] = factor * (data[i + 2] - 128) + 128; // Blue
    }

    this.context.putImageData(imageData, 0, 0);
  }

  // Adjust the saturation of the image
  saturation(value) {
    const imageData = this.context.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];     // Red
      const g = data[i + 1]; // Green
      const b = data[i + 2]; // Blue

      const max = Math.max(r, g, b);
      data[i] = max + ((r - max) * value);       // Red
      data[i + 1] = max + ((g - max) * value);   // Green
      data[i + 2] = max + ((b - max) * value);   // Blue
    }

    this.context.putImageData(imageData, 0, 0);
  }

  // Apply Gaussian blur filter to the image
  gaussianBlur() {
    const imageData = this.context.getImageData(0, 0, this.width, this.height);
    const pixels = imageData.data;
    const width = imageData.width;

    const radius = 5;
    const sigma = 2;
    const kernelSize = radius * 2 + 1;
    const kernel = new Array(kernelSize);
    let kernelSum = 0;

    for (let i = 0; i < kernelSize; i++) {
      kernel[i] = new Array(kernelSize);
      for (let j = 0; j < kernelSize; j++) {
        const distance = (i - radius) * (i - radius) + (j - radius) * (j - radius);
        kernel[i][j] = Math.exp(-distance / (2 * sigma * sigma));
        kernelSum += kernel[i][j];
      }
    }

    for (let i = 0; i < kernelSize; i++) {
      for (let j = 0; j < kernelSize; j++) {
        kernel[i][j] /= kernelSum;
      }
    }

    for (let y = radius; y < this.height - radius; y++) {
      for (let x = radius; x < this.width - radius; x++) {
        let r = 0, g = 0, b = 0, a = 0;

        for (let i = -radius; i <= radius; i++) {
          for (let j = -radius; j <= radius; j++) {
            const pixelIndex = ((y + i) * width + x + j) * 4;
            r += pixels[pixelIndex] * kernel[i + radius][j + radius];
            g += pixels[pixelIndex + 1] * kernel[i + radius][j + radius];
            b += pixels[pixelIndex + 2] * kernel[i + radius][j + radius];
            a += pixels[pixelIndex + 3] * kernel[i + radius][j + radius];
          }
        }

        const pixelIndex = (y * width + x) * 4;
        pixels[pixelIndex] = r;
        pixels[pixelIndex + 1] = g;
        pixels[pixelIndex + 2] = b;
        pixels[pixelIndex + 3] = a;
      }
    }

    this.context.putImageData(imageData, 0, 0);
  }


  applyFilter(filterType) {
    const ctx = this.context;
    const canvas = this.canvas;

    const original = () => {
      ctx.drawImage(this.img, 0, 0);
    };

    // invert the colors of the image
    const invert = () => {
      ctx.drawImage(this.img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];             // red
        data[i + 1] = 255 - data[i + 1];     // green
        data[i + 2] = 255 - data[i + 2];     // blue
      }
      ctx.putImageData(imageData, 0, 0);
    };

    // convert the image to grayscale
    const grayscale = () => {
      ctx.drawImage(this.img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;                       // red
        data[i + 1] = avg;                   // green
        data[i + 2] = avg;                   // blue
      }
      ctx.putImageData(imageData, 0, 0);
    };

    // apply the sepia filter to the image
    const sepia = () => {
      this.context.drawImage(this.img, 0, 0);
      const imageData = this.context.getImageData(0, 0, this.width, this.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        let red = data[i],
          green = data[i + 1],
          blue = data[i + 2];

        data[i] = Math.min(Math.round(0.393 * red + 0.769 * green + 0.189 * blue), 255);
        data[i + 1] = Math.min(Math.round(0.349 * red + 0.686 * green + 0.168 * blue), 255);
        data[i + 2] = Math.min(Math.round(0.272 * red + 0.534 * green + 0.131 * blue), 255);
      }
      this.context.putImageData(imageData, 0, 0);

    }

    const sunset = () => {
      this.context.drawImage(this.img, 0, 0);
      const imageData = this.context.getImageData(0, 0, this.width, this.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i + 1] = data[i] + 50;        // Increase green component
        data[i + 2] = data[i + 2] + 12;    // Increase blue component
      }
      this.context.putImageData(imageData, 0, 0);
    }

    const haze = () => {
      this.context.drawImage(this.img, 0, 0);
      const imageData = this.context.getImageData(0, 0, this.width, this.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] += 90
        data[i + 1] += 90
        data[i + 2] += 10
      }
      this.context.putImageData(imageData, 0, 0);

    }

    const serenity = () => {
      this.context.drawImage(this.img, 0, 0);
      const imageData = this.context.getImageData(0, 0, this.width, this.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] += 10
        data[i + 1] += 40
        data[i + 2] += 90
      }
      this.context.putImageData(imageData, 0, 0);

    }

    const vintage = () => {
      this.context.drawImage(this.img, 0, 0);
      const imageData = this.context.getImageData(0, 0, this.width, this.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] += 120
        data[i + 1] += 70
        data[i + 2] += 13
      }
      this.context.putImageData(imageData, 0, 0);

    }

    const lemon = () => {
      this.context.drawImage(this.img, 0, 0);
      const imageData = this.context.getImageData(0, 0, this.width, this.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i + 1] = data[i] + 50;
      }
      this.context.putImageData(imageData, 0, 0);
    }

    const edgeDetection = [
      [-1, -1, -1],
      [-1, 8, -1],
      [-1, -1, -1]
    ];


    const sharpen = [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0]
    ];

    const boxBlur = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ];

    const focus = [
      [-1, 0, -1],
      [0, 7, 0],
      [-1, 0, -1]
    ];

    const emboss = [
      [-2, -1, 0],
      [-1, 1, 1],
      [0, 1, 2]
    ];

    const focus5x5 = [
      [-1, -1, -1, -1, -1],
      [-1, 1, 1, 1, -1],
      [-1, 1, 8, 1, -1],
      [-1, 1, 1, 1, -1],
      [-1, -1, -1, -1, -1]
    ];

    const gradientEmboss = [
      [-2, -2, -2, -2, -2],
      [-1, -1, -1, -1, -1],
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2]
    ];


    // Switch case to apply the selected filter
    switch (filterType) {
      case "inverted":
        invert();
        break;
      case "grayscale":
        grayscale();
        break;
      case "sepia":
        sepia();
        break;
      case 'sunset':
        sunset();
        break;
      case 'haze':
        haze();
        break;
      case 'serenity':
        serenity();
        break;
      case 'vintage':
        vintage();
        break;
      case 'lemon':
        lemon();
        break;
      case 'gaussianBlur':
        this.gaussianBlur();
        break;
      case 'edgeDetection':
        this.applyConvolutionFilter(edgeDetection, 1, 0);
        break;
      case 'sharpen':
        this.applyConvolutionFilter(sharpen, 1, 0);
        break;
      case 'boxBlur':
        this.applyConvolutionFilter(boxBlur, 9, 0);
        break;
      case 'focus':
        this.applyConvolutionFilter(focus, 1, 0);
        break;
      case 'emboss':
        this.applyConvolutionFilter(emboss, 1, 0);
        break;
      case 'focus5x5':
        this.applyConvolutionFilter(focus5x5, 1, 0);
        break;
      case 'gradientEmboss':
        this.applyConvolutionFilter(gradientEmboss, 1, 0);
        break;
      default:
        original();
    }
  }


  applyConvolutionFilter(kernel, divisor = 1, offset = 0, opaque = true) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const src = {
      width: imageData.width,
      height: imageData.height,
      data: new Uint8ClampedArray(imageData.data)
    };

    const dst = new ImageData(src.width, src.height);

    const dstBuf = dst.data;
    const srcBuf = src.data;

    const rowOffset = Math.floor(kernel.length / 2);
    const colOffset = Math.floor(kernel[0].length / 2);

    for (let row = 0; row < src.height; row++) {
      for (let col = 0; col < src.width; col++) {
        const result = [0, 0, 0, 0];

        for (let kRow = 0; kRow < kernel.length; kRow++) {
          for (let kCol = 0; kCol < kernel[kRow].length; kCol++) {
            const kVal = kernel[kRow][kCol];

            const pixelRow = row + kRow - rowOffset;
            const pixelCol = col + kCol - colOffset;

            if (
              pixelRow < 0 ||
              pixelRow >= src.height ||
              pixelCol < 0 ||
              pixelCol >= src.width
            ) {
              continue;
            }

            const srcIndex = (pixelRow * src.width + pixelCol) * 4;

            for (let channel = 0; channel < 4; channel++) {
              if (opaque && channel === 3) {
                continue;
              } else {
                const pixel = srcBuf[srcIndex + channel];
                result[channel] += pixel * kVal;
              }
            }
          }
        }

        const dstIndex = (row * src.width + col) * 4;

        for (let channel = 0; channel < 4; channel++) {
          const val = (opaque && channel === 3) ? 255 : result[channel] / divisor + offset;
          dstBuf[dstIndex + channel] = val;
        }
      }
    }

    ctx.putImageData(dst, 0, 0);
  }

}
