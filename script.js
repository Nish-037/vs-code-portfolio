// Dark Mode Toggle
const body = document.body;
const toggleButton = document.createElement("button");
toggleButton.innerText = "Toggle Dark Mode";
toggleButton.classList.add("px-4", "py-2", "bg-gray-700", "text-white", "fixed", "top-4", "right-4", "rounded");
document.body.appendChild(toggleButton);

toggleButton.addEventListener("click", () => {
    body.classList.toggle("bg-white");
    body.classList.toggle("text-black");
});



// Smooth scrolling for navbar links
document.querySelectorAll("nav a").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        document.getElementById(targetId).scrollIntoView({ behavior: "smooth" });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const fadeInElements = document.querySelectorAll(".fade-in");

    function handleScroll() {
        fadeInElements.forEach(el => {
            const position = el.getBoundingClientRect().top;
            const screenHeight = window.innerHeight;
            if (position < screenHeight - 50) {
                el.classList.add("show");
            }
        });
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Trigger on page load
});


document.getElementById("menu-btn").addEventListener("click", function () {
    document.getElementById("menu").classList.toggle("hidden");
});

// VS Code-style line and column counter
const main = document.querySelector('main');
const statusBarPosition = document.querySelector('footer span:nth-last-child(2)');

main.addEventListener('click', (e) => {
    const text = main.innerText;
    const position = getCaretPosition(e.target, text);
    statusBarPosition.textContent = `Ln ${position.line}, Col ${position.column}`;
});

function getCaretPosition(element, text) {
    const lines = text.split('\n');
    let currentLine = 1;
    let currentColumn = 1;
    
    // Simple position calculation
    if (element.selectionStart !== undefined) {
        const textUntilCaret = text.slice(0, element.selectionStart);
        currentLine = (textUntilCaret.match(/\n/g) || []).length + 1;
        const lastNewLine = textUntilCaret.lastIndexOf('\n');
        currentColumn = element.selectionStart - lastNewLine;
    }

    return { line: currentLine, column: currentColumn };
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// VS Code-style file explorer interaction
const fileItems = document.querySelectorAll('.text-gray-300');
let activeFile = null;

fileItems.forEach(item => {
    item.addEventListener('click', () => {
        if (activeFile) {
            activeFile.classList.remove('bg-[#2d2d2d]');
        }
        item.classList.add('bg-[#2d2d2d]');
        activeFile = item;
        
        // Simulate file opening animation
        const sectionId = item.textContent.trim().toLowerCase().split('.')[0];
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('fade-in');
            section.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Theme switching functionality
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const darkIcon = document.querySelector('.theme-toggle-dark');
const lightIcon = document.querySelector('.theme-toggle-light');

// Check for saved theme preference, otherwise use system preference
const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Apply theme
const setTheme = (theme) => {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update icons
    if (theme === 'dark') {
        darkIcon.classList.add('hidden');
        lightIcon.classList.remove('hidden');
    } else {
        darkIcon.classList.remove('hidden');
        lightIcon.classList.add('hidden');
    }
};



// Initialize theme
setTheme(getPreferredTheme());

// Handle theme toggle click
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});
