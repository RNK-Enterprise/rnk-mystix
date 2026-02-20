/**
 * Character Sheet Integration
 * Displays point totals on character sheets
 */

import { getAllActorPoints } from '../utils/storageUtils.js';

/**
 * Enhance character sheet with point display
 */
export function setupCharacterSheetHooks() {
    // Hook into character sheet rendering
    Hooks.on('renderActorSheet', (app, html, data) => {
        try {
            const actor = app.actor;
            if (!actor) return;

            // Get current points
            const points = getAllActorPoints(actor);
            if (!points) return;

            // Ensure we are working with a native DOM element
            const element = html instanceof HTMLElement ? html : html[0];
            if (!element) return;

            // Remove existing to prevent duplication on re-renders
            element.querySelector('.rnk-mystix-sheet-points')?.remove();

            // Create point display element from string
            const pointsDisplayStr = createPointsDisplay(points);
            const template = document.createElement('template');
            template.innerHTML = pointsDisplayStr.trim();
            const pointsElement = template.content.firstChild;

            // Target the specific Hero Points dots container on the PF2e sheet
            const heroPointsContainer = element.querySelector('.dots [data-resource="hero-points"]')?.closest('.dots');

            if (heroPointsContainer) {
                heroPointsContainer.after(pointsElement);
            } else {
                // Fallback for non-PF2e or customized sheets
                const headerEl = element.querySelector('.sheet-header');
                if (headerEl) headerEl.after(pointsElement);
                else element.prepend(pointsElement);
            }
        } catch (error) {
            console.warn('RNK Mystix | Error enhancing character sheet:', error);
        }
    });
}

/**
 * Create HTML for point display
 */
function createPointsDisplay(points) {
    const heroPoints = points.heroPoints || 0;
    const mysticPoints = points.mysticPoints || 0;

    return `<div class="rnk-mystix-sheet-points">
        <span class="rnk-mystix-sheet-point hero"><strong>H:</strong> ${heroPoints}</span>
        <span class="rnk-mystix-sheet-point mystic"><strong>M:</strong> ${mysticPoints}</span>
    </div>`;
}

/**
 * Update point display on actor update
 */
export function setupActorUpdateHooks() {
    Hooks.on('updateActor', (actor, data, options, userId) => {
        try {
            // Re-render any open character sheets for this actor
            const apps = Object.values(ui.windows);
            for (const app of apps) {
                if (app.actor?.id === actor.id) {
                    // ApplicationV2 uses render({force: false}) by default, 
                    // legacy Application uses render(false)
                    if (app.render instanceof Function) {
                        if (app.constructor.name.includes('V2') || app.options?.id?.includes('v2')) {
                            app.render({ force: false });
                        } else {
                            app.render(false);
                        }
                    }
                }
            }
        } catch (error) {
            console.warn('RNK Mystix | Error in actor update hook:', error);
        }
    });
}

/**
 * Initialize character sheet integration
 */
export function initializeCharacterSheets() {
    console.log('RNK Mystix | Initializing character sheet integration...');
    setupCharacterSheetHooks();
    setupActorUpdateHooks();
    console.log('RNK Mystix | Character sheet integration ready');
}
