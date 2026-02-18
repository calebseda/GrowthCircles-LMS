// main.js
// General scripts for GrowthCircles LMS
// Mobile-first, offline-first principles

// Global state
let lessonsData = null;

// Load lessons from JSON
async function loadLessons(jsonPath = "data/dreamertrack.json") {
  try {
    console.log("Fetching lessons from:", jsonPath);
    const response = await fetch(jsonPath);

    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }

    const text = await response.text();
    lessonsData = JSON.parse(text);
    console.log("Lessons loaded:", lessonsData);

    renderLessonList();
    showWelcome();
  } catch (err) {
    console.error("Failed to load lessons:", err);
    document.getElementById("lessonDetail").innerHTML =
      "<p style='color:red'>Error loading lessons. Check JSON path.</p>";
  }
}

// Render sidebar lesson list
function renderLessonList() {
  const lessonList = document.getElementById("lessonList");
  lessonList.innerHTML = "";

  if (!lessonsData || !lessonsData.lessons) {
    console.error("No lessons found in JSON");
    return;
  }

  lessonsData.lessons.forEach((lesson) => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = lesson.title;
    card.onclick = () => showLesson(lesson);
    lessonList.appendChild(card);
  });

  // Add Audit Trail card
  const auditCard = document.createElement("div");
  auditCard.className = "card";
  auditCard.textContent = "Audit Trail";
  auditCard.onclick = () => showAuditTrail();
  lessonList.appendChild(auditCard);
}

// Show welcome message
function showWelcome() {
  const detail = document.getElementById("lessonDetail");
  detail.innerHTML = `
    <h2>Welcome to GrowthCircles LMS</h2>
    <p>Select a lesson from the sidebar to begin your journey.</p>
  `;
}

// Show lesson details
function showLesson(lesson) {
  const detail = document.getElementById("lessonDetail");
  detail.innerHTML = `
    <h2>${lesson.title}</h2>
    <p>${lesson.description}</p>
    <p><strong>Objective:</strong> ${lesson.objective || "N/A"}</p>
  `;
}

// Show audit trail (placeholder)
function showAuditTrail() {
  const detail = document.getElementById("lessonDetail");
  detail.innerHTML = `
    <h2>Audit Trail</h2>
    <p>Here you will see learner submissions and sponsor-ready reports.</p>
  `;
}

// Trigger lesson loading on page load
window.onload = () => {
  console.log("Page loaded. Starting lesson fetch...");
  loadLessons();
};
