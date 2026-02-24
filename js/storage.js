"use strict";

// ================================
// EPIC 9: Storage Service Layer
// TASK 9.1: Create reusable storage.js service
// ================================
const APP_KEYS = {
  USERS: "sms_users",
  CURRENT_USER: "sms_current_user",
  STUDENTS: "sms_students",
  TEACHERS: "sms_teachers",
  CLASSES: "sms_classes",
  SUBJECTS: "sms_subjects",
  GRADES: "sms_grades",
  ACTIVITIES: "sms_activities"
};

// ================================
// EPIC 9: Storage Service Layer
// TASK 9.2: Implement getData/saveData/updateData/deleteData
// TASK 9.5: Handle corrupted data safely
// ================================
const StorageService = {
  getData(key, fallback = []) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed ?? fallback;
    } catch (error) {
      console.error(`Corrupted storage for key: ${key}`, error);
      return fallback;
    }
  },

  saveData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Failed to save key: ${key}`, error);
      return false;
    }
  },

  updateData(key, id, updates = {}) {
    try {
      const list = this.getData(key, []);
      const updated = list.map((item) => (item.id === id ? { ...item, ...updates } : item));
      this.saveData(key, updated);
      return updated;
    } catch (error) {
      console.error(`Failed to update key: ${key}`, error);
      return this.getData(key, []);
    }
  },

  deleteData(key, id) {
    try {
      const list = this.getData(key, []);
      const filtered = list.filter((item) => item.id !== id);
      this.saveData(key, filtered);
      return filtered;
    } catch (error) {
      console.error(`Failed to delete key: ${key}`, error);
      return this.getData(key, []);
    }
  }
};

// ================================
// EPIC 9: Storage Service Layer
// TASK 9.3: Seed initial data
// TASK 9.4: Handle empty localStorage
// ================================
(function seedInitialData() {
  const defaultUsers = [{ id: "USR-1", email: "admin@sms.com", password: "123456", role: "admin" }];

  if (!localStorage.getItem(APP_KEYS.USERS)) {
    StorageService.saveData(APP_KEYS.USERS, defaultUsers);
  }

  if (!localStorage.getItem(APP_KEYS.CLASSES)) {
    StorageService.saveData(APP_KEYS.CLASSES, [
      { id: "CLS-1", name: "Class A", studentIds: [] },
      { id: "CLS-2", name: "Class B", studentIds: [] }
    ]);
  }

  if (!localStorage.getItem(APP_KEYS.STUDENTS)) {
    StorageService.saveData(APP_KEYS.STUDENTS, []);
  }

  if (!localStorage.getItem(APP_KEYS.TEACHERS)) {
    StorageService.saveData(APP_KEYS.TEACHERS, []);
  }

  if (!localStorage.getItem(APP_KEYS.SUBJECTS)) {
    StorageService.saveData(APP_KEYS.SUBJECTS, []);
  }

  if (!localStorage.getItem(APP_KEYS.GRADES)) {
    StorageService.saveData(APP_KEYS.GRADES, []);
  }

  if (!localStorage.getItem(APP_KEYS.ACTIVITIES)) {
    StorageService.saveData(APP_KEYS.ACTIVITIES, []);
  }
})();
