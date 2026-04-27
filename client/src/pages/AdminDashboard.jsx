import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const API = 'http://localhost:3001/api';

/* ─── Login Page ──────────────────────────────────────── */
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      onLogin(data.user);
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo">
          <span className="logo-icon">R</span>
          <div>
            <h1>ReCreate Living</h1>
            <p>Admin Portal</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@recreateliving.com"
              required
            />
          </div>
          <div className="field-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>
        <p className="login-hint">Default: admin@recreateliving.com / Admin@123</p>
      </div>
    </div>
  );
}

/* ─── Sidebar ─────────────────────────────────────────── */
const NAV = [
  { key: 'overview', label: 'Overview', icon: '⊞' },
  { key: 'products', label: 'Products', icon: '🛋' },
  { key: 'stock', label: 'Stock', icon: '📦' },
  { key: 'team', label: 'Team', icon: '👥' },
];

function Sidebar({ active, setActive, user, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="logo-icon sm">R</span>
        <div>
          <strong>ReCreate Living</strong>
          <span>Admin Panel</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {NAV.map(n => (
          <button
            key={n.key}
            className={`nav-item ${active === n.key ? 'active' : ''}`}
            onClick={() => setActive(n.key)}
          >
            <span className="nav-icon">{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-user">
        <div className="user-avatar">{user.email[0].toUpperCase()}</div>
        <div className="user-info">
          <strong>{user.email.split('@')[0]}</strong>
          <span>{user.role}</span>
        </div>
        <button className="logout-btn" onClick={onLogout} title="Logout">⏻</button>
      </div>
    </aside>
  );
}

/* ─── Overview ────────────────────────────────────────── */
function Overview({ products }) {
  const totalStock = products.reduce((s, p) => s + Number(p.stock), 0);
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const outOfStock = products.filter(p => p.stock === 0).length;

  return (
    <div className="section">
      <h2 className="section-title">Dashboard Overview</h2>
      <div className="stats-grid">
        <div className="stat-card blue">
          <span className="stat-icon">🛋</span>
          <div>
            <p className="stat-label">Total Products</p>
            <h3 className="stat-value">{products.length}</h3>
          </div>
        </div>
        <div className="stat-card green">
          <span className="stat-icon">📦</span>
          <div>
            <p className="stat-label">Total Stock Units</p>
            <h3 className="stat-value">{totalStock}</h3>
          </div>
        </div>
        <div className="stat-card gold">
          <span className="stat-icon">💰</span>
          <div>
            <p className="stat-label">Inventory Value</p>
            <h3 className="stat-value">₹{totalValue.toLocaleString()}</h3>
          </div>
        </div>
        <div className="stat-card red">
          <span className="stat-icon">⚠️</span>
          <div>
            <p className="stat-label">Out of Stock</p>
            <h3 className="stat-value">{outOfStock}</h3>
          </div>
        </div>
      </div>

      <h3 className="sub-title">Product Summary</h3>
      <div className="product-grid">
        {products.map(p => (
          <div key={p.id} className="product-mini-card">
            <img src={p.image} alt={p.name} onError={e => { e.target.src = 'https://via.placeholder.com/80'; }} />
            <div>
              <strong>{p.name}</strong>
              <p>₹{p.price} · {p.stock} units</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Product Modal ───────────────────────────────────── */
function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(
    product || { name: '', description: '', price: '', stock: '', image: '' }
  );

  const handleSave = async () => {
    if (!form.name || !form.price) return alert('Name and price are required.');
    const method = form.id ? 'PUT' : 'POST';
    const url = form.id ? `${API}/products/${form.id}` : `${API}/products`;
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    onSave();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{form.id ? 'Edit Product' : 'Add New Product'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="field-group">
            <label>Product Name *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Royal Velvet Sofa" />
          </div>
          <div className="field-row">
            <div className="field-group">
              <label>Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0" />
            </div>
            <div className="field-group">
              <label>Stock Qty</label>
              <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0" />
            </div>
          </div>
          <div className="field-group">
            <label>Image URL</label>
            <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="/assets/your-image.jpg" />
          </div>
          <div className="field-group">
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description of the product…" />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-gold" onClick={handleSave}>
            {form.id ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Products Tab ────────────────────────────────────── */
function Products({ products, onRefresh }) {
  const [modal, setModal] = useState(null); // null | 'add' | product obj

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    await fetch(`${API}/products/${id}`, { method: 'DELETE' });
    onRefresh();
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">Products</h2>
        <button className="btn-gold" onClick={() => setModal({})}>+ Add Product</button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr><td colSpan={5} className="empty-row">No products yet. Click "Add Product" to begin.</td></tr>
            )}
            {products.map(p => (
              <tr key={p.id}>
                <td>
                  <div className="product-cell">
                    <img src={p.image} alt={p.name} onError={e => { e.target.src = 'https://via.placeholder.com/48'; }} />
                    <strong>{p.name}</strong>
                  </div>
                </td>
                <td className="desc-cell">{p.description}</td>
                <td><strong>₹{Number(p.price).toLocaleString()}</strong></td>
                <td>
                  <span className={`stock-badge ${p.stock > 0 ? 'in' : 'out'}`}>
                    {p.stock > 0 ? `${p.stock} units` : 'Out of stock'}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="btn-edit" onClick={() => setModal(p)}>✏️ Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(p.id)}>🗑 Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal !== null && (
        <ProductModal product={modal.id ? modal : null} onClose={() => setModal(null)} onSave={onRefresh} />
      )}
    </div>
  );
}

/* ─── Stock Tab ───────────────────────────────────────── */
function Stock({ products, onRefresh }) {
  const updateStock = async (id, delta) => {
    const product = products.find(p => p.id === id);
    const newStock = Math.max(0, Number(product.stock) + delta);
    await fetch(`${API}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, stock: newStock }),
    });
    onRefresh();
  };

  return (
    <div className="section">
      <h2 className="section-title">Stock Management</h2>
      <div className="stock-grid">
        {products.map(p => (
          <div key={p.id} className="stock-card">
            <img src={p.image} alt={p.name} onError={e => { e.target.src = 'https://via.placeholder.com/80'; }} />
            <h4>{p.name}</h4>
            <p className="stock-price">₹{Number(p.price).toLocaleString()}</p>
            <div className="stock-controls">
              <button className="stock-btn minus" onClick={() => updateStock(p.id, -1)}>−</button>
              <span className={`stock-num ${p.stock === 0 ? 'zero' : ''}`}>{p.stock}</span>
              <button className="stock-btn plus" onClick={() => updateStock(p.id, 1)}>+</button>
            </div>
            <span className={`stock-status ${p.stock > 0 ? 'in' : 'out'}`}>
              {p.stock > 5 ? '✅ In Stock' : p.stock > 0 ? '⚠️ Low Stock' : '❌ Out of Stock'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Team Tab ────────────────────────────────────────── */
function Team() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ email: '', password: '', role: 'member' });
  const [adding, setAdding] = useState(false);

  const fetchTeam = () => {
    fetch(`${API}/teams`).then(r => r.json()).then(setMembers);
  };

  useEffect(() => { fetchTeam(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await fetch(`${API}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ email: '', password: '', role: 'member' });
    setAdding(false);
    fetchTeam();
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">Team Members</h2>
        <button className="btn-gold" onClick={() => setAdding(!adding)}>+ Add Member</button>
      </div>

      {adding && (
        <form className="add-member-form" onSubmit={handleAdd}>
          <div className="field-row">
            <div className="field-group">
              <label>Email</label>
              <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="team@recreateliving.com" />
            </div>
            <div className="field-group">
              <label>Password</label>
              <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" />
            </div>
            <div className="field-group">
              <label>Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
              </select>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button type="button" className="btn-ghost" onClick={() => setAdding(false)}>Cancel</button>
            <button type="submit" className="btn-gold" style={{ marginLeft: '1rem' }}>Save Member</button>
          </div>
        </form>
      )}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id}>
                <td>
                  <div className="avatar-circle">{m.email[0].toUpperCase()}</div>
                </td>
                <td>{m.email}</td>
                <td><span className={`role-badge ${m.role}`}>{m.role}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Root Dashboard ──────────────────────────────────── */
export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [active, setActive] = useState('overview');
  const [products, setProducts] = useState([]);

  const fetchProducts = () => {
    fetch(`${API}/products`).then(r => r.json()).then(setProducts).catch(() => {});
  };

  useEffect(() => { if (user) fetchProducts(); }, [user]);

  if (!user) return <LoginPage onLogin={setUser} />;

  return (
    <div className="admin-layout">
      <Sidebar active={active} setActive={setActive} user={user} onLogout={() => setUser(null)} />
      <main className="admin-main">
        {active === 'overview' && <Overview products={products} />}
        {active === 'products' && <Products products={products} onRefresh={fetchProducts} />}
        {active === 'stock' && <Stock products={products} onRefresh={fetchProducts} />}
        {active === 'team' && <Team />}
      </main>
    </div>
  );
}
