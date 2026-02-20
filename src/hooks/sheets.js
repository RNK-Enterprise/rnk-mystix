/**
 * Actor Sheet Integration
 * Displays point totals on all actor sheets: PC, NPC, familiar, vehicle/mount, hazard, loot
 */

import { getAllActorPoints } from '../utils/storageUtils.js';

/**
 * Resolve insertion target for any sheet type.
 * Appends inside the first <section> of the sheet <header> —
 * the same position used on PC sheets (header.char-header > section.char-details).
 */
function getInsertionTarget(element) {
    const header = element.querySelector('header');
    if (header) {
        const section = header.querySelector('section');
        if (section) return { target: section, method: 'append' };
        return { target: header, method: 'append' };
    }
    return { target: element, method: 'prepend' };
}

/**
 * Enhance all actor sheets with point display
 */
export function setupCharacterSheetHooks() {
    Hooks.on('renderActorSheet', (app, html, _data) => {
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

            // Build the point display element
            const pointsDisplayStr = createPointsDisplay(points);
            const template = document.createElement('template');
            template.innerHTML = pointsDisplayStr.trim();
            const pointsElement = template.content.firstChild;

            // Place the display in the correct position for this sheet type
            const { target, method } = getInsertionTarget(element);

            if (method === 'after') {
                target.after(pointsElement);
            } else if (method === 'append') {
                target.append(pointsElement);
            } else {
                target.prepend(pointsElement);
            }
        } catch (error) {
            console.warn('RNK Mystix | Error enhancing actor sheet:', error);
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
    Hooks.on('updateActor', (actor, _data, _options, _userId) => {
        try {
            // Re-render any open sheets for this actor
            const apps = Object.values(ui.windows);
            for (const app of apps) {
                if (app.actor?.id === actor.id) {
                    if (app.render instanceof Function) {
                        // Use instanceof for reliable ApplicationV2 detection
                        const isV2 = typeof foundry !== 'undefined'
                            && foundry.applications?.api?.ApplicationV2
                            && app instanceof foundry.applications.api.ApplicationV2;

                        if (isV2) {
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
 * Initialize all actor sheet integration
 */
export function initializeCharacterSheets() {
    console.log('RNK Mystix | Initializing actor sheet integration...');
    setupCharacterSheetHooks();
    setupActorUpdateHooks();
    console.log('RNK Mystix | Actor sheet integration ready');
}
