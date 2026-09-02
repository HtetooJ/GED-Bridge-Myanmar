document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => {
      item.setAttribute("aria-selected", String(item === tab));
    });
    document.querySelectorAll(".panel").forEach((panel) => {
      panel.hidden = panel.id !== tab.dataset.panel;
    });
  });
});

document.querySelectorAll(".quiz-dock").forEach((dock) => {
  const toggle = dock.querySelector(".dock-toggle");
  const title = dock.querySelector(".dock-title");
  const expandedTitle = title.textContent;
  const collapsedTitle = dock.dataset.collapsedTitle || "18+6×4−(14+16/4)+72/8";

  toggle.addEventListener("click", () => {
    const collapsed = dock.classList.toggle("is-collapsed");
    toggle.textContent = collapsed ? "Open" : "Hide";
    toggle.setAttribute("aria-expanded", String(!collapsed));
    title.textContent = collapsed ? collapsedTitle : expandedTitle;
    document.documentElement.style.setProperty("--dock-space", collapsed ? "92px" : "190px");
  });
});

function syncQuizState(source) {
  const inputValue = source.querySelector("input")?.value || "";
  const feedback = source.querySelector(".feedback");
  document.querySelectorAll(".quiz-dock, .quiz-inline").forEach((quiz) => {
    if (quiz === source) return;
    const input = quiz.querySelector("input");
    const targetFeedback = quiz.querySelector(".feedback");
    if (input && input.value !== inputValue) input.value = inputValue;
    if (feedback && targetFeedback) {
      targetFeedback.textContent = feedback.textContent;
      targetFeedback.className = feedback.className;
    }
  });
}

document.querySelectorAll(".quiz-dock input, .quiz-inline input").forEach((input) => {
  input.addEventListener("input", () => {
    const quiz = input.closest(".quiz-dock, .quiz-inline");
    syncQuizState(quiz);
  });
});

document.querySelectorAll(".check").forEach((button) => {
  button.addEventListener("click", () => {
    const dock = button.closest(".quiz-dock, .quiz-inline");
    const input = dock.querySelector("input");
    const feedback = dock.querySelector(".feedback");
    const answer = Number(input.value.trim());

    feedback.className = "feedback";
    if (!input.value.trim()) {
      feedback.textContent = "အဖြေတစ်ခုထည့်ပေးပါ။";
      feedback.classList.add("no");
    } else if (answer === 33) {
      feedback.textContent = "မှန်ပါတယ်။ နောက်ဆုံးရလဒ်က 33 ဖြစ်ပါတယ်။";
      feedback.classList.add("ok");
    } else {
      feedback.textContent = "မမှန်သေးပါ။ ကွင်းထဲက 14+16/4၊ ပြီးရင် 72/8 ကို အရင်တွက်ကြည့်ပါ။";
      feedback.classList.add("no");
    }
    syncQuizState(dock);
  });
});

document.querySelectorAll("[data-float-quiz]").forEach((floatingQuiz) => {
  const inlineQuiz = document.querySelector("[data-inline-quiz]");
  if (!inlineQuiz || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    const ratio = entries[0]?.intersectionRatio || 0;
    inlineQuiz.classList.toggle("is-merge-visible", ratio > 0.06);
    inlineQuiz.classList.toggle("is-active-end", ratio > 0.58);
    floatingQuiz.classList.toggle("is-merging-at-end", ratio > 0.06 && ratio <= 0.58);
    floatingQuiz.classList.toggle("is-docked-at-end", ratio > 0.58);
    document.documentElement.style.setProperty("--dock-space", ratio > 0.58 ? "34px" : "190px");
  }, { threshold: [0, 0.06, 0.24, 0.58, 0.82] });

  observer.observe(inlineQuiz);
});
