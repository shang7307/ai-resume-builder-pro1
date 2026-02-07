/**
 * Builder Logic
 * Handles form updates, live preview, autosave, and AI integration.
 */

// State
let resumeData = {
    fullname: '',
    jobtitle: '',
    email: '',
    phone: '',
    summary: '',
    experience: [],
    skills: '',
    logo: '',
    template: 'template-classic',
    themeColor: '#6366f1',
    font: "'Inter', sans-serif"
};

const AUTOSAVE_KEY = 'shang_resume_data';
let autoSaveTimer;

// DOM Elements
const inputs = {
    fullname: document.getElementById('fullname'),
    jobtitle: document.getElementById('jobtitle'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    summary: document.getElementById('summary'),
    skills: document.getElementById('skills'),
    logo: document.getElementById('logo-upload'),
    resColor: document.getElementById('resColor'),
    resFont: document.getElementById('resFont'),
    resTemplate: document.getElementById('resTemplate'),
    experienceList: document.getElementById('experience-list')
};

const previews = {
    name: document.getElementById('prev-name'),
    title: document.getElementById('prev-title'),
    email: document.getElementById('prev-email'),
    phone: document.getElementById('prev-phone'),
    summary: document.getElementById('prev-summary'),
    logo: document.getElementById('prev-logo'),
    experience: document.getElementById('prev-experience'),
    skills: document.getElementById('prev-skills')
};

const atsBar = document.getElementById('ats-bar');
const atsPct = document.getElementById('ats-pct');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    attachListeners();
    updateResume(); // Initial render
});

function attachListeners() {
    // Customization
    inputs.resColor.addEventListener('input', (e) => {
        resumeData.themeColor = e.target.value;
        document.documentElement.style.setProperty('--resume-color', resumeData.themeColor);
        triggerUpdate();
    });

    inputs.resFont.addEventListener('change', (e) => {
        resumeData.font = e.target.value;
        document.getElementById('resume-preview').style.fontFamily = resumeData.font;
        triggerUpdate();
    });

    inputs.logo.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                resumeData.logo = e.target.result;
                // Update sidebar preview
                const previewImg = document.getElementById('preview-upload-img');
                const placeholder = document.getElementById('upload-placeholder');
                if (previewImg) {
                    previewImg.src = resumeData.logo;
                    previewImg.style.display = 'block';
                    if (placeholder) placeholder.style.display = 'none';
                }
                triggerUpdate();
            };
            reader.readAsDataURL(file);
        }
    });

    inputs.resTemplate.addEventListener('change', (e) => {
        resumeData.template = e.target.value;
        document.getElementById('resume-preview').className = resumeData.template;
        triggerUpdate();
    });
}

// Core Update Function
function updateResume() {
    // Gather Data
    resumeData.fullname = inputs.fullname.value;
    resumeData.jobtitle = inputs.jobtitle.value;
    resumeData.email = inputs.email.value;
    resumeData.phone = inputs.phone.value;
    resumeData.summary = inputs.summary.value;
    resumeData.skills = inputs.skills.value;

    // Gather Experience
    resumeData.experience = [];
    document.querySelectorAll('.exp-item').forEach(item => {
        resumeData.experience.push({
            role: item.querySelector('.exp-role').value,
            company: item.querySelector('.exp-company').value,
            description: item.querySelector('.exp-desc').value
        });
    });

    // Render Preview
    if (resumeData.logo) {
        previews.logo.src = resumeData.logo;
        previews.logo.style.display = 'block';
    } else {
        previews.logo.style.display = 'none';
    }
    previews.name.textContent = resumeData.fullname || 'Your Name';
    previews.title.textContent = resumeData.jobtitle || 'Professional Title';
    previews.email.innerHTML = resumeData.email ? `<i class="fas fa-envelope"></i> ${resumeData.email}` : '';
    previews.phone.innerHTML = resumeData.phone ? `<i class="fas fa-phone"></i> ${resumeData.phone}` : '';
    previews.summary.textContent = resumeData.summary || 'Summary...';

    // Render Skills
    previews.skills.innerHTML = '';
    if (resumeData.skills) {
        resumeData.skills.split(',').forEach(skill => {
            const span = document.createElement('span');
            span.style.cssText = `background: #f3f4f6; padding: 4px 10px; border-radius: 4px; font-size: 0.85rem; font-weight: 500;`;
            span.textContent = skill.trim();
            previews.skills.appendChild(span);
        });
    }

    // Render Experience
    previews.experience.innerHTML = '';
    resumeData.experience.forEach(exp => {
        if (exp.role || exp.company) {
            const div = document.createElement('div');
            div.style.marginBottom = '15px';
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-weight:700; font-size:1.05rem;">${exp.role}</div>
                    <div style="font-style:italic;">${exp.company}</div>
                </div>
                <div style="font-size:0.9rem; color:#444; margin-top:4px;">${exp.description}</div>
            `;
            previews.experience.appendChild(div);
        }
    });

    triggerUpdate();
}

function triggerUpdate() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        saveToStorage();
        updateATS();
    }, 1000);
}

// Storage
function saveToStorage() {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(resumeData));
    const status = document.getElementById('autosave-status');
    status.style.opacity = '1';
    status.innerHTML = '<i class="fas fa-sync fa-spin"></i> Saving...';
    setTimeout(() => {
        status.innerHTML = '<i class="fas fa-check"></i> Saved';
        setTimeout(() => status.style.opacity = '0.6', 2000);
    }, 500);
}

function loadFromStorage() {
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved) {
        resumeData = JSON.parse(saved);

        // Populate fields
        inputs.fullname.value = resumeData.fullname || '';
        inputs.jobtitle.value = resumeData.jobtitle || '';
        inputs.email.value = resumeData.email || '';
        inputs.phone.value = resumeData.phone || '';
        inputs.summary.value = resumeData.summary || '';
        inputs.skills.value = resumeData.skills || '';
        if (resumeData.logo) {
            // We can't re-set the file input value for security reasons,
            // but we can ensure the preview is updated if we had the dataURL.
            // For this simple mock, we persist the dataURL in localStorage.
            const previewImg = document.getElementById('preview-upload-img');
            const placeholder = document.getElementById('upload-placeholder');
            if (previewImg) {
                previewImg.src = resumeData.logo;
                previewImg.style.display = 'block';
                if (placeholder) placeholder.style.display = 'none';
            }
        }
        inputs.resColor.value = resumeData.themeColor || '#6366f1';
        inputs.resFont.value = resumeData.font || "'Inter', sans-serif";
        inputs.resTemplate.value = resumeData.template || 'template-classic';

        // Apply styles
        document.documentElement.style.setProperty('--resume-color', resumeData.themeColor);
        document.getElementById('resume-preview').style.fontFamily = resumeData.font;
        document.getElementById('resume-preview').className = resumeData.template || 'template-classic';

        // Restore Experience
        const list = inputs.experienceList;
        list.innerHTML = ''; // Clear default
        if (resumeData.experience.length > 0) {
            resumeData.experience.forEach(exp => {
                const item = createExperienceItem(exp.role, exp.company, exp.description);
                list.appendChild(item);
            });
        } else {
            // Add one empty if none
            list.appendChild(createExperienceItem());
        }
    } else {
        // Initial clean state
        inputs.experienceList.innerHTML = '';
        inputs.experienceList.appendChild(createExperienceItem());
    }
}

function createExperienceItem(role = '', company = '', desc = '') {
    const div = document.createElement('div');
    div.className = 'exp-item';
    div.innerHTML = `
        <div style="margin-bottom: 10px; border-bottom: 1px dashed #eee; padding-bottom: 10px;">
            <input type="text" class="form-input exp-role" placeholder="Role/Position" value="${role}" oninput="updateResume()">
            <input type="text" class="form-input exp-company" placeholder="Company" value="${company}" oninput="updateResume()">
            <textarea class="form-input exp-desc" placeholder="Responsibilities" rows="3" oninput="updateResume()">${desc}</textarea>
            <div style="text-align: right;">
                 <button class="ai-improve-btn" type="button" onclick="improveExperience(this)"><i class="fas fa-robot"></i> AI Fix</button>
                 <button class="ai-improve-btn" style="background: #ef4444;" type="button" onclick="removeExperience(this)"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `;
    return div;
}

function addExperience() {
    inputs.experienceList.appendChild(createExperienceItem());
}

function removeExperience(btn) {
    btn.closest('.exp-item').remove();
    updateResume();
}

// AI Integration
async function improveText(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field.value.trim()) return;

    const originalText = field.value;
    const btn = event.currentTarget || document.activeElement;
    const originalContent = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Improving...';
    btn.disabled = true;

    try {
        const improved = await mockAIImprove(originalText, fieldId);
        field.value = improved;
        updateResume();
    } catch (e) {
        console.error(e);
    } finally {
        btn.innerHTML = originalContent;
        btn.disabled = false;
    }
}

async function improveExperience(btn) {
    const container = btn.closest('.exp-item');
    const descField = container.querySelector('.exp-desc');

    if (!descField.value.trim()) return;

    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    try {
        const improved = await mockAIImprove(descField.value, 'experience');
        descField.value = improved;
        updateResume();
    } finally {
        btn.innerHTML = originalContent;
        btn.disabled = false;
    }
}

function updateATS() {
    if (typeof calculateATSScore === 'function') {
        const score = calculateATSScore(resumeData);
        atsBar.style.width = `${score}%`;
        atsPct.textContent = `${score}%`;

        // Color coding
        if (score < 50) atsBar.style.backgroundColor = '#ef4444';
        else if (score < 80) atsBar.style.backgroundColor = '#f59e0b';
        else atsBar.style.backgroundColor = '#10b981';
    }
}

function autoFillDemo() {
    inputs.fullname.value = "Shang";
    inputs.jobtitle.value = "Full Stack Developer";
    inputs.email.value = "shang@example.com";
    inputs.phone.value = "+1 555-0123";
    inputs.summary.value = "Passionate developer with experience in building web applications using modern technologies. Strong problem-solving skills.";
    inputs.skills.value = "JavaScript, HTML5, CSS3, Node.js, React";

    // Clear exp
    inputs.experienceList.innerHTML = '';
    const item1 = createExperienceItem("Frontend Developer", "Tech Corp", "Worked on the main website dashboard. Fixed bugs and improved performance.");
    inputs.experienceList.appendChild(item1);

    updateResume();
}

// Add Experience Button (Dynamic append)
const addExpBtn = document.createElement('button');
addExpBtn.className = 'btn glass';
addExpBtn.style.width = '100%';
addExpBtn.style.marginTop = '10px';
addExpBtn.innerHTML = '<i class="fas fa-plus"></i> Add Position';
addExpBtn.onclick = addExperience;
inputs.experienceList.after(addExpBtn);

// Import AI Engine script dynamically if not present
if (typeof mockAIImprove !== 'function') {
    const script = document.createElement('script');
    script.src = 'js/ai-engine.js';
    document.body.appendChild(script);
}
