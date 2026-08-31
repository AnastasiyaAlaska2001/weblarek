import { Card } from "./Card";
import { categoryMap } from "../../utils/constants";

interface ICardPreviewActions {
  onToggle: () => void;
}

export class CardPreview extends Card {
  private buyButton: HTMLButtonElement | null = null;
  private categoryElement: HTMLElement | null = null;
  private imageElement: HTMLImageElement | null = null;

  constructor(container: HTMLElement, actions?: ICardPreviewActions) {
    super(container);

    this.buyButton = container.querySelector(".card__button") as HTMLButtonElement | null;
    this.categoryElement = container.querySelector(".card__category");
    this.imageElement = container.querySelector(".card__image") as HTMLImageElement | null;

    if (this.buyButton && actions?.onToggle) {
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

  set category(value: string) {
    if (!this.categoryElement) return;

    this.categoryElement.className = "card__category";
    const modifier = categoryMap[value as keyof typeof categoryMap];
    if (modifier) {
      this.categoryElement.classList.add(modifier);
    }
    this.categoryElement.textContent = value;
  }

  set image(value: string) {
    if (!this.imageElement) return;
    this.imageElement.src = "";
    this.imageElement.alt = "Товар";
    this.imageElement.src = value;
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

  override render(
    data?: Partial<{
      title: string;
      price: number | null;
      category: string;
      image: string;
      text: string;
      button: string;
      buttonDisabled: boolean;
    }>
  ): HTMLElement {
    super.render(data);
    if (!data) return this.container;

    if ("category" in data && data.category !== undefined) {
      this.category = data.category;
    }
    if ("image" in data && data.image !== undefined) {
      this.image = data.image;
    }
    if ("text" in data && data.text !== undefined) {
      this.text = data.text;
    }
    if ("button" in data && data.button !== undefined) {
      this.button = data.button;
    }
    if ("buttonDisabled" in data && data.buttonDisabled !== undefined) {
      this.buttonDisabled = data.buttonDisabled;
    }

    return this.container;
  }
}
