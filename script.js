// Person.js (імпровізовано у цьому ж файлі)
class Person {
    constructor(name, birthDate) {
      this.name = name;
      this.birthDate = birthDate;
    }
  }
  
  // TableHistory.js (імпровізовано у цьому ж файлі)
  class TableHistory {
    constructor() {
      this.actions = [];
    }
    
    addAction(action) {
      const time = new Date().toLocaleTimeString();
      this.actions.push(`[${time}] ${action}`);
    }
    
    getHistory() {
      return this.actions.join("\n");
    }
  }
  
  // HashTable.js (реалізація за наданим прикладом)
  class HashTable {
    constructor() {
      this.size = 5;
      this.table = new Array(this.size).fill(null);
      this.history = new TableHistory();
    }
    
    hash(key) {
      let hash = 0;
      for (let i = 0; i < key.length; i++) {
        const char = key.charCodeAt(i);
        hash = (hash << 5) - hash + char;
      }
      return Math.abs(hash) % this.size;
    }
    
    get length() {
      let count = 0;
      for (const bucket of this.table) {
        if (bucket !== null) {
          count += bucket.length;
        }
      }
      return count;
    }
    
    doubleBuckets() {
      this.size *= 2;
      const newTable = new Array(this.size).fill(null);
      for (const bucket of this.table) {
        if (bucket !== null) {
          for (const person of bucket) {
            const index = this.hash(person.name);
            if (newTable[index] === null) {
              newTable[index] = [person];
            } else {
              newTable[index].push(person);
            }
          }
        }
      }
      this.table = newTable;
    }
    
    set(name, birthDate) {
      const index = this.hash(name);
      const person = new Person(name, birthDate);
      if (this.table[index] === null) {
        this.table[index] = [person];
        this.history.addAction(`Додано ключ "${name}"`);
      } else {
        this.table[index].push(person);
        this.history.addAction(`Додано ключ "${name}"`);
      }
      if (this.length >= this.size) {
        this.doubleBuckets();
      }
      console.log(this.table);
    }
    
    get(name) {
      const index = this.hash(name);
      if (this.table[index] !== null) {
        for (const person of this.table[index]) {
          if (person && person.name === name) {
            return person;
          }
        }
      }
      return null;
    }
    
    remove(name) {
      const index = this.hash(name);
      if (this.table[index] !== null) {
        for (let i = 0; i < this.table[index].length; i++) {
          if (this.table[index][i] && this.table[index][i].name === name) {
            this.table[index].splice(i, 1);
            this.history.addAction(`Видалено ключ "${name}"`);
            return;
          }
        }
      }
      throw new Error(`Ключ '${name}' не знайдено в хеш-таблиці`);
    }
    
    edit(name, newBirthDate) {
      const index = this.hash(name);
      if (this.table[index] !== null) {
        for (const person of this.table[index]) {
          if (person && person.name === name) {
            person.birthDate = newBirthDate;
            this.history.addAction(`Відредаговано ключ "${name}"`);
            return;
          }
        }
      }
      throw new Error(`Ключ '${name}' не знайдено в хеш-таблиці`);
    }
    
    getPeopleByMonth(month) {
      const peopleInMonth = [];
      for (const bucket of this.table) {
        if (bucket !== null) {
          for (const person of bucket) {
            // Припускаємо, що дата народження у форматі "ДД.ММ"
            if (person && person.birthDate.slice(-2) === month) {
              peopleInMonth.push(person);
            }
          }
        }
      }
      return peopleInMonth;
    }
    
    getBirthdayPerson() {
      const peopleToday = [];
      const today = new Date();
      const todayFormat = String(today.getDate()).padStart(2, '0') + '.' +
                          String(today.getMonth() + 1).padStart(2, '0');
      for (const bucket of this.table) {
        if (bucket !== null) {
          for (const person of bucket) {
            if (person && person.birthDate === todayFormat) {
              peopleToday.push(person);
            }
          }
        }
      }
      return peopleToday;
    }
    
    clear() {
      this.table = new Array(this.size).fill(null);
      this.history.addAction("Хеш-таблиця повністю очищена");
    }
  }
  
  // Створення об'єкта хеш-таблиці
  const hashTable = new HashTable();
  const resultsEl = document.getElementById("results");
  
  // Обробник форми додавання нового користувача
  document.getElementById("personForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const birthDate = document.getElementById("birthDate").value.trim();
    try {
      hashTable.set(name, birthDate);
      resultsEl.textContent = `Додано: ${name} з датою народження ${birthDate}\nІсторія дій:\n` +
                              hashTable.history.getHistory();
      event.target.reset();
    } catch (error) {
      resultsEl.textContent = error.message;
    }
  });
  
  // Обробник форми редагування користувача
  document.getElementById("editForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("editName").value.trim();
    const newBirthDate = document.getElementById("newBirthDate").value.trim();
    try {
      hashTable.edit(name, newBirthDate);
      resultsEl.textContent = `Відредаговано: ${name} на нову дату ${newBirthDate}\nІсторія дій:\n` +
                              hashTable.history.getHistory();
      event.target.reset();
    } catch (error) {
      resultsEl.textContent = error.message;
    }
  });
  
  // Обробник форми видалення користувача
  document.getElementById("deleteForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("deleteName").value.trim();
    try {
      hashTable.remove(name);
      resultsEl.textContent = `Видалено користувача: ${name}\nІсторія дій:\n` +
                              hashTable.history.getHistory();
      event.target.reset();
    } catch (error) {
      resultsEl.textContent = error.message;
    }
  });
  
  // Обробник форми пошуку користувача
  document.getElementById("findForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("findName").value.trim();
    const person = hashTable.get(name);
    if (person) {
      resultsEl.textContent = `Знайдено користувача: ${person.name} з датою народження ${person.birthDate}`;
    } else {
      resultsEl.textContent = `Користувача з ім'ям "${name}" не знайдено.`;
    }
    event.target.reset();
  });
  
  // Обробник кнопки для перевірки днів народження за місяцем
  document.getElementById("checkMonth").addEventListener("click", () => {
    const month = document.getElementById("month").value.trim();
    if (month.length !== 2) {
      resultsEl.textContent = "Будь ласка, введіть місяць у форматі ММ (наприклад, 01, 12)";
      return;
    }
    const people = hashTable.getPeopleByMonth(month);
    if (people.length > 0) {
      let message = `У місяці ${month} є наступні дні народження:\n`;
      people.forEach(person => {
        message += `${person.name}: ${person.birthDate}\n`;
      });
      resultsEl.textContent = message;
    } else {
      resultsEl.textContent = `У місяці ${month} немає записаних днів народження.`;
    }
  });
  
  // Обробник кнопки для відображення хеш-таблиці
  document.getElementById("showTable").addEventListener("click", () => {
    resultsEl.textContent = JSON.stringify(hashTable.table, null, 2) +
                            "\nІсторія дій:\n" + hashTable.history.getHistory();
  });
  
  // Обробник кнопки для очищення хеш-таблиці
  document.getElementById("clearTable").addEventListener("click", () => {
    hashTable.clear();
    resultsEl.textContent = "Хеш-таблиця очищена.\nІсторія дій:\n" + hashTable.history.getHistory();
  });