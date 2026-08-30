import { EventEmitter } from "./components/base/Events";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { ShoppingCart } from "./components/models/ShoppingCart";
import { Buyer } from "./components/models/Buyer";
import { Modal } from "./components/views/Modal";
import { Basket } from "./components/views/Basket";
import { Gallery } from "./components/views/Gallery";
import { CardPreview } from "./components/views/CardPreview";
import { OrderForm } from "./components/views/OrderForm";
import { ContactsForm } from "./components/views/ContactsForm";
import { Header } from "./components/views/Header";
import { SuccessModal } from "./components/views/SuccessModal";
import { CDN_URL, API_URL } from "./utils/constants";
import { ServerApi } from "./components/ServerApi";
import { Api } from "./components/base/Api";
import { IProduct } from "./types";
import { cloneTemplate } from "./utils/utils";
import "./scss/styles.scss";

// Инициализация центрального диспетчера событий
const events = new EventEmitter();

// Создание экземпляров моделей данных
const productCatalog = new ProductCatalog(events);
const cart = new ShoppingCart(events);
const buyer = new Buyer(events);

// Инициализация базовых UI-компонентов
const modalRoot = document.querySelector(".modal") as HTMLElement;
const galleryRoot = document.querySelector(".gallery") as HTMLElement;
const headerRoot = document.querySelector(".header") as HTMLElement;

const modal = new Modal(modalRoot);
const gallery = new Gallery(events, galleryRoot);
const header = new Header(headerRoot, {
  onCartClick: () => events.emit("basket:open"),
});

// Подготовка контейнера корзины через клонирование шаблона
const basketTemplate = document.getElementById("basket") as HTMLTemplateElement;
const basketContainer = cloneTemplate(basketTemplate);

console.log("[Presenter] Система компонентов успешно запущена.");

// --- Загрузка каталога товаров ---
(async () => {
  try {
    const api = new Api(API_URL);
    const client = new ServerApi(api);

    console.log("[Presenter] Запрос списка товаров у сервера...");
    const rawResponse = await client.getProducts();

    // Нормализация ответа: поддерживаем разные форматы от бэкенда
    let productsList: IProduct[] = [];
    if (Array.isArray(rawResponse.items)) {
      productsList = rawResponse.items;
    } else if (Array.isArray(rawResponse)) {
      productsList = rawResponse;
    }

    productCatalog.setProducts(productsList);
  } catch (err) {
    console.error("[Presenter] Не удалось получить товары:", err);
  }
})();

// --- Реакция на обновление списка товаров ---
events.on("products:updated", (products: IProduct[]) => {
  console.log(
    `[Presenter] Доступно ${products.length} позиций. Синхронизация галереи...`,
  );
  gallery.catalog = products;
  console.log("[Presenter] Галерея обновлена.");
});

// --- Обработка клика по карточке товара ---
events.on("card:clicked", (product: IProduct) => {
  console.log(`[Presenter] Выбран товар: "${product.title}"`);
  productCatalog.setSelectedProduct(product);
});

// --- Инициализация превью товара ---
const previewTemplate = document.getElementById(
  "card-preview",
) as HTMLTemplateElement;
const previewElement = cloneTemplate(previewTemplate);

const previewCard = new CardPreview(previewElement, {
  onToggle: () => events.emit("preview:toggle"),
});

const updatePreviewState = () => {
  const selected = productCatalog.getSelectedProduct();
  if (!selected) return;

  // Логика кнопки: купить / удалить
  const isInCart = cart.getItems().some((item) => item.id === selected.id);
  const hasPrice = selected.price !== null;

  if (!hasPrice) {
    previewCard.button = "Нет цены";
    previewCard.buttonDisabled = true;
    return;
  }

  previewCard.button = isInCart ? "Убрать из корзины" : "Добавить в корзину";
  previewCard.buttonDisabled = false;
};

events.on("preview:changed", () => {
  const product = productCatalog.getSelectedProduct();
  if (!product) return;

  console.log(`[Presenter] Отображение превью: "${product.title}"`);

  previewCard.text = product.description || "Информация отсутствует";
  updatePreviewState();

  modal.render({
    content: previewCard.render({
      title: product.title,
      price: product.price,
      image: `${CDN_URL}${product.image}`,
      category: product.category,
    }),
  });
});

events.on("preview:toggle", () => {
  const product = productCatalog.getSelectedProduct();
  if (!product) return;

  const existing = cart.getItems().find((item) => item.id === product.id);
  if (existing) {
    cart.removeItem(existing);
  } else {
    cart.addItem(product);
  }
});

events.on("basket:remove", (product: IProduct) => {
  cart.removeItem(product);
});

// --- Модальное окно успеха ---
const successTemplate = document.getElementById(
  "success",
) as HTMLTemplateElement;
if (!successTemplate) throw new Error("Шаблон #success не обнаружен!");

const successContainer = cloneTemplate(successTemplate);
const successModal = new SuccessModal(successContainer, () => {
  events.emit("success:close");
});

events.on("success:close", () => {
  console.log("[Presenter] Окно подтверждения закрыто.");
  modal.close();
});

// --- Форма контактов (второй шаг оформления) ---
const contactsTemplate = document.getElementById(
  "contacts",
) as HTMLTemplateElement;
if (!contactsTemplate) throw new Error("Шаблон #contacts не найден!");

const contactsContainer = cloneTemplate(contactsTemplate);

const contactsForm = new ContactsForm(
  contactsContainer,
  (eventName, payload) => {
    if (eventName === "field:change") {
      buyer.updateData({ [payload.name]: payload.value });
    }

    if (eventName === "form:submit") {
      const data = buyer.getData();

      console.log("[Presenter] Отправка заказа...");

      const orderPayload = {
        payment: data.payment,
        email: data.email,
        phone: data.phone,
        address: data.address,
        total: cart.getTotal(),
        items: cart.getItems().map((item) => item.id),
      };

      (async () => {
        try {
          const api = new Api(API_URL);
          const client = new ServerApi(api);

          const response = await client.sendOrder(orderPayload);
          console.log("[Presenter] Заказ принят сервером.");

          successModal.price = response.total;

          modal.render({
            content: successModal.render(),
          });

          cart.clearData();
          buyer.clearData();
        } catch (error) {
          console.error("[Presenter] Ошибка при отправке заказа:", error);
          alert("Оформление заказа не удалось. Попробуйте позже.");
        }
      })();
    }
  },
);

// --- Форма выбора способа оплаты и адреса (первый шаг) ---
const orderTemplate = document.getElementById("order") as HTMLTemplateElement;
if (!orderTemplate) throw new Error("Шаблон #order отсутствует!");

const orderContainer = cloneTemplate(orderTemplate);

const orderForm = new OrderForm(orderContainer, (eventName, payload) => {
  if (eventName === "field:change") {
    buyer.updateData({ [payload.name]: payload.value });
  }

  if (eventName === "form:submit") {
    console.log("[Presenter] Переход к заполнению контактов.");
    modal.render({
      content: contactsForm.render(),
    });
  }
});

const syncFormStates = () => {
  const data = buyer.getData();
  const errors = buyer.getErrors();

  orderForm.payment = data.payment;
  orderForm.address = data.address;
  contactsForm.email = data.email;
  contactsForm.phone = data.phone;

  const stepOneErrors = [errors.address, errors.payment].filter(
    Boolean,
  ) as string[];
  orderForm.setErrors(stepOneErrors);
  orderForm.setSubmitState(stepOneErrors.length === 0);

  const stepTwoErrors = [errors.email, errors.phone].filter(
    Boolean,
  ) as string[];
  contactsForm.setErrors(stepTwoErrors);
  contactsForm.setSubmitState(stepTwoErrors.length === 0);
};

events.on("data:updated", syncFormStates);
events.on("data:cleared", syncFormStates);

// --- Корзина ---
const basket = new Basket(basketContainer, events);

events.on("order:open", () => {
  console.log("[Presenter] Запуск оформления заказа из корзины.");
  modal.render({
    content: orderForm.render(),
  });
});

events.on("basket:updated", () => {
  console.log(
    "[Presenter] Состояние корзины изменено. Обновление интерфейса...",
  );

  const items = cart.getItems();

  header.counter = items.length;
  basket.items = items;
  basket.total = cart.getTotal();
  basket.isButtonDisabled = items.length === 0;

  updatePreviewState();
});

events.on("basket:open", () => {
  console.log("[Presenter] Открытие модального окна корзины.");
  modal.render({
    content: basket.render(),
  });
});
