/**
 * Roll Hook Integration
 * Injects point totals into chat cards
 */

import { getAllActorPoints, deductActorPoints } from '../utils/storageUtils.js';

/**
 * Initialize all roll hooks
 */
export function initializeRollSystem() {
    console.log('RNK Mystix | Initializing roll system...');

    // Hook into chat message rendering to add our points display
    Hooks.on('renderChatMessage', async (message, html, data) => {
        try {
            const actor = message.actor;
            if (!actor) return;

            // Only show for relevant roll types (attacks, saves, skills)
            const isRoll = message.isRoll || message.flags?.pf2e?.context?.type;
            if (!isRoll) return;

            const points = getAllActorPoints(actor);
            
            // Create the points template data
            const templateData = {
                actorId: actor.id,
                actorName: actor.name,
                heroPoints: points.heroPoints,
                mysticPoints: points.mysticPoints
            };

            // Render the template
            const content = await renderTemplate('modules/rnk-mystix/templates/chat-points.hbs', templateData);
            
            // Append to the chat card
            const element = html instanceof HTMLElement ? html : html[0];
            const diceRoll = element.querySelector('.dice-roll') || element.querySelector('.card-content');
            
            if (diceRoll) {
                diceRoll.after(foundry.utils.parseHTML(content));
            } else {
                element.appendChild(foundry.utils.parseHTML(content));
            }

            // Attach listeners to the buttons
            element.querySelectorAll('.rnk-mystix-chat-roll-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const type = btn.dataset.type;
                    const actorId = actor.id;
                    const actorInstance = game.actors.get(actorId);
                    
                    if (!actorInstance) return;
                    
                    // Check ownership
                    if (!actorInstance.isOwner) {
                        ui.notifications.warn("You do not own this character.");
                        return;
                    }

                    const currentPoints = getAllActorPoints(actorInstance);
                    const pointValue = type === 'hero' ? currentPoints.heroPoints : currentPoints.mysticPoints;

                    if (pointValue <= 0) {
                        ui.notifications.warn(`You have no ${type === 'hero' ? 'Hero' : 'Mystic'} Points left!`);
                        return;
                    }

                    // Spend the point
                    await deductActorPoints(actorInstance, type, 1);
                    ui.notifications.info(`Spent 1 ${type === 'hero' ? 'Hero' : 'Mystic'} Point`);

                    // Both Hero and Mystic Points now cause a reroll if it was a d20 roll
                    if (message.isRoll) {
                        await handlePointReroll(actorInstance, message, type);
                    } else {
                        // Generic spending if no roll is attached
                        await ChatMessage.create({
                            user: game.user.id,
                            speaker: ChatMessage.getSpeaker({ actor: actorInstance }),
                            content: `
                                <div class="rnk-mystix-spend-msg">
                                    <h3 style="color: ${type === 'hero' ? 'var(--mystix-hero-color)' : 'var(--mystix-mystic-color)'}">
                                        ${type === 'hero' ? 'Hero' : 'Mystic'} Point Spent!
                                    </h3>
                                    <p>${actorInstance.name} triggers a powerful effect!</p>
                                </div>
                            `
                        });
                    }
                });
            });
        } catch (error) {
            console.error('RNK Mystix | Error rendering chat points:', error);
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

    // Create a new roll that is a reroll of the original
    const newRoll = await new Roll(roll.formula).roll();
    
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
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
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
