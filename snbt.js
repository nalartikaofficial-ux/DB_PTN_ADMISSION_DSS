/**
 * SNBT Multi-TO Subtest Module
 */
const SnbtModule = {
  subtests: [
    "Penalaran Umum",
    "Pemahaman Bacaan & Menulis",
    "Pengetahuan & Pemahaman Umum",
    "Pengetahuan Kuantitatif",
    "Literasi Bahasa Indonesia",
    "Literasi Bahasa Inggris",
    "Penalaran Matematika"
  ],

  init: function() {
    const tbody = document.getElementById("tbody-utbk");
    if (!tbody) return;
    tbody.innerHTML = "";

    this.subtests.forEach((st, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${st}</strong></td>
        <td><input type="number" min="0" max="1000" class="input-utbk" data-st="${idx}" data-to="1" placeholder="-" style="width:80px"></td>
        <td><input type="number" min="0" max="1000" class="input-utbk" data-st="${idx}" data-to="2" placeholder="-" style="width:80px"></td>
        <td><input type="number" min="0" max="1000" class="input-utbk" data-st="${idx}" data-to="3" placeholder="-" style="width:80px"></td>
        <td id="utbk-avg-${idx}">-</td>
        <td id="utbk-traj-${idx}">Stabil</td>
      `;
      tbody.appendChild(tr);
    });
  }
};
