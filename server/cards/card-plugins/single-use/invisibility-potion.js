import SingleUseCard from './_single-use-card'
import {flipCoin} from '../../../utils'

class InvisibilityPotionSingleUseCard extends SingleUseCard {
	constructor() {
		super({
			id: 'invisibility_potion',
			name: 'Invisibility Potion',
			rarity: 'rare',
			description:
				"Flip a Coin.\n\nIf heads, no damage is done on opponent's next turn. If tails, double damage is done.\n\nDiscard after use.",
		})
		this.multiplier = 2
	}
	register(game) {
		game.hooks.applyEffect.tap(this.id, (action, derivedState) => {
			const {singleUseInfo, currentPlayer, opponentPlayer} = derivedState
			if (singleUseInfo?.id === this.id) {
				currentPlayer.coinFlips[this.id] = flipCoin(currentPlayer)
				opponentPlayer.custom[this.id] = currentPlayer.coinFlips[this.id][0]
				return 'DONE'
			}
		})

		game.hooks.attack.tap(this.id, (target, turnAction, derivedState) => {
			const {custom} = derivedState.currentPlayer
			if (!custom[this.id]) return target

			if (custom[this.id] === 'heads') {
				target.multiplier *= 0
			} else if (custom[this.id] === 'tails') {
				target.multiplier = this.multiplier
			}
			return target
		})

		game.hooks.turnEnd.tap(this.id, (derivedState) => {
			const {custom} = derivedState.currentPlayer
			if (custom[this.id]) delete custom[this.id]
		})
	}
}

export default InvisibilityPotionSingleUseCard
