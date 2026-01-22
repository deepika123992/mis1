function analyzeImage() {
  const fileInput = document.getElementById("imageInput");
  const result = document.getElementById("imageResult");

  if (!fileInput.files.length) {
    result.innerHTML = `<span style="color:red">❌ No image selected.</span>`;
    return;
  }

  const file = fileInput.files[0];
  const name = file.name.toLowerCase();

  let confidence = 100;
  let positives = [];
  let redFlags = [];

  /* =====================================
     1. TRUSTED SOURCE DETECTION (KEY FIX)
     ===================================== */
  const trustedKeywords = [
    "isro", "nasa", "gov", "iit", "who",
    "bbc", "reuters", "un", "official"
  ];

  const isTrusted = trustedKeywords.some(k => name.includes(k));

  if (isTrusted) {
    positives.push("Image appears to originate from a trusted or official source");
  } else {
    confidence -= 15;
    redFlags.push("Source of image cannot be verified");
  }

  /* =====================================
     2. FILE FORMAT CHECK
     ===================================== */
  if (file.type === "image/jpeg" || file.type === "image/png") {
    positives.push("Standard photographic image format used");
  } else {
    confidence -= 25;
    redFlags.push("Non-standard image format detected");
  }

  /* =====================================
     3. FILE SIZE CHECK (BALANCED)
     ===================================== */
  if (file.size < 30000) {
    confidence -= 20;
    redFlags.push("Unusually small image size (possible AI generation)");
  } else if (file.size > 8000000) {
    confidence -= 10;
    redFlags.push("Very large image size (possible heavy editing)");
  } else {
    positives.push("File size within normal photographic range");
  }

  /* =====================================
     4. AI-GENERATED NAME SIGNALS
     ===================================== */
  const aiSignals = ["ai", "generated", "midjourney", "dalle", "stable"];
  if (aiSignals.some(s => name.includes(s))) {
    confidence -= 35;
    redFlags.push("Filename suggests AI-generated image");
  }

  /* =====================================
     5. DOCUMENT / CERTIFICATE LOGIC
     ===================================== */
  const docSignals = ["certificate", "degree", "aadhaar", "id", "license"];
  if (docSignals.some(d => name.includes(d))) {
    confidence -= 35;
    redFlags.push("Document image detected – prone to forgery");
    redFlags.push("Potential typography or alignment inconsistencies");
  }

  /* =====================================
     6. METADATA HANDLING (IMPORTANT FIX)
     ===================================== */
  if (!isTrusted) {
    confidence -= 15;
    redFlags.push("Image metadata missing or stripped");
  } else {
    positives.push("Metadata status acceptable for official images");
  }

  /* =====================================
     7. FINAL NORMALIZATION
     ===================================== */
  confidence = Math.max(0, Math.min(confidence, 100));

  let verdict = "";
  let color = "";

  if (confidence >= 80) {
    verdict = "✅ Likely Authentic Image";
    color = "green";
  } else if (confidence >= 50) {
    verdict = "⚠️ Suspicious – Needs Verification";
    color = "orange";
  } else {
    verdict = "🚨 Likely Fake / AI-Generated / Manipulated";
    color = "red";
  }

  /* =====================================
     OUTPUT
     ===================================== */
  result.innerHTML = `
    <div style="border-left:6px solid ${color}; padding-left:12px">
      <b style="color:${color}">${verdict}</b><br><br>

      <b>Confidence Score:</b> ${confidence}%<br><br>

      <b>Why this result:</b>
      <ul>
        ${positives.map(p => `<li>${p}</li>`).join("")}
      </ul>

      <b>Red Flags Identified:</b>
      <ul>
        ${redFlags.length
          ? redFlags.map(r => `<li>${r}</li>`).join("")
          : "<li>No major red flags detected</li>"
        }
      </ul>
    </div>
  `;
}