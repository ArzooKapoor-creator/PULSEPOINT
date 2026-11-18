/**
 * PULSEPOINT - SURVEY SCRIPT (BEGINNER FRIENDLY)
 * 
 * What this file does:
 * 1. Updates a progress bar as the student answers questions.
 * 2. Checks if all questions are answered before submitting.
 * 3. Saves the answers in browser localStorage:
 *    - In "pulsepoint_simple_data": Stores all submissions for community stats.
 *    - In "pulsepoint_my_last_submission": Stores YOUR specific submission so you can view your personal results alone!
 * 4. Redirects to dashboard.html to view your results.
 */

document.addEventListener("DOMContentLoaded", function () {
  
  // Find our form and inputs from the HTML
  const form = document.getElementById("healthSurveyForm");
  const progressBar = document.getElementById("formProgressBar");
  const progressText = document.getElementById("progressText");
  const radioButtons = document.querySelectorAll('input[type="radio"]');

  const totalQuestions = 4;

  // -------------------------------------------------------------
  // FUNCTION: Update the progress bar when user clicks an answer
  // -------------------------------------------------------------
  function updateProgress() {
    const answeredSleep = document.querySelector('input[name="sleep"]:checked');
    const answeredScreen = document.querySelector('input[name="screen"]:checked');
    const answeredWater = document.querySelector('input[name="water"]:checked');
    const answeredStress = document.querySelector('input[name="stress"]:checked');

    let answeredCount = 0;
    if (answeredSleep) answeredCount++;
    if (answeredScreen) answeredCount++;
    if (answeredWater) answeredCount++;
    if (answeredStress) answeredCount++;

    const percent = Math.round((answeredCount / totalQuestions) * 100);

    progressBar.style.width = percent + "%";
    progressText.innerText = percent + "% Completed (" + answeredCount + " of " + totalQuestions + " answered)";
  }

  // Listen for clicks on any radio button to update the progress bar
  radioButtons.forEach(function (radio) {
    radio.addEventListener("change", updateProgress);
  });

  // -------------------------------------------------------------
  // FUNCTION: Handle form submission when user clicks "Submit"
  // -------------------------------------------------------------
  form.addEventListener("submit", function (event) {
    // Prevent the page from automatically refreshing
    event.preventDefault();

    // 1. Get the selected values from each question
    const sleepInput = document.querySelector('input[name="sleep"]:checked');
    const screenInput = document.querySelector('input[name="screen"]:checked');
    const waterInput = document.querySelector('input[name="water"]:checked');
    const stressInput = document.querySelector('input[name="stress"]:checked');

    // 2. Validation check: Ensure the user didn't leave any blank
    if (!sleepInput || !screenInput || !waterInput || !stressInput) {
      alert("Please answer all 4 questions before submitting!");
      return;
    }

    // 3. Create a clean JavaScript object for this response
    // Generates a random anonymous ID (e.g. #PL-4821)
    const randomId = "PL-" + Math.floor(1000 + Math.random() * 9000);

    const newResponse = {
      id: randomId,
      sleep: sleepInput.value,     // e.g., "5-6 hrs", "7-8 hrs"
      screen: screenInput.value,   // e.g., "Yes", "No"
      water: waterInput.value,     // e.g., "<1 Liter", "1-2 Liters", "2L+"
      stress: stressInput.value,   // e.g., "Low", "Moderate", "High"
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // 4. Save to localStorage:
    // A. All Community Submissions list
    let allResponses = JSON.parse(localStorage.getItem("pulsepoint_simple_data")) || [];
    allResponses.push(newResponse);
    localStorage.setItem("pulsepoint_simple_data", JSON.stringify(allResponses));

    // B. Save as "My Latest Submission" so you can view your personal result alone!
    localStorage.setItem("pulsepoint_my_last_submission", JSON.stringify(newResponse));

    // 5. Show success message and redirect directly to dashboard
    alert("Thank you! Your survey has been submitted.\n\nYour Anonymous ID is #" + randomId + ".\nRedirecting to view your personal results...");
    window.location.href = "dashboard.html";
  });

});
