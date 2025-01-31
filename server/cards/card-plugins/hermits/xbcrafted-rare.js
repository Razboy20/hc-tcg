import HermitCard from './_hermit-card'
import CARDS from '../../../cards'

/*
Combination of Totem + Scars ability can be tricky here to get right
*/
class XBCraftedRareHermitCard extends HermitCard {
	constructor() {
		super({
			id: 'xbcrafted_rare',
			name: 'XB',
			rarity: 'rare',
			hermitType: 'explorer',
			health: 270,
			primary: {
				name: 'Giggle',
				cost: ['explorer'],
				damage: 50,
				power: null,
			},
			secondary: {
				name: 'Noice!',
				cost: ['explorer', 'any'],
				damage: 70,
				power: 'Noice! ignores any effect cards attached to opposing Hermit.',
			},
		})
	}

	register(game) {
		game.hooks.attack.tap(this.id, (target, turnAction, derivedState) => {
			const {attackerHermitCard, typeAction} = derivedState

			if (typeAction !== 'SECONDARY_ATTACK') return target
			if (!target.isActive) return target
			if (attackerHermitCard.cardId !== this.id) return target

			target.ignoreEffects = true
			return target
		})
	}
}

export default XBCraftedRareHermitCard
