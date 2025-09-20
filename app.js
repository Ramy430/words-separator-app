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
    
    // Sample translations database with Tausug and Arabic added
    const translations = {
        'the': {
            en: 'the', 
            ts: 'in', 
            ar: 'ال', 
            es: 'el/la', 
            fr: 'le/la', 
            de: 'der/die/das', 
            it: 'il/la', 
            pt: 'o/a'
        },
        'quick': {
            en: 'quick',
            ts: 'maddas',
            ar: 'سريع',
            es: 'rápido', 
            fr: 'rapide', 
            de: 'schnell', 
            it: 'veloce', 
            pt: 'rápido'
        },
        'brown': {
            en: 'brown',
            ts: 'kulay kakah',
            ar: 'بني',
            es: 'marrón', 
            fr: 'marron', 
            de: 'braun', 
            it: 'marrone', 
            pt: 'marrom'
        },
        'fox': {
            en: 'fox',
            ts: 'urus',
            ar: 'ثعلب',
            es: 'zorro', 
            fr: 'renard', 
            de: 'Fuchs', 
            it: 'volpe', 
            pt: 'raposa'
        },
        'jumps': {
            en: 'jumps',
            ts: 'lumuksu',
            ar: 'يقفز',
            es: 'salta', 
            fr: 'saute', 
            de: 'springt', 
            it: 'salta', 
            pt: 'salta'
        },
        'over': {
            en: 'over',
            ts: 'hampang',
            ar: 'فوق',
            es: 'sobre', 
            fr: 'par-dessus', 
            de: 'über', 
            it: 'sopra', 
            pt: 'sobre'
        },
        'lazy': {
            en: 'lazy',
            ts: 'malas',
            ar: 'كسول',
            es: 'perezoso', 
            fr: 'paresseux', 
            de: 'faul', 
            it: 'pigro', 
            pt: 'preguiçoso'
        },
        'dog': {
            en: 'dog',
            ts: 'iru',
            ar: 'كلب',
            es: 'perro', 
            fr: 'chien', 
            de: 'Hund', 
            it: 'cane', 
            pt: 'cão'
        },
        'is': {
            en: 'is',
            ts: 'iya',
            ar: 'هو',
            es: 'es', 
            fr: 'est', 
            de: 'ist', 
            it: 'è', 
            pt: 'é'
        },
        'are': {
            en: 'are',
            ts: 'sila',
            ar: 'هم',
            es: 'son', 
            fr: 'sont', 
            de: 'sind', 
            it: 'sono', 
            pt: 'são'
        },
        'this': {
            en: 'this',
            ts: 'kariin',
            ar: 'هذا',
            es: 'este/esta', 
            fr: 'ce/cette', 
            de: 'dies', 
            it: 'questo/questa', 
            pt: 'este/esta'
        },
        'that': {
            en: 'that',
            ts: 'kariun',
            ar: 'ذلك',
            es: 'ese/esa', 
            fr: 'ce/cette', 
            de: 'das', 
            it: 'quel/quella', 
            pt: 'esse/essa'
        },
        'hello': {
            en: 'hello',
            ts: 'assalamu alaikum',
            ar: 'مرحبا',
            es: 'hola', 
            fr: 'bonjour', 
           极 de: 'hallo', 
            it: 'ciao', 
            pt: 'olá'
        },
        'world': {
            en: 'world',
            ts: 'dunya',
            ar: 'عالم',
            es: 'mundo', 
            fr: 'monde', 
            de: 'Welt', 
            it: 'mondo', 
            pt: 'mundo'
        },
        'cat': {
            en: 'cat',
            ts: 'uting',
            ar: 'قطة',
            es: 'gato', 
            fr: 'chat', 
            de: 'Katze', 
            it: 'gatto', 
            pt: '极gato'
        },
        'run': {
            en: 'run',
            ts: 'dagan',
            ar: 'يركض',
            es: 'correr', 
            fr: 'courir', 
            de: 'rennen', 
            it: 'correre', 
            pt: 'correr'
        },
        'beautiful': {
            en: 'beautiful',
            ts: 'mahapdi',
            ar: 'جميل',
            es: 'hermoso', 
            fr: 'beau', 
            de: 'schön', 
            it: 'bello', 
            pt: 'belo'
        },
        'slowly': {
            en: 'slowly',
            ts: '极hinay-hinay',
            ar: 'ببطء',
            es: 'lentamente', 
            fr: 'lentement', 
            de: 'langsam', 
            it: 'lentamente', 
            pt: 'lentamente'
        }
    };
    
    // Parts of speech database
    const partsOfSpeech = {
        'the': 'determiner',
        'quick': 'adjective',
        'brown': 'adjective',
        'fox': 'noun',
        'jumps': 'verb',
        'over': 'preposition',
        'lazy': 'adjective',
        'dog': 'noun',
        'is': 'verb',
        'are': 'verb',
        'this': 'determiner',
        'that': 'determiner',
        'hello': 'interjection',
        'world': 'noun',
        'cat': 'noun',
        'run': 'verb',
        'beautiful': 'adjective',
        'slowly': 'adverb'
    };
    
    // Process the sentence
    processBtn.addEventListener('click', function() {
        const sentence = inputText.value.trim();
        if (!sentence) {
            alert('Please enter a sentence');
            return;
        }
        
        // Clear previous results
        wordsContainer.innerHTML = '';
        analyzedWords = [];
        uniqueWordsSet.clear();
        updateTotalDisplay();
        
        // Split into words
        const words = sentence.split(/\s+/);
        const selectedLanguage = languageSelect.value;
        
        // Create word boxes
        words.forEach(word => {
            const cleanWord = word.replace(/[.,!?;:"]/g, '').toLowerCase();
            const pos = partsOfSpeech[cleanWord] || 'other';
            
            // Skip if we've already processed this word (case insensitive)
            if (uniqueWordsSet.has(cleanWord)) {
                return;
            }
            
            // Add to unique words set
            uniqueWordsSet.add(cleanWord);
            
            // Get translation if available
            let translation = '';
            if (translations[cleanWord] && selectedLanguage !== 'custom') {
                translation = translations[cleanWord][selectedLanguage] || '';
            }
            
            // Store word data
            analyzedWords.push({
                original: word,
                clean: cleanWord,
                translation: translation,
                pos: pos,
                hasTranslation: !!translation
            });
            
            const wordBox = document.createElement('div');
            wordBox.className = 'word-box';
            
            const wordEl = document.createElement('div');
            wordEl.className = 'word';
            word极El.textContent = word;
            
            const posEl = document.createElement('div');
            posEl.className = `pos ${getPosClass(pos)}`;
            posEl.textContent = pos;
            
            const translationInput = document.createElement('input');
            translationInput.type = 'text';
            translationInput.className = translation ? 'translation-input' : 'translation-input empty';
            translationInput.placeholder = 'Enter translation...';
            translationInput.value = translation;
            
            // Add hint for words like "the" that have multiple translations
            if (cleanWord === 'the') {
                const hint = document.createElement('div');
                hint.className = 'translation-hint';
                hint.textContent = 'e.g., in (Tausug), ال (Arabic)';
                wordBox.appendChild(hint);
            }
            
            // Update the data model when translation changes
            translationInput.addEventListener('input', function() {
                const index = Array.from(wordsContainer.children).indexOf(wordBox);
                if (index !== -1) {
                    analyzedWords[index].translation = this.value;
                    analyzedWords[index].hasTranslation = this.value.trim() !== '';
                    
                    // Update input style based on whether it has content
                    if (this.value.trim()) {
                        this.classList.remove('empty');
                    } else {
                        this.classList.add('empty');
                    }
                }
            });
            
            wordBox.appendChild(wordEl);
            wordBox.appendChild(posEl);
            wordBox.appendChild(translationInput);
            
            wordsContainer.appendChild(wordBox);
        });
        
        updateTotalDisplay();
    });
    
    // Reset the app
    resetBtn.addEventListener('click', function() {
        inputText.value = '';
        wordsContainer.innerHTML = '';
        analyzedWords = [];
        uniqueWordsSet.clear();
        updateTotalDisplay();
        inputText.focus();
    });
    
    // Calculate and display total
    totalBtn.addEventListener('click', function() {
        updateTotalDisplay();
        showNotification('Total unique words calculated!');
    });
    
    // Update total display
    function updateTotalDisplay() {
        totalDisplay.textContent = `Total Unique Words: ${uniqueWordsSet.size}`;
        
        // Display unique words
        uniqueWordsContainer.innerHTML = '';
        uniqueWordsSet.forEach(word => {
            const wordEl = document.createElement('span');
            wordEl.className = 'unique-word';
            wordEl.textContent = word;
            uniqueWordsContainer.appendChild(wordEl);
        });
    }
    
    // Save as JSON
    saveJsonBtn.addEventListener('click', function() {
        if (analyzedWords.length === 0) {
            alert('Please process a sentence first');
            return;
        }
        
        // Filter out words without translations
        const wordsWithTranslations = analyzedWords.filter(word => word.hasTranslation);
        
        if (wordsWithTranslations.length === 0) {
            showNotification('No words with translations to save!', true);
            return;
        }
        
        // Prepare data for export
        const exportData = {
            words: wordsWithTranslations,
            language: languageSelect.options[languageSelect.selectedIndex].text,
            originalSentence: inputText.value,
            exportDate: new Date().toISOString(),
            totalUniqueWords: uniqueWordsSet.size,
            totalTranslatedWords: wordsWithTranslations.length
        };
        
        const content = JSON.stringify(exportData, null, 2);
        downloadFile(content, 'word-translations.json', 'application/json');
        showNotification('File downloaded successfully!');
    });
    
    // Copy JSON to clipboard
    copyJsonBtn.addEventListener('click', function() {
        if (analyzedWords.length === 0) {
            alert('Please process a sentence first');
            return;
        }
        
        // Filter out words without translations
        const wordsWithTranslations = analyzedWords.filter(word => word.hasTranslation);
        
        if (words极WithTranslations.length === 0) {
            showNotification('No words with translations to copy!', true);
            return;
        }
        
        // Prepare data for export
        const exportData = {
            words: wordsWithTranslations,
            language: languageSelect.options[languageSelect.selectedIndex].text,
            originalSentence: inputText.value,
            exportDate: new Date().toISOString(),
            totalUniqueWords: uniqueWordsSet.size,
            totalTranslatedWords: wordsWithTranslations.length
        };
        
        const content = JSON.stringify(exportData, null, 2);
        
        // Copy to clipboard
        navigator.clipboard.writeText(content).then(() => {
            showNotification('JSON copied to clipboard!');
        }).catch(err => {
            alert('Failed to copy JSON: ' + err);
        });
    });
    
    // Import JSON button handler
    importJsonBtn.addEventListener('click', function() {
        jsonFileInput.click();
    });
    
    // Handle file selection for import
    jsonFileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Check if the imported data has the expected structure
                if (importedData.words && Array.isArray(importedData.words)) {
                    // Set the input text if available
                    if (importedData.originalSentence) {
                        inputText.value = importedData.originalSentence;
                    }
                    
                    // Set the language if available
                    if (importedData.language) {
                        for (let i = 0; i < languageSelect.options.length; i++) {
                            if (languageSelect.options[i].text === importedData.language) {
                                languageSelect.selectedIndex = i;
                                break;
                            }
                        }
                    }
                    
                    // Process the sentence to create word boxes
                    processBtn.click();
                    
                    // After a short delay, populate the translations
                    setTimeout(() => {
                        importedData.words.forEach((importedWord, index) => {
                            if (index < analyzedWords.length) {
                                analyzedWords[index].translation = importedWord.translation || '';
                                analyzedWords[index].hasTranslation = !!importedWord.translation;
                                
                                // Update the input field
                                const wordBox = wordsContainer.children[index];
                                if (wordBox) {
                                    const inputField = wordBox.querySelector('.translation-input');
                                    if (inputField) {
                                        inputField.value = importedWord.translation || '';
                                        if (importedWord.translation) {
                                            inputField.classList.remove('empty');
                                        } else {
                                            inputField.classList.add('empty');
                                        }
                                    }
                                }
                            }
                        });
                        showNotification('Translations imported successfully!');
                    }, 100);
                } else {
                    alert('Invalid file format. Please select a valid translations file.');
                }
            } catch (error) {
                alert('Error parsing JSON file: ' + error.message);
            }
        };
        reader.readAsText(file);
        
        // Reset the file input
        event.target.value = '';
    });
    
    // Helper function to get POS class for styling
    function getPosClass(pos) {
        if (pos.includes('noun')) return 'noun';
        if (pos.includes('verb')) return 'verb';
        if (pos.includes('adjective')) return 'adj';
        if (pos.includes('adverb')) return 'adv';
        return 'other';
    }
    
    // Helper function to download a file
    function downloadFile(content, fileName, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    // Show notification
    function showNotification(message, isError = false) {
        notification.textContent = message;
        notification.classList.remove('error');
        
        if (isError) {
            notification.classList.add('error');
        }
        
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Process the example sentence on load
    setTimeout(() => processBtn.click(), 500);
});