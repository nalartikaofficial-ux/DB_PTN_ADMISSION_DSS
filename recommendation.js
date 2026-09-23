/**
 * Recommendation Presentation Component
 */
const RecommendationModule = {
  renderResults: function(recommendations) {
    const sec = document.getElementById("section-results");
    const container = document.getElementById("cards-recommendation-container");
    if (!sec || !container) return;

    container.innerHTML = "";
    sec.classList.remove("hidden");

    if (!recommendations || recommendations.length === 0) {
      container.innerHTML = "<p>Tidak ada hasil rekomendasi yang dapat dihitung.</p>";
      return;
    }

    recommendations.forEach(rec => {
      const card = document.createElement("div");
      card.className = "rec-card";

      const reasons = JSON.parse(rec.reason || "[]");
      const risks = JSON.parse(rec.risk_factors || "[]");
      const strategies = JSON.parse(rec.strategy || "[]");

      card.innerHTML = `
        <span class="rec-badge badge-${rec.category}">${rec.category}</span>
        <h3>${rec.nama_prodi}</h3>
        <p class="text-muted" style="font-size:0.875rem; margin-bottom:12px;">${rec.nama_ptn} | Jalur ${rec.jalur}</p>

        <div style="background:#f8fafc; padding:8px; border-radius:4px; margin-bottom:12px; font-size:0.875rem;">
          <p>Match Score: <strong>${rec.match_score} / 100</strong></p>
          <p>Confidence: <strong>${rec.confidence}</strong> (Data Quality: ${rec.data_quality_score}%)</p>
        </div>

        <div style="font-size:0.85rem; margin-bottom:10px;">
          <strong>Dasar Analisis:</strong>
          <ul style="padding-left:18px; margin-top:4px;">
            ${reasons.map(r => `<li>${r}</li>`).join("")}
          </ul>
        </div>

        ${risks.length > 0 ? `
          <div style="font-size:0.85rem; margin-bottom:10px; color:#b91c1c;">
            <strong>Faktor Risiko Kompetisi:</strong>
            <ul style="padding-left:18px; margin-top:4px;">
              ${risks.map(rf => `<li>${rf}</li>`).join("")}
            </ul>
          </div>
        ` : ''}

        <div style="font-size:0.85rem; color:#15803d;">
          <strong>Arahan Taktis:</strong>
          <ul style="padding-left:18px; margin-top:4px;">
            ${strategies.map(s => `<li>${s}</li>`).join("")}
          </ul>
        </div>
      `;
      container.appendChild(card);
    });

    sec.scrollIntoView({ behavior: 'smooth' });
  }
};
