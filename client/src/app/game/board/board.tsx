import CARDS from 'server/cards'
import {CardT} from 'types/cards'
import Card from 'components/card'
import HealthBar from 'components/health-bar'
import css from './board.module.css'
import classnames from 'classnames'
import {GameState, PlayerState, BoardRow} from 'types/game-state'

const TYPED_CARDS = CARDS as Record<string, CardT>

type SlotType = 'item' | 'hermit' | 'effect' | 'health'
type SlotProps = {
	type: SlotType
	onClick: () => void
	cardId: string | null
	rowState: BoardRow
	active: boolean
}
const Slot = ({type, onClick, cardId, rowState, active}: SlotProps) => {
	let card = cardId ? TYPED_CARDS[cardId] : null
	if (type === 'health' && rowState.health) {
		card = {
			type: 'health',
			health: rowState.health,
			id: 'health_' + rowState.health,
		}
	}
	return (
		<div
			onClick={onClick}
			className={classnames(css.slot, {
				[css[type]]: true,
				[css.empty]: !card,
				[css.afk]: card?.type === 'hermit' && !active,
			})}
		>
			{card ? (
				<div className={css.cardWrapper}>
					<Card card={card} />
				</div>
			) : (
				<img className={css.frame} src="/images/frame.png" />
			)}
		</div>
	)
}

const getCardIdBySlot = (
	slotType: SlotType,
	index: number,
	rowState: BoardRow | null
): string | null => {
	if (!rowState) return null
	if (slotType === 'hermit') return rowState.hermitCard || null
	if (slotType === 'effect') return rowState.effectCard || null
	if (slotType === 'item')
		return rowState.itemCards ? rowState.itemCards[index] || null : null
	return null
}

type HermitRowProps = {
	type: 'left' | 'right'
	onClick: (meta: any) => void
	rowState: BoardRow
	active: boolean
}
const HermitRow = ({type, onClick, rowState, active}: HermitRowProps) => {
	const handleSlotClick = (slotType: SlotType, slotIndex: number) => {
		onClick({slotType, slotIndex})
	}
	const slotTypes: Array<SlotType> = [
		'item',
		'item',
		'item',
		'effect',
		'hermit',
		'health',
	]
	const slots = slotTypes.map((slotType, index) => {
		return (
			<Slot
				onClick={() => handleSlotClick(slotType, index)}
				cardId={getCardIdBySlot(slotType, index, rowState)}
				rowState={rowState}
				active={active}
				key={slotType + '-' + index}
				type={slotType}
			/>
		)
	})
	if (type === 'right') slots.reverse()
	return <div className={css.hermitRow}>{slots}</div>
}

type Props = {
	onClick: (meta: any) => void
	gameState: GameState
}
function Board({onClick, gameState}: Props) {
	const handeRowClick = (
		playerId: string,
		rowIndex: number,
		rowState: BoardRow | null,
		meta: any
	) => {
		onClick({
			...meta,
			playerId,
			rowIndex,
			hermitId: rowState?.hermitCard || null,
		})
	}

	const makeRows = (playerState: PlayerState, type: 'left' | 'right') => {
		const rows = playerState.board.rows
		return new Array(5).fill(null).map((_, index) => {
			if (!rows[index]) throw new Error('Rendering board row failed')
			return (
				<HermitRow
					key={index}
					rowState={rows[index]}
					active={index === playerState.board.activeRow}
					onClick={handeRowClick.bind(null, playerState.id, index, rows[index])}
					type={type}
				/>
			)
		})
	}

	const [player1, player2] = Object.values(gameState.players)
	return (
		<div className={css.board}>
			<div className={css.leftPlayer}>
				<div className={css.playerInfo}>
					<div className={css.playerName}>{player1.playerName}</div>
					<HealthBar lives={player1.lives} />
				</div>
				{makeRows(player1, 'left')}
			</div>
			<div className={css.rightPlayer}>
				<div className={css.playerInfo}>
					<HealthBar lives={player2.lives} />
					<div className={css.playerName}>{player2.playerName}</div>
				</div>
				{makeRows(player2, 'right')}
			</div>
		</div>
	)
}

export default Board