
import React, { useState, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NotificationDrawer from './components/NotificationDrawer';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import FEFO from './pages/FEFO';
import Orders from './pages/Orders';
import Payments from './pages/Payments';
import Customers from './pages/Customers';
import CustomerDetails from './pages/CustomerDetails';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';

// Initial Mock Data
// TODO: Replace with FastAPI call to fetch initial products
const INITIAL_PRODUCTS = [
    { id: '1', name: 'Organic Whole Milk', sku: 'DAI-0492', category: 'Dairy', stock: 124, price: 65, status: 'Active', image: 'https://picsum.photos/seed/milk/100/100' },
    { id: '2', name: 'Artisan Sourdough Loaf', sku: 'BAK-8812', category: 'Bakery', stock: 12, price: 120, status: 'Active', image: 'https://picsum.photos/seed/bread/100/100' },
    { id: '3', name: 'Eco-Clean Detergent', sku: 'HOU-5521', category: 'Household', stock: 45, price: 499, status: 'Active', image: 'https://picsum.photos/seed/soap/100/100' },
    { id: '4', name: 'Cavendish Bananas', sku: 'PRO-1029', category: 'Produce', stock: 5, price: 40, status: 'Active', image: 'https://picsum.photos/seed/banana/100/100' },
];

// TODO: Replace with FastAPI call to fetch initial orders
const INITIAL_ORDERS = [
    { id: '#ORD-8821', customerMobile: '+91 98765 43210', dateTime: 'Oct 24, 2023 14:32', total: 1250, paymentStatus: 'Paid', method: 'Home', status: 'Pending' },
    { id: '#ORD-8822', customerMobile: '+91 81234 56789', dateTime: 'Oct 24, 2023 15:10', total: 450, paymentStatus: 'Pending', method: 'Pickup', status: 'Pending' },
    { id: '#ORD-8823', customerMobile: '+91 70123 45678', dateTime: 'Oct 23, 2023 09:15', total: 2100, paymentStatus: 'Paid', method: 'Home', status: 'Delivered' },
];

const Layout = ({ children, onLogout }) => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar onLogout={onLogout} />
            <div className="flex-1 flex flex-col min-w-0">
                <Header onNotificationClick={() => setIsNotificationsOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f6f7f8]">
                    {children}
                </main>
            </div>
            <NotificationDrawer
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
            />
        </div>
    );
};

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [orders, setOrders] = useState(INITIAL_ORDERS);

    // Global Actions
    // TODO: Replace with FastAPI call to update order status
    const updateOrderStatus = (id, newStatus) => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    };

    // TODO: Replace with FastAPI call to update product details
    const updateProductDetails = (id, updates) => {
        setProducts(prev => prev.map(p => {
            if (p.id === id) {
                const updated = { ...p, ...updates };
                // Sync status with stock
                if (updates.stock !== undefined) {
                    updated.status = updates.stock === 0 ? 'Inactive' : 'Active';
                }
                return updated;
            }
            return p;
        }));
    };

    // TODO: Replace with FastAPI call for applying discount
    const applyDiscount = (id, percentage) => {
        setProducts(prev => prev.map(p =>
            p.id === id ? { ...p, price: Number((p.price * (1 - percentage / 100)).toFixed(2)) } : p
        ));
    };

    if (!isAuthenticated) {
        return <Login onLogin={() => setIsAuthenticated(true)} />;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout onLogout={() => setIsAuthenticated(false)}><Dashboard orders={orders} products={products} /></Layout>} />
                <Route path="/inventory" element={<Layout onLogout={() => setIsAuthenticated(false)}><Inventory products={products} onUpdateProduct={updateProductDetails} /></Layout>} />
                <Route path="/fefo" element={<Layout onLogout={() => setIsAuthenticated(false)}><FEFO products={products} onApplyDiscount={applyDiscount} /></Layout>} />
                <Route path="/orders" element={<Layout onLogout={() => setIsAuthenticated(false)}><Orders orders={orders} onUpdateStatus={updateOrderStatus} /></Layout>} />
                <Route path="/payments" element={<Layout onLogout={() => setIsAuthenticated(false)}><Payments /></Layout>} />
                <Route path="/customers" element={<Layout onLogout={() => setIsAuthenticated(false)}><Customers /></Layout>} />
                <Route path="/customers/:id" element={<Layout onLogout={() => setIsAuthenticated(false)}><CustomerDetails /></Layout>} />
                <Route path="/users" element={<Layout onLogout={() => setIsAuthenticated(false)}><Users /></Layout>} />
                <Route path="/analytics" element={<Layout onLogout={() => setIsAuthenticated(false)}><Analytics /></Layout>} />
                <Route path="/settings" element={<Layout onLogout={() => setIsAuthenticated(false)}><Settings /></Layout>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
