import { IEvents } from '../base/events';
import { Form } from './Form';

/**
 * Интерфейс формы с контактной информацией
 * @property { string } email - почта для связи
 * @property { string } phone - телефон для связи
 */
interface IOrderContactsForm {
	email: string; // почта для связи
	phone: string; // телефон для связи
}

/**
 * View-класс формы с контактной информацией
 */
class ContactsForm extends Form<IOrderContactsForm> {
	/**
	 * Базовый конструктор
	 * @constructor
	 * @param { HTMLFormElement } container - объект контейнера (темплейта)
	 * @param { IEvents } events - брокер событий
	 */
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		// TODO: возможно стоит тут назначать привязку перехода по кнопке
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}

export { IOrderContactsForm, ContactsForm };
