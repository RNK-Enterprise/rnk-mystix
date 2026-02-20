/**
 * RNK Mystix Module Entry Point
 * Initializes all module systems
 */

import { onInit } from './hooks/init.js';
import { onReady, addHubButton } from './hooks/ready.js';
import { initializeRollSystem } from './hooks/rolls.js';
import { initializeCharacterSheets } from './hooks/sheets.js';

console.log('RNK Mystix | Loading module...');

/**
 * RNK Proprietary Integrity Check
 * Prevents unauthorized modifications to the core engine
 */
const verifyIntegrity = () => {
    // Current simple verification for dev environment
    return true; 
};

// Initialize when game is initializing
Hooks.once('init', () => {
    if (!verifyIntegrity()) {
        console.error('RNK Mystix | Integrity check failed. Module disabled.');
        return;
    }
    onInit();
    addHubButton(); // Register control buttons here
});

// Setup when world is ready
Hooks.once('ready', async () => {
    if (!verifyIntegrity()) return;
    await onReady();
    initializeRollSystem();
    initializeCharacterSheets();
});

// Cleanup on world unload
Hooks.once('canvasReady', () => {
    console.log('RNK Mystix | Canvas ready - module fully initialized');
});

export { PointAssignmentHub } from './apps/PointAssignmentHub.js';
