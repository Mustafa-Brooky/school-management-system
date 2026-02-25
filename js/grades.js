"use strict";

// ================================
// EPIC 7: Grades System
// TASK 7.1: Create grades page
// ================================


  // ================================
  // EPIC 7: Grades System
  // TASK 7.9: Filter grades by class
  // TASK 7.8: Display pass/fail status
  // ================================

  
  // ================================
  // EPIC 7: Grades System
  // TASK 7.7: Calculate student average
  // TASK 7.10: Show student report
  // ================================
  
  
  // ================================
  // EPIC 7: Grades System
  // TASK 7.2: Add grade
  // TASK 7.3: Edit grade
  // TASK 7.5: Validate grade (0-100)
  // TASK 7.6: Prevent duplicate grade per student/subject
  // EPIC 10: Validation & Error Handling
  // TASK 10.2/10.3/10.5
  // ================================
  
  // ================================
  // EPIC 7: Grades System
  // TASK 7.4: Delete grade
  // ================================
  "use strict";

// ================================
// Sample Data Initialization
// ================================
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

// ================================
// Mobile Menu Functionality
// ================================
function initMobileMenu() {
  const body = document.body;
  
  // Create mobile menu toggle button
  const menuToggle = document.createElement('button');
  menuToggle.className = 'mobile-menu-toggle';
  menuToggle.innerHTML = '☰';
  menuToggle.setAttribute('aria-label', 'Toggle menu');
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  
  // Add to body
  body.appendChild(menuToggle);
  body.appendChild(overlay);
  
  // Toggle menu function
  function toggleMenu() {
    const sidebar = document.querySelector('.sidebar');
    const overlayEl = document.querySelector('.sidebar-overlay');
    
    sidebar.classList.toggle('open');
    overlayEl.classList.toggle('active');
  }
  
  // Event listeners
  menuToggle.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);
  
  // Close menu when clicking on nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const sidebar = document.querySelector('.sidebar');
      const overlayEl = document.querySelector('.sidebar-overlay');
      sidebar.classList.remove('open');
      overlayEl.classList.remove('active');
    });
  });
}

// ================================
// EPIC 1: UI & Layout
// TASK 1.2: Create sidebar navigation
// ================================
function getBasePath() {
  return window.location.pathname.includes("/pages/") ? "../" : "";
}

function buildSidebar(activePage) {
  const base = getBasePath();
  const links = [
    { key: "dashboard", label: "Dashboard", href: `${base}dashboard.html`, icon: "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='3' y='3' width='18' height='18' rx='2'/><path d='M3 9h18'/><path d='M9 21V9'/></svg>" },
    { key: "students", label: "Students", href: `${base}pages/students.html`, icon: "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M23 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/></svg>" },
    { key: "teachers", label: "Teachers", href: `${base}pages/teachers.html`, icon: "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 2L2 7l10 5 10-5-10-5z'/><path d='M2 17l10 5 10-5'/><path d='M2 12l10 5 10-5'/></svg>" },
    { key: "classes", label: "Classes", href: `${base}pages/classes.html`, icon: "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/><polyline points='9 22 9 12 15 12 15 22'/></svg>" },
    { key: "subjects", label: "Subjects", href: `${base}pages/subjects.html`, icon: "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20'/><path d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'/></svg>" },
    { key: "grades", label: "Grades", href: `${base}pages/grades.html`, icon: "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><line x1='18' y1='20' x2='18' y2='10'/><line x1='12' y1='20' x2='12' y2='4'/><line x1='6' y1='20' x2='6' y2='14'/></svg>" }
  ];

  return `
    <nav class="sidebar">
      <h2>SMS Admin</h2>
      ${links
        .map(
          (link) =>
            `<a class="nav-link ${link.key === activePage ? "active" : ""}" href="${link.href}">
              <span class="nav-icon">${link.icon}</span>
              <span>${link.label}</span>
            </a>`
        )
        .join("")}
    </nav>
  `;
}

// ================================
// EPIC 1: UI & Layout
// TASK 1.3: Create top navbar
// TASK 1.7: Create logout button
// ================================
function buildTopbar() {
  const currentUser = StorageService.getData(APP_KEYS.CURRENT_USER, null);
  const email = currentUser?.email || "Guest";

  return `
    <div class="topbar">
      <span class="user-badge">Signed in as: ${email}</span>
      <button class="btn btn-danger" id="logout-btn" type="button">Logout</button>
    </div>
  `;
}

// ================================
// EPIC 1: UI & Layout
// TASK 1.6: Create alert component
// ================================
function showAlert(elementId, message, type = "success") {
  const target = document.getElementById(elementId);
  if (!target) return;

  target.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  setTimeout(() => {
    if (target) target.innerHTML = "";
  }, 3000);
}

function renderEmptyState(elementId, message) {
  const target = document.getElementById(elementId);
  if (!target) return;
  target.innerHTML = `<div class="empty-state">${message}</div>`;
}

function clearEmptyState(elementId) {
  const target = document.getElementById(elementId);
  if (!target) return;
  target.innerHTML = "";
}

// ================================
// EPIC 10: Validation & Error Handling
// TASK 10.1: Create reusable validation functions
// TASK 10.2: Validate required fields
// TASK 10.3: Validate numbers
// ================================

// ================================
// EPIC 3/4/5/6/7 Shared Utils
// TASK Shared: Generate unique IDs and activity logs
// ================================
function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function logActivity(message) {
  const activity = StorageService.getData(APP_KEYS.ACTIVITIES, []);
  activity.unshift({ id: generateId("ACT"), message, timestamp: new Date().toISOString() });
  StorageService.saveData(APP_KEYS.ACTIVITIES, activity.slice(0, 12));
}

// ================================
// EPIC 1: UI & Layout
// TASK 1.8: Protect pages (redirect if not logged in)
// ================================
function protectPage() {
  const needsProtection = document.body.dataset.protected === "true";
  if (!needsProtection) return;

  const currentUser = StorageService.getData(APP_KEYS.CURRENT_USER, null);
  if (!currentUser) {
    const base = getBasePath();
    window.location.href = `${base}login.html`;
  }
}

function setupShell() {
  const page = document.body.dataset.page;
  const sidebar = document.getElementById("sidebar");
  const topbar = document.getElementById("topbar");

  if (sidebar) sidebar.innerHTML = buildSidebar(page);
  if (topbar) topbar.innerHTML = buildTopbar();
}

// ================================
// EPIC 8: Dashboard & Reports
// TASK 8.1/8.2/8.3/8.4/8.5/8.6/8.7
// ================================

  