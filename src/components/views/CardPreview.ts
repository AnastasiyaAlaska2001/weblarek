import { Card } from "./Card";

interface ICardPreviewActions {
  onToggle: () => void;
}

export class CardPreview extends Card {
  constructor(container: HTMLElement, actions?: ICardPreviewActions) {
    super(container);

    const realBuyButton = this.container.querySelector(
      ".card__button",
    ) as HTMLButtonElement | null;

    if (realBuyButton) {
      this.buyButton = realBuyButton;

      if (actions?.onToggle) {
        const handleToggle = () => actions.onToggle();

        this.buyButton.addEventListener("click", handleToggle);

        this.buyButton.addEventListener("keydown", (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        });
      }
    }
  }

  set text(value: string) {
    const textElement = this.container.querySelector(".card__text");
    if (textElement) {
      textElement.textContent = value;
    }
  }

  set button(value: string) {
    if (this.buyButton) {
      this.buyButton.textContent = value;
    }
  }

  set buttonDisabled(value: boolean) {
    if (!this.buyButton) return;

    this.buyButton.disabled = value;

    const baseClass = "button_alt";
    const disabledClass = "button_alt-disabled";

    if (value) {
      this.buyButton.classList.remove(baseClass);
      this.buyButton.classList.add(disabledClass);
    } else {
      this.buyButton.classList.remove(disabledClass);
      this.buyButton.classList.add(baseClass);
      this.buyButton.removeAttribute("aria-disabled");
    }
  }
}
