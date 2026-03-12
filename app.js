
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

        // ─── AUTH ─────────────────────────────────────────        const byId = (id) => document.getElementById(id);
        function loginUser(user) {
            currentUser = user; localStorage.setItem('mm_current', JSON.stringify(user));
            const userTag = byId('userTag');
            const signOutBtn = byId('signOutBtn');
            if (userTag) userTag.style.display = 'flex';
            if (byId('userAvatar')) byId('userAvatar').textContent = user.initials || user.name[0].toUpperCase();
            if (byId('userName')) byId('userName').textContent = user.name.split(' ')[0];
            if (signOutBtn) signOutBtn.style.display = 'flex';
            playSuccess(); toast(`Welcome, ${user.name.split(' ')[0]}! 🎉`, 'success');
            updateHero(); renderTracker();
        }
        function signOut() {
            currentUser = null; localStorage.removeItem('mm_current');
            const userTag = byId('userTag');
            const signOutBtn = byId('signOutBtn');
            if (userTag) userTag.style.display = 'none';
            if (signOutBtn) signOutBtn.style.display = 'none';
            window.location.href = 'signin.html';
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

        // ─── INIT ─────────────────────────────────────────
        document.addEventListener('DOMContentLoaded', () => {
            if (!currentUser) { window.location.href = 'signin.html'; return; }
            document.getElementById('txDate').valueAsDate = new Date();
            // Check existing session
            if (currentUser) {
                loginUser(currentUser);
            }
            document.addEventListener('keydown', e => { if (e.ctrlKey && e.key === 'p') { e.preventDefault(); exportPDF(); } });
            // Close alert modal on outside click
            document.getElementById('alertModal').addEventListener('click', function (e) { if (e.target === this) closeAlerts(); });
        });
    












