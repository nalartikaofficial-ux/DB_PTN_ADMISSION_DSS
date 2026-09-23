/**
 * Local Draft Storage (m18_eduanalytics_draft)
 */
const StorageModule = {
  STORAGE_KEY: "m18_eduanalytics_draft",

  saveDraft: function() {
    const draft = {
      student: AppState.student,
      grades: AppState.grades,
      utbk: AppState.utbk,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(draft));
    return true;
  },

  loadDraft: function() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Gagal membaca local draft", e);
      return null;
    }
  }
};
