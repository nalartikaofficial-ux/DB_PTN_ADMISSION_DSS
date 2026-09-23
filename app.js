/**
 * Main Frontend Application Entry & Event Wiring
 */
document.addEventListener("DOMContentLoaded", async function() {
  GradesModule.init();
  SnbtModule.init();

  // Tab Switching
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.add("hidden"));
      
      this.classList.add("active");
      const targetPane = document.getElementById(this.dataset.tab);
      if (targetPane) targetPane.classList.remove("hidden");

      if (this.dataset.tab === "tab-snbp") AppState.activePathway = "SNBP";
      if (this.dataset.tab === "tab-snbt") AppState.activePathway = "SNBT";
      if (this.dataset.tab === "tab-mandiri") AppState.activePathway = "MANDIRI";
    });
  });

  // Load Programs ke Dropdown
  async function loadDropdownPrograms() {
    try {
      const programs = await ApiService.get("getPrograms");
      AppState.programs = programs;
      const sel1 = document.getElementById("select-target-1");
      const sel2 = document.getElementById("select-target-2");

      sel1.innerHTML = '<option value="">Pilih Program Sasaran 1</option>';
      sel2.innerHTML = '<option value="">Pilih Program Alternatif 2</option>';

      programs.forEach(p => {
        const opt = `<option value="${p.program_id}">${p.nama_ptn} - ${p.nama_prodi} (${p.jenjang})</option>`;
        sel1.insertAdjacentHTML("beforeend", opt);
        sel2.insertAdjacentHTML("beforeend", opt);
      });
    } catch (e) {
      showStatus("Gagal memuat daftar program studi dari database.", "error");
    }
  }

  function showStatus(msg, type = "info") {
    const banner = document.getElementById("status-banner");
    banner.innerText = msg;
    banner.className = `status-banner ${type}`;
    banner.classList.remove("hidden");
    setTimeout(() => banner.classList.add("hidden"), 5000);
  }

  // Bind Grade Table Changes
  document.getElementById("tbody-grades").addEventListener("input", function(e) {
    if (e.target.classList.contains("input-sem")) {
      const idx = Number(e.target.dataset.idx);
      const sem = Number(e.target.dataset.sem);
      const val = e.target.value !== "" ? Number(e.target.value) : null;
      AppState.grades[idx][`semester_${sem}`] = val;
      GradesModule.recalculateGrandSummary();
    }
  });

  // Action Analisis
  document.getElementById("btn-run-analysis").addEventListener("click", async function() {
    const studentData = {
      nama: document.getElementById("nama").value,
      nis: document.getElementById("nis").value,
      kelas: document.getElementById("kelas").value,
      jurusan: document.getElementById("jurusan").value,
      ranking: document.getElementById("ranking").value || null,
      total_siswa: document.getElementById("total_siswa").value || null
    };

    const errors = Validation.validateStudentProfile(studentData);
    if (errors.length > 0) {
      showStatus(errors.join(" "), "error");
      return;
    }

    const t1 = document.getElementById("select-target-1").value;
    const t2 = document.getElementById("select-target-2").value;
    if (!t1) {
      showStatus("Pilihan program studi sasaran 1 wajib dipilih.", "error");
      return;
    }

    const targetIds = [t1];
    if (t2) targetIds.push(t2);

    try {
      showStatus("Menyimpan profil dan memproses analisis...", "info");
      
      // Simpan profile ke backend
      const savedStudent = await ApiService.post("saveStudent", { student: studentData });
      AppState.student.student_id = savedStudent.student_id;

      // Simpan nilai rapor
      await ApiService.post("saveGrades", {
        student_id: savedStudent.student_id,
        grades: AppState.grades
      });

      // Jalankan evaluasi sesuai jalur aktif
      let recs = [];
      if (AppState.activePathway === "SNBP") {
        recs = await ApiService.post("evaluateSNBP", {
          student_id: savedStudent.student_id,
          target_program_ids: targetIds
        });
      } else if (AppState.activePathway === "SNBT") {
        // Ambil input UTBK
        const toScore1 = Number(document.querySelector('.input-utbk[data-to="1"]')?.value) || 0;
        await ApiService.post("saveUTBK", {
          student_id: savedStudent.student_id,
          utbk: [{ tryout_number: 1, total_score: toScore1 }]
        });
        recs = await ApiService.post("evaluateSNBT", {
          student_id: savedStudent.student_id,
          target_program_ids: targetIds
        });
      }

      RecommendationModule.renderResults(recs);
      showStatus("Analisis rekomendasi berhasil diproses.", "success");
    } catch (err) {
      showStatus(err.message, "error");
    }
  });

  // Draft Save/Load
  document.getElementById("btn-save-draft").addEventListener("click", () => {
    StorageModule.saveDraft();
    showStatus("Draf formulir tersimpan lokal di peramban ini.", "success");
  });

  document.getElementById("btn-load-draft").addEventListener("click", () => {
    const draft = StorageModule.loadDraft();
    if (!draft) {
      showStatus("Tidak ada rekaman draf lokal yang ditemukan.", "error");
      return;
    }
    document.getElementById("nama").value = draft.student.nama || "";
    document.getElementById("nis").value = draft.student.nis || "";
    document.getElementById("kelas").value = draft.student.kelas || "";
    document.getElementById("jurusan").value = draft.student.jurusan || "";
    AppState.grades = draft.grades || [];
    GradesModule.render();
    showStatus("Draf lokal berhasil dimuat.", "success");
  });

  document.getElementById("btn-print").addEventListener("click", () => window.print());

  // Bootstrap initial data
  loadDropdownPrograms();
});
