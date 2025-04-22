 // Create stars background
 function createStars() {
  const stars = document.getElementById('stars');
  const count = 150;

  for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';

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
      "JavaScript": "#f1e05a",
      "TypeScript": "#2b7489",
      "HTML": "#e34c26",
      "CSS": "#c49dff",
      "Python": "#3572A5",
      "Java": "#b07219",
      "C#": "#178600",
      "PHP": "#4F5D95",
      "Ruby": "#701516",
      "Go": "#00ADD8",
      "Swift": "#ffac45",
      "Kotlin": "#F18E33",
      "Rust": "#dea584",
      "C++": "#f34b7d",
      "Yacc": "#39af22",
  };
  return colors[lang] || "#b6a3a3";
}

const username = "mraxays";
const pinned = ["clipxjs", "portfolio", "todoapp", "node-express-ejs-tailwindcss-starter", "dev-notes"];

// Create stars on load
createStars();

fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`)
  .then(res => res.json())
  .then(repos => {
      const list = document.getElementById("repo-list");
      document.getElementById("loader").style.display = "none";
      list.style.display = "grid";

      // Add animation to repo list
      list.style.animation = "fadeIn 0.8s ease-out";

      // Build pinned repo objects first
      const pinnedRepos = pinned
          .map(name => repos.find(r => r.name === name))
          .filter(Boolean);

      // Other repos, sorted by updated desc
      const otherRepos = repos
          .filter(r => !pinned.includes(r.name))
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

      // Combine
      const sortedRepos = [...pinnedRepos, ...otherRepos];

      sortedRepos.forEach((repo, index) => {
          const isPinned = pinned.includes(repo.name);
          const card = document.createElement("div");
          card.className = "repo";
          card.style.animationDelay = `${index * 0.1}s`;

          const langColor = getLanguageColor(repo.language);
          const updatedDate = new Date(repo.updated_at).toLocaleDateString();

          card.innerHTML = `
              <a class="card-link" href="${repo.html_url}" target="_blank" aria-label="Open ${repo.name}"></a>
              <div class="content">
                  <h3>${isPinned ? '<span class="pin">📌</span>' : ''}${repo.name}</h3>
                  <p>${repo.description || "A mysterious repository with untold secrets."}</p>
                  <div class="meta">
                      <span title="Stars">
                          <svg height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.047 2.97.72 4.197a.75.75 0 01-1.088.791L8 11.347l-3.767 1.98a.75.75 0 01-1.088-.79l.72-4.197L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/></svg>
                          ${repo.stargazers_count}
                      </span>
                      <span class="language" style="background: #ffffff20; color: ${langColor};">${repo.language || "Unknown"}</span>
                  </div>
              </div>
          `;
          list.appendChild(card);
      });
  })
  .catch(err => {
      console.error("Failed to fetch repos:", err);
      document.getElementById("loader").style.display = "none";
      document.getElementById("repo-list").style.display = "block";
      document.getElementById("repo-list").innerHTML = "<p style='color:#fff;text-align:center;'>Houston, we have a problem loading repositories.</p>";
  });