import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Star, CheckCircle, Leaf } from 'lucide-react';
import SafeImage from '../ui/SafeImage';
import { useCart } from '../../context/CartContext';

const ProductDetailsModal = ({ product, onClose }) => {
    const { cart, updateQuantity } = useCart();

    // Default weight logic
    const defaultWeight = product.unitType === 'kg' ? '1kg' : (product.unitType === 'l' ? '1L' : 'Pack');
    const [selectedWeight, setSelectedWeight] = useState(defaultWeight);

    // Variant matching logic
    const variantId = `${product.id}-${selectedWeight}`;
    const cartItem = cart.find(c => `${c.id}-${c.selectedWeight || 'std'}` === variantId);

    const calculatePrice = (weight) => {
        if (product.unitType === 'pc') return product.price;
        const base = product.perUnitSellingPrice || product.price;
        let multiplier = 1;
        if (weight === '500g' || weight === '500ml') multiplier = 0.55;
        if (weight === '250g' || weight === '250ml') multiplier = 0.30;
        return Math.floor(base * multiplier);
    };

    const currentPrice = calculatePrice(selectedWeight);

    const handleIncrement = () => {
        const item = { ...product, selectedWeight, price: currentPrice };
        updateQuantity(item, (cartItem?.quantity || 0) + 1);
    };

    const handleDecrement = () => {
        const item = { ...product, selectedWeight, price: currentPrice };
        updateQuantity(item, (cartItem?.quantity || 0) - 1);
    };

    if (!product) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-purple-900/40 backdrop-blur-sm animate-in">
            <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-slate-400 hover:text-purple-600 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Left: Image Side */}
                <div className="w-full md:w-1/2 h-64 md:h-auto bg-slate-50 relative">
                    <SafeImage
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-8"
                    />

                    {/* Badge Overlay */}
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                        <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-sm ${product.isVeg ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                            <div className={`w-2 h-2 rounded-full ${product.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                            {product.isVeg ? 'VEGETARIAN' : 'NON-VEG'}
                        </div>
                        {product.discount > 0 && (
                            <div className="bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                                {product.discount}% OFF
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Content Side */}
                <div className="w-full md:w-1/2 p-8 overflow-y-auto flex flex-col">
                    <div className="mb-6">
                        <p className="text-xs font-bold text-purple-400 uppercase tracking-[0.2em] mb-1">{product.brand}</p>
                        <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">{product.name}</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-100 text-yellow-700 font-bold text-sm">
                                <Star size={14} className="fill-yellow-500 text-yellow-500" />
                                {product.rating}
                            </div>
                            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">{product.category}</span>
                        </div>
                    </div>

                    {/* Weight Selection */}
                    {(product.unitType === 'kg' || product.unitType === 'l') && (
                        <div className="mb-6">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Select Quantity</h4>
                            <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
                                {['250', '500', '1kg/1L'].map((label, idx) => {
                                    const val = label === '250' ? (product.unitType === 'kg' ? '250g' : '250ml')
                                        : label === '500' ? (product.unitType === 'kg' ? '500g' : '500ml')
                                            : (product.unitType === 'kg' ? '1kg' : '1L');
                                    const isSel = selectedWeight === val;
                                    return (
                                        <button
                                            key={val}
                                            onClick={() => setSelectedWeight(val)}
                                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isSel ? 'bg-white text-purple-700 shadow-sm border border-purple-100' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            {label === '1kg/1L' ? (product.unitType === 'kg' ? '1 kg' : '1 L') : label + (product.unitType === 'kg' ? 'g' : 'ml')}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="mb-8 flex-1">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Product Description</h4>
                        <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100/50">
                            <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                                "{product.description || 'No description available for this cosmic item.'}"
                            </p>
                        </div>
                    </div>

                    {/* Price and Action */}
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100">
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-slate-900">₹{currentPrice}</span>
                                {product.discount > 0 && (
                                    <span className="text-sm text-slate-400 line-through font-bold">₹{product.perUnitOriginalPrice}</span>
                                )}
                            </div>
                            <p className="text-[10px] font-bold text-green-600 flex items-center gap-1 mt-1">
                                <CheckCircle size={10} /> IN STOCK & READY
                            </p>
                        </div>

                        {cartItem ? (
                            <div className="flex items-center bg-purple-900 rounded-xl p-1 shadow-lg shadow-purple-900/10">
                                <button onClick={handleDecrement} className="w-8 h-8 flex items-center justify-center text-white hover:bg-purple-800 rounded-lg transition-colors"><Minus size={16} /></button>
                                <span className="font-bold text-white text-base w-8 text-center">{cartItem.quantity}</span>
                                <button onClick={handleIncrement} className="w-8 h-8 flex items-center justify-center text-white hover:bg-purple-800 rounded-lg transition-colors"><Plus size={16} /></button>
                            </div>
                        ) : (
                            <button
                                onClick={handleIncrement}
                                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-purple-700 transition-all shadow-lg shadow-purple-900/10 flex items-center gap-2 active:scale-95 translate-y-0 hover:-translate-y-1"
                            >
                                <ShoppingBag size={16} /> ADD TO CART
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal;
