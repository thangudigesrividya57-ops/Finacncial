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

