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

