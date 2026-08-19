import "./scss/styles.scss";

import { Buyer } from "./components/models/Buyer";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { ServerApi } from "./components/communication/ServerApi";
import { IOrderResultApi } from "./types";
import { apiProducts } from "./utils/data";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { ShoppingCart } from "./components/models/ShoppingCart";

const buyerModel = new Buyer();
buyerModel.savePaymentType("card");
buyerModel.saveAddress("Moscow, Leninskaya st");
buyerModel.saveEmail("buyer@gmail.com");
buyerModel.savePhone("89038752853");
console.log("Данные покупателя:", buyerModel.getData());
buyerModel.clearBuyerData();
console.log("Валидация после очистки:", buyerModel.validate());

const apiModel = new Api(API_URL);
const serverApiModel = new ServerApi(apiModel);

serverApiModel
  .getProducts()
  .then((result: IOrderResultApi) => {
    console.log("Товары с сервера:", result.items.length, "товаров");
    productsModel.saveProducts(result.items);
    shoppingCartModel.addSelectedProduct(result.items[0]);
    shoppingCartModel.addSelectedProduct(result.items[1]);
    console.log(
      "Корзина после добавления:",
      shoppingCartModel.getSelectedProductsAmount(),
      "товаров, сумма:",
      shoppingCartModel.getTotal(),
    );
  })
  .catch((error) => console.error("Ошибка API:", error));

const productsModel = new ProductCatalog();
productsModel.saveProducts(apiProducts.items);
console.log("Каталог:", productsModel.getProducts().length, "товаров");
console.log(
  "Товар по ID:",
  productsModel.getProductByID("854cef69-976d-4c2a-a18c-2aa45046c390")?.title,
);
productsModel.saveProduct(apiProducts.items[0]);

const shoppingCartModel = new ShoppingCart();
shoppingCartModel.addSelectedProduct(apiProducts.items[0]);
shoppingCartModel.addSelectedProduct(apiProducts.items[1]);
shoppingCartModel.addSelectedProduct(apiProducts.items[2]);
console.log(
  "Корзина до удаления:",
  shoppingCartModel.getSelectedProductsAmount(),
  "товаров, сумма:",
  shoppingCartModel.getTotal(),
);
shoppingCartModel.deleteSelectedProduct("854cef69-976d-4c2a-a18c-2aa45046c390");
console.log(
  "Корзина после удаления:",
  shoppingCartModel.getSelectedProductsAmount(),
  "товаров",
);
shoppingCartModel.clearShoppingCart();
