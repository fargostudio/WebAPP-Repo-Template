/**
 * Setup Wizard - Client-side Logic
 */

// State management
let currentStep = 1;
const totalSteps = 5;
const projectData = {
  projectName: '',
  projectDescription: '',
  adminEmail: '',
  adminPassword: '',
  adminName: '',
};

// ============================================================================
// Step Navigation
// ============================================================================

function updateProgress() {
  const steps = document.querySelectorAll('.step');
  const wizardSteps = document.querySelectorAll('.wizard-step');

  steps.forEach((step, index) => {
    const stepNumber = index + 1;
    step.classList.remove('active', 'completed');

    if (stepNumber < currentStep) {
      step.classList.add('completed');
    } else if (stepNumber === currentStep) {
      step.classList.add('active');
    }
  });

  wizardSteps.forEach((step, index) => {
    step.classList.remove('active');
    if (index + 1 === currentStep) {
      step.classList.add('active');
    }
  });
}

function nextStep() {
  if (currentStep < totalSteps) {
    currentStep++;
    updateProgress();
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    updateProgress();
  }
}

// ============================================================================
// Step 1: Prerequisites Check
// ============================================================================

async function checkPrerequisites() {
  const checkBtn = document.getElementById('checkPrereqBtn');
  const nextBtn = document.getElementById('nextBtn1');
  const prereqList = document.getElementById('prereqList');

  checkBtn.disabled = true;
  checkBtn.textContent = 'Checking...';
  prereqList.innerHTML = '<div class="loading">Checking prerequisites...</div>';

  try {
    const response = await fetch('/api/check-prerequisites');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to check prerequisites');
    }

    const checks = data.data.checks;
    let allPassed = true;

    prereqList.innerHTML = checks
      .map((check) => {
        if (!check.installed) allPassed = false;
        return `
        <div class="prereq-item">
          <div class="prereq-name">
            <strong>${check.name}</strong>
            ${check.version ? `<div style="font-size: 0.85rem; color: var(--text-muted);">Version: ${check.version}</div>` : ''}
          </div>
          <div class="prereq-status ${check.installed ? 'success' : 'error'}">
            ${check.installed ? '✓ Installed' : '✗ Not Found'}
          </div>
        </div>
      `;
      })
      .join('');

    if (allPassed) {
      nextBtn.disabled = false;
      prereqList.innerHTML += `
        <div class="success-box" style="margin-top: 20px;">
          <strong>✓ All prerequisites are met!</strong><br>
          You can proceed to the next step.
        </div>
      `;
    } else {
      prereqList.innerHTML += `
        <div class="error-box" style="margin-top: 20px;">
          <strong>✗ Some prerequisites are missing</strong><br>
          Please install the missing tools before continuing.
        </div>
      `;
    }

    checkBtn.textContent = 'Re-check Prerequisites';
    checkBtn.disabled = false;
  } catch (error) {
    prereqList.innerHTML = `
      <div class="error-box">
        <strong>Error checking prerequisites</strong><br>
        ${error.message}
      </div>
    `;
    checkBtn.textContent = 'Retry Check';
    checkBtn.disabled = false;
  }
}

// ============================================================================
// Step 2: Project Information
// ============================================================================

function validateProjectInfo() {
  const projectName = document.getElementById('projectName').value.trim();
  const projectDescription = document
    .getElementById('projectDescription')
    .value.trim();
  const errorDiv = document.getElementById('projectInfoError');
  const nextBtn = document.getElementById('nextBtn2');

  // Validate
  if (!projectName) {
    errorDiv.textContent = 'Project name is required';
    errorDiv.style.display = 'block';
    return false;
  }

  if (projectName.length < 3) {
    errorDiv.textContent = 'Project name must be at least 3 characters';
    errorDiv.style.display = 'block';
    return false;
  }

  // Save to state
  projectData.projectName = projectName;
  projectData.projectDescription = projectDescription;

  errorDiv.style.display = 'none';
  return true;
}

function handleProjectInfoNext() {
  if (validateProjectInfo()) {
    nextStep();
  }
}

// ============================================================================
// Step 3: Admin User
// ============================================================================

function validateAdminUser() {
  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPassword').value;
  const confirmPassword = document.getElementById('adminPasswordConfirm').value;
  const name = document.getElementById('adminName').value.trim();
  const errorDiv = document.getElementById('adminUserError');

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errorDiv.textContent = 'Please enter a valid email address';
    errorDiv.style.display = 'block';
    return false;
  }

  // Password validation
  if (!password || password.length < 8) {
    errorDiv.textContent = 'Password must be at least 8 characters';
    errorDiv.style.display = 'block';
    return false;
  }

  // Password confirmation
  if (password !== confirmPassword) {
    errorDiv.textContent = 'Passwords do not match';
    errorDiv.style.display = 'block';
    return false;
  }

  // Name validation
  if (!name || name.length < 2) {
    errorDiv.textContent = 'Name must be at least 2 characters';
    errorDiv.style.display = 'block';
    return false;
  }

  // Save to state
  projectData.adminEmail = email;
  projectData.adminPassword = password;
  projectData.adminName = name;

  errorDiv.style.display = 'none';
  return true;
}

function handleAdminUserNext() {
  if (validateAdminUser()) {
    nextStep();
    runSetup();
  }
}

// ============================================================================
// Step 4: Setup Execution
// ============================================================================

async function runSetup() {
  const progressContainer = document.getElementById('setupProgressContainer');

  try {
    // Show initial progress
    updateSetupProgress([
      { step: 'Preparing setup...', status: 'running' },
      { step: 'Install dependencies', status: 'pending' },
      { step: 'Start Docker services', status: 'pending' },
      { step: 'Setup database', status: 'pending' },
      { step: 'Create admin user', status: 'pending' },
      { step: 'Generate configuration', status: 'pending' },
    ]);

    // Make API call
    const response = await fetch('/api/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectName: projectData.projectName,
        projectDescription: projectData.projectDescription,
        adminEmail: projectData.adminEmail,
        adminPassword: projectData.adminPassword,
        adminName: projectData.adminName,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Setup failed');
    }

    // Update progress based on results
    const results = data.data.steps;
    const progressSteps = results.map((step) => ({
      step: step.name,
      status: step.success ? 'success' : 'error',
      message: step.message,
    }));

    updateSetupProgress(progressSteps);

    // Check if all succeeded
    const allSuccess = results.every((step) => step.success);

    if (allSuccess) {
      // Store credentials for final step
      window.setupCredentials = {
        adminEmail: projectData.adminEmail,
        adminPassword: projectData.adminPassword,
        frontendUrl: data.data.urls?.frontend || 'http://localhost:5173',
        backendUrl: data.data.urls?.backend || 'http://localhost:5000',
      };

      // Auto-advance to completion
      setTimeout(() => {
        nextStep();
        showCompletionInfo();
      }, 2000);
    } else {
      progressContainer.innerHTML += `
        <div class="error-box" style="margin-top: 20px;">
          <strong>Setup encountered errors</strong><br>
          Please check the messages above and try again, or set up manually.
        </div>
      `;
    }
  } catch (error) {
    progressContainer.innerHTML = `
      <div class="error-box">
        <strong>Setup Failed</strong><br>
        ${error.message}
      </div>
    `;
  }
}

function updateSetupProgress(steps) {
  const progressContainer = document.getElementById('setupProgressContainer');

  progressContainer.innerHTML = steps
    .map((step) => {
      let icon = '';
      if (step.status === 'running') {
        icon = '<div class="spinner"></div>';
      } else if (step.status === 'success') {
        icon = '<span style="color: var(--success);">✓</span>';
      } else if (step.status === 'error') {
        icon = '<span style="color: var(--error);">✗</span>';
      } else {
        icon = '<span style="color: var(--text-muted);">○</span>';
      }

      return `
      <div class="progress-item ${step.status}">
        <div class="progress-icon">${icon}</div>
        <div style="flex: 1;">
          <div><strong>${step.step}</strong></div>
          ${step.message ? `<div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">${step.message}</div>` : ''}
        </div>
      </div>
    `;
    })
    .join('');
}

// ============================================================================
// Step 5: Completion
// ============================================================================

function showCompletionInfo() {
  const credentialsDiv = document.getElementById('credentialsInfo');
  const nextStepsDiv = document.getElementById('nextStepsInfo');

  const creds = window.setupCredentials || {
    adminEmail: projectData.adminEmail,
    adminPassword: projectData.adminPassword,
    frontendUrl: 'http://localhost:5173',
    backendUrl: 'http://localhost:5000',
  };

  credentialsDiv.innerHTML = `
    <h3>Admin Credentials</h3>
    <div class="credential-row">
      <span>Email:</span>
      <code>${creds.adminEmail}</code>
    </div>
    <div class="credential-row">
      <span>Password:</span>
      <code>${creds.adminPassword}</code>
    </div>
  `;

  nextStepsDiv.innerHTML = `
    <h3>Next Steps</h3>
    <ol>
      <li>
        <strong>Start the development servers:</strong>
        <pre><code>npm run dev</code></pre>
      </li>
      <li>
        <strong>Open your browser:</strong><br>
        Frontend: <a href="${creds.frontendUrl}" target="_blank">${creds.frontendUrl}</a><br>
        Backend API: <a href="${creds.backendUrl}" target="_blank">${creds.backendUrl}</a>
      </li>
      <li>
        <strong>Test authentication:</strong><br>
        Visit <a href="${creds.frontendUrl}/demo/auth" target="_blank">${creds.frontendUrl}/demo/auth</a> and login with your admin credentials.
      </li>
      <li>
        <strong>Read the documentation:</strong><br>
        Check <code>README_AUTH.md</code> for complete authentication documentation.
      </li>
      <li>
        <strong>Start building!</strong><br>
        Your app is ready. Happy coding! 🚀
      </li>
    </ol>
  `;
}

function openApp() {
  const frontendUrl =
    window.setupCredentials?.frontendUrl || 'http://localhost:5173';
  window.open(frontendUrl, '_blank');
}

// ============================================================================
// Event Listeners
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Step 1
  document
    .getElementById('checkPrereqBtn')
    .addEventListener('click', checkPrerequisites);
  document.getElementById('nextBtn1').addEventListener('click', nextStep);

  // Step 2
  document.getElementById('prevBtn2').addEventListener('click', prevStep);
  document
    .getElementById('nextBtn2')
    .addEventListener('click', handleProjectInfoNext);

  // Real-time validation for step 2
  document
    .getElementById('projectName')
    .addEventListener('input', validateProjectInfo);

  // Step 3
  document.getElementById('prevBtn3').addEventListener('click', prevStep);
  document
    .getElementById('nextBtn3')
    .addEventListener('click', handleAdminUserNext);

  // Real-time validation for step 3
  document
    .getElementById('adminEmail')
    .addEventListener('input', validateAdminUser);
  document
    .getElementById('adminPassword')
    .addEventListener('input', validateAdminUser);
  document
    .getElementById('adminPasswordConfirm')
    .addEventListener('input', validateAdminUser);
  document
    .getElementById('adminName')
    .addEventListener('input', validateAdminUser);

  // Step 5
  document.getElementById('openAppBtn').addEventListener('click', openApp);

  // Initialize
  updateProgress();
});
