import { ensureElement, formatSinaps } from '../../utils/utils';
import { IEvents } from '../base/events';
import { ICardActions } from './Card';
import { Component } from '../base/Component';

/**
 * Интерфейс элементов корзины
 * @property { number } index - индекс лота в корзине
 * @property { string } title - название лота
 * @property { number } price - цена лота
 * @method delete - удаляем лот из корзины
 */
interface IBasketCard {
	index: number; // индекс лота в корзине
	title: string; // название лота
	price: number; // цена лота
	delete: () => void; // удаляем лот из корзины
}

/**
 * View-класс карточки в корзине
 * TODO: сделать наследование от Card
 */
class BasketItem extends Component<IBasketCard> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _deleteBtn: HTMLButtonElement;

	/**
	 * Базовый конструктор
	 * @constructor
	 * @param { HTMLElement } container - объект контейнера (темплейта)
	 * @param { IEvents } events брокер событий
	 * @param { ICardActions } actions доступные события для привязки
	 */
	constructor(container: HTMLElement, events: IEvents, actions?: ICardActions) {
		super(container, events);

		// Используемые элементы у объекта в корзине
		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._deleteBtn = container.querySelector('.card__button');

		// Прослушиваем событие удаление элемента из корзины
		this._deleteBtn.addEventListener('click', (event: MouseEvent) => {
			actions.onClick?.(event);
		});
	}

	set index(value: number) {
		this.setText(this._index, value + 1);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		this.setText(this._price, formatSinaps(value));
	}
}

export { BasketItem };
