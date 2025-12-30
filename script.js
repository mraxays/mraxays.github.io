// Create stars background
function createStars() {
  const stars = document.getElementById("stars");
  const count = 150;

  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star";

    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;

    // Random size
    const size = Math.random() * 3;

    // Random delay for twinkling
    const delay = Math.random() * 5;

    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDelay = `${delay}s`;

    stars.appendChild(star);
  }
}

// Get language color
function getLanguageColor(lang) {
  const colors = {
    JavaScript: "#f1e05a",
    TypeScript: "#2b7489",
    HTML: "#e34c26",
    CSS: "#c49dff",
    Python: "#3572A5",
    Java: "#b07219",
    "C#": "#178600",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Go: "#00ADD8",
    Swift: "#ffac45",
    Kotlin: "#F18E33",
    Rust: "#dea584",
    "C++": "#f34b7d",
    Yacc: "#39af22",
  };
  return colors[lang] || "#b6a3a3";
}
document.getElementById("search").addEventListener("input", searchRepositories);

let allRepos = []; // Store all repos globally

const username = "mraxays";
const pinned = [
  "co-invoice",
  "clipxjs",
  "clipx-web",
  "node-express-ejs-tailwindcss-starter",
  "dev-notes",
  "portfolio",
  "todoapp",
  "youtube-downloader",
];

// Create stars on load
createStars();

fetch(
  `https://api.github.com/users/${username}/repos?sort=updated&direction=desc`
)
  .then((res) => res.json())
  .then((repos) => {
    allRepos = repos; // Store fetched repos globally
    const list = document.getElementById("repo-list");
    document.getElementById("loader").style.display = "none";
    list.style.display = "grid";

    // Add animation to repo list
    list.style.animation = "fadeIn 0.8s ease-out";

    // Build pinned repo objects first
    const pinnedRepos = pinned
      .map((name) => repos.find((r) => r.name === name))
      .filter(Boolean);

    // Other repos, sorted by updated desc
    const otherRepos = repos
      .filter((r) => !pinned.includes(r.name))
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    // Combine
    const sortedRepos = [...pinnedRepos, ...otherRepos];
    displayRepos(sortedRepos);
  })
  .catch((err) => {
    console.error("Failed to fetch repos:", err);
    document.getElementById("loader").style.display = "none";
    document.getElementById("repo-list").style.display = "block";
    document.getElementById("repo-list").innerHTML =
      "<p style='color:#fff;text-align:center;'>Houston, we have a problem loading repositories.</p>";
  });
function displayRepos(repos) {
  const list = document.getElementById("repo-list");
  list.innerHTML = ""; // Clear existing list

  repos.forEach((repo, index) => {
    const isPinned = pinned.includes(repo.name);
    const card = document.createElement("div");
    card.className = "repo";
    card.style.animationDelay = `${index * 0.1}s`;

    const langColor = getLanguageColor(repo.language);
    const updatedDate = new Date(repo.updated_at).toLocaleDateString();

    card.innerHTML = `
    <a class="card-link" href="${
      repo.html_url
    }" target="_blank" aria-label="Open ${repo.name}"></a>
    <div class="content">
      <h3>${isPinned ? '<span class="pin">📌</span>' : ""}${repo.name}</h3>
      <p>${
        repo.description || "A mysterious repository with untold secrets."
      }</p>
      <div class="meta">
        <span title="Stars">
          <svg height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.047 2.97.72 4.197a.75.75 0 01-1.088.791L8 11.347l-3.767 1.98a.75.75 0 01-1.088-.79l.72-4.197L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
          </svg>
          ${repo.stargazers_count}
        </span>
        <span class="language" style="background: #ffffff20; color: ${langColor};">${
      repo.language || "Unknown"
    }</span>
      </div>
    </div>
  `;
    list.appendChild(card);
  });
}

// Search repositories based on input
function searchRepositories() {
  const query = document.getElementById("search").value.toLowerCase();

  // Filter repositories based on the search query
  const filteredRepos = allRepos.filter((repo) => {
    return (
      repo.name.toLowerCase().includes(query) ||
      (repo.description && repo.description.toLowerCase().includes(query)) ||
      (repo.language && repo.language.toLowerCase().includes(query))

    );
  });

  // Display filtered repositories
  displayRepos(filteredRepos);
}

document.addEventListener("DOMContentLoaded", function () {
  const placeholderTexts = [
    "Search for a repository...",
    "Find your next project...",
    "Explore my digital universe...",
    "Discover awesome repositories...",
  ];

  let currentIndex = 0;
  const searchInput = document.getElementById("search");

  let typingSpeed = 100; // Speed at which each character is typed
  let eraseSpeed = 50; // Speed at which text is erased
  let pauseBetweenTexts = 1000; // Pause after each placeholder text before typing the next one

  function typePlaceholder(text) {
    let i = 0;
    searchInput.setAttribute("placeholder", "");
    const typingInterval = setInterval(() => {
      searchInput.setAttribute("placeholder", text.substring(0, i + 1));
      i++;
      if (i === text.length) {
        clearInterval(typingInterval);
        setTimeout(() => erasePlaceholder(), pauseBetweenTexts); // Pause before erasing
      }
    }, typingSpeed);
  }

  function erasePlaceholder() {
    let i = searchInput.getAttribute("placeholder").length;
    const erasingInterval = setInterval(() => {
      searchInput.setAttribute(
        "placeholder",
        searchInput.getAttribute("placeholder").substring(0, i - 1)
      );
      i--;
      if (i === 0) {
        clearInterval(erasingInterval);
        currentIndex = (currentIndex + 1) % placeholderTexts.length;
        setTimeout(() => typePlaceholder(placeholderTexts[currentIndex]), 200); // Small delay before typing new text
      }
    }, eraseSpeed);
  }

  typePlaceholder(placeholderTexts[currentIndex]); // Start typing the first placeholder

  // Start cycling placeholders after the initial typing effect
  setInterval(() => {
    if (
      searchInput.getAttribute("placeholder") === placeholderTexts[currentIndex]
    ) {
      erasePlaceholder();
    }
  }, placeholderTexts[currentIndex].length * typingSpeed + pauseBetweenTexts);
});

// Add event listener for Enter key
document
  .getElementById("search")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      searchRepositories();
    }
  });
// CTRL + K to focus on search input (works with both lowercase and uppercase)
document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key.toLowerCase() === "k") {
    event.preventDefault();
    document.getElementById("search").focus();
  }
});
// CTRL + L to clear search input (works with both lowercase and uppercase)
document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key.toLowerCase() === "l") {
    event.preventDefault();
    document.getElementById("search").value = "";
    displayRepos(allRepos);
  }
});
// Change key text on hover
const changeKey = document.getElementById("change-key");

// Change keyboard shortcut display based on search content
document.getElementById("search").addEventListener("input", function () {
  if (this.value.length > 0) {
    document.getElementById("change-key").textContent = "L";
  } else {
    document.getElementById("change-key").textContent = "K";
  }
});

