console.log('🚀 Deepseek Folder Manager Loaded (with Sync Storage)');

// 1️⃣ Wait until the sidebar is available — Deepseek might load dynamically
function waitForSidebar() {
    const sidebar = document.querySelector('.b8812f16'); // Confirmed sidebar class
    if (sidebar) {
        console.log('✅ Sidebar found:', sidebar);
        injectFolderManager(sidebar);
    } else {
        console.log('⏳ Sidebar not found yet, retrying...');
        setTimeout(waitForSidebar, 1000);  // Retry after 1 second
    }
}

// 2️⃣ Inject Folder Manager UI into the sidebar
function injectFolderManager(sidebar) {
    if (document.getElementById('folderManagerContainer')) return;  // Prevent duplicate injection

    const folderManager = document.createElement('div');
    folderManager.id = 'folderManagerContainer';
    folderManager.style.padding = '10px';
    folderManager.style.marginTop = '10px';
    folderManager.style.borderTop = '1px solid rgba(255,255,255,0.2)';
    folderManager.style.color = '#fff';
    folderManager.style.fontFamily = 'Arial, sans-serif';
    folderManager.style.backgroundColor = '#1f1f1f';
    folderManager.style.borderRadius = '5px';

    const title = document.createElement('h3');
    title.innerText = '📂 Folder Manager (Synced)';
    title.style.fontSize = '14px';
    title.style.marginBottom = '8px';
    folderManager.appendChild(title);

    const createFolderButton = document.createElement('button');
    createFolderButton.innerText = '➕ Create Folder';
    createFolderButton.style.padding = '6px 10px';
    createFolderButton.style.cursor = 'pointer';
    createFolderButton.style.background = '#3b82f6';
    createFolderButton.style.color = '#fff';
    createFolderButton.style.border = 'none';
    createFolderButton.style.borderRadius = '4px';

    const folderList = document.createElement('div');
    folderList.id = 'folderList';
    folderList.style.marginTop = '10px';

    createFolderButton.onclick = () => {
        const folderName = prompt('Enter folder name:');
        if (folderName) {
            addFolder(folderName, folderList);
            saveFoldersToSyncStorage();
        }
    };

    folderManager.appendChild(createFolderButton);
    folderManager.appendChild(folderList);
    sidebar.appendChild(folderManager);

    loadFoldersFromSyncStorage(folderList);
}

// 3️⃣ Function to add a folder to the list
function addFolder(name, container) {
    const folder = document.createElement('div');
    folder.innerText = `📁 ${name}`;
    folder.style.marginTop = '5px';
    folder.style.padding = '5px';
    folder.style.background = '#2d2d2d';
    folder.style.borderRadius = '4px';
    folder.style.display = 'flex';
    folder.style.justifyContent = 'space-between';
    folder.style.alignItems = 'center';

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = '❌';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.background = 'transparent';
    deleteBtn.style.color = '#f87171';
    deleteBtn.style.border = 'none';
    deleteBtn.style.fontSize = '12px';

    deleteBtn.onclick = () => {
        folder.remove();
        saveFoldersToSyncStorage();
    };

    folder.appendChild(deleteBtn);
    container.appendChild(folder);
}

// 4️⃣ Save folders to chrome.storage.sync
function saveFoldersToSyncStorage() {
    const folderNames = Array.from(document.querySelectorAll('#folderList div'))
        .map(folder => folder.innerText.replace('❌', '').trim());
    chrome.storage.sync.set({ deepseekFolders: folderNames }, () => {
        console.log('📁 Folders saved to sync storage:', folderNames);
    });
}

// 5️⃣ Load folders from chrome.storage.sync
function loadFoldersFromSyncStorage(container) {
    chrome.storage.sync.get(['deepseekFolders'], (result) => {
        const savedFolders = result.deepseekFolders || [];
        console.log('📂 Loaded folders from sync storage:', savedFolders);
        savedFolders.forEach(folderName => addFolder(folderName, container));
    });
}

// 🚀 Start the sidebar detection
waitForSidebar();
