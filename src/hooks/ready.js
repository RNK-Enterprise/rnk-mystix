/**
 * Ready Hook
 * Called when the game world is ready - sets up UI and listeners
 */

import { PointAssignmentHub } from '../apps/PointAssignmentHub.js';
import { validateActorFlags, migrateActorData } from '../utils/storageUtils.js';

let hubInstance = null;

/**
 * Create or show the Point Assignment Hub
 */
export function openPointAssignmentHub() {
    if (hubInstance === null) {
        hubInstance = new PointAssignmentHub();
    }
    hubInstance.render({ force: true });
}

/**
 * Module ready hook - Called when Foundry is ready
 */
export async function onReady() {
    console.log('RNK Mystix | Module ready');

    // Only run setup for GMs
    if (!game.user.isGM) {
        return;
    }

    // Validate actor data integrity
    const validation = validateActorFlags();
    if (validation.invalid > 0) {
        console.warn(`RNK Mystix | Found ${validation.invalid} actors with invalid flags`);
        await migrateActorData();
    }

    // Add GM toolbar button to open the Point Assignment Hub
    const sceneControlTools = document.querySelector('[class*="scene-control"]');
    if (sceneControlTools) {
        // The actual button will be handled through Foundry's scene control system
    }

    console.log('RNK Mystix | Ready setup complete');
}

/**
 * Add button to open hub via toolbar
 * Registered at init to ensure it catches the control build cycle
 */
export function addHubButton() {
    Hooks.on('getSceneControlButtons', (controls) => {
        // Only show for GMs
        if (!game.user || !game.user.isGM) return;

        const toolId = 'rnk-mystix-hub-open';
        const tool = {
            name: toolId,
            title: 'RNK™ Mystix - GM Hub',
            icon: 'fas fa-scroll',
            button: true,
            toggle: false,
            onChange: (active) => {
                if (active) openPointAssignmentHub();
            }
        };

        const control = {
            name: 'rnk-mystix',
            title: 'RNK™ Mystix',
            icon: 'fas fa-scroll',
            layer: 'tokens',
            visible: true,
            tools: Array.isArray(controls) ? [tool] : { [toolId]: tool }
        };

        // Handle both Array (Legacy/v12) and Object (v13+) formats
        if (Array.isArray(controls)) {
            controls.push(control);
        } else if (controls && typeof controls === 'object') {
            controls['rnk-mystix'] = control;
        }
    });
}
