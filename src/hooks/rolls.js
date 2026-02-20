/**
 * Roll Hook Integration
 * Injects point totals into chat cards
 */

import { getAllActorPoints, deductActorPoints } from '../utils/storageUtils.js';
import { getMysticProfBonus } from '../utils/pointUtils.js';

/**
 * Initialize all roll hooks
 */
export function initializeRollSystem() {
    console.log('RNK Mystix | Initializing roll system...');

    // renderChatMessageHTML is the v13 API — passes HTMLElement directly (not jQuery)
    Hooks.on('renderChatMessageHTML', async (message, element, _data) => {
        try {
            const actor = message.actor;
            if (!actor) return;

            // Only show for relevant roll types (attacks, saves, skills)
            const isRoll = message.isRoll || message.flags?.pf2e?.context?.type;
            if (!isRoll) return;

            const points = getAllActorPoints(actor);

            // Skip rendering if both points are 0
            if (points.heroPoints === 0 && points.mysticPoints === 0) return;

            const level = actor.level ?? actor.system?.details?.level?.value ?? 0;

            // Create the points template data — M shows the calculated total bonus
            const templateData = {
                actorId: actor.id,
                heroPoints: points.heroPoints,
                mysticPoints: points.mysticPoints + getMysticProfBonus(level)
            };

            // renderTemplate is now namespaced in v13
            const content = await foundry.applications.handlebars.renderTemplate(
                'modules/rnk-mystix/templates/chat-points.hbs',
                templateData
            );

            // Append to the chat card — remove any existing display first to prevent duplicates
            element.querySelector('.rnk-mystix-chat-points')?.remove();
            const diceRoll = element.querySelector('.dice-roll') || element.querySelector('.card-content');

            if (diceRoll) {
                diceRoll.after(foundry.utils.parseHTML(content));
            } else {
                element.appendChild(foundry.utils.parseHTML(content));
            }

            // NOTE: No per-element listeners added here.
            // A single delegated listener on document (registered below) handles all clicks.
        } catch (error) {
            console.error('RNK Mystix | Error rendering chat points:', error);
        }
    });

    // Single delegated click handler — registered ONCE at init, covers all chat point buttons
    // past and future. Eliminates the duplicate-listener problem caused by the hook firing
    // multiple times per message render.
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.rnk-mystix-chat-roll-btn');
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation();

        // Look up the message from the chat element's data-message-id attribute
        const messageId = btn.closest('[data-message-id]')?.dataset.messageId;
        if (!messageId) return;

        const message = game.messages.get(messageId);
        if (!message) return;

        // message.actor resolves synthetic/token actors correctly via speaker data
        const actor = message.actor;
        if (!actor) return;

        const type = btn.dataset.type;

        if (!actor.isOwner) {
            ui.notifications.warn('You do not own this character.');
            return;
        }

        const currentPoints = getAllActorPoints(actor);
        const pointValue = type === 'hero' ? currentPoints.heroPoints : currentPoints.mysticPoints;

        if (pointValue <= 0) {
            ui.notifications.warn(`You have no ${type === 'hero' ? 'Hero' : 'Mystic'} Points left!`);
            return;
        }

        await deductActorPoints(actor, type, 1);
        ui.notifications.info(`Spent 1 ${type === 'hero' ? 'Hero' : 'Mystic'} Point`);

        if (message.isRoll) {
            await handlePointReroll(actor, message, type);
        } else {
            await ChatMessage.create({
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({ actor }),
                content: `
                    <div class="rnk-mystix-spend-msg">
                        <h3 style="color: ${type === 'hero' ? 'var(--mystix-hero-color)' : 'var(--mystix-mystic-color)'}">
                            ${type === 'hero' ? 'Hero' : 'Mystic'} Point Spent!
                        </h3>
                        <p>${actor.name} triggers a powerful effect!</p>
                    </div>
                `
            });
        }
    });

    console.log('RNK Mystix | Roll system initialized');
}

/**
 * Handle Point-based Reroll (Hero or Mystic)
 * @param {Actor} actor
 * @param {ChatMessage} originalMessage
 * @param {string} type - 'hero' or 'mystic'
 */
async function handlePointReroll(actor, originalMessage, type) {
    const roll = originalMessage.rolls[0];
    if (!roll) return;

    // Create a new roll — mystic rerolls include the proficiency bonus (10 + level)
    const level = actor.level ?? actor.system?.details?.level?.value ?? 0;
    const formula = type === 'mystic'
        ? `${roll.formula} + ${getMysticProfBonus(level)}`
        : roll.formula;
    const newRoll = await new Roll(formula).roll();

    // Determine theme colors based on point type
    const color = type === 'hero' ? 'var(--mystix-hero-color)' : 'var(--mystix-mystic-color)';
    const label = type === 'hero' ? 'Hero Point' : 'Mystic Point';

    await ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        flavor: `
            <div class="rnk-mystix-reroll-flavor" style="color: ${color}; font-weight: bold; border-bottom: 2px solid ${color}; padding-bottom: 2px;">
                <i class="fas fa-dice-d20"></i> Spent ${label} to Reroll!
            </div>`,
        type: 'roll',
        rolls: [newRoll],
        flags: {
            "rnk-mystix": {
                isReroll: true,
                pointType: type,
                originalMessageId: originalMessage.id
            }
        }
    });
}
