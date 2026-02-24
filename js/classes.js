"use strict";

// ================================
// EPIC 5: Classes Management
// TASK 5.1: Create classes page
// ================================
(function classesModule() {
  if (document.body.dataset.page !== "classes") return;

  const form = document.getElementById("classes-form");
  const idInput = document.getElementById("class-id");
  const nameInput = document.getElementById("class-name");
  const studentsSelect = document.getElementById("class-students");
  const tableBody = document.getElementById("classes-table-body");

  function getClasses() {
    return StorageService.getData(APP_KEYS.CLASSES, []);
  }

  function getStudents() {
    return StorageService.getData(APP_KEYS.STUDENTS, []);
  }

  function saveClasses(data) {
    StorageService.saveData(APP_KEYS.CLASSES, data);
  }

  function saveStudents(data) {
    StorageService.saveData(APP_KEYS.STUDENTS, data);
  }

  // ================================
  // EPIC 5: Classes Management
  // TASK 5.5: Assign students to class
  // ================================
  function renderStudentsOptions() {
    const students = getStudents();
    studentsSelect.innerHTML = students
      .map((student) => `<option value="${student.id}">${student.name}</option>`)
      .join("");
  }

  // ================================
  // EPIC 5: Classes Management
  // TASK 5.6: Count students per class
  // ================================
  function renderClasses() {
    const classes = getClasses();

    tableBody.innerHTML = classes
      .map((cls) => `
        <tr>
          <td>${cls.id}</td>
          <td>${cls.name}</td>
          <td>${(cls.studentIds || []).length}</td>
          <td>
            <button class="btn" data-action="edit" data-id="${cls.id}">Edit</button>
            <button class="btn btn-danger" data-action="delete" data-id="${cls.id}">Delete</button>
          </td>
        </tr>
      `)
      .join("");
  }

  function getSelectedStudentIds() {
    return [...studentsSelect.selectedOptions].map((option) => option.value);
  }

  function syncStudentClassIds(classes) {
    const students = getStudents().map((student) => {
      const cls = classes.find((item) => (item.studentIds || []).includes(student.id));
      return { ...student, classId: cls?.id || "" };
    });
    saveStudents(students);
  }

  function resetForm() {
    form.reset();
    idInput.value = "";
    [...studentsSelect.options].forEach((option) => {
      option.selected = false;
    });
    clearInlineErrors(form);
  }

  // ================================
  // EPIC 5: Classes Management
  // TASK 5.2: Add class
  // TASK 5.3: Edit class
  // TASK 5.7: Prevent duplicate class name
  // ================================
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearInlineErrors(form);

    const id = idInput.value.trim();
    const name = nameInput.value.trim();
    const studentIds = getSelectedStudentIds();
    const classes = getClasses();

    if (!Validators.required(name)) {
      setInlineError("class-name", "Class name is required");
      return;
    }

    const duplicate = classes.find(
      (item) => item.name.toLowerCase() === name.toLowerCase() && item.id !== id
    );

    if (duplicate) {
      setInlineError("class-name", "Class name already exists");
      return;
    }

    if (id) {
      const updated = classes.map((item) =>
        item.id === id ? { ...item, name, studentIds } : item
      );
      saveClasses(updated);
      syncStudentClassIds(updated);
      logActivity(`Class updated: ${name}`);
      showAlert("page-alert", "Class updated.");
    } else {
      classes.push({ id: generateId("CLS"), name, studentIds });
      saveClasses(classes);
      syncStudentClassIds(classes);
      logActivity(`Class created: ${name}`);
      showAlert("page-alert", "Class added.");
    }

    resetForm();
    renderStudentsOptions();
    renderClasses();
  });

  // ================================
  // EPIC 5: Classes Management
  // TASK 5.4: Delete class
  // ================================
  tableBody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const id = target.dataset.id;
    const action = target.dataset.action;
    if (!id || !action) return;

    const classes = getClasses();
    const selected = classes.find((cls) => cls.id === id);
    if (!selected) return;

    if (action === "edit") {
      idInput.value = selected.id;
      nameInput.value = selected.name;
      [...studentsSelect.options].forEach((option) => {
        option.selected = (selected.studentIds || []).includes(option.value);
      });
      return;
    }

    if (action === "delete") {
      const updated = classes.filter((cls) => cls.id !== id);
      saveClasses(updated);

      const students = getStudents().map((student) =>
        student.classId === id ? { ...student, classId: "" } : student
      );
      saveStudents(students);

      const subjects = StorageService.getData(APP_KEYS.SUBJECTS, []).map((subject) =>
        subject.classId === id ? { ...subject, classId: "" } : subject
      );
      StorageService.saveData(APP_KEYS.SUBJECTS, subjects);

      logActivity(`Class deleted: ${selected.name}`);
      showAlert("page-alert", "Class deleted.", "warning");
      renderStudentsOptions();
      renderClasses();
    }
  });

  document.getElementById("classes-reset").addEventListener("click", resetForm);

  renderStudentsOptions();
  renderClasses();
})();
