import { Events } from '../../types';
import { createElement, ensureElement, formatSinaps } from '../../utils/utils';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';

/**
 * Интерфейс корзины
 * @property { HTMLElement[] } items - отображение элементов в корзине
 * @property { number } total - общая стоимость корзины
 */
interface IBasketView {
	items: HTMLElement[];
	total: number;
	valid: boolean;
}

/**
 * View-класс корзины
 */
class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	/**
	 * Базовый конструктор
	 * @constructor
	 * @param { HTMLElement } container объект контейнера (темплейта)
	 * @param { IEvents } events брокер событий
	 */
	constructor(container: HTMLElement, events: EventEmitter) {
		super(container, events);

		// Используемые элементы корзины
		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		// Прослушиваем событие запуска формы оформления заказа
		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit(Events.OPEN_FIRST_ORDER_PART);
			});
		}

		// Инициализируем контейнер корзины
		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set total(total: number) {
		this.setText(this._total, formatSinaps(total));
	}

	set valid(value: boolean){
		this.setDisabled(this._button, !value);
	}
}

export { Basket };
