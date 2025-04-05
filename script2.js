const entries = [];
    let editIndex = null;
    const BUCKET_COUNT = 10;

    function hashDivision(key) { return key % BUCKET_COUNT; }
    function hashMultiplication(key) {
      const A = (Math.sqrt(5) - 1) / 2;
      return Math.floor(BUCKET_COUNT * ((key * A) % 1));
    }
    function dateToInt(dateStr) { return parseInt(dateStr.replace(/-/g, ''), 10); }

    function showMessage(text) {
      const msg = document.getElementById('message');
      msg.textContent = text;
      msg.style.display = 'block';
      setTimeout(() => msg.style.display = 'none', 3000);
    }

    function renderEntriesList(filtered = null) {
      const list = document.getElementById('entryList');
      list.innerHTML = '';
      (filtered || entries).forEach((entry, idx) => {
        const li = document.createElement('li');
        const info = document.createElement('span');
        info.textContent = `${entry.name}: ${entry.dateStr}`;
        const actions = document.createElement('div');
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Редагувати'; editBtn.className = 'entry-btn';
        editBtn.onclick = () => startEdit(idx);
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Видалити'; delBtn.className = 'entry-btn';
        delBtn.onclick = () => deleteEntry(idx);
        actions.append(editBtn, delBtn);
        li.append(info, actions);
        list.append(li);
      });
    }

    document.getElementById('birthForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const dateStr = document.getElementById('birthdate').value;
      if (!name || !dateStr) return;
      if (editIndex === null) entries.push({ name, dateStr });
      else {
        entries[editIndex] = { name, dateStr };
        editIndex = null;
        document.getElementById('submitBtn').textContent = 'Додати';
        document.getElementById('cancelEditBtn').style.display = 'none';
      }
      this.reset(); renderEntriesList();
    });

    function startEdit(idx) {
      const entry = entries[idx];
      document.getElementById('name').value = entry.name;
      document.getElementById('birthdate').value = entry.dateStr;
      document.getElementById('submitBtn').textContent = 'Оновити';
      document.getElementById('cancelEditBtn').style.display = 'inline';
      editIndex = idx;
    }
    document.getElementById('cancelEditBtn').addEventListener('click', () => {
      editIndex = null;
      document.getElementById('birthForm').reset();
      document.getElementById('submitBtn').textContent = 'Додати';
      document.getElementById('cancelEditBtn').style.display = 'none';
    });

    function deleteEntry(idx) {
      if (confirm('Видалити цього користувача?')) {
        entries.splice(idx, 1);
        renderEntriesList();
      }
    }

    document.getElementById('searchBtn').addEventListener('click', () => {
      const term = document.getElementById('searchName').value.trim().toLowerCase();
      if (!term) return renderEntriesList();
      const result = entries.filter(e => e.name.toLowerCase().includes(term));
      renderEntriesList(result);
      showMessage(result.length ? `Знайдено ${result.length} користувача(ів).` : 'Нічого не знайдено.');
    });

    document.getElementById('monthCheckBtn').addEventListener('click', () => {
      const m = document.getElementById('monthPicker').value;
      if (!m) return;
      const month = m.split('-')[1];
      const result = entries.filter(e => e.dateStr.split('-')[1] === month);
      renderEntriesList(result);
      showMessage(result.length ? `У місяці ${month} ${result.length} дні народження.` : `У місяці ${month} немає днів народження.`);
    });

    document.getElementById('generateBtn').addEventListener('click', () => {
      const table1 = Array.from({ length: BUCKET_COUNT }, () => []);
      const table2 = Array.from({ length: BUCKET_COUNT }, () => []);
      entries.forEach(entry => {
        const key = dateToInt(entry.dateStr);
        table1[hashDivision(key)].push(entry);
        table2[hashMultiplication(key)].push(entry);
      });
      const container = document.getElementById('tables');
      container.innerHTML = renderTable(table1, 'Метод ділення') + renderTable(table2, 'Метод множення');
    });

    function renderTable(table, title) {
      let html = `<h2>Хеш-таблиця (${title})</h2><table><tr>`;
      for (let i = 0; i < BUCKET_COUNT; i++) html += `<th>Бакет ${i}</th>`;
      html += '</tr><tr>';
      for (let i = 0; i < BUCKET_COUNT; i++) {
        html += '<td class="bucket"><ul>';
        table[i].forEach(item => html += `<li>${item.name}: ${item.dateStr}</li>`);
        html += '</ul></td>';
      }
      html += '</tr></table>';
      return html;
    }

    renderEntriesList();