document.addEventListener("DOMContentLoaded", () => {
  const loading = document.getElementById("loading");
  const main = document.getElementById("main");
  const sections = document.querySelectorAll(".section");
  const expandedViews = document.querySelectorAll(".expanded-view");
  const closeBtns = document.querySelectorAll(".close-btn");
  const ghostInput = document.getElementById("ghost-input");

  let activeSection = null;
  let ghostTimeout = null;
  let breathingTextEl = null;

  function init() {
    setTimeout(() => {
      loading.classList.add("hidden");
      setTimeout(() => {
        main.classList.add("visible");
        initBreathingText();
      }, 800);
    }, 3500);
  }

  function initBreathingText() {
    breathingTextEl = document.querySelector(".breathing-instruction");
    if (breathingTextEl) {
      updateBreathingText();
    }
  }

  function updateBreathingText() {
    if (!breathingTextEl) return;

    const phases = [
      { text: "Inhale", duration: 4000 },
      { text: "Hold", duration: 4000 },
      { text: "Exhale", duration: 4000 },
    ];

    let currentPhase = 0;

    function cycle() {
      breathingTextEl.style.opacity = "0";
      breathingTextEl.style.filter = "blur(4px)";
      breathingTextEl.style.letterSpacing = "0.5em";

      setTimeout(() => {
        breathingTextEl.textContent = phases[currentPhase].text;
        breathingTextEl.style.opacity = "1";
        breathingTextEl.style.filter = "blur(0)";
        breathingTextEl.style.letterSpacing = "0.3em";
      }, 1500); // Wait 1.5s for the fade out to finish

      setTimeout(() => {
        currentPhase = (currentPhase + 1) % phases.length;
        cycle();
      }, phases[currentPhase].duration);
    }

    cycle();
  }

  function openSection(sectionName) {
    const view = document.getElementById(`${sectionName}-expanded`);
    if (!view) return;

    activeSection = sectionName;
    view.classList.add("active");
    document.body.style.overflow = "hidden";

    if (sectionName === "ghost") {
      setTimeout(() => ghostInput?.focus(), 500);
    }

    if (sectionName === "darkroom") {
      initDarkRoom();
    }
  }

  function closeSection() {
    if (!activeSection) return;

    const view = document.getElementById(`${activeSection}-expanded`);
    if (view) {
      view.classList.remove("active");
    }

    if (activeSection === "ghost" && ghostInput) {
      ghostInput.value = "";
      ghostInput.classList.remove("fading");
    }

    if (activeSection === "darkroom") {
      clearDarkRoom();
    }

    activeSection = null;
    document.body.style.overflow = "";
  }

  function initDarkRoom() {
    const canvas = document.getElementById("darkroom-canvas");
    if (!canvas) return;

    canvas.addEventListener("click", handleDarkRoomClick);
  }

  function clearDarkRoom() {
    const canvas = document.getElementById("darkroom-canvas");
    if (!canvas) return;

    canvas.innerHTML = "";
    canvas.removeEventListener("click", handleDarkRoomClick);
  }

  function handleDarkRoomClick(e) {
    const canvas = document.getElementById("darkroom-canvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const light = document.createElement("div");
    light.className = "gratitude-light";
    light.style.left = `${x}px`;
    light.style.top = `${y}px`;

    // Slight color variation for elegance
    const hue = Math.random() > 0.5 ? 45 : 210; // warm gold or very soft blue
    const saturation = Math.random() * 20 + 80;
    light.style.boxShadow = `
            0 0 40px 20px hsla(${hue}, ${saturation}%, 90%, 0.8),
            0 0 100px 40px hsla(${hue}, ${saturation}%, 70%, 0.4),
            0 0 200px 80px hsla(${hue}, 100%, 50%, 0.05)
        `;

    canvas.appendChild(light);
  }

  function fadeGhostText() {
    if (!ghostInput || !ghostInput.value.trim()) return;

    ghostInput.classList.add("fading");

    setTimeout(() => {
      ghostInput.value = "";
      ghostInput.classList.remove("fading");
      ghostInput.classList.add("appearing");
      ghostInput.focus();

      setTimeout(() => {
        ghostInput.classList.remove("appearing");
      }, 1000);
    }, 2000);
  }

  function handleGhostInput() {
    if (ghostTimeout) clearTimeout(ghostTimeout);

    if (ghostInput.value.trim()) {
      ghostTimeout = setTimeout(fadeGhostText, 3000);
    }
  }

  function handleGhostKeydown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (ghostTimeout) clearTimeout(ghostTimeout);
      fadeGhostText();
    }
  }

  sections.forEach((section) => {
    const sectionName = section.dataset.section;

    section.addEventListener("click", () => openSection(sectionName));
    section.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openSection(sectionName);
      }
    });
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", closeSection);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeSection) {
      closeSection();
    }
  });

  if (ghostInput) {
    ghostInput.addEventListener("input", handleGhostInput);
    ghostInput.addEventListener("keydown", handleGhostKeydown);
  }

  expandedViews.forEach((view) => {
    view.addEventListener("click", (e) => {
      if (e.target === view) {
        closeSection();
      }
    });
  });

  init();
});
