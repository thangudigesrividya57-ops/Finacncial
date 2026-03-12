let users = JSON.parse(localStorage.getItem('mm_users') || '[]');
let currentUser = JSON.parse(localStorage.getItem('mm_current') || 'null');

const byId = (id) => document.getElementById(id);

function showErr(id, msg) {
    const el = byId(id);
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
}

function signUp() {
    const first = (byId('suFirst')?.value || '').trim();
    const last = (byId('suLast')?.value || '').trim();
    const email = (byId('suEmail')?.value || '').trim();
    const pass = byId('suPass')?.value || '';
    if (!first || !last) { showErr('suErr', 'Please enter your full name.'); return; }
    if (!email.includes('@')) { showErr('suErr', 'Please enter a valid email.'); return; }
    if (pass.length < 6) { showErr('suErr', 'Password must be at least 6 characters.'); return; }
    if (users.find(u => u.email === email)) { showErr('suErr', 'Account already exists. Please sign in.'); return; }
    const user = { id: Date.now(), name: first + ' ' + last, email, pass, initials: (first[0] + last[0]).toUpperCase() };
    users.push(user);
    localStorage.setItem('mm_users', JSON.stringify(users));
    loginUser(user);
}

function signIn() {
    const email = (byId('siEmail')?.value || '').trim();
    const pass = byId('siPass')?.value || '';
    const user = users.find(u => u.email === email && u.pass === pass);
    if (!user) { showErr('siErr', 'Invalid email or password. Try guest access.'); return; }
    loginUser(user);
}

function guestLogin() {
    loginUser({ id: 'guest', name: 'Guest User', email: 'guest', pass: '', initials: 'G' });
}

function loginUser(user) {
    currentUser = user;
    localStorage.setItem('mm_current', JSON.stringify(user));
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    if (currentUser) window.location.href = 'index.html';
});
