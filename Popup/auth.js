// Simple authentication without external dependencies
const supabaseUrl = 'https://oimhfupqsavlmgahvemd.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pbWhmdXBxc2F2bG1nYWh2ZW1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4MjEzODIsImV4cCI6MjA0ODM5NzM4Mn0.U8YmDVcB3QLV6JP2YoS3iqVkEuqQPm742XSqvr0q0Ro"

// Simple demo login (no external dependencies)
async function logInWithEmail() {
    try {
        console.log('Starting demo login...');
        
        // Create a mock session for demo purposes
        const mockSession = {
            user: { 
                email: 'demo@example.com', 
                id: 'demo-user',
                name: 'Demo User'
            },
            access_token: 'demo-token-' + Date.now(),
            refresh_token: 'demo-refresh-' + Date.now(),
            created_at: new Date().toISOString()
        };
        
        // Save session to extension storage
        saveSession(mockSession);
        console.log('Demo login successful');
        
    } catch (error) {
        console.error('Error during authentication:', error);
        // Fallback to demo session
        const mockSession = {
            user: { email: 'demo@example.com', id: 'demo-user' },
            access_token: 'demo-token',
            refresh_token: 'demo-refresh'
        };
        saveSession(mockSession);
        console.log('Using demo session due to error');
    }
}

// Save session to extension storage
function saveSession(session) {
    chrome.storage.local.set({ session: session }, function() {
        console.log('Session saved to storage');
        updateUI(true);
    });
}

// Retrieve session from extension storage
function getSession() {
    chrome.storage.local.get(['session'], function(result) {
        if (result.session) {
            console.log('User session from storage:', result.session);
            updateUI(true);
            return result.session;
        } else {
            console.log('No saved session');
            updateUI(false);
            return null;
        }
    });
}

// Logout function
async function logOut() {
    try {
        // Clear extension storage
        chrome.storage.local.remove(['session'], function() {
            console.log('Session removed from storage');
            updateUI(false);
        });
        
        console.log('User logged out successfully');
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

// Update UI based on login status
function updateUI(isLoggedIn) {
    const loginBtn = document.getElementById('google-login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (loginBtn) {
        loginBtn.textContent = isLoggedIn ? 'Already Logged In' : 'Login (Demo)';
        loginBtn.disabled = isLoggedIn;
    }
    
    if (logoutBtn) {
        logoutBtn.style.display = isLoggedIn ? 'block' : 'none';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('google-login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (loginBtn) {
        loginBtn.textContent = 'Login (Demo)';
        loginBtn.addEventListener('click', logInWithEmail);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logOut);
    }
    
    // Check if user is already logged in
    getSession();
});
