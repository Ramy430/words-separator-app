// ==================== FIREBASE INTEGRATION ====================
let firebaseReady = false;

// Initialize Firebase connection
export function initFirebase() {
    if (typeof auth !== 'undefined') {
        auth.onAuthStateChanged(() => {
            firebaseReady = true;
            console.log('✅ Firebase is ready');
            if (typeof showNotification === 'function') {
                showNotification('Firebase connected successfully');
            }
        });
    }
}

// Firebase upload function
export async function saveToFirebase(data, collectionName) {
    if (!firebaseReady) {
        if (typeof showNotification === 'function') {
            showNotification('⚠️ Firebase not ready yet', true);
        }
        throw new Error('Firebase not loaded yet');
    }
    
    try {
        const docRef = await db.collection(collectionName).add({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        if (typeof showNotification === 'function') {
            showNotification('✅ Translations saved to Firebase!');
        }
        return docRef.id;
    } catch (error) {
        console.error('Firebase upload failed:', error);
        if (typeof showNotification === 'function') {
            showNotification('❌ Upload failed: ' + error.message, true);
        }
        throw error;
    }
}

// Save with backup functionality
export async function saveWithBackup(data, collectionName) {
    const backupKey = `backup_${collectionName}_${Date.now()}`;
    const backupData = {
        data: data,
        collection: collectionName,
        timestamp: new Date().getTime(),
        attempts: 0
    };
    
    localStorage.setItem(backupKey, JSON.stringify(backupData));
    console.log('💾 Backup saved locally');
    
    try {
        const result = await saveToFirebase(data, collectionName);
        localStorage.removeItem(backupKey);
        return result;
    } catch (error) {
        console.warn('Upload failed, keeping backup');
        if (typeof showNotification === 'function') {
            showNotification('💾 Data saved locally - will sync when online', true);
        }
        return null;
    }
}

// Retry failed backups
export async function retryFailedBackups() {
    const backupKeys = Object.keys(localStorage).filter(key => key.startsWith('backup_'));
    
    for (const key of backupKeys) {
        try {
            const backupData = JSON.parse(localStorage.getItem(key));
            if (backupData && backupData.data) {
                console.log(`🔄 Retrying backup: ${key}`);
                const result = await saveToFirebase(backupData.data, backupData.collection);
                if (result) {
                    localStorage.removeItem(key);
                    console.log(`✅ Backup ${key} synced successfully`);
                }
            }
        } catch (error) {
            console.warn(`Failed to sync backup ${key}:`, error);
        }
    }
}

// Check if Firebase is ready
export function isFirebaseReady() {
    return firebaseReady;
}