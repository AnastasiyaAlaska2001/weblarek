import { Form } from "./Form";
import { TPayment } from "../../types";

export class OrderForm extends Form {
  private cardButton: HTMLButtonElement | null;
  private cashButton: HTMLButtonElement | null;

  constructor(
    container: HTMLElement,
    onUserAction: (eventName: string, payload: any) => void,
  ) {
    super(container, onUserAction);

    this.cardButton = this.formElement.querySelector('button[name="card"]');
    this.cashButton = this.formElement.querySelector('button[name="cash"]');

    const handlePaymentSelect = (paymentValue: TPayment) => {
      this.onUserAction("field:change", {
        name: "payment",
        value: paymentValue,
      });
    };

    if (this.cardButton) {
      this.cardButton.addEventListener("click", () =>
        handlePaymentSelect(TPayment.CARD),
      );
      this.cardButton.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handlePaymentSelect(TPayment.CARD);
        }
      });
    }

    if (this.cashButton) {
      this.cashButton.addEventListener("click", () =>
        handlePaymentSelect(TPayment.CASH),
      );
      this.cashButton.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handlePaymentSelect(TPayment.CASH);
        }
      });
    }
  }

  set payment(value: TPayment | null) {
    const isCard = value === TPayment.CARD;
    const isCash = value === TPayment.CASH;

    if (this.cardButton) {
      this.cardButton.classList.toggle("button_alt-active", isCard);
      this.cardButton.setAttribute("aria-pressed", String(isCard));
    }

    if (this.cashButton) {
      this.cashButton.classList.toggle("button_alt-active", isCash);
      this.cashButton.setAttribute("aria-pressed", String(isCash));
    }
  }

  set address(value: string) {
    const el = this.inputs["address"] as HTMLInputElement | undefined;
    if (el) {
      el.value = value;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }
}
