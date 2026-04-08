import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { supabase } from './supabase-client';

const SubscriptionForm = () => {
    const [formData, setFormData] = useState({
        shipping: {
            firstName: '',
            lastName: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            pinCode: '',
            email: '',
            mobile: ''
        },
        billingSameAsShipping: true,
        billing: {
            firstName: '',
            lastName: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            pinCode: '',
            email: '',
            mobile: ''
        },
        products: []
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleInputChange = (section, field, value) => {
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
        "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
        "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", 
        "Ladakh", "Lakshadweep", "Puducherry"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.products.length === 0) {
            alert('Please select at least one magazine to subscribe to.');
            return;
        }

        setIsSubmitting(true);
        
        try {
            await supabase.from('subscriptions').insert([{
                first_name: formData.shipping.firstName,
                last_name: formData.shipping.lastName,
                email: formData.shipping.email,
                mobile: formData.shipping.mobile,
                address1: formData.shipping.address1,
                address2: formData.shipping.address2,
                city: formData.shipping.city,
                state: formData.shipping.state,
                pin_code: formData.shipping.pinCode,
                status: 'pending',
                products: formData.products
            }]);

            console.log('Subscription saved to database');
            setShowSuccess(true);
        } catch (error) {
            console.error('Error saving subscription:', error);
            alert('There was an error processing your request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="sub-page-wrapper">
            <style>{`
                .sub-page-wrapper {
                    font-family: 'Nunito', sans-serif;
                    max-width: 600px;
                    margin: 0 auto;
                    padding-bottom: 100px; /* Space for sticky footer */
                }
                
                .back-nav {
                    padding: 1rem 0;
                    margin-bottom: 0.5rem;
                }
                .back-nav a {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    color: #64748b;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 0.95rem;
                }

                .form-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 10px 25px rgba(30, 55, 153, 0.05);
                    border: 1px solid #f1f5f9;
                }

                .form-header {
                    margin-bottom: 2rem;
                }
                .form-header h2 {
                    color: #1e3a8a;
                    font-size: 1.5rem;
                    font-weight: 800;
                    margin: 0;
                }
                .form-header p {
                    color: #64748b;
                    font-size: 0.9rem;
                    margin-top: 0.25rem;
                }

                .form-section {
                    margin-bottom: 2rem;
                }
                .section-title {
                    font-size: 1rem;
                    font-weight: 800;
                    color: #1e3a8a;
                    margin-bottom: 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .section-title i {
                    color: #739d41;
                    font-size: 1.1rem;
                }

                .form-group {
                    margin-bottom: 1.25rem;
                }
                .form-group label {
                    display: block;
                    font-weight: 700;
                    color: #334155;
                    font-size: 0.9rem;
                    margin-bottom: 0.5rem;
                }
                .required::after {
                    content: ' *';
                    color: #ef4444;
                }

                input, select {
                    width: 100%;
                    padding: 0.8rem;
                    border: 2px solid #f1f5f9;
                    border-radius: 12px;
                    font-family: inherit;
                    font-size: 1rem;
                    background: #f8fafc;
                    transition: all 0.2s;
                }
                input:focus, select:focus {
                    outline: none;
                    border-color: #739d41;
                    background: white;
                    box-shadow: 0 0 0 4px rgba(115, 157, 65, 0.1);
                }

                .grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                /* Product Selection Styling */
                .product-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 0.5rem;
                }
                .product-option {
                    position: relative;
                    cursor: pointer;
                }
                .product-option input {
                    display: none;
                }
                .product-box {
                    padding: 1rem;
                    border: 2px solid #f1f5f9;
                    border-radius: 12px;
                    text-align: center;
                    background: #f8fafc;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }
                .product-box i {
                    font-size: 1.5rem;
                    color: #64748b;
                }
                .product-box span {
                    font-weight: 800;
                    color: #334155;
                }
                .product-option input:checked + .product-box {
                    border-color: #739d41;
                    background: #f0f9eb;
                }
                .product-option input:checked + .product-box i {
                    color: #739d41;
                }
                .product-option input:checked + .product-box span {
                    color: #1e3a8a;
                }
                .product-check-badge {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    width: 24px;
                    height: 24px;
                    background: #739d41;
                    color: white;
                    border-radius: 12px;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                .product-option input:checked ~ .product-check-badge {
                    display: flex;
                }

                /* Sticky Footer */
                .sticky-cta-container {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: white;
                    padding: 1rem;
                    box-shadow: 0 -10px 20px rgba(0,0,0,0.05);
                    z-index: 100;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.75rem;
                }
                
                .cta-btn {
                    width: 100%;
                    max-width: 500px;
                    background: #739d41;
                    color: white;
                    border: none;
                    padding: 1.1rem;
                    font-size: 1.1rem;
                    font-weight: 800;
                    border-radius: 14px;
                    cursor: pointer;
                    box-shadow: 0 4px 14px rgba(115, 157, 65, 0.4);
                    transition: transform 0.2s, background 0.2s;
                }
                .cta-btn:active {
                    transform: scale(0.98);
                }
                .cta-btn:disabled {
                    background: #cbd5e1;
                    box-shadow: none;
                    cursor: not-allowed;
                }

                /* Success Modal */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(15, 23, 42, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }
                .modal-card {
                    background: white;
                    border-radius: 24px;
                    padding: 2.5rem 2rem;
                    max-width: 450px;
                    width: 90%;
                    text-align: center;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .modal-icon {
                    width: 80px;
                    height: 80px;
                    background: #f0f9eb;
                    color: #739d41;
                    border-radius: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    margin: 0 auto 1.5rem;
                }
                .modal-card h3 {
                    color: #1e3a8a;
                    font-size: 1.5rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                }
                .modal-card p {
                    color: #64748b;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                    font-size: 1.1rem;
                }
                .modal-btn {
                    background: #1e3a8a;
                    color: white;
                    border: none;
                    width: 100%;
                    padding: 1rem;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .modal-btn:hover {
                    background: #1e3799;
                    transform: translateY(-2px);
                }

                @media (max-width: 480px) {
                    .form-card {
                        padding: 1.25rem;
                        border-radius: 0;
                        box-shadow: none;
                        border: none;
                        background: transparent;
                    }
                    .sub-page-wrapper {
                        padding-top: 0;
                    }
                    .grid-2 {
                        grid-template-columns: 1fr;
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            
            <div className="back-nav">
                <a href="/magazines.html">
                    <i className="fas fa-chevron-left"></i> Back to Store
                </a>
            </div>

            <form onSubmit={handleSubmit} className="form-card">
                <div className="form-header">
                    <h2>Subscription Details</h2>
                </div>

                {/* 0. PRODUCT SELECTION */}
                <div className="form-section">
                    <div className="section-title">
                        <i className="fas fa-shopping-cart"></i>
                        Select Magazine *
                    </div>
                    <div className="product-grid">
                        <label className="product-option">
                            <input 
                                type="checkbox" 
                                checked={formData.products.includes('Little Whiz')} 
                                onChange={(e) => {
                                    const current = [...formData.products];
                                    if (e.target.checked) current.push('Little Whiz');
                                    else current.splice(current.indexOf('Little Whiz'), 1);
                                    handleInputChange(null, 'products', current);
                                }}
                            />
                            <div className="product-box">
                                <i className="fas fa-child"></i>
                                <span>Little Whiz</span>
                            </div>
                            <div className="product-check-badge"><i className="fas fa-check"></i></div>
                        </label>

                        <label className="product-option">
                            <input 
                                type="checkbox" 
                                checked={formData.products.includes('EurekaFM')} 
                                onChange={(e) => {
                                    const current = [...formData.products];
                                    if (e.target.checked) current.push('EurekaFM');
                                    else current.splice(current.indexOf('EurekaFM'), 1);
                                    handleInputChange(null, 'products', current);
                                }}
                            />
                            <div className="product-box">
                                <i className="fas fa-lightbulb"></i>
                                <span>EurekaFM</span>
                            </div>
                            <div className="product-check-badge"><i className="fas fa-check"></i></div>
                        </label>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', marginTop: '0.75rem' }}>
                        (You can choose one or both magazines)
                    </p>
                </div>

                {/* 1. PARENT INFO */}
                <div className="form-section">
                    <div className="section-title">
                        <i className="fas fa-user-friends"></i>
                        Contact Information
                    </div>
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="required">First Name</label>
                            <input type="text" required placeholder="Parent's first name" value={formData.shipping.firstName} onChange={(e) => handleInputChange('shipping', 'firstName', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="required">Last Name</label>
                            <input type="text" required placeholder="Last name" value={formData.shipping.lastName} onChange={(e) => handleInputChange('shipping', 'lastName', e.target.value)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="required">Email Address</label>
                        <input type="email" required placeholder="your@email.com" value={formData.shipping.email} onChange={(e) => handleInputChange('shipping', 'email', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="required">Mobile Number</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ background: '#f1f5f9', padding: '0.8rem', borderRadius: '12px', fontWeight: '700', color: '#64748b', border: '2px solid #f1f5f9' }}>+91</div>
                            <input type="tel" style={{ flex: 1 }} required placeholder="10-digit mobile number" value={formData.shipping.mobile} onChange={(e) => handleInputChange('shipping', 'mobile', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* 2. SHIPPING ADDRESS */}
                <div className="form-section">
                    <div className="section-title">
                        <i className="fas fa-truck"></i>
                        Delivery Address
                    </div>
                    <div className="form-group">
                        <label className="required">House / Flat / Area</label>
                        <input type="text" required placeholder="Building name, apartment number" value={formData.shipping.address1} onChange={(e) => handleInputChange('shipping', 'address1', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Locality / Landmark</label>
                        <input type="text" placeholder="Optional landmark" value={formData.shipping.address2} onChange={(e) => handleInputChange('shipping', 'address2', e.target.value)} />
                    </div>
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="required">City</label>
                            <input type="text" required placeholder="City" value={formData.shipping.city} onChange={(e) => handleInputChange('shipping', 'city', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="required">Pin Code</label>
                            <input type="text" required placeholder="6-digit code" value={formData.shipping.pinCode} onChange={(e) => handleInputChange('shipping', 'pinCode', e.target.value)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="required">State</label>
                        <select required value={formData.shipping.state} onChange={(e) => handleInputChange('shipping', 'state', e.target.value)}>
                            <option value="">Select State</option>
                            {indianStates.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Sticky CTA Area */}
                <div className="sticky-cta-container">
                    <button type="submit" className="cta-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>

            {/* Success Modal */}
            {showSuccess && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <div className="modal-icon">
                            <i className="fas fa-check"></i>
                        </div>
                        <h3>Submission Successful!</h3>
                        <p>
                            Your subscription request has been received successfully! Our team will contact you within 24 hours to activate your subscription.
                        </p>
                        <button className="modal-btn" onClick={() => window.location.href = '/magazines.html'}>
                            Return to Magazines
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const container = document.getElementById('subscription-root');
if (container) createRoot(container).render(<SubscriptionForm />);
