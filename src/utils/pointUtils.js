/**
 * Point Calculation Utilities for RNK Mystix
 * Manages point calculation and bonus logic
 */

/**
 * Calculate total bonus from both point types
 * @param {number} heroBonus - Bonus from Hero Points
 * @param {number} mysticBonus - Bonus from Mystic Points
 * @returns {number} Combined total bonus
 */
export function calculateCombinedBonus(heroBonus, mysticBonus) {
    const hero = Math.max(0, heroBonus || 0);
    const mystic = Math.max(0, mysticBonus || 0);
    return hero + mystic;
}

/**
 * Calculate Hero Point bonus
 * @param {number} heroPoints - Current Hero Points
 * @returns {number} Bonus value
 */
export function getHeroPointBonus(heroPoints) {
    // Hero Points: direct numeric bonus
    return Math.max(0, heroPoints || 0);
}

/**
 * Calculate Mystic Point bonus
 * @param {number} mysticPoints - Current Mystic Points
 * @returns {number} Bonus value
 */
export function getMysticPointBonus(mysticPoints) {
    // Mystic Points: direct numeric bonus
    return Math.max(0, mysticPoints || 0);
}

/**
 * Create roll breakdown message
 * @param {number} baseResult - The original roll result
 * @param {number} heroBonus - Hero Point bonus applied
 * @param {number} mysticBonus - Mystic Point bonus applied
 * @returns {string} Formatted breakdown message
 */
export function createRollBreakdown(baseResult, heroBonus, mysticBonus) {
    const totalBonus = calculateCombinedBonus(heroBonus, mysticBonus);
    const finalResult = baseResult + totalBonus;

    let breakdown = `<div class="rnk-mystix-breakdown">`;
    breakdown += `<div class="breakdown-item">Base Roll: <strong>${baseResult}</strong></div>`;
    
    if (heroBonus > 0) {
        breakdown += `<div class="breakdown-item hero-bonus">Hero Point Bonus: <strong>+${heroBonus}</strong></div>`;
    }
    
    if (mysticBonus > 0) {
        breakdown += `<div class="breakdown-item mystic-bonus">Mystic Point Bonus: <strong>+${mysticBonus}</strong></div>`;
    }
    
    if (totalBonus > 0) {
        breakdown += `<div class="breakdown-total">Combined Bonus: <strong>+${totalBonus}</strong></div>`;
        breakdown += `<div class="breakdown-final">Final Result: <strong>${finalResult}</strong></div>`;
    }
    
    breakdown += `</div>`;
    
    return breakdown;
}

/**
 * Validate bonus values
 * @param {number} heroBonus - Hero Point bonus
 * @param {number} mysticBonus - Mystic Point bonus
 * @returns {boolean}
 */
export function validateBonuses(heroBonus, mysticBonus) {
    return typeof heroBonus === 'number' && 
           typeof mysticBonus === 'number' &&
           heroBonus >= 0 && 
           mysticBonus >= 0;
}

/**
 * Calculate point cost for bonus
 * @param {number} bonus - The bonus amount
 * @returns {number} Estimated point cost
 */
export function calculatePointCost(bonus) {
    // Simple 1:1 cost
    return Math.max(0, bonus || 0);
}
