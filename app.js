// Core Application Logic for Insurance Coverage Analysis System

// Application State
let state = {
  clients: [],
  contracts: [],
  coverages: [],
  adminPassword: "5675",
  currentView: "dashboard", // dashboard | admin
  selectedClientFilter: "all", // "all" or clientId
  selectedCategoryFilter: "all", // "all" or categoryKey
  activeAdminTab: "clients", // clients | contracts | coverages | settings
  editingClientId: null,
  editingContractId: null,
  editingCoverageId: null,
  contractStatusFilter: "all", // all | paying | paid
  excludeDuplicates: true
};

// Chart instances
let premiumChart = null;
let coverageChart = null;

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  loadStateFromLocalStorage();
  setupEventListeners();
  
  // Collapse Part 2 and Part 3 by default on mobile screens
  if (window.innerWidth <= 768) {
    document.getElementById("panel-part2")?.classList.add("collapsed");
    const ind2 = document.getElementById("panel-part2")?.querySelector(".collapse-indicator");
    if (ind2) ind2.textContent = "▼";

    document.getElementById("panel-part3")?.classList.add("collapsed");
    const ind3 = document.getElementById("panel-part3")?.querySelector(".collapse-indicator");
    if (ind3) ind3.textContent = "▼";
  }

  renderApp();
  
  // Apply initial theme
  const savedTheme = localStorage.getItem("insu_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeToggleIcon(savedTheme);
});

// Load state
function loadStateFromLocalStorage() {
  initializeDemoData(); // From demoData.js
  
  state.clients = JSON.parse(localStorage.getItem("insu_clients")) || [];
  state.contracts = JSON.parse(localStorage.getItem("insu_contracts")) || [];
  state.coverages = JSON.parse(localStorage.getItem("insu_coverages")) || [];
  state.adminPassword = localStorage.getItem("insu_admin_password") || "5675";
  
  // Set default filter if clients exist
  if (state.clients.length > 0) {
    // Keep filter as 'all' or first client
  }
  
  // Load Gemini key
  setTimeout(loadGeminiKey, 0);
}

// Save state
function saveStateToLocalStorage() {
  localStorage.setItem("insu_clients", JSON.stringify(state.clients));
  localStorage.setItem("insu_contracts", JSON.stringify(state.contracts));
  localStorage.setItem("insu_coverages", JSON.stringify(state.coverages));
  localStorage.setItem("insu_admin_password", state.adminPassword);
}

// Setup all Event Listeners
function setupEventListeners() {
  // Navigation
  document.getElementById("nav-dashboard").addEventListener("click", () => {
    switchView("dashboard");
  });
  
  document.getElementById("nav-admin").addEventListener("click", () => {
    if (sessionStorage.getItem("insu_is_admin") === "true") {
      switchView("admin");
    } else {
      openPasswordModal();
    }
  });

  // Admin tabs
  const adminTabs = ["clients", "contracts", "coverages", "settings"];
  adminTabs.forEach(tab => {
    const el = document.getElementById(`admin-tab-${tab}`);
    if (el) {
      el.addEventListener("click", () => switchAdminTab(tab));
    }
  });
  
  // Client selection filter on dashboard
  document.getElementById("dashboard-client-select").addEventListener("change", (e) => {
    state.selectedClientFilter = e.target.value;
    renderDashboardView();
  });
  
  // Theme toggle
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

  // Mobile toggle
  document.getElementById("btn-mobile-toggle")?.addEventListener("click", toggleMobileForced);
  
  // Print button
  document.getElementById("btn-print").addEventListener("click", () => {
    window.print();
  });
  
  // Passcode login submit
  document.getElementById("passcode-submit").addEventListener("click", handleAdminLogin);
  document.getElementById("admin-passcode-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleAdminLogin();
  });
  
  // Admin passcode modal cancel
  document.getElementById("passcode-cancel").addEventListener("click", closePasswordModal);
  
  // RRN autofill listeners
  const rrnInput = document.getElementById("client-rrn");
  if (rrnInput) {
    rrnInput.addEventListener("input", handleRRNInput);
  }
  
  // Client Form Type (RRN vs Direct)
  const clientInputModes = document.querySelectorAll('input[name="client-input-mode"]');
  clientInputModes.forEach(radio => {
    radio.addEventListener("change", (e) => {
      toggleClientFormMode(e.target.value);
    });
  });

  // Form Submissions
  document.getElementById("client-form")?.addEventListener("submit", handleClientSubmit);
  document.getElementById("contract-form")?.addEventListener("submit", handleContractSubmit);
  document.getElementById("coverage-form")?.addEventListener("submit", handleCoverageSubmit);
  document.getElementById("password-change-form")?.addEventListener("submit", handlePasswordChangeSubmit);
  
  // Reset database button
  document.getElementById("btn-reset-demo")?.addEventListener("click", resetToDemoData);
  
  // Logout Admin button
  document.getElementById("btn-logout-admin")?.addEventListener("click", handleAdminLogout);

  const statusPills = document.querySelectorAll(".status-filter-pill");
  statusPills.forEach(pill => {
    pill.addEventListener("click", (e) => {
      statusPills.forEach(p => p.classList.remove("active"));
      e.target.classList.add("active");
      state.contractStatusFilter = e.target.dataset.status;
      renderDashboardView();
    });
  });
}

// Switch between dashboard and admin view
function switchView(view) {
  state.currentView = view;
  
  // Update sidebar active state
  document.getElementById("nav-dashboard").classList.toggle("active", view === "dashboard");
  document.getElementById("nav-admin").classList.toggle("active", view === "admin");
  
  // Toggle main content view panels
  document.getElementById("view-dashboard").classList.toggle("active", view === "dashboard");
  document.getElementById("view-admin").classList.toggle("active", view === "admin");
  
  // Render current view
  if (view === "dashboard") {
    renderDashboardView();
  } else if (view === "admin") {
    renderAdminView();
  }
}

// Switch between tabs in admin panel
function switchAdminTab(tab) {
  state.activeAdminTab = tab;
  
  const adminTabs = ["clients", "contracts", "coverages", "settings"];
  adminTabs.forEach(t => {
    const btn = document.getElementById(`admin-tab-${t}`);
    const section = document.getElementById(`admin-section-${t}`);
    if (btn) btn.classList.toggle("active", t === tab);
    if (section) section.classList.toggle("active", t === tab);
  });
  
  // Render specific admin forms/lists
  if (tab === "clients") renderAdminClients();
  if (tab === "contracts") renderAdminContracts();
  if (tab === "coverages") renderAdminCoverages();
}

// Open Password Modal
function openPasswordModal() {
  const modal = document.getElementById("password-modal");
  const input = document.getElementById("admin-passcode-input");
  input.value = "";
  modal.classList.add("open");
  input.focus();
}

// Close Password Modal
function closePasswordModal() {
  document.getElementById("password-modal").classList.remove("open");
}

// Handle Admin Login
function handleAdminLogin() {
  const enteredPass = document.getElementById("admin-passcode-input").value;
  if (enteredPass === state.adminPassword) {
    sessionStorage.setItem("insu_is_admin", "true");
    closePasswordModal();
    showToast("관리자 인증에 성공하였습니다.", "success");
    updateAdminStatusWidget(true);
    switchView("admin");
  } else {
    showToast("비밀번호가 올바르지 않습니다.", "danger");
  }
}

// Handle Admin Logout
function handleAdminLogout() {
  sessionStorage.removeItem("insu_is_admin");
  showToast("관리자 모드에서 로그아웃 되었습니다.", "info");
  updateAdminStatusWidget(false);
  switchView("dashboard");
}

// Update Admin Widget Status in Sidebar
function updateAdminStatusWidget(isAdmin) {
  const widget = document.getElementById("admin-status-widget");
  if (isAdmin) {
    widget.innerHTML = `
      <div class="user-avatar" style="background-color: var(--success-light); color: var(--success);">관</div>
      <div class="user-info">
        <span class="user-name">관리자</span>
        <span class="user-role" style="color: var(--success); font-weight: 600;">인증 완료</span>
      </div>
    `;
    document.getElementById("admin-logout-container").style.display = "block";
  } else {
    widget.innerHTML = `
      <div class="user-avatar">일</div>
      <div class="user-info">
        <span class="user-name">일반 사용자</span>
        <span class="user-role">조회 전용</span>
      </div>
    `;
    document.getElementById("admin-logout-container").style.display = "none";
  }
}

// Toggle Theme (Dark / Light)
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("insu_theme", newTheme);
  updateThemeToggleIcon(newTheme);
  showToast(`${newTheme === 'dark' ? '다크' : '라이트'} 모드로 전환되었습니다.`, "info");
  
  // Re-render charts to adjust text colors
  if (state.currentView === "dashboard") {
    renderCharts();
  }
}

function updateThemeToggleIcon(theme) {
  const btn = document.getElementById("theme-toggle");
  btn.innerHTML = theme === "dark" ? "☀️" : "🌙";
}

// Toggle Client Form Mode: RRN vs Direct Input
function toggleClientFormMode(mode) {
  const rrnGroup = document.getElementById("form-group-rrn");
  const manualGroup = document.getElementById("form-group-manual");
  
  if (mode === "rrn") {
    rrnGroup.style.display = "block";
    manualGroup.style.display = "none";
    document.getElementById("client-gender").required = false;
    document.getElementById("client-age").required = false;
    document.getElementById("client-rrn").required = true;
  } else {
    rrnGroup.style.display = "none";
    manualGroup.style.display = "block";
    document.getElementById("client-gender").required = true;
    document.getElementById("client-age").required = true;
    document.getElementById("client-rrn").required = false;
  }
}

// Parse RRN and Autofill Gender & Age
function handleRRNInput(e) {
  const rrnVal = e.target.value.trim();
  
  // Valid pattern: YYMMDD-G (or just YYMMDDG or similar)
  // Let's strip non-alphanumeric chars first
  const clean = rrnVal.replace(/[^0-9-]/g, "");
  e.target.value = clean;
  
  // Try to parse if format is like YYMMDD-G (7 digits with or without dash)
  const match = clean.match(/^(\d{6})-?([0-9])$/);
  if (match) {
    const birthDigits = match[1];
    const genderDigit = parseInt(match[2]);
    
    let gender = "";
    let birthYearPrefix = 1900;
    
    // Determine gender & birth century
    if ([1, 3, 5, 7, 9].includes(genderDigit)) {
      gender = "남";
    } else if ([2, 4, 6, 8, 0].includes(genderDigit)) {
      gender = "여";
    }
    
    if ([1, 2, 5, 6].includes(genderDigit)) {
      birthYearPrefix = 1900;
    } else if ([3, 4, 7, 8].includes(genderDigit)) {
      birthYearPrefix = 2000;
    } else if ([9, 0].includes(genderDigit)) {
      birthYearPrefix = 1800;
    }
    
    const birthYear = birthYearPrefix + parseInt(birthDigits.substring(0, 2));
    const currentYear = 2026; // Base year as specified
    const age = currentYear - birthYear;
    
    // Pre-populate input values or labels
    document.getElementById("rrn-inferred-info").innerHTML = `
      <span class="badge badge-info">${gender}성</span> 
      <span class="badge badge-info">${age}세</span> 
      <span style="font-size:0.75rem; color:var(--text-muted)">(${birthYear}년생, 2026년 기준)</span>
    `;
    
    // Save these temp parsed values so we use them on submit
    e.target.dataset.parsedGender = gender;
    e.target.dataset.parsedAge = age;
  } else {
    document.getElementById("rrn-inferred-info").innerHTML = "";
    delete e.target.dataset.parsedGender;
    delete e.target.dataset.parsedAge;
  }
}

// Render the general dashboard view
function renderDashboardView() {
  populateClientFilters();
  renderFamilySelectorGrid();
  renderDashboardStats();
  renderPart1SummaryTable();
  renderPart2ContractTable();
  renderPart3CoverageTable();
  renderCharts();
}

// Render Family selector cards
function renderFamilySelectorGrid() {
  const container = document.getElementById("family-selector-grid");
  if (!container) return;

  let html = "";
  
  // Sort clients by sortOrder
  state.clients.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  
  // All family card
  const totalFamilyPremium = state.contracts.reduce((sum, c) => sum + (c.premium || 0), 0);
  const totalFamilyContracts = state.contracts.length;
  
  const allActive = state.selectedClientFilter === "all" ? "active" : "";
  html += `
    <div class="family-select-card ${allActive}" onclick="selectFamilyMember('all')">
      <div class="family-card-header">
        <span class="family-card-name">전체 가족</span>
        <span class="badge badge-info family-card-badge">합계</span>
      </div>
      <div class="family-card-stats" style="margin-top: 0.25rem;">
        가입 ${totalFamilyContracts}건 | 월 ${totalFamilyPremium.toLocaleString()}원
      </div>
    </div>
  `;

  state.clients.forEach(c => {
    const memberContracts = state.contracts.filter(con => con.clientId === c.id);
    const memberPremium = memberContracts.reduce((sum, con) => sum + (con.premium || 0), 0);
    
    const activeClass = state.selectedClientFilter === c.id ? "active" : "";
    const memberColor = c.color || "#4f46e5";
    html += `
      <div class="family-select-card ${activeClass}" style="--member-color: ${memberColor};" onclick="selectFamilyMember('${c.id}')">
        <div class="family-card-header">
          <span class="family-card-name">${c.name}</span>
          <span class="badge" style="background-color: ${memberColor}20; color: ${memberColor}; border: 1px solid ${memberColor}30;">${c.gender}/${c.age}세</span>
        </div>
        <div class="family-card-stats" style="margin-top: 0.25rem;">
          가입 ${memberContracts.length}건 | 월 ${memberPremium.toLocaleString()}원
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function selectFamilyMember(clientId) {
  state.selectedClientFilter = clientId;
  
  const select = document.getElementById("dashboard-client-select");
  if (select) {
    select.value = clientId;
  }
  
  renderDashboardView();
}
window.selectFamilyMember = selectFamilyMember;
window.renderFamilySelectorGrid = renderFamilySelectorGrid;

// Populate Client Filter Dropdown on Dashboard
function populateClientFilters() {
  const select = document.getElementById("dashboard-client-select");
  const currentValue = state.selectedClientFilter;
  
  // Sort clients by sortOrder
  state.clients.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  
  let options = '<option value="all">전체 가족</option>';
  state.clients.forEach(client => {
    options += `<option value="${client.id}">${client.name} (${client.gender}/${client.age}세)</option>`;
  });
  
  select.innerHTML = options;
  select.value = currentValue;
}

// Render Header Metrics / Statistics
function renderDashboardStats() {
  const filteredClientId = state.selectedClientFilter;
  
  let targetContracts = state.contracts;
  let targetClients = state.clients;
  
  if (filteredClientId !== "all") {
    targetContracts = state.contracts.filter(c => c.clientId === filteredClientId);
    targetClients = state.clients.filter(c => c.id === filteredClientId);
  }
  
  // Filter out duplicates for stats if checked
  let calculationContracts = targetContracts;
  if (state.excludeDuplicates) {
    calculationContracts = targetContracts.filter(c => !c.isDuplicate);
  }
  
  // Status filter (paying / paid / all)
  if (state.contractStatusFilter === "paying") {
    calculationContracts = calculationContracts.filter(c => c.premium > 0);
  } else if (state.contractStatusFilter === "paid") {
    calculationContracts = calculationContracts.filter(c => c.premium === 0);
  }
  
  // 1. Total Premium Sum
  const totalPremium = calculationContracts.reduce((sum, c) => sum + (c.premium || 0), 0);
  document.getElementById("stat-total-premium").textContent = `${totalPremium.toLocaleString()}원`;
  
  // 2. Active Contracts (based on filtered list)
  document.getElementById("stat-total-contracts").textContent = `${calculationContracts.length}건`;
  
  // 3. Members count
  document.getElementById("stat-total-members").textContent = `${targetClients.length}명`;
}

// Helper to check category matches
function isCategoryMatch(largeCategory, categoryKey) {
  if (categoryKey === "all") return true;
  if (categoryKey === "사망") return largeCategory === "사망/장해";
  if (categoryKey === "수술") return largeCategory === "수술/입원";
  if (categoryKey === "치매" || categoryKey === "간병") return largeCategory === "치매/간병";
  return largeCategory === categoryKey;
}
window.isCategoryMatch = isCategoryMatch;

function selectCategory(categoryKey) {
  state.selectedCategoryFilter = categoryKey;
  renderDashboardView();
}
window.selectCategory = selectCategory;

// Render PART 1: Core Coverage Summary Table (핵심 보장 요약 뷰)
function renderPart1SummaryTable() {
  const container = document.getElementById("part1-summary-table-container");
  
  if (state.clients.length === 0) {
    container.innerHTML = `<p style="padding: 1.5rem; text-align: center; color: var(--text-muted);">등록된 고객 정보가 없습니다. 관리자 모드에서 등록해 주세요.</p>`;
    return;
  }

  // Column definitions matching the markdown template
  const categories = [
    { name: "실손의료비", key: "실손" },
    { name: "암 (일반암)", key: "암" },
    { name: "뇌 (뇌혈관)", key: "뇌" },
    { name: "심장 (허혈/심혈관)", key: "심장" },
    { name: "사망 (일반/상해)", key: "사망" },
    { name: "수술/입원", key: "수술" },
    { name: "치매", key: "치매" },
    { name: "간병", key: "간병" },
    { name: "치아", key: "치아" }
  ];

  let html = `
    <table class="custom-table">
      <thead>
        <tr>
          <th style="min-width: 110px; vertical-align: middle;">
            <label style="display: flex; align-items: center; gap: 0.35rem; margin: 0; cursor: pointer; font-weight: 700;">
              <input type="checkbox" onchange="selectFamilyMember('all')" ${state.selectedClientFilter === 'all' ? 'checked' : ''} style="cursor: pointer; width: 14px; height: 14px; accent-color: var(--primary);">
              대상
            </label>
          </th>
          ${categories.map(cat => {
            const isActive = state.selectedCategoryFilter === cat.key;
            const activeStyle = isActive ? 'background-color: var(--primary) !important; color: #ffffff !important; font-weight: 800;' : '';
            const indicator = isActive ? ' 🔍' : '';
            return `
              <th onclick="selectCategory('${isActive ? 'all' : cat.key}')" 
                  style="cursor: pointer; position: relative; transition: all var(--transition-fast); text-align: center; ${activeStyle}"
                  title="클릭 시 하단에 ${cat.name} 관련 내역만 필터링">
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.25rem; white-space: nowrap;">
                  <span>${cat.name}</span>${indicator}
                </div>
              </th>
            `;
          }).join("")}
        </tr>
      </thead>
      <tbody>
  `;

  // PART 1 summary table always shows all clients to allow visual comparison and quick checkboxes
  let displayClients = state.clients;

  displayClients.forEach(client => {
    // Filter coverages for this client
    let clientCoverages = state.coverages.filter(cov => cov.clientId === client.id);
    if (state.excludeDuplicates) {
      clientCoverages = clientCoverages.filter(cov => {
        if (!cov.contractId) return true;
        const con = state.contracts.find(o => o.id === cov.contractId);
        return !con || !con.isDuplicate;
      });
    }
    
    html += `
      <tr>
        <td style="font-weight: 700; vertical-align: middle;">
          <div style="display: flex; align-items: center; gap: 0.5rem; white-space: nowrap;">
            <input type="checkbox" class="part1-client-checkbox" onchange="selectFamilyMember(this.checked ? '${client.id}' : 'all')" ${state.selectedClientFilter === client.id ? 'checked' : ''} style="cursor: pointer; width: 15px; height: 15px; accent-color: var(--primary);">
            <div>
              ${client.name}<br>
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal;">(${client.gender}/${client.age}세)</span>
            </div>
          </div>
        </td>
    `;
    
    // Evaluate coverage for each category
    categories.forEach(cat => {
      const summaryText = getCategorySummary(client.id, cat.key, clientCoverages);
      html += `<td>${summaryText}</td>`;
    });
    
    html += `</tr>`;
  });

  html += `
      </tbody>
    </table>
  `;
  
  container.innerHTML = html;
}

// Generate the specific HTML display cell for each Category inside Part 1
function getCategorySummary(clientId, categoryKey, coverages) {
  let matchedCovs = [];
  
  if (categoryKey === "실손") {
    matchedCovs = coverages.filter(c => c.largeCategory === "실손" || c.mediumCategory.includes("실손") || c.mediumCategory.includes("급여"));
  } else if (categoryKey === "암") {
    matchedCovs = coverages.filter(c => c.largeCategory === "암" || c.smallCategory.includes("암"));
  } else if (categoryKey === "뇌") {
    matchedCovs = coverages.filter(c => c.largeCategory === "뇌" || c.smallCategory.includes("뇌"));
  } else if (categoryKey === "심장") {
    matchedCovs = coverages.filter(c => c.largeCategory === "심장" || c.smallCategory.includes("심장"));
  } else if (categoryKey === "사망") {
    matchedCovs = coverages.filter(c => c.largeCategory === "사망/장해" || c.mediumCategory.includes("사망") || c.smallCategory.includes("사망"));
  } else if (categoryKey === "수술") {
    matchedCovs = coverages.filter(c => c.largeCategory === "수술/입원" || c.mediumCategory.includes("수술") || c.mediumCategory.includes("입원") || c.smallCategory.includes("수술") || c.smallCategory.includes("입원"));
  } else if (categoryKey === "치매") {
    matchedCovs = coverages.filter(c => (c.largeCategory === "치매/간병" || c.mediumCategory.includes("치매") || c.smallCategory.includes("치매")) && (c.mediumCategory.includes("치매") || c.smallCategory.includes("치매")));
  } else if (categoryKey === "간병") {
    matchedCovs = coverages.filter(c => (c.largeCategory === "치매/간병" || c.mediumCategory.includes("간병") || c.smallCategory.includes("간병") || c.smallCategory.includes("장기요양")) && !c.mediumCategory.includes("치매") && !c.smallCategory.includes("치매"));
  } else if (categoryKey === "치아") {
    matchedCovs = coverages.filter(c => c.largeCategory === "치아" || c.mediumCategory.includes("치아") || c.mediumCategory.includes("임플란트") || c.mediumCategory.includes("보철") || c.mediumCategory.includes("보존") || c.smallCategory.includes("치아") || c.smallCategory.includes("크라운") || c.smallCategory.includes("임플란트"));
  }

  // 15 years old limitation check for 사망
  if (categoryKey === "사망" && matchedCovs.length === 0) {
    const client = state.clients.find(c => c.id === clientId);
    if (client && client.age < 15) {
      return `<span style="color: var(--text-muted);">미가입<br><span style="font-size:0.75rem;">(15세 미만 제외)</span></span>`;
    }
  }

  if (matchedCovs.length === 0) {
    return `<span style="color: var(--text-muted);">✗ 미가입</span>`;
  }

  // Get unique companies
  const companies = [];
  matchedCovs.forEach(c => {
    const comp = getContractCompany(c.contractId);
    if (comp && comp !== "미지정" && !companies.includes(comp)) {
      companies.push(comp);
    }
  });
  const companyStr = companies.length > 0 ? `<br><span style="font-size:0.75rem; color:var(--text-muted)">• ${companies.join(", ")}</span>` : "";

  // Compile indicators
  if (categoryKey === "실손") {
    return `<strong>실손 ○</strong>${companyStr}`;
  }
  
  if (categoryKey === "사망") {
    return `<strong>사망 ○</strong>${companyStr}`;
  }

  if (categoryKey === "치아") {
    return `<strong>치아 ○</strong>${companyStr}`;
  }

  if (categoryKey === "암" || categoryKey === "뇌" || categoryKey === "심장") {
    const hasDiag = matchedCovs.some(c => 
      (c.smallCategory.includes("진단비") || c.mediumCategory.includes("진단") || 
       ["일반암", "고액암", "소액암", "유사암", "뇌출혈", "뇌졸중", "뇌혈관", "급성심근경색", "급성심근"].includes(c.mediumCategory)) &&
      !c.smallCategory.includes("수술") && !c.smallCategory.includes("입원") && !c.smallCategory.includes("통원")
    );
    const hasSurg = matchedCovs.some(c => c.smallCategory.includes("수술") || c.mediumCategory.includes("수술") || c.mediumCategory.includes("치료"));
    const hasHosp = matchedCovs.some(c => c.smallCategory.includes("입원") || c.smallCategory.includes("일당") || c.smallCategory.includes("통원") || c.mediumCategory.includes("입원"));

    return `
      <div style="font-size: 0.85rem; line-height: 1.3;">
        진단: ${hasDiag ? '<span style="color:var(--success); font-weight:bold;">○</span>' : '<span style="color:var(--danger);">✗</span>'}<br>
        수술: ${hasSurg ? '<span style="color:var(--success); font-weight:bold;">○</span>' : '<span style="color:var(--danger);">✗</span>'}<br>
        입원: ${hasHosp ? '<span style="color:var(--success); font-weight:bold;">○</span>' : '<span style="color:var(--danger);">✗</span>'}
      </div>
      ${companyStr}
    `;
  }

  if (categoryKey === "수술") {
    const hasSurg = matchedCovs.some(c => c.smallCategory.includes("수술") || c.mediumCategory.includes("수술") || c.mediumCategory.includes("치료"));
    const hasHosp = matchedCovs.some(c => c.smallCategory.includes("입원") || c.smallCategory.includes("일당") || c.mediumCategory.includes("입원"));

    return `
      <div style="font-size: 0.85rem; line-height: 1.3;">
        수술: ${hasSurg ? '<span style="color:var(--success); font-weight:bold;">○</span>' : '<span style="color:var(--danger);">✗</span>'}<br>
        입원: ${hasHosp ? '<span style="color:var(--success); font-weight:bold;">○</span>' : '<span style="color:var(--danger);">✗</span>'}
      </div>
      ${companyStr}
    `;
  }

  if (categoryKey === "치매") {
    const hasDementia = matchedCovs.some(c => c.mediumCategory.includes("치매") || c.smallCategory.includes("치매"));
    return `<strong>치매 ${hasDementia ? '○' : '✗'}</strong>${companyStr}`;
  }

  if (categoryKey === "간병") {
    const hasCare = matchedCovs.some(c => c.mediumCategory.includes("간병") || c.smallCategory.includes("간병") || c.smallCategory.includes("장기요양"));
    return `<strong>간병 ${hasCare ? '○' : '✗'}</strong>${companyStr}`;
  }

  return `<span style="color:var(--text-muted)">✗ 미가입</span>`;
}

// Utility: get Company name by Contract ID
function getContractCompany(contractId) {
  if (!contractId) return "미지정";
  const contract = state.contracts.find(c => c.id === contractId);
  return contract ? contract.company : "기타";
}

// Utility: Parse Korean coverage currency to number (e.g. "3,000만" -> 3000, "1억" -> 10000)
function parseCoverageAmountToNumber(str) {
  if (!str) return 0;
  let val = 0;
  
  // Clean string
  let clean = str.replace(/,/g, "").replace(/\s/g, "");
  
  if (clean.includes("억")) {
    const parts = clean.split("억");
    val += parseFloat(parts[0]) * 10000;
    if (parts[1] && parts[1].includes("만")) {
      val += parseFloat(parts[1].replace("만", ""));
    }
  } else if (clean.includes("만")) {
    val += parseFloat(clean.replace("만", ""));
  }
  return val;
}

// Utility: Format number back to Korean coverage currency
function formatNumberToCoverageAmount(num) {
  if (num >= 10000) {
    const eok = Math.floor(num / 10000);
    const man = num % 10000;
    return `${eok}억${man > 0 ? ` ${man.toLocaleString()}만` : ""}`;
  }
  return `${num.toLocaleString()}만`;
}

// Render PART 2: Contract & Expenditure Table (계약 및 지출 관리 뷰)
function renderPart2ContractTable() {
  const container = document.getElementById("part2-contract-table-container");
  const filteredClientId = state.selectedClientFilter;
  
  let targetContracts = state.contracts;
  if (filteredClientId !== "all") {
    targetContracts = state.contracts.filter(c => c.clientId === filteredClientId);
  }

  // Filter contracts by category if selected (only show contracts that have matching riders)
  if (state.selectedCategoryFilter !== "all") {
    targetContracts = targetContracts.filter(con => {
      return state.coverages.some(cov => 
        cov.contractId === con.id && 
        isCategoryMatch(cov.largeCategory, state.selectedCategoryFilter)
      );
    });
  }

  // Filter contract status (paying / paid)
  if (state.contractStatusFilter === "paying") {
    targetContracts = targetContracts.filter(c => c.premium > 0);
  } else if (state.contractStatusFilter === "paid") {
    targetContracts = targetContracts.filter(c => c.premium === 0);
  }

  // Build active category filter banner
  let activeFilterHtml = "";
  if (state.selectedCategoryFilter !== "all") {
    const categories = [
      { name: "실손의료비", key: "실손" },
      { name: "암 (일반암)", key: "암" },
      { name: "뇌 (뇌혈관)", key: "뇌" },
      { name: "심장 (허혈/심혈관)", key: "심장" },
      { name: "사망 (일반/상해)", key: "사망" },
      { name: "수술/입원", key: "수술" },
      { name: "치매", key: "치매" },
      { name: "간병", key: "간병" },
      { name: "치아", key: "치아" }
    ];
    const catName = categories.find(c => c.key === state.selectedCategoryFilter)?.name || state.selectedCategoryFilter;
    activeFilterHtml = `
      <div style="background: rgba(79, 70, 229, 0.05); border: 1px dashed rgba(79, 70, 229, 0.3); padding: 0.75rem 1rem; border-radius: var(--radius-sm); margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; font-size: 0.875rem;">
        <div style="color: var(--primary); font-weight: 600;">⚡ ${catName} 관련 보험 상품만 필터링 적용 중</div>
        <button class="btn btn-secondary btn-sm" onclick="selectCategory('all')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; height: auto;">필터 해제</button>
      </div>
    `;
  }

  if (targetContracts.length === 0) {
    container.innerHTML = activeFilterHtml + `<p style="padding: 1.5rem; text-align: center; color: var(--text-muted);">조건에 부합하는 가입 상품이 없습니다.</p>`;
    return;
  }

  let html = activeFilterHtml + `
    <table class="custom-table">
      <thead>
        <tr>
          <th>대상</th>
          <th>보험회사</th>
          <th>상품명</th>
          <th>증권번호</th>
          <th>계약일자</th>
          <th>납입 / 만기</th>
          <th>갱신여부</th>
          <th>월 보험료</th>
          <th>납입수단</th>
        </tr>
      </thead>
      <tbody>
  `;

  let totalPremiumSum = 0;

  targetContracts.forEach(c => {
    const client = state.clients.find(cl => cl.id === c.clientId);
    const clientStr = client ? `${client.name}(${client.gender}/${client.age}세)` : "알 수 없음";
    
    let isExcluded = false;
    let premiumHtml = `${(c.premium || 0).toLocaleString()}원`;
    
    if (c.isDuplicate) {
      if (state.excludeDuplicates) {
        isExcluded = true;
        premiumHtml = `<span style="text-decoration: line-through; color: var(--text-muted);">${(c.premium || 0).toLocaleString()}원</span> <span class="badge badge-danger btn-sm" style="font-size:0.6rem; padding: 0.1rem 0.2rem;">제외</span>`;
      } else {
        premiumHtml = `${(c.premium || 0).toLocaleString()}원 <span class="badge badge-warning btn-sm" style="font-size:0.6rem; padding: 0.1rem 0.2rem;">중복</span>`;
      }
    }

    if (!isExcluded) {
      totalPremiumSum += c.premium || 0;
    }

    const dupBadge = c.isDuplicate ? `<span class="badge badge-duplicate" style="font-size:0.75rem; margin-left:0.25rem;">중복</span>` : "";

    html += `
      <tr>
        <td><strong>${clientStr}</strong></td>
        <td>${c.company}</td>
        <td>${c.productName}${dupBadge}</td>
        <td><code>${c.policyNumber}</code></td>
        <td>${c.contractDate}</td>
        <td>${c.paymentPeriod}</td>
        <td><span class="badge ${c.isRenewable.includes("갱신") && !c.isRenewable.includes("비갱신") ? 'badge-warning' : 'badge-info'}">${c.isRenewable}</span></td>
        <td style="font-weight: 600;">${premiumHtml}</td>
        <td>${c.paymentMethod}</td>
      </tr>
    `;
  });

  // Total summary row
  html += `
      <tr class="highlight-total">
        <td><strong>합계</strong></td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td><strong>${totalPremiumSum.toLocaleString()}원</strong></td>
        <td>-</td>
      </tr>
    </tbody>
  </table>
  `;

  container.innerHTML = html;
}

// Render PART 3: Hierarchical Coverage Details Table (계층형 담보 세부 관리 뷰)
function renderPart3CoverageTable() {
  const container = document.getElementById("part3-coverage-table-container");
  const filteredClientId = state.selectedClientFilter;
  
  let targetCoverages = state.coverages;
  if (filteredClientId !== "all") {
    targetCoverages = state.coverages.filter(c => c.clientId === filteredClientId);
  }

  // Filter coverages by category if selected
  if (state.selectedCategoryFilter !== "all") {
    targetCoverages = targetCoverages.filter(cov => isCategoryMatch(cov.largeCategory, state.selectedCategoryFilter));
  }

  // Exclude duplicate coverages if active
  if (state.excludeDuplicates) {
    targetCoverages = targetCoverages.filter(cov => {
      if (!cov.contractId) return true;
      const con = state.contracts.find(c => c.id === cov.contractId);
      return !con || !con.isDuplicate;
    });
  }

  // Build active category filter banner
  let activeFilterHtml = "";
  if (state.selectedCategoryFilter !== "all") {
    const categories = [
      { name: "실손의료비", key: "실손" },
      { name: "암 (일반암)", key: "암" },
      { name: "뇌 (뇌혈관)", key: "뇌" },
      { name: "심장 (허혈/심혈관)", key: "심장" },
      { name: "사망 (일반/상해)", key: "사망" },
      { name: "수술/입원", key: "수술" },
      { name: "치매", key: "치매" },
      { name: "간병", key: "간병" },
      { name: "치아", key: "치아" }
    ];
    const catName = categories.find(c => c.key === state.selectedCategoryFilter)?.name || state.selectedCategoryFilter;
    activeFilterHtml = `
      <div style="background: rgba(79, 70, 229, 0.05); border: 1px dashed rgba(79, 70, 229, 0.3); padding: 0.75rem 1rem; border-radius: var(--radius-sm); margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; font-size: 0.875rem;">
        <div style="color: var(--primary); font-weight: 600;">⚡ ${catName} 관련 세부 담보 특약만 필터링 적용 중</div>
        <button class="btn btn-secondary btn-sm" onclick="selectCategory('all')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; height: auto;">필터 해제</button>
      </div>
    `;
  }

  if (targetCoverages.length === 0) {
    container.innerHTML = activeFilterHtml + `<p style="padding: 1.5rem; text-align: center; color: var(--text-muted);">조건에 부합하는 세부 담보 정보가 없습니다.</p>`;
    return;
  }

  let html = activeFilterHtml + `
    <table class="custom-table">
      <thead>
        <tr>
          <th>대상</th>
          <th>대분류</th>
          <th>중분류</th>
          <th>소분류 (세부 담보/특약)</th>
          <th>보장금액</th>
          <th>가입 상품명 (보험사)</th>
          <th>비고 (지급조건/면책/갱신)</th>
        </tr>
      </thead>
      <tbody>
  `;

  targetCoverages.forEach(c => {
    const client = state.clients.find(cl => cl.id === c.clientId);
    const clientStr = client ? `${client.name}(${client.gender}/${client.age}세)` : "알 수 없음";
    
    // Find contract details
    let contractStr = "직접 입력";
    if (c.contractId) {
      const contract = state.contracts.find(con => con.id === c.contractId);
      if (contract) {
        contractStr = `${contract.productName} (${contract.company})`;
      }
    }

    // Highlighting potential coverage gaps / warnings
    let remarkHtml = c.remarks || "-";
    if (c.remarks && (c.remarks.includes("⚠️") || c.remarks.includes("제외") || c.remarks.includes("제한"))) {
      remarkHtml = `<span class="warning-pill">${c.remarks}</span>`;
    }

    html += `
      <tr>
        <td><strong>${clientStr}</strong></td>
        <td><span class="badge badge-info">${c.largeCategory}</span></td>
        <td><strong>${c.mediumCategory}</strong></td>
        <td>${c.smallCategory}</td>
        <td style="font-weight: 600; color: var(--primary);">${c.coverageAmount}</td>
        <td>${contractStr}</td>
        <td>${remarkHtml}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  container.innerHTML = html;
}

// Render dashboard graphs via Chart.js
function renderCharts() {
  if (state.clients.length === 0) return;
  
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const textColor = isDark ? "#f3f4f6" : "#0f172a";
  const gridColor = isDark ? "rgba(75, 85, 99, 0.2)" : "rgba(226, 232, 240, 0.8)";
  
  // --- Chart 1: Premium Doughnut Chart ---
  const premiumCtx = document.getElementById("premium-chart-canvas")?.getContext("2d");
  if (premiumCtx) {
    if (premiumChart) {
      premiumChart.destroy();
    }

    // Sort clients by sortOrder
    state.clients.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    
    // Labels: member names
    const labels = state.clients.map(c => c.name);
    const data = state.clients.map(c => {
      // Sum premiums for this client
      let targetCon = state.contracts.filter(con => con.clientId === c.id);
      return targetCon.reduce((sum, con) => sum + (con.premium || 0), 0);
    });

    const colors = state.clients.map(c => c.color || "#4f46e5");

    premiumChart = new Chart(premiumCtx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: isDark ? 2 : 1,
          borderColor: isDark ? "#111827" : "#ffffff"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor,
              font: {
                family: 'Outfit, Noto Sans KR'
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ` ${context.label}: ${context.raw.toLocaleString()}원`;
              }
            }
          }
        }
      }
    });
  }

  // --- Chart 2: Coverage Gap Bar Chart ---
  // Compare General Cancer, Brain, and Heart coverage levels per member
  const coverageCtx = document.getElementById("coverage-chart-canvas")?.getContext("2d");
  if (coverageCtx) {
    if (coverageChart) {
      coverageChart.destroy();
    }

    // Sort clients by sortOrder
    state.clients.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    
    const clientNames = state.clients.map(c => c.name);
    
    // Calculate values
    const generalCancerData = [];
    const subCancerData = [];
    const brainHemoData = [];
    const brainStrokeData = [];
    const heartIschemicData = [];
    const heartInfarctData = [];

    state.clients.forEach(c => {
      let clientCovs = state.coverages.filter(cov => cov.clientId === c.id);
      
      // 1. 일반암
      let genCancerAmt = 0;
      clientCovs.filter(cov => cov.largeCategory === "암" && cov.mediumCategory === "일반암").forEach(cov => {
        genCancerAmt += parseCoverageAmountToNumber(cov.coverageAmount);
      });
      generalCancerData.push(genCancerAmt);

      // 2. 유사암(소액암)
      let subCancerAmt = 0;
      clientCovs.filter(cov => cov.largeCategory === "암" && (cov.mediumCategory.includes("유사암") || cov.mediumCategory.includes("소액암"))).forEach(cov => {
        subCancerAmt += parseCoverageAmountToNumber(cov.coverageAmount);
      });
      subCancerData.push(subCancerAmt);

      // 3. 뇌출혈
      let brainHemoAmt = 0;
      clientCovs.filter(cov => 
        cov.largeCategory === "뇌" && 
        cov.mediumCategory.includes("뇌출혈") && 
        !cov.smallCategory.includes("수술") && 
        !cov.smallCategory.includes("입원") &&
        !cov.smallCategory.includes("치료")
      ).forEach(cov => {
        brainHemoAmt += parseCoverageAmountToNumber(cov.coverageAmount);
      });
      brainHemoData.push(brainHemoAmt);

      // 4. 뇌졸중
      let brainStrokeAmt = 0;
      clientCovs.filter(cov => 
        cov.largeCategory === "뇌" && 
        (cov.mediumCategory.includes("뇌졸중") || cov.mediumCategory.includes("뇌졸증")) && 
        !cov.smallCategory.includes("수술") && 
        !cov.smallCategory.includes("입원") &&
        !cov.smallCategory.includes("치료")
      ).forEach(cov => {
        brainStrokeAmt += parseCoverageAmountToNumber(cov.coverageAmount);
      });
      brainStrokeData.push(brainStrokeAmt);

      // 5. 허혈성심장
      let heartIschemicAmt = 0;
      clientCovs.filter(cov => 
        cov.largeCategory === "심장" && 
        ["허혈/심혈관", "허혈성", "심혈관"].includes(cov.mediumCategory) && 
        !cov.smallCategory.includes("수술") && 
        !cov.smallCategory.includes("입원") &&
        !cov.smallCategory.includes("치료")
      ).forEach(cov => {
        heartIschemicAmt += parseCoverageAmountToNumber(cov.coverageAmount);
      });
      heartIschemicData.push(heartIschemicAmt);

      // 6. 급성심근경색
      let heartInfarctAmt = 0;
      clientCovs.filter(cov => 
        cov.largeCategory === "심장" && 
        ["급성심근경색", "급성심근"].includes(cov.mediumCategory) && 
        !cov.smallCategory.includes("수술") && 
        !cov.smallCategory.includes("입원") &&
        !cov.smallCategory.includes("치료")
      ).forEach(cov => {
        heartInfarctAmt += parseCoverageAmountToNumber(cov.coverageAmount);
      });
      heartInfarctData.push(heartInfarctAmt);
    });

    coverageChart = new Chart(coverageCtx, {
      type: 'bar',
      data: {
        labels: clientNames,
        datasets: [
          {
            label: '일반암',
            data: generalCancerData,
            backgroundColor: 'rgba(79, 70, 229, 0.85)',
            borderColor: '#4f46e5',
            borderWidth: 1
          },
          {
            label: '유사암(소액암)',
            data: subCancerData,
            backgroundColor: 'rgba(129, 140, 248, 0.85)',
            borderColor: '#818cf8',
            borderWidth: 1
          },
          {
            label: '뇌출혈',
            data: brainHemoData,
            backgroundColor: 'rgba(16, 185, 129, 0.85)',
            borderColor: '#10b981',
            borderWidth: 1
          },
          {
            label: '뇌졸중',
            data: brainStrokeData,
            backgroundColor: 'rgba(52, 211, 153, 0.85)',
            borderColor: '#34d399',
            borderWidth: 1
          },
          {
            label: '허혈성심장',
            data: heartIschemicData,
            backgroundColor: 'rgba(245, 158, 11, 0.85)',
            borderColor: '#f59e0b',
            borderWidth: 1
          },
          {
            label: '급성심근경색',
            data: heartInfarctData,
            backgroundColor: 'rgba(251, 191, 36, 0.85)',
            borderColor: '#fbbf24',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              color: gridColor,
              borderDash: [3, 3],
              drawOnChartArea: true
            },
            ticks: { color: textColor }
          },
          y: {
            grid: {
              color: gridColor,
              borderDash: [3, 3]
            },
            ticks: {
              color: textColor,
              callback: function(value) {
                return formatNumberToCoverageAmount(value);
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor,
              font: {
                family: 'Outfit, Noto Sans KR'
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ` ${context.dataset.label}: ${formatNumberToCoverageAmount(context.raw)}`;
              }
            }
          }
        }
      }
    });
  }
}

// Render admin panel view (shows active admin section)
function renderAdminView() {
  switchAdminTab(state.activeAdminTab);
}

// ----------------------------------------------------
// CLIENT CRUD OPERATIONS
// ----------------------------------------------------
function renderAdminClients() {
  const container = document.getElementById("admin-clients-list");
  
  if (state.clients.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:1rem;">등록된 고객이 없습니다.</p>`;
    return;
  }

  // Ensure clients are sorted by sortOrder
  state.clients.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  let html = `
    <table class="custom-table">
      <thead>
        <tr>
          <th>순서</th>
          <th>이름</th>
          <th>성별/나이</th>
          <th>대표 색상</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
  `;

  state.clients.forEach((c, idx) => {
    const details = c.rrn ? `주민번호: ${c.rrn.substring(0, 8)}******` : `수동 입력`;
    html += `
      <tr>
        <td>
          <span style="font-weight:600; margin-right:0.5rem;">${c.sortOrder || (idx + 1)}</span>
          <button type="button" class="btn btn-secondary btn-sm" style="padding: 0.15rem 0.3rem;" onclick="moveClient('${c.id}', 'up')" ${idx === 0 ? 'disabled' : ''}>▲</button>
          <button type="button" class="btn btn-secondary btn-sm" style="padding: 0.15rem 0.3rem;" onclick="moveClient('${c.id}', 'down')" ${idx === state.clients.length - 1 ? 'disabled' : ''}>▼</button>
        </td>
        <td><strong>${c.name}</strong></td>
        <td>${c.gender}/${c.age}세 <br><span style="font-size:0.75rem; color:var(--text-muted)">${details}</span></td>
        <td>
          <span style="display:inline-block; width:18px; height:18px; border-radius:50%; background-color:${c.color || '#4f46e5'}; vertical-align:middle; margin-right:0.5rem; border:1px solid var(--border-glass)"></span>
          <code>${c.color || '#4f46e5'}</code>
        </td>
        <td>
          <div class="client-admin-actions">
            <button type="button" class="btn btn-secondary btn-sm" onclick="editClient('${c.id}')">수정</button>
            <button type="button" class="btn btn-danger btn-sm" onclick="deleteClient('${c.id}')">삭제</button>
          </div>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

function moveClient(clientId, direction) {
  const idx = state.clients.findIndex(c => c.id === clientId);
  if (idx === -1) return;
  
  if (direction === "up" && idx > 0) {
    const temp = state.clients[idx].sortOrder;
    state.clients[idx].sortOrder = state.clients[idx - 1].sortOrder;
    state.clients[idx - 1].sortOrder = temp;
  } else if (direction === "down" && idx < state.clients.length - 1) {
    const temp = state.clients[idx].sortOrder;
    state.clients[idx].sortOrder = state.clients[idx + 1].sortOrder;
    state.clients[idx + 1].sortOrder = temp;
  }
  
  // Sort and re-normalize sequence (1 to N)
  state.clients.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  state.clients.forEach((c, i) => c.sortOrder = i + 1);
  
  saveStateToLocalStorage();
  renderAdminClients();
  renderDashboardView();
  updateClientSelectors();
}
window.moveClient = moveClient;

function handleClientSubmit(e) {
  e.preventDefault();
  
  const mode = document.querySelector('input[name="client-input-mode"]:checked').value;
  const name = document.getElementById("client-name").value.trim();
  
  let gender = "";
  let age = 0;
  let rrn = "";
  
  if (mode === "rrn") {
    rrn = document.getElementById("client-rrn").value.trim();
    gender = document.getElementById("client-rrn").dataset.parsedGender;
    age = parseInt(document.getElementById("client-rrn").dataset.parsedAge);
    
    if (!gender || isNaN(age)) {
      showToast("올바른 주민번호(앞 6자리 및 뒷 1자리)를 입력해 주세요.", "danger");
      return;
    }
  } else {
    gender = document.getElementById("client-gender").value;
    age = parseInt(document.getElementById("client-age").value);
    
    if (isNaN(age) || age < 0) {
      showToast("올바른 나이를 입력해 주세요.", "danger");
      return;
    }
  }

  const color = document.getElementById("client-color").value;
  const sortOrder = parseInt(document.getElementById("client-order").value) || (state.clients.length + 1);

  if (state.editingClientId) {
    // Edit existing
    const idx = state.clients.findIndex(c => c.id === state.editingClientId);
    if (idx !== -1) {
      state.clients[idx] = { ...state.clients[idx], name, gender, age, rrn, color, sortOrder };
      showToast("고객 정보가 수정되었습니다.", "success");
    }
  } else {
    // Add new
    const newClient = {
      id: "client-" + Date.now(),
      name,
      gender,
      age,
      rrn,
      color,
      sortOrder
    };
    state.clients.push(newClient);
    showToast("고객이 성공적으로 등록되었습니다.", "success");
  }

  saveStateToLocalStorage();
  resetClientForm();
  renderAdminClients();
  updateClientSelectors();
}

function editClient(id) {
  const client = state.clients.find(c => c.id === id);
  if (!client) return;
  
  state.editingClientId = id;
  document.getElementById("client-submit-btn").textContent = "고객 정보 수정";
  document.getElementById("client-cancel-btn").style.display = "inline-flex";
  
  document.getElementById("client-name").value = client.name;
  
  if (client.rrn) {
    document.getElementById("client-input-mode-rrn").checked = true;
    toggleClientFormMode("rrn");
    document.getElementById("client-rrn").value = client.rrn;
    
    // Trigger input parsing manually to set labels
    const event = new Event('input');
    document.getElementById("client-rrn").dispatchEvent(event);
  } else {
    document.getElementById("client-input-mode-manual").checked = true;
    toggleClientFormMode("manual");
    document.getElementById("client-gender").value = client.gender;
    document.getElementById("client-age").value = client.age;
  }
  
  document.getElementById("client-color").value = client.color || "#4f46e5";
  document.getElementById("client-order").value = client.sortOrder || 1;
}

// Global scope bindings for inline onclicks
window.editClient = editClient;

function deleteClient(id) {
  const client = state.clients.find(c => c.id === id);
  if (!client) return;
  
  if (confirm(`고객 '${client.name}'님을 삭제하시겠습니까?\n삭제 시 해당 고객과 연결된 모든 가입 상품 및 보장 분석 내역도 함께 삭제됩니다.`)) {
    // Cascade delete contracts
    state.contracts = state.contracts.filter(c => c.clientId !== id);
    // Cascade delete coverages
    state.coverages = state.coverages.filter(c => c.clientId !== id);
    // Delete client
    state.clients = state.clients.filter(c => c.id !== id);
    
    saveStateToLocalStorage();
    showToast("고객 및 관련 정보가 삭제되었습니다.", "warning");
    
    if (state.selectedClientFilter === id) {
      state.selectedClientFilter = "all";
    }
    
    renderAdminClients();
    updateClientSelectors();
  }
}
window.deleteClient = deleteClient;

function resetClientForm() {
  state.editingClientId = null;
  document.getElementById("client-form").reset();
  document.getElementById("client-submit-btn").textContent = "고객 등록";
  document.getElementById("client-cancel-btn").style.display = "none";
  document.getElementById("rrn-inferred-info").innerHTML = "";
  
  const rrnInput = document.getElementById("client-rrn");
  delete rrnInput.dataset.parsedGender;
  delete rrnInput.dataset.parsedAge;
  
  document.getElementById("client-color").value = "#4f46e5";
  document.getElementById("client-order").value = state.clients.length + 1;
  
  // Default to RRN mode
  document.getElementById("client-input-mode-rrn").checked = true;
  toggleClientFormMode("rrn");
}
// Cancel editing client
document.getElementById("client-cancel-btn")?.addEventListener("click", resetClientForm);

// ----------------------------------------------------
// CONTRACT CRUD OPERATIONS
// ----------------------------------------------------
function renderAdminContracts() {
  const container = document.getElementById("admin-contracts-list");
  
  if (state.contracts.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:1rem;">등록된 가입 상품이 없습니다.</p>`;
    return;
  }

  let html = `
    <table class="custom-table">
      <thead>
        <tr>
          <th>대상 고객</th>
          <th>보험사</th>
          <th>상품명</th>
          <th>보험료</th>
          <th>갱신 여부</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  state.contracts.forEach(c => {
    const client = state.clients.find(cl => cl.id === c.clientId);
    const clientName = client ? client.name : "미지정";
    const dupBadge = c.isDuplicate ? ` <span class="badge badge-duplicate" style="font-size:0.75rem;">중복</span>` : "";
    
    html += `
      <tr>
        <td><strong>${clientName}</strong></td>
        <td>${c.company}</td>
        <td>${c.productName}${dupBadge}</td>
        <td>${(c.premium || 0).toLocaleString()}원</td>
        <td>${c.isRenewable}</td>
        <td>
          <div class="client-admin-actions">
            <button class="btn btn-secondary btn-sm" onclick="editContract('${c.id}')">수정</button>
            <button class="btn btn-danger btn-sm" onclick="deleteContract('${c.id}')">삭제</button>
          </div>
        </td>
      </tr>
    `;
  });
  
  html += `</tbody></table>`;
  container.innerHTML = html;
}

function handleContractSubmit(e) {
  e.preventDefault();
  
  const clientId = document.getElementById("contract-client-id").value;
  const company = document.getElementById("contract-company").value.trim();
  const productName = document.getElementById("contract-product-name").value.trim();
  const policyNumber = document.getElementById("contract-policy-number").value.trim();
  const contractDate = document.getElementById("contract-date").value.trim();
  const paymentPeriod = document.getElementById("contract-payment").value.trim();
  const isRenewable = document.getElementById("contract-renewable").value;
  const premium = parseInt(document.getElementById("contract-premium").value) || 0;
  const paymentMethod = document.getElementById("contract-payment-method").value.trim();
  const isDuplicate = document.getElementById("contract-is-duplicate").checked;

  if (!clientId) {
    showToast("대상 고객을 선택해 주세요.", "danger");
    return;
  }

  if (state.editingContractId) {
    // Edit
    const idx = state.contracts.findIndex(c => c.id === state.editingContractId);
    if (idx !== -1) {
      state.contracts[idx] = { 
        ...state.contracts[idx], 
        clientId, company, productName, policyNumber, contractDate, paymentPeriod, isRenewable, premium, paymentMethod, isDuplicate 
      };
      showToast("가입 상품 정보가 수정되었습니다.", "success");
    }
  } else {
    // Add
    const newContract = {
      id: "contract-" + Date.now(),
      clientId, company, productName, policyNumber, contractDate, paymentPeriod, isRenewable, premium, paymentMethod, isDuplicate
    };
    state.contracts.push(newContract);
    showToast("가입 상품이 성공적으로 등록되었습니다.", "success");
  }

  saveStateToLocalStorage();
  resetContractForm();
  renderAdminContracts();
  updateContractSelectors();
}

function editContract(id) {
  const contract = state.contracts.find(c => c.id === id);
  if (!contract) return;
  
  state.editingContractId = id;
  document.getElementById("contract-submit-btn").textContent = "상품 정보 수정";
  document.getElementById("contract-cancel-btn").style.display = "inline-flex";
  
  document.getElementById("contract-client-id").value = contract.clientId;
  document.getElementById("contract-company").value = contract.company;
  document.getElementById("contract-product-name").value = contract.productName;
  document.getElementById("contract-policy-number").value = contract.policyNumber;
  document.getElementById("contract-date").value = contract.contractDate;
  document.getElementById("contract-payment").value = contract.paymentPeriod;
  document.getElementById("contract-renewable").value = contract.isRenewable;
  document.getElementById("contract-premium").value = contract.premium;
  document.getElementById("contract-payment-method").value = contract.paymentMethod;
  document.getElementById("contract-is-duplicate").checked = contract.isDuplicate || false;
}
window.editContract = editContract;

function deleteContract(id) {
  const contract = state.contracts.find(c => c.id === id);
  if (!contract) return;
  
  if (confirm(`상품 '${contract.productName}'을(를) 삭제하시겠습니까?\n삭제 시 이 상품에 등록된 상세 보장분석 담보(특약) 정보들도 모두 함께 삭제됩니다.`)) {
    // Cascade delete coverages linked to this contract
    state.coverages = state.coverages.filter(c => c.contractId !== id);
    // Delete contract
    state.contracts = state.contracts.filter(c => c.id !== id);
    
    saveStateToLocalStorage();
    showToast("가입 상품 및 세부 담보가 삭제되었습니다.", "warning");
    
    renderAdminContracts();
    updateContractSelectors();
  }
}
window.deleteContract = deleteContract;

function resetContractForm() {
  state.editingContractId = null;
  document.getElementById("contract-form").reset();
  document.getElementById("contract-is-duplicate").checked = false;
  document.getElementById("contract-submit-btn").textContent = "가입 상품 등록";
  document.getElementById("contract-cancel-btn").style.display = "none";
}
document.getElementById("contract-cancel-btn")?.addEventListener("click", resetContractForm);

// ----------------------------------------------------
// COVERAGE CRUD OPERATIONS
// ----------------------------------------------------
function renderAdminCoverages() {
  const container = document.getElementById("admin-coverages-list");
  
  if (state.coverages.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:1rem;">등록된 담보 세부 분석 정보가 없습니다.</p>`;
    return;
  }

  let html = `
    <table class="custom-table">
      <thead>
        <tr>
          <th>고객</th>
          <th>대분류</th>
          <th>중분류</th>
          <th>세부 담보(특약)</th>
          <th>보장금액</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  state.coverages.forEach(c => {
    const client = state.clients.find(cl => cl.id === c.clientId);
    const clientName = client ? client.name : "미지정";
    
    html += `
      <tr>
        <td><strong>${clientName}</strong></td>
        <td><span class="badge badge-info">${c.largeCategory}</span></td>
        <td>${c.mediumCategory}</td>
        <td>${c.smallCategory}</td>
        <td style="font-weight:600; color:var(--primary);">${c.coverageAmount}</td>
        <td>
          <div class="client-admin-actions">
            <button class="btn btn-secondary btn-sm" onclick="editCoverage('${c.id}')">수정</button>
            <button class="btn btn-danger btn-sm" onclick="deleteCoverage('${c.id}')">삭제</button>
          </div>
        </td>
      </tr>
    `;
  });
  
  html += `</tbody></table>`;
  container.innerHTML = html;
}

function handleCoverageSubmit(e) {
  e.preventDefault();
  
  const clientId = document.getElementById("coverage-client-id").value;
  const contractId = document.getElementById("coverage-contract-id").value;
  const largeCategory = document.getElementById("coverage-large-cat").value;
  const mediumCategory = document.getElementById("coverage-medium-cat").value.trim();
  const smallCategory = document.getElementById("coverage-small-cat").value.trim();
  const coverageAmount = document.getElementById("coverage-amount").value.trim();
  const remarks = document.getElementById("coverage-remarks").value.trim();

  if (!clientId) {
    showToast("대상 고객을 선택해 주세요.", "danger");
    return;
  }

  if (state.editingCoverageId) {
    // Edit
    const idx = state.coverages.findIndex(c => c.id === state.editingCoverageId);
    if (idx !== -1) {
      state.coverages[idx] = { 
        ...state.coverages[idx], 
        clientId, contractId, largeCategory, mediumCategory, smallCategory, coverageAmount, remarks 
      };
      showToast("보장분석 정보가 수정되었습니다.", "success");
    }
  } else {
    // Add
    const newCoverage = {
      id: "cov-" + Date.now(),
      clientId, contractId, largeCategory, mediumCategory, smallCategory, coverageAmount, remarks
    };
    state.coverages.push(newCoverage);
    showToast("보장분석 정보가 성공적으로 등록되었습니다.", "success");
  }

  saveStateToLocalStorage();
  resetCoverageForm();
  renderAdminCoverages();
}

function editCoverage(id) {
  const cov = state.coverages.find(c => c.id === id);
  if (!cov) return;
  
  state.editingCoverageId = id;
  document.getElementById("coverage-submit-btn").textContent = "보장 정보 수정";
  document.getElementById("coverage-cancel-btn").style.display = "inline-flex";
  
  document.getElementById("coverage-client-id").value = cov.clientId;
  
  // Update contract selector for this specific client first
  updateContractSelectorForClient(cov.clientId);
  
  document.getElementById("coverage-contract-id").value = cov.contractId;
  document.getElementById("coverage-large-cat").value = cov.largeCategory;
  document.getElementById("coverage-medium-cat").value = cov.mediumCategory;
  document.getElementById("coverage-small-cat").value = cov.smallCategory;
  document.getElementById("coverage-amount").value = cov.coverageAmount;
  document.getElementById("coverage-remarks").value = cov.remarks;
}
window.editCoverage = editCoverage;

function deleteCoverage(id) {
  if (confirm("이 보장분석 담보 정보를 삭제하시겠습니까?")) {
    state.coverages = state.coverages.filter(c => c.id !== id);
    saveStateToLocalStorage();
    showToast("보장 정보가 삭제되었습니다.", "warning");
    renderAdminCoverages();
  }
}
window.deleteCoverage = deleteCoverage;

function resetCoverageForm() {
  state.editingCoverageId = null;
  document.getElementById("coverage-form").reset();
  document.getElementById("coverage-submit-btn").textContent = "보장 분석 담보 등록";
  document.getElementById("coverage-cancel-btn").style.display = "none";
}
document.getElementById("coverage-cancel-btn")?.addEventListener("click", resetCoverageForm);

// Listen to customer select in Coverage form to dynamically filter their products
document.getElementById("coverage-client-id")?.addEventListener("change", (e) => {
  updateContractSelectorForClient(e.target.value);
});

function updateContractSelectorForClient(clientId) {
  const select = document.getElementById("coverage-contract-id");
  if (!clientId) {
    select.innerHTML = '<option value="">-- 고객을 먼저 선택하세요 --</option>';
    return;
  }
  
  const clientContracts = state.contracts.filter(c => c.clientId === clientId);
  
  let html = '<option value="">직접 입력 / 기타 가입건</option>';
  clientContracts.forEach(c => {
    html += `<option value="${c.id}">${c.productName} (${c.company})</option>`;
  });
  
  select.innerHTML = html;
}

// ----------------------------------------------------
// SETTINGS PASSWORD CHANGE
// ----------------------------------------------------
function handlePasswordChangeSubmit(e) {
  e.preventDefault();
  
  const currentPass = document.getElementById("settings-current-pass").value;
  const newPass = document.getElementById("settings-new-pass").value;
  const confirmPass = document.getElementById("settings-confirm-pass").value;

  if (currentPass !== state.adminPassword) {
    showToast("현재 비밀번호가 일치하지 않습니다.", "danger");
    return;
  }

  if (newPass.length < 4) {
    showToast("새 비밀번호는 4자리 이상이어야 합니다.", "danger");
    return;
  }

  if (newPass !== confirmPass) {
    showToast("새 비밀번호 확인이 일치하지 않습니다.", "danger");
    return;
  }

  state.adminPassword = newPass;
  saveStateToLocalStorage();
  showToast("관리자 비밀번호가 성공적으로 변경되었습니다.", "success");
  document.getElementById("password-change-form").reset();
}

// Reset to Default Demo Data
function resetToDemoData() {
  if (confirm("모든 데이터를 초기화하고 김창완님의 예시 데모 데이터로 복원하시겠습니까?\n(작성 중인 데이터는 모두 유실됩니다)")) {
    localStorage.removeItem("insu_clients");
    localStorage.removeItem("insu_contracts");
    localStorage.removeItem("insu_coverages");
    localStorage.removeItem("insu_admin_password");
    
    loadStateFromLocalStorage();
    
    showToast("데이터베이스가 초기 데모 상태로 복원되었습니다.", "success");
    
    // Reset views
    resetClientForm();
    resetContractForm();
    resetCoverageForm();
    
    renderApp();
    if (state.currentView === "admin") {
      renderAdminView();
    } else {
      renderDashboardView();
    }
  }
}

// ----------------------------------------------------
// DROP-DOWN POPULATION SELECTORS IN ADMIN
// ----------------------------------------------------
function updateClientSelectors() {
  const selectors = ["contract-client-id", "coverage-client-id"];
  
  selectors.forEach(selId => {
    const select = document.getElementById(selId);
    if (!select) return;
    
    let html = '<option value="">-- 선택하세요 --</option>';
    state.clients.forEach(c => {
      html += `<option value="${c.id}">${c.name} (${c.gender}/${c.age}세)</option>`;
    });
    select.innerHTML = html;
  });
}

function updateContractSelectors() {
  // Update contract selector based on whatever client is selected in coverage form
  const clientId = document.getElementById("coverage-client-id")?.value;
  updateContractSelectorForClient(clientId);
}

// General Render coordinator
function renderApp() {
  // Update dashboard dropdown and tables
  populateClientFilters();
  renderDashboardStats();
  
  // Set initial admin widget
  const isAdmin = sessionStorage.getItem("insu_is_admin") === "true";
  updateAdminStatusWidget(isAdmin);
  
  // Update admin selectors
  updateClientSelectors();
  updateContractSelectors();
  
  if (state.currentView === "dashboard") {
    renderDashboardView();
  } else {
    renderAdminView();
  }
}

// Toast Notifications Helper
function showToast(message, type = "info") {
  const toast = document.getElementById("toast-notification");
  if (!toast) return;
  
  toast.className = `toast show`;
  
  let emoji = "ℹ️";
  if (type === "success") {
    emoji = "✅";
    toast.style.borderLeft = "4px solid var(--success)";
  } else if (type === "warning") {
    emoji = "⚠️";
    toast.style.borderLeft = "4px solid var(--warning)";
  } else if (type === "danger") {
    emoji = "❌";
    toast.style.borderLeft = "4px solid var(--danger)";
  } else {
    toast.style.borderLeft = "4px solid var(--primary)";
  }
  
  toast.innerHTML = `<span>${emoji}</span><span>${message}</span>`;
  
  // Hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Collapsible Dashboard Panels Handler
function togglePanel(panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  
  panel.classList.toggle("collapsed");
  const indicator = panel.querySelector(".collapse-indicator");
  if (indicator) {
    if (panel.classList.contains("collapsed")) {
      indicator.textContent = "▼";
    } else {
      indicator.textContent = "▲";
    }
  }
}
window.togglePanel = togglePanel;

function toggleMobileForced() {
  const isForced = document.body.classList.toggle("mobile-forced");
  const btn = document.getElementById("btn-mobile-toggle");
  
  if (isForced) {
    btn.innerHTML = "<span>🖥️</span> 데스크톱 뷰";
    showToast("모바일 시뮬레이션 뷰가 활성화되었습니다.", "info");
    
    // Auto-collapse Part 2 and Part 3 when entering mobile forced view
    document.getElementById("panel-part2")?.classList.add("collapsed");
    const ind2 = document.getElementById("panel-part2")?.querySelector(".collapse-indicator");
    if (ind2) ind2.textContent = "▼";

    document.getElementById("panel-part3")?.classList.add("collapsed");
    const ind3 = document.getElementById("panel-part3")?.querySelector(".collapse-indicator");
    if (ind3) ind3.textContent = "▼";
  } else {
    btn.innerHTML = "<span>📱</span> 모바일 뷰";
    showToast("데스크톱 뷰로 복원되었습니다.", "info");
    
    // Expand panels when restoring desktop view
    document.getElementById("panel-part2")?.classList.remove("collapsed");
    const ind2 = document.getElementById("panel-part2")?.querySelector(".collapse-indicator");
    if (ind2) ind2.textContent = "▲";

    document.getElementById("panel-part3")?.classList.remove("collapsed");
    const ind3 = document.getElementById("panel-part3")?.querySelector(".collapse-indicator");
    if (ind3) ind3.textContent = "▲";
  }
  
  // Redraw charts to fit the simulated container width
  renderCharts();
}
window.toggleMobileForced = toggleMobileForced;

// ----------------------------------------------------
// GEMINI AI INSURANCE SEARCH INTEGRATION
// ----------------------------------------------------
function handleModelSelectChange() {
  const select = document.getElementById("gemini-model-select");
  const wrapper = document.getElementById("custom-model-input-wrapper");
  if (select && wrapper) {
    wrapper.style.display = select.value === "custom" ? "block" : "none";
  }
}
window.handleModelSelectChange = handleModelSelectChange;

function saveGeminiKey() {
  const input = document.getElementById("gemini-api-key");
  const key = input.value.trim();
  if (!key) {
    showToast("API Key를 입력해 주세요.", "warning");
    return;
  }
  
  // Format validation for Google API Keys (supports legacy 'AIza' and new secure 'AQ.' prefixes)
  const isValidPrefix = key.startsWith("AIzaSy") || key.startsWith("AQ.");
  const isValidLength = key.length >= 35 && key.length <= 60;
  
  if (!isValidPrefix || !isValidLength) {
    showToast("올바른 구글 API Key 형식(AIzaSy 또는 AQ.로 시작하는 키)이 아닙니다.", "danger");
    return;
  }
  
  const modelSelect = document.getElementById("gemini-model-select");
  let modelVal = modelSelect.value;
  if (modelVal === "custom") {
    modelVal = document.getElementById("custom-gemini-model").value.trim();
    if (!modelVal) {
      showToast("커스텀 모델명을 입력해 주세요.", "warning");
      return;
    }
  }
  
  localStorage.setItem("insu_gemini_key", key);
  localStorage.setItem("insu_gemini_model", modelVal);
  showToast("설정이 브라우저에 안전하게 저장되었습니다.", "success");
  
  // Toggle delete button
  document.getElementById("btn-clear-gemini-key").style.display = "inline-flex";
}
window.saveGeminiKey = saveGeminiKey;

function clearGeminiKey() {
  localStorage.removeItem("insu_gemini_key");
  localStorage.removeItem("insu_gemini_model");
  
  const input = document.getElementById("gemini-api-key");
  if (input) input.value = "";
  
  const select = document.getElementById("gemini-model-select");
  if (select) {
    select.value = "gemini-2.5-flash";
    handleModelSelectChange();
  }
  
  const clearBtn = document.getElementById("btn-clear-gemini-key");
  if (clearBtn) clearBtn.style.display = "none";
  
  showToast("API 설정이 코드 기본값으로 초기화되었습니다.", "info");
}
window.clearGeminiKey = clearGeminiKey;

function loadGeminiKey() {
  let key = localStorage.getItem("insu_gemini_key");
  const model = localStorage.getItem("insu_gemini_model") || "gemini-2.5-flash";
  
  const input = document.getElementById("gemini-api-key");
  if (!input) return;
  
  // Clean up corrupt bullet-point keys from previous version
  if (key && (key.includes("•") || key.includes("dot"))) {
    localStorage.removeItem("insu_gemini_key");
    localStorage.removeItem("insu_gemini_model");
    key = null;
  }
  
  const clearBtn = document.getElementById("btn-clear-gemini-key");
  
  if (key) {
    input.value = key;
    if (clearBtn) clearBtn.style.display = "inline-flex";
  } else {
    input.value = "";
    if (clearBtn) clearBtn.style.display = "none";
  }
  
  // Set model select
  const select = document.getElementById("gemini-model-select");
  if (select) {
    const options = Array.from(select.options).map(o => o.value);
    if (options.includes(model)) {
      select.value = model;
    } else {
      select.value = "custom";
      const customInput = document.getElementById("custom-gemini-model");
      if (customInput) customInput.value = model;
    }
    handleModelSelectChange();
  }
}
window.loadGeminiKey = loadGeminiKey;

async function searchAICoverage() {
  const defaultKey = atob("QVEuQWI4Uk42TEZsbUg3S0lsOXItRUE5Q21VWXJmUUc3aVp1TXNoLWREb2dHSnZnUmlkZ0E=");
  const key = localStorage.getItem("insu_gemini_key") || defaultKey;
  if (!key) {
    showToast("사용 가능한 Gemini API Key가 없습니다. 관리자 모드에서 설정해 주세요.", "warning");
    return;
  }
  
  const query = document.getElementById("ai-search-query").value.trim();
  if (!query) {
    showToast("질문을 입력해 주세요.", "warning");
    return;
  }
  
  const resultDiv = document.getElementById("ai-search-result");
  resultDiv.style.display = "block";
  resultDiv.innerHTML = `
    <div class="ai-pulse-loading">
      <div class="ai-pulse-spinner"></div>
      <div style="font-weight:600; color:var(--primary);">AI 보험 비서가 데이터 분석 중입니다...</div>
      <div style="font-size:0.8rem; color:var(--text-muted);">질병 정보와 가입 내역을 대조하는 중입니다.</div>
    </div>
  `;
  
  // Smooth scroll to result
  resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  
  // Determine current active filter for context fallback
  let clientNameContext = "전체 가족";
  if (state.selectedClientFilter !== "all") {
    const activeClient = state.clients.find(c => c.id === state.selectedClientFilter);
    if (activeClient) {
      clientNameContext = `${activeClient.name}님 (${activeClient.gender}/${activeClient.age}세)`;
    }
  }

  // Package ALL family database to allow dynamic querying across all members
  const allClients = state.clients.map(c => ({
    id: c.id,
    name: c.name,
    gender: c.gender,
    age: c.age
  }));
  
  const allContracts = state.contracts.map(c => {
    const client = state.clients.find(cl => cl.id === c.clientId);
    return {
      clientName: client ? client.name : "미지정",
      company: c.company,
      productName: c.productName,
      premium: c.premium,
      paymentMethod: c.paymentMethod,
      contractDate: c.contractDate,
      status: c.status
    };
  });
  
  const allCoverages = state.coverages.map(c => {
    const client = state.clients.find(cl => cl.id === c.clientId);
    const parentContract = state.contracts.find(con => con.id === c.contractId);
    return {
      clientName: client ? client.name : "미지정",
      productName: parentContract ? parentContract.productName : "직접 입력/기타",
      company: parentContract ? parentContract.company : "기타",
      largeCategory: c.largeCategory,
      mediumCategory: c.mediumCategory,
      smallCategory: c.smallCategory,
      coverageAmount: c.coverageAmount,
      remarks: c.remarks
    };
  });
  
  const prompt = `당신은 대한민국 최고 수준의 전문 보험 보장분석 AI 비서입니다.
사용자의 질문(질병, 입원/수술, 특정 보험사, 특정 가족 구성원 언급 등)을 아래 전체 가족 보험 가입 데이터베이스와 정밀 대조하여 답변해 주세요.

[현재 대시보드 선택 기준 대상]
- 현재 필터링된 대상: ${clientNameContext} (만약 사용자가 질문에서 다른 구성원의 이름을 언급했다면, 이 필터를 무시하고 질문에 언급된 구성원의 데이터를 기준으로 분석하세요.)

[전체 가족 구성원 목록]
${JSON.stringify(allClients, null, 2)}

[전체 가입 상품 목록]
${JSON.stringify(allContracts, null, 2)}

[전체 세부 보장 담보(특약) 목록]
${JSON.stringify(allCoverages, null, 2)}

[사용자 질의]
"${query}"

[분석 및 답변 핵심 지침]
1. **대상자 파악**: 사용자의 질문에서 특정 인물(예: 김창완, 오외점, 박상미, 김지우 등)이 언급되었는지 확인하세요. 
   - 언급되었다면 반드시 그 대상자의 데이터만 필터링하여 답변을 작성하세요.
   - 이름이 언급되지 않았다면, [현재 대시보드 선택 기준 대상]인 "${clientNameContext}"을 기본 대상으로 설정하여 분석하세요.
2. **보험사 및 상품명 매칭**: 질문에 특정 보험사(예: 한화생명, 현대해상, 삼성화재 등)나 상품명(예: 입원보험, 암보험 등)이 언급된 경우, 해당 조건에 맞는 상품 목록과 세부 급부 내역만 정확하게 추출하여 매칭하세요.
3. **세부 담보 및 보장내용 분석**:
   - 예: "입원" 관련 질문인 경우 -> '수술/입원' 대분류나 입원일당 특약, 실손의료비 통원/입원 특약을 찾아서 분석하세요.
   - 예: "일반암" 관련 질문인 경우 -> 암진단비, 일반암 진단비 특약을 찾아 보장 금액을 안내하세요.
4. **합산 및 중복 보장 계산**: 동일 대상자가 여러 상품에서 동일한 보장(예: 입원일당 3만원 + 2만원 = 총 5만원)을 받는 경우, 합산된 금액을 직관적으로 명시하세요.
5. **정직하고 친절한 답변**: 
   - 날조된 데이터를 사용하지 말고 오직 제공된 데이터베이스 안에서만 사실을 기반으로 작성하세요.
   - 관련된 가입 정보나 보장이 전혀 없는 경우, 가입된 내용이 없음을 명확히 알리고 조언해 주세요.

[답변 출력 마크다운 포맷]
질문 성격에 따라 가장 가독성 높은 형태로 유연하게 작성하되, 아래 요소를 포함하세요:
- **요약**: 질문에 대한 핵심 답변 (대상자, 상품 개수, 총 보장 금액 등)
- **가입 상품 및 세부 보장 내역**: 깔끔한 테이블 형식 (대상자, 보험사, 상품명, 특약명, 보장금액, 비고)
- **AI 조언 및 분석 의견**: 중복 보장 여부, 보장 공백(Gaps), 혹은 약관상 유의사항(갱신 여부, 면책 등) 조언`;

  const selectedModel = localStorage.getItem("insu_gemini_model") || "gemini-2.5-flash";
  
  const attempts = [
    { url: `https://generativelanguage.googleapis.com/v1/models/${selectedModel}:generateContent?key=${key}`, name: selectedModel },
    { url: `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${key}`, name: `${selectedModel} (v1beta)` }
  ];
  
  // If using default flash variants, append additional flash fallbacks
  if (selectedModel.includes("gemini-2.5-flash") || selectedModel.includes("gemini-1.5-flash")) {
    const backupModel = selectedModel.includes("gemini-2.5-flash") ? "gemini-2.5-flash-lite" : "gemini-2.5-flash";
    attempts.push(
      { url: `https://generativelanguage.googleapis.com/v1/models/${backupModel}:generateContent?key=${key}`, name: backupModel },
      { url: `https://generativelanguage.googleapis.com/v1beta/models/${backupModel}:generateContent?key=${key}`, name: `${backupModel} (v1beta)` },
      { url: `https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent?key=${key}`, name: "gemini-3.5-flash" }
    );
  }
  
  let response = null;
  let firstError = null;
  let lastError = null;
  
  try {
    for (const attempt of attempts) {
      try {
        response = await fetch(attempt.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": key
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          })
        });
        
        if (response.ok) {
          lastError = null;
          break; // Exit loop on success
        } else {
          const errData = await response.json();
          const errMsg = errData.error?.message || `HTTP ${response.status}`;
          if (!firstError) firstError = errMsg;
          lastError = errMsg;
        }
      } catch (e) {
        if (!firstError) firstError = e.message;
        lastError = e.message;
      }
    }
    
    if (!response || !response.ok) {
      throw new Error(firstError || "모든 Gemini 모델의 호출에 실패하였습니다.");
    }
    
    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "답변을 생성할 수 없습니다.";
    
    resultDiv.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-glass); padding-bottom:0.75rem; margin-bottom:1rem;">
        <span style="font-weight:700; color:var(--primary); font-size:1.05rem;">🤖 AI 분석 보고서</span>
        <button class="btn btn-secondary btn-sm" onclick="document.getElementById('ai-search-result').style.display='none'" style="padding:0.25rem 0.5rem;">닫기</button>
      </div>
      <div class="ai-rendered-content">
        ${parseMarkdownToHtml(replyText)}
      </div>
    `;
    
  } catch (error) {
    resultDiv.innerHTML = `
      <div style="color:var(--danger); font-weight:600; padding:1rem; border:1px solid var(--danger-light); background-color:var(--danger-light); border-radius:var(--radius-md);">
        ⚠️ 에러 발생: ${error.message}
        <br><span style="font-size:0.8rem; font-weight:normal; color:var(--text-main); margin-top:0.5rem; display:block;">API Key가 올바른지 확인해 주세요.</span>
      </div>
    `;
  }
}
window.searchAICoverage = searchAICoverage;

function runQuickAIQuery(text) {
  document.getElementById("ai-search-query").value = text;
  searchAICoverage();
}
window.runQuickAIQuery = runQuickAIQuery;

function parseMarkdownToHtml(md) {
  if (!md) return "";
  
  let text = md.trim();
  text = text.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '');
  
  // Headings
  text = text.replace(/^### (.*$)/gim, '<h4 style="margin-top:1rem; margin-bottom:0.5rem; color:var(--primary); font-weight:700;">$1</h4>');
  text = text.replace(/^## (.*$)/gim, '<h3 style="margin-top:1.25rem; margin-bottom:0.75rem; color:var(--text-main); font-weight:700; border-bottom:1px solid var(--border-glass); padding-bottom:0.25rem;">$1</h3>');
  text = text.replace(/^# (.*$)/gim, '<h2 style="margin-top:1.5rem; margin-bottom:1rem; color:var(--text-main); font-weight:800;">$1</h2>');
  
  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Blockquotes
  text = text.replace(/^\>\s?(.*$)/gim, '<blockquote>$1</blockquote>');
  
  // Lists
  text = text.replace(/^\s*-\s*(.*$)/gim, '<li style="margin-left:1.5rem; margin-bottom:0.35rem;">$1</li>');
  text = text.replace(/^\s*\*\s*(.*$)/gim, '<li style="margin-left:1.5rem; margin-bottom:0.35rem;">$1</li>');
  
  // Convert markdown tables
  const lines = text.split('\n');
  let inTable = false;
  let tableHtml = '';
  let processedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableHtml = '<table class="custom-table" style="margin: 1rem 0; width:100%; border-collapse:collapse;"><thead>';
      }
      
      const cells = line.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
      
      if (line.includes('---')) {
        tableHtml += '</thead><tbody>';
        continue;
      }
      
      const rowTag = tableHtml.includes('<tbody>') ? 'td' : 'th';
      tableHtml += '<tr>';
      cells.forEach(cell => {
        const cellFormatted = cell.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        if (rowTag === 'th') {
          tableHtml += `<th style="background-color:#1e3a8a; color:#ffffff; font-weight:600; padding:0.625rem 0.875rem; border:1px solid var(--border-glass);">${cellFormatted}</th>`;
        } else {
          tableHtml += `<td style="padding:0.625rem 0.875rem; border:1px solid var(--border-glass);">${cellFormatted}</td>`;
        }
      });
      tableHtml += '</tr>';
    } else {
      if (inTable) {
        inTable = false;
        tableHtml += '</tbody></table>';
        processedLines.push(tableHtml);
        tableHtml = '';
      }
      processedLines.push(line);
    }
  }
  if (inTable) {
    tableHtml += '</tbody></table>';
    processedLines.push(tableHtml);
  }
  
  text = processedLines.join('\n');
  text = text.replace(/\n/g, '<br>');
  text = text.replace(/<\/tr><br><tr>/g, '</tr><tr>');
  text = text.replace(/<\/table><br>/g, '</table>');
  
  return text;
}
