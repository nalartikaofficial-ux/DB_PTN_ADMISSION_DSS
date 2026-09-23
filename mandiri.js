/**
 * Mandiri Component Specification Handler
 */
const MandiriModule = {
  renderProgramMandiri: function(progData) {
    const container = document.getElementById("mandiri-program-details");
    if (!container) return;

    if (!progData || !progData.mandiri) {
      container.innerHTML = "<p>Data parameter jalur Mandiri untuk program ini belum tersedia pada database.</p>";
      return;
    }

    const m = progData.mandiri;
    container.innerHTML = `
      <div style="background:#f1f5f9; padding:12px; border-radius:6px;">
        <h4>Jalur: ${m.jalur_mandiri || 'Mandiri Reguler'}</h4>
        <p>Alokasi Kursi: ${m.daya_tampung || '-'} | Peminat: ${m.peminat || '-'}</p>
        <p>Bobot Rapor: ${((m.bobot_akademik || 0) * 100)}% | Bobot Tes: ${((m.bobot_tes || 0) * 100)}%</p>
      </div>
    `;
  }
};
