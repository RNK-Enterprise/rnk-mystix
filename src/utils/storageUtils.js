/**
 * Storage Utilities for RNK Mystix
 * Manages actor flag persistence and data integrity
 */

const FLAG_NAMESPACE = 'rnk-mystix';
const HERO_POINTS_FLAG = 'heroPoints';
const MYSTIC_POINTS_FLAG = 'mysticPoints';

/**
 * Set points on an actor flag
 * @param {Actor} actor - The actor to set points on
 * @param {string} type - 'hero' or 'mystic'
 * @param {number} value - Point value to set
 * @returns {Promise<void>}
 */
export async function setActorPoints(actor, type, value) {
    const flag = type === 'hero' ? HERO_POINTS_FLAG : MYSTIC_POINTS_FLAG;
    const maxSetting = type === 'hero' ? 'maxHeroPoints' : 'maxMysticPoints';
    const max = game.settings.get('rnk-mystix', maxSetting);
    await actor.setFlag(FLAG_NAMESPACE, flag, Math.min(Math.max(0, value), max));
}

/**
 * Get points from an actor flag
 * @param {Actor} actor - The actor to get points from
 * @param {string} type - 'hero' or 'mystic'
 * @returns {number} Current point value
 */
export function getActorPoints(actor, type) {
    const flag = type === 'hero' ? HERO_POINTS_FLAG : MYSTIC_POINTS_FLAG;
    return actor.getFlag(FLAG_NAMESPACE, flag) || 0;
}

/**
 * Get both Hero and Mystic points for an actor
 * @param {Actor} actor - The actor to get points from
 * @returns {Object} {heroPoints, mysticPoints}
 */
export function getAllActorPoints(actor) {
    return {
        heroPoints: getActorPoints(actor, 'hero'),
        mysticPoints: getActorPoints(actor, 'mystic')
    };
}

/**
 * Clear points on an actor (set to 0)
 * @param {Actor} actor - The actor to clear points from
 * @param {string} type - 'hero', 'mystic', or 'both'
 * @returns {Promise<void>}
 */
export async function clearActorPoints(actor, type = 'both') {
    if (type === 'both') {
        await actor.unsetFlag(FLAG_NAMESPACE, HERO_POINTS_FLAG);
        await actor.unsetFlag(FLAG_NAMESPACE, MYSTIC_POINTS_FLAG);
    } else {
        const flag = type === 'hero' ? HERO_POINTS_FLAG : MYSTIC_POINTS_FLAG;
        await actor.unsetFlag(FLAG_NAMESPACE, flag);
    }
}

/**
 * Deduct points from an actor
 * @param {Actor} actor - The actor to deduct from
 * @param {string} type - 'hero' or 'mystic'
 * @param {number} amount - Amount to deduct
 * @returns {Promise<number>} New point value
 */
export async function deductActorPoints(actor, type, amount) {
    const current = getActorPoints(actor, type);
    const newValue = Math.max(0, current - amount);
    await setActorPoints(actor, type, newValue);
    return newValue;
}

/**
 * Add points to an actor
 * @param {Actor} actor - The actor to add to
 * @param {string} type - 'hero' or 'mystic'
 * @param {number} amount - Amount to add
 * @returns {Promise<number>} New point value
 */
export async function addActorPoints(actor, type, amount) {
    const current = getActorPoints(actor, type);
    const maxSetting = type === 'hero' ? 'maxHeroPoints' : 'maxMysticPoints';
    const max = game.settings.get('rnk-mystix', maxSetting);
    const newValue = Math.min(current + amount, max);
    await setActorPoints(actor, type, newValue);
    return newValue;
}

/**
 * Check if actor has points available
 * @param {Actor} actor - The actor to check
 * @returns {boolean}
 */
export function hasActorPoints(actor) {
    const points = getAllActorPoints(actor);
    return points.heroPoints > 0 || points.mysticPoints > 0;
}

/**
 * Reset all actor points globally
 * @returns {Promise<void>}
 */
export async function resetAllActorPoints() {
    for (const actor of game.actors) {
        await clearActorPoints(actor, 'both');
    }
}

/**
 * Migrate actor data (for future updates)
 * @returns {Promise<void>}
 */
export async function migrateActorData() {
    for (const actor of game.actors) {
        const heroPoints = getActorPoints(actor, 'hero');
        const mysticPoints = getActorPoints(actor, 'mystic');
        
        // Validation check
        if (isNaN(heroPoints) || isNaN(mysticPoints)) {
            await clearActorPoints(actor, 'both');
        }
    }
}

/**
 * Validate all actor flags have correct data
 * @returns {Object} Validation results
 */
export function validateActorFlags() {
    const results = {
        valid: 0,
        invalid: 0,
        errors: []
    };

    for (const actor of game.actors) {
        try {
            const points = getAllActorPoints(actor);
            if (typeof points.heroPoints === 'number' && typeof points.mysticPoints === 'number') {
                results.valid++;
            } else {
                results.invalid++;
                results.errors.push({
                    actor: actor.name,
                    error: 'Invalid point types'
                });
            }
        } catch (e) {
            results.invalid++;
            results.errors.push({
                actor: actor.name,
                error: e.message
            });
        }
    }

    return results;
}
