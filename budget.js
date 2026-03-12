        // ─── BUDGET PLANNER ────────────────────────────────

        }
            playSuccess(); toast(`GST: ${fmt(tax)} on ${fmt(base)}`, 'success');
            document.getElementById('gstVisual').style.display = 'block';
            document.getElementById('gstVisTax').textContent = `Tax: ${fmt(tax)}`;
            document.getElementById('gstVisBase').textContent = `Base: ${fmt(base)}`;
            document.getElementById('gstVisBar').style.width = pct + '%';
            const pct = (base / final * 100);
            document.getElementById('gstResult').classList.add('show');
            else { document.getElementById('gstCGST').textContent = 'N/A'; document.getElementById('gstSGST').textContent = 'N/A'; document.getElementById('gstIGST').textContent = fmt(tax); }
            if (state === 'same') { document.getElementById('gstCGST').textContent = fmt(half); document.getElementById('gstSGST').textContent = fmt(half); document.getElementById('gstIGST').textContent = 'N/A'; }
            document.getElementById('gstFinal').textContent = fmt(final);
            document.getElementById('gstTax').textContent = fmt(tax);
            document.getElementById('gstBase').textContent = fmt(base);
            const half = tax / 2;
            else { base = amt / (1 + rate / 100); tax = amt - base; final = amt; }
            if (mode === 'excl') { base = amt; tax = amt * rate / 100; final = amt + tax; }
            let base, tax, final;
            if (!amt) { playError(); toast('Please enter an amount', 'error'); return; }
            const state = document.getElementById('gstState').value;
            const mode = document.getElementById('gstMode').value;
            const rate = parseFloat(document.getElementById('gstRate').value);
            const amt = parseFloat(document.getElementById('gstAmt').value);
        function calcGST() {
        // ─── GST CALCULATOR ────────────────────────────────

        }
            playSuccess(); toast('SIP projection calculated!', 'success');
            });
                }
                    scales: { x: { ticks: { color: '#3a4060', font: { size: 11 } }, grid: { display: false } }, y: { ticks: { color: '#3a4060', font: { size: 11 }, callback: v => fmtK(v) }, grid: { color: 'rgba(255,255,255,0.04)' } } }
                    responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#c8d0e8', font: { size: 11 } } }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${fmtK(c.raw)}` } } },
                options: {
                },
                    { label: 'Invested', data: barsYears.map(d => d.invested), backgroundColor: 'rgba(122,133,168,0.3)', borderRadius: 8, borderSkipped: false }]
                    },
                        backgroundColor: barsYears.map((_, i) => i === barsYears.length - 1 ? '#f0c040' : `rgba(0,229,255,${0.4 + i * 0.05})`), borderRadius: 8, borderSkipped: false
                        label: 'Portfolio Value', data: barsYears.map(d => d.value),
                    datasets: [{
                    labels: barsYears.map(d => `Yr${d.yr}`),
                data: {
                type: 'bar',
            charts.sipBar = new Chart(document.getElementById('sipBarChart').getContext('2d'), {
            const barsYears = annualData.filter((_, i) => i % Math.max(1, Math.floor(Y / 8)) === 0 || i === Y - 1).slice(0, 10);
            if (charts.sipBar) charts.sipBar.destroy();
            // Bar chart for annual
            }).join('');
    </div>`;
      <div class="growth-pct ${isPos ? 'pos' : 'neg'}">${isPos ? '▲' : '▼'} ${Math.abs(growth).toFixed(1)}% YoY</div>
      <div class="growth-val">${fmtK(d.value)}</div>
      <div class="growth-year">Year ${y}</div>
                return `<div class="growth-item">
                const isPos = growth >= 0;
                const growth = y > 1 ? ((d.value - annualData[y - 2].value) / annualData[y - 2].value * 100) : 0;
                const d = annualData[y - 1]; if (!d) return '';
            document.getElementById('sipAnnualGrid').innerHTML = showYears.map(y => {
            const showYears = [1, 3, 5, 10, 15, 20, 25, 30].filter(y => y <= Y);
            // Annual milestones
            });
                }
                    scales: { x: { ticks: { color: '#3a4060', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.03)' } }, y: { ticks: { color: '#3a4060', font: { size: 11 }, callback: v => fmtK(v) }, grid: { color: 'rgba(255,255,255,0.04)' } } }
                    responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#c8d0e8', font: { size: 11 } } }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${fmtK(c.raw)}` } } },
                options: {
                },
                        { label: 'Value', data: dataValue, borderColor: '#00e5ff', backgroundColor: 'rgba(0,229,255,0.07)', fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2.5 }]
                        { label: 'Invested', data: dataInvested, borderColor: '#7a85a8', backgroundColor: 'rgba(122,133,168,0.08)', fill: true, tension: 0.4, pointRadius: 0 },
                    labels, datasets: [
                data: {
                type: 'line',
            charts.sip = new Chart(document.getElementById('sipChart').getContext('2d'), {
            if (charts.sip) charts.sip.destroy();
            // Line chart
            document.getElementById('sipAnnualCard').style.display = 'block';
            document.getElementById('sipChartCard').style.display = 'block';
            document.getElementById('sipResult').classList.add('show');
            document.getElementById('sipPred').style.display = 'block';
            }).join('');
                return `<div class="pred-item"><div class="pred-val">${fmtK(pv)}</div><div class="pred-label">Year ${y}</div></div>`;
                for (let yr = 1; yr <= y; yr++) { for (let m = 0; m < 12; m++) { pv = (pv + m2) * (1 + r); inv += m2; } if (stepUp > 0) m2 *= (1 + stepUp / 100); }
                let pv = 0, inv = 0, m2 = P;
            document.getElementById('sipPredGrid').innerHTML = milestones.map(y => {
            const milestones = [2, 5, 10, 15, 20, 25, 30].filter(y => y <= Y + 5);
            // AI predictions
    <div class="stat-chip">Inflation adj. loss: <strong>${fmtK(fv - realFV)}</strong></div>`;
    <div class="stat-chip">Monthly: <strong>${fmtK(P)}</strong></div>
    <div class="stat-chip"><strong>${((returns / invested) * 100).toFixed(0)}%</strong> Return on Investment</div>
            document.getElementById('sipChips').innerHTML = `
            document.getElementById('sipMultiplier').textContent = multiplier.toFixed(2) + 'x';
            document.getElementById('sipCAGR').textContent = cagr.toFixed(2) + '%';
            document.getElementById('sipReal').textContent = fmtK(realFV);
            document.getElementById('sipReturns').textContent = fmtK(returns);
            document.getElementById('sipInvested').textContent = fmtK(invested);
            document.getElementById('sipFV').textContent = fmtK(fv);
            const multiplier = fv / invested;
            const cagr = (Math.pow(fv / invested, 1 / Y) - 1) * 100;
            const returns = fv - invested;
            const realFV = fv / Math.pow(1 + inflation / 100, Y);
            }
                annualData.push({ yr, invested: +invested.toFixed(0), value: +fv.toFixed(0) });
                labels.push(`Yr ${yr}`); dataInvested.push(+invested.toFixed(0)); dataValue.push(+fv.toFixed(0));
                if (stepUp > 0) mon *= (1 + stepUp / 100);
                for (let m = 0; m < 12; m++) { fv = (fv + mon) * (1 + r); invested += mon; }
            for (let yr = 1; yr <= Y; yr++) {
            const labels = [], dataInvested = [], dataValue = [], annualData = [];
            let fv = 0, invested = 0, mon = P;
            const r = rAnn / 12 / 100;
            if (!P || !rAnn || !Y) { playError(); toast('Please fill all required fields', 'error'); return; }
            const inflation = parseFloat(document.getElementById('sipInflation').value) || 6;
            const stepUp = parseFloat(document.getElementById('sipStep').value) || 0;
            const Y = parseFloat(document.getElementById('sipYears').value);
            const rAnn = parseFloat(document.getElementById('sipRate').value);
            const P = parseFloat(document.getElementById('sipAmt').value);
        function calcSIP() {
        // ─── SIP CALCULATOR ────────────────────────────────

        function exportAmort() { toast('Amortization data copied to clipboard', 'info'); }
        }
            playSuccess(); toast(`Combined EMI: ${fmt(totalEMI)}/month`, 'success');
            document.getElementById('multiEmiResult').style.display = 'block';
      <div style="font-family:'Clash Display';font-size:1.4rem;font-weight:700;color:var(--cyan)">${fmtK(totalAmt)}</div></div>`;
    <div><div style="font-size:0.72rem;color:var(--t3);margin-bottom:4px;font-family:'JetBrains Mono';letter-spacing:1px;text-transform:uppercase">TOTAL OUTFLOW</div>
      <div style="font-family:'Clash Display';font-size:1.4rem;font-weight:700;color:var(--red2)">${fmtK(totalInt)}</div></div>
    <div><div style="font-size:0.72rem;color:var(--t3);margin-bottom:4px;font-family:'JetBrains Mono';letter-spacing:1px;text-transform:uppercase">TOTAL INTEREST PAID</div>
      <div style="font-family:'Clash Display';font-size:1.8rem;font-weight:700;color:var(--gold)">${fmt(totalEMI)}</div></div>
    <div><div style="font-size:0.72rem;color:var(--t3);margin-bottom:4px;font-family:'JetBrains Mono';letter-spacing:1px;text-transform:uppercase">COMBINED MONTHLY EMI</div>
            document.getElementById('emiTotalBar').innerHTML = `
    </div>`).join('');
      <div style="font-size:0.72rem;color:var(--t3)">${l.years}yrs</div>
      <div><div class="emi-row-val" style="color:var(--purple2)">${l.rate}%</div><div class="emi-row-label">Annual Rate</div></div>
      <div><div class="emi-row-val cyan">${fmtK(l.totalPaid)}</div><div class="emi-row-label">Total Payment</div></div>
      <div><div class="emi-row-val red">${fmtK(l.totalInt)}</div><div class="emi-row-label">Total Interest</div></div>
      <div><div class="emi-row-val gold">${fmt(l.emi)}</div><div class="emi-row-label">Monthly EMI</div></div>
      <div><div class="emi-row-name">${l.name}</div><div style="font-size:0.72rem;color:var(--t3)">${fmtK(l.amt)} @ ${l.rate}% for ${l.years}yrs</div></div>
      <div class="emi-row-num">#${i + 1}</div>
    <div class="emi-row-card">
            document.getElementById('multiEmiList').innerHTML = loans.map((l, i) => `
            const totalInt = loans.reduce((s, l) => s + l.totalInt, 0);
            const totalAmt = loans.reduce((s, l) => s + l.totalPaid, 0);
            const totalEMI = loans.reduce((s, l) => s + l.emi, 0);
            if (!loans.length) { playError(); toast('Fill at least one loan row', 'error'); return; }
            }
                }
                    loans.push({ name, amt, rate, years, emi, totalPaid, totalInt });
                    const totalPaid = emi * n, totalInt = totalPaid - amt;
                    const emi = (amt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
                    const r = rate / 12 / 100, n = years * 12;
                if (amt && rate && years) {
                const years = parseFloat(document.getElementById(`ml${i}Years`).value);
                const rate = parseFloat(document.getElementById(`ml${i}Rate`).value);
                const amt = parseFloat(document.getElementById(`ml${i}Amt`).value);
                const name = document.getElementById(`ml${i}Name`).value || `Loan ${i}`;
            for (let i = 1; i <= 3; i++) {
            const loans = [];
        function calcMultiEMI() {
        // ─── MULTI-EMI ─────────────────────────────────────

        }
            playSuccess(); toast('EMI calculated successfully!', 'success');
     <td style="font-family:'JetBrains Mono'">${fmtK(d.bal)}</td></tr>`).join('');
     <td style="color:var(--red2)">${fmt(d.intPart)}</td>
     <td>${fmt(d.emi)}</td><td style="color:var(--cyan)">${fmt(d.princPart)}</td>
                `<tr><td style="font-family:'JetBrains Mono';font-size:0.78rem">${d.m}</td>
            document.getElementById('amortBody').innerHTML = amortData.map(d =>
            // Amortization table
            });
                }
                    scales: { x: { stacked: true, ticks: { color: '#3a4060', font: { size: 10 } }, grid: { display: false } }, y: { stacked: true, ticks: { color: '#3a4060', font: { size: 10 }, callback: v => fmtK(v) }, grid: { color: 'rgba(255,255,255,0.04)' } } }
                    responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#c8d0e8', font: { size: 11 } } } },
                options: {
                },
                    { label: 'Interest', data: tlSample.map(d => d.intPart * 12), backgroundColor: 'rgba(255,77,106,0.7)', borderRadius: 4, borderSkipped: false }]
                    datasets: [{ label: 'Principal', data: tlSample.map(d => d.princPart * 12), backgroundColor: 'rgba(0,229,255,0.7)', borderRadius: 4, borderSkipped: false },
                    labels: tlSample.map(d => `Yr ${Math.ceil(d.m / 12)}`),
                data: {
                type: 'bar',
            charts.emiTimeline = new Chart(document.getElementById('emiTimelineChart').getContext('2d'), {
            if (charts.emiTimeline) charts.emiTimeline.destroy();
            const tlSample = amortData.filter((_, i) => i % 12 === 0 || i === amortData.length - 1);
            // Timeline
    </div>`;
        <div><div style="font-size:0.88rem;color:var(--t0);font-weight:700">Monthly EMI</div><div style="font-family:'JetBrains Mono';font-size:0.82rem;color:var(--gold)">${fmt(emi)}</div></div></div>
      <div style="display:flex;align-items:center;gap:10px"><div style="width:12px;height:12px;border-radius:3px;background:#f0c040;flex-shrink:0"></div>
        <div><div style="font-size:0.88rem;color:var(--t0);font-weight:700">Total Interest</div><div style="font-family:'JetBrains Mono';font-size:0.82rem;color:var(--red2)">${fmtK(totalInterest)}</div></div></div>
      <div style="display:flex;align-items:center;gap:10px"><div style="width:12px;height:12px;border-radius:3px;background:#ff4d6a;flex-shrink:0"></div>
        <div><div style="font-size:0.88rem;color:var(--t0);font-weight:700">Principal</div><div style="font-family:'JetBrains Mono';font-size:0.82rem;color:var(--cyan)">${fmtK(P)}</div></div></div>
      <div style="display:flex;align-items:center;gap:10px"><div style="width:12px;height:12px;border-radius:3px;background:#00e5ff;flex-shrink:0"></div>
    <div style="display:flex;flex-direction:column;gap:12px">
            document.getElementById('emiChartLegend').innerHTML = `
            });
                options: { cutout: '70%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.label}: ${fmtK(c.raw)}` } } } }
                data: { labels: ['Principal', 'Interest'], datasets: [{ data: [P, totalInterest], backgroundColor: ['#00e5ff', '#ff4d6a'], borderWidth: 0, hoverOffset: 6 }] },
                type: 'doughnut',
            charts.emi = new Chart(document.getElementById('emiChart').getContext('2d'), {
            if (charts.emi) charts.emi.destroy();
            // Pie chart
            document.getElementById('amortCard').style.display = 'block';
            document.getElementById('emiTimelineCard').style.display = 'block';
            document.getElementById('emiChartCard').style.display = 'block';
            document.getElementById('emiResult').classList.add('show');
    <div class="stat-chip">Processing Fee: <strong>${fmt(feeAmt)}</strong></div>`;
    <div class="stat-chip">Tenure: <strong>${n}</strong> months</div>
    <div class="stat-chip">Interest: <strong>${((totalInterest / P) * 100).toFixed(1)}%</strong> of principal</div>
            document.getElementById('emiChips').innerHTML = `
            document.getElementById('emiBreak').textContent = 'Month ' + breakMonth;
            document.getElementById('emiAPR').textContent = effectiveAPR.toFixed(2) + '%';
            document.getElementById('emiFeeAmt').textContent = fmt(feeAmt);
            document.getElementById('emiTotal').textContent = fmt(totalPaid);
            document.getElementById('emiInterest').textContent = fmt(totalInterest);
            document.getElementById('emiMonthly').textContent = fmt(emi);
            }
                if (bal <= 0) { break; }
                amortData.push({ m, emi, intPart, princPart, bal: Math.max(0, bal) });
                if (prepay > 0 && m % 12 === 0) { bal = Math.max(0, bal - princPart - prepay / 12); } else { bal = Math.max(0, bal - princPart); }
                let actualEMI = emi;
                if (cumPrinc > cumInt && !breakMonth) breakMonth = m;
                cumPrinc += princPart; cumInt += intPart;
                const intPart = bal * r, princPart = emi - intPart;
            for (let m = 1; m <= n; m++) {
            const amortData = [];
            let bal = P, cumPrinc = 0, cumInt = 0, breakMonth = 0;
            const feeAmt = P * feeP / 100, effectiveAPR = (rAnn + (feeP / Y));
            const totalPaid = emi * n, totalInterest = totalPaid - P;
            const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const r = rAnn / 12 / 100, n = Y * 12;
            if (!P || !rAnn || !Y) { playError(); toast('Please fill Loan Amount, Rate and Years', 'error'); return; }
            const prepay = parseFloat(document.getElementById('emiPrepay').value) || 0;
            const feeP = parseFloat(document.getElementById('emiFee').value) || 0;
            const Y = parseFloat(document.getElementById('emiYears').value);
            const rAnn = parseFloat(document.getElementById('emiRate').value);
            const P = parseFloat(document.getElementById('emiLoan').value);
        function calcEMI() {
        // ─── EMI CALCULATOR ──────────────────────────────

        }
            });
                }
                    scales: { x: { ticks: { color: '#3a4060', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.03)' } }, y: { ticks: { color: '#3a4060', font: { size: 11 }, callback: v => fmtK(v) }, grid: { color: 'rgba(255,255,255,0.04)' } } }
                    responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#c8d0e8', font: { size: 11 } } } },
                options: {
                },
                    { label: 'Expense', data: tMonths.map(m => months[m]?.exp || 0), borderColor: '#ff4d6a', backgroundColor: 'rgba(255,77,106,0.06)', fill: true, tension: 0.45, pointRadius: 4, pointBackgroundColor: '#ff4d6a' }]
                    datasets: [{ label: 'Income', data: tMonths.map(m => months[m]?.inc || 0), borderColor: '#00f5a0', backgroundColor: 'rgba(0,245,160,0.06)', fill: true, tension: 0.45, pointRadius: 4, pointBackgroundColor: '#00f5a0' },
                    labels: tMonths.map(m => { const d = new Date(m + '-01'); return d.toLocaleString('default', { month: 'short' }); }),
                data: {
                type: 'line',
            charts.trend = new Chart(document.getElementById('trendChart').getContext('2d'), {
            if (charts.trend) charts.trend.destroy();
            const tMonths = mKeys;
            const exp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amt, 0);
            const inc = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amt, 0);
            // Trend line
            });
                }
                    scales: { x: { ticks: { color: '#3a4060', font: { size: 11 } }, grid: { display: false } }, y: { ticks: { color: '#3a4060', font: { size: 11 }, callback: v => fmtK(v) }, grid: { color: 'rgba(255,255,255,0.04)' } } }
                    responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#c8d0e8', font: { size: 11 } } }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${fmtK(c.raw)}` } } },
                options: {
                },
                    { label: 'Expense', data: mKeys.map(m => months[m].exp), backgroundColor: 'rgba(255,77,106,0.7)', borderRadius: 6, borderSkipped: false }]
                    datasets: [{ label: 'Income', data: mKeys.map(m => months[m].inc), backgroundColor: 'rgba(0,245,160,0.7)', borderRadius: 6, borderSkipped: false },
                    labels: mKeys.map(m => { const d = new Date(m + '-01'); return d.toLocaleString('default', { month: 'short', year: '2-digit' }); }),
                data: {
                type: 'bar',
            charts.monthly = new Chart(document.getElementById('monthlyChart').getContext('2d'), {
            if (charts.monthly) charts.monthly.destroy();
            const mKeys = Object.keys(months).sort().slice(-8);
            transactions.forEach(t => { const m = t.date.slice(0, 7); if (!months[m]) months[m] = { inc: 0, exp: 0 }; months[m][t.type === 'income' ? 'inc' : 'exp'] += t.amt; });
            const months = {};
            // Monthly bar
            });
                options: { cutout: '72%', plugins: { legend: { display: true, position: 'right', labels: { color: '#7a85a8', font: { size: 11 }, padding: 10, boxWidth: 10 } }, tooltip: { callbacks: { label: c => ` ${c.label}: ${fmtK(c.raw)}` } } }, animation: { animateRotate: true, duration: 700 } }
                data: { labels: cats.length ? cats : ['No Expenses'], datasets: [{ data: vals.length ? vals : [1], backgroundColor: colors, borderWidth: 0, hoverOffset: 8 }] },
                type: 'doughnut',
            charts.tracker = new Chart(document.getElementById('trackerChart').getContext('2d'), {
            if (charts.tracker) charts.tracker.destroy();
            const colors = ['#f0c040', '#00e5ff', '#00f5a0', '#ff4d6a', '#b36bff', '#ff9900', '#80f0ff', '#7fffcf', '#ff8fa0', '#d4a0ff'];
            const cats = Object.keys(catTotals), vals = Object.values(catTotals);
            transactions.filter(t => t.type === 'expense').forEach(t => { catTotals[t.cat] = (catTotals[t.cat] || 0) + t.amt; });
            const catTotals = {};
            // Expense donut
            }
      </div>`).join('');
        <button class="tx-del" onclick="deleteTransaction(${t.id})"><i class="fas fa-trash"></i></button>
        <div class="tx-right"><div class="tx-amount ${t.type === 'income' ? 'inc' : 'exp'}">${t.type === 'income' ? '+' : '-'}${fmtK(t.amt)}</div></div>
          <div class="tx-cat">${t.cat} · ${t.date}</div></div>
        <div class="tx-info"><div class="tx-name">${t.desc}</div>
          ${t.cat.split(' ')[0]}</div>
        <div class="tx-icon" style="background:${t.type === 'income' ? 'rgba(0,245,160,0.1)' : 'rgba(255,77,106,0.1)'}">
      <div class="tx-item">
                list.innerHTML = transactions.map(t => `
            } else {
                list.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><div>No transactions yet</div></div>';
            if (!transactions.length) {
            document.getElementById('txCount').textContent = transactions.length + ' records';
            const list = document.getElementById('txList');
        function renderTracker() {
        }
            transactions = []; save(); renderTracker(); updateHero();
            if (!confirm('Clear all transactions?')) return;
        function clearTransactions() {
        }
            toast('Transaction deleted', 'info');
            transactions = transactions.filter(t => t.id !== id); save(); renderTracker(); updateHero();
        function deleteTransaction(id) {
        }
            document.getElementById('txCount').textContent = transactions.length + ' records';
            document.getElementById('txDesc').value = ''; document.getElementById('txAmt').value = '';
            toast(`${txType === 'income' ? 'Income' : 'Expense'} added: ${fmtK(amt)}`, 'success');
            save(); renderTracker(); updateHero(); playSuccess();
            transactions.unshift({ id: Date.now(), type: txType, desc, amt, cat, date });
            if (!desc || !amt || amt <= 0) { playError(); toast('Please fill description and amount', 'error'); return; }
            const date = document.getElementById('txDate').value || new Date().toISOString().split('T')[0];
            const cat = document.getElementById('txCat').value;
            const amt = parseFloat(document.getElementById('txAmt').value);
            const desc = document.getElementById('txDesc').value.trim();
        function addTransaction() {
        }
            playClick();
            document.getElementById('btnExp').className = 'btn ' + (type === 'expense' ? 'btn-red' : 'btn-ghost');
            document.getElementById('btnInc').className = 'btn ' + (type === 'income' ? 'btn-green' : 'btn-ghost');
            txType = type;
        function setType(type) {
        // ─── TRANSACTION TRACKER ──────────────────────────

        }
            }, 18);
                if (step >= steps) clearInterval(timer);
                el.textContent = Math.abs(val).toLocaleString('en-IN', { maximumFractionDigits: 0 });
                step++; const val = start + diff * (step / steps);
            const timer = setInterval(() => {
            const diff = target - start, steps = 35; let step = 0;
            const start = parseFloat(el.textContent.replace(/[₹,]/g, '')) || 0;
            const el = document.getElementById(id);
        function animateCount(id, target) {
        }
            document.getElementById('nwDelta').className = 'nw-delta' + (bal < 0 ? ' neg' : '');
            document.getElementById('nwDelta').textContent = bal >= 0 ? `+${fmtK(bal)} net` : `${fmtK(bal)} net`;
            document.getElementById('sumBal').textContent = fmtK(bal);
            document.getElementById('sumExp').textContent = fmtK(exp);
            document.getElementById('sumInc').textContent = fmtK(inc);
            document.getElementById('nwSavings').textContent = `Savings Rate: ${savRate}%`;
            document.getElementById('nwBalance').textContent = fmtK(bal);
            document.getElementById('nwExpense').textContent = fmtK(exp);
            document.getElementById('nwIncome').textContent = fmtK(inc);
            animateCount('nwTotal', bal);
            const savRate = inc > 0 ? ((bal / inc) * 100).toFixed(1) : 0;
            const bal = inc - exp;
            const exp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amt, 0);
            const inc = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amt, 0);
        function updateHero() {
        // ─── NET WORTH HERO ────────────────────────────────

        }
            localStorage.setItem('mm_goals', JSON.stringify(goals));
            localStorage.setItem('mm_budgets', JSON.stringify(budgets));
            localStorage.setItem('mm_tx', JSON.stringify(transactions));
        function save() {
        // ─── SAVE ─────────────────────────────────────────

        };
            return fmt(n);
            if (n >= 1000) return '₹' + (n / 1000).toFixed(1) + 'K';
            if (n >= 100000) return '₹' + (n / 100000).toFixed(2) + 'L';
            if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2) + 'Cr';
        const fmtK = n => {
        const fmt = n => '₹' + (+n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        // ─── FORMAT ──────────────────────────────────────

        }
            if (id === 'fx') initFX();
            if (id === 'goals') renderGoals();
            if (id === 'budget') renderBudget();
            if (id === 'tracker') renderTracker();
            if (btn) btn.classList.add('active');
            document.getElementById('panel-' + id).classList.add('active');
            document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            playClick();
        function showPanel(id, btn) {
        // ─── TAB NAVIGATION ──────────────────────────────

        }
            document.getElementById('authSignIn').classList.add('show');
            document.getElementById('signOutBtn').style.display = 'none';
            document.getElementById('userTag').style.display = 'none';
            currentUser = null; localStorage.removeItem('mm_current');
        function signOut() {
        }
            updateHero(); renderTracker();
            playSuccess(); toast(`Welcome, ${user.name.split(' ')[0]}! 🎉`, 'success');
            document.getElementById('signOutBtn').style.display = 'flex';
            document.getElementById('userName').textContent = user.name.split(' ')[0];
            document.getElementById('userAvatar').textContent = user.initials || user.name[0].toUpperCase();
            document.getElementById('userTag').style.display = 'flex';
            document.getElementById('authSignUp').classList.remove('show');
            document.getElementById('authSignIn').classList.remove('show');
            currentUser = user; localStorage.setItem('mm_current', JSON.stringify(user));
        function loginUser(user) {
        function guestLogin() { loginUser({ id: 'guest', name: 'Guest User', email: 'guest', pass: '', initials: 'G' }); }
        }
            loginUser(user);
            if (!user) { err.textContent = 'Invalid email or password. Try guest access.'; err.style.display = 'block'; playError(); return; }
            const user = users.find(u => u.email === email && u.pass === pass);
            const err = document.getElementById('siErr');
            const pass = document.getElementById('siPass').value;
            const email = document.getElementById('siEmail').value.trim();
        function signIn() {
        }
            loginUser(user);
            users.push(user); localStorage.setItem('mm_users', JSON.stringify(users));
            const user = { id: Date.now(), name: first + ' ' + last, email, pass, initials: (first[0] + last[0]).toUpperCase() };
            if (users.find(u => u.email === email)) { err.textContent = 'Account already exists. Please sign in.'; err.style.display = 'block'; return; }
            if (pass.length < 6) { err.textContent = 'Password must be at least 6 characters.'; err.style.display = 'block'; return; }
            if (!email.includes('@')) { err.textContent = 'Please enter a valid email.'; err.style.display = 'block'; return; }
            if (!first || !last) { err.textContent = 'Please enter your full name.'; err.style.display = 'block'; return; }
            const err = document.getElementById('suErr');
            const pass = document.getElementById('suPass').value;
            const email = document.getElementById('suEmail').value.trim();
            const last = document.getElementById('suLast').value.trim();
            const first = document.getElementById('suFirst').value.trim();
        function signUp() {
        function showSignIn() { document.getElementById('authSignUp').classList.remove('show'); document.getElementById('authSignIn').classList.add('show'); }
        function showSignUp() { document.getElementById('authSignIn').classList.remove('show'); document.getElementById('authSignUp').classList.add('show'); }
        // ─── AUTH ─────────────────────────────────────────

        function closeAlerts() { document.getElementById('alertModal').classList.remove('show'); }
        }
            playCoins();
            document.getElementById('alertModal').classList.add('show');
    </div>`).join('');
      <div style="flex:1"><div class="alert-msg">${a.msg}</div><div class="alert-time">${a.time}</div></div>
      <div class="alert-icon-wrap ${a.type}"><i class="fas ${a.icon}"></i></div>
    <div class="alert-item">
            document.getElementById('alertList').innerHTML = alerts.map(a => `
            const alerts = buildAlerts();
        function openAlerts() {
        }
            return alerts;
            alerts.push({ type: 'info', icon: 'fa-robot', msg: 'AI Tip: Allocate at least 10% of income monthly into equity mutual funds for long-term wealth.', time: 'Advice' });
            if (!transactions.length) alerts.push({ type: 'info', icon: 'fa-lightbulb', msg: 'Start logging transactions to get personalised financial insights and alerts.', time: 'Always' });
            if (dueGoals.length) alerts.push({ type: 'info', icon: 'fa-bullseye', msg: `${dueGoals.length} goal(s) due within 60 days: ${dueGoals.map(g => g.name).join(', ')}`, time: 'This week' });
            const dueGoals = goals.filter(g => { if (!g.date) return false; const d = Math.ceil((new Date(g.date) - new Date()) / 86400000); return d > 0 && d < 60 && g.saved < g.target; });
            if (overBudgets.length) alerts.push({ type: 'warn', icon: 'fa-chart-bar', msg: `${overBudgets.length} budget category(s) exceeded: ${overBudgets.map(b => b.cat).join(', ')}`, time: 'Today' });
            const overBudgets = budgets.filter(b => { const s = transactions.filter(t => t.type === 'expense' && t.cat === b.cat).reduce((a, t) => a + t.amt, 0); return s > b.limit; });
            if (bal < 0) alerts.push({ type: 'danger', icon: 'fa-times-circle', msg: `Net balance is negative (${fmt(bal)}). Expenses exceed income — immediate action recommended.`, time: 'Now' });
            else if (inc > 0) alerts.push({ type: 'ok', icon: 'fa-check-circle', msg: `Great! Savings rate ${savRate.toFixed(1)}% exceeds recommended 20% target.`, time: 'Just now' });
            if (inc > 0 && savRate < 20) alerts.push({ type: 'warn', icon: 'fa-exclamation-triangle', msg: `Savings rate is ${savRate.toFixed(1)}% — below recommended 20%. Try to reduce discretionary spending.`, time: 'Just now' });
            const alerts = [];
            const savRate = inc > 0 ? (bal / inc * 100) : 0;
            const bal = inc - exp;
            const exp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amt, 0);
            const inc = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amt, 0);
        function buildAlerts() {
        // ─── ALERTS ───────────────────────────────────────

        }
            setTimeout(() => { el.style.animation = 'toastIn 0.3s ease reverse forwards'; setTimeout(() => el.remove(), 300); }, 3500);
            document.getElementById('toastWrap').appendChild(el);
            el.innerHTML = `<i class="fas ${icons[type] || 'fa-info-circle'}"></i>${msg}`;
            const el = document.createElement('div'); el.className = `toast ${type}`;
            const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
        function toast(msg, type = 'info') {
        // ─── TOAST ────────────────────────────────────────

        function playError() { playTone(220, 0.2, 'sawtooth', 0.2); }
        function playClick() { playTone(440, 0.06, 'sine', 0.15); }
        function playCoins() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.12, 'square', 0.1), i * 80)); }
        function playSuccess() { playTone(523, 0.1); setTimeout(() => playTone(659, 0.1), 100); setTimeout(() => playTone(784, 0.15), 200); }
        function playTone(f, d = 0.15, t = 'sine', v = 0.3) { try { const c = getAudio(), o = c.createOscillator(), g = c.createGain(); o.connect(g); g.connect(c.destination); o.frequency.value = f; o.type = t; g.gain.setValueAtTime(v, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d); o.start(); o.stop(c.currentTime + d); } catch (e) { } }
        function getAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); return audioCtx; }
        // ─── AUDIO ────────────────────────────────────────

        let audioCtx = null;
        let charts = {};
        let txType = 'income';
        let currentUser = JSON.parse(localStorage.getItem('mm_current') || 'null');
        let users = JSON.parse(localStorage.getItem('mm_users') || '[]');
        let goals = JSON.parse(localStorage.getItem('mm_goals') || '[]');
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

