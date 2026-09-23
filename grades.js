/**
 * Rapor Table Management & Summary
 */
const GradesModule = {
  defaultSubjects: [
    "Matematika (Wajib)", "Bahasa Indonesia", "Bahasa Inggris",
    "Fisika", "Kimia", "Biologi"
  ],

  init: function() {
    if (AppState.grades.length === 0) {
      AppState.grades = this.defaultSubjects.map(m => ({
        mapel: m,
        semester_1: null,
        semester_2: null,
        semester_3: null,
        semester_4: null,
        semester_5: null
      }));
    }
    this.render();
  },

  render: function() {
    const tbody = document.getElementById("tbody-grades");
    if (!tbody) return;
    tbody.innerHTML = "";

    AppState.grades.forEach((g, idx) => {
      const tr = document.createElement("tr");
      let semInputs = "";
      for (let s = 1; s <= 5; s++) {
        const val = g[`semester_${s}`] !== null ? g[`semester_${s}`] : "";
        semInputs += `<td><input type="number" min="0" max="100" class="input-sem" data-idx="${idx}" data-sem="${s}" value="${val}" style="width:65px"></td>`;
      }

      tr.innerHTML = `
        <td><input type="text" value="${g.mapel}" class="input-mapel" data-idx="${idx}" style="width:100%"></td>
        ${semInputs}
        <td class="row-avg" id="avg-row-${idx}">-</td>
        <td><button type="button" class="btn btn-sm btn-secondary btn-del-mapel" data-idx="${idx}">&times;</button></td>
      `;
      tbody.appendChild(tr);
    });

    this.recalculateGrandSummary();
  },

  recalculateGrandSummary: function() {
    let grandSum = 0;
    let grandCount = 0;

    AppState.grades.forEach((g, idx) => {
      let rSum = 0, rCount = 0;
      for (let s = 1; s <= 5; s++) {
        const val = g[`semester_${s}`];
        if (val !== null && val !== "" && !isNaN(val)) {
          rSum += Number(val);
          rCount++;
        }
      }
      const rAvg = rCount > 0 ? (rSum / rCount).toFixed(1) : "-";
      const el = document.getElementById(`avg-row-${idx}`);
      if (el) el.innerText = rAvg;

      grandSum += rSum;
      grandCount += rCount;
    });

    const grandAvg = grandCount > 0 ? (grandSum / grandCount).toFixed(2) : "-";
    const elGrand = document.getElementById("summary-grand-avg");
    if (elGrand) elGrand.innerText = grandAvg;
  }
};
