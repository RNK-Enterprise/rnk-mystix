/**
 * Actor Organization Utilities for RNK Mystix
 * Manages actor filtering and categorization
 */

/**
 * Get all actors in the game grouped by type
 * @returns {Object} Grouped actors {pcs, npcs, mystics}
 */
export function getActorsByType() {
    const pcs = [];
    const npcs = [];
    const mystics = [];

    for (const actor of game.actors) {
        if (actor.type === 'character') {
            pcs.push(actor);
        } else if (actor.type === 'npc') {
            npcs.push(actor);
        } else if (actor.type === 'hazard' || actor.type === 'loot') {
            // Treat hazards and loot as other types
            mystics.push(actor);
        } else {
            // Default to NPCs for unknown types
            npcs.push(actor);
        }
    }

    return {
        pcs: pcs.sort((a, b) => a.name.localeCompare(b.name)),
        npcs: npcs.sort((a, b) => a.name.localeCompare(b.name)),
        mystics: mystics.sort((a, b) => a.name.localeCompare(b.name))
    };
}

/**
 * Search actors by name with fuzzy matching
 * @param {string} query - Search query
 * @returns {Array} Matching actors
 */
export function searchActors(query) {
    if (!query || query.length === 0) {
        return game.actors.contents.sort((a, b) => a.name.localeCompare(b.name));
    }

    const lowerQuery = query.toLowerCase();
    return game.actors.contents.filter(actor => 
        actor.name.toLowerCase().includes(lowerQuery)
    ).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get a specific actor by ID
 * @param {string} actorId - The actor's ID
 * @returns {Actor|null}
 */
export function getActorById(actorId) {
    return game.actors.get(actorId) || null;
}

/**
 * Get all player character actors
 * @returns {Array} Array of player characters
 */
export function getPlayerCharacters() {
    return game.actors.contents.filter(a => a.type === 'character');
}

/**
 * Get all NPC actors
 * @returns {Array} Array of NPCs
 */
export function getNPCActors() {
    return game.actors.contents.filter(a => a.type === 'npc');
}

/**
 * Check if actor is a player character
 * @param {Actor} actor - The actor to check
 * @returns {boolean}
 */
export function isPlayerCharacter(actor) {
    return actor.type === 'character';
}

/**
 * Check if actor is an NPC
 * @param {Actor} actor - The actor to check
 * @returns {boolean}
 */
export function isNPC(actor) {
    return actor.type === 'npc';
}

/**
 * Get actor display name with type indicator
 * @param {Actor} actor - The actor
 * @returns {string} Display name
 */
export function getActorDisplayName(actor) {
    const typeMap = {
        'character': '[PC]',
        'npc': '[NPC]',
        'hazard': '[Hazard]',
        'loot': '[Loot]'
    };
    
    const typeLabel = typeMap[actor.type] || '[Other]';
    return `${typeLabel} ${actor.name}`;
}

/**
 * Sort actors by type then name
 * @param {Array} actors - Array of actors
 * @returns {Array} Sorted actors
 */
export function sortActorsByType(actors) {
    const typeOrder = { 'character': 0, 'npc': 1, 'hazard': 2, 'loot': 3 };
    
    return actors.sort((a, b) => {
        const typeA = typeOrder[a.type] ?? 99;
        const typeB = typeOrder[b.type] ?? 99;
        
        if (typeA !== typeB) {
            return typeA - typeB;
        }
        
        return a.name.localeCompare(b.name);
    });
}
