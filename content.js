console.log("✅ Folder Manager Content Script Loaded!");

// Example: Modify DOM in CSP-safe way
const div = document.createElement('div');
div.textContent = "Hello from Folder Manager!";
div.style.background = "#ffd700";
document.body.appendChild(div);
