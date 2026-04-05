import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const SubscriptionForm = () => {
    const [formData, setFormData] = useState({
        startMonth: '',
        startYear: '2026',
        shipping: {
            firstName: '',
            lastName: '',
            designation: '',
            organization: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            pinCode: '',
            country: 'India',
            email: '',
            mobile: ''
        },
        billingSameAsShipping: true,
        billing: {
            firstName: '',
            lastName: '',
            designation: '',
            organization: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            pinCode: '',
            country: 'India',
            email: '',
            mobile: ''
        }
    });

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

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentYear = new Date().getFullYear();
    const years = [currentYear.toString(), (currentYear + 1).toString()];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
        alert('Payment integration would happen here!');
    };

    return (
        <div className="sub-form-container">
            <style>{`
                .sub-form-container {
                    background: #e9ede4;
                    padding: 2.5rem;
                    border-radius: 8px;
                    font-family: 'Nunito', sans-serif;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    margin-top: 1rem;
                }
                .form-header-badge {
                    background: #739d41;
                    color: white;
                    display: inline-flex;
                    align-items: center;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 2rem;
                }
                .badge-number {
                    background: #5d7e34;
                    padding: 0.5rem 1rem;
                    font-weight: 800;
                    font-size: 1.2rem;
                }
                .badge-text {
                    padding: 0.5rem 1.5rem;
                    font-weight: 700;
                    font-size: 1.1rem;
                }
                
                .form-section {
                    margin-bottom: 2.5rem;
                }
                .section-label {
                    font-weight: 800;
                    color: #4a5568;
                    margin-bottom: 1rem;
                    display: block;
                    font-size: 1.1rem;
                }
                
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                    margin-bottom: 1.25rem;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                }
                .form-group.full-width {
                    grid-column: 1 / -1;
                }
                
                label {
                    font-weight: 600;
                    color: #4a5568;
                    font-size: 0.95rem;
                }
                .required::after {
                    content: '*';
                    color: #e53e3e;
                    margin-left: 2px;
                }
                
                input, select {
                    padding: 0.7rem;
                    border: 1px solid #cbd5e0;
                    border-radius: 4px;
                    font-family: inherit;
                    font-size: 1rem;
                    background: white;
                }
                input:focus, select:focus {
                    outline: none;
                    border-color: #739d41;
                    box-shadow: 0 0 0 2px rgba(115, 157, 65, 0.2);
                }
                
                .radio-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    margin-top: 1rem;
                }
                .radio-option {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                }
                
                .promo-link {
                    color: #1a365d;
                    text-decoration: underline;
                    font-weight: 700;
                    margin-top: 1.5rem;
                    display: inline-block;
                }
                .promo-link span {
                    color: #e53e3e;
                    text-decoration: none;
                    display: inline-block;
                }

                .final-price-msg {
                    text-align: right;
                    color: #4a5568;
                    font-weight: 600;
                }
                
                .form-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-top: 3rem;
                }
                
                .make-payment-btn {
                    background: #6b8e23;
                    color: white;
                    border: none;
                    padding: 1.25rem 4rem;
                    font-size: 1.4rem;
                    font-weight: 700;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .make-payment-btn:hover {
                    background: #55711c;
                }
                
                .trust-badges {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }
                .trust-badges img {
                    height: 50px;
                }
                
                .terms {
                    text-align: right;
                    margin-top: 2rem;
                    font-size: 0.85rem;
                    color: #718096;
                }

                @media (max-width: 640px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                    .badge-text { padding: 0.5rem 0.75rem; font-size: 0.9rem; }
                    .badge-number { padding: 0.5rem 0.75rem; font-size: 1rem; }
                }
            `}</style>
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <a href="/magazines.html" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem' }}>
                        <i className="fas fa-arrow-left"></i> Back to Magazines
                    </a>
                </div>
                <div className="form-header-badge">
                    <span className="badge-number">3</span>
                    <span className="badge-text">Subscription form</span>
                </div>

                <div className="form-section">
                    <div className="form-row" style={{ gridTemplateColumns: 'auto 1fr 1fr', alignItems: 'center' }}>
                        <span className="section-label required" style={{ margin: 0 }}>Start Subscription From</span>
                        <div className="form-group">
                            <select 
                                value={formData.startMonth} 
                                onChange={(e) => handleInputChange(null, 'startMonth', e.target.value)}
                                required
                            >
                                <option value="">Select Month</option>
                                {months.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <select 
                                value={formData.startYear} 
                                onChange={(e) => handleInputChange(null, 'startYear', e.target.value)}
                                required
                            >
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <span className="section-label">Shipping Address</span>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="required">First Name</label>
                            <input type="text" required value={formData.shipping.firstName} onChange={(e) => handleInputChange('shipping', 'firstName', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="required">Last Name</label>
                            <input type="text" required value={formData.shipping.lastName} onChange={(e) => handleInputChange('shipping', 'lastName', e.target.value)} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Designation</label>
                            <input type="text" value={formData.shipping.designation} onChange={(e) => handleInputChange('shipping', 'designation', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Organization</label>
                            <input type="text" value={formData.shipping.organization} onChange={(e) => handleInputChange('shipping', 'organization', e.target.value)} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group full-width">
                            <label className="required">Address Line 1</label>
                            <input type="text" required value={formData.shipping.address1} onChange={(e) => handleInputChange('shipping', 'address1', e.target.value)} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group full-width">
                            <label>Address Line 2</label>
                            <input type="text" value={formData.shipping.address2} onChange={(e) => handleInputChange('shipping', 'address2', e.target.value)} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="required">City</label>
                            <input type="text" required value={formData.shipping.city} onChange={(e) => handleInputChange('shipping', 'city', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="required">State</label>
                            <select required value={formData.shipping.state} onChange={(e) => handleInputChange('shipping', 'state', e.target.value)}>
                                <option value="">[Select One]</option>
                                <option value="Kerala">Kerala</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                                <option value="Karnataka">Karnataka</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="required">Pin Code</label>
                            <input type="text" required value={formData.shipping.pinCode} onChange={(e) => handleInputChange('shipping', 'pinCode', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="required">Country</label>
                            <input type="text" required readOnly value={formData.shipping.country} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="required">Email</label>
                            <input type="email" required value={formData.shipping.email} onChange={(e) => handleInputChange('shipping', 'email', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="required">Mobile No.</label>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <input type="text" style={{ width: '50px' }} value="91" readOnly />
                                <input type="tel" required placeholder="Please enter 10 digit number" value={formData.shipping.mobile} onChange={(e) => handleInputChange('shipping', 'mobile', e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <span className="section-label">Billing Address</span>
                    <div className="radio-group">
                        <label className="radio-option">
                            <input 
                                type="radio" 
                                name="billingSameAsShipping" 
                                checked={formData.billingSameAsShipping} 
                                onChange={() => setFormData(prev => ({...prev, billingSameAsShipping: true}))} 
                            />
                            Same as shipping address
                        </label>
                        <label className="radio-option">
                            <input 
                                type="radio" 
                                name="billingSameAsShipping" 
                                checked={!formData.billingSameAsShipping} 
                                onChange={() => setFormData(prev => ({...prev, billingSameAsShipping: false}))} 
                            />
                            Billing address diffrent from shipping
                        </label>
                    </div>
                </div>

                {!formData.billingSameAsShipping && (
                    <div className="form-section billing-fields">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="required">First Name</label>
                                <input type="text" required value={formData.billing.firstName} onChange={(e) => handleInputChange('billing', 'firstName', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="required">Last Name</label>
                                <input type="text" required value={formData.billing.lastName} onChange={(e) => handleInputChange('billing', 'lastName', e.target.value)} />
                            </div>
                        </div>
                        {/* More fields could be added here similar to shipping */}
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                    <a href="#" className="promo-link" onClick={(e) => e.preventDefault()}>
                        Click here <span>if you have promo code (Optional)</span>
                    </a>
                    <div className="final-price-msg">
                        Choose a subscription package to get final Price.
                    </div>
                </div>

                <div className="form-footer">
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <button type="submit" className="make-payment-btn">
                            Make Payment
                        </button>
                    </div>
                    <div className="trust-badges">
                        <img src="https://img.businesswire.com/z/20121011005574/en/2237845/2/CCavenue.jpg" alt="CCAvenue" style={{ height: '40px' }} />
                        <div style={{ background: '#3182ce', color: 'white', padding: '5px 10px', borderRadius: '50%', fontWeight: '800', lineHeight: 1, textAlign: 'center', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                            100% Guaranteed
                        </div>
                    </div>
                </div>

                <div className="terms">
                    Terms & Conditions*
                </div>
            </form>
        </div>
    );
};

const container = document.getElementById('subscription-root');
if (container) createRoot(container).render(<SubscriptionForm />);
