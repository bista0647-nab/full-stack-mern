import { useEffect, useMemo, useState } from "react";

const categories = ["All", "Home", "Accessories", "Stationery"];
const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

function Icon({ name, size = 20 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  if (name === "bag") return <svg {...common}><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg>;
  if (name === "search") return <svg {...common}><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4 4" /></svg>;
  if (name === "close") return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>;
  return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("good-things-cart") || "[]");
      return Array.isArray(stored) ? stored : [];
    }
    catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState("");
  const [customer, setCustomer] = useState({ name: "", email: "", address: "" });

  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (search.trim()) params.set("search", search.trim());
    setLoading(true);
    setLoadError("");
    fetch(`${apiBase}/api/products?${params}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("We couldn't load the collection. Please try again.");
        return response.json();
      })
      .then(setProducts)
      .catch((error) => setLoadError(error.message))
      .finally(() => setLoading(false));
  }, [category, search]);

  useEffect(() => {
    localStorage.setItem("good-things-cart", JSON.stringify(cart));
  }, [cart]);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);

  function addToCart(product) {
    setCart((current) => {
      const found = current.find((item) => item._id === product._id);
      if (found) return current.map((item) => item._id === product._id ? { ...item, quantity: Math.min(item.quantity + 1, 20) } : item);
      return [...current, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function changeQuantity(id, amount) {
    setCart((current) => current.map((item) => item._id === id ? { ...item, quantity: Math.min(item.quantity + amount, 20) } : item).filter((item) => item.quantity > 0));
  }

  async function placeOrder(event) {
    event.preventDefault();
    setCheckoutStatus("");
    try {
      const response = await fetch(`${apiBase}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: cart.map((item) => ({ product: item._id, quantity: item.quantity })),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "We couldn't place your order.");
      setCart([]);
      setCheckoutOpen(false);
      setCartOpen(false);
      setCheckoutStatus(`Order ${result.id.slice(-6).toUpperCase()} placed — thank you, ${customer.name.split(" ")[0]}!`);
      setCustomer({ name: "", email: "", address: "" });
    } catch (error) {
      setCheckoutStatus(error.message);
    }
  }

  return (
    <>
      <div className="announcement">A little more thoughtful. A lot more lovely. <span>Free shipping over $75</span></div>
      <header className="site-header">
        <a className="wordmark" href="#" aria-label="Good Things home">good things<span>®</span></a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#shop">Shop all</a><a href="#story">Our story</a><a href="#newsletter">Journal</a>
        </nav>
        <div className="header-actions">
          <label className="search-box"><Icon name="search" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find your thing" aria-label="Search products" /></label>
          <button className="bag-button" onClick={() => setCartOpen(true)} aria-label={`Open shopping bag, ${itemCount} items`}><Icon name="bag" /><span>Bag</span><b>{itemCount}</b></button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> GOOD THINGS, MADE WELL</p>
            <h1>Everyday,<br /><em>considered.</em></h1>
            <p className="hero-description">Useful, beautiful things for the everyday. Made with care, chosen to last, and a joy to give.</p>
            <a className="button button-dark" href="#shop">Find your new favourite <Icon name="arrow" size={17} /></a>
            <div className="hero-footnote"><span>01 — 08</span><span className="hero-rule" /><span>THE EVERYDAY EDIT</span></div>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1500&q=90" alt="Warm, considered living room with natural textures" />
            <div className="image-note"><span>THE SUNDAY COLLECTION</span><b>Slow down a little.</b></div>
            <div className="image-stamp">GOOD<br />THINGS<br /><span>✳</span></div>
          </div>
        </section>

        <section className="promise-strip" id="story">
          <span>✳ Thoughtfully sourced</span><span>✳ Made for everyday</span><span>✳ Small makers, big heart</span><span>✳ Free shipping over $75</span>
        </section>

        <section className="shop-section" id="shop">
          <div className="section-heading">
            <div><p className="eyebrow">A FEW VERY GOOD THINGS</p><h2>The everyday edit<span>.</span></h2></div>
            <p className="section-note">The pieces you reach for, live with,<br />and end up giving to everyone.</p>
          </div>
          <div className="filter-row">
            <div className="category-tabs" aria-label="Filter by category">
              {categories.map((item) => <button key={item} className={category === item ? "category-tab active" : "category-tab"} onClick={() => setCategory(item)}>{item}</button>)}
            </div>
            <span className="product-count">{loading ? "Finding the good stuff…" : `${products.length} GOOD THINGS`}</span>
          </div>

          {loading && <div className="state-message">Gathering a few lovely things for you…</div>}
          {!loading && loadError && <div className="state-message error-message">{loadError} Check that the API and MongoDB are running.</div>}
          {!loading && !loadError && products.length === 0 && <div className="state-message">Nothing here just yet. Try another search or category.</div>}
          {!loading && !loadError && products.length > 0 && <div className="product-grid">
            {products.map((product, index) => <article className="product-card" key={product._id}>
              <button className="product-image" onClick={() => addToCart(product)} aria-label={`Add ${product.name} to bag`}>
                <img src={product.image} alt={product.name} loading={index > 2 ? "lazy" : "eager"} />
                {product.badge && <span className="product-badge">{product.badge}</span>}
                <span className="quick-add">+ Add to bag</span>
              </button>
              <div className="product-info"><div><p className="product-category">{product.category}</p><h3>{product.name}</h3></div><span className="product-price">{money(product.price)}</span></div>
              <p className="product-description">{product.description}</p>
            </article>)}
          </div>}
        </section>

        <section className="story-banner">
          <div className="story-image"><img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=85" alt="Thoughtfully arranged home objects" loading="lazy" /></div>
          <div className="story-copy"><p className="eyebrow">LESS, BUT A LITTLE BETTER</p><h2>Good things<br />feel like <em>home.</em></h2><p>We believe the things you live with should mean something. We look for the small makers, the good materials, and the details you notice every day.</p><a href="#shop" className="text-link">A little about us <Icon name="arrow" size={16} /></a></div>
          <span className="story-sparkle">✳</span>
        </section>

        <section className="newsletter" id="newsletter"><p className="eyebrow">A BETTER KIND OF EVERYDAY</p><h2>A good thing, every day.</h2><p>Thoughtful pieces, chosen to make the everyday feel a little more like yours.</p><a className="button button-dark" href="#shop">Browse the collection <Icon name="arrow" size={16} /></a></section>
      </main>

      <footer className="site-footer"><a className="wordmark footer-mark" href="#">good things<span>®</span></a><p>Useful, beautiful things for the everyday.</p><span>© 2025 GOOD THINGS STUDIO</span></footer>

      {checkoutStatus && <div className="toast" role="status">{checkoutStatus}<button onClick={() => setCheckoutStatus("")} aria-label="Dismiss"><Icon name="close" size={16} /></button></div>}

      {cartOpen && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
        <aside className="cart-drawer" aria-label="Shopping bag">
          <div className="drawer-heading"><div><p className="eyebrow">YOUR GOOD THINGS</p><h2>Your bag <span>({itemCount})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close bag"><Icon name="close" /></button></div>
          {cart.length === 0 ? <div className="empty-bag"><div className="empty-bag-icon"><Icon name="bag" size={26} /></div><h3>Your bag is taking a breather.</h3><p>Go find something lovely to bring home.</p><button className="button button-dark" onClick={() => setCartOpen(false)}>Explore the collection <Icon name="arrow" size={17} /></button></div> : <>
            <div className="cart-items">{cart.map((item) => <div className="cart-item" key={item._id}><img src={item.image} alt="" /><div className="cart-item-info"><h3>{item.name}</h3><span>{money(item.price)}</span><div className="quantity"><button onClick={() => changeQuantity(item._id, -1)} aria-label={`Remove one ${item.name}`}>−</button><span>{item.quantity}</span><button onClick={() => changeQuantity(item._id, 1)} aria-label={`Add one ${item.name}`}>+</button></div></div><span className="cart-line-total">{money(item.price * item.quantity)}</span></div>)}</div>
            <div className="cart-bottom"><div className="shipping-note">{subtotal >= 75 ? "Lovely — your shipping is on us." : `${money(75 - subtotal)} away from free shipping`}</div><div className="subtotal"><span>Subtotal</span><b>{money(subtotal)}</b></div><p>Shipping and taxes calculated at checkout.</p><button className="button button-dark checkout-button" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>Continue to checkout <Icon name="arrow" size={17} /></button></div>
          </>}
        </aside>
      </div>}

      {checkoutOpen && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCheckoutOpen(false); }}><section className="checkout-modal" aria-labelledby="checkout-title"><div className="drawer-heading"><div><p className="eyebrow">ALMOST YOURS</p><h2 id="checkout-title">Delivery details</h2></div><button className="icon-button" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout"><Icon name="close" /></button></div><form className="checkout-form" onSubmit={placeOrder}><label>Full name<input required minLength="2" autoComplete="name" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} /></label><label>Email address<input required type="email" autoComplete="email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} /></label><label>Delivery address<textarea required minLength="5" rows="3" autoComplete="street-address" value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} /></label><div className="checkout-total"><span>Total</span><b>{money(subtotal)}</b></div><button className="button button-dark checkout-button" type="submit">Place order <Icon name="arrow" size={17} /></button><p className="demo-payment-note">Demo checkout — no payment is collected.</p></form></section></div>}
    </>
  );
}

export default App;
