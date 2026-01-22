function analyzeText() {
  const text = document.getElementById("textInput").value.trim();
  const result = document.getElementById("textResult");

  if(!text) {
    result.innerHTML = "❌ No text provided.";
    return;
  }

  let risk = 0;
  let reasons = [];

  // Sensational words
  const sensWords = ['shocking','breaking','miracle','guaranteed','must share','viral','100%'];
  sensWords.forEach(word => {
    if(text.toLowerCase().includes(word)) {
      risk += 30;
      reasons.push(`Contains sensational word: "${word}"`);
    }
  });

  // Absolute statements
  const absWords = ['always','never','everyone','nobody'];
  absWords.forEach(word => {
    if(text.toLowerCase().includes(word)) {
      risk += 20;
      reasons.push(`Uses absolute statement: "${word}"`);
    }
  });

  // No source
  if(!/according to|source|reported by|study|research/i.test(text)) {
    risk += 25;
    reasons.push("No credible source mentioned");
  }

  // Short text warning
  if(text.split(" ").length < 5) {
    risk += 10;
    reasons.push("Text too short for verification");
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