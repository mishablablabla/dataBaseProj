const fs = require("fs");
const readline = require("readline");

// Функція для читання даних з файлу students.txt
function readStudentsFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const students = data
      .trim()
      .split("\n")
      .map((line) => {
        const [
          StLastName,
          StFirstName,
          Grade,
          Classroom,
          Bus,
          TLastName,
          TFirstName,
        ] = line.split(",").map((s) => s.trim());
        return {
          StLastName,
          StFirstName,
          Grade: parseInt(Grade, 10),
          Classroom: parseInt(Classroom, 10),
          Bus: parseInt(Bus, 10),
          TLastName,
          TFirstName,
        };
      });
    return students;
  } catch (error) {
    console.error("Помилка читання файлу:", error.message);
    return [];
  }
}

// Функція для експорту даних у JSON
function exportToJSON(students) {
  const json = JSON.stringify(students, null, 2); // Форматуємо з відступами
  fs.writeFileSync("students.json", json, "utf8");
  console.log("Дані експортовані у students.json");
}

// Функція для експорту даних у XML
function exportToXML(students) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<students>\n';
  students.forEach((student) => {
    xml += `  <student>\n`;
    xml += `    <StLastName>${student.StLastName}</StLastName>\n`;
    xml += `    <StFirstName>${student.StFirstName}</StFirstName>\n`;
    xml += `    <Grade>${student.Grade}</Grade>\n`;
    xml += `    <Classroom>${student.Classroom}</Classroom>\n`;
    xml += `    <Bus>${student.Bus}</Bus>\n`;
    xml += `    <TLastName>${student.TLastName}</TLastName>\n`;
    xml += `    <TFirstName>${student.TFirstName}</TFirstName>\n`;
    xml += `  </student>\n`;
  });
  xml += "</students>";
  fs.writeFileSync("students.xml", xml, "utf8");
  console.log("Дані експортовані у students.xml");
}

// Виведення інструкцій
function printInstructions() {
  console.log("[S] <прізвище> — пошук за прізвищем студента.");
  console.log(
    "[S] <прізвище> B — пошук студента та його автобусного маршруту."
  );
  console.log("[T] <прізвище вчителя> — пошук учнів вчителя.");
  console.log("[C] <номер класу> — пошук учнів за класом.");
  console.log("[B] <номер автобуса> — пошук учнів за автобусом.");
  console.log("[EXPORT] <JSON або XML> — експорт даних у відповідний формат.");
  console.log("[Q] — вихід.");
}

// Основна функція
function main() {
  const students = readStudentsFile("students.txt");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function handleCommand() {
    rl.question("Введіть команду (Q для виходу): ", (command) => {
      const startTime = Date.now(); // Час початку
      const [action, ...args] = command.trim().split(/\s+/);

      if (action.toUpperCase() === "Q") {
        rl.close();
        return;
      }

      let results = [];
      switch (action.toUpperCase()) {
        case "S":
          const lastName = args[0];
          if (args[1] && args[1].toUpperCase() === "B") {
            results = students
              .filter(
                (s) => s.StLastName.toUpperCase() === lastName.toUpperCase()
              )
              .map(
                (s) => `${s.StLastName} ${s.StFirstName}, Автобус: ${s.Bus}`
              );
          } else {
            results = students
              .filter(
                (s) => s.StLastName.toUpperCase() === lastName.toUpperCase()
              )
              .map(
                (s) =>
                  `${s.StLastName} ${s.StFirstName}, Клас: ${s.Grade}, Вчитель: ${s.TLastName} ${s.TFirstName}`
              );
          }
          break;

        case "T":
          const teacherLastName = args[0];
          results = students
            .filter(
              (s) => s.TLastName.toUpperCase() === teacherLastName.toUpperCase()
            )
            .map((s) => `${s.StLastName} ${s.StFirstName}`);
          break;

        case "C":
          const grade = parseInt(args[0], 10);
          results = students
            .filter((s) => s.Grade === grade)
            .map((s) => `${s.StLastName} ${s.StFirstName}`);
          break;

        case "B":
          const busNumber = parseInt(args[0], 10);
          results = students
            .filter((s) => s.Bus === busNumber)
            .map(
              (s) => `${s.StLastName} ${s.StFirstName}, Клас: ${s.Classroom}`
            );
          break;

        case "EXPORT":
          const format = args[0];
          if (format.toUpperCase() === "JSON") {
            exportToJSON(students);
          } else if (format.toUpperCase() === "XML") {
            exportToXML(students);
          } else {
            console.log("Невірний формат. Використовуйте JSON або XML.");
          }
          break;

        default:
          console.log("Невідома команда.");
          break;
      }

      const endTime = Date.now();
      const elapsedTime = endTime - startTime; // Час виконання команди

      if (results.length === 0) {
        console.log("Немає даних для відображення.");
      } else {
        results.forEach((result) => console.log(result));
      }

      console.log(`Час пошуку: ${elapsedTime} мс`);
      printInstructions();
      handleCommand();
    });
  }

  printInstructions();
  handleCommand();
}

main();
