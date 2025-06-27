document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/api/photos";
  const galleryGrid = document.getElementById("gallery-grid");
  const pagination = document.getElementById("pagination");
  const filterButtons = document.querySelectorAll(".filter-menu-active button");

  const IMAGES_PER_PAGE = 4;
  let allImages = [];
  let filteredImages = [];
  let currentPage = 1;

  function fetchImages() {
    fetch(`${API_URL}?limit=100&sort=-createdAt`)
      .then((res) => res.json())
      .then((data) => {
        allImages = data.docs;
        filteredImages = allImages;
        renderGallery();
        renderPagination();
      })
      .catch((err) => console.error("Image loading failed:", err));
  }

  function renderGallery() {
    galleryGrid.innerHTML = "";
    const start = (currentPage - 1) * IMAGES_PER_PAGE;
    const selected = filteredImages.slice(start, start + IMAGES_PER_PAGE);
    selected.forEach((item) => {
      const col = document.createElement("div");
      col.className = "col-md-6";
      const thumb = document.createElement("div");
      thumb.className = "portfolio-thumb";
      const anchor = document.createElement("a");
      anchor.className = "popup-image icon-btn";
      const imageUrl = `http://localhost:3000${item.photo.url}`;
      anchor.href = imageUrl;
      anchor.innerHTML = '<i class="far fa-eye"></i>';
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = item.photo.alt || "Gallery";
      img.className = "img-fluid";
      thumb.appendChild(anchor);
      thumb.appendChild(img);
      col.appendChild(thumb);
      galleryGrid.appendChild(col);
    });
    // Re-initialize Magnific Popup for new elements
    if (window.$ && $.fn.magnificPopup) {
      $(".portfolio-area .popup-image").magnificPopup({
        type: "image",
        mainClass: "mfp-zoom-in",
        removalDelay: 260,
        gallery: { enabled: true },
      });
    }
  }

  function renderPagination() {
    const totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE);
    if (totalPages <= 1) {
      pagination.innerHTML = "";
      return;
    }
    pagination.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.innerText = i;
      if (i === currentPage) li.classList.add("active");
      a.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage = i;
        renderGallery();
        renderPagination();
      });
      li.appendChild(a);
      pagination.appendChild(li);
    }
    if (currentPage < totalPages) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.innerHTML = `<i class="fas fa-arrow-right"></i>`;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage++;
        renderGallery();
        renderPagination();
      });
      li.appendChild(a);
      pagination.appendChild(li);
    }
  }

  function applyFilter(category) {
    currentPage = 1;
    if (category === "ALL") {
      filteredImages = allImages;
    } else {
      filteredImages = allImages.filter(
        (img) => img.category.toLowerCase() === category.toLowerCase()
      );
    }
    renderGallery();
    renderPagination();
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelector(".filter-menu-active .active")
        ?.classList.remove("active");
      btn.classList.add("active");
      const selected = btn.getAttribute("data-filter");
      applyFilter(selected);
    });
  });

  fetchImages();
});
