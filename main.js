// Theme Management
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const icon = themeToggle?.querySelector('i');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            body.removeAttribute('data-theme');
            icon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            icon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        }
    });

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        icon.className = 'fas fa-sun';
    }
}

// User Session Management
const checkAuth = () => {
    const user = localStorage.getItem('shang_user');
    const signInBtn = document.querySelector('a[href="auth.html"]');
    if (user && signInBtn) {
        signInBtn.innerHTML = '<i class="fas fa-user-circle"></i> Profile';
        signInBtn.href = "builder.html";
    }
};

window.addEventListener('DOMContentLoaded', checkAuth);
