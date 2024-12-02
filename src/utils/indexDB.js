import { openDB } from "idb";

// initialize IndexDB
const dbPromise = openDB('csvDataDB', 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains('csvData')) {
            const store = db.createObjectStore('csvData', {
                keyPath: 'id',
                autoIncrement: true,
            });
            store.createIndex('csvIndex', 'name');
        }
    },
});

// Store CSV data
export const storeCsvData = async (dataKey, data) => {
    const db = await dbPromise;
    const tx = db.transaction('csvData', 'readwrite');
    const store = tx.objectStore('csvData');
    const index = store.index('csvIndex');
    const cursor = await index.openCursor(dataKey);

    if (cursor) {
        await cursor.delete(); // Delete the dataset
    } else {
        console.log(`No dataset found with key "${dataKey}".`);
    }
    await store.put({ name: dataKey, data });
    await tx.done;
};

// Get CSV data
export const getCsvData = async (dataKey) => {
    const db = await dbPromise;
    const tx = db.transaction('csvData', 'readonly');
    const store = tx.objectStore('csvData');



    const index = store.index('csvIndex');

    const data = await index.get(`${dataKey}_data`); // Get data for the specific key (name)

    await tx.done;
    return data ? data.data : null; // Return only the data field
};