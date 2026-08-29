import { ensureElement, formatSinaps } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

/**
 * Интерфейс финальной страницы заказа
 * @property { number } total - общая стоимость заказа
 */
interface ISuccess {
    total: number;  // общая стоимость заказа
}

interface ISuccessActions {
    onClick: () => void;
}

/**
 * View-класс страницы об успешном оформлении заказа
 */
class Success extends Component<ISuccess> {
    protected _close: HTMLElement;
    protected _total: HTMLElement;

    	/**
	 * Базовый конструктор
	 * @constructor
	 * @param { HTMLElement } container - объект контейнера (темплейта)
	 * @param { IEvents } events - брокер событий
	 * @param { ICardActions } actions - доступные события для привязки
	 */
    constructor(container: HTMLElement, events: IEvents, actions: ISuccessActions) {
        super(container, events);

        // Используемые элементы на странице
        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);
        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);

        // Привязываем событие закрытия страницы
        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    set total(value: number){
        this._total.textContent = `Списано ${formatSinaps(value)}`;
    }
}

export { Success }