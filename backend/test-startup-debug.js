async function test() {
    try {
        console.log('Attempting to import app.js...');
        await import('./src/app.js');
        console.log('App imported successfully');
    } catch (error) {
        console.error('Import failed:', error);
        process.exit(1);
    }
}

test();
