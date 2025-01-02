document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const loginClose = document.getElementById('login-close');
    const signupLink = document.getElementById('signup-link');
    const signupModal = document.getElementById('signup-modal');
    const signupClose = document.getElementById('signup-close');
    const loginLink = document.getElementById('login-link');

    // Show login modal
    loginBtn.onclick = function() {
        loginModal.style.display = 'block';
    };

    // Close login modal
    loginClose.onclick = function() {
        loginModal.style.display = 'none';
    };

    // Open signup modal from the login modal link
    signupLink.onclick = function(e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        signupModal.style.display = 'block';
    };

    // Close signup modal
    signupClose.onclick = function() {
        signupModal.style.display = 'none';
    };

    // Open login modal from the signup modal link
    loginLink.onclick = function(e) {
        e.preventDefault();
        signupModal.style.display = 'none';
        loginModal.style.display = 'block';
    };

    // Close modals when clicking outside of them
    window.onclick = function(event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        } else if (event.target === signupModal) {
            signupModal.style.display = 'none';
        }
    };
});
