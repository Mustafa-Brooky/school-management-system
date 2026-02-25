"use strict";

// ================================
// EPIC 2: Authentication
// TASK 2.3: Create default admin user
// ================================
function ensureDefaultAdminUser() {
  const users = StorageService.getData(APP_KEYS.USERS, []);
  const exists = users.some((user) => user.email === "admin@sms.com");

  if (!exists) {
    users.push({ id: generateId("USR"), email: "admin@sms.com", password: "123456", role: "admin" });
    StorageService.saveData(APP_KEYS.USERS, users);
  }
}

// ================================
// EPIC 2: Authentication
// TASK 2.1: Create login form
// TASK 2.2: Validate login inputs
// TASK 2.4: Save currentUser in localStorage
// TASK 2.5: Redirect after login
// ================================
function setupLoginForm() {
  if (document.body.dataset.page !== "login") return;

  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearInlineErrors(form);

    const email = document.getElementById("email")?.value.trim() || "";
    const password = document.getElementById("password")?.value.trim() || "";

    let hasError = false;

    if (!Validators.required(email)) {
      setInlineError("email", "Email is required");
      hasError = true;
    }

    if (!Validators.required(password)) {
      setInlineError("password", "Password is required");
      hasError = true;
    }

    if (hasError) {
      showAlert("auth-alert", "Please complete login fields.", "error");
      return;
    }

    const users = StorageService.getData(APP_KEYS.USERS, []);
    const found = users.find((user) => user.email === email && user.password === password);

    if (!found) {
      showAlert("auth-alert", "Invalid email or password.", "error");
      return;
    }

    StorageService.saveData(APP_KEYS.CURRENT_USER, found);
    logActivity(`User ${found.email} logged in.`);
    window.location.href = "dashboard.html";
  });
}

// ================================
// EPIC 2: Authentication
// TASK 2.6: Implement logout
// TASK 2.7: Protect private pages
// ================================
function setupLogout() {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.id === "logout-btn") {
      const currentUser = StorageService.getData(APP_KEYS.CURRENT_USER, null);
      if (currentUser?.email) {
        logActivity(`User ${currentUser.email} logged out.`);
      }
      localStorage.removeItem(APP_KEYS.CURRENT_USER);
      const base = getBasePath();
      window.location.href = `${base}login.html`;
    }
  });
}

function initializeSampleData() {
  // Initialize sample students
  if (!StorageService.getData(APP_KEYS.STUDENTS)) {
    const sampleStudents = [
      { id: 1, name: "أحمد محمد", email: "ahmed@student.com", classId: 1, grade: "A" },
      { id: 2, name: "فاطمة علي", email: "fatima@student.com", classId: 1, grade: "B" },
      { id: 3, name: "محمد خالد", email: "mohammed@student.com", classId: 2, grade: "A" },
      { id: 4, name: "مريم أحمد", email: "mariam@student.com", classId: 2, grade: "C" },
      { id: 5, name: "عبدالله سعد", email: "abdullah@student.com", classId: 3, grade: "B" }
    ];
    StorageService.saveData(APP_KEYS.STUDENTS, sampleStudents);
  }

  // Initialize sample teachers
  if (!StorageService.getData(APP_KEYS.TEACHERS)) {
    const sampleTeachers = [
      { id: 1, name: "د. محمد الأحمدي", email: "mohammed@teacher.com", subject: "الرياضيات" },
      { id: 2, name: "أ. فاطمة القحطاني", email: "fatima@teacher.com", subject: "اللغة العربية" },
      { id: 3, name: "أ. خالد العتيبي", email: "khalid@teacher.com", subject: "العلوم" }
    ];
    StorageService.saveData(APP_KEYS.TEACHERS, sampleTeachers);
  }

  // Initialize sample classes
  if (!StorageService.getData(APP_KEYS.CLASSES)) {
    const sampleClasses = [
      { id: 1, name: "الصف الأول أ", teacherId: 1, capacity: 30 },
      { id: 2, name: "الصف الثاني ب", teacherId: 2, capacity: 25 }
    ];
    StorageService.saveData(APP_KEYS.CLASSES, sampleClasses);
  }

  // Initialize sample subjects
  if (!StorageService.getData(APP_KEYS.SUBJECTS)) {
    const sampleSubjects = [
      { id: 1, name: "الرياضيات", code: "MATH101", teacherId: 1 },
      { id: 2, name: "اللغة العربية", code: "ARB101", teacherId: 2 },
      { id: 3, name: "العلوم", code: "SCI101", teacherId: 3 },
      { id: 4, name: "اللغة الإنجليزية", code: "ENG101", teacherId: 1 }
    ];
    StorageService.saveData(APP_KEYS.SUBJECTS, sampleSubjects);
  }

  // Initialize sample grades
  if (!StorageService.getData(APP_KEYS.GRADES)) {
    const sampleGrades = [
      { id: 1, studentId: 1, subjectId: 1, grade: 95, semester: "الأول" },
      { id: 2, studentId: 1, subjectId: 2, grade: 88, semester: "الأول" },
      { id: 3, studentId: 2, subjectId: 1, grade: 82, semester: "الأول" },
      { id: 4, studentId: 2, subjectId: 3, grade: 91, semester: "الأول" },
      { id: 5, studentId: 3, subjectId: 1, grade: 97, semester: "الأول" }
    ];
    StorageService.saveData(APP_KEYS.GRADES, sampleGrades);
  }

  // Initialize sample activities
  if (!StorageService.getData(APP_KEYS.ACTIVITIES)) {
    const sampleActivities = [
      { id: 1, message: "User admin@sms.com logged in", timestamp: new Date().toISOString() },
      { id: 2, message: "New student أحمد محمد added", timestamp: new Date().toISOString() },
      { id: 3, message: "Grade updated for فاطمة علي", timestamp: new Date().toISOString() },
      { id: 4, message: "New class الصف الأول أ created", timestamp: new Date().toISOString() },
      { id: 5, message: "Teacher د. محمد الأحمدي assigned to الرياضيات", timestamp: new Date().toISOString() }
    ];
    StorageService.saveData(APP_KEYS.ACTIVITIES, sampleActivities);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ensureDefaultAdminUser();
  initializeSampleData();
  setupLoginForm();
  setupLogout();

  if (document.body.dataset.page === "index") {
    window.location.href = "login.html";
  }
});
