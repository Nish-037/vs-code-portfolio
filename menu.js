// Menu System
document.addEventListener('DOMContentLoaded', () => {
    // Menu State Management
    let activeDropdown = null;
    let terminalHistory = [];
    let historyIndex = -1;
    let undoStack = [];
    let redoStack = [];
    let activeEditor = null;

    // Initialize Menu System
    initializeMenus();
    initializeKeyboardShortcuts();
    initializeTerminal();
    initializeSearch();
    initializeExplorer();

    // Menu Initialization
    function initializeMenus() {
        const menuTriggers = document.querySelectorAll('.menu-trigger');
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdown = trigger.nextElementSibling;
                
                if (activeDropdown && activeDropdown !== dropdown) {
                    activeDropdown.classList.add('hidden');
                }
                
                dropdown.classList.toggle('hidden');
                activeDropdown = dropdown.classList.contains('hidden') ? null : dropdown;
            });
        });

        // Handle menu item clicks
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = item.getAttribute('data-action');
                handleMenuAction(action);
                if (activeDropdown) {
                    activeDropdown.classList.add('hidden');
                    activeDropdown = null;
                }
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            if (activeDropdown) {
                activeDropdown.classList.add('hidden');
                activeDropdown = null;
            }
        });
    }

    // Initialize Explorer
    function initializeExplorer() {
        const explorerItems = document.querySelectorAll('.explorer-item');
        let activeExplorerItem = null;

        explorerItems.forEach(item => {
            item.addEventListener('click', () => {
                const sectionId = item.getAttribute('data-section');
                if (!sectionId) return;

                // Remove active state from previous item
                if (activeExplorerItem) {
                    activeExplorerItem.classList.remove('bg-[#e8e8e8]', 'dark:bg-[#37373d]');
                }

                // Add active state to clicked item
                item.classList.add('bg-[#e8e8e8]', 'dark:bg-[#37373d]');
                activeExplorerItem = item;

                // Switch to the corresponding section
                switchToSection(sectionId);
            });
        });

        // Set initial active item based on URL hash or default to 'about'
        const hash = window.location.hash?.substring(1) || 'about';
        const initialItem = document.querySelector(`[data-section="${hash}"]`);
        if (initialItem) {
            initialItem.click();
        }
    }

    // Function to switch between sections
    function switchToSection(sectionId) {
        // Remove active class from all tab buttons and panes
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active', 'fade-in');
            pane.classList.add('hidden');
        });

        // Add active class to corresponding tab button and pane
        const targetButton = document.querySelector(`[data-tab="${sectionId}"]`);
        const targetPane = document.getElementById(sectionId);
        
        if (targetButton && targetPane) {
            targetButton.classList.add('active');
            targetPane.classList.remove('hidden');
            
            // Add fade-in animation after a short delay
            setTimeout(() => {
                targetPane.classList.add('active', 'fade-in');
            }, 50);

            // Update URL hash without scrolling
            history.pushState(null, null, `#${sectionId}`);
        }
    }

    // Handle menu actions
    function handleMenuAction(action) {
        switch (action) {
            case 'new-file':
                createNewTab('Untitled.md');
                break;
            case 'open-project':
                switchToSection('projects');
                break;
            case 'download-resume':
                const resumeLink = document.querySelector('a[href="resume.pdf"]');
                if (resumeLink) resumeLink.click();
                break;
            case 'close':
                // Close current tab logic
                break;
            case 'toggle-sidebar':
                document.querySelector('aside').classList.toggle('hidden');
                break;
            case 'toggle-theme':
                document.getElementById('theme-toggle').click();
                break;
            case 'split-view':
                toggleSplitView();
                break;
            case 'new-terminal':
                toggleTerminal();
                break;
            case 'find':
                toggleSearch();
                break;
            case 'about':
                document.getElementById('about-modal').classList.remove('hidden');
                break;
            case 'shortcuts':
                document.getElementById('shortcuts-modal').classList.remove('hidden');
                break;
            case 'contact':
                switchToSection('contact');
                break;
            case 'run-project':
                toggleRunPreview();
                break;
            case 'run-snippet':
                toggleSnippetPreview();
                break;
        }
    }

    // Menu Actions Object
    const menuActions = {
        // File Menu Actions
        'new-file': () => {
            const fileName = prompt('Enter file name (default: Untitled.md):', 'Untitled.md');
            if (fileName) {
                createNewTab(fileName);
            }
        },
        'open-project': () => switchToSection('projects'),
        'download-resume': () => {
            const link = document.createElement('a');
            link.href = 'resume.pdf';
            link.download = 'resume.pdf';
            link.click();
        },
        'close': () => {
            const activeTab = document.querySelector('.tab-button.active');
            if (activeTab && activeTab.dataset.tab.endsWith('.md')) {
                // Only close .md files, not main sections
                const tabContent = document.getElementById(activeTab.dataset.tab);
                activeTab.remove();
                tabContent.remove();
                // Switch to first available tab
                const firstTab = document.querySelector('.tab-button');
                if (firstTab) {
                    switchToSection(firstTab.dataset.tab);
                }
            }
        },

        // Edit Menu Actions
        'undo': () => {
            if (undoStack.length > 0 && activeEditor) {
                const action = undoStack.pop();
                redoStack.push(activeEditor.value);
                activeEditor.value = action;
                saveToLocalStorage(activeEditor.id, action);
            }
        },
        'redo': () => {
            if (redoStack.length > 0 && activeEditor) {
                const action = redoStack.pop();
                undoStack.push(activeEditor.value);
                activeEditor.value = action;
                saveToLocalStorage(activeEditor.id, action);
            }
        },
        'find': () => {
            const searchBar = document.getElementById('search-bar');
            searchBar.classList.toggle('hidden');
            if (!searchBar.classList.contains('hidden')) {
                searchBar.querySelector('input').focus();
            }
        },

        // View Menu Actions
        'toggle-sidebar': () => {
            const sidebar = document.querySelector('aside');
            sidebar.classList.toggle('hidden');
            // Adjust main content width
            const main = document.querySelector('main');
            main.classList.toggle('ml-64');
        },
        'toggle-theme': () => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', 
                document.documentElement.classList.contains('dark') ? 'dark' : 'light'
            );
            updateThemeIcons();
        },
        'split-view': () => {
            const mainContent = document.querySelector('main');
            mainContent.classList.toggle('split-view');
            
            if (mainContent.classList.contains('split-view')) {
                const activePane = document.querySelector('.tab-pane.active');
                if (activePane) {
                    const clone = activePane.cloneNode(true);
                    clone.classList.add('split-view-pane');
                    // Make content editable in split view
                    const editor = clone.querySelector('.markdown-editor');
                    if (editor) {
                        editor.id = editor.id + '-split';
                        editor.value = editor.value;
                    }
                    mainContent.appendChild(clone);
                }
            } else {
                const splitPane = document.querySelector('.split-view-pane');
                if (splitPane) {
                    // Merge changes if needed
                    const originalEditor = document.querySelector('.markdown-editor');
                    const splitEditor = splitPane.querySelector('.markdown-editor');
                    if (originalEditor && splitEditor) {
                        originalEditor.value = splitEditor.value;
                        saveToLocalStorage(originalEditor.id, originalEditor.value);
                    }
                    splitPane.remove();
                }
            }
        },

        // Run Menu Actions
        'run-project': () => {
            const terminal = document.getElementById('terminal-panel');
            terminal.classList.remove('hidden');
            appendToTerminal('Starting development server...');
            setTimeout(() => {
                appendToTerminal('Installing dependencies...');
                setTimeout(() => {
                    appendToTerminal('Server running at http://localhost:3000');
                    // Create and show preview iframe
                    const preview = document.createElement('div');
                    preview.className = 'fixed bottom-36 right-4 w-96 h-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-vscode-border-light dark:border-vscode-border-dark overflow-hidden';
                    preview.innerHTML = `
                        <div class="flex justify-between items-center p-2 bg-vscode-titlebar-light dark:bg-vscode-titlebar-dark">
                            <span class="text-sm">Preview: localhost:3000</span>
                            <button class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">&times;</button>
                        </div>
                        <iframe src="about:blank" class="w-full h-full"></iframe>
                    `;
                    document.body.appendChild(preview);
                    preview.querySelector('button').onclick = () => preview.remove();
                }, 1000);
            }, 1000);
        },
        'run-snippet': () => {
            const terminal = document.getElementById('terminal-panel');
            terminal.classList.remove('hidden');
            appendToTerminal('Running code snippet...');
            
            // Create code snippet preview
            const snippet = document.createElement('div');
            snippet.className = 'fixed bottom-36 right-4 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-vscode-border-light dark:border-vscode-border-dark';
            snippet.innerHTML = `
                <div class="p-4">
                    <pre class="text-sm font-mono bg-gray-100 dark:bg-gray-900 p-4 rounded"><code>
// Example code snippet
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

console.log(fibonacci(10));</code></pre>
                    <div class="mt-4 p-4 bg-black text-green-400 font-mono text-sm rounded">
                        <div class="typing-effect">Output: 55</div>
                    </div>
                    <button class="mt-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 float-right">&times;</button>
                </div>
            `;
            document.body.appendChild(snippet);
            snippet.querySelector('button').onclick = () => snippet.remove();
            
            // Simulate output
            appendToTerminal('55');
            appendToTerminal('Code snippet executed successfully');
        },

        // Terminal Menu Actions
        'new-terminal': () => {
            const terminal = document.getElementById('terminal-panel');
            terminal.classList.remove('hidden');
            appendToTerminal('Welcome to Portfolio Terminal');
            appendToTerminal('Type "help" for available commands');
        },

        // Help Menu Actions
        'about': () => {
            const modal = document.getElementById('about-modal');
            modal.classList.remove('hidden');
        },
        'contact': () => switchToSection('contact'),
        'shortcuts': () => {
            const modal = document.getElementById('shortcuts-modal');
            modal.classList.remove('hidden');
        }
    };

    // Helper Functions
    function createNewTab(fileName) {
        const tabNav = document.querySelector('.tab-nav');
        const tabContent = document.querySelector('.tab-content');
        
        // Create new tab button
        const tabButton = document.createElement('button');
        tabButton.className = 'tab-button px-6 py-3 text-vscode-text-light dark:text-vscode-text-dark hover:text-white dark:hover:text-[#d4d4d4] hover:bg-vscode-accent dark:hover:bg-[#094771] transition-all duration-200';
        tabButton.setAttribute('data-tab', fileName);
        tabButton.textContent = fileName;
        
        // Create new tab content with markdown editor
        const tabPane = document.createElement('section');
        tabPane.id = fileName;
        tabPane.className = 'tab-pane hidden fade-in';
        const editorId = `editor-${Date.now()}`;
        tabPane.innerHTML = `
            <div class="p-4">
                <textarea id="${editorId}" class="markdown-editor w-full h-[calc(100vh-200px)] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 font-mono text-sm border border-vscode-border-light dark:border-vscode-border-dark rounded resize-none focus:outline-none focus:border-vscode-accent" placeholder="Start typing your markdown here...">${loadFromLocalStorage(editorId) || ''}</textarea>
            </div>
        `;
        
        // Add to DOM
        tabNav.appendChild(tabButton);
        tabContent.appendChild(tabPane);
        
        // Initialize editor
        const editor = document.getElementById(editorId);
        editor.addEventListener('input', (e) => {
            activeEditor = e.target;
            undoStack.push(e.target.value);
            saveToLocalStorage(editorId, e.target.value);
        });
        
        // Switch to new tab
        switchToSection(fileName);
    }

    function appendToTerminal(text) {
        const terminalOutput = document.getElementById('terminal-output');
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `
            <span class="text-green-500">portfolio@user</span>
            <span class="text-blue-500">:~$</span>
            <span class="terminal-input">${text}</span>
        `;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function updateThemeIcons() {
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');
        const isDark = document.documentElement.classList.contains('dark');
        
        if (isDark) {
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
        } else {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    }

    // Terminal Functionality
    function initializeTerminal() {
        const terminal = document.getElementById('terminal-panel');
        const terminalOutput = document.getElementById('terminal-output');
        let currentInput = '';

        terminal.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = currentInput.trim().toLowerCase();
                processCommand(command);
                currentInput = '';
                addNewPrompt();
            } else if (e.key === 'Backspace') {
                currentInput = currentInput.slice(0, -1);
                updateCurrentLine(currentInput);
            } else if (!e.ctrlKey && !e.altKey && e.key.length === 1) {
                currentInput += e.key;
                updateCurrentLine(currentInput);
            }
        });

        function processCommand(command) {
            const commands = {
                'help': () => appendToTerminal(`
                    Available commands:
                    - about: View about section
                    - projects: View projects section
                    - contact: View contact section
                    - download: Download resume
                    - clear: Clear terminal
                    - exit: Close terminal
                `),
                'about': () => switchToSection('about'),
                'projects': () => switchToSection('projects'),
                'contact': () => switchToSection('contact'),
                'download': () => menuActions['download-resume'](),
                'clear': () => {
                    terminalOutput.innerHTML = '';
                    addNewPrompt();
                },
                'exit': () => terminal.classList.add('hidden')
            };

            if (commands[command]) {
                commands[command]();
            } else {
                appendToTerminal(`Command not found: ${command}. Type 'help' for available commands.`);
            }
        }

        function addNewPrompt() {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.innerHTML = `
                <span class="text-green-500">portfolio@user</span>
                <span class="text-blue-500">:~$</span>
                <span class="terminal-input"></span>
            `;
            terminalOutput.appendChild(line);
            terminal.scrollTop = terminal.scrollHeight;
        }

        function updateCurrentLine(text) {
            const currentLine = terminalOutput.lastElementChild;
            if (currentLine) {
                currentLine.querySelector('.terminal-input').textContent = text;
            }
        }

        // Initialize with welcome message
        appendToTerminal('Welcome to Portfolio Terminal');
        appendToTerminal('Type "help" for available commands');
        addNewPrompt();
    }

    // Search Functionality
    function initializeSearch() {
        const searchBar = document.getElementById('search-bar');
        const searchInput = searchBar.querySelector('input');
        const closeButton = searchBar.querySelector('button');

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const content = document.querySelector('.tab-pane.active');
            
            // Remove existing highlights
            content.querySelectorAll('.search-highlight').forEach(el => {
                el.outerHTML = el.textContent;
            });

            if (searchTerm) {
                highlightText(content, searchTerm);
            }
        });

        closeButton.addEventListener('click', () => {
            searchBar.classList.add('hidden');
            // Remove all highlights
            document.querySelectorAll('.search-highlight').forEach(el => {
                el.outerHTML = el.textContent;
            });
        });
    }

    function highlightText(element, searchTerm) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        const matches = [];
        let node;
        
        while (node = walker.nextNode()) {
            const index = node.textContent.toLowerCase().indexOf(searchTerm);
            if (index >= 0) {
                matches.push({ node, index });
            }
        }

        matches.reverse().forEach(match => {
            const before = match.node.textContent.slice(0, match.index);
            const highlight = match.node.textContent.slice(match.index, match.index + searchTerm.length);
            const after = match.node.textContent.slice(match.index + searchTerm.length);
            
            const span = document.createElement('span');
            span.className = 'search-highlight bg-yellow-200 dark:bg-yellow-900';
            span.textContent = highlight;
            
            const fragment = document.createDocumentFragment();
            fragment.appendChild(document.createTextNode(before));
            fragment.appendChild(span);
            fragment.appendChild(document.createTextNode(after));
            
            match.node.parentNode.replaceChild(fragment, match.node);
        });
    }

    // Local Storage Functions
    function saveToLocalStorage(key, value) {
        localStorage.setItem(key, value);
    }

    function loadFromLocalStorage(key) {
        return localStorage.getItem(key);
    }

    // Initialize modals
    document.querySelectorAll('.modal').forEach(modal => {
        const closeBtn = modal.querySelector('button');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });

    // Initialize keyboard shortcuts
    function initializeKeyboardShortcuts() {
        const shortcuts = {
            'n': { ctrl: true, action: () => menuActions['new-file']() },
            'o': { ctrl: true, action: () => menuActions['open-project']() },
            's': { ctrl: true, action: () => saveToLocalStorage('autosave', activeEditor?.value) },
            'w': { ctrl: true, action: () => menuActions['close']() },
            'b': { ctrl: true, action: () => menuActions['toggle-sidebar']() },
            'f': { ctrl: true, action: () => menuActions['find']() },
            '`': { ctrl: true, action: () => menuActions['new-terminal']() },
            '\\': { ctrl: true, action: () => menuActions['split-view']() }
        };

        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            const shortcut = shortcuts[key];
            
            if (shortcut && ((shortcut.ctrl && e.ctrlKey) || (shortcut.alt && e.altKey))) {
                e.preventDefault();
                shortcut.action();
            }
        });
    }

    // Helper Functions
    function toggleSplitView() {
        const mainContent = document.querySelector('main .tab-content');
        mainContent.classList.toggle('split-view');
        
        // If entering split view, clone the active content
        if (mainContent.classList.contains('split-view')) {
            const activePane = mainContent.querySelector('.tab-pane.active');
            if (activePane) {
                const clone = activePane.cloneNode(true);
                clone.classList.add('split-view-pane');
                activePane.parentNode.appendChild(clone);
            }
        } else {
            // If exiting split view, remove the cloned content
            const splitPane = mainContent.querySelector('.split-view-pane');
            if (splitPane) {
                splitPane.remove();
            }
        }
    }

    function toggleTerminal() {
        const terminal = document.getElementById('terminal-panel');
        terminal.classList.toggle('hidden');
        if (!terminal.classList.contains('hidden')) {
            terminal.querySelector('.terminal-input').focus();
        }
    }

    function toggleSearch() {
        const searchBar = document.getElementById('search-bar');
        searchBar.classList.toggle('hidden');
        if (!searchBar.classList.contains('hidden')) {
            searchBar.querySelector('input').focus();
        }
    }

    function toggleRunPreview() {
        const preview = document.getElementById('run-preview');
        preview.classList.toggle('hidden');
    }

    function toggleSnippetPreview() {
        const preview = document.getElementById('snippet-preview');
        preview.classList.toggle('hidden');
    }

    // Close button handlers for modals and panels
    document.querySelectorAll('#about-modal button, #shortcuts-modal button, #terminal-panel button, #search-bar button, #run-preview button, #snippet-preview button').forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.fixed').classList.add('hidden');
        });
    });

    // Close modals when clicking outside
    document.querySelectorAll('#about-modal, #shortcuts-modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Only handle shortcuts if not in an input or textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        if (e.ctrlKey) {
            switch (e.key.toLowerCase()) {
                case 'b':
                    e.preventDefault();
                    handleMenuAction('toggle-sidebar');
                    break;
                case '`':
                    e.preventDefault();
                    handleMenuAction('new-terminal');
                    break;
                case 'f':
                    e.preventDefault();
                    handleMenuAction('find');
                    break;
                case 'n':
                    e.preventDefault();
                    handleMenuAction('new-file');
                    break;
                case 'o':
                    e.preventDefault();
                    handleMenuAction('open-project');
                    break;
                case 'w':
                    e.preventDefault();
                    handleMenuAction('close');
                    break;
                case '\\':
                    e.preventDefault();
                    handleMenuAction('split-view');
                    break;
            }
        } else if (e.altKey && e.key.toLowerCase() === 't') {
            e.preventDefault();
            handleMenuAction('toggle-theme');
        }
    });

    // Initialize terminal commands
    function initializeTerminal() {
        const terminal = document.getElementById('terminal-output');
        const commands = {
            'about': () => switchToSection('about'),
            'projects': () => switchToSection('projects'),
            'contact': () => switchToSection('contact'),
            'download': () => handleMenuAction('download-resume'),
            'clear': () => {
                terminal.innerHTML = '';
                addNewPrompt();
            },
            'help': () => {
                appendToTerminal('Available commands:\n  about - View about section\n  projects - View projects\n  contact - View contact info\n  download - Download resume\n  clear - Clear terminal\n  help - Show this help');
                addNewPrompt();
            }
        };

        let currentInput = '';

        function addNewPrompt() {
            const newLine = document.createElement('div');
            newLine.className = 'terminal-line';
            newLine.innerHTML = `
                <span class="text-green-500">portfolio@user</span>
                <span class="text-blue-500">:~$</span>
                <span class="terminal-input"></span>
            `;
            terminal.appendChild(newLine);
            currentInput = '';
        }

        document.addEventListener('keydown', (e) => {
            if (terminal.closest('#terminal-panel').classList.contains('hidden')) {
                return;
            }

            if (e.key === 'Enter') {
                const command = currentInput.trim().toLowerCase();
                appendToTerminal(currentInput);

                if (commands[command]) {
                    commands[command]();
                } else if (command) {
                    appendToTerminal(`Command not found: ${command}\nType 'help' for available commands.`);
                    addNewPrompt();
                } else {
                    addNewPrompt();
                }
            } else if (e.key === 'Backspace') {
                currentInput = currentInput.slice(0, -1);
                updateCurrentLine(currentInput);
            } else if (e.key.length === 1) {
                currentInput += e.key;
                updateCurrentLine(currentInput);
            }
        });

        function appendToTerminal(text) {
            const output = document.createElement('div');
            output.className = 'terminal-line';
            output.textContent = text;
            terminal.appendChild(output);
        }

        function updateCurrentLine(text) {
            const currentLine = terminal.querySelector('.terminal-line:last-child .terminal-input');
            if (currentLine) {
                currentLine.textContent = text;
            }
        }

        // Initialize with help message
        appendToTerminal('Welcome to the portfolio terminal!\nType \'help\' for available commands.');
        addNewPrompt();
    }

    // Initialize search functionality
    function initializeSearch() {
        const searchBar = document.getElementById('search-bar');
        const searchInput = searchBar.querySelector('input');
        const closeButton = searchBar.querySelector('button');

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const content = document.querySelectorAll('.tab-pane');

            content.forEach(section => {
                const textElements = section.querySelectorAll('h1, h2, h3, p, li, .project-card');
                textElements.forEach(element => {
                    const text = element.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        highlightText(element, searchTerm);
                    } else {
                        element.innerHTML = element.innerHTML.replace(/<mark class="search-highlight">(.*?)<\/mark>/g, '$1');
                    }
                });
            });
        });

        closeButton.addEventListener('click', () => {
            searchBar.classList.add('hidden');
            searchInput.value = '';
            // Remove all highlights
            document.querySelectorAll('.search-highlight').forEach(highlight => {
                const parent = highlight.parentNode;
                parent.textContent = parent.textContent;
            });
        });
    }

    function highlightText(element, searchTerm) {
        const text = element.textContent;
        const regex = new RegExp(searchTerm, 'gi');
        element.innerHTML = text.replace(regex, match => `<mark class="search-highlight bg-yellow-200 dark:bg-yellow-800">${match}</mark>`);
    }
}); 