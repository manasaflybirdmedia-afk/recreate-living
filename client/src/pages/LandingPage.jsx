import React, { useEffect, useState } from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav style={{ padding: '1.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container flex items-center justify-between">
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>ReCreate Living</h1>
          <div className="flex" style={{ gap: '2rem' }}>
            <a href="#about" style={{ fontWeight: 500 }}>About</a>
            <a href="#collections" style={{ fontWeight: 500 }}>Collections</a>
            <a href="/admin" style={{ fontWeight: 500, color: 'var(--accent)' }}>Admin</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '6rem 0', background: 'var(--primary)', color: 'white', textAlign: 'center' }}>
        <div className="container animate-fade-in">
          <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'white' }}>Crafted for Comfort</h2>
          <p style={{ fontSize: '1.25rem', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Premium handcrafted sofas designed to transform your living spaces. Wholesale & Retail - Vijayawada & Tadepalli.
          </p>
          <button className="btn btn-accent flex items-center" style={{ margin: '0 auto', gap: '0.5rem' }}>
            Explore Collections <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* Products Section */}
      <section id="collections" style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Featured Collections</h2>
            <p style={{ color: 'var(--text-muted)' }}>Discover our signature handcrafted pieces.</p>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {products.map(product => (
              <div key={product.id} className="glass-panel" style={{ overflow: 'hidden', transition: 'transform 0.3s' }} 
                   onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                   onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ height: '250px', background: '#f1f5f9', overflow: 'hidden' }}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Sofa' }}
                  />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>{product.name}</h3>
                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>${product.price}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: '0.8rem', color: product.stock > 0 ? '#10b981' : '#ef4444' }}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                    <button className="btn" style={{ padding: '0.5rem 1rem', background: '#f1f5f9' }}>
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--primary)', color: 'white', padding: '3rem 0', textAlign: 'center' }}>
        <p>© 2026 ReCreate Living. All rights reserved.</p>
      </footer>
    </div>
  );
}
