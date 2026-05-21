// Translations
const translations = {
    en: {
        home: "Home",
        scanner: "Scanner",
        dashboard: "Dashboard",
        signIn: "Sign In",
        logout: "Logout",
        uploadFile: "Upload Your File",
        dragDrop: "Drag and drop or click to upload",
        analyze: "Analyze Now",
        clearFile: "Clear File",
        aiScore: "AI Score",
        humanScore: "Human Score",
        confidenceLevel: "Confidence Level",
        overallExplanation: "Overall Explanation",
        suspiciousLines: "Suspicious Lines",
        download: "Download",
        analyzAnother: "Analyze Another File",
        studentName: "Student Name",
        studentId: "Student ID",
        classId: "Class ID",
    },
    uz: {
        home: "Bosh sahifa",
        scanner: "Skanerlagich",
        dashboard: "Boshqaruv paneli",
        signIn: "Kirish",
        logout: "Chiqish",
        uploadFile: "Faylni yuklang",
        dragDrop: "Surib tashlang yoki bosing",
        analyze: "Tahlil qiling",
        clearFile: "Faylni o'chirish",
        aiScore: "AI Ball",
        humanScore: "Inson Ball",
        confidenceLevel: "Ishonch Darajasi",
        overallExplanation: "Umumiy Tushuntirish",
        suspiciousLines: "Shubhali Qatorlar",
        download: "Yuklab olish",
        analyzAnother: "Boshqa Faylni Tahlil Qiling",
        studentName: "O'quvchi Ismi",
        studentId: "O'quvchi ID",
        classId: "Sinf ID",
    },
    ru: {
        home: "Главная",
        scanner: "Сканер",
        dashboard: "Панель управления",
        signIn: "Вход",
        logout: "Выход",
        uploadFile: "Загрузить файл",
        dragDrop: "Перетащите или нажмите для загрузки",
        analyze: "Анализировать",
        clearFile: "Очистить файл",
        aiScore: "Оценка ИИ",
        humanScore: "Оценка Человека",
        confidenceLevel: "Уровень доверия",
        overallExplanation: "Общее объяснение",
        suspiciousLines: "Подозрительные строки",
        download: "Скачать",
        analyzAnother: "Анализировать другой файл",
        studentName: "Имя студента",
        studentId: "ID студента",
        classId: "ID класса",
    }
};

// State
let currentLang = localStorage.getItem('language') || 'en';
let currentTheme = localStorage.getItem('theme') || 'dark';
let uploadedFile = null;
let currentReport = null;
let session = localStorage.getItem('detector-user') ? JSON.parse(localStorage.getItem('detector-user')) : null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    applyTheme(currentTheme);
    setupEventListeners();
    updateUI();
});

// Theme Management
function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    applyTheme(currentTheme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.textContent = theme === 'dark' ? '🌙 Dark' : '☀️ Light';
}

// Language Management
function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
}

// Tab Management
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Reset scanner when switching
    if (tabName === 'scanner') {
        resetUpload();
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Language select
    document.getElementById('lang-select').addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });

    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchTab(e.target.dataset.tab);
        });
    });

    // Auth button
    document.getElementById('auth-btn').addEventListener('click', () => {
        if (session) {
            handleLogout();
        } else {
            openAuth();
        }
    });

    // File upload
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');

    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = 'rgba(34, 211, 238, 0.2)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.background = '';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = '';
        if (e.dataTransfer.files.length) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFileSelect(e.target.files[0]);
        }
    });
}

// File handling
function handleFileSelect(file) {
    uploadedFile = file;
    document.getElementById('upload-area').style.display = 'none';
    document.getElementById('file-form').style.display = 'flex';
}

function resetUpload() {
    uploadedFile = null;
    document.getElementById('upload-area').style.display = 'block';
    document.getElementById('file-form').style.display = 'none';
    document.getElementById('file-input').value = '';
    document.getElementById('student-name').value = '';
    document.getElementById('student-id').value = '';
    document.getElementById('class-id').value = '';
}

async function analyzeFile() {
    if (!uploadedFile) {
        alert('Please select a file');
        return;
    }

    const studentName = document.getElementById('student-name').value;
    const studentId = document.getElementById('student-id').value;
    const classId = document.getElementById('class-id').value;

    if (!studentName || !studentId || !classId) {
        alert('Please fill in all fields');
        return;
    }

    // Show loading spinner
    document.getElementById('loading-spinner').style.display = 'block';
    document.getElementById('file-form').style.display = 'none';

    try {
        // Read file content
        const fileContent = await uploadedFile.text();
        
        // Simulate API call or use actual backend
        // For now, we'll generate a mock report
        currentReport = generateMockReport(uploadedFile.name, fileContent, studentName, studentId, classId);
        
        // Display results
        displayResults(currentReport);
        
        // Hide loading and switch to results
        document.getElementById('loading-spinner').style.display = 'none';
        switchTab('results');

    } catch (error) {
        document.getElementById('loading-spinner').style.display = 'none';
        alert('Error analyzing file: ' + error.message);
        document.getElementById('file-form').style.display = 'flex';
    }
}

function generateMockReport(fileName, content, studentName, studentId, classId) {
    // Generate mock AI score based on content analysis
    const aiScore = Math.floor(Math.random() * 60) + 20; // 20-80
    const humanScore = 100 - aiScore;
    
    const metrics = {
        repeatedPatterns: Math.floor(Math.random() * 100),
        commentPatterns: Math.floor(Math.random() * 100),
        namingConventions: Math.floor(Math.random() * 100),
        styleConsistency: Math.floor(Math.random() * 100),
        complexityScore: Math.floor(Math.random() * 100),
    };

    const suspiciousLines = [
        {
            lineNumber: 15,
            snippet: "const result = array.map(item => item.value);",
            score: 45,
            reason: "Common AI pattern"
        },
        {
            lineNumber: 32,
            snippet: "function processData(data) {",
            score: 38,
            reason: "Generic naming convention"
        }
    ];

    const explanations = [
        "This submission shows moderate signs of AI assistance with consistent patterns throughout.",
        "The code demonstrates mixed characteristics with both typical human and AI patterns.",
        "Analysis suggests primarily human-written code with minor AI-assisted sections.",
        "The submission exhibits patterns consistent with AI-generated content.",
        "The code shows a blend of human and AI characteristics, requiring careful review.",
    ];

    return {
        id: 'report-' + Date.now(),
        title: `Analysis Report - ${fileName}`,
        studentName: studentName,
        studentId: studentId,
        classId: classId,
        fileName: fileName,
        fileSize: content.length,
        timestamp: new Date().toISOString(),
        aiScore: aiScore,
        humanScore: humanScore,
        confidenceLevel: aiScore > 70 ? 'High' : aiScore > 40 ? 'Medium' : 'Low',
        overallExplanation: explanations[Math.floor(Math.random() * explanations.length)],
        metrics: metrics,
        suspiciousLines: suspiciousLines,
    };
}

function displayResults(report) {
    // Update scores
    document.getElementById('ai-score').textContent = report.aiScore + '%';
    document.getElementById('human-score').textContent = report.humanScore + '%';
    document.getElementById('ai-fill').style.width = report.aiScore + '%';
    document.getElementById('human-fill').style.width = report.humanScore + '%';

    // Update confidence
    document.getElementById('confidence-level').textContent = report.confidenceLevel;

    // Update explanation
    document.getElementById('explanation-text').textContent = report.overallExplanation;

    // Update metrics
    document.getElementById('metric-repeated').textContent = report.metrics.repeatedPatterns + '%';
    document.getElementById('metric-comments').textContent = report.metrics.commentPatterns + '%';
    document.getElementById('metric-naming').textContent = report.metrics.namingConventions + '%';
    document.getElementById('metric-style').textContent = report.metrics.styleConsistency + '%';

    // Update suspicious lines
    const suspiciousList = document.getElementById('suspicious-list');
    suspiciousList.innerHTML = report.suspiciousLines.map(line => `
        <div class="suspicious-item">
            <div class="suspicious-item-header">
                <span>Line ${line.lineNumber} (Score: ${line.score}%)</span>
            </div>
            <div class="suspicious-line">${escapeHtml(line.snippet)}</div>
            <div class="suspicious-reason">Reason: ${line.reason}</div>
        </div>
    `).join('');

    // Show results
    document.getElementById('results-container').style.display = 'block';
}

function downloadReport() {
    if (!currentReport) return;

    const reportText = `
AI Homework Detector - Analysis Report
=======================================

Student: ${currentReport.studentName}
Student ID: ${currentReport.studentId}
Class ID: ${currentReport.classId}
File: ${currentReport.fileName}
Date: ${new Date(currentReport.timestamp).toLocaleString()}

SCORES
------
AI Score: ${currentReport.aiScore}%
Human Score: ${currentReport.humanScore}%
Confidence Level: ${currentReport.confidenceLevel}

EXPLANATION
-----------
${currentReport.overallExplanation}

METRICS
-------
Repeated Patterns: ${currentReport.metrics.repeatedPatterns}%
Comment Patterns: ${currentReport.metrics.commentPatterns}%
Naming Conventions: ${currentReport.metrics.namingConventions}%
Style Consistency: ${currentReport.metrics.styleConsistency}%
Complexity Score: ${currentReport.metrics.complexityScore}%

SUSPICIOUS LINES
----------------
${currentReport.suspiciousLines.map(line => `
Line ${line.lineNumber} (Score: ${line.score}%)
Code: ${line.snippet}
Reason: ${line.reason}
`).join('\n')}
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportText));
    element.setAttribute('download', `report_${currentReport.studentId}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Auth
function openAuth() {
    document.getElementById('auth-modal').style.display = 'block';
    document.getElementById('modal-overlay').style.display = 'block';
}

function closeAuth() {
    document.getElementById('auth-modal').style.display = 'none';
    document.getElementById('modal-overlay').style.display = 'none';
}

function handleAuth() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }

    // Mock authentication
    session = {
        email: email,
        token: 'mock-token-' + Date.now(),
        name: email.split('@')[0]
    };

    localStorage.setItem('detector-user', JSON.stringify(session));
    localStorage.setItem('detector-token', session.token);

    closeAuth();
    updateUI();
}

function handleLogout() {
    localStorage.removeItem('detector-user');
    localStorage.removeItem('detector-token');
    session = null;
    updateUI();
}

function updateUI() {
    const authBtn = document.getElementById('auth-btn');
    if (session) {
        authBtn.textContent = '🚪 ' + (session.name || session.email);
    } else {
        authBtn.textContent = '🔐 Sign In';
    }
}

// Utility
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Modal close on overlay click
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('modal-overlay');
    overlay.addEventListener('click', closeAuth);
});
