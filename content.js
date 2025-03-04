console.log('🚀 Deepseek Folder Manager Loaded with Create Button');

// Sidebar selector - make sure it's correct for Deepseek (check if they change this class in future updates)
const sidebarSelector = '.b8812f16';

function initFolderManager() {
    const sidebar = document.querySelector(sidebarSelector);
    if (sidebar && !document.getElementById('folderManagerContainer')) {
        console.log('✅ Sidebar detected - injecting Folder Manager');
        injectFolderManager(sidebar);
    }
}

function injectFolderManager(sidebar) {
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
    title.innerText = '📂 Folder Manager';
    title.style.fontSize = '14px';
    title.style.marginBottom = '8px';
    folderManager.appendChild(title);

    // Create Folder Button
    const createFolderBtn = document.createElement('button');
    createFolderBtn.innerText = '➕ Create Folder';
    createFolderBtn.style.padding = '6px 10px';
    createFolderBtn.style.backgroundColor = '#4CAF50';
    createFolderBtn.style.color = '#fff';
    createFolderBtn.style.border = 'none';
    createFolderBtn.style.borderRadius = '4px';
    createFolderBtn.style.cursor = 'pointer';
    createFolderBtn.style.marginBottom = '10px';
    createFolderBtn.onclick = createFolderHandler;
    folderManager.appendChild(createFolderBtn);

    // Folder List Container
    const folderList = document.createElement('div');
    folderList.id = 'folderList';
    folderManager.appendChild(folderList);

    sidebar.appendChild(folderManager);

    // Load folders from storage when sidebar is reopened
    loadFoldersFromSyncStorage(folderList);
}

function createFolderHandler() {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
        chrome.storage.sync.get(['deepseekFolders'], (result) => {
            const folders = result.deepseekFolders || [];
            folders.push(folderName);
            chrome.storage.sync.set({ deepseekFolders: folders }, () => {
                addFolder(folderName, document.getElementById('folderList'));
            });
        });
    }
}

function loadFoldersFromSyncStorage(container) {
    chrome.storage.sync.get(['deepseekFolders'], (result) => {
        const savedFolders = result.deepseekFolders || [];
        console.log('📂 Loaded folders from sync:', savedFolders);
        container.innerHTML = '';  // Clear to avoid duplicates
        savedFolders.forEach(folderName => addFolder(folderName, container));
    });
}

function addFolder(name, container) {
    const folder = document.createElement('div');
    folder.dataset.folderName = name;
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
    deleteBtn.style.background = 'none';
    deleteBtn.style.border = 'none';
    deleteBtn.style.color = 'red';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.onclick = () => deleteFolder(name);

    folder.appendChild(deleteBtn);
    container.appendChild(folder);
}

function deleteFolder(folderName) {
    chrome.storage.sync.get(['deepseekFolders'], (result) => {
        const folders = result.deepseekFolders || [];
        const updatedFolders = folders.filter(name => name !== folderName);
        chrome.storage.sync.set({ deepseekFolders: updatedFolders }, () => {
            document.querySelectorAll(`[data-folder-name="${folderName}"]`).forEach(el => el.remove());
        });
    });
}

function observeSidebar() {
    const observer = new MutationObserver(() => {
        initFolderManager();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial check in case sidebar already exists
    initFolderManager();
}

// Start observing
observeSidebar();
