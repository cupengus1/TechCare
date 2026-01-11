import { useState, useEffect } from 'react'
import './index.css'

// Cấu hình Telegram (Bạn cần thay đổi Token và Chat ID của mình tại đây)
const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: null });
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    message: ''
  });

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, error: null });

    const text = `🆕 YÊU CẦU MỚI TỪ WEBSITE:
👤 Khách hàng: ${formData.name}
📞 Điện thoại: ${formData.phone}
🛠 Dịch vụ: ${formData.service}
📝 Nội dung: ${formData.message || 'Không có'}`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text
        })
      });

      if (response.ok) {
        setFormStatus({ loading: false, success: true, error: null });
        setFormData({ name: '', phone: '', service: '', message: '' });
        showPopup('Cảm ơn bạn! Yêu cầu của bạn đã được gửi đi thành công.', 'success');
      } else {
        const errorData = await response.json();
        console.error('Telegram API Error:', errorData);
        throw new Error(errorData.description || 'Gửi yêu cầu thất bại.');
      }
    } catch (error) {
      console.error('Submit Error:', error);
      setFormStatus({ loading: false, success: false, error: error.message });
      showPopup(`Lỗi: ${error.message}\n(Vui lòng kiểm tra lại Token Bot hoặc Chat ID)`, 'error');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Navbar scroll effect
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Active section
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      sections.forEach(section => {
          const sectionTop = section.offsetTop;
          if (window.scrollY >= sectionTop - 200) {
              current = section.getAttribute('id');
          }
      });
      if (current) setActiveSection(current);

      // Back to top visibility
      const backToTop = document.getElementById('backToTop');
      if (backToTop) {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(id);
        setMobileMenuOpen(false); // Close menu on click
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="container nav-container">
            <div className="logo" onClick={scrollToTop}>
                {/* Updated logo source to point to public folder */}
                <img src="/TechCare_don.png" alt="TechCare Logo" className="logo-image" />
            </div>

            <div className={`menu-toggle ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
                <li><a href="#home" onClick={(e) => scrollToSection(e, 'home')} className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}>Trang Chủ</a></li>
                <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className={`nav-link ${activeSection === 'services' ? 'active' : ''}`}>Dịch Vụ</a></li>
                <li><a href="#about" onClick={(e) => scrollToSection(e, 'about')} className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}>Giới Thiệu</a></li>
                <li><a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}>Liên Hệ</a></li>
                <li className="mobile-cta-li"><button className="cta-button mobile-cta" onClick={(e) => scrollToSection(e, 'contact')}>Liên Hệ Ngay</button></li>
            </ul>
            <button className="cta-button desktop-cta" onClick={(e) => scrollToSection(e, 'contact')}>Liên Hệ Ngay</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-background">
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
            <div className="gradient-orb orb-3"></div>
        </div>
        <div className="container hero-container">
            <div className="hero-content">
                <div className="hero-badge">
                    <span className="badge-icon">⚡</span>
                    <span>Hỗ Trợ Kỹ Thuật 24/7</span>
                </div>
                <h1 className="hero-title">
                    TechCare
                </h1>
                <h1 className="small-title">
                    Hỗ Trợ Cài Đặt & Fix Lỗi Máy Tính<br />
                </h1>
                 <h1 className="little-title">
                    TechCare - You tech, Our care<br />
                </h1>
                <p className="hero-description">
                    Giải pháp công nghệ toàn diện cho cá nhân và doanh nghiệp.
                    Đội ngũ kỹ thuật viên chuyên nghiệp, giá cả hợp lý, cam kết chất lượng.
                </p>
                <div className="hero-cta">
                    <button className="primary-button" onClick={(e) => scrollToSection(e, 'contact')}>Đặt Lịch Ngay →</button>
                    <button className="secondary-button" onClick={(e) => scrollToSection(e, 'services')}>▶ Xem Demo</button>
                </div>
                <div className="hero-stats">
                    <div className="stat-item">
                        <div className="stat-number">500+</div>
                        <div className="stat-label">Khách Hàng</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <div className="stat-number">98%</div>
                        <div className="stat-label">Hài Lòng</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <div className="stat-number">24/7</div>
                        <div className="stat-label">Hỗ Trợ</div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="container">
            <div className="section-header">
                <span className="section-badge">Dịch Vụ Của Chúng Tôi</span>
                <h2 className="section-title">Giải Pháp Công Nghệ <span className="gradient-text">Toàn Diện</span></h2>
                <p className="section-description">
                    Chúng tôi cung cấp đầy đủ các dịch vụ kỹ thuật máy tính từ A-Z
                </p>
            </div>

            <div className="services-grid">
                <div className="service-card">
                    <h3 className="service-title">Kích Hoạt Windows</h3>
                    <p className="service-description">
                        Kích hoạt bản quyền Windows 10/11, đảm bảo an toàn và hợp pháp.
                        Hỗ trợ cài đặt driver, update hệ thống.
                    </p>
                    <ul className="service-features">
                        <li>✓ Windows 10/11 Pro, Home</li>
                        <li>✓ Bản quyền chính hãng</li>
                        <li>✓ Cài đặt driver tự động</li>
                        <li>✓ Tối ưu hóa hệ thống</li>
                    </ul>
                </div>

                <div className="service-card">
                    <h3 className="service-title">Hỗ Trợ Office Suite</h3>
                    <p className="service-description">
                        Cài đặt và hướng dẫn sử dụng Word, Excel, PowerPoint.
                        Tạo template chuyên nghiệp.
                    </p>
                    <ul className="service-features">
                        <li>✓ Office 2019/2021</li>
                        <li>✓ Hướng dẫn sử dụng</li>
                        <li>✓ Tạo template</li>
                        <li>✓ Macro & VBA</li>
                    </ul>
                </div>

                <div className="service-card">
                    <h3 className="service-title">Fix Lỗi & Bảo Trì</h3>
                    <p className="service-description">
                        Sửa chữa các lỗi phần mềm, virus, tối ưu hiệu suất máy tính.
                    </p>
                    <ul className="service-features">
                        <li>✓ Diệt virus, malware</li>
                        <li>✓ Khôi phục dữ liệu</li>
                        <li>✓ Tăng tốc máy tính</li>
                        <li>✓ Bảo trì định kỳ</li>
                    </ul>
                </div>

                <div className="service-card">
                    <h3 className="service-title">Cài Đặt Phần Mềm</h3>
                    <p className="service-description">
                        Cài đặt các phần mềm chuyên dụng: Adobe, AutoCAD, phần mềm kế toán.
                    </p>
                    <ul className="service-features">
                        <li>✓ Adobe Creative Cloud</li>
                        <li>✓ AutoCAD, SolidWorks</li>
                        <li>✓ Phần mềm kế toán</li>
                        <li>✓ Phần mềm quản lý</li>
                    </ul>
                </div>

                <div className="service-card">
                    <h3 className="service-title">Nâng Cấp Phần Cứng</h3>
                    <p className="service-description">
                        Tư vấn và nâng cấp RAM, SSD, Card đồ họa.
                    </p>
                    <ul className="service-features">
                        <li>✓ Tư vấn cấu hình</li>
                        <li>✓ Nâng cấp RAM, SSD</li>
                        <li>✓ Lắp ráp máy tính</li>
                        <li>✓ Bảo hành chính hãng</li>
                    </ul>
                </div>

                <div className="service-card">
                    <h3 className="service-title">Tài khoản</h3>
                    <p className="service-description">
                        Cung cấp các tài khoản premium giá hợp lý.
                    </p>
                    <ul className="service-features">
                        <li>✓ Chat GPT Plus</li>
                        <li>✓ Youtube Premium</li>
                        <li>✓ Spotify Premium</li>
                        <li>✓ Tài khoản phần mềm khác</li>
                    </ul>
                </div>
            </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
            <div className="about-content">
                <span className="section-badge">Về Chúng Tôi</span>
                <h2 className="section-title">
                    Đối Tác Công Nghệ<br />
                    <span className="gradient-text">Đáng Tin Cậy</span>
                </h2>
                <p className="about-text">
                    TechCare là đơn vị hàng đầu tại Vĩnh Long chuyên cung cấp dịch vụ
                    kỹ thuật máy tính và giải pháp CNTT toàn diện.
                </p>

                <div className="about-features">
                    <div className="about-feature">
                        <div className="feature-icon">🎯</div>
                        <div className="feature-content">
                            <h4>Chuyên Nghiệp</h4>
                            <p>Đội ngũ kỹ thuật viên được đào tạo bài bản</p>
                        </div>
                    </div>
                    <div className="about-feature">
                        <div className="feature-icon">⚡</div>
                        <div className="feature-content">
                            <h4>Nhanh Chóng</h4>
                            <p>Thời gian phản hồi nhanh, giải quyết hiệu quả</p>
                        </div>
                    </div>
                    <div class="about-feature">
                        <div className="feature-icon">💰</div>
                        <div className="feature-content">
                            <h4>Giá Cả Hợp Lý</h4>
                            <p>Chi phí minh bạch, phù hợp mọi đối tượng</p>
                        </div>
                    </div>
                    <div className="about-feature">
                        <div className="feature-icon">🛡️</div>
                        <div className="feature-content">
                            <h4>Bảo Hành Tốt</h4>
                            <p>Chính sách bảo hành rõ ràng, hỗ trợ tận tình</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
            <div className="contact-grid">
                <div className="contact-info">
                    <span className="section-badge">Liên Hệ</span>
                    <h2 className="section-title">
                        Sẵn Sàng <span className="gradient-text">Hỗ Trợ Bạn</span>
                    </h2>
                    <div className="contact-methods">
                        <div className="contact-method">
                            <div className="method-icon">📱</div>
                            <div className="method-content">
                                <div className="method-label">Điện Thoại</div>
                                <div className="method-value">Zalo: 038 788 4950</div>
                                <div className="method-value">Tele: 058 487 3200</div>
                            </div>
                        </div>
                        <div className="contact-method">
                            <div className="method-icon">✉️</div>
                            <div className="method-content">
                                <div className="method-label">Email</div>
                                <div className="method-value">contact@pcsolutions.vn</div>
                            </div>
                        </div>
                        <div className="contact-method">
                            <div className="method-icon">📍</div>
                            <div className="method-content">
                                <div className="method-label">Địa Chỉ</div>
                                <div className="method-value">Vĩnh Long, Việt Nam</div>
                            </div>
                        </div>
                    </div>
                </div>

                <form className="contact-form" onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Họ và Tên</label>
                        <input 
                            type="text" 
                            id="name" 
                            placeholder="Nguyễn Văn A" 
                            value={formData.name}
                            onChange={handleInputChange}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Số Điện Thoại</label>
                        <input 
                            type="tel" 
                            id="phone" 
                            placeholder="0123 456 789" 
                            value={formData.phone}
                            onChange={handleInputChange}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="service">Dịch Vụ</label>
                        <select 
                            id="service" 
                            required 
                            value={formData.service}
                            onChange={handleInputChange}
                        >
                            <option value="" disabled>Chọn dịch vụ</option>
                            <option value="windows">Kích hoạt Windows</option>
                            <option value="it">Tư vấn CNTT</option>
                            <option value="office">Hỗ trợ Office</option>
                            <option value="repair">Fix lỗi</option>
                            <option value="accounts">Tài khoản</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Nội Dung</label>
                        <textarea 
                            id="message" 
                            rows="4" 
                            placeholder="Mô tả yêu cầu..."
                            value={formData.message}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                    <button type="submit" className="submit-button" disabled={formStatus.loading}>
                        {formStatus.loading ? 'Đang gửi...' : 'Gửi Yêu Cầu →'}
                    </button>
                </form>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
            <div className="footer-content">
                <div className="footer-section">
                    <div className="footer-logo">
                        <div className="logo-icon">TC</div>
                        <span>TechCare</span>
                    </div>
                    <p className="footer-description">
                        Đối tác công nghệ đáng tin cậy của bạn
                    </p>
                </div>

                <div className="footer-section">
                    <h4 className="footer-title">Dịch Vụ</h4>
                    <ul className="footer-links">
                        <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')}>Kích hoạt Windows</a></li>
                        <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')}>Tư vấn CNTT</a></li>
                        <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')}>Hỗ trợ Office</a></li>
                        <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')}>Fix lỗi máy tính</a></li>
                        <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')}>Tài khoản</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4 className="footer-title">Liên Hệ</h4>
                    <ul className="footer-contact">
                        <li>Zalo: 038 788 4950</li>
                        <li>Tele: 058 487 3200</li>
                        <li>contact@techcare.com</li>
                        <li>Vĩnh Long, Việt Nam</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2026 TechCare. All rights reserved.</p>
            </div>
        </div>
      </footer>

      <button className="back-to-top" id="backToTop" onClick={scrollToTop}>↑</button>

      {/* Notification Popup */}
      <div className={`notification-popup ${popup.show ? 'show' : ''} ${popup.type}`}>
          <div className="notification-content">
              <div className="notification-icon">
                  {popup.type === 'success' ? '✅' : '❌'}
              </div>
              <p>{popup.message}</p>
          </div>
      </div>
    </>
  )
}

export default App
