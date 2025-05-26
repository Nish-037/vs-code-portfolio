// Theme Switching Functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const html = document.documentElement;
    const body = document.body;

    // Function to set theme
    function setTheme(isDark) {
        // Enable transitions before theme change
        body.classList.add('theme-transitions-enabled');
        
        if (isDark) {
            html.classList.add('dark');
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
            localStorage.setItem('theme', 'dark');
        } else {
            html.classList.remove('dark');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
            localStorage.setItem('theme', 'light');
        }
    }

    // Function to get system preference
    function getSystemPreference() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = getSystemPreference();
    
    if (savedTheme) {
        setTheme(savedTheme === 'dark');
    } else {
        setTheme(prefersDark);
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const isDark = html.classList.contains('dark');
        setTheme(!isDark);
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches);
        }
    });
});

// Tab Switching and Navigation
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    // Function to switch tabs
    function switchTab(targetId) {
        // Remove active class from all buttons and panes
        tabButtons.forEach(button => button.classList.remove('active'));
        tabPanes.forEach(pane => {
            pane.classList.remove('active', 'fade-in');
            pane.classList.add('hidden');
        });

        // Add active class to clicked button and corresponding pane
        const targetButton = document.querySelector(`[data-tab="${targetId.replace('#', '')}"]`);
        const targetPane = document.getElementById(targetId.replace('#', ''));
        
        if (targetButton && targetPane) {
            targetButton.classList.add('active');
            targetPane.classList.remove('hidden');
            targetPane.classList.add('active');

            // Trigger fade-in animation
            setTimeout(() => {
                targetPane.classList.add('fade-in');
            }, 50);
        }
    }

    // Handle tab button clicks
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetId = e.target.dataset.tab;
            switchTab(targetId);
            // Update URL without scrolling
            history.pushState(null, null, `#${targetId}`);
        });
    });

    // Handle navigation links with smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            // Switch to the correct tab first
            switchTab(targetId);

            // Then scroll smoothly to the section
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Handle initial load based on URL hash
    window.addEventListener('load', () => {
        const hash = window.location.hash;
        if (hash) {
            switchTab(hash);
            // Scroll to section after a brief delay to ensure content is loaded
            setTimeout(() => {
                const targetSection = document.querySelector(hash);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 100);
        }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash || '#about';
        switchTab(hash);
    });
});

// Timeline Animation
document.addEventListener('DOMContentLoaded', () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    function animateTimeline(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }

    const timelineObserver = new IntersectionObserver(animateTimeline, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    });

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    // Reset animations when switching to achievements tab
    document.querySelector('[data-tab="achievements"]').addEventListener('click', () => {
        timelineItems.forEach(item => {
            item.classList.remove('visible');
            timelineObserver.observe(item);
        });
    });
});

// Typing Animation
class TypingAnimation {
    constructor(element, words, typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) {
        this.element = element;
        this.words = words;
        this.typingSpeed = typingSpeed;
        this.deletingSpeed = deletingSpeed;
        this.pauseTime = pauseTime;
        this.currentWordIndex = 0;
        this.isDeleting = false;
        this.text = '';
        this.tick();
    }

    tick() {
        const currentWord = this.words[this.currentWordIndex];
        
        if (this.isDeleting) {
            // Remove characters
            this.text = currentWord.substring(0, this.text.length - 1);
        } else {
            // Add characters
            this.text = currentWord.substring(0, this.text.length + 1);
        }

        this.element.textContent = this.text;

        // Typing speed
        let speed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

        // If word is complete
        if (!this.isDeleting && this.text === currentWord) {
            // Pause at end of word
            speed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.text === '') {
            this.isDeleting = false;
            // Move to next word
            this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
            // Pause before starting new word
            speed = 500;
        }

        setTimeout(() => this.tick(), speed);
    }
}

// Initialize typing animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const typingElement = document.getElementById('typing-text');
    const words = ['Developer', 'Designer', 'Problem Solver'];
    new TypingAnimation(typingElement, words);
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



// Project Filtering
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    function filterProjects(category) {
        projectCards.forEach(card => {
            const categories = card.dataset.categories.split(' ');
            
            if (category === 'all' || categories.includes(category)) {
                // Show the card with animation
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1) translateY(0)';
                }, 50);
            } else {
                // Hide the card with animation
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95) translateY(10px)';
                setTimeout(() => {
                    card.classList.add('hidden');
                }, 400); // Match the transition duration in CSS
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter projects
            const category = button.dataset.filter;
            filterProjects(category);
        });
    });
});

// Lightbox Functionality
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('lightbox-modal');
    const modalImage = document.getElementById('lightbox-image');
    const modalClose = document.querySelector('.modal-close');
    const projectImages = document.querySelectorAll('.project-image-container img');
    
    function openModal(imageSrc, altText) {
        modal.classList.add('active');
        modalImage.classList.add('loading');
        modalImage.src = imageSrc;
        modalImage.alt = altText;
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Remove loading class once image is loaded
        modalImage.onload = () => {
            modalImage.classList.remove('loading');
        };
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Clear image source after animation
        setTimeout(() => {
            modalImage.src = '';
            modalImage.alt = '';
        }, 300);
    }
    
    // Add click handlers to project images
    projectImages.forEach(image => {
        image.parentElement.addEventListener('click', () => {
            openModal(image.src, image.alt);
        });
        
        // Add keyboard accessibility
        image.parentElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(image.src, image.alt);
            }
        });
    });
    
    // Close modal when clicking close button
    modalClose.addEventListener('click', closeModal);
    
    // Close modal when clicking outside image
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Make project image containers focusable
    document.querySelectorAll('.project-image-container').forEach(container => {
        container.setAttribute('tabindex', '0');
        container.setAttribute('role', 'button');
        container.setAttribute('aria-label', 'Click to view larger image');
    });
});

// Skills Animation
document.addEventListener('DOMContentLoaded', () => {
    const skillItems = document.querySelectorAll('.skill-item');
    
    function animateSkills(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate the skill item
                entry.target.classList.add('animate');
                
                // Animate the progress bar
                const progress = entry.target.querySelector('.skill-progress');
                if (progress) {
                    const percentage = progress.getAttribute('data-progress');
                    progress.style.width = `${percentage}%`;
                }
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }

    // Create the Intersection Observer
    const skillsObserver = new IntersectionObserver(animateSkills, {
        root: null,
        threshold: 0.2,
        rootMargin: '0px'
    });

    // Observe each skill item
    skillItems.forEach(item => {
        skillsObserver.observe(item);
    });

    // Reset animations when switching tabs
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            if (button.dataset.tab === 'skills') {
                // Reset and re-observe all skill items
                skillItems.forEach(item => {
                    item.classList.remove('animate');
                    const progress = item.querySelector('.skill-progress');
                    if (progress) {
                        progress.style.width = '0';
                    }
                    skillsObserver.observe(item);
                });
            }
        });
    });
});

// Contact Form Handling
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');

    // Validation patterns
    const patterns = {
        name: /^[a-zA-Z\s]{2,50}$/,
        email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: /^[\s\S]{10,500}$/
    };

    // Error messages
    const errorMessages = {
        name: 'Please enter a valid name (2-50 characters, letters only)',
        email: 'Please enter a valid email address',
        message: 'Message must be between 10 and 500 characters'
    };

    // Real-time validation
    contactForm.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
        ['input', 'blur'].forEach(eventType => {
            field.addEventListener(eventType, () => {
                validateField(field);
            });
        });
    });

    function validateField(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        const pattern = patterns[field.id];

        // Reset classes
        formGroup.classList.remove('error', 'success');

        // Check if field is empty
        if (!field.value.trim()) {
            formGroup.classList.add('error');
            errorElement.textContent = `${field.id.charAt(0).toUpperCase() + field.id.slice(1)} is required`;
            return false;
        }

        // Check against pattern
        if (!pattern.test(field.value.trim())) {
            formGroup.classList.add('error');
            errorElement.textContent = errorMessages[field.id];
            return false;
        }

        // Field is valid
        formGroup.classList.add('success');
        errorElement.textContent = '';
        return true;
    }

    // Form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        const fields = ['name', 'email', 'message'];
        const isValid = fields.every(fieldId => {
            const field = document.getElementById(fieldId);
            return validateField(field);
        });

        if (!isValid) {
            return;
        }

        // Disable form while processing
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            successMessage.classList.remove('hidden');
            contactForm.reset();

            // Reset success state after 5 seconds
            setTimeout(() => {
                successMessage.classList.add('hidden');
                contactForm.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('success');
                });
            }, 5000);

        } catch (error) {
            console.error('Error submitting form:', error);
            // Show error message (you can add a dedicated error message element)
            alert('There was an error sending your message. Please try again.');
        } finally {
            // Re-enable form
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
});

// GitHub Integration
const GITHUB_USERNAME = 'YOUR_GITHUB_USERNAME'; // Replace with your GitHub username

async function fetchGitHubData() {
    try {
        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        const userData = await userResponse.json();

        // Update profile information
        document.getElementById('github-avatar').src = userData.avatar_url;
        document.getElementById('github-name').textContent = userData.name || userData.login;
        document.getElementById('github-bio').textContent = userData.bio || '';
        document.getElementById('github-repos').textContent = userData.public_repos;
        document.getElementById('github-followers').textContent = userData.followers;
        document.getElementById('github-profile-link').href = userData.html_url;

        // Update contribution graph
        document.querySelector('.github-contributions img').src = 
            `https://ghchart.rshah.org/007acc/${GITHUB_USERNAME}`;

        // Fetch pinned repositories
        const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
        const reposData = await reposResponse.json();

        // Display repositories
        const pinnedReposContainer = document.getElementById('pinned-repos');
        pinnedReposContainer.innerHTML = ''; // Clear existing content

        reposData.slice(0, 6).forEach(repo => {
            const card = createRepoCard(repo);
            pinnedReposContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching GitHub data:', error);
    }
}

function createRepoCard(repo) {
    const card = document.createElement('div');
    card.className = 'repo-card';

    // Language color mapping
    const languageColors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'TypeScript': '#2b7489',
        'Java': '#b07219',
        'C++': '#f34b7d'
    };

    card.innerHTML = `
        <div class="repo-header">
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" 
               class="repo-name hover:underline">${repo.name}</a>
            ${repo.fork ? '<span class="text-xs text-gray-400">(Fork)</span>' : ''}
        </div>
        <p class="repo-description">${repo.description || 'No description available.'}</p>
        <div class="repo-footer">
            ${repo.language ? `
                <div class="repo-language">
                    <span class="language-dot" style="background-color: ${languageColors[repo.language] || '#ddd'}"></span>
                    <span>${repo.language}</span>
                </div>
            ` : ''}
            <div class="repo-stat">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                ${repo.stargazers_count}
            </div>
            <div class="repo-stat">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                ${repo.forks_count}
            </div>
        </div>
    `;

    return card;
}

// Initialize GitHub data when the tab is clicked
document.querySelector('[data-tab="github"]').addEventListener('click', () => {
    fetchGitHubData();
});

// Counter Animation
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    let hasAnimated = false;

    function animateCounter(counter, target) {
        const duration = 2000; // Animation duration in milliseconds
        const steps = 50; // Number of steps in the animation
        const stepDuration = duration / steps;
        const stepValue = target / steps;
        let current = 0;
        let step = 0;

        const updateCounter = () => {
            current += stepValue;
            step++;

            if (step <= steps) {
                counter.textContent = Math.round(current);
                counter.classList.add('animate');
                setTimeout(() => {
                    counter.classList.remove('animate');
                }, 300);
                
                requestAnimationFrame(() => {
                    setTimeout(updateCounter, stepDuration);
                });
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    }

    function startCounterAnimation() {
        if (!hasAnimated) {
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
            });
            hasAnimated = true;
        }
    }

    // Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounterAnimation();
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe the stats section
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    // Reset animation when switching tabs
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            if (button.dataset.tab === 'about') {
                hasAnimated = false;
                counters.forEach(counter => {
                    counter.textContent = '0';
                });
                if (statsSection) {
                    counterObserver.observe(statsSection);
                }
            }
        });
    });

    // Update GitHub contributions counter with actual data
    async function updateGitHubContributions() {
        if (typeof GITHUB_USERNAME !== 'undefined') {
            try {
                const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events`);
                const events = await response.json();
                
                // Count contributions from the last year
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                
                const contributions = events.filter(event => 
                    new Date(event.created_at) > oneYearAgo &&
                    ['PushEvent', 'PullRequestEvent', 'IssuesEvent'].includes(event.type)
                ).length;

                // Update the counter target
                const contributionsCounter = document.querySelector('.counter[data-target="1200"]');
                if (contributionsCounter) {
                    contributionsCounter.setAttribute('data-target', contributions);
                    if (!hasAnimated) {
                        contributionsCounter.textContent = '0';
                    }
                }
            } catch (error) {
                console.error('Error fetching GitHub contributions:', error);
            }
        }
    }

    // Update GitHub contributions when the page loads
    updateGitHubContributions();
});

// Update copyright year
document.addEventListener('DOMContentLoaded', () => {
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }
});
// Copyright year update
document.addEventListener('DOMContentLoaded', () => {
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }
});

