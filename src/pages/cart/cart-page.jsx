import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductColor, getSize, getProduct } from "../../services/api";

import "../../styles/cart-product-card.css";

import basename from "../../services/basename";

export function CartPage({ cartItems, cartListHandler }) {
  const renderItems = (item) => (
    <CartItem key={`item-in-cart-${item.id}`} {...item} cartListHandler={cartListHandler} />
  );

  return (
    <section className="cart-container">
      {cartItems.length == 0 && <p>Товаров в корзине нет</p>}

      {cartItems.map(renderItems)}
    </section>
  );
}

const CartItem = React.memo(
  (props) => {
    const { id, count, cartListHandler, ids } = props;

    const handleClick = (action) => cartListHandler({ id: id, action: action });

    return (
      <article className="cart-product-card">
        <Link to={`/product/${ids.productId}`}>
          <ItemContent ids={ids} />
        </Link>
        <div className="cart-product-counter">
          <div>
            <button onClick={() => handleClick(1)}>+</button>
            {count}
            <button onClick={() => handleClick(-1)}>-</button>
          </div>
          <button onClick={() => handleClick(0)}>X</button>
        </div>
      </article>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.count == nextProps.count && prevProps.id == nextProps.id;
  }
);

const ItemContent = React.memo((props) => {
  const { ids } = props;

  const [item, setItem] = useState(null);

  useEffect(() => {
    (async () => {
      const [product, color, size] = await Promise.all([
        getProduct(ids.productId),
        getProductColor(ids.productId, ids.colorId),
        getSize(ids.sizeId),
      ]);

      const data = {
        name: product.name,

        imgSrc: color.images[0],
        colorName: color.name,
        price: color.price,

        sizeName: `${size.number} (${size.label})`,
      };
      setItem(data);
    })();
  }, []);

  if (!item) return null;

  const { imgSrc, name, colorName, sizeName, price } = item;

  return (
    <div className="cart-product-content">
      <img src={basename + imgSrc}></img>
      <div>
        <h2>{name}</h2>

        <p>
          {colorName} / {sizeName}
        </p>

        <h3>{price} $</h3>
      </div>
    </div>
  );
});
