/**
 * Actor Sheet Integration
 * Displays point totals on all actor sheets: PC, NPC, familiar, vehicle/mount, hazard, loot
 */

import { getAllActorPoints, addActorPoints, deductActorPoints } from '../utils/storageUtils.js';

/**
 * Resolve insertion target for any sheet type.
 * PC sheets: insert after the hero-points .dots container (inside char-header > char-details).
 * All others: append inside the first <section> of the sheet <header>.
 */
function getInsertionTarget(element, actorType) {
    if (actorType === 'character') {
        // PC: replace the native hero-points dots container with the RNK display
        const heroPointsContainer = element.querySelector('.dots [data-resource="hero-points"]')?.closest('.dots');
        if (heroPointsContainer) return { target: heroPointsContainer, method: 'replace' };
    }

    // NPC / familiar / vehicle / hazard / loot — append into the rarity-size container
    const raritySize = element.querySelector('.rarity-size');
    if (raritySize) return { target: raritySize, method: 'append' };

    // Fallback
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

            // Ensure we are working with a native DOM element
            const element = html instanceof HTMLElement ? html : html[0];
            if (!element) return;

            const points = getAllActorPoints(actor);

            // Remove existing to prevent duplication on re-renders
            element.querySelector('.rnk-mystix-sheet-points')?.remove();

            // Build the point display element
            const pointsDisplayStr = createPointsDisplay(points);
            const template = document.createElement('template');
            template.innerHTML = pointsDisplayStr.trim();
            const pointsElement = template.content.firstChild;

            // Place the display in the correct position for this sheet type
            const { target, method } = getInsertionTarget(element, actor.type);

            if (method === 'replace') {
                target.replaceWith(pointsElement);
            } else if (method === 'append') {
                target.append(pointsElement);
            } else {
                target.prepend(pointsElement);
            }

            // GM only: left-click subtracts, right-click adds
            if (game.user?.isGM) attachPointListeners(pointsElement, actor);
        } catch (error) {
            console.warn('RNK Mystix | Error enhancing actor sheet:', error);
        }
    });
}

/**
 * Attach GM click listeners to the point display spans.
 * Left-click: subtract 1 point. Right-click: add 1 point.
 */
function attachPointListeners(pointsElement, actor) {
    const types = [
        { selector: '.rnk-mystix-sheet-point.hero',   type: 'hero' },
        { selector: '.rnk-mystix-sheet-point.mystic', type: 'mystic' }
    ];

    for (const { selector, type } of types) {
        const span = pointsElement.querySelector(selector);
        if (!span) continue;

        span.addEventListener('click', async (e) => {
            e.preventDefault();
            await deductActorPoints(actor, type, 1);
        });

        span.addEventListener('contextmenu', async (e) => {
            e.preventDefault();
            await addActorPoints(actor, type, 1);
        });
    }
}

/**
 * Create HTML for point display.
 * H shows the raw hero point count.
 * M shows the raw mystic point count.
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
