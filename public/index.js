// Example logic to determine user login status and retrieve their name
const isLoggedIn = true; // Example: Assume the user is logged in
const userName = "John Doe"; // Example: User's name retrieved after login

// Update the navigation bar dynamically
window.addEventListener('DOMContentLoaded', (event) => {
    const userLink = document.getElementById('userLink');
    if (isLoggedIn) {
        // If user is logged in, update the link text to display their name
        userLink.textContent = `${userName}`;
    } else {
        // If user is not logged in, keep the link text as "Login"
        userLink.textContent = "Login";
    }
});

