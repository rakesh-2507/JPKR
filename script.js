// Select all menu buttons (both top header & sticky)
const menuButtons = document.querySelectorAll(".menu-btn, #menuToggle");
const overlay = document.getElementById("overlay");
const sideMenu = document.getElementById("sideMenu");
const closeMenu = document.getElementById("closeMenu");

// Open side menu when any button is clicked
menuButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    overlay.style.width = "100%";
    sideMenu.style.left = "0";
  });
});

// Close side menu via X button
closeMenu.addEventListener("click", () => {
  overlay.style.width = "0";
  sideMenu.style.left = "-300px";
});

// Close side menu by clicking outside
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.style.width = "0";
    sideMenu.style.left = "-300px";
  }
});

// Toggle submenus
document.querySelectorAll(".side-menu .menu-item .arrow").forEach((arrow) => {
  arrow.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const submenu = arrow.parentElement.querySelector(".side-submenu");
    if (submenu) {
      submenu.style.display =
        submenu.style.display === "flex" ? "none" : "flex";
    }
  });
});
// Header dropdown handling
const headerItems = document.querySelectorAll(".header-bottom .menu-item");
const dropdownContainer = document.getElementById("dropdownContainer");
const dropdownContents = document.querySelectorAll(".header-dropdown-content");
let hideTimeout;

headerItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    clearTimeout(hideTimeout);
    const dropdownId = item.getAttribute("data-dropdown");

    // Hide all dropdowns first
    dropdownContents.forEach((dc) => (dc.style.display = "none"));

    // Show this dropdown and use flex
    const dropdown = document.getElementById(dropdownId);
    dropdown.style.display = "flex";
    dropdownContainer.style.display = "block";
  });
});

dropdownContainer.addEventListener("mouseleave", () => {
  hideTimeout = setTimeout(() => {
    dropdownContainer.style.display = "none";
    dropdownContents.forEach((dc) => (dc.style.display = "none"));
  }, 200);
});

// Helper functions
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function formatSubmenu(hash) {
  return hash.replace("#", "").replace(/submenu(\d+)/i, "Submenu $1");
}

// Page-specific script for JPKR page
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section.submenuone");
  const links = document.querySelectorAll(".section-link");
  const breadcrumb = document.querySelector("#breadcrumb-bar .breadcrumb");

  if (!breadcrumb || sections.length === 0) return; // Only run on this page

  function updateBreadcrumb(visibleSectionId) {
    breadcrumb.innerHTML = "";

    // Page breadcrumb
    const currentPath = window.location.pathname.split("/").pop();
    if (currentPath) {
      const pageItem = document.createElement("li");
      pageItem.classList.add("breadcrumb-item");
      pageItem.innerHTML = `<a href="${currentPath}">${currentPath.replace(
        ".html",
        ""
      )}</a>`;
      breadcrumb.appendChild(pageItem);
    }

    // Section breadcrumb (using anchor text)
    const activeLink = document.querySelector(
      `.section-link[data-target="${visibleSectionId}"]`
    );
    if (activeLink) {
      const subItem = document.createElement("li");
      subItem.classList.add("breadcrumb-item", "active");
      subItem.textContent = activeLink.textContent.trim(); // <- use anchor text here
      breadcrumb.appendChild(subItem);
    }

    // Update active link
    links.forEach((link) => link.classList.remove("active"));
    if (activeLink) activeLink.classList.add("active");
  }

  // Handle section link clicks
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("data-target");

      // Show only clicked section
      sections.forEach((sec) => {
        sec.style.display = sec.id === targetId ? "flex" : "none";
      });

      // Update breadcrumb and URL hash
      updateBreadcrumb(targetId);
      history.replaceState(null, "", `#${targetId}`);
    });
  });

  // Show section from hash on load
  const hash = window.location.hash.slice(1);
  if (hash) {
    sections.forEach((sec) => {
      sec.style.display = sec.id === hash ? "flex" : "none";
    });
    updateBreadcrumb(hash);
  } else {
    // Show first section by default
    sections.forEach((sec, i) => {
      sec.style.display = i === 0 ? "flex" : "none";
    });
    updateBreadcrumb(sections[0].id);
  }
});
