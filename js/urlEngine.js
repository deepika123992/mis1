function analyzeURL() {
  const url = document.getElementById("urlInput").value.trim();
  const result = document.getElementById("urlResult");

  if (!url) {
    result.innerHTML = "❌ No URL provided.";
    return;
  }

  let risk = 0;
  let reasons = [];

  // Check common fake patterns
  const fakeKeywords = ['login','verify','secure','update','alert','free','reward'];
  fakeKeywords.forEach(word => {
    if(url.toLowerCase().includes(word)) {
      risk += 25;
      reasons.push(`Contains suspicious keyword: "${word}"`);
    }
  });

  // Shorteners
  if(/bit\.ly|tinyurl|t\.co|shorturl/i.test(url)) {
    risk += 25;
    reasons.push("Uses URL shortener");
  }

  // Untrusted domains
  if(/\.(xyz|top|click|info)$/i.test(url)) {
    risk += 20;
    reasons.push("Untrusted or unusual domain");
  }

  // Missing HTTPS
  if(!url.startsWith("https://")) {
    risk += 20;
    reasons.push("Not using HTTPS");
  }

  if(risk > 100) risk = 100;

  let label = risk >= 70 ? "🚨 FAKE / HIGH RISK" :
              risk >= 40 ? "⚠️ SUSPICIOUS" : 
              "✅ LIKELY REAL";

  result.innerHTML = `
    <b>${label}</b><br>
    <b>Risk Score:</b> ${risk}%<br>
    <b>Reasons:</b>
    <ul>${reasons.map(r=>`<li>${r}</li>`).join("")}</ul>
  `;
}