import SingleUseCard from './_single-use-card'
import {flipCoin} from '../../../utils'

class FortuneSingleUseCard extends SingleUseCard {
	constructor() {
		super({
			id: 'fortune',
			name: 'Fortune',
			rarity: 'ultra_rare',
			description:
				'Any coin flip(s) necessary for user\'s attack are not needed and "heads" is assummed.\n\nDiscard after use.',
		})
	}

	register(game) {
		game.hooks.applyEffect.tap(this.id, (action, derivedState) => {
			const {singleUseInfo, currentPlayer} = derivedState
			if (singleUseInfo?.id === this.id) {
				currentPlayer.custom[this.id] = true
				return 'DONE'
			}
		})

		game.hooks.turnEnd.tap(this.id, (derivedState) => {
			const {currentPlayer} = derivedState
			delete currentPlayer.custom[this.id]
		})
	}
}

export default FortuneSingleUseCard
