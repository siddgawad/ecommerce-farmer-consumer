export default function Hero() {
    return (
        <div className="flex items-center justify-center">
            {/* Deals/Product Carousel */}
            <div style={{ width: '100%', overflow: 'hidden', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', animation: 'scroll 20s linear infinite' }}>
                    {['Fresh Mangoes', 'Organic Tomatoes', 'Farm Eggs', 'Seasonal Offers'].map((deal, idx) => (
                        <div key={idx} style={{
                            minWidth: '300px',
                            margin: '0 1rem',
                            background: '#f5f5f5',
                            borderRadius: '8px',
                            padding: '1.5rem',
                            textAlign: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <h3>{deal}</h3>
                            <p>Special price! Limited time only.</p>
                        </div>
                    ))}
                </div>
                <style>
                    {`
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                `}
                </style>
            </div>

            {/* Products Section */}
            <div>
                <h2>Fresh Produce</h2>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    {[
                        { name: 'Tomatoes', img: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80' },
                        { name: 'Carrots', img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=400&q=80' },
                        { name: 'Spinach', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
                        { name: 'Mangoes', img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' },
                    ].map((product, idx) => (
                        <div key={idx} style={{
                            width: '180px',
                            background: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            textAlign: 'center',
                            padding: '1rem'
                        }}>
                            <img src={product.img} alt={product.name} style={{ width: '100%', borderRadius: '6px', marginBottom: '0.5rem' }} />
                            <h4>{product.name}</h4>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
}
