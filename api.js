/**
 * API Service Client
 */
const ApiService = {
  // Ganti URL deployment Google Apps Script di sini
  BASE_URL:"https://script.google.com/macros/s/AKfycbwmLIM9QsJurBedF9QggKsl0-lEOZqpPHFWsx4I4ysmpW2NTwZi_uvrATpLkuVVHZpF/exec",

  get: async function(action, params = {}) {
    const url = new URL(this.BASE_URL);
    url.searchParams.append("action", action);
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) url.searchParams.append(k, v);
    }

    try {
      const res = await fetch(url.toString(), { credentials: "omit" });
      if (!res.ok) throw new Error(`HTTP error status: ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal memproses request");
      return json.data;
    } catch (err) {
      console.error(`API GET [${action}] Error:`, err);
      throw err;
    }
  },

  post: async function(action, payload = {}) {
    const url = `${this.BASE_URL}?action=${encodeURIComponent(action)}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        credentials: "omit",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`HTTP error status: ${res.status}`);
      const json = await res.json();
      if (!json.success) {
        const detailMsg = json.error && json.error.details ? json.error.details.join(", ") : "";
        throw new Error(`${json.message} ${detailMsg}`);
      }
      return json.data;
    } catch (err) {
      console.error(`API POST [${action}] Error:`, err);
      throw err;
    }
  }
};
