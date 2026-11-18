/**
 * PULSEPOINT - DASHBOARD SCRIPT (BEGINNER FRIENDLY)
 * 
 * What this file does:
 * 1. Shows YOUR personal survey submission alone (Sleep, Water, Stress, Screen + Health Tip).
 * 2. Reads all real survey submissions saved in localStorage (NO fake demo data).
 * 3. Calculates summary statistics (total count, averages).
 * 4. Draws modern CSS bar charts by adjusting style.width.
 * 5. Displays recent responses in a table.
 * 6. Provides a "Reset All Data" button to clear localStorage.
 */

document.addEventListener("DOMContentLoaded", function () {

  // -------------------------------------------------------------
  // 1. FUNCTION: Display YOUR Personal Submission Results Alone
  // -------------------------------------------------------------
  function renderMyPersonalResult() {
    const container = document.getElementById("myPersonalResultContainer");
    if (!container) return;

    // Read the user's specific last submission from localStorage
    const rawMyData = localStorage.getItem("pulsepoint_my_last_submission");

    if (!rawMyData) {
      // If the user has not submitted a survey on this device yet
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 2rem; background-color: #f8fafc; border: 1.5px dashed #cbd5e1;">
          <h3 style="color: #475569; margin-bottom: 0.5rem;">No Personal Submission Found</h3>
          <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 1.25rem;">
            You haven't submitted a survey from this browser yet. Fill out the 1-minute survey to view your personalized results here!
          </p>
          <a href="survey.html" class="btn btn-primary btn-sm">Take Survey Now &rarr;</a>
        </div>
      `;
      return;
    }

    // Parse the JSON string into an object
    const mySubmission = JSON.parse(rawMyData);

    // Generate personalized wellness tips based on the user's answers
    let wellnessTips = [];
    if (mySubmission.sleep === "Under 5 hrs") {
      wellnessTips.push("⚠️ <strong>Sleep Alert:</strong> Under 5 hours is a significant deficit. Aim for at least 7 hours to restore cognitive function.");
    } else if (mySubmission.sleep === "7-8 hrs") {
      wellnessTips.push("🌟 <strong>Great Sleep:</strong> 7-8 hours is the recommended golden standard for college students.");
    }

    if (mySubmission.screen === "Yes") {
      wellnessTips.push("📱 <strong>Screen Habit:</strong> Using screens right before bed suppresses melatonin. Try reading a physical book 20 mins before sleeping.");
    }

    if (mySubmission.water === "Less than 1L") {
      wellnessTips.push("💧 <strong>Hydration Notice:</strong> You're drinking under 1L. Keeping a refillable water bottle at your study desk can help.");
    } else if (mySubmission.water === "2L or more") {
      wellnessTips.push("💧 <strong>Hydration Goal Met:</strong> You are meeting the healthy 2L+ daily intake target!");
    }

    if (mySubmission.stress === "High") {
      wellnessTips.push("🧘 <strong>Stress Management:</strong> You reported high workload stress. Take regular 5-minute stretch breaks and don't hesitate to talk to campus counselors.");
    }

    // Build the "Your Results" HTML card
    container.innerHTML = `
      <div class="my-result-card">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <span class="badge" style="background-color: #0d9488; color: #ffffff;">Your Personal Submission</span>
            <h2 style="font-size: 1.4rem; color: #0f172a; margin-top: 0.3rem;">Your Health Profile</h2>
          </div>
          <div style="font-size: 0.85rem; color: #64748b; background: #ffffff; padding: 0.3rem 0.75rem; border-radius: 6px; border: 1px solid #ccfbf1;">
            Anonymous ID: <strong style="color: #0d9488;">#${mySubmission.id}</strong> (Logged at ${mySubmission.submittedAt})
          </div>
        </div>

        <!-- 4 Answer Cards for You -->
        <div class="my-result-grid">
          <div class="my-result-item">
            <span>Nightly Sleep</span>
            <strong>${mySubmission.sleep}</strong>
          </div>
          <div class="my-result-item">
            <span>Bed Screen Time</span>
            <strong>${mySubmission.screen === 'Yes' ? 'Active in Bed' : 'No Devices'}</strong>
          </div>
          <div class="my-result-item">
            <span>Daily Water</span>
            <strong>${mySubmission.water}</strong>
          </div>
          <div class="my-result-item">
            <span>Current Stress</span>
            <strong>${mySubmission.stress}</strong>
          </div>
        </div>

        <!-- Personalized Feedback Box -->
        <div class="feedback-tip">
          <div style="font-weight: 700; margin-bottom: 0.3rem; color: #0d9488;">💡 Your Personalized Insights:</div>
          <ul style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.88rem;">
            ${wellnessTips.map(function(tip) { return '<li>' + tip + '</li>'; }).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // 2. FUNCTION: Load all REAL responses from browser localStorage
  // -------------------------------------------------------------
  function getResponses() {
    const rawData = localStorage.getItem("pulsepoint_simple_data");
    // Returns ONLY real submissions from localStorage. No demo data!
    if (!rawData) {
      return [];
    }
    return JSON.parse(rawData);
  }

  // -------------------------------------------------------------
  // 3. FUNCTION: Update Community Dashboard (Totals, Bars & Table)
  // -------------------------------------------------------------
  function renderDashboard() {
    // 1. Render personal submission first
    renderMyPersonalResult();

    // 2. Render community aggregated stats
    const data = getResponses();
    const total = data.length;

    // --- A. Top Summary Cards ---
    document.getElementById("kpiTotal").innerText = total;

    // If no submissions exist in localStorage yet
    if (total === 0) {
      document.getElementById("kpiHydration").innerText = "0%";
      document.getElementById("kpiStress").innerText = "No Data";
      document.getElementById("kpiSleep").innerText = "No Data";
      
      // Reset all bars to 0%
      updateBar("barSleepUnder5", "pctSleepUnder5", 0, 0);
      updateBar("barSleep5to6", "pctSleep5to6", 0, 0);
      updateBar("barSleep7to8", "pctSleep7to8", 0, 0);
      updateBar("barSleep9plus", "pctSleep9plus", 0, 0);

      updateBar("barStressLow", "pctStressLow", 0, 0);
      updateBar("barStressMod", "pctStressMod", 0, 0);
      updateBar("barStressHigh", "pctStressHigh", 0, 0);

      updateBar("barWaterLess1L", "pctWaterLess1L", 0, 0);
      updateBar("barWater1to2L", "pctWater1to2L", 0, 0);
      updateBar("barWater2LPlus", "pctWater2LPlus", 0, 0);

      document.getElementById("responsesTableBody").innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: #64748b; padding: 2rem;">
            No survey submissions found yet. Click <strong>"Submit New Survey"</strong> above to record your data!
          </td>
        </tr>
      `;
      return;
    }

    // --- B. Count Tally Variables ---
    let sleepUnder5 = 0;
    let sleep5to6 = 0;
    let sleep7to8 = 0;
    let sleep9plus = 0;

    let stressLow = 0;
    let stressMod = 0;
    let stressHigh = 0;

    let waterLess1L = 0;
    let water1to2L = 0;
    let water2LPlus = 0;

    // Loop through real responses and count
    data.forEach(function (item) {
      // Sleep
      if (item.sleep === "Under 5 hrs") sleepUnder5++;
      else if (item.sleep === "5-6 hrs") sleep5to6++;
      else if (item.sleep === "7-8 hrs") sleep7to8++;
      else if (item.sleep === "9+ hrs") sleep9plus++;

      // Stress
      if (item.stress === "Low") stressLow++;
      else if (item.stress === "Moderate") stressMod++;
      else if (item.stress === "High") stressHigh++;

      // Water
      if (item.water === "Less than 1L") waterLess1L++;
      else if (item.water === "1-2 Liters") water1to2L++;
      else if (item.water === "2L or more") water2LPlus++;
    });

    // --- C. Update KPI Top Numbers ---
    const hydrationPercent = Math.round((water2LPlus / total) * 100);
    document.getElementById("kpiHydration").innerText = hydrationPercent + "%";
    
    // Most common stress
    let dominantStress = "Low";
    if (stressHigh >= stressMod && stressHigh >= stressLow) dominantStress = "High";
    else if (stressMod >= stressLow) dominantStress = "Moderate";
    document.getElementById("kpiStress").innerText = dominantStress;

    // Most common sleep
    let dominantSleep = "7-8 hrs";
    if (sleepUnder5 >= sleep5to6 && sleepUnder5 >= sleep7to8 && sleepUnder5 >= sleep9plus) dominantSleep = "<5 hrs";
    else if (sleep5to6 >= sleep7to8 && sleep5to6 >= sleep9plus) dominantSleep = "5-6 hrs";
    else if (sleep9plus >= sleep7to8) dominantSleep = "9+ hrs";
    document.getElementById("kpiSleep").innerText = dominantSleep;

    // --- D. Update Sleep CSS Bar Charts ---
    updateBar("barSleepUnder5", "pctSleepUnder5", sleepUnder5, total);
    updateBar("barSleep5to6", "pctSleep5to6", sleep5to6, total);
    updateBar("barSleep7to8", "pctSleep7to8", sleep7to8, total);
    updateBar("barSleep9plus", "pctSleep9plus", sleep9plus, total);

    // --- E. Update Stress CSS Bar Charts ---
    updateBar("barStressLow", "pctStressLow", stressLow, total);
    updateBar("barStressMod", "pctStressMod", stressMod, total);
    updateBar("barStressHigh", "pctStressHigh", stressHigh, total);

    // --- F. Update Water CSS Bar Charts ---
    updateBar("barWaterLess1L", "pctWaterLess1L", waterLess1L, total);
    updateBar("barWater1to2L", "pctWater1to2L", water1to2L, total);
    updateBar("barWater2LPlus", "pctWater2LPlus", water2LPlus, total);

    // --- G. Populate Table with Real Data ---
    const tableBody = document.getElementById("responsesTableBody");
    tableBody.innerHTML = "";

    // Show latest submissions first
    const reversedData = data.slice().reverse();

    reversedData.forEach(function (row) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong style="color:#0d9488;">#${row.id}</strong></td>
        <td>${row.sleep}</td>
        <td>${row.water}</td>
        <td>${row.stress}</td>
        <td>${row.submittedAt}</td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // -------------------------------------------------------------
  // HELPER FUNCTION: Calculates % and sets CSS width of a bar
  // -------------------------------------------------------------
  function updateBar(barId, textId, count, total) {
    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
    const barEl = document.getElementById(barId);
    const textEl = document.getElementById(textId);

    if (barEl) {
      barEl.style.width = percent + "%";
    }
    if (textEl) {
      textEl.innerText = count + " votes (" + percent + "%)";
    }
  }

  // -------------------------------------------------------------
  // 4. BUTTON: Clear All Data (So student can reset localStorage)
  // -------------------------------------------------------------
  const btnClear = document.getElementById("btnClearData");
  if (btnClear) {
    btnClear.addEventListener("click", function () {
      if (confirm("Are you sure you want to clear all survey data from your browser?")) {
        localStorage.removeItem("pulsepoint_simple_data");
        localStorage.removeItem("pulsepoint_my_last_submission");
        renderDashboard();
        alert("All local data has been cleared!");
      }
    });
  }

  // Initial render when the dashboard page loads
  renderDashboard();
});
