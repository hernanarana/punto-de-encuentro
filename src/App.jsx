// src/App.jsx
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import TopBar from "./components/TopBar.jsx";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Footer from "./components/Footer.jsx";
import WhatsAppWidget from "./components/WhatsAppWidget.jsx";
import SupportModal from "./components/SupportModal.jsx";

import MobileTabBar from "./components/MobileTabBar.jsx";
import MobileCategoriesSheet from "./components/MobileCategoriesSheet.jsx";

export default function App() {
  const [showSupport, setShowSupport] = useState(false);
  const [showCats, setShowCats] = useState(false);

  return (
    <>
      <TopBar />
      <Header onOpenSupport={() => setShowSupport(true)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:slug" element={<Home />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
      </Routes>

      <Footer />
      <WhatsAppWidget />
      <SupportModal open={showSupport} onClose={() => setShowSupport(false)} />

      {/* Móvil */}
      <MobileTabBar
        onOpenCategories={() => setShowCats(true)}
        onOpenSupport={() => setShowSupport(true)}
      />
      <MobileCategoriesSheet open={showCats} onClose={() => setShowCats(false)} />
    </>
  );
}
