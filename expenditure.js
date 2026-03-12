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

        // ─── FX CONVERTER ──────────────────────────────────
        const FX_RATES_INR = { INR: 1, USD: 83.42, EUR: 90.15, GBP: 106.0, JPY: 0.557, SGD: 61.5, AED: 22.7, AUD: 54.2, CAD: 61.8, CHF: 93.5, CNY: 11.55, HKD: 10.65, SAR: 22.2, MYR: 17.65, THB: 2.31, ZAR: 4.42, NZD: 50.1, KWD: 270.8, BHD: 221.5, QAR: 22.9 };
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

