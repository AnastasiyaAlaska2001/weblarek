import { Events, IPaymentType } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Form } from './Form';

/**
 * Интерфейс формы оплатой и доставкой
 * @property { IPaymentType } payment - способ оплаты
 * @property { string } address - адрес доставки
 */
interface IOrderDeliveryForm {
	payment: IPaymentType; // способ оплаты
	address: string; // адрес доставки
}

/**
 * View-класс формы выбора способа оплаты и адреса доставки
 */
class DeliveryForm extends Form<IOrderDeliveryForm> {
	protected _paymentContainer: HTMLDivElement;
	protected _paymentButtons: HTMLButtonElement[];


	/**
	 * Базовый конструктор
	 * @constructor
	 * @param { HTMLFormElement } container - объект контейнера (темплейта)
	 * @param { IEvents } events - брокер событий
	 */
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		// Используемые элементы на форме
		this._paymentContainer = ensureElement<HTMLDivElement>(
			'.order__buttons',
			this.container
		);
		this._paymentButtons = Array.from(
			this._paymentContainer.querySelectorAll('.button_alt')
		);

		// Подвязываем события выбора кнопки с типом оплаты
		this._paymentContainer.addEventListener('click', (e: MouseEvent) => {
			const target = e.target as HTMLButtonElement;
			// TODO: возможно тут стоит брать data-атрибут
			this.setClassPaymentMethod(target.name);
			events.emit(Events.SELECT_PAYMENT, { target: target.name });
		});
	}

	/**
	 * Управляем выделением кнопки в зависимости от выбранного способа оплаты
	 * @param { string } className выбранный способ оплаты
	 */
	setClassPaymentMethod(className: string): void {
		this._paymentButtons.forEach((btn) => {
			// TODO: возможно тут сравнивать с data-атрибутом
			if (btn.name === className) {
				this.toggleClass(btn, 'button_alt-active', true);
			} else {
				this.toggleClass(btn, 'button_alt-active', false);
			}
		});
	}

	set payment(value: string){
		this.setClassPaymentMethod(value);
	}

	set address(value: IPaymentType) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	// TODO: Стоит добавить метод на очистку выбора в контейнере
}

export { DeliveryForm, IOrderDeliveryForm };
