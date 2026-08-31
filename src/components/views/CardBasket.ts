import { Card } from "./Card";

interface ICardBasketActions {
  onDelete: () => void;
}

interface ICardBasketActions {
  onDelete: () => void;
}

export class CardBasket extends Card {
  private deleteButton: HTMLButtonElement | null = null;
  private indexEl: HTMLElement | null = null;

  constructor(container: HTMLElement, actions: ICardBasketActions) {
    super(container);

    this.deleteButton = container.querySelector(
      ".basket__item-delete",
    ) as HTMLButtonElement;
    this.indexEl = container.querySelector(".basket__item-index");

    if (this.deleteButton) {
      const handleDelete = (e: MouseEvent) => {
        e.stopPropagation();
        actions.onDelete();
      };

      this.deleteButton.addEventListener("click", handleDelete);

      this.deleteButton.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          actions.onDelete();
        }
      });
    }
  }

  set index(value: number) {
    if (this.indexEl) {
      this.indexEl.textContent = `${value}.`;
    }
  }

  override render(
    data?: Partial<{
      title: string;
      price: number | null;
      index: number;
    }>,
  ): HTMLElement {
    super.render(data);
    if (!data) return this.container;

    if ("index" in data && data.index !== undefined) {
      this.index = data.index;
    }

    return this.container;
  }
}
