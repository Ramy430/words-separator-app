            // Exit admin mode
            adminMode = false;
            adminBadge.style.display = 'none';
            adminPanel.style.display = 'none';
            
            // Display full dictionary
            displayWordList(dictionary);
        });

        // Search functionality
        searchBtn.addEventListener('click', searchDictionary);
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchDictionary();
            }
        });

        // Add word button
        addWordBtn.addEventListener('click', function() {
            addWordModal.style.display = 'flex';
        });

        // Close modal
        closeModal.addEventListener('click', function() {
            addWordModal.style.display = 'none';
            successMessage.style.display = 'none';
        });

        // Close edit modal
        closeEditModal.addEventListener('click', function() {
            editWordModal.style.display = 'none';
            editSuccessMessage.style.display = 'none';
        });

        // Word form submission
        wordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const word = newWordInput.value.trim();
            const meaning = newMeaningInput.value.trim();
            const synonyms = newSynonymsInput.value.trim();
            
            if (word && meaning) {
                // Add to dictionary (unapproved by default)
                dictionary.push({
                    word: word,
                    meaning: meaning,
                    synonyms: synonyms ? synonyms.split(',').map(s => s.trim()) : [],
                    additionalMeanings: [],
                    approved: false
                });
                
                // Sort dictionary
                dictionary.sort((a, b) => a.word.localeCompare(b.word));
                
                // Reset form
                wordForm.reset();
                
                // Show success message
                successMessage.style.display = 'block';
                
                // Refresh word list
                displayWordList(dictionary);
                
                // Hide modal after 2 seconds
                setTimeout(() => {
                    addWordModal.style.display = 'none';
                    successMessage.style.display = 'none';
                }, 2000);
            }
        });

        // Edit word form submission
        editWordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const index = editWordIndex.value;
            const word = editWordInput.value.trim();
            const meaning = editMeaningInput.value.trim();
            const synonyms = editSynonymsInput.value.trim();
            const additionalMeanings = editAdditionalMeaningsInput.value.trim();
            
            if (word && meaning && index !== '') {
                // Update dictionary
                dictionary[index].word = word;
                dictionary[index].meaning = meaning;
                dictionary[index].synonyms = synonyms ? synonyms.split(',').map(s => s.trim()) : [];
                dictionary[index].additionalMeanings = additionalMeanings ? additionalMeanings.split('\n').map(m => m.trim()) : [];
                
                // Sort dictionary
                dictionary.sort((a, b) => a.word.localeCompare(b.word));
                
                // Reset form
                editWordForm.reset();
                
                // Show success message
                editSuccessMessage.style.display = 'block';
                
                // Refresh word list
                displayWordList(dictionary);
                
                // Hide modal after 2 seconds
                setTimeout(() => {
                    editWordModal.style.display = 'none';
                    editSuccessMessage.style.display = 'none';
                }, 2000);
            }
        });

        // Edit mode toggle
        editModeBtn.addEventListener('click', function() {
            editMode = !editMode;
            toggleEditButtons();
        });

        // Admin button
        adminBtn.addEventListener('click', function() {
            adminPanel.style.display = adminPanel.style.display === 'block' ? 'none' : 'block';
        });

        // Admin login
        loginBtn.addEventListener('click', function() {
            if (adminPassword.value === ADMIN_PASSWORD) {
                adminMode = true;
                adminBadge.style.display = 'block';
                adminPanel.style.display = 'none';
                adminPassword.value = '';
                
                // Enable editing of approved words
                editMode = true;
                toggleEditButtons();
                
                // Refresh display
                displayWordList(dictionary);
            } else {
                alert('Incorrect password');
            }
        });

        // Close modals if clicked outside
        window.addEventListener('click', function(e) {
            if (e.target === addWordModal) {
                addWordModal.style.display = 'none';
                successMessage.style.display = 'none';
            }
            if (e.target === editWordModal) {
                editWordModal.style.display = 'none';
                editSuccessMessage.style.display = 'none';
            }
        });

        // Initialize the word list on page load
        displayWordList(dictionary);
    </script>