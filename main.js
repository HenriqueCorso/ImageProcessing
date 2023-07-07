import { Picture } from './picture.js';

const main = () => {
  const imageUpload = document.getElementById('image-upload');
  const operationSelect = document.getElementById('operation-select');
  const parameterRange = document.getElementById('parameter-range');
  const parameterValue = document.getElementById('parameter-value');
  const applyButton = document.getElementById('apply-button');
  const saveButton = document.getElementById('save-button');
  const canvas = document.getElementById('canvas');
  const brushButton = document.getElementById('brush-button');

  let picture = null;
  let brushActive = false; // Track if the brush tool is active
  let brushColor = null; // Store the brush color

  // Load the selected image
  canvas.onload = () => {
    picture.load();
  };

  const filterSelect = document.getElementById('filter-select');
  filterSelect.addEventListener('change', (event) => {
    const selectedFilter = event.target.value;
    picture.applyFilter(selectedFilter);
  });

  // Load image when user selects a file
  imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const imageUrl = readerEvent.target.result;
      canvas.src = imageUrl;

      picture = new Picture(imageUrl, canvas.naturalWidth, canvas.naturalHeight);
      picture.load();
    };

    reader.readAsDataURL(file);
  });

  // Update parameter value
  parameterRange.addEventListener('input', () => {
    parameterValue.textContent = parameterRange.value;
  });

  // Apply selected operation when Apply button is clicked
  applyButton.addEventListener('click', () => {
    const operation = operationSelect.value;
    const parameter = parseInt(parameterRange.value);

    if (operation === 'brightness') {
      picture.brightness(parameter);
    } else if (operation === 'contrast') {
      picture.contrast(parameter);
    } else if (operation === 'saturation') {
      picture.saturation(parameter);
    }
  });

  // Save the modified image when Save button is clicked
  saveButton.addEventListener('click', () => {
    picture.save();
  });

  // Toggle brush tool
  brushButton.addEventListener('click', () => {
    brushActive = !brushActive;
    brushButton.textContent = brushActive ? 'Deactivate setPixel' : 'Activate setPixel';
  });

  // Handle mouse move event on the canvas
  canvas.addEventListener('mousemove', (event) => {
    if (brushActive) {
      const colorPicked = document.getElementById('color-picked');
      const rgba = picture.getPixel(event, colorPicked);

      // Update the brush color
      brushColor = rgba;
      canvas.style.cursor = 'crosshair';
    }
  });

  // Handle mouse down event on the canvas
  canvas.addEventListener('mousedown', () => {
    if (brushActive) {
      canvas.addEventListener('mousemove', brush);
      brush(event);
    }
  });

  // Handle mouse up event on the canvas
  canvas.addEventListener('mouseup', () => {
    if (brushActive) {
      canvas.removeEventListener('mousemove', brush);
      brush(event);
      brushColor = null; // Reset brush color
      canvas.style.cursor = 'default';
    }
  });

  // Brush function to paint on the canvas
  const brush = (event) => {
    if (brushColor) {
      picture.setPixel(event.offsetX, event.offsetY, brushColor);
    }
  };
};

main();
