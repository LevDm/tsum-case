import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CatalogPage, ProductPage, CartPage } from "./pages";

import { PagesHeader } from "./components";

import basename from "./services/basename";

import "./styles/app.css";

function App() {
  const [cartItems, setCartItems] = useState({ value: [], count: 0 });

  const cartListHandler = ({ id, ids = [], action = 1 }) => {
    /**
     *action: >1? add;  0? del;  <0? dec
     */
    setCartItems((prev) => {
      const newValue = [...prev.value];
      const checkId = newValue.findIndex((el) => el.id == id);

      if (checkId >= 0) {
        const newItemCount = action == 0 ? 0 : action + newValue[checkId].count;
        if (newItemCount > 0) {
          newValue[checkId] = { ...newValue[checkId], count: newItemCount };
        } else {
          newValue.splice(checkId, 1);
        }
      } else if (action > 0) {
        newValue.push({
          id: id,
          count: action,
          ids: ids,
        });
      }

      return { value: newValue, count: newValue.reduce((acc, el) => acc + el.count, 0) };
    });
  };

  return (
    <>
      <BrowserRouter basename={basename}>
        <PagesHeader cartItemsCount={cartItems.count} />
        <main>
          <Routes>
            <Route
              path="/" // "/catalog"
              exact
              element={<CatalogPage />}
            />
            <Route
              path="/product/:id"
              element={<ProductPage cartListHandler={cartListHandler} />}
            />
            <Route
              path="/cart"
              element={<CartPage cartItems={cartItems.value} cartListHandler={cartListHandler} />}
            />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;
