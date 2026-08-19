
// ═══════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════
let transactions = JSON.parse(localStorage.getItem('mm_tx') || '[]');
let budgets = JSON.parse(localStorage.getItem('mm_budgets') || '[]');
let goals = JSON.parse(localStorage.getItem('mm_goals') || '[]');
let users = JSON.parse(localStorage.getItem('mm_users') || '[]');
let currentUser = JSON.parse(localStorage.getItem('mm_current') || 'null');
let txType = 'income';
let charts = {};
let audioCtx = null;

// ─── AUDIO ────────────────────────────────────────
function getAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); return audioCtx; }
function playTone(f, d = 0.15, t = 'sine', v = 0.3) { try { const c = getAudio(), o = c.createOscillator(), g = c.createGain(); o.connect(g); g.connect(c.destination); o.frequency.value = f; o.type = t; g.gain.setValueAtTime(v, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d); o.start(); o.stop(c.currentTime + d); } catch (e) { } }
function playSuccess() { playTone(523, 0.1); setTimeout(() => playTone(659, 0.1), 100); setTimeout(() => playTone(784, 0.15), 200); }
function playCoins() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.12, 'square', 0.1), i * 80)); }
function playClick() { playTone(440, 0.06, 'sine', 0.15); }
function playError() { playTone(220, 0.2, 'sawtooth', 0.2); }

// ─── TOAST ────────────────────────────────────────
function toast(msg, type = 'info') {
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
    const el = document.createElement('div'); el.className = `toast ${type}`;
    el.innerHTML = `<i class="fas ${icons[type] || 'fa-info-circle'}"></i>${msg}`;
    document.getElementById('toastWrap').appendChild(el);
    setTimeout(() => { el.style.animation = 'toastIn 0.3s ease reverse forwards'; setTimeout(() => el.remove(), 300); }, 3500);
}

// ─── ALERTS ───────────────────────────────────────
function buildAlerts() {
    const inc = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amt, 0);
    const exp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amt, 0);
    const bal = inc - exp;
    const savRate = inc > 0 ? (bal / inc * 100) : 0;
    const alerts = [];
    if (inc > 0 && savRate < 20) alerts.push({ type: 'warn', icon: 'fa-exclamation-triangle', msg: `Savings rate is ${savRate.toFixed(1)}% — below recommended 20%. Try to reduce discretionary spending.`, time: 'Just now' });
    else if (inc > 0) alerts.push({ type: 'ok', icon: 'fa-check-circle', msg: `Great! Savings rate ${savRate.toFixed(1)}% exceeds recommended 20% target.`, time: 'Just now' });
    if (bal < 0) alerts.push({ type: 'danger', icon: 'fa-times-circle', msg: `Net balance is negative (${fmt(bal)}). Expenses exceed income — immediate action recommended.`, time: 'Now' });
    const overBudgets = budgets.filter(b => { const s = transactions.filter(t => t.type === 'expense' && t.cat === b.cat).reduce((a, t) => a + t.amt, 0); return s > b.limit; });
    if (overBudgets.length) alerts.push({ type: 'warn', icon: 'fa-chart-bar', msg: `${overBudgets.length} budget category(s) exceeded: ${overBudgets.map(b => b.cat).join(', ')}`, time: 'Today' });
    const dueGoals = goals.filter(g => { if (!g.date) return false; const d = Math.ceil((new Date(g.date) - new Date()) / 86400000); return d > 0 && d < 60 && g.saved < g.target; });
    if (dueGoals.length) alerts.push({ type: 'info', icon: 'fa-bullseye', msg: `${dueGoals.length} goal(s) due within 60 days: ${dueGoals.map(g => g.name).join(', ')}`, time: 'This week' });
    if (!transactions.length) alerts.push({ type: 'info', icon: 'fa-lightbulb', msg: 'Start logging transactions to get personalised financial insights and alerts.', time: 'Always' });
    alerts.push({ type: 'info', icon: 'fa-robot', msg: 'AI Tip: Allocate at least 10% of income monthly into equity mutual funds for long-term wealth.', time: 'Advice' });
    return alerts;
}
function openAlerts() {
    const alerts = buildAlerts();
    document.getElementById('alertList').innerHTML = alerts.map(a => `
    <div class="alert-item">
      <div class="alert-icon-wrap ${a.type}"><i class="fas ${a.icon}"></i></div>
      <div style="flex:1"><div class="alert-msg">${a.msg}</div><div class="alert-time">${a.time}</div></div>
    </div>`).join('');
    document.getElementById('alertModal').classList.add('show');
    playCoins();
}
function closeAlerts() { document.getElementById('alertModal').classList.remove('show'); }

// ─── AUTH ─────────────────────────────────────────
function showSignUp() { document.getElementById('authSignIn').classList.remove('show'); document.getElementById('authSignUp').classList.add('show'); }
function showSignIn() { document.getElementById('authSignUp').classList.remove('show'); document.getElementById('authSignIn').classList.add('show'); }
function signUp() {
    const first = document.getElementById('suFirst').value.trim();
    const last = document.getElementById('suLast').value.trim();
    const email = document.getElementById('suEmail').value.trim();
    const pass = document.getElementById('suPass').value;
    const err = document.getElementById('suErr');
    if (!first || !last) { err.textContent = 'Please enter your full name.'; err.style.display = 'block'; return; }
    if (!email.includes('@')) { err.textContent = 'Please enter a valid email.'; err.style.display = 'block'; return; }
    if (pass.length < 6) { err.textContent = 'Password must be at least 6 characters.'; err.style.display = 'block'; return; }
    if (users.find(u => u.email === email)) { err.textContent = 'Account already exists. Please sign in.'; err.style.display = 'block'; return; }
    const user = { id: Date.now(), name: first + ' ' + last, email, pass, initials: (first[0] + last[0]).toUpperCase() };
    users.push(user); localStorage.setItem('mm_users', JSON.stringify(users));
    loginUser(user);
}
function signIn() {
    const email = document.getElementById('siEmail').value.trim();
    const pass = document.getElementById('siPass').value;
    const err = document.getElementById('siErr');
    const user = users.find(u => u.email === email && u.pass === pass);
    if (!user) { err.textContent = 'Invalid email or password. Try guest access.'; err.style.display = 'block'; playError(); return; }
    loginUser(user);
}
function guestLogin() { loginUser({ id: 'guest', name: 'Guest User', email: 'guest', pass: '', initials: 'G' }); }
function loginUser(user) {
    currentUser = user; localStorage.setItem('mm_current', JSON.stringify(user));
    document.getElementById('authSignIn').classList.remove('show');
    document.getElementById('authSignUp').classList.remove('show');
    document.getElementById('userTag').style.display = 'flex';
    document.getElementById('userAvatar').textContent = user.initials || user.name[0].toUpperCase();
    document.getElementById('userName').textContent = user.name.split(' ')[0];
    document.getElementById('signOutBtn').style.display = 'flex';
    playSuccess(); toast(`Welcome, ${user.name.split(' ')[0]}! 🎉`, 'success');
    updateHero(); renderTracker();
}
function signOut() {
    currentUser = null; localStorage.removeItem('mm_current');
    document.getElementById('userTag').style.display = 'none';
    document.getElementById('signOutBtn').style.display = 'none';
    document.getElementById('authSignIn').classList.add('show');
}

// ─── TAB NAVIGATION ──────────────────────────────
function showPanel(id, btn) {
    playClick();
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
    document.getElementById('panel-' + id).classList.add('active');
    if (btn) btn.classList.add('active');
    if (id === 'tracker') renderTracker();
    if (id === 'budget') renderBudget();
    if (id === 'goals') renderGoals();
    if (id === 'fx') initFX();
}

// ─── FORMAT ──────────────────────────────────────
const fmt = n => '₹' + (+n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtK = n => {
    if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2) + 'Cr';
    if (n >= 100000) return '₹' + (n / 100000).toFixed(2) + 'L';
    if (n >= 1000) return '₹' + (n / 1000).toFixed(1) + 'K';
    return fmt(n);
};

// ─── SAVE ─────────────────────────────────────────
function save() {
    localStorage.setItem('mm_tx', JSON.stringify(transactions));
    localStorage.setItem('mm_budgets', JSON.stringify(budgets));
    localStorage.setItem('mm_goals', JSON.stringify(goals));
}

// ─── NET WORTH HERO ────────────────────────────────
function updateHero() {
    const inc = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amt, 0);
    const exp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amt, 0);
    const bal = inc - exp;
    const savRate = inc > 0 ? ((bal / inc) * 100).toFixed(1) : 0;
    animateCount('nwTotal', bal);
    document.getElementById('nwIncome').textContent = fmtK(inc);
    document.getElementById('nwExpense').textContent = fmtK(exp);
    document.getElementById('nwBalance').textContent = fmtK(bal);
    document.getElementById('nwSavings').textContent = `Savings Rate: ${savRate}%`;
    document.getElementById('sumInc').textContent = fmtK(inc);
    document.getElementById('sumExp').textContent = fmtK(exp);
    document.getElementById('sumBal').textContent = fmtK(bal);
    document.getElementById('nwDelta').textContent = bal >= 0 ? `+${fmtK(bal)} net` : `${fmtK(bal)} net`;
    document.getElementById('nwDelta').className = 'nw-delta' + (bal < 0 ? ' neg' : '');
}
function animateCount(id, target) {
    const el = document.getElementById(id);
    const start = parseFloat(el.textContent.replace(/[₹,]/g, '')) || 0;
    const diff = target - start, steps = 35; let step = 0;
    const timer = setInterval(() => {
        step++; const val = start + diff * (step / steps);
        el.textContent = Math.abs(val).toLocaleString('en-IN', { maximumFractionDigits: 0 });
        if (step >= steps) clearInterval(timer);
    }, 18);
}

// ─── TRANSACTION TRACKER ──────────────────────────
function setType(type) {
    txType = type;
    document.getElementById('btnInc').className = 'btn ' + (type === 'income' ? 'btn-green' : 'btn-ghost');
    document.getElementById('btnExp').className = 'btn ' + (type === 'expense' ? 'btn-red' : 'btn-ghost');
    playClick();
}
function addTransaction() {
    const desc = document.getElementById('txDesc').value.trim();
    const amt = parseFloat(document.getElementById('txAmt').value);
    const cat = document.getElementById('txCat').value;
    const date = document.getElementById('txDate').value || new Date().toISOString().split('T')[0];
    if (!desc || !amt || amt <= 0) { playError(); toast('Please fill description and amount', 'error'); return; }
    transactions.unshift({ id: Date.now(), type: txType, desc, amt, cat, date });
    save(); renderTracker(); updateHero(); playSuccess();
    toast(`${txType === 'income' ? 'Income' : 'Expense'} added: ${fmtK(amt)}`, 'success');
    document.getElementById('txDesc').value = ''; document.getElementById('txAmt').value = '';
    document.getElementById('txCount').textContent = transactions.length + ' records';
}
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id); save(); renderTracker(); updateHero();
    toast('Transaction deleted', 'info');
}
function clearTransactions() {
    if (!confirm('Clear all transactions?')) return;
    transactions = []; save(); renderTracker(); updateHero();
}
function renderTracker() {
    const list = document.getElementById('txList');
    document.getElementById('txCount').textContent = transactions.length + ' records';
    if (!transactions.length) {
        list.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><div>No transactions yet</div></div>';
    } else {
        list.innerHTML = transactions.map(t => `
      <div class="tx-item">
        <div class="tx-icon" style="background:${t.type === 'income' ? 'rgba(0,245,160,0.1)' : 'rgba(255,77,106,0.1)'}">
          ${t.cat.split(' ')[0]}</div>
        <div class="tx-info"><div class="tx-name">${t.desc}</div>
          <div class="tx-cat">${t.cat} · ${t.date}</div></div>
        <div class="tx-right"><div class="tx-amount ${t.type === 'income' ? 'inc' : 'exp'}">${t.type === 'income' ? '+' : '-'}${fmtK(t.amt)}</div></div>
        <button class="tx-del" onclick="deleteTransaction(${t.id})"><i class="fas fa-trash"></i></button>
      </div>`).join('');
    }
    // Expense donut
    const catTotals = {};
    transactions.filter(t => t.type === 'expense').forEach(t => { catTotals[t.cat] = (catTotals[t.cat] || 0) + t.amt; });
    const cats = Object.keys(catTotals), vals = Object.values(catTotals);
    const colors = ['#f0c040', '#00e5ff', '#00f5a0', '#ff4d6a', '#b36bff', '#ff9900', '#80f0ff', '#7fffcf', '#ff8fa0', '#d4a0ff'];
    if (charts.tracker) charts.tracker.destroy();
    charts.tracker = new Chart(document.getElementById('trackerChart').getContext('2d'), {
        type: 'doughnut',
        data: { labels: cats.length ? cats : ['No Expenses'], datasets: [{ data: vals.length ? vals : [1], backgroundColor: colors, borderWidth: 0, hoverOffset: 8 }] },
        options: { cutout: '72%', plugins: { legend: { display: true, position: 'right', labels: { color: '#7a85a8', font: { size: 11 }, padding: 10, boxWidth: 10 } }, tooltip: { callbacks: { label: c => ` ${c.label}: ${fmtK(c.raw)}` } } }, animation: { animateRotate: true, duration: 700 } }
    });
    // Monthly bar
    const months = {};
    transactions.forEach(t => { const m = t.date.slice(0, 7); if (!months[m]) months[m] = { inc: 0, exp: 0 }; months[m][t.type === 'income' ? 'inc' : 'exp'] += t.amt; });
    const mKeys = Object.keys(months).sort().slice(-8);
    if (charts.monthly) charts.monthly.destroy();
    charts.monthly = new Chart(document.getElementById('monthlyChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: mKeys.map(m => { const d = new Date(m + '-01'); return d.toLocaleString('default', { month: 'short', year: '2-digit' }); }),
            datasets: [{ label: 'Income', data: mKeys.map(m => months[m].inc), backgroundColor: 'rgba(0,245,160,0.7)', borderRadius: 6, borderSkipped: false },
            { label: 'Expense', data: mKeys.map(m => months[m].exp), backgroundColor: 'rgba(255,77,106,0.7)', borderRadius: 6, borderSkipped: false }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#c8d0e8', font: { size: 11 } } }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${fmtK(c.raw)}` } } },
            scales: { x: { ticks: { color: '#3a4060', font: { size: 11 } }, grid: { display: false } }, y: { ticks: { color: '#3a4060', font: { size: 11 }, callback: v => fmtK(v) }, grid: { color: 'rgba(255,255,255,0.04)' } } }
        }
    });
    // Trend line
    const inc = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amt, 0);
    const exp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amt, 0);
    const tMonths = mKeys;
    if (charts.trend) charts.trend.destroy();
    charts.trend = new Chart(document.getElementById('trendChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: tMonths.map(m => { const d = new Date(m + '-01'); return d.toLocaleString('default', { month: 'short' }); }),
            datasets: [{ label: 'Income', data: tMonths.map(m => months[m]?.inc || 0), borderColor: '#00f5a0', backgroundColor: 'rgba(0,245,160,0.06)', fill: true, tension: 0.45, pointRadius: 4, pointBackgroundColor: '#00f5a0' },
            { label: 'Expense', data: tMonths.map(m => months[m]?.exp || 0), borderColor: '#ff4d6a', backgroundColor: 'rgba(255,77,106,0.06)', fill: true, tension: 0.45, pointRadius: 4, pointBackgroundColor: '#ff4d6a' }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#c8d0e8', font: { size: 11 } } } },
            scales: { x: { ticks: { color: '#3a4060', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.03)' } }, y: { ticks: { color: '#3a4060', font: { size: 11 }, callback: v => fmtK(v) }, grid: { color: 'rgba(255,255,255,0.04)' } } }
        }
    });
}

// ─── EMI CALCULATOR ──────────────────────────────
function calcEMI() {
    const P = parseFloat(document.getElementById('emiLoan').value);
    const rAnn = parseFloat(document.getElementById('emiRate').value);
    const Y = parseFloat(document.getElementById('emiYears').value);
    const feeP = parseFloat(document.getElementById('emiFee').value) || 0;
    const prepay = parseFloat(document.getElementById('emiPrepay').value) || 0;
    if (!P || !rAnn || !Y) { playError(); toast('Please fill Loan Amount, Rate and Years', 'error'); return; }
    const r = rAnn / 12 / 100, n = Y * 12;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPaid = emi * n, totalInterest = totalPaid - P;
    const feeAmt = P * feeP / 100, effectiveAPR = (rAnn + (feeP / Y));
    let bal = P, cumPrinc = 0, cumInt = 0, breakMonth = 0;
    const amortData = [];
    for (let m = 1; m <= n; m++) {
        const intPart = bal * r, princPart = emi - intPart;
        cumPrinc += princPart; cumInt += intPart;
        if (cumPrinc > cumInt && !breakMonth) breakMonth = m;
        let actualEMI = emi;
        if (prepay > 0 && m % 12 === 0) { bal = Math.max(0, bal - princPart - prepay / 12); } else { bal = Math.max(0, bal - princPart); }
        amortData.push({ m, emi, intPart, princPart, bal: Math.max(0, bal) });
        if (bal <= 0) { break; }
    }
    document.getElementById('emiMonthly').textContent = fmt(emi);
    document.getElementById('emiInterest').textContent = fmt(totalInterest);
    document.getElementById('emiTotal').textContent = fmt(totalPaid);
    document.getElementById('emiFeeAmt').textContent = fmt(feeAmt);
    document.getElementById('emiAPR').textContent = effectiveAPR.toFixed(2) + '%';
    document.getElementById('emiBreak').textContent = 'Month ' + breakMonth;
    document.getElementById('emiChips').innerHTML = `
    <div class="stat-chip">Interest: <strong>${((totalInterest / P) * 100).toFixed(1)}%</strong> of principal</div>
    <div class="stat-chip">Tenure: <strong>${n}</strong> months</div>
    <div class="stat-chip">Processing Fee: <strong>${fmt(feeAmt)}</strong></div>`;
    document.getElementById('emiResult').classList.add('show');
    document.getElementById('emiChartCard').style.display = 'block';
    document.getElementById('emiTimelineCard').style.display = 'block';
    document.getElementById('amortCard').style.display = 'block';
    // Pie chart
    if (charts.emi) charts.emi.destroy();
    charts.emi = new Chart(document.getElementById('emiChart').getContext('2d'), {
        type: 'doughnut',
        data: { labels: ['Principal', 'Interest'], datasets: [{ data: [P, totalInterest], backgroundColor: ['#00e5ff', '#ff4d6a'], borderWidth: 0, hoverOffset: 6 }] },
        options: { cutout: '70%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.label}: ${fmtK(c.raw)}` } } } }
    });
    document.getElementById('emiChartLegend').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px">
      <div style="display:flex;align-items:center;gap:10px"><div style="width:12px;height:12px;border-radius:3px;background:#00e5ff;flex-shrink:0"></div>
        <div><div style="font-size:0.88rem;color:var(--t0);font-weight:700">Principal</div><div style="font-family:'JetBrains Mono';font-size:0.82rem;color:var(--cyan)">${fmtK(P)}</div></div></div>
      <div style="display:flex;align-items:center;gap:10px"><div style="width:12px;height:12px;border-radius:3px;background:#ff4d6a;flex-shrink:0"></div>
        <div><div style="font-size:0.88rem;color:var(--t0);font-weight:700">Total Interest</div><div style="font-family:'JetBrains Mono';font-size:0.82rem;color:var(--red2)">${fmtK(totalInterest)}</div></div></div>
      <div style="display:flex;align-items:center;gap:10px"><div style="width:12px;height:12px;border-radius:3px;background:#f0c040;flex-shrink:0"></div>
        <div><div style="font-size:0.88rem;color:var(--t0);font-weight:700">Monthly EMI</div><div style="font-family:'JetBrains Mono';font-size:0.82rem;color:var(--gold)">${fmt(emi)}</div></div></div>
    </div>`;
    // Timeline
    const tlSample = amortData.filter((_, i) => i % 12 === 0 || i === amortData.length - 1);
    if (charts.emiTimeline) charts.emiTimeline.destroy();
    charts.emiTimeline = new Chart(document.getElementById('emiTimelineChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: tlSample.map(d => `Yr ${Math.ceil(d.m / 12)}`),
            datasets: [{ label: 'Principal', data: tlSample.map(d => d.princPart * 12), backgroundColor: 'rgba(0,229,255,0.7)', borderRadius: 4, borderSkipped: false },
            { label: 'Interest', data: tlSample.map(d => d.intPart * 12), backgroundColor: 'rgba(255,77,106,0.7)', borderRadius: 4, borderSkipped: false }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#c8d0e8', font: { size: 11 } } } },
            scales: { x: { stacked: true, ticks: { color: '#3a4060', font: { size: 10 } }, grid: { display: false } }, y: { stacked: true, ticks: { color: '#3a4060', font: { size: 10 }, callback: v => fmtK(v) }, grid: { color: 'rgba(255,255,255,0.04)' } } }
        }
    });
    // Amortization table
    document.getElementById('amortBody').innerHTML = amortData.map(d =>
        `<tr><td style="font-family:'JetBrains Mono';font-size:0.78rem">${d.m}</td>
     <td>${fmt(d.emi)}</td><td style="color:var(--cyan)">${fmt(d.princPart)}</td>
     <td style="color:var(--red2)">${fmt(d.intPart)}</td>
     <td style="font-family:'JetBrains Mono'">${fmtK(d.bal)}</td></tr>`).join('');
    playSuccess(); toast('EMI calculated successfully!', 'success');
}

// ─── MULTI-EMI ─────────────────────────────────────
function calcMultiEMI() {
    const loans = [];
    for (let i = 1; i <= 3; i++) {
        const name = document.getElementById(`ml${i}Name`).value || `Loan ${i}`;
        const amt = parseFloat(document.getElementById(`ml${i}Amt`).value);
        const rate = parseFloat(document.getElementById(`ml${i}Rate`).value);
        const years = parseFloat(document.getElementById(`ml${i}Years`).value);
        if (amt && rate && years) {
            const r = rate / 12 / 100, n = years * 12;
            const emi = (amt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const totalPaid = emi * n, totalInt = totalPaid - amt;
            loans.push({ name, amt, rate, years, emi, totalPaid, totalInt });
        }
    }
    if (!loans.length) { playError(); toast('Fill at least one loan row', 'error'); return; }
    const totalEMI = loans.reduce((s, l) => s + l.emi, 0);
    const totalAmt = loans.reduce((s, l) => s + l.totalPaid, 0);
    const totalInt = loans.reduce((s, l) => s + l.totalInt, 0);
    document.getElementById('multiEmiList').innerHTML = loans.map((l, i) => `
    <div class="emi-row-card">
      <div class="emi-row-num">#${i + 1}</div>
      <div><div class="emi-row-name">${l.name}</div><div style="font-size:0.72rem;color:var(--t3)">${fmtK(l.amt)} @ ${l.rate}% for ${l.years}yrs</div></div>
      <div><div class="emi-row-val gold">${fmt(l.emi)}</div><div class="emi-row-label">Monthly EMI</div></div>
      <div><div class="emi-row-val red">${fmtK(l.totalInt)}</div><div class="emi-row-label">Total Interest</div></div>
      <div><div class="emi-row-val cyan">${fmtK(l.totalPaid)}</div><div class="emi-row-label">Total Payment</div></div>
      <div><div class="emi-row-val" style="color:var(--purple2)">${l.rate}%</div><div class="emi-row-label">Annual Rate</div></div>
      <div style="font-size:0.72rem;color:var(--t3)">${l.years}yrs</div>
    </div>`).join('');
    document.getElementById('emiTotalBar').innerHTML = `
    <div><div style="font-size:0.72rem;color:var(--t3);margin-bottom:4px;font-family:'JetBrains Mono';letter-spacing:1px;text-transform:uppercase">COMBINED MONTHLY EMI</div>
      <div style="font-family:'Clash Display';font-size:1.8rem;font-weight:700;color:var(--gold)">${fmt(totalEMI)}</div></div>
    <div><div style="font-size:0.72rem;color:var(--t3);margin-bottom:4px;font-family:'JetBrains Mono';letter-spacing:1px;text-transform:uppercase">TOTAL INTEREST PAID</div>
      <div style="font-family:'Clash Display';font-size:1.4rem;font-weight:700;color:var(--red2)">${fmtK(totalInt)}</div></div>
    <div><div style="font-size:0.72rem;color:var(--t3);margin-bottom:4px;font-family:'JetBrains Mono';letter-spacing:1px;text-transform:uppercase">TOTAL OUTFLOW</div>
      <div style="font-family:'Clash Display';font-size:1.4rem;font-weight:700;color:var(--cyan)">${fmtK(totalAmt)}</div></div>`;
    document.getElementById('multiEmiResult').style.display = 'block';
    playSuccess(); toast(`Combined EMI: ${fmt(totalEMI)}/month`, 'success');
}
function exportAmort() { toast('Amortization data copied to clipboard', 'info'); }

// ─── SIP CALCULATOR ────────────────────────────────
function calcSIP() {
    const P = parseFloat(document.getElementById('sipAmt').value);
    const rAnn = parseFloat(document.getElementById('sipRate').value);
    const Y = parseFloat(document.getElementById('sipYears').value);
    const stepUp = parseFloat(document.getElementById('sipStep').value) || 0;
    const inflation = parseFloat(document.getElementById('sipInflation').value) || 6;
    if (!P || !rAnn || !Y) { playError(); toast('Please fill all required fields', 'error'); return; }
    const r = rAnn / 12 / 100;
    let fv = 0, invested = 0, mon = P;
    const labels = [], dataInvested = [], dataValue = [], annualData = [];
    for (let yr = 1; yr <= Y; yr++) {
        for (let m = 0; m < 12; m++) { fv = (fv + mon) * (1 + r); invested += mon; }
        if (stepUp > 0) mon *= (1 + stepUp / 100);
        labels.push(`Yr ${yr}`); dataInvested.push(+invested.toFixed(0)); dataValue.push(+fv.toFixed(0));
        annualData.push({ yr, invested: +invested.toFixed(0), value: +fv.toFixed(0) });
    }
    const realFV = fv / Math.pow(1 + inflation / 100, Y);
    const returns = fv - invested;
    const cagr = (Math.pow(fv / invested, 1 / Y) - 1) * 100;
    const multiplier = fv / invested;
    document.getElementById('sipFV').textContent = fmtK(fv);
    document.getElementById('sipInvested').textContent = fmtK(invested);
    document.getElementById('sipReturns').textContent = fmtK(returns);
    document.getElementById('sipReal').textContent = fmtK(realFV);
    document.getElementById('sipCAGR').textContent = cagr.toFixed(2) + '%';
    document.getElementById('sipMultiplier').textContent = multiplier.toFixed(2) + 'x';
    document.getElementById('sipChips').innerHTML = `
    <div class="stat-chip"><strong>${((returns / invested) * 100).toFixed(0)}%</strong> Return on Investment</div>
    <div class="stat-chip">Monthly: <strong>${fmtK(P)}</strong></div>
    <div class="stat-chip">Inflation adj. loss: <strong>${fmtK(fv - realFV)}</strong></div>`;
    // AI predictions
    const milestones = [2, 5, 10, 15, 20, 25, 30].filter(y => y <= Y + 5);
    document.getElementById('sipPredGrid').innerHTML = milestones.map(y => {
        let pv = 0, inv = 0, m2 = P;
        for (let yr = 1; yr <= y; yr++) { for (let m = 0; m < 12; m++) { pv = (pv + m2) * (1 + r); inv += m2; } if (stepUp > 0) m2 *= (1 + stepUp / 100); }
        return `<div class="pred-item"><div class="pred-val">${fmtK(pv)}</div><div class="pred-label">Year ${y}</div></div>`;
    }).join('');
    document.getElementById('sipPred').style.display = 'block';
    document.getElementById('sipResult').classList.add('show');
    document.getElementById('sipChartCard').style.display = 'block';
    document.getElementById('sipAnnualCard').style.display = 'block';
    // Line chart
    if (charts.sip) charts.sip.destroy();
    charts.sip = new Chart(document.getElementById('sipChart').getContext('2d'), {
        type: 'line',
        data: {
            labels, datasets: [
                { label: 'Invested', data: dataInvested, borderColor: '#7a85a8', backgroundColor: 'rgba(122,133,168,0.08)', fill: true, tension: 0.4, pointRadius: 0 },
                { label: 'Value', data: dataValue, borderColor: '#00e5ff', backgroundColor: 'rgba(0,229,255,0.07)', fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2.5 }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#c8d0e8', font: { size: 11 } } }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${fmtK(c.raw)}` } } },
            scales: { x: { ticks: { color: '#3a4060', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.03)' } }, y: { ticks: { color: '#3a4060', font: { size: 11 }, callback: v => fmtK(v) }, grid: { color: 'rgba(255,255,255,0.04)' } } }
        }
    });
    // Annual milestones
    const showYears = [1, 3, 5, 10, 15, 20, 25, 30].filter(y => y <= Y);
    document.getElementById('sipAnnualGrid').innerHTML = showYears.map(y => {
        const d = annualData[y - 1]; if (!d) return '';
        const growth = y > 1 ? ((d.value - annualData[y - 2].value) / annualData[y - 2].value * 100) : 0;
        const isPos = growth >= 0;
        return `<div class="growth-item">
      <div class="growth-year">Year ${y}</div>
      <div class="growth-val">${fmtK(d.value)}</div>
      <div class="growth-pct ${isPos ? 'pos' : 'neg'}">${isPos ? '▲' : '▼'} ${Math.abs(growth).toFixed(1)}% YoY</div>
    </div>`;
    }).join('');
    // Bar chart for annual
    if (charts.sipBar) charts.sipBar.destroy();
    const barsYears = annualData.filter((_, i) => i % Math.max(1, Math.floor(Y / 8)) === 0 || i === Y - 1).slice(0, 10);
    charts.sipBar = new Chart(document.getElementById('sipBarChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: barsYears.map(d => `Yr${d.yr}`),
            datasets: [{
                label: 'Portfolio Value', data: barsYears.map(d => d.value),
                backgroundColor: barsYears.map((_, i) => i === barsYears.length - 1 ? '#f0c040' : `rgba(0,229,255,${0.4 + i * 0.05})`), borderRadius: 8, borderSkipped: false
            },
            { label: 'Invested', data: barsYears.map(d => d.invested), backgroundColor: 'rgba(122,133,168,0.3)', borderRadius: 8, borderSkipped: false }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#c8d0e8', font: { size: 11 } } }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${fmtK(c.raw)}` } } },
            scales: { x: { ticks: { color: '#3a4060', font: { size: 11 } }, grid: { display: false } }, y: { ticks: { color: '#3a4060', font: { size: 11 }, callback: v => fmtK(v) }, grid: { color: 'rgba(255,255,255,0.04)' } } }
        }
    });
    playSuccess(); toast('SIP projection calculated!', 'success');
}

// ─── GST CALCULATOR ────────────────────────────────
function calcGST() {
    const amt = parseFloat(document.getElementById('gstAmt').value);
    const rate = parseFloat(document.getElementById('gstRate').value);
    const mode = document.getElementById('gstMode').value;
    const state = document.getElementById('gstState').value;
    if (!amt) { playError(); toast('Please enter an amount', 'error'); return; }
    let base, tax, final;
    if (mode === 'excl') { base = amt; tax = amt * rate / 100; final = amt + tax; }
    else { base = amt / (1 + rate / 100); tax = amt - base; final = amt; }
    const half = tax / 2;
    document.getElementById('gstBase').textContent = fmt(base);
    document.getElementById('gstTax').textContent = fmt(tax);
    document.getElementById('gstFinal').textContent = fmt(final);
    if (state === 'same') { document.getElementById('gstCGST').textContent = fmt(half); document.getElementById('gstSGST').textContent = fmt(half); document.getElementById('gstIGST').textContent = 'N/A'; }
    else { document.getElementById('gstCGST').textContent = 'N/A'; document.getElementById('gstSGST').textContent = 'N/A'; document.getElementById('gstIGST').textContent = fmt(tax); }
    document.getElementById('gstResult').classList.add('show');
    const pct = (base / final * 100);
    document.getElementById('gstVisBar').style.width = pct + '%';
    document.getElementById('gstVisBase').textContent = `Base: ${fmt(base)}`;
    document.getElementById('gstVisTax').textContent = `Tax: ${fmt(tax)}`;
    document.getElementById('gstVisual').style.display = 'block';
    playSuccess(); toast(`GST: ${fmt(tax)} on ${fmt(base)}`, 'success');
}

// ─── BUDGET PLANNER ────────────────────────────────
function applyBudgetRule() {
    const inc = parseFloat(document.getElementById('budgetIncome').value) || 0;
    if (!inc) return;
    document.getElementById('budgetCard').style.display = 'block';
    document.getElementById('budgetRuleSub').textContent = `Based on ₹${inc.toLocaleString('en-IN')}/month income`;
    const rules = [{ name: '🏠 Needs (50%)', limit: inc * 0.5 }, { name: '🎮 Wants (30%)', limit: inc * 0.3 }, { name: '📦 Savings (20%)', limit: inc * 0.2 }];
    document.getElementById('budgetRuleList').innerHTML = rules.map(r => `
    <div class="budget-item"><div class="budget-header"><div class="budget-name">${r.name}</div>
      <div class="budget-amounts">${fmtK(r.limit)}/mo</div></div>
      <div class="budget-bar-wrap"><div class="budget-bar" style="width:100%"></div></div>
    </div>`).join('');
}
function addBudget() {
    const cat = document.getElementById('budgetCat').value;
    const limit = parseFloat(document.getElementById('budgetLimit').value);
    if (!limit) { playError(); toast('Enter a budget limit', 'error'); return; }
    const idx = budgets.findIndex(b => b.cat === cat);
    if (idx >= 0) budgets[idx].limit = limit; else budgets.push({ cat, limit });
    save(); renderBudget(); playSuccess(); toast(`Budget set for ${cat}`, 'success');
}
function renderBudget() {
    if (!budgets.length) return;
    document.getElementById('budgetCard').style.display = 'block';
    document.getElementById('budgetChartCard').style.display = 'block';
    document.getElementById('budgetBarCard').style.display = 'block';
    const spent = {};
    transactions.filter(t => t.type === 'expense').forEach(t => { spent[t.cat] = (spent[t.cat] || 0) + t.amt; });
    document.getElementById('budgetList').innerHTML = budgets.map(b => {
        const s = spent[b.cat] || 0, pct = Math.min((s / b.limit) * 100, 100);
        const cls = pct >= 100 ? 'over' : pct >= 80 ? 'warn' : '';
        const remaining = Math.max(0, b.limit - s);
        return `<div class="budget-item">
      <div class="budget-header"><div class="budget-name">${b.cat}</div>
        <div class="budget-amounts">${fmtK(s)} / ${fmtK(b.limit)} · <span style="color:${pct >= 100 ? 'var(--red2)' : pct >= 80 ? 'var(--orange)' : 'var(--green)'}">
          ${pct >= 100 ? 'OVER BUDGET' : fmtK(remaining) + ' left'}</span></div></div>
      <div class="budget-bar-wrap"><div class="budget-bar ${cls}" style="width:${pct}%"></div></div>
    </div>`;
    }).join('');
    const colors = ['#f0c040', '#00e5ff', '#00f5a0', '#ff4d6a', '#b36bff', '#ff9900', '#80f0ff', '#7fffcf', '#ff8fa0'];
    if (charts.budget) charts.budget.destroy();
    charts.budget = new Chart(document.getElementById('budgetChart').getContext('2d'), {
        type: 'doughnut',
        data: { labels: budgets.map(b => b.cat), datasets: [{ data: budgets.map(b => b.limit), backgroundColor: colors, borderWidth: 0, hoverOffset: 6 }] },
        options: { cutout: '68%', plugins: { legend: { display: false } } }
    });
    document.getElementById('budgetChartLegend').innerHTML = budgets.map((b, i) => `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:7px">
      <div style="width:8px;height:8px;border-radius:50%;background:${colors[i % colors.length]};flex-shrink:0"></div>
      <div style="font-size:0.78rem;color:var(--t2);flex:1">${b.cat}</div>
      <div style="font-family:'JetBrains Mono';font-size:0.75rem;color:var(--t0)">${fmtK(b.limit)}</div>
    </div>`).join('');
    // Budget vs actual bar chart
    if (charts.budgetBar) charts.budgetBar.destroy();
    charts.budgetBar = new Chart(document.getElementById('budgetBarChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: budgets.map(b => b.cat.split(' ').slice(1).join(' ')),
            datasets: [{ label: 'Budget', data: budgets.map(b => b.limit), backgroundColor: 'rgba(240,192,64,0.5)', borderRadius: 6, borderSkipped: false },
            { label: 'Actual', data: budgets.map(b => spent[b.cat] || 0), backgroundColor: budgets.map(b => { const s = spent[b.cat] || 0; return s > b.limit ? 'rgba(255,77,106,0.8)' : s > b.limit * 0.8 ? 'rgba(255,153,0,0.8)' : 'rgba(0,245,160,0.7)'; }), borderRadius: 6, borderSkipped: false }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#c8d0e8', font: { size: 11 } } } },
            scales: { x: { ticks: { color: '#3a4060', font: { size: 10 } }, grid: { display: false } }, y: { ticks: { color: '#3a4060', font: { size: 10 }, callback: v => fmtK(v) }, grid: { color: 'rgba(255,255,255,0.04)' } } }
        }
    });
}

// ─── GOALS ─────────────────────────────────────────
function addGoal() {
    const name = document.getElementById('goalName').value.trim();
    const target = parseFloat(document.getElementById('goalTarget').value);
    const saved = parseFloat(document.getElementById('goalSaved').value) || 0;
    const date = document.getElementById('goalDate').value;
    const icon = document.getElementById('goalIcon').value;
    if (!name || !target) { playError(); toast('Enter goal name and target', 'error'); return; }
    goals.push({ id: Date.now(), name, target, saved, date, icon });
    save(); renderGoals(); playSuccess(); toast(`Goal "${name}" added!`, 'success');
    document.getElementById('goalName').value = ''; document.getElementById('goalTarget').value = ''; document.getElementById('goalSaved').value = '';
}
function deleteGoal(id) { goals = goals.filter(g => g.id !== id); save(); renderGoals(); }
function addToGoal(id) {
    const amt = parseFloat(prompt('How much to add to this goal? (₹)'));
    if (!amt || amt <= 0) return;
    const g = goals.find(g => g.id === id); if (!g) return;
    g.saved = Math.min(g.saved + amt, g.target); save(); renderGoals();
    playSuccess(); toast(`Added ${fmtK(amt)} to ${g.name}!`, 'success');
}
function renderGoals() {
    const grid = document.getElementById('goalGrid');
    if (!goals.length) {
        grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-bullseye"></i><div>No goals yet. Add your first goal!</div></div>';
        document.getElementById('goalsChartCard').style.display = 'none'; return;
    }
    document.getElementById('goalsChartCard').style.display = 'block';
    grid.innerHTML = goals.map(g => {
        const pct = Math.min((g.saved / g.target) * 100, 100).toFixed(1);
        const remaining = Math.max(0, g.target - g.saved);
        const daysLeft = g.date ? Math.max(0, Math.ceil((new Date(g.date) - new Date()) / 86400000)) : null;
        const monthly = (daysLeft && daysLeft > 0) ? remaining / (daysLeft / 30) : null;
        const isComplete = parseFloat(pct) >= 100;
        return `<div class="goal-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px">
        <div class="goal-icon-wrap">${g.icon}</div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost" style="padding:5px 10px;font-size:0.7rem" onclick="addToGoal(${g.id})"><i class="fas fa-plus"></i></button>
          <button class="btn btn-red" style="padding:5px 8px;font-size:0.68rem" onclick="deleteGoal(${g.id})">✕</button>
        </div>
      </div>
      <div class="goal-name">${g.name}</div>
      <div class="goal-target">Target: ${fmtK(g.target)} · Saved: ${fmtK(g.saved)}</div>
      <div class="goal-progress-wrap"><div class="goal-bar${isComplete ? ' complete' : ''}" style="width:${pct}%"></div></div>
      <div class="goal-stats">
        <div class="goal-pct">${isComplete ? '✅ Complete!' : pct + '% complete'}</div>
        ${daysLeft !== null ? `<div class="goal-days">${daysLeft}d left</div>` : ''}
      </div>
      ${monthly ? `<div class="goal-monthly-tip">💡 Save ${fmtK(monthly)}/mo to reach goal on time</div>` : ''}
      ${isComplete ? `<div style="margin-top:10px;text-align:center;font-size:0.82rem;color:var(--green);font-weight:700">🎉 Goal Achieved!</div>` : ''}
    </div>`;
    }).join('');
    // Goals bar chart
    if (charts.goals) charts.goals.destroy();
    charts.goals = new Chart(document.getElementById('goalsChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: goals.map(g => g.icon + ' ' + g.name.slice(0, 10)),
            datasets: [{ label: 'Target', data: goals.map(g => g.target), backgroundColor: 'rgba(122,133,168,0.3)', borderRadius: 6, borderSkipped: false },
            { label: 'Saved', data: goals.map(g => g.saved), backgroundColor: goals.map(g => g.saved >= g.target ? '#00f5a0' : '#00e5ff'), borderRadius: 6, borderSkipped: false }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#c8d0e8', font: { size: 11 } } }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${fmtK(c.raw)}` } } },
            scales: { x: { ticks: { color: '#3a4060', font: { size: 10 } }, grid: { display: false } }, y: { ticks: { color: '#3a4060', font: { size: 10 }, callback: v => fmtK(v) }, grid: { color: 'rgba(255,255,255,0.04)' } } }
        }
    });
}

// ─── FX CONVERTER ──────────────────────────────────
const FX_RATES_INR = { INR: 1, USD: 93.42, EUR: 90.15, GBP: 106.0, JPY: 0.557, SGD: 61.5, AED: 22.7, AUD: 54.2, CAD: 61.8, CHF: 93.5, CNY: 11.55, HKD: 10.65, SAR: 22.2, MYR: 17.65, THB: 2.31, ZAR: 4.42, NZD: 50.1, KWD: 270.8, BHD: 221.5, QAR: 22.9 };
const FX_NAMES = { INR: '🇮🇳 Indian Rupee', USD: '🇺🇸 US Dollar', EUR: '🇪🇺 Euro', GBP: '🇬🇧 British Pound', JPY: '🇯🇵 Japanese Yen', SGD: '🇸🇬 Singapore Dollar', AED: '🇦🇪 UAE Dirham', AUD: '🇦🇺 Australian Dollar', CAD: '🇨🇦 Canadian Dollar', CHF: '🇨🇭 Swiss Franc', CNY: '🇨🇳 Chinese Yuan', HKD: '🇭🇰 Hong Kong Dollar', SAR: '🇸🇦 Saudi Riyal', MYR: '🇲🇾 Malaysian Ringgit', THB: '🇹🇭 Thai Baht', ZAR: '🇿🇦 South African Rand', NZD: '🇳🇿 New Zealand Dollar', KWD: '🇰🇼 Kuwaiti Dinar', BHD: '🇧🇭 Bahraini Dinar', QAR: '🇶🇦 Qatari Riyal' };
function initFX() {
    const from = document.getElementById('fxFrom'), to = document.getElementById('fxTo');
    if (from.options.length) return;
    Object.entries(FX_NAMES).forEach(([k, v]) => { from.add(new Option(v, k)); to.add(new Option(v, k)); });
    from.value = 'INR'; to.value = 'USD';
    document.getElementById('fxRateGrid').innerHTML = Object.keys(FX_RATES_INR).filter(c => c !== 'INR').slice(0, 12).map(c => `
    <div style="background:var(--ink3);border:1px solid var(--border);border-radius:var(--r);padding:14px;text-align:center;cursor:pointer;transition:all 0.2s" onmouseover="this.style.borderColor='var(--cyan)'" onmouseout="this.style.borderColor='var(--border)'">
      <div style="font-size:1.2rem;margin-bottom:4px">${FX_NAMES[c].split(' ')[0]}</div>
      <div style="font-family:'JetBrains Mono';font-size:0.85rem;color:var(--t0);font-weight:600">₹${FX_RATES_INR[c].toFixed(2)}</div>
      <div style="font-size:0.68rem;color:var(--t3);margin-top:2px">${c}</div>
    </div>`).join('');
}
function convertFX() {
    const amt = parseFloat(document.getElementById('fxAmt').value) || 0;
    const from = document.getElementById('fxFrom').value, to = document.getElementById('fxTo').value;
    const amtINR = amt * FX_RATES_INR[from], result = amtINR / FX_RATES_INR[to];
    document.getElementById('fxResult').value = result.toFixed(4);
    const rate = FX_RATES_INR[from] / FX_RATES_INR[to];
    document.getElementById('fxRateDisplay').textContent = `1 ${from} = ${rate.toFixed(4)} ${to}  ·  1 ${to} = ${(1 / rate).toFixed(4)} ${from}`;
}

// ─── TAX CALCULATOR ────────────────────────────────
function calcTax() {
    const income = parseFloat(document.getElementById('taxIncome').value) || 0;
    const hra = parseFloat(document.getElementById('taxHRA').value) || 0;
    const c80 = Math.min(parseFloat(document.getElementById('tax80C').value) || 0, 150000);
    const d80 = Math.min(parseFloat(document.getElementById('tax80D').value) || 0, 25000);
    const hl = Math.min(parseFloat(document.getElementById('taxHL').value) || 0, 200000);
    if (!income) { playError(); toast('Enter your income', 'error'); return; }
    const stdDed = 50000;
    const oldTaxable = Math.max(0, income - stdDed - c80 - d80 - hl - hra * 0.4);
    const oldTax = computeOldTax(oldTaxable), oldRebate = oldTaxable <= 500000 ? oldTax : 0;
    const oldFinal = Math.max(0, oldTax - oldRebate) * 1.04;
    const newTaxable = Math.max(0, income - 50000);
    const newTax = computeNewTax(newTaxable), newRebate = newTaxable <= 700000 ? newTax : 0;
    const newFinal = Math.max(0, newTax - newRebate) * 1.04;
    const better = newFinal < oldFinal ? 'NEW' : 'OLD', save = Math.abs(oldFinal - newFinal);
    document.getElementById('taxOld').textContent = fmtK(oldFinal);
    document.getElementById('taxNew').textContent = fmtK(newFinal);
    document.getElementById('taxBetter').textContent = better + ' Regime';
    document.getElementById('taxSave').textContent = fmtK(save);
    document.getElementById('taxOldRate').textContent = income > 0 ? (oldFinal / income * 100).toFixed(2) + '%' : '0%';
    document.getElementById('taxNewRate').textContent = income > 0 ? (newFinal / income * 100).toFixed(2) + '%' : '0%';
    document.getElementById('taxChips').innerHTML = `
    <div class="stat-chip">Taxable (Old): <strong>${fmtK(oldTaxable)}</strong></div>
    <div class="stat-chip">Taxable (New): <strong>${fmtK(newTaxable)}</strong></div>
    <div class="stat-chip">Deductions used: <strong>${fmtK(c80 + d80 + hl + stdDed)}</strong></div>`;
    document.getElementById('taxResult').classList.add('show');
    document.getElementById('taxChartCard').style.display = 'block';
    if (charts.tax) charts.tax.destroy();
    charts.tax = new Chart(document.getElementById('taxChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Old Regime', 'New Regime'],
            datasets: [{ label: 'Tax Payable', data: [oldFinal, newFinal], backgroundColor: [better === 'OLD' ? '#f0c040' : 'rgba(255,77,106,0.7)', better === 'NEW' ? '#00e5ff' : 'rgba(122,133,168,0.5)'], borderRadius: 10, borderSkipped: false }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `Tax: ${fmtK(c.raw)}` } } },
            scales: { x: { ticks: { color: '#c8d0e8', font: { size: 13, weight: '700' } }, grid: { display: false } }, y: { ticks: { color: '#3a4060', font: { size: 11 }, callback: v => fmtK(v) }, grid: { color: 'rgba(255,255,255,0.04)' } } }
        }
    });
    playSuccess(); toast(`Choose ${better} regime — save ${fmtK(save)}!`, 'success');
}
function computeOldTax(i) { if (i <= 250000) return 0; if (i <= 500000) return (i - 250000) * 0.05; if (i <= 1000000) return 12500 + (i - 500000) * 0.20; return 112500 + (i - 1000000) * 0.30; }
function computeNewTax(i) { if (i <= 300000) return 0; if (i <= 700000) return (i - 300000) * 0.05; if (i <= 1000000) return 20000 + (i - 700000) * 0.10; if (i <= 1200000) return 50000 + (i - 1000000) * 0.15; if (i <= 1500000) return 80000 + (i - 1200000) * 0.20; return 140000 + (i - 1500000) * 0.30; }

// ─── INVESTMENT COMPARISON ─────────────────────────
function compareInvestments() {
    const amt = parseFloat(document.getElementById('cmpAmt').value);
    const Y = parseFloat(document.getElementById('cmpYears').value);
    if (!amt || !Y) { playError(); toast('Enter amount and years', 'error'); return; }
    const instruments = [
        { name: 'Fixed Deposit', icon: '🏦', rate: 7.1, tax: 'Taxable', risk: 'Very Low', calc: (a, y, r) => a * Math.pow(1 + r / 100, y) },
        { name: 'PPF', icon: '🏛️', rate: 7.1, tax: 'Tax-Free', risk: 'No Risk', calc: (a, y, r) => { let v = 0; for (let i = 0; i < y; i++)v = (v + a) * (1 + r / 100); return v; } },
        { name: 'NPS (Tier 1)', icon: '🧓', rate: 10.5, tax: 'Partial', risk: 'Low-Med', calc: (a, y, r) => a * Math.pow(1 + r / 100, y) },
        { name: 'Mutual Fund', icon: '📊', rate: 12.0, tax: 'LTCG 10%', risk: 'Moderate', calc: (a, y, r) => a * Math.pow(1 + r / 100, y) },
        { name: 'Index Fund', icon: '📈', rate: 13.5, tax: 'LTCG 10%', risk: 'Moderate', calc: (a, y, r) => a * Math.pow(1 + r / 100, y) },
        { name: 'RD (Bank)', icon: '📅', rate: 6.8, tax: 'Taxable', risk: 'Very Low', calc: (a, y, r) => { const mn = y * 12, rm = r / 12 / 100; return a * mn * (1 + rm * (mn + 1) / 2); } },
        { name: 'Gold (SGB)', icon: '🥇', rate: 8.0, tax: 'Tax-Free', risk: 'Low', calc: (a, y, r) => a * Math.pow(1 + r / 100, y) },
        { name: 'Direct Stocks', icon: '💹', rate: 15.0, tax: 'LTCG 10%', risk: 'High', calc: (a, y, r) => a * Math.pow(1 + r / 100, y) },
    ];
    const results = instruments.map(inv => { const mat = inv.calc(amt, Y, inv.rate), ret = mat - amt; return { ...inv, mat, ret }; }).sort((a, b) => b.mat - a.mat);
    const maxMat = results[0].mat;
    document.getElementById('cmpBody').innerHTML = results.map((r, i) => `
    <tr>
      <td>${r.icon} ${r.name}${i === 0 ? `<span class="best-badge">BEST</span>` : ''}</td>
      <td style="font-family:'JetBrains Mono'">${r.rate}%</td>
      <td class="${i === 0 ? 'best' : ''}" style="font-family:'JetBrains Mono'">${fmtK(r.mat)}${i === 0 ? `<div style="height:3px;background:var(--gold);border-radius:99px;margin-top:4px;width:${(r.mat / maxMat * 100).toFixed(0)}%"></div>` : ''}</td>
      <td style="color:var(--green);font-family:'JetBrains Mono'">${fmtK(r.ret)}</td>
      <td style="font-size:0.75rem">${r.tax}</td>
      <td style="font-size:0.75rem;color:${r.risk === 'High' ? 'var(--red)' : r.risk.includes('Very') || r.risk === 'No Risk' ? 'var(--green)' : 'var(--gold)'}">${r.risk}</td>
    </tr>`).join('');
    document.getElementById('cmpResult').style.display = 'block';
    document.getElementById('cmpChartCard').style.display = 'block';
    document.getElementById('cmpLineCard').style.display = 'block';
    if (charts.cmp) charts.cmp.destroy();
    charts.cmp = new Chart(document.getElementById('cmpChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: results.map(r => r.icon + ' ' + r.name),
            datasets: [{ label: 'Maturity Value', data: results.map(r => r.mat), backgroundColor: results.map((_, i) => i === 0 ? '#f0c040' : `rgba(0,229,255,${0.2 + i * 0.05})`), borderRadius: 8, borderSkipped: false },
            { label: 'Invested', data: results.map(() => amt), backgroundColor: 'rgba(122,133,168,0.2)', borderRadius: 8, borderSkipped: false }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#c8d0e8', font: { size: 11 } } }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${fmtK(c.raw)}` } } },
            scales: { x: { ticks: { color: '#3a4060', font: { size: 10 }, maxRotation: 30 }, grid: { display: false } }, y: { ticks: { color: '#3a4060', font: { size: 10 }, callback: v => fmtK(v) }, grid: { color: 'rgba(255,255,255,0.04)' } } }
        }
    });
    // Growth projection line chart
    const lineColors = ['#f0c040', '#00e5ff', '#00f5a0', '#ff4d6a', '#b36bff', '#ff9900', '#80f0ff', '#7fffcf'];
    const lineYears = Array.from({ length: Y }, (_, i) => i + 1);
    if (charts.cmpLine) charts.cmpLine.destroy();
    charts.cmpLine = new Chart(document.getElementById('cmpLineChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: lineYears.map(y => `Yr ${y}`),
            datasets: results.slice(0, 5).map((r, i) => ({
                label: r.icon + ' ' + r.name,
                data: lineYears.map(y => r.calc(amt, y, r.rate)),
                borderColor: lineColors[i], backgroundColor: 'transparent', tension: 0.4, pointRadius: 0, borderWidth: i === 0 ? 2.5 : 1.5
            }))
        },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#c8d0e8', font: { size: 10 } } } },
            scales: { x: { ticks: { color: '#3a4060', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.03)' } }, y: { ticks: { color: '#3a4060', font: { size: 10 }, callback: v => fmtK(v) }, grid: { color: 'rgba(255,255,255,0.04)' } } }
        }
    });
    playSuccess(); toast('Comparison complete!', 'success');
}

// ─── AI PREDICTOR ─────────────────────────────────
function runPrediction() {
    const months = parseInt(document.getElementById('predMonths').value) || 12;
    const incGrowth = (parseFloat(document.getElementById('predGrowth').value) || 10) / 100 / 12;
    const expGrowth = (parseFloat(document.getElementById('predExpGrowth').value) || 7) / 100 / 12;
    const inc = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amt, 0);
    const exp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amt, 0);
    const monthlyInc = inc / Math.max(transactions.length / 2, 1) || 50000;
    const monthlyExp = exp / Math.max(transactions.length / 2, 1) || 35000;
    // ML-inspired: Exponential Smoothing + Linear Regression
    const alpha = 0.3;
    let smoothInc = monthlyInc, smoothExp = monthlyExp;
    const futureInc = [], futureExp = [], futureNet = [], labels = [];
    for (let m = 1; m <= months; m++) {
        smoothInc = smoothInc * (1 + incGrowth) * (1 + alpha * (Math.random() * 0.1 - 0.05));
        smoothExp = smoothExp * (1 + expGrowth) * (1 + alpha * (Math.random() * 0.08 - 0.04));
        futureInc.push(+smoothInc.toFixed(0));
        futureExp.push(+smoothExp.toFixed(0));
        futureNet.push(+(smoothInc - smoothExp).toFixed(0));
        const d = new Date(); d.setMonth(d.getMonth() + m);
        labels.push(d.toLocaleString('default', { month: 'short', year: '2-digit' }));
    }
    const totalPredInc = futureInc.reduce((s, v) => s + v, 0);
    const totalPredExp = futureExp.reduce((s, v) => s + v, 0);
    const totalPredNet = totalPredInc - totalPredExp;
    const savRatePred = (totalPredNet / totalPredInc * 100).toFixed(1);
    const cumWealth = futureNet.reduce((a, v, i) => a + (a[i - 1] || 0) + v, 0);
    document.getElementById('predKPIs').innerHTML = `
    <div class="pred-item"><div class="pred-val">${fmtK(totalPredInc)}</div><div class="pred-label">Predicted Income (${months}mo)</div></div>
    <div class="pred-item"><div class="pred-val" style="color:var(--red2)">${fmtK(totalPredExp)}</div><div class="pred-label">Predicted Expenses</div></div>
    <div class="pred-item"><div class="pred-val" style="color:var(--green)">${fmtK(totalPredNet)}</div><div class="pred-label">Net Surplus</div></div>
    <div class="pred-item"><div class="pred-val" style="color:var(--cyan)">${savRatePred}%</div><div class="pred-label">Avg Savings Rate</div></div>
    <div class="pred-item"><div class="pred-val" style="color:var(--gold)">${fmtK(futureInc[months - 1])}</div><div class="pred-label">Month ${months} Income</div></div>
    <div class="pred-item"><div class="pred-val" style="color:var(--purple2)">${fmtK(futureNet.reduce((s, v) => s + v, 0))}</div><div class="pred-label">Projected Savings</div></div>`;
    document.getElementById('predResults').style.display = 'block';
    if (charts.pred) charts.pred.destroy();
    charts.pred = new Chart(document.getElementById('predChart').getContext('2d'), {
        type: 'line',
        data: {
            labels, datasets: [
                { label: 'Projected Income', data: futureInc, borderColor: '#00f5a0', backgroundColor: 'rgba(0,245,160,0.06)', fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2 },
                { label: 'Projected Expenses', data: futureExp, borderColor: '#ff4d6a', backgroundColor: 'rgba(255,77,106,0.06)', fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2 },
                { label: 'Net Surplus', data: futureNet, borderColor: '#f0c040', backgroundColor: 'rgba(240,192,64,0.06)', fill: true, tension: 0.4, pointRadius: 3, borderWidth: 2, pointBackgroundColor: '#f0c040' }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#c8d0e8', font: { size: 11 } } }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${fmtK(c.raw)}` } } },
            scales: { x: { ticks: { color: '#3a4060', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.03)' } }, y: { ticks: { color: '#3a4060', font: { size: 11 }, callback: v => fmtK(v) }, grid: { color: 'rgba(255,255,255,0.04)' } } }
        }
    });
    // Annual growth analysis
    const years = Math.ceil(months / 12);
    const annualInc = [], annualNet = [];
    for (let y = 0; y < years; y++) {
        const slice = futureInc.slice(y * 12, (y + 1) * 12);
        const sliceNet = futureNet.slice(y * 12, (y + 1) * 12);
        annualInc.push(slice.reduce((s, v) => s + v, 0));
        annualNet.push(sliceNet.reduce((s, v) => s + v, 0));
    }
    document.getElementById('annualGrowthGrid').innerHTML = annualInc.map((v, i) => {
        const growth = i > 0 ? ((v - annualInc[i - 1]) / annualInc[i - 1] * 100) : 0;
        const d = new Date(); d.setFullYear(d.getFullYear() + i);
        return `<div class="growth-item">
      <div class="growth-year">${d.getFullYear()}</div>
      <div class="growth-val">${fmtK(v)}</div>
      <div class="growth-pct ${growth >= 0 ? 'pos' : 'neg'}">${growth >= 0 ? '▲' : '▼'} ${Math.abs(growth).toFixed(1)}% YoY</div>
      <div style="font-size:0.7rem;color:var(--green);margin-top:4px">Net: ${fmtK(annualNet[i])}</div>
    </div>`;
    }).join('');
    if (charts.annualGrowth) charts.annualGrowth.destroy();
    const yearLabels = annualInc.map((_, i) => { const d = new Date(); d.setFullYear(d.getFullYear() + i); return d.getFullYear().toString(); });
    charts.annualGrowth = new Chart(document.getElementById('annualGrowthChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: yearLabels,
            datasets: [{ label: 'Predicted Annual Income', data: annualInc, backgroundColor: annualInc.map((_, i) => i === annualInc.length - 1 ? 'rgba(240,192,64,0.8)' : `rgba(0,229,255,${0.4 + i * 0.12})`), borderRadius: 10, borderSkipped: false },
            { label: 'Net Surplus', data: annualNet, backgroundColor: 'rgba(0,245,160,0.6)', borderRadius: 10, borderSkipped: false }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#c8d0e8', font: { size: 11 } } }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${fmtK(c.raw)}` } } },
            scales: { x: { ticks: { color: '#c8d0e8', font: { size: 12, weight: '600' } }, grid: { display: false } }, y: { ticks: { color: '#3a4060', font: { size: 11 }, callback: v => fmtK(v) }, grid: { color: 'rgba(255,255,255,0.04)' } } }
        }
    });
    // Smart recommendations
    const recs = [];
    if (parseFloat(savRatePred) < 20) recs.push({ icon: '⚠️', color: 'var(--orange)', msg: `Savings rate (${savRatePred}%) is below the 20% target. Reduce discretionary spending or increase income streams.` });
    else recs.push({ icon: '✅', color: 'var(--green)', msg: `Savings rate (${savRatePred}%) is healthy. Consider investing the surplus in equity mutual funds for higher returns.` });
    if (totalPredNet > 0) recs.push({ icon: '💡', color: 'var(--cyan)', msg: `You're projected to save ${fmtK(totalPredNet)} over ${months} months. SIP of ${fmtK(totalPredNet / months)}/month at 12% p.a. = ${fmtK(totalPredNet * months * 0.01)} potential corpus.` });
    const overBudgets = budgets.filter(b => { const s = transactions.filter(t => t.type === 'expense' && t.cat === b.cat).reduce((a, t) => a + t.amt, 0); return s > b.limit; });
    if (overBudgets.length) recs.push({ icon: '🔴', color: 'var(--red)', msg: `${overBudgets.length} categories over budget. Focus on reducing: ${overBudgets.map(b => b.cat).join(', ')}` });
    if (goals.length > 0) { const incomplete = goals.filter(g => g.saved < g.target).length; if (incomplete) recs.push({ icon: '🎯', color: 'var(--purple2)', msg: `${incomplete} financial goal(s) incomplete. Automate monthly transfers to accelerate progress.` }); }
    recs.push({ icon: '📊', color: 'var(--gold)', msg: `Diversification tip: Allocate income as 50% Needs, 30% Wants, 20% Savings (50-30-20 rule) to build wealth systematically.` });
    document.getElementById('predRecs').innerHTML = recs.map(r => `
    <div style="display:flex;gap:14px;align-items:flex-start;padding:14px 16px;background:var(--ink3);border-radius:12px;border:1px solid var(--border);margin-bottom:10px">
      <div style="font-size:1.3rem;flex-shrink:0">${r.icon}</div>
      <div style="font-size:0.88rem;color:var(--t1);line-height:1.6">${r.msg}</div>
    </div>`).join('');
    playSuccess(); toast('AI prediction complete!', 'success');
}

// ─── PDF EXPORT ─────────────────────────────────────
function exportPDF() {
    playCoins();
    toast('Generating PDF report...', 'info');
    try {
        const jsPDFLib = window.jspdf && window.jspdf.jsPDF;
        if (!jsPDFLib) { toast('PDF library not loaded. Refresh and try again.', 'error'); return; }
        const doc = new jsPDFLib({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const W = doc.internal.pageSize.getWidth();
        let y = 20;

        // ── Header ──
        doc.setFillColor(6, 8, 16);
        doc.rect(0, 0, W, 42, 'F');
        doc.setTextColor(240, 192, 64);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('MoneyMetrics Pro', 14, 16);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(120, 133, 168);
        doc.text('Personal Financial Report', 14, 24);
        doc.text('Generated: ' + new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString('en-IN'), 14, 30);
        y = 52;

        // ── Summary Box ──
        const inc = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amt, 0);
        const exp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amt, 0);
        const bal = inc - exp;
        const savRate = inc > 0 ? ((bal / inc) * 100).toFixed(1) : '0';

        doc.setFillColor(14, 17, 32);
        doc.roundedRect(14, y, W - 28, 36, 3, 3, 'F');
        doc.setTextColor(240, 192, 64);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('FINANCIAL SUMMARY', 20, y + 10);

        const summaryItems = [
            ['Total Income', 'Rs.' + inc.toLocaleString('en-IN')],
            ['Total Expenses', 'Rs.' + exp.toLocaleString('en-IN')],
            ['Net Balance', 'Rs.' + bal.toLocaleString('en-IN')],
            ['Savings Rate', savRate + '%']
        ];
        summaryItems.forEach(([label, val], i) => {
            const x = 20 + i * ((W - 40) / 4);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(120, 133, 168);
            doc.text(String(label), x, y + 21);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 255, 255);
            doc.text(String(val), x, y + 30);
        });
        y += 44;

        // ── Transactions ──
        if (transactions.length) {
            if (y > 250) { doc.addPage(); y = 20; }
            doc.setTextColor(240, 192, 64);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text('TRANSACTION HISTORY', 14, y);
            y += 8;

            // Column layout — A4 usable width 14..190mm = 176mm total
            // Date:28 | Desc:50 | Cat:36 | Type:20 | Amt:30  (margins+gaps = 176)
            const hx = [14, 44, 96, 134, 158];
            const hMaxW = [28, 50, 36, 18, 30]; // max mm width per col
            const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];

            // clip helper - truncate string until it fits maxMm at current font size
            function clipTxt(s, maxMm) {
                s = String(s || '');
                doc.setFontSize(8);
                while (s.length > 1 && doc.getTextWidth(s) > maxMm) s = s.slice(0, -1);
                return s;
            }

            // Header row
            doc.setFillColor(30, 35, 56);
            doc.rect(14, y - 5, W - 28, 8, 'F');
            doc.setTextColor(120, 133, 168);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'bold');
            headers.forEach((h, i) => doc.text(h, hx[i], y));
            y += 7;

            // Divider line under header
            doc.setDrawColor(58, 64, 96);
            doc.setLineWidth(0.2);
            doc.line(14, y - 1, W - 14, y - 1);

            transactions.slice(0, 25).forEach((t, i) => {
                if (y > 265) { doc.addPage(); y = 20; }
                if (i % 2 === 0) { doc.setFillColor(10, 14, 26); doc.rect(14, y - 4, W - 28, 7, 'F'); }
                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');

                // Date
                doc.setTextColor(200, 208, 232);
                doc.text(clipTxt(t.date || '', hMaxW[0]), hx[0], y);

                // Description (white, bold)
                doc.setTextColor(255, 255, 255);
                doc.setFont('helvetica', 'bold');
                doc.text(clipTxt(t.desc || '', hMaxW[1]), hx[1], y);
                doc.setFont('helvetica', 'normal');

                // Category (strip emoji)
                doc.setTextColor(160, 170, 200);
                const cat2 = (t.cat || '').replace(/[^\x00-\x7F]/g, '').trim() || 'Other';
                doc.text(clipTxt(cat2, hMaxW[2]), hx[2], y);

                // Type
                if (t.type === 'income') { doc.setTextColor(0, 210, 130); } else { doc.setTextColor(230, 80, 100); }
                doc.text(t.type === 'income' ? 'INC' : 'EXP', hx[3], y);

                // Amount — right-align inside its column
                doc.setTextColor(200, 208, 232);
                const rawAmt = 'Rs.' + Number(t.amt || 0).toLocaleString('en-IN');
                const clippedAmt = clipTxt(rawAmt, hMaxW[4]);
                const aw = doc.getTextWidth(clippedAmt);
                doc.text(clippedAmt, hx[4] + hMaxW[4] - aw, y);

                y += 7;
            });

            // Bottom border
            doc.setDrawColor(30, 35, 56);
            doc.setLineWidth(0.3);
            doc.line(14, y, W - 14, y);
            y += 4;

            if (transactions.length > 25) {
                doc.setTextColor(120, 133, 168);
                doc.setFontSize(7);
                doc.text('...and ' + (transactions.length - 25) + ' more transactions not shown', 14, y + 2);
                y += 8;
            }
        }

        // ── Goals ──
        if (goals.length) {
            if (y > 230) { doc.addPage(); y = 20; }
            y += 8;
            doc.setTextColor(240, 192, 64);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text('SAVINGS GOALS', 14, y);
            y += 8;
            goals.forEach(g => {
                if (y > 270) { doc.addPage(); y = 20; }
                const pct = Math.min(((g.saved || 0) / (g.target || 1)) * 100, 100).toFixed(1);
                const name = String(g.name || '').replace(/[^\x00-\x7F]/g, '').trim();
                doc.setTextColor(200, 208, 232);
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.text((name || 'Goal') + ': ' + pct + '%  (Rs.' + Number(g.saved || 0).toLocaleString() + ' saved of Rs.' + Number(g.target || 0).toLocaleString() + ')', 14, y);
                // Mini progress bar
                const bw = W - 28;
                doc.setFillColor(30, 35, 56);
                doc.roundedRect(14, y + 2, bw, 3, 1, 1, 'F');
                doc.setFillColor(0, 229, 255);
                doc.roundedRect(14, y + 2, Math.max(1, bw * (parseFloat(pct) / 100)), 3, 1, 1, 'F');
                y += 12;
            });
        }

        // ── Budgets ──
        if (budgets.length) {
            if (y > 230) { doc.addPage(); y = 20; }
            y += 8;
            doc.setTextColor(240, 192, 64);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text('BUDGET OVERVIEW', 14, y);
            y += 8;
            const spent = {};
            transactions.filter(t => t.type === 'expense').forEach(t => { spent[t.cat] = (spent[t.cat] || 0) + t.amt; });
            budgets.forEach(b => {
                if (y > 270) { doc.addPage(); y = 20; }
                const s = spent[b.cat] || 0;
                const pct = Math.min((s / b.limit) * 100, 100);
                const catName = String(b.cat || '').replace(/[^\x00-\x7F]/g, '').trim();
                doc.setTextColor(200, 208, 232);
                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');
                doc.text((catName || 'Category') + ':  Rs.' + s.toLocaleString() + ' of Rs.' + b.limit.toLocaleString() + '  (' + pct.toFixed(0) + '%)', 14, y);
                const bw = W - 28;
                doc.setFillColor(30, 35, 56); doc.roundedRect(14, y + 2, bw, 2.5, 1, 1, 'F');
                const barColor = pct >= 100 ? [220, 80, 100] : pct >= 80 ? [255, 153, 0] : [0, 200, 120];
                doc.setFillColor(barColor[0], barColor[1], barColor[2]);
                doc.roundedRect(14, y + 2, Math.max(1, bw * (pct / 100)), 2.5, 1, 1, 'F');
                y += 11;
            });
        }

        // ── Footer ──
        const totalPages = doc.internal.getNumberOfPages();
        for (let p = 1; p <= totalPages; p++) {
            doc.setPage(p);
            doc.setFillColor(6, 8, 16);
            doc.rect(0, doc.internal.pageSize.getHeight() - 16, W, 16, 'F');
            doc.setTextColor(58, 64, 96);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'normal');
            doc.text('MoneyMetrics Pro - Personal Finance Intelligence Suite', 14, doc.internal.pageSize.getHeight() - 7);
            doc.text('Page ' + p + ' of ' + totalPages, W - 20, doc.internal.pageSize.getHeight() - 7, { align: 'right' });
        }

        doc.save('MoneyMetrics-Report-' + new Date().toISOString().split('T')[0] + '.pdf');
        toast('PDF downloaded successfully!', 'success');
    } catch (e) {
        console.error('PDF Error:', e);
        toast('PDF error: ' + e.message, 'error');
    }
}

// ─── AI CHATBOT LOGIC ─────────────────────────────
function toggleChat() {
    const widget = document.getElementById('chatWidget');
    widget.classList.toggle('open');
    document.getElementById('chatToggleIcon').className = widget.classList.contains('open') ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
    playClick();
}

function handleChatPress(e) {
    if (e.key === 'Enter') sendChatMessage();
}

// Replace your old chat logic with this real API integration
async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    // 1. Add user message to UI
    appendMessage(text, 'user');
    input.value = '';
    
    // 2. Add a temporary "Typing..." indicator
    const typingId = 'typing-' + Date.now();
    const typingHtml = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    appendMessage(typingHtml, 'ai', typingId, true);

    try {
        // 3. Call OpenRouter API
        const response = await callChatAPI(text);
        
        // 4. Replace "Typing..." with the real answer
        const msgElement = document.getElementById(typingId);
        msgElement.innerHTML = renderMarkdown(response);
        msgElement.removeAttribute('id'); // Clean up the ID
        playCoins(); 
    } catch (error) {
        console.error("Gemini API Error:", error);
        document.getElementById(typingId).textContent = `Error: ${error.message}`;
    }
}

// Ensure your appendMessage function allows passing an ID
function appendMessage(text, sender, id = null, isHtml = false) {
    const body = document.getElementById('chatBody');
    const msg = document.createElement('div');
    msg.className = `chat-msg ${sender}`;
    if (isHtml) {
        msg.innerHTML = text;
    } else {
        msg.innerHTML = text.replace(/\n/g, '<br>'); // Preserves line breaks for user messages
    }
    if (id) msg.id = id;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight; 
}

function renderMarkdown(text) {
    // Convert Markdown to HTML
    let html = text
        // Headings
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert numbered lists
    // This regex finds blocks of numbered lines
    html = html.replace(/(\n?(\d+\..*))+/g, (match) => {
        const items = match.trim().split('\n');
        const listItems = items.map(item => `<li>${item.replace(/^\d+\.\s*/, '')}</li>`).join('');
        return `<ol>${listItems}</ol>`;
    });

    // Final pass for remaining newlines
    return html.replace(/\n/g, '<br>');
}

// The actual API Call
async function callChatAPI(userText) {
    // PASTE YOUR ACTUAL KEY HERE
    // Note: Vanilla HTML/JS cannot read .env files natively.
    // Paste your OpenRouter API key inside the quotes below.
    const url = '/api/chat';

    // Calculate current stats to feed to the AI silently
    const inc = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amt, 0);
    const exp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amt, 0);
    const bal = inc - exp;
    const userName = currentUser ? currentUser.name.split(' ')[0] : 'Guest';
    
    // The "System Prompt" tells the AI who it is and gives it the user's data
    const systemPrompt = `You are FinAI, a helpful financial assistant inside the MoneyMetrics Pro app.
    The user's name is ${userName}. Their current financial state is: Total Income: ₹${inc}, Total Expenses: ₹${exp}, Net Balance: ₹${bal}.
    Your responses MUST be formatted using simple Markdown.
    - For main topics or titles, use a Level 3 heading (e.g., '### Your Financial Summary').
    - For sub-topics or important terms, use bold (e.g., '**Savings Rate**').
    - For lists of items, use a numbered list (e.g., '1. First item.').
    Keep your answers concise, friendly, and well-structured for a chat UI.`;

    const payload = {
        model: "openai/gpt-oss-120b:free",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userText }
        ]
    };

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    if (data.error) {
        throw new Error(data.error.message);
    }
    return data.content;
}
// ─── INIT ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('txDate').valueAsDate = new Date();
    // Check existing session
    if (currentUser) {
        loginUser(currentUser);
    }
    document.addEventListener('keydown', e => { if (e.ctrlKey && e.key === 'p') { e.preventDefault(); exportPDF(); } });
    // Close alert modal on outside click
    document.getElementById('alertModal').addEventListener('click', function (e) { if (e.target === this) closeAlerts(); });
});