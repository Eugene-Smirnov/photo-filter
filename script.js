// 1 // Filter
// Output value indication
const filters = document.querySelector('.filters');
function outputHandler(event) {
  const input = event.target;
  input.nextElementSibling.value = input.value;
}
filters.addEventListener('input', outputHandler);
// Chaining input to filter value 
function filterValueChanger(event) {
  if (event.target.name == undefined || event.target.name == 'result') return;
  const input = event.target;
  const sizing = input.dataset.sizing;
  document.documentElement.style.setProperty(`--${input.name}`, input.value + sizing);
}
filters.addEventListener('input', filterValueChanger);
// 2 // Buttons
// Reset button
const buttonReset = document.querySelector('.btn-reset');
function filterResetValue() {
  const inputs = filters.querySelectorAll('input');
  inputs.forEach((item) => (item.name === 'saturate') ? item.value = 100 : item.value = 0);
  inputs.forEach((item) => item.nextElementSibling.value = item.value);
  inputs.forEach((item) => {
    document.documentElement.style.setProperty(`--${item.name}`, item.value + item.dataset.sizing);
  });
}
buttonReset.addEventListener('click', filterResetValue);
// Next button
const buttonNext = document.querySelector('.btn-next');
const image = document.querySelector('img');
let _imageIndexCounter = 1;

function timeDeterminator() {
  const hours = (new Date).getHours();
  let result;
  if (hours >= 0 && hours < 6) {
    result = 'night';
  } else if (hours >= 6 && hours < 12) {
    result = 'morning';
  } else if (hours >= 12 && hours < 18) {
    result = 'day';
  } else if (hours >= 18 && hours < 24) {
    result = 'evening';
  }
  return result;
}

function loadNextImage() {
  const img = new Image();
  const currentIndex = (_imageIndexCounter < 10) ? '0' + _imageIndexCounter : _imageIndexCounter;
  const source = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeDeterminator()}/${currentIndex}.jpg`;
  _imageIndexCounter++;
  if (_imageIndexCounter > 20) _imageIndexCounter = 1;
  img.src = source;
  img.onload = () => {      
    image.src = source;
  }; 
  buttonNext.disabled = true;
  setTimeout(function() { buttonNext.disabled = false }, 500);
  buttonLoad.value = null;
}
buttonNext.addEventListener('click', loadNextImage);
// Load button
const buttonLoad = document.getElementById('btnInput');
    // const image was declared above
function uploadImage() {
  const file = buttonLoad.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const img = new Image();
    img.src = reader.result
    image.src = img.src;
  }
}
buttonLoad.addEventListener('change', uploadImage);
// Save button
const buttonSave = document.querySelector('.btn-save');

function saveImage() {
  const img = new Image();
  img.setAttribute('crossOrigin', 'anonymous');
  img.src = image.src;
  const canvas = document.querySelector('.canvas');
  const inputs = filters.querySelectorAll('input');
  const filterValues = {};
  inputs.forEach(item => {
    filterValues[`${item.name}`] = item.value;
  });
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    const blur = Math.floor(((filterValues.blur * canvas.width)/image.width)*10) / 10;
    ctx.filter = `blur(${blur}px) invert(${filterValues.invert}%) sepia(${filterValues.sepia}%) saturate(${filterValues.saturate}%) hue-rotate(${filterValues.hue}deg)`;
    console.log(ctx.filter);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const link = document.createElement('a');
    link.download = 'filtered_image.png';
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
  };
}
buttonSave.addEventListener('click', saveImage);

// FULLSCREEN SWITCHER
const fullscreenButton = document.querySelector('.fullscreen');
function fullscreenSwitcher(event) {
    if (document.fullscreen) {
        document.exitFullscreen();
        return;
    };
    document.documentElement.requestFullscreen();
};
fullscreenButton.addEventListener('click', fullscreenSwitcher);