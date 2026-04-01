/**
 * Module Initialization Hook
 * Sets up game settings and configurations
 */

export function registerSettings() {
    const L = (key) => game.i18n.localize(key);

    // Max Hero Points setting
    game.settings.register('rnk-mystix', 'maxHeroPoints', {
        name: L('rnk-mystix.settings.maxHeroPoints.name'),
        hint: L('rnk-mystix.settings.maxHeroPoints.hint'),
        scope: 'world',
        config: true,
        type: Number,
        default: 10
    });

    // Max Mystic Points setting
    game.settings.register('rnk-mystix', 'maxMysticPoints', {
        name: L('rnk-mystix.settings.maxMysticPoints.name'),
        hint: L('rnk-mystix.settings.maxMysticPoints.hint'),
        scope: 'world',
        config: true,
        type: Number,
        default: 10
    });

    // Default Hero Points setting
    game.settings.register('rnk-mystix', 'defaultHeroPoints', {
        name: L('rnk-mystix.settings.defaultHeroPoints.name'),
        hint: L('rnk-mystix.settings.defaultHeroPoints.hint'),
        scope: 'world',
        config: true,
        type: Number,
        default: 1
    });

    // Default Mystic Points setting
    game.settings.register('rnk-mystix', 'defaultMysticPoints', {
        name: L('rnk-mystix.settings.defaultMysticPoints.name'),
        hint: L('rnk-mystix.settings.defaultMysticPoints.hint'),
        scope: 'world',
        config: true,
        type: Number,
        default: 1
    });

    // Allow negative points setting
    game.settings.register('rnk-mystix', 'allowNegativePoints', {
        name: L('rnk-mystix.settings.allowNegativePoints.name'),
        hint: L('rnk-mystix.settings.allowNegativePoints.hint'),
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });

    // Allow Mystic Points to reroll attacks
    game.settings.register('rnk-mystix', 'mysticAttackRerolls', {
        name: L('rnk-mystix.settings.mysticAttackRerolls.name'),
        hint: L('rnk-mystix.settings.mysticAttackRerolls.hint'),
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });

    // Allow players to adjust their own points
    game.settings.register('rnk-mystix', 'playerSelfAssign', {
        name: L('rnk-mystix.settings.playerSelfAssign.name'),
        hint: L('rnk-mystix.settings.playerSelfAssign.hint'),
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });

    // Auto-refill points on rest setting
    game.settings.register('rnk-mystix', 'autoRefillPoints', {
        name: L('rnk-mystix.settings.autoRefillPoints.name'),
        hint: L('rnk-mystix.settings.autoRefillPoints.hint'),
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });
}

/**
 * Module init hook - Called when Foundry initializes
 */
export function onInit() {
    console.log('RNK™ Mystix | Initializing module...');
    registerSettings();
}
