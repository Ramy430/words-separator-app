// backup-helper.js - NEW FILE
export class BackupHelper {
    static async smartUpload(uploadFunction, data, collectionName) {
        try {
            return await uploadFunction(data, collectionName);
        } catch (error) {
            console.log('Trying with backup...');
            return this.withBackup(uploadFunction, data, collectionName);
        }
    }

    static async withBackup(uploadFunction, data, collectionName) {
        const backupKey = `backup_${collectionName}_${Date.now()}`;
        const backupData = { data, collection: collectionName, attempts: 0 };
        localStorage.setItem(backupKey, JSON.stringify(backupData));

        try {
            const result = await uploadFunction(data, collectionName);
            localStorage.removeItem(backupKey);
            return result;
        } catch (error) {
            console.warn('Upload failed, backup kept');
            return null;
        }
    }
}