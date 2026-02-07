/**
 * Mock AI Engine for Resume Builder
 * Simulates AI behavior for text improvement and ATS scoring without an API.
 */

const AI_DICTIONARY = {
    "managed": "Orchestrated",
    "led": "Spearheaded",
    "worked on": "Executed",
    "made": "Developed",
    "helped": "Facilitated",
    "fixed": "Resolved",
    "talked": "Negotiated",
    "sold": "Generated revenue of",
    "responsive": "mobile-first, responsive",
    "good": "exceptional",
    "fast": "high-performance"
};

const PROFESSIONAL_PHRASES = [
    "Demonstrated strong leadership in...",
    "Proven track record of...",
    "Successfully implemented...",
    "Collaborated with cross-functional teams to...",
    "Optimized workflow efficiency by...",
    "Leveraged advanced technologies to..."
];

/**
 * mocks an AI text improvement.
 * Replaces weak words with strong action verbs and adds professional phrasing.
 * @param {string} text - The user input text.
 * @param {string} context - The field context (e.g., 'summary', 'experience').
 * @returns {Promise<string>} - The improved text.
 */
async function mockAIImprove(text, context) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let improved = text;

            // 1. Replace weak words
            Object.keys(AI_DICTIONARY).forEach(key => {
                const regex = new RegExp(`\\b${key}\\b`, 'gi');
                improved = improved.replace(regex, AI_DICTIONARY[key]);
            });

            // 2. Formatting polish
            improved = improved.charAt(0).toUpperCase() + improved.slice(1);
            if (!improved.endsWith('.')) improved += '.';

            // 3. Contextual addition (if text is short)
            if (text.length < 50 && context === 'summary') {
                improved = `${PROFESSIONAL_PHRASES[Math.floor(Math.random() * PROFESSIONAL_PHRASES.length)]} ${improved}`;
            }

            resolve(improved);
        }, 800); // Simulate network delay
    });
}

/**
 * Calculates a mock ATS score based on keyword density and completeness.
 * @param {Object} data - The resume data object.
 * @returns {number} - Score from 0 to 100.
 */
function calculateATSScore(data) {
    let score = 0;

    // Completeness Check (50 points)
    if (data.fullname?.length > 2) score += 10;
    if (data.email?.includes('@')) score += 10;
    if (data.phone?.length > 8) score += 5;
    if (data.summary?.length > 50) score += 10;
    if (data.experience?.some(e => e.role && e.company)) score += 10;
    if (data.skills?.length > 0) score += 5;

    // Keyword Check (Mock) (30 points)
    const text = JSON.stringify(data).toLowerCase();
    const keywords = ['team', 'led', 'developed', 'design', 'analysis', 'project', 'managed', 'customer', 'javascript', 'html', 'python', 'sales'];

    let keywordCount = 0;
    keywords.forEach(k => {
        if (text.includes(k)) keywordCount++;
    });
    score += Math.min(30, keywordCount * 3);

    // Format Check (20 points)
    // Assuming format is good if length is substantially enough
    if (text.length > 500) score += 20;
    else score += Math.floor((text.length / 500) * 20);

    return Math.min(100, Math.round(score));
}
