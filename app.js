var passHistory = document.getElementById('historyBtn');
var reloadBtn = document.getElementById('reloadBtn');
var out = document.getElementById('pass-generate-input');
var copyPassBtn = document.getElementById('copy-pass');
var passLength = document.getElementById('pass-longer');
var symbolsVariations = document.getElementById('symbols-variations');
var historyBlock = document.getElementById('history');
var lastPassItems = document.querySelector('.last-pass-items');
var clearLastPass = document.getElementById('clear-last-pass');

var upperCase = document.getElementById('upper');
var lowerCase = document.getElementById('lower');
var numberCase = document.getElementById('number');
var symbolCase = document.getElementById('symbol');

let isLower = true;
let isUpper = true;
let isSymbol = true;
let isNumber = true;
let isHasTrueCheckbox = true;
let flag = false;

var number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
var upper = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
var lower = [...'abcdefghijklmnopqrstuvwxyz'];
var symbol = [...symbolsVariations.value];

generatePass();

window.addEventListener('load', async () => {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('Service worker register success', reg);
    } catch (e) {
      console.log('Service worker register fail');
    }
  }
});

// Закрываем и открываем блок истории
passHistory.addEventListener('click', () => {
  if (flag == false) {
    historyBlock.style.display = 'block';
    flag = true;
  } else {
    historyBlock.style.display = 'none';
    flag = false;
  }
});

// Закрываем блок истории по нажатию на оверлей
document.addEventListener('click', (e) => {
  const withinBoundaries = e.composedPath().includes(historyBlock);
  const withinBoundariesBtn = e.composedPath().includes(passHistory);

  if (!withinBoundaries && !withinBoundariesBtn && flag == true) {
    historyBlock.style.display = 'none';
    flag = false;
  }
});

// Функция копирования на кнопку копировать и Кнопка скопировать в истории
copyPassBtn.addEventListener('click', (e) => {
  var inp = document.createElement('input');
  inp.value = out.innerText;
  document.body.appendChild(inp);
  inp.select();

  if (document.execCommand('copy')) {
    out.classList.add('success');
    out.innerText = `Скопировано`;
    setTimeout(() => {
      out.classList.remove('success');
      generatePass();
    }, 1000);

    lastPassItems.innerHTML += `<li class="last-pass-item">
                                  <div class="item-data">
                                    <div class="date">${new Date().toLocaleString('ru', {
                                      day: 'numeric',
                                      month: 'numeric',
                                      year: 'numeric',
                                      hour: 'numeric',
                                      minute: 'numeric',
                                    })}</div>
                                    <div class="data">${inp.value}</div>
                                  </div>
                                  <div id="last-pass-copy" class="last-pass-copy-btn">
                                    <i class="fa-regular fa-copy"></i>
                                  </div>
                                </li>`;
    // Кнопка скопировать в истории
    var lastPassCopyBtns = document.querySelectorAll('#last-pass-copy');
    for (const lastPassCopyBtn of lastPassCopyBtns) {
      lastPassCopyBtn.addEventListener('click', (e) => {
        let itemData = lastPassCopyBtn.parentElement.children[0];
        let data = itemData.children[1];
        var inp = document.createElement('input');
        inp.value = data.innerText;
        document.body.appendChild(inp);
        inp.select();

        if (document.execCommand('copy')) {
          data.classList.add('success');
          data.innerText = `Скопировано`;
          setTimeout(() => {
            data.classList.remove('success');
            data.innerText = inp.value;
          }, 1000);
        } else {
          data.classList.add('error');
          data.innerText = `Не скопировано!!!`;
          setTimeout(() => {
            data.classList.remove('error');
            data.innerText = inp.value;
          }, 1000);
        }

        document.body.removeChild(inp);
      });
    }
  } else {
    out.classList.add('error');
    out.innerText = `Не скопировано!!!`;
    setTimeout(() => {
      out.classList.remove('error');
      generatePass();
    }, 1000);
  }

  document.body.removeChild(inp);
});

clearLastPass.addEventListener('click', () => {
  lastPassItems.innerHTML = '';
});

// Если длина пароля больше 20-ти символов то добавляется многоточие
passLength.addEventListener('change', () => {
  if (passLength.value > 20) {
    out.classList.add('out');
  } else {
    out.classList.remove('out');
  }
  generatePass();
});

// Слушатели событий на чекбоксы
upperCase.addEventListener('change', () => {
  isUpper = !isUpper;
  generatePass();
  isTrueCheckbox();
});
lowerCase.addEventListener('change', () => {
  isLower = !isLower;
  generatePass();
  isTrueCheckbox();
});
numberCase.addEventListener('change', () => {
  isNumber = !isNumber;
  generatePass();
  isTrueCheckbox();
});
symbolCase.addEventListener('change', () => {
  isSymbol = !isSymbol;
  generatePass();
  isTrueCheckbox();
});

// Проверяем выбран ли хотябы один чекбокс
function isTrueCheckbox() {
  let checkboxes = [isLower, isUpper, isNumber, isSymbol];
  if (checkboxes.includes(true)) {
    isHasTrueCheckbox = true;
    copyPassBtn.disabled = false;
    passLength.disabled = false;
    reloadBtn.style.visibility = 'visible';
    out.classList.remove('error');
  } else {
    isHasTrueCheckbox = false;
    copyPassBtn.disabled = true;
    passLength.disabled = true;
    reloadBtn.style.visibility = 'hidden';
    out.classList.add('error');
    out.innerText = `Выберите хотя бы один вариант`;
  }
}

// Кнопка обовления сгененрированного пароля
reloadBtn.addEventListener('click', generatePass);

// Функция генератор пароля
function generatePass() {
  var result = [];
  if (numberCase.checked) {
    result = result.concat(number);
  }
  if (upperCase.checked) {
    result = result.concat(upper);
  }
  if (lowerCase.checked) {
    result = result.concat(lower);
  }
  if (symbolCase.checked) {
    result = result.concat([...symbolsVariations.value]);
  }
  result;
  result.sort(compareRandom);

  out.innerText = '';
  var pass = '';
  for (var i = 0; i < passLength.value; i++) {
    pass += result[randomInteger(0, result.length - 1)];
  }
  out.innerText = pass;
  // console.log(pass.length);
}

function compareRandom(a, b) {
  return Math.random() - 0.5;
}

function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
}
