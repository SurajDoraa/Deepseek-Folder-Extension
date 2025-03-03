console.log("Deepseek Folder Manager Extension Loaded");

// Function to check if the sidebar exists and add our test block
function injectTestBlock() {
    const sidebar = document.querySelector('.flex.h-full.w-[260px].flex-col');

    if (sidebar && !document.getElementById('folderManagerTestDiv')) {
        console.log("✅ Sidebar found! Injecting test block...");

        const testDiv = document.createElement('div');
        testDiv.id = 'folderManagerTestDiv';
        testDiv.textContent = "🔷 Deepseek Folder Manager - Ready!";
        testDiv.style.padding = "10px";
        testDiv.style.background = "#f0f0f0";
        testDiv.style.border = "1px solid #ccc";
        testDiv.style.margin = "10px 0";
        testDiv.style.fontWeight = "bold";

        sidebar.prepend(testDiv);
    } else if (!sidebar) {
        console.warn("❌ Sidebar not found yet, retrying...");
        setTimeout(injectTestBlock, 1000); // Keep trying until Deepseek fully loads
    }
}

// Start checking once content script loads
injectTestBlock();
