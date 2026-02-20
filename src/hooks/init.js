/**
 * Module Initialization Hook
 * Sets up game settings and configurations
 */

export function registerSettings() {
    // Max Hero Points setting
    game.settings.register('rnk-mystix', 'maxHeroPoints', {
        name: 'Maximum Hero Points',
        hint: 'Maximum number of Hero Points an actor can have',
        scope: 'world',
        config: true,
        type: Number,
        default: 10
    });

    // Max Mystic Points setting
    game.settings.register('rnk-mystix', 'maxMysticPoints', {
        name: 'Maximum Mystic Points',
        hint: 'Maximum number of Mystic Points an actor can have',
        scope: 'world',
        config: true,
        type: Number,
        default: 10
    });

    // Default Hero Points setting
    game.settings.register('rnk-mystix', 'defaultHeroPoints', {
        name: 'Default Hero Points',
        hint: 'Default Hero Points to assign when creating new assignments',
        scope: 'world',
        config: true,
        type: Number,
        default: 1
    });

    // Default Mystic Points setting
    game.settings.register('rnk-mystix', 'defaultMysticPoints', {
        name: 'Default Mystic Points',
        hint: 'Default Mystic Points to assign when creating new assignments',
        scope: 'world',
        config: true,
        type: Number,
        default: 1
    });

    // Allow negative points setting
    game.settings.register('rnk-mystix', 'allowNegativePoints', {
        name: 'Allow Negative Points',
        hint: 'Allow actors to have negative point values (debt system)',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });

    // Auto-refill points on rest setting
    game.settings.register('rnk-mystix', 'autoRefillPoints', {
        name: 'Auto-Refill on Rest',
        hint: 'Automatically reset points to default when actors rest',
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
    console.log('RNK Mystix | Initializing module...');
    registerSettings();
}
