// Константи
const m = 12;
const A = (Math.sqrt(5) - 1) / 2;
const monthNames = ['1','2','3','4','5','6',
                    '7','8','9','10','11','12'];

// Окремі колекції студентів для кожної таблиці
let divisionStudents = [];
let multiplicationStudents = [];

// Перетворення "YYYY-MM-DD" -> числовий ключ у форматі YYYYMMDD
function getKey(dob) {
  const [year, month, day] = dob.split('-').map(Number);
  return year * 10000 + month * 100 + day;
}

// Функції хешування:
// Витягуємо місяць з ключа та повертаємо (місяць - 1)
function hashDivision(key) {
  const str = key.toString().padStart(8, '0');
  const month = Number(str.substring(4, 6));
  return month % m;
}
function hashMultiplication(key) {
  const str = key.toString().padStart(8, '0');
  const month = Number(str.substring(4, 6));
  return Math.floor(m * ((month * A) % 1));
}

// Оновити вміст таблиці для методу ділення
function updateDivisionTable() {
  const divBody = document.getElementById('divisionBody');
  divBody.innerHTML = '';
  // Створюємо бакети для таблиці ділення
  const buckets = Array.from({length: m}, () => []);
  divisionStudents.forEach(student => {
    // Використовуємо оновлений хеш, який гарантує відповідність місяцю народження
    const index = hashDivision(student.key);
    buckets[index].push(student);
  });
  for (let i = 0; i < m; i++) {
    // Замінюємо кому на розрив рядка для кращого читання
    const names = buckets[i]
      .map(s => `${s.name} (ключ: ${s.key}, хеш: ${hashDivision(s.key)})`)
      .join('<br>');
    const tr = `<tr>
                  <td>${monthNames[i]}</td>
                  <td>${names || '-'}</td>
                </tr>`;
    divBody.insertAdjacentHTML('beforeend', tr);
  }
}

// Оновити вміст таблиці для методу множення
function updateMultiplicationTable() {
  const mulBody = document.getElementById('multiplicationBody');
  mulBody.innerHTML = '';
  // Створюємо бакети для таблиці множення
  const buckets = Array.from({length: m}, () => []);
  multiplicationStudents.forEach(student => {
    const index = hashMultiplication(student.key);
    buckets[index].push(student);
  });
  for (let i = 0; i < m; i++) {
    // Замінюємо кому на розрив рядка для кращого читання
    const names = buckets[i]
      .map(s => `${s.name} (ключ: ${s.key}, хеш: ${hashMultiplication(s.key)})`)
      .join('<br>');
    const tr = `<tr>
                  <td>${monthNames[i]}</td>
                  <td>${names || '-'}</td>
                </tr>`;
    mulBody.insertAdjacentHTML('beforeend', tr);
  }
}

// Функція оновлення обох таблиць
function updateTables() {
  updateDivisionTable();
  updateMultiplicationTable();
}

// Очистити поля вводу
function clearInputs() {
  document.getElementById('nameInput').value = '';
  document.getElementById('dobInput').value = '';
}

// Додати студента (додається в обидві таблиці)
function addStudent() {
  const name = document.getElementById('nameInput').value.trim();
  const dob   = document.getElementById('dobInput').value;
  if (!name || !dob) {
    alert('Будь ласка, заповніть ім’я та дату народження.');
    return;
  }
  const key = getKey(dob);
  const student = {name, dob, key};

  divisionStudents.push(student);
  multiplicationStudents.push(student);

  updateTables();
  clearInputs();
}

// Пошук за ім'ям за об'єднаними даними (якщо студент є хоча б в одній таблиці)
function searchByName() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const ul = document.getElementById('searchResults');
  ul.innerHTML = '';
  if (!q) return;
  // Об'єднуємо студентів з обох таблиць, використовуючи Set для уникнення дублікатів
  const union = Array.from(new Set([...divisionStudents, ...multiplicationStudents]));
  const results = union.filter(s => s.name.toLowerCase().includes(q));
  if (results.length === 0) {
    ul.innerHTML = '<li>Нічого не знайдено</li>';
  } else {
    results.forEach(s => {
      const li = document.createElement('li');
      li.textContent = `${s.name} — ${s.dob} (ключ: ${s.key})`;
      ul.appendChild(li);
    });
  }
}

// Фільтр за місяцем за об'єднаними даними
function filterByMonth() {
  const month = Number(document.getElementById('monthSelect').value);
  const ul = document.getElementById('monthResults');
  ul.innerHTML = '';
  const union = Array.from(new Set([...divisionStudents, ...multiplicationStudents]));
  const results = union.filter(s => {
    return (new Date(s.dob).getMonth() + 1) === month;
  });
  if (results.length === 0) {
    ul.innerHTML = '<li>Немає студентів</li>';
  } else {
    results.forEach(s => {
      const li = document.createElement('li');
      li.textContent = `${s.name} — ${s.dob} (ключ: ${s.key})`;
      ul.appendChild(li);
    });
  }
}

// Видалення студентів за хешем в таблиці ділення (таблиця множення залишається незмінною)
function deleteByHashDivision() {
  const hashValue = Number(document.getElementById('deleteDivisionHash').value);
  if (isNaN(hashValue) || hashValue < 0 || hashValue >= m) {
    alert('Введіть коректне значення хешу (від 0 до 11).');
    return;
  }
  divisionStudents = divisionStudents.filter(s => hashDivision(s.key) !== hashValue);
  updateDivisionTable();
}

// Видалення студентів за хешем в таблиці множення (таблиця ділення залишається незмінною)
function deleteByHashMultiplication() {
  const hashValue = Number(document.getElementById('deleteMultiplicationHash').value);
  if (isNaN(hashValue) || hashValue < 0 || hashValue >= m) {
    alert('Введіть коректне значення хешу (від 0 до 11).');
    return;
  }
  multiplicationStudents = multiplicationStudents.filter(s => hashMultiplication(s.key) !== hashValue);
  updateMultiplicationTable();
}

// Прив’язка обробників
document.getElementById('addButton').addEventListener('click', addStudent);
document.getElementById('searchButton').addEventListener('click', searchByName);
document.getElementById('filterButton').addEventListener('click', filterByMonth);
document.getElementById('deleteDivisionButton').addEventListener('click', deleteByHashDivision);
document.getElementById('deleteMultiplicationButton').addEventListener('click', deleteByHashMultiplication);

// Ініціалізуємо порожні таблиці при завантаженні
updateTables();