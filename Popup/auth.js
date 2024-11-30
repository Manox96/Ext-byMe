
const supabaseUrl = 'https://oimhfupqsavlmgahvemd.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pbWhmdXBxc2F2bG1nYWh2ZW1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4MjEzODIsImV4cCI6MjA0ODM5NzM4Mn0.U8YmDVcB3QLV6JP2YoS3iqVkEuqQPm742XSqvr0q0Ro"
const supabase = createClient(supabaseUrl, supabaseKey)

// Google Login Function
async function logInWithGoogle() {
    try {
      const { user, session, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
  
      if (error) {
        console.error('Error logging in with Google:', error.message);
        return;
      }
  
      console.log('User logged in:', user);
      console.log('Session:', session);
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  }
  
  document.getElementById('google-login-btn').addEventListener('click', logInWithGoogle);


  // Save session
function saveSession(session) {
    chrome.storage.local.set({ session });
  }
  
  // Retrieve session
  function getSession() {
    chrome.storage.local.get(['session'], function(result) {
      if (result.session) {
        console.log('User session from storage:', result.session);
      } else {
        console.log('No saved session');
      }
    });
  }
  
  // Call this after a successful login
  saveSession(session);
  


  async function logOut() {
    const { error } = await supabase.auth.signOut();
  
    if (error) {
      console.error('Error logging out:', error.message);
      return;
    }
  
    console.log('User logged out');
  }
  
  document.getElementById('logout-btn').addEventListener('click', logOut);
