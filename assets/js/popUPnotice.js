document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:3000/api/notice");
    const data = await res.json();
    const activeNotices = data.docs.filter((n) => n.isActive);

    if (!activeNotices.length) return;

    // Only show the latest active one (you can change this logic)
    const notice = activeNotices[0];

    const popupHTML = `
        <div class="notice-overlay"></div>
        <div class="notice-popup">
          <img src="http://localhost:3000${notice.img.url}" alt="${
      notice.img.alt || notice.title
    }">
       
    <button class="close-btn" aria-label="Close Notice">❌</button>
        </div>
      `;

    document.body.insertAdjacentHTML("beforeend", popupHTML);

    const popup = document.querySelector(".notice-popup");
    const overlay = document.querySelector(".notice-overlay");
    const closeBtn = document.querySelector(".notice-popup .close-btn");

    popup.style.display = "flex";
    overlay.style.display = "block";

    closeBtn.addEventListener("click", () => {
      popup.style.display = "none";
      overlay.style.display = "none";
    });
  } catch (error) {
    console.error("Notice popup fetch failed:", error);
  }
});
