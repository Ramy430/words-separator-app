import { initFirebase, saveWithBackup, retryFailedBackups, isFirebaseReady } from './saveToFirebase.js';

document.addEventListener('DOMContentLoaded', function() {
    const processBtn = document.getElementById('processBtn');
    const resetBtn = document.getElementById('resetBtn');
    const totalBtn = document.getElementById('totalBtn');
    const inputText = document.getElementById('inputText');
    const wordsContainer = document.getElementById('wordsContainer');
    const saveJsonBtn = document.getElementById('saveJsonBtn');
    const copyJsonBtn = document.getElementById('copyJsonBtn');
    const importJsonBtn = document.getElementById('importJsonBtn');
    const jsonFileInput = document.getElementById('jsonFileInput');
    const notification = document.getElementById('notification');
    const languageSelect = document.getElementById('languageSelect');
    const totalDisplay = document.getElementById('totalDisplay');
    const uniqueWordsContainer = document.getElementById('uniqueWords');
    
    let analyzedWords = [];
    let uniqueWordsSet = new Set();
    
    // Initialize Firebase
    initFirebase();
    
    // Retry failed backups every 30 seconds
    setInterval(retryFailedBackups, 30000);
    
    // Retry backups when coming online
    window.addEventListener('online', retryFailedBackups);
    
    // ==================== NOTIFICATION FUNCTION ====================
    function showNotification(message, isWarning = false) {
        notification.textContent = message;
        notification.className = isWarning ? 'notification warning' : 'notification';
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
    
    // ==================== PROCESS TEXT FUNCTION ====================
    function processText() {
        const text = inputText.value.trim();
        if (!text) {
            showNotification('Please enter some text', true);
            return;
        }
        
        // Split text into words (including Chinese characters)
        const words = text.split(/[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]+/);
        
        analyzedWords = [];
        uniqueWordsSet.clear();
        
        words.forEach(word => {
            if (word.length > 0) {
                analyzedWords.push({
                    word: word,
                    translation: '',
                    learned: false
                });
                uniqueWordsSet.add(word);
            }
        });
        
        displayWords();
        updateUniqueWordsCount();
        showNotification(`Processed ${analyzedWords.length} words`);
    }
    
    // ==================== DISPLAY WORDS FUNCTION ====================
    function displayWords() {
        wordsContainer.innerHTML = '';
        analyzedWords.forEach((item, index) => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word-item';
            wordElement.innerHTML = `
                <span class="word-text">${item.word}</span>
                <input type="text" 
                       class="translation-input" 
                       placeholder="Translation" 
                       value="${item.translation}"
                       data-index="${index}">
                <label class="learned-checkbox">
                    <input type="checkbox" ${item.learned ? 'checked' : ''} data-index="${index}">
                    Learned
                </label>
            `;
            wordsContainer.appendChild(wordElement);
        });
        
        // Add event listeners to translation inputs
        document.querySelectorAll('.translation-input').forEach(input => {
            input.addEventListener('input', function() {
                const index = parseInt(this.dataset.index);
                analyzedWords[index].translation = this.value;
            });
        });
        
        // Add event listeners to checkboxes
        document.querySelectorAll('.learned-checkbox input').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const index = parseInt(this.dataset.index);
                analyzedWords[index].learned = this.checked;
            });
        });
    }
    
    // ==================== UPDATE UNIQUE WORDS COUNT ====================
    function updateUniqueWordsCount() {
        const uniqueCount = uniqueWordsSet.size;
        const totalCount = analyzedWords.length;
        totalDisplay.textContent = `Total: ${totalCount} words | Unique: ${uniqueCount} words`;
    }
    
    // ==================== RESET FUNCTION ====================
    function resetAll() {
        inputText.value = '';
        analyzedWords = [];
        uniqueWordsSet.clear();
        wordsContainer.innerHTML = '';
        totalDisplay.textContent = 'Total: 0 words | Unique: 0 words';
        showNotification('All data cleared');
    }
    
    // ==================== SAVE TO FIREBASE ====================
    async function saveToCloud() {
        if (analyzedWords.length === 0) {
            showNotification('No words to save', true);
            return;
        }
        
        const dataToSave = {
            words: analyzedWords,
            uniqueWords: Array.from(uniqueWordsSet),
            timestamp: new Date().toISOString(),
            language: languageSelect.value,
            totalWords: analyzedWords.length,
            uniqueWordsCount: uniqueWordsSet.size
        };
        
        try {
            await saveWithBackup(dataToSave, 'translations');
        } catch (error) {
            console.error('Save failed:', error);
        }
    }
    
    // ==================== EXPORT AS JSON ====================
    function exportAsJson() {
        if (analyzedWords.length === 0) {
            showNotification('No words to export', true);
            return;
        }
        
        const data = {
            words: analyzedWords,
            uniqueWords: Array.from(uniqueWordsSet),
            metadata: {
                exportedAt: new Date().toISOString(),
                language: languageSelect.value,
                totalWords: analyzedWords.length,
                uniqueWordsCount: uniqueWordsSet.size
            }
        };
        
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `translations-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('JSON file downloaded');
    }
    
    // ==================== COPY JSON TO CLIPBOARD ====================
    function copyJsonToClipboard() {
        if (analyzedWords.length === 0) {
            showNotification('No words to copy', true);
            return;
        }
        
        const data = {
            words: analyzedWords,
            uniqueWords: Array.from(uniqueWordsSet),
            metadata: {
                copiedAt: new Date().toISOString(),
                language: languageSelect.value
            }
        };
        
        const jsonString = JSON.stringify(data, null, 2);
        
        navigator.clipboard.writeText(jsonString).then(() => {
            showNotification('JSON copied to clipboard!');
        }).catch(err => {
            showNotification('Failed to copy to clipboard', true);
            console.error('Copy failed:', err);
        });
    }
    
    // ==================== IMPORT JSON ====================
    function importJson(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.words && Array.isArray(data.words)) {
                    analyzedWords = data.words;
                    uniqueWordsSet = new Set(data.uniqueWords || []);
                    
                    displayWords();
                    updateUniqueWordsCount();
                    showNotification('JSON imported successfully!');
                    
                    // Auto-save to cloud after import
                    saveToCloud();
                } else {
                    showNotification('Invalid JSON format', true);
                }
            } catch (error) {
                showNotification('Error parsing JSON file', true);
                console.error('Import error:', error);
            }
        };
        
        reader.onerror = function() {
            showNotification('Error reading file', true);
        };
        
        reader.readAsText(file);
    }
    
    // ==================== EVENT LISTENERS ====================
    processBtn.addEventListener('click', processText);
    
    resetBtn.addEventListener('click', resetAll);
    
    totalBtn.addEventListener('click', function() {
        updateUniqueWordsCount();
        showNotification(`Total: ${analyzedWords.length} words | Unique: ${uniqueWordsSet.size} words`);
    });
    
    saveJsonBtn.addEventListener('click', saveToCloud);
    
    copyJsonBtn.addEventListener('click', copyJsonToClipboard);
    
    importJsonBtn.addEventListener('click', function() {
        jsonFileInput.click();
    });
    
    jsonFileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            importJson(e.target.files[0]);
        }
    });
    
    languageSelect.addEventListener('change', function() {
        showNotification(`Language changed to: ${this.value}`);
    });
    
    // Initial setup
    showNotification('Welcome! Enter text to begin analyzing');
});