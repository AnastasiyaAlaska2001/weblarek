import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

/**
 * Интерфейс формы
 * @property { boolean } valid - признак валидности формы
 * @property { string[] } errors - список ошибок на форме
 */
interface IFormState {
	valid: boolean;
	errors: string[];
}

/**
 * View-класс формы
 */
class Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	/**
	 * Базовый конструктор
	 * @constructor
	 * @param { HTMLFormElement } container - объект контейнера (темплейта)
	 * @param { IEvents } events - брокер событий
	 */
	constructor(protected container: HTMLFormElement, events: IEvents) {
		super(container, events);

		// Используемые элементы формы
		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		// Прослушиваем события ввода в поле
		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		// Прослушиваем событие нажатия кнопки закрытия формы
		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	/**
	 * Генерируем событие при изменении в поле ввода
	 * @param { keyof T } field - отслеживаем свойство
	 * @param { string } value - новое значение в поле
	 */
	protected onInputChange(field: keyof T, value: string): void {
		const eventName = `${this.container.name}.${String(field)}:change`;
		this.events.emit(eventName, {
			field,
			value,
		});
	}

	set valid(value: boolean) {
		this.setDisabled(this._submit, !value);
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	render(state: Partial<T> & IFormState): HTMLFormElement {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}

export { Form };
