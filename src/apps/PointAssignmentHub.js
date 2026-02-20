/**
 * Point Assignment Hub
 * Main application for GMs to assign and manage points
 * V2 Perfection Version - ApplicationV2 & Native DOM
 */

import { getActorsByType, searchActors } from '../utils/actorUtils.js';
import { setActorPoints, getActorPoints, clearActorPoints, resetAllActorPoints } from '../utils/storageUtils.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

console.log('RNK Mystix | PointAssignmentHub.js V2 Loaded');

export class PointAssignmentHub extends HandlebarsApplicationMixin(ApplicationV2) {
    // ========== STATIC PROPERTIES ==========
    static DEFAULT_OPTIONS = {
        id: 'rnk-mystix-hub',
        classes: ['rnk-mystix-hub'],
        window: {
            title: 'RNK™ Mystix - Point Assignment Hub',
            resizable: true,
            minimizable: true
        },
        position: {
            width: 720,
            height: 800
        }
    };

    static PARTS = {
        main: {
            template: 'modules/rnk-mystix/templates/hub.hbs'
        }
    };

    // ========== CONSTRUCTOR ==========
    constructor(options = {}) {
        super(options);
        this.searchQuery = '';
        this.selectedActorId = null;
    }

    // ========== DATA PREPARATION ==========
    /**
     * Get data for template rendering
     */
    async _prepareContext(options) {
        let actorsData;
        let formattedActors = [];

        if (this.searchQuery) {
            const searchResults = searchActors(this.searchQuery);
            formattedActors = searchResults.map(actor => ({
                id: actor.id,
                name: actor.name,
                type: actor.type,
                heroPoints: getActorPoints(actor, 'hero'),
                mysticPoints: getActorPoints(actor, 'mystic')
            }));
            
            actorsData = {
                search: formattedActors,
                isSearching: true,
                actors: formattedActors
            };
        } else {
            const grouped = getActorsByType();
            actorsData = {
                pcs: grouped.pcs.map(a => ({
                    id: a.id,
                    name: a.name,
                    type: a.type,
                    heroPoints: getActorPoints(a, 'hero'),
                    mysticPoints: getActorPoints(a, 'mystic')
                })),
                npcs: grouped.npcs.map(a => ({
                    id: a.id,
                    name: a.name,
                    type: a.type,
                    heroPoints: getActorPoints(a, 'hero'),
                    mysticPoints: getActorPoints(a, 'mystic')
                })),
                mystics: grouped.mystics.map(a => ({
                    id: a.id,
                    name: a.name,
                    type: a.type,
                    heroPoints: getActorPoints(a, 'hero'),
                    mysticPoints: getActorPoints(a, 'mystic')
                })),
                isSearching: false
            };
        }

        const hasActors = actorsData.isSearching 
            ? actorsData.actors.length > 0
            : (actorsData.pcs.length > 0 || actorsData.npcs.length > 0 || actorsData.mystics.length > 0);

        return {
            searchQuery: this.searchQuery,
            hasActors,
            ...actorsData
        };
    }

    // ========== EVENT LISTENER SETUP ==========
    /**
     * Activate event listeners using native DOM methods
     */
    _onRender(context, options) {
        const html = this.element;

        // Search functionality
        const searchInput = html.querySelector('.rnk-mystix-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.currentTarget.value;
                this.render({ force: false });
            });
            // Keep focus in search box after re-render if it was focused
            if (this.searchQuery) searchInput.focus();
        }

        // Assign buttons
        html.querySelectorAll('.rnk-mystix-assign-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this._onAssignPoints(e));
        });

        // Clear buttons
        html.querySelectorAll('.rnk-mystix-clear-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this._onClearPoints(e));
        });

        // Reset buttons
        html.querySelectorAll('.rnk-mystix-reset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this._onResetPoints(e));
        });

        // Reset all button
        const resetAllBtn = html.querySelector('.rnk-mystix-reset-all-btn');
        if (resetAllBtn) {
            resetAllBtn.addEventListener('click', (e) => this._onResetAllPoints(e));
        }

        // Actor row selection
        html.querySelectorAll('.rnk-mystix-actor-row').forEach(row => {
            row.addEventListener('click', (e) => {
                html.querySelectorAll('.rnk-mystix-actor-row').forEach(r => r.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                this.selectedActorId = e.currentTarget.dataset.actorId;
            });
        });
    }

    /**
     * Assign points to an actor
     */
    async _onAssignPoints(event) {
        event.preventDefault();
        
        const row = event.currentTarget.closest('.rnk-mystix-actor-row');
        const actorId = row.dataset.actorId;
        const actor = game.actors.get(actorId);

        if (!actor) {
            ui.notifications.error('Actor not found');
            return;
        }

        // Get input values
        const heroInput = row.querySelector('.rnk-mystix-hero-input');
        const mysticInput = row.querySelector('.rnk-mystix-mystic-input');

        const heroPoints = Math.max(0, parseInt(heroInput.value) || 0);
        const mysticPoints = Math.max(0, parseInt(mysticInput.value) || 0);

        try {
            await setActorPoints(actor, 'hero', heroPoints);
            await setActorPoints(actor, 'mystic', mysticPoints);
            ui.notifications.info(`Points assigned to ${actor.name}`);
            this.render({ force: true });
        } catch (error) {
            console.error('RNK Mystix | Error assigning points:', error);
            ui.notifications.error('Error assigning points');
        }
    }

    /**
     * Clear points from an actor
     */
    async _onClearPoints(event) {
        event.preventDefault();

        const row = event.currentTarget.closest('.rnk-mystix-actor-row');
        const actorId = row.dataset.actorId;
        const actor = game.actors.get(actorId);

        if (!actor) return;

        try {
            await clearActorPoints(actor, 'both');
            ui.notifications.info(`Points cleared for ${actor.name}`);
            this.render({ force: true });
        } catch (error) {
            console.error('RNK Mystix | Error clearing points:', error);
        }
    }

    /**
     * Reset points for a single actor
     */
    async _onResetPoints(event) {
        event.preventDefault();

        const row = event.currentTarget.closest('.rnk-mystix-actor-row');
        const actorId = row.dataset.actorId;
        const actor = game.actors.get(actorId);

        if (!actor) return;

        const defaultHero = game.settings.get('rnk-mystix', 'defaultHeroPoints');
        const defaultMystic = game.settings.get('rnk-mystix', 'defaultMysticPoints');

        try {
            await setActorPoints(actor, 'hero', defaultHero);
            await setActorPoints(actor, 'mystic', defaultMystic);
            ui.notifications.info(`Points reset for ${actor.name}`);
            this.render({ force: true });
        } catch (error) {
            console.error('RNK Mystix | Error resetting points:', error);
        }
    }

    /**
     * Reset all actor points globally
     */
    async _onResetAllPoints(event) {
        event.preventDefault();

        const dialog = new Dialog({
            title: 'Reset All Points',
            content: '<p>Are you sure you want to reset all points for all actors?</p>',
            buttons: {
                confirm: {
                    icon: '<i class="fas fa-check"></i>',
                    label: 'Reset All',
                    callback: async () => {
                        try {
                            await resetAllActorPoints();
                            ui.notifications.info('All actor points reset');
                            this.render({ force: true });
                        } catch (error) {
                            console.error('RNK Mystix | Error resetting all points:', error);
                        }
                    }
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: 'Cancel'
                }
            },
            default: 'cancel'
        });

        dialog.render(true);
    }
}
