"use strict";

// ================================
// EPIC 6: Subjects Management
// TASK 6.1: Create subjects page
// ================================
(function subjectsModule() {
  if (document.body.dataset.page !== "subjects") return;

  const form = document.getElementById("subjects-form");
  const idInput = document.getElementById("subject-id");
  const nameInput = document.getElementById("subject-name");
  const teacherSelect = document.getElementById("subject-teacher");
  const classSelect = document.getElementById("subject-class");
  const tableBody = document.getElementById("subjects-table-body");

  function getSubjects() {
    return StorageService.getData(APP_KEYS.SUBJECTS, []);
  }

  function getTeachers() {
    return StorageService.getData(APP_KEYS.TEACHERS, []);
  }

  function getClasses() {
    return StorageService.getData(APP_KEYS.CLASSES, []);
  }

  function saveSubjects(data) {
    StorageService.saveData(APP_KEYS.SUBJECTS, data);
  }

  function saveTeachers(data) {
    StorageService.saveData(APP_KEYS.TEACHERS, data);
  }

  function renderTeacherOptions() {
    const teachers = getTeachers();
    teacherSelect.innerHTML = ['<option value="">Select Teacher</option>']
      .concat(teachers.map((teacher) => `<option value="${teacher.id}">${teacher.name}</option>`))
      .join("");
  }

  function renderClassOptions() {
    const classes = getClasses();
    classSelect.innerHTML = ['<option value="">Select Class</option>']
      .concat(classes.map((cls) => `<option value="${cls.id}">${cls.name}</option>`))
      .join("");
  }

  // ================================
  // EPIC 6: Subjects Management
  // TASK 6.5: Assign teacher to subject
  // TASK 6.6: Assign subject to class
  // ================================
  function syncTeacherSubjects() {
    const subjects = getSubjects();
    const teachers = getTeachers().map((teacher) => {
      const subjectIds = subjects.filter((subject) => subject.teacherId === teacher.id).map((subject) => subject.id);
      return { ...teacher, subjectIds };
    });
    saveTeachers(teachers);
  }

  function renderSubjects() {
    const subjects = getSubjects();
    const teachers = getTeachers();
    const classes = getClasses();

    tableBody.innerHTML = subjects
      .map((subject) => {
        const teacherName = teachers.find((teacher) => teacher.id === subject.teacherId)?.name || "-";
        const className = classes.find((cls) => cls.id === subject.classId)?.name || "-";

        return `
          <tr>
            <td>${subject.id}</td>
            <td>${subject.name}</td>
            <td>${teacherName}</td>
            <td>${className}</td>
            <td>
              <button class="btn" data-action="edit" data-id="${subject.id}">Edit</button>
              <button class="btn btn-danger" data-action="delete" data-id="${subject.id}">Delete</button>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  function resetForm() {
    form.reset();
    idInput.value = "";
    clearInlineErrors(form);
  }

  // ================================
  // EPIC 6: Subjects Management
  // TASK 6.2: Add subject
  // TASK 6.3: Edit subject
  // TASK 6.7: Prevent duplicate subject
  // ================================
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearInlineErrors(form);

    const id = idInput.value.trim();
    const name = nameInput.value.trim();
    const teacherId = teacherSelect.value;
    const classId = classSelect.value;

    if (!Validators.required(name)) {
      setInlineError("subject-name", "Subject name is required");
      return;
    }

    const subjects = getSubjects();
    const duplicate = subjects.find(
      (subject) => subject.name.toLowerCase() === name.toLowerCase() && subject.id !== id
    );

    if (duplicate) {
      setInlineError("subject-name", "Duplicate subject name is not allowed");
      return;
    }

    if (id) {
      const updated = subjects.map((subject) =>
        subject.id === id ? { ...subject, name, teacherId, classId } : subject
      );
      saveSubjects(updated);
      logActivity(`Subject updated: ${name}`);
      showAlert("page-alert", "Subject updated.");
    } else {
      subjects.push({ id: generateId("SUB"), name, teacherId, classId });
      saveSubjects(subjects);
      logActivity(`Subject created: ${name}`);
      showAlert("page-alert", "Subject added.");
    }

    syncTeacherSubjects();
    resetForm();
    renderTeacherOptions();
    renderClassOptions();
    renderSubjects();
  });

  // ================================
  // EPIC 6: Subjects Management
  // TASK 6.4: Delete subject
  // ================================
  tableBody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const id = target.dataset.id;
    const action = target.dataset.action;
    if (!id || !action) return;

    const subjects = getSubjects();
    const selected = subjects.find((subject) => subject.id === id);
    if (!selected) return;

    if (action === "edit") {
      idInput.value = selected.id;
      nameInput.value = selected.name;
      teacherSelect.value = selected.teacherId || "";
      classSelect.value = selected.classId || "";
      return;
    }

    if (action === "delete") {
      const updated = subjects.filter((subject) => subject.id !== id);
      saveSubjects(updated);

      const grades = StorageService.getData(APP_KEYS.GRADES, []).filter((grade) => grade.subjectId !== id);
      StorageService.saveData(APP_KEYS.GRADES, grades);

      syncTeacherSubjects();
      logActivity(`Subject deleted: ${selected.name}`);
      showAlert("page-alert", "Subject deleted.", "warning");
      renderSubjects();
    }
  });

  document.getElementById("subjects-reset").addEventListener("click", resetForm);

  renderTeacherOptions();
  renderClassOptions();
  renderSubjects();
})();
