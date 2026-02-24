"use strict";

// ================================
// EPIC 4: Teacher Management
// TASK 4.1: Create teachers page
// ================================
(function teachersModule() {
  if (document.body.dataset.page !== "teachers") return;

  const form = document.getElementById("teachers-form");
  const idInput = document.getElementById("teacher-id");
  const nameInput = document.getElementById("teacher-name");
  const subjectsSelect = document.getElementById("teacher-subjects");
  const tableBody = document.getElementById("teachers-table-body");

  function getTeachers() {
    return StorageService.getData(APP_KEYS.TEACHERS, []);
  }

  function getSubjects() {
    return StorageService.getData(APP_KEYS.SUBJECTS, []);
  }

  function saveTeachers(data) {
    StorageService.saveData(APP_KEYS.TEACHERS, data);
  }

  function saveSubjects(data) {
    StorageService.saveData(APP_KEYS.SUBJECTS, data);
  }

  // ================================
  // EPIC 4: Teacher Management
  // TASK 4.5: Assign subject to teacher
  // ================================
  function renderSubjectOptions() {
    const subjects = getSubjects();
    subjectsSelect.innerHTML = subjects
      .map((subject) => `<option value="${subject.id}">${subject.name}</option>`)
      .join("");
  }

  // ================================
  // EPIC 4: Teacher Management
  // TASK 4.7: Display teacher table
  // ================================
  function renderTeachers() {
    const teachers = getTeachers();
    const subjects = getSubjects();

    tableBody.innerHTML = teachers
      .map((teacher) => {
        const names = (teacher.subjectIds || [])
          .map((id) => subjects.find((subject) => subject.id === id)?.name)
          .filter(Boolean)
          .join(", ") || "-";

        return `
          <tr>
            <td>${teacher.id}</td>
            <td>${teacher.name}</td>
            <td>${names}</td>
            <td>
              <button class="btn" data-action="edit" data-id="${teacher.id}">Edit</button>
              <button class="btn btn-danger" data-action="delete" data-id="${teacher.id}">Delete</button>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  function resetForm() {
    form.reset();
    idInput.value = "";
    [...subjectsSelect.options].forEach((option) => {
      option.selected = false;
    });
    clearInlineErrors(form);
  }

  function getSelectedSubjectIds() {
    return [...subjectsSelect.selectedOptions].map((option) => option.value);
  }

  function syncSubjectsTeacher(teacherId, selectedSubjectIds) {
    const subjects = getSubjects();
    const updatedSubjects = subjects.map((subject) => {
      if (selectedSubjectIds.includes(subject.id)) {
        return { ...subject, teacherId };
      }
      if (subject.teacherId === teacherId) {
        return { ...subject, teacherId: "" };
      }
      return subject;
    });
    saveSubjects(updatedSubjects);
  }

  // ================================
  // EPIC 4: Teacher Management
  // TASK 4.2: Add teacher
  // TASK 4.3: Edit teacher
  // TASK 4.6: Save to localStorage
  // ================================
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearInlineErrors(form);

    const id = idInput.value.trim();
    const name = nameInput.value.trim();
    const subjectIds = getSelectedSubjectIds();

    if (!Validators.required(name)) {
      setInlineError("teacher-name", "Name is required");
      return;
    }

    const teachers = getTeachers();

    if (id) {
      const updated = teachers.map((teacher) =>
        teacher.id === id ? { ...teacher, name, subjectIds } : teacher
      );
      saveTeachers(updated);
      syncSubjectsTeacher(id, subjectIds);
      logActivity(`Teacher updated: ${name}`);
      showAlert("page-alert", "Teacher updated.");
    } else {
      const newTeacherId = generateId("TCH");
      teachers.push({ id: newTeacherId, name, subjectIds });
      saveTeachers(teachers);
      syncSubjectsTeacher(newTeacherId, subjectIds);
      logActivity(`Teacher created: ${name}`);
      showAlert("page-alert", "Teacher added.");
    }

    resetForm();
    renderSubjectOptions();
    renderTeachers();
  });

  // ================================
  // EPIC 4: Teacher Management
  // TASK 4.4: Delete teacher
  // ================================
  tableBody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const id = target.dataset.id;
    const action = target.dataset.action;
    if (!id || !action) return;

    const teachers = getTeachers();
    const selected = teachers.find((teacher) => teacher.id === id);
    if (!selected) return;

    if (action === "edit") {
      idInput.value = selected.id;
      nameInput.value = selected.name;
      [...subjectsSelect.options].forEach((option) => {
        option.selected = (selected.subjectIds || []).includes(option.value);
      });
      return;
    }

    if (action === "delete") {
      const updated = teachers.filter((teacher) => teacher.id !== id);
      saveTeachers(updated);

      const subjects = getSubjects().map((subject) =>
        subject.teacherId === id ? { ...subject, teacherId: "" } : subject
      );
      saveSubjects(subjects);

      logActivity(`Teacher deleted: ${selected.name}`);
      showAlert("page-alert", "Teacher deleted.", "warning");
      renderSubjectOptions();
      renderTeachers();
    }
  });

  document.getElementById("teachers-reset").addEventListener("click", resetForm);

  renderSubjectOptions();
  renderTeachers();
})();
