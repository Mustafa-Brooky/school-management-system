"use strict";

// ================================
// EPIC 3: Student Management
// TASK 3.1: Create students page UI
// ================================
(function studentsModule() {
  if (document.body.dataset.page !== "students") return;

  const form = document.getElementById("students-form");
  const idInput = document.getElementById("student-id");
  const nameInput = document.getElementById("student-name");
  const ageInput = document.getElementById("student-age");
  const classSelect = document.getElementById("student-class");
  const searchInput = document.getElementById("student-search");
  const classFilter = document.getElementById("student-class-filter");
  const tableBody = document.getElementById("students-table-body");

  function getStudents() {
    return StorageService.getData(APP_KEYS.STUDENTS, []);
  }

  function getClasses() {
    return StorageService.getData(APP_KEYS.CLASSES, []);
  }

  function saveStudents(data) {
    StorageService.saveData(APP_KEYS.STUDENTS, data);
  }

  function saveClasses(data) {
    StorageService.saveData(APP_KEYS.CLASSES, data);
  }

  // ================================
  // EPIC 3: Student Management
  // TASK 3.6: Filter by class
  // ================================
  function renderClassSelectors() {
    const classes = getClasses();
    const options = ['<option value="">Select Class</option>']
      .concat(classes.map((item) => `<option value="${item.id}">${item.name}</option>`))
      .join("");
    classSelect.innerHTML = options;

    classFilter.innerHTML = ['<option value="">All Classes</option>']
      .concat(classes.map((item) => `<option value="${item.id}">${item.name}</option>`))
      .join("");
  }

  function syncClassesMembership(students) {
    const classes = getClasses().map((item) => ({ ...item, studentIds: [] }));
    students.forEach((student) => {
      const cls = classes.find((item) => item.id === student.classId);
      if (cls) cls.studentIds.push(student.id);
    });
    saveClasses(classes);
  }

  // ================================
  // EPIC 3: Student Management
  // TASK 3.9: Display students in table
  // TASK 3.10: Show empty state
  // ================================
  function renderStudents() {
    const students = getStudents();
    const classes = getClasses();
    const q = (searchInput.value || "").toLowerCase().trim();
    const classId = classFilter.value;

    const filtered = students.filter((student) => {
      const byName = student.name.toLowerCase().includes(q);
      const byClass = !classId || student.classId === classId;
      return byName && byClass;
    });

    tableBody.innerHTML = filtered
      .map((student) => {
        const className = classes.find((item) => item.id === student.classId)?.name || "N/A";
        return `
          <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${className}</td>
            <td>
              <button class="btn" data-action="edit" data-id="${student.id}">Edit</button>
              <button class="btn btn-danger" data-action="delete" data-id="${student.id}">Delete</button>
            </td>
          </tr>
        `;
      })
      .join("");

    if (filtered.length === 0) {
      renderEmptyState("students-empty", "No students found.");
    } else {
      clearEmptyState("students-empty");
    }
  }

  function resetForm() {
    form.reset();
    idInput.value = "";
    clearInlineErrors(form);
  }

  // ================================
  // EPIC 3: Student Management
  // TASK 3.2: Add student
  // TASK 3.3: Edit student
  // TASK 3.7: Generate unique ID
  // TASK 3.8: Save to localStorage
  // EPIC 10: Validation & Error Handling
  // TASK 10.2/10.3/10.5
  // ================================
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearInlineErrors(form);

    const id = idInput.value.trim();
    const name = nameInput.value.trim();
    const age = ageInput.value.trim();
    const classId = classSelect.value;

    let valid = true;

    if (!Validators.required(name)) {
      setInlineError("student-name", "Name is required");
      valid = false;
    }

    if (!Validators.numberInRange(age, 5, 25)) {
      setInlineError("student-age", "Age must be between 5 and 25");
      valid = false;
    }

    if (!Validators.required(classId)) {
      setInlineError("student-class", "Class is required");
      valid = false;
    }

    if (!valid) return;

    const students = getStudents();

    if (id) {
      const updated = students.map((student) =>
        student.id === id ? { ...student, name, age: Number(age), classId } : student
      );
      saveStudents(updated);
      syncClassesMembership(updated);
      logActivity(`Student updated: ${name}`);
      showAlert("page-alert", "Student updated successfully.");
    } else {
      const payload = { id: generateId("STD"), name, age: Number(age), classId };
      students.push(payload);
      saveStudents(students);
      syncClassesMembership(students);
      logActivity(`Student created: ${name}`);
      showAlert("page-alert", "Student added successfully.");
    }

    resetForm();
    renderClassSelectors();
    renderStudents();
  });

  // ================================
  // EPIC 3: Student Management
  // TASK 3.4: Delete student
  // TASK 3.5: Search student
  // ================================
  tableBody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const id = target.dataset.id;
    const action = target.dataset.action;
    if (!id || !action) return;

    const students = getStudents();
    const selected = students.find((student) => student.id === id);
    if (!selected) return;

    if (action === "edit") {
      idInput.value = selected.id;
      nameInput.value = selected.name;
      ageInput.value = selected.age;
      classSelect.value = selected.classId;
      return;
    }

    if (action === "delete") {
      const updated = students.filter((student) => student.id !== id);
      saveStudents(updated);

      const grades = StorageService.getData(APP_KEYS.GRADES, []).filter((item) => item.studentId !== id);
      StorageService.saveData(APP_KEYS.GRADES, grades);

      syncClassesMembership(updated);
      logActivity(`Student deleted: ${selected.name}`);
      showAlert("page-alert", "Student deleted.", "warning");
      renderStudents();
    }
  });

  searchInput.addEventListener("input", renderStudents);
  classFilter.addEventListener("change", renderStudents);
  document.getElementById("students-reset").addEventListener("click", resetForm);

  renderClassSelectors();
  renderStudents();
})();
