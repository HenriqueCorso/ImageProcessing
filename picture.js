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
      default:
        original();
    }
  }

}
