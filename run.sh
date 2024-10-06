if ! command -v node &> /dev/null
then
    echo "Node.js не встановлений. Будь ласка, встановіть Node.js з https://nodejs.org/"
    exit
fi

# Запускаємо вашу програму students.js
node students.js
