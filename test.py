import hashlib

# Список дат народження хлопців (ключ – ім'я, значення – дата народження у форматі РРРР-ММ-ДД)
birthdates = {
    "Іван": "2000-01-15",
    "Олег": "2001-03-22",
    "Дмитро": "1999-12-05",
    "Петро": "2000-07-30",
    "Андрій": "2002-04-18"
}

# Для додаткової безпеки можна використати "сіль" (salt)
salt = "секретний_ключ"

# Генеруємо хеш-таблицю, де ключ – ім'я, а значення – хешована дата народження
hashed_birthdates = {}

for name, bdate in birthdates.items():
    # Об'єднуємо дату народження і сіль, кодуємо в байти та обчислюємо хеш за алгоритмом SHA-256
    hash_obj = hashlib.sha256((bdate + salt).encode("utf-8"))
    hashed_birthdates[name] = hash_obj.hexdigest()

# Вивід початкових даних та хеш-таблиці
print("Початкові дати народження:")
for name, bdate in birthdates.items():
    print(f"{name}: {bdate}")

print("\nХеш-таблиця з датами народження:")
for name, h in hashed_birthdates.items():
    print(f"{name}: {h}")
