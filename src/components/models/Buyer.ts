import { IBuyer, ValidationErrors, TPayment } from "../../types";
import { EventEmitter } from "../base/Events";

export type BuyerEvent = "data:updated" | "data:cleared" | "validation:updated";

export class Buyer {
  private payment: TPayment | null = null;
  private address: string = "";
  private phone: string = "";
  private email: string = "";

  constructor(private events: EventEmitter) {}

  updateData(data: Partial<IBuyer>): void {
    const currentState = {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };

    if (data.payment !== undefined) {
      this.payment = data.payment;
    }

    if (data.address !== undefined) {
      this.address = data.address.trim();
    }

    if (data.phone !== undefined) {
      this.phone = data.phone.trim();
    }

    if (data.email !== undefined) {
      this.email = data.email.trim();
    }

    const hasChanges =
      currentState.payment !== this.payment ||
      currentState.address !== this.address ||
      currentState.phone !== this.phone ||
      currentState.email !== this.email;

    if (hasChanges) {
      this.events.emit("data:updated", data);
      const validationResult = {
        errors: this.getErrors(),
        isValid: this.isValid(),
      };
      this.events.emit("validation:updated", validationResult);
    }
  }

  getData(): IBuyer {
    return {
      payment: this.payment as TPayment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  isValid(): boolean {
    const errors = this.validateData();
    return Object.keys(errors).length === 0;
  }

  getErrors(): ValidationErrors<IBuyer> {
    return this.validateData();
  }

  clearData(): void {
    this.payment = null;
    this.address = "";
    this.phone = "";
    this.email = "";

    this.events.emit("data:cleared");
  }

  validateData(): ValidationErrors<IBuyer> {
    const errors: ValidationErrors<IBuyer> = {};

    if (!this.payment) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (!this.address) {
      errors.address = "Укажите адрес";
    }

    if (!this.email) {
      errors.email = "Введите email";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        errors.email = "Некорректный формат email";
      }
    }

    if (!this.phone) {
      errors.phone = "Введите телефон";
    } else {
      // Сначала проверяем наличие букв — это более явная ошибка
      if (/[a-z]/i.test(this.phone)) {
        errors.phone = "Телефон не должен содержать буквы";
      } else {
        // Если букв нет, проверяем формат
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(this.phone)) {
          errors.phone = "Некорректный формат телефона";
        }
      }
    }

    return errors;
  }
}
