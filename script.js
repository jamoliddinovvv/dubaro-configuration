const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-navigation");
const accessoriesDropdown = document.querySelector(".nav-dropdown");
const accessoriesToggle = document.querySelector(".nav-dropdown-toggle");
const filterToggle = document.querySelector(".filter-toggle");
const filterPanel = document.querySelector("#filter-panel");
const filterInputs = [...filterPanel.querySelectorAll("input[type='checkbox']")];
const filterCount = document.querySelector(".filter-active-count");
const productGrid = document.querySelector("#product-grid");
const productCards = [...productGrid.querySelectorAll(".product-card")];
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const sortSelect = document.querySelector("#sort-select");
const searchToggle = document.querySelector(".search-toggle");
const catalogSearch = document.querySelector(".catalog-search");
const searchInput = document.querySelector("#catalog-search");
const readMoreButton = document.querySelector(".read-more");
const introExtra = document.querySelector("#intro-extra");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
  navigation.classList.toggle("open", isOpen);
  if (!isOpen) {
    accessoriesDropdown.classList.remove("open");
    accessoriesToggle.setAttribute("aria-expanded", "false");
  }
});

accessoriesToggle.addEventListener("click", () => {
  const isOpen = accessoriesToggle.getAttribute("aria-expanded") !== "true";
  accessoriesToggle.setAttribute("aria-expanded", String(isOpen));
  accessoriesDropdown.classList.toggle("open", isOpen);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Menü öffnen");
    accessoriesDropdown.classList.remove("open");
    accessoriesToggle.setAttribute("aria-expanded", "false");
  });
});

filterToggle.addEventListener("click", () => {
  const isOpen = filterToggle.getAttribute("aria-expanded") !== "true";
  filterToggle.setAttribute("aria-expanded", String(isOpen));
  filterPanel.hidden = !isOpen;
});

function getSelections(groupName) {
  return filterInputs
    .filter((input) => input.name === groupName && input.checked)
    .map((input) => input.value);
}

function updateProducts() {
  const platforms = getSelections("platform");
  const memories = getSelections("memory");
  const query = searchInput.value.trim().toLocaleLowerCase("de");
  const activeFilters = platforms.length + memories.length;
  let visibleCount = 0;

  for (const card of productCards) {
    const cardPlatforms = card.dataset.platform.split(" ");
    const cardMemories = card.dataset.memory.split(" ");
    const matchesPlatform = platforms.length === 0 || platforms.some((platform) => cardPlatforms.includes(platform));
    const matchesMemory = memories.length === 0 || memories.some((memory) => cardMemories.includes(memory));
    const matchesSearch = query.length === 0 || card.dataset.name.toLocaleLowerCase("de").includes(query);
    const isVisible = matchesPlatform && matchesMemory && matchesSearch;
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  }

  resultCount.textContent = String(visibleCount);
  emptyState.hidden = visibleCount !== 0;
  filterCount.hidden = activeFilters === 0;
  filterCount.textContent = String(activeFilters);
}

filterInputs.forEach((input) => input.addEventListener("change", updateProducts));
searchInput.addEventListener("input", updateProducts);

document.querySelector(".clear-filters").addEventListener("click", () => {
  for (const input of filterInputs) input.checked = false;
  searchInput.value = "";
  updateProducts();
});

sortSelect.addEventListener("change", () => {
  const sorting = sortSelect.value;
  const sortedCards = [...productCards].sort((first, second) => {
    if (sorting === "price-asc") return Number(first.dataset.price) - Number(second.dataset.price);
    if (sorting === "price-desc") return Number(second.dataset.price) - Number(first.dataset.price);
    if (sorting === "name") return first.dataset.name.localeCompare(second.dataset.name, "de");
    return Number(first.dataset.recommended) - Number(second.dataset.recommended);
  });
  productGrid.append(...sortedCards);
  updateProducts();
});

searchToggle.addEventListener("click", () => {
  catalogSearch.hidden = !catalogSearch.hidden;
  if (!catalogSearch.hidden) {
    catalogSearch.querySelector("input").focus();
    document.querySelector("#konfiguratoren").scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    searchInput.value = "";
    updateProducts();
  }
});

readMoreButton.addEventListener("click", () => {
  const isExpanded = readMoreButton.getAttribute("aria-expanded") !== "true";
  readMoreButton.setAttribute("aria-expanded", String(isExpanded));
  introExtra.hidden = !isExpanded;
  readMoreButton.firstChild.textContent = isExpanded ? "Weniger lesen " : "Mehr lesen ";
  readMoreButton.querySelector("span").textContent = isExpanded ? "⌃" : "⌄";
});

document.querySelector(".notice-close").addEventListener("click", () => {
  document.querySelector(".notice-bar").remove();
});

document.querySelector(".trustami-close").addEventListener("click", () => {
  document.querySelector(".trustami-bar").remove();
});

updateProducts();
