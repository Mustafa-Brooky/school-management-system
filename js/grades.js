"use strict";

// ================================
// EPIC 7: Grades System
// TASK 7.1: Create grades page
// ================================
(function gradesModule() {
  if (document.body.dataset.page !== "grades") return;

  const form = document.getElementById("grades-form");
  const idInput = document.getElementById("grade-id");
  const studentSelect = document.getElementById("grade-student");
  const subjectSelect = document.getElementById("grade-subject");
  const gradeInput = document.getElementById("grade-value");
  const classFilter = document.getElementById("grades-class-filter");
  const tableBody = document.getElementById("grades-table-body");
  const reportBody = document.getElementById("report-table-body");

  function getStudents() {
    return StorageService.getData(APP_KEYS.STUDENTS, []);
  }

  function getSubjects() {
    return StorageService.getData(APP_KEYS.SUBJECTS, []);
  }

  function getClasses() {
    return StorageService.getData(APP_KEYS.CLASSES, []);
  }

  function getGrades() {
    return StorageService.getData(APP_KEYS.GRADES, []);
  }

  function saveGrades(data) {
    StorageService.saveData(APP_KEYS.GRADES, data);
  }

  function renderSelects() {
    const students = getStudents();
    const subjects = getSubjects();
    const classes = getClasses();

    studentSelect.innerHTML = ['<option value="">Select Student</option>']
      .concat(students.map((student) => `<option value="${student.id}">${student.name}</option>`))
      .join("");

    subjectSelect.innerHTML = ['<option value="">Select Subject</option>']
      .concat(subjects.map((subject) => `<option value="${subject.id}">${subject.name}</option>`))
      .join("");

    classFilter.innerHTML = ['<option value="">All Classes</option>']
      .concat(classes.map((cls) => `<option value="${cls.id}">${cls.name}</option>`))
      .join("");
  }

  function getStatusBadge(value) {
    return Number(value) >= 50
      ? '<span class="badge-pass">Pass</span>'
      : '<span class="badge-fail">Fail</span>';
  }

  function studentAverage(studentId) {
    const grades = getGrades().filter((item) => item.studentId === studentId);
    if (!grades.length) return 0;
    return grades.reduce((sum, item) => sum + Number(item.grade), 0) / grades.length;
  }

  // ================================
  // EPIC 7: Grades System
  // TASK 7.9: Filter grades by class
  // TASK 7.8: Display pass/fail status
  // ================================
  function renderGrades() {
    const grades = getGrades();
    const students = getStudents();
    const subjects = getSubjects();
    const selectedClass = classFilter.value;

    const filtered = grades.filter((item) => {
      if (!selectedClass) return true;
      const student = students.find((s) => s.id === item.studentId);
      return student?.classId === selectedClass;
    });

    tableBody.innerHTML = filtered
      .map((item) => {
        const student = students.find((s) => s.id === item.studentId);
        const subject = subjects.find((s) => s.id === item.subjectId);

        return `
          <tr>
            <td>${student?.name || "Unknown"}</td>
            <td>${subject?.name || "Unknown"}</td>
            <td>${item.grade}</td>
            <td>${getStatusBadge(item.grade)}</td>
            <td>
              <button class="btn" data-action="edit" data-id="${item.id}">Edit</button>
              <button class="btn btn-danger" data-action="delete" data-id="${item.id}">Delete</button>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  // ================================
  // EPIC 7: Grades System
  // TASK 7.7: Calculate student average
  // TASK 7.10: Show student report
  // ================================
  function renderReport() {
    const students = getStudents();

    reportBody.innerHTML = students
      .map((student) => {
        const avg = studentAverage(student.id);
        return `
          <tr>
            <td>${student.name}</td>
            <td>${avg.toFixed(2)}</td>
            <td>${getStatusBadge(avg)}</td>
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
  // EPIC 7: Grades System
  // TASK 7.2: Add grade
  // TASK 7.3: Edit grade
  // TASK 7.5: Validate grade (0-100)
  // TASK 7.6: Prevent duplicate grade per student/subject
  // EPIC 10: Validation & Error Handling
  // TASK 10.2/10.3/10.5
  // ================================
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearInlineErrors(form);

    const id = idInput.value.trim();
    const studentId = studentSelect.value;
    const subjectId = subjectSelect.value;
    const grade = gradeInput.value.trim();

    let valid = true;

    if (!Validators.required(studentId)) {
      setInlineError("grade-student", "Student is required");
      valid = false;
    }

    if (!Validators.required(subjectId)) {
      setInlineError("grade-subject", "Subject is required");
      valid = false;
    }

    if (!Validators.numberInRange(grade, 0, 100)) {
      setInlineError("grade-value", "Grade must be between 0 and 100");
      valid = false;
    }

    if (!valid) return;

    const grades = getGrades();
    const duplicate = grades.find(
      (item) => item.studentId === studentId && item.subjectId === subjectId && item.id !== id
    );

    if (duplicate) {
      showAlert("page-alert", "Duplicate grade for this student and subject.", "error");
      return;
    }

    if (id) {
      const updated = grades.map((item) =>
        item.id === id ? { ...item, studentId, subjectId, grade: Number(grade) } : item
      );
      saveGrades(updated);
      logActivity("Grade updated.");
      showAlert("page-alert", "Grade updated.");
    } else {
      grades.push({ id: generateId("GRD"), studentId, subjectId, grade: Number(grade) });
      saveGrades(grades);
      logActivity("Grade added.");
      showAlert("page-alert", "Grade added.");
    }

    resetForm();
    renderGrades();
    renderReport();
  });

  // ================================
  // EPIC 7: Grades System
  // TASK 7.4: Delete grade
  // ================================
  tableBody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const id = target.dataset.id;
    const action = target.dataset.action;
    if (!id || !action) return;

    const grades = getGrades();
    const selected = grades.find((item) => item.id === id);
    if (!selected) return;

    if (action === "edit") {
      idInput.value = selected.id;
      studentSelect.value = selected.studentId;
      subjectSelect.value = selected.subjectId;
      gradeInput.value = selected.grade;
      return;
    }

    if (action === "delete") {
      saveGrades(grades.filter((item) => item.id !== id));
      logActivity("Grade deleted.");
      showAlert("page-alert", "Grade deleted.", "warning");
      renderGrades();
      renderReport();
    }
  });

  classFilter.addEventListener("change", renderGrades);
  document.getElementById("show-report").addEventListener("click", renderReport);
  document.getElementById("grades-reset").addEventListener("click", resetForm);

  renderSelects();
  renderGrades();
  renderReport();
})();
