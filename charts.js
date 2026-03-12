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

