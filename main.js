import { Picture } from './picture.js';


const main = () => {
  const imageUpload = document.getElementById('image-upload');
  const imagePreview = document.getElementById('image-preview');
  const operationSelect = document.getElementById('operation-select');
  const parameterRange = document.getElementById('parameter-range');
  const parameterValue = document.getElementById('parameter-value');
  const applyButton = document.getElementById('apply-button');
  const saveButton = document.getElementById('save-button');

  const filterSelect = document.getElementById("filter-select");
  filterSelect.addEventListener("change", (evt) => {
    const selectedFilter = evt.target.value;
    picture.applyFilter(selectedFilter);
  });

  let picture = null;

  // Load image when user selects a file
  imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const imageUrl = readerEvent.target.result;
      imagePreview.src = imageUrl;

      picture = new Picture(imageUrl, imagePreview.naturalWidth, imagePreview.naturalHeight);
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

    // Update image preview
    const canvas = document.createElement('canvas');
    canvas.width = picture.width;
    canvas.height = picture.height;

    const ctx = canvas.getContext('2d');
    ctx.putImageData(picture.getImageData(), 0, 0);

    imagePreview.src = canvas.toDataURL();
  });

  // Save the modified image when Save button is clicked
  saveButton.addEventListener('click', () => {
    picture.save();
  });


}

main();