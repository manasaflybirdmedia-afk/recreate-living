import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageCircle,
  Phone,
  Star
} from 'lucide-react';
import './LandingPage.css';

const WHATSAPP_NUMBER = '919949819132';
const CONTACT_PHONE = '+91 99498 19132';

function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// --- Data ---

const HERO_IMAGES = [
  '/assets/classic_sofa_1_1777354382396.png',
  '/assets/lshape_sofa_1_1777354147446.png',
  '/assets/custom_sofa_1_1777354400516.png'
];

const CATEGORIES = [
  {
    id: 'l-shape',
    title: 'L-Shape & Sectionals',
    description: 'Perfect for family movie nights and modern spaces. Cozy, spacious, and built to last.',
    images: [
      '/assets/lshape_sofa_1_1777354147446.png',
      '/assets/lshape_2_1777355196505.png',
      '/assets/lshape_3_1777355212084.png',
      '/assets/e3551154-27a8-4791-817b-3be2aea7912b.jpg',
      '/assets/4b31cf9c-e09b-4a22-84e5-ac6b7d6a6cf9.jpg'
    ]
  },
  {
    id: 'recliners',
    title: 'Luxury Recliners',
    description: 'Sink in and relax. The ultimate comfort chair for your living room or home theater.',
    images: [
      '/assets/recliner_sofa_1_1777354165736.png',
      '/assets/recliner_2_1777355235897.png',
      '/assets/recliner_3_1777355255036.png',
      '/assets/c425dc5d-ebe1-4bab-a9e4-18f316a4347e.png',
      '/assets/classic_sofa_1_1777354382396.png'
    ]
  },
  {
    id: 'sofa-cum-bed',
    title: 'Sofa Cum Beds',
    description: 'Smart and space-saving. A stylish sofa by day, a comfortable bed by night.',
    images: [
      '/assets/sofa_cum_bed_1_1777354186459.png',
      '/assets/sofacumbed_2_1777355271573.png',
      '/assets/sofacumbed_3_1777355288408.png',
      '/assets/c90c2aaf-126e-4ab2-a1d2-46c4d2a146cd.jpg',
      '/assets/custom_sofa_1_1777354400516.png'
    ]
  },
  {
    id: 'classic',
    title: 'Classic Sofa Sets',
    description: 'Timeless elegance and rich fabrics that give your home a royal touch.',
    images: [
      '/assets/classic_sofa_1_1777354382396.png',
      '/assets/classic_2_1777355644500.png',
      '/assets/classic_3_1777355661512.png',
      '/assets/4b31cf9c-e09b-4a22-84e5-ac6b7d6a6cf9.jpg',
      '/assets/c425dc5d-ebe1-4bab-a9e4-18f316a4347e.png'
    ]
  },
  {
    id: 'custom',
    title: 'Custom Designs',
    description: 'Have a Pinterest idea? Show us, and we will build it exactly to your room’s size and style.',
    images: [
      '/assets/custom_sofa_1_1777354400516.png',
      '/assets/custom_2_1777355679358.png',
      '/assets/custom_3_1777355695866.png',
      '/assets/c90c2aaf-126e-4ab2-a1d2-46c4d2a146cd.jpg',
      '/assets/e3551154-27a8-4791-817b-3be2aea7912b.jpg'
    ]
  }
];

const REVIEWS = [
  {
    name: 'Srinivas R.',
    location: 'Vijayawada',
    text: 'Beautiful finish and exact on-time installation. The custom L-shape we ordered fits perfectly in our living room. Highly recommended!'
  },
  {
    name: 'Meghana K.',
    location: 'Tadepalli',
    text: 'We shared a custom layout from Pinterest and they delivered exactly as promised. The velvet fabric quality is exceptional.'
  },
  {
    name: 'Rahul & Family',
    location: 'Guntur',
    text: 'Comfort, look and service all excellent. Our living room setup feels premium now. The 35 years of experience really shows in their finishing.'
  }
];

// --- Components ---

function ImageCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="sandria-category-carousel">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`View ${idx + 1}`}
          className={`sandria-category-img ${idx === currentIndex ? 'active' : ''}`}
        />
      ))}
      
      {images.length > 1 && (
        <>
          <button className="sandria-carousel-nav prev" onClick={prev}><ChevronLeft size={20} /></button>
          <button className="sandria-carousel-nav next" onClick={next}><ChevronRight size={20} /></button>
          <div className="sandria-carousel-dots">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`sandria-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// --- Main Page ---

export default function LandingPage() {
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000); // 4 seconds interval for smoother feel
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="sandria-shell">
      {/* Topbar */}
      <header className="sandria-topbar">
        <div className="sandria-container sandria-topbar-inner">
          <div className="sandria-topbar-left">
            <span>Vijayawada & Tadepalli's Premium Furniture Studio</span>
          </div>
          <div className="sandria-topbar-contact">
            <a href={`tel:${CONTACT_PHONE}`}><Phone size={14} /> Call Us: {CONTACT_PHONE}</a>
          </div>
        </div>
      </header>

      {/* Navbar */}
      <nav className="sandria-nav">
        <div className="sandria-container sandria-nav-inner">
          <a href="#" className="sandria-brand">
            <span className="sandria-brand-badge">R</span>
            ReCreate Living
          </a>
          <div className="sandria-menu">
            <a href="#collections">Collections</a>
            <a href="#about">Our Story</a>
            <a href="#reviews">Reviews</a>
            <a href="#location">Visit Us</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="sandria-hero">
        <div className="sandria-hero-bg">
          {HERO_IMAGES.map((img, idx) => (
            <div
              key={idx}
              className={`sandria-hero-slide ${idx === heroSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="sandria-hero-overlay"></div>
        </div>
        
        <div className="sandria-container sandria-hero-content">
          <span className="sandria-kicker">Made with Love in India</span>
          <h1>Your Dream Sofa, Handcrafted.</h1>
          <p>Beautiful, comfortable furniture made just for your home. Bringing families together with 35+ years of craftsmanship.</p>
          
          <a
            href={whatsappLink('Hi, I would like to know more about your sofa collections.')}
            target="_blank"
            rel="noreferrer"
            className="sandria-btn sandria-btn-whatsapp"
          >
            <MessageCircle size={20} />
            Enquire on WhatsApp
          </a>
        </div>
      </section>

      {/* Categories */}
      <section id="collections" className="sandria-section">
        <div className="sandria-container">
          <div className="sandria-section-head">
            <h2>Find Your Perfect Match</h2>
            <p>Browse our beautiful collections and find the one that feels like home.</p>
          </div>
          
          <div className="sandria-categories">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="sandria-category-card">
                <ImageCarousel images={cat.images} />
                <div className="sandria-category-info">
                  <h3>{cat.title}</h3>
                  <p>{cat.description}</p>
                  <a
                    href={whatsappLink(`Hi, I am interested in ${cat.title}. Can you share more details and pricing?`)}
                    target="_blank"
                    rel="noreferrer"
                    className="sandria-btn sandria-btn-outline"
                  >
                    Get Pricing
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Founder */}
      <section id="about" className="sandria-section sandria-about-bg">
        <div className="sandria-container sandria-about-grid">
          <div className="sandria-about-image">
            <img src="/assets/classy_sofa_about_1777356024211.png" alt="Luxurious Sofa" />
            <div className="sandria-legacy-badge">
              <span>35+</span>
              <span>Years of<br/>Legacy</span>
            </div>
          </div>
          
          <div className="sandria-about-content">
            <h2>Our Family's Legacy</h2>
            <p>
              For over 35 years, our family has been handcrafting sofas that bring people together. We handle everything from the strong wood frame to the final beautiful stitch. Whether you pick a design from our studio or want us to build a custom piece you found online, we're here to make your house feel like a true home.
            </p>
            <br/>
            <a
              href={whatsappLink('Hi, I have a custom furniture requirement. Can we discuss?')}
              target="_blank"
              rel="noreferrer"
              className="sandria-btn sandria-btn-whatsapp"
            >
              Discuss a Custom Project
            </a>
          </div>
        </div>
      </section>

      {/* Inspiration Gallery */}
      <section className="sandria-section" style={{ paddingBottom: '2rem' }}>
        <div className="sandria-container">
          <div className="sandria-section-head">
            <h2>Design Inspiration</h2>
            <p>A glimpse into the stunning spaces we've helped create.</p>
          </div>
          <div className="sandria-gallery">
            <div className="sandria-gallery-item"><img src="/assets/gallery_1_1777357521937.png" alt="Modern Living Room" /></div>
            <div className="sandria-gallery-item"><img src="/assets/gallery_2_1777357538506.png" alt="Premium Leather Sofa" /></div>
            <div className="sandria-gallery-item"><img src="/assets/gallery_3_1777357553083.png" alt="Classic Tufted Sofa" /></div>
          </div>
        </div>
      </section>

      {/* Strong WhatsApp CTA */}
      <section className="sandria-section">
        <div className="sandria-container">
          <div className="sandria-wa-cta">
            <h2>Got a design in mind?</h2>
            <p>Don't stress over details. Just send us a photo of what you want on WhatsApp, and we'll help you build the perfect sofa.</p>
            <a
              href={whatsappLink('Hi! I want to share some reference images for a sofa I need.')}
              target="_blank"
              rel="noreferrer"
              className="sandria-btn sandria-btn-whatsapp"
              style={{ fontSize: '1.2rem', padding: '1rem 2.5rem' }}
            >
              <MessageCircle size={24} />
              Message Us on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="sandria-section" style={{ background: '#f8fafc' }}>
        <div className="sandria-container">
          <div className="sandria-section-head">
            <h2>What Our Customers Say</h2>
            <p>Don't just take our word for it. Here's what families across our region think about their ReCreate Living furniture.</p>
          </div>
          
          <div className="sandria-reviews">
            {REVIEWS.map((review, idx) => (
              <div key={idx} className="sandria-review-card">
                <div className="sandria-stars">
                  <Star fill="currentColor" size={18} />
                  <Star fill="currentColor" size={18} />
                  <Star fill="currentColor" size={18} />
                  <Star fill="currentColor" size={18} />
                  <Star fill="currentColor" size={18} />
                </div>
                <p className="sandria-review-text">"{review.text}"</p>
                <div className="sandria-reviewer">
                  <h4>{review.name}</h4>
                  <span>{review.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="location" className="sandria-section">
        <div className="sandria-container">
          <div className="sandria-location">
            <div className="sandria-address">
              <h3>Visit Our Showroom</h3>
              
              <div className="sandria-address-item">
                <MapPin size={24} />
                <div>
                  <strong>ReCreate Living Studio</strong>
                  <p>Vijayawada & Tadepalli Region<br/>Andhra Pradesh, India</p>
                </div>
              </div>
              
              <div className="sandria-address-item">
                <Phone size={24} />
                <div>
                  <strong>Contact Numbers</strong>
                  <p>{CONTACT_PHONE}<br/>+91 73868 98855</p>
                </div>
              </div>
              
              <br/>
              <a href={`tel:${CONTACT_PHONE}`} className="sandria-btn sandria-btn-outline" style={{ borderColor: '#0f172a', color: '#0f172a', alignSelf: 'flex-start' }}>
                <Phone size={18} /> Call Studio Now
              </a>
            </div>
            
            <div className="sandria-map">
              {/* General Vijayawada Map Embed */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122410.15545041076!2d80.55171739504547!3d16.510165039230554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35eff9482d944b%3A0x939b7e84ab4f0260!2sVijayawada%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Shop Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="sandria-footer">
        <div className="sandria-container">
          <div className="sandria-footer-top">
            <div className="sandria-brand" style={{ color: 'white', marginBottom: '1rem' }}>
              <span className="sandria-brand-badge">R</span>
              ReCreate Living
            </div>
            
            <div className="sandria-social">
              <a href="https://www.instagram.com/recreate.living?igsh=d3BxMjd0YmNuY3Bn" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://youtube.com/@recreate.living?si=jIuRw6f3c92AUVMx" target="_blank" rel="noreferrer" aria-label="YouTube">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>
          
          <div className="sandria-footer-bottom">
            <p>&copy; 2026 ReCreate Living. Crafted furniture and interior solutions.</p>
            <p>Handcrafted in India with ❤️</p>
          </div>
        </div>
      </footer>

      {/* Floating WA Button */}
      <a
        href={whatsappLink('Hi, I am visiting your website and need some help.')}
        target="_blank"
        rel="noreferrer"
        className="sandria-float-wa"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle fill="white" size={32} />
      </a>
    </div>
  );
}
