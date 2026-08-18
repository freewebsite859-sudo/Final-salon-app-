import React, { useState } from 'react';
import { Salon, Appointment, SalonService, Stylist, UserProfile } from '../types';
import { AppointmentCountdownBanner, parseAppointmentDateTime } from './AppointmentCountdownBanner';

interface HomeTabProps {
  user: UserProfile;
  salons: Salon[];
  upcomingAppointment: Appointment | null;
  savedSalonIds: string[];
  savedServicesCount: number;
  onOpenSalonDetails: (salon: Salon) => void;
  onBookSalon: (salon: Salon, service?: SalonService, stylist?: Stylist) => void;
  onOpenAppointmentDetails: (appointment: Appointment) => void;
  onToggleSaveSalon: (salonId: string) => void;
  onOpenQuickNearest: () => void;
  onOpenAIAdvisor: () => void;
  onSelectCategory: (category: string) => void;
  onSearchSubmit: (query: string) => void;
  onSelectSavedTab: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  user,
  salons,
  upcomingAppointment,
  savedSalonIds,
  savedServicesCount,
  onOpenSalonDetails,
  onBookSalon,
  onOpenAppointmentDetails,
  onToggleSaveSalon,
  onOpenQuickNearest,
  onOpenAIAdvisor,
  onSelectCategory,
  onSearchSubmit,
  onSelectSavedTab,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [recentSearches, setRecentSearches] = useState(['Hair Cut', 'Nail Art']);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const heroSlides = [
    {
      id: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhQqjvDEbBv_U3H-mGUIYG4xUDz5bBYqoXi2Yw8UX2YQDin8eW8gCaTmPJt-W5cV9wufCk1ZdofLsNtHHPRuxYgYz-AngmKarA71l_qKZFR15trfV5bYdFqUCRi7HBzN7MJ-ahsWUcs-HBtmmVZYwyVAG3VWy06BfUsXM1JA-_-OgaWxB3sapcJLRGV8MlcDN1RdAv_nswBV80yHn_jleKhRricZZ3lQo9lQWakuzSV9gHDcpJeLhLRQ',
      badge: 'Featured',
      badgeBg: 'bg-primary/90',
      title: 'Premium Styling',
      subtitle: 'Experience the best in class hair artists',
      category: 'Hair Cut',
    },
    {
      id: 2,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBZoBwG9VC_WH7e7g0fS6xdG95exWop0NGv607Wh3K_YUE7JoNvbN2H0HPQ-c1ncvY7Ky-PXEyF7R1Z2P_8067B_j8E2OfRPJPpgJmiKXXFqGAYUODZiIWpLuRK3AWiEkbP9jKqCTUbXWAKwCyKmeEEeHY8cSHq2T5beh7pR8hjNXKxf_jDyCfQd57luNOUbSBLb1JynqvIzCmhjdOPKff6D6x_IsPh2DGkgGooqyngd0MtFkyz2rL8g',
      badge: 'Relax',
      badgeBg: 'bg-success-emerald/90',
      title: 'Spa Retreat',
      subtitle: 'Unwind and rejuvenate with herbal therapy',
      category: 'Spa',
    },
    {
      id: 3,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBW02ALTzDIp-qF-qF1JJVRKpBuauiOaixkhgn2svrDgUAUItBCdEpwJIp7WyPz5WAidOYLazzTluF0-1hKVjtxvyVbsxmCZq9KqoUHMvcFGeDe6t3HkRHbbUxHvATbVCvXJDqPJCAzxpqDJ89bdPcImhU7l7xlrmBzbhJwndjxfp7B4ZY8WqxOYsdDVS-lmyJFEALJ0UWW_p_lQWsCDgLQU0yE-JLXEwJwsh1eFqJi6h6lToF-RnDqEQ',
      badge: 'Trending',
      badgeBg: 'bg-warning-amber/90',
      title: 'Nail Artistry',
      subtitle: 'Express yourself with chrome & gel extensions',
      category: 'Nails',
    },
  ];

  const exploreCategories = [
    { name: 'Hair Cut', icon: 'content_cut', query: 'Hair Cut' },
    { name: 'Barber', icon: 'face_6', query: 'Barber' },
    { name: 'Unisex', icon: 'wc', query: 'Unisex' },
    { name: 'Salon', icon: 'chair', query: 'Salon' },
    { name: 'Beauty', icon: 'spa', query: 'Beauty' },
    { name: 'Nail Studio', icon: 'back_hand', query: 'Nail Studio' },
  ];

  const quickFilters = ['Open Now', 'Top Rated', 'Offers', 'At Home', 'Luxury', 'Budget'];

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      if (!recentSearches.includes(searchInput.trim())) {
        setRecentSearches([searchInput.trim(), ...recentSearches.slice(0, 4)]);
      }
      onSearchSubmit(searchInput.trim());
    }
  };

  const handleRecentClick = (term: string) => {
    setSearchInput(term);
    onSearchSubmit(term);
  };

  const handleFilterToggle = (filter: string) => {
    setSelectedFilter(selectedFilter === filter ? null : filter);
  };

  const filteredSalons = salons.filter((s) => {
    if (selectedFilter === 'Open Now') return s.isOpen;
    if (selectedFilter === 'Top Rated') return s.rating >= 4.8;
    if (selectedFilter === 'Offers') return Boolean(s.discountOffer);
    if (selectedFilter === 'Luxury') return s.priceRange.length >= 3;
    if (selectedFilter === 'Budget') return s.priceRange === '₹' || s.priceRange === '₹₹';
    return true;
  });

  return (
    <div className="flex flex-col w-full pb-28 max-w-4xl mx-auto">
      {/* Greeting Section */}
      <section className="px-page-margin pt-4 pb-3 flex items-start justify-between">
        <div>
          <h1 className="font-hero-heading-mobile text-[24px] sm:text-[28px] font-bold text-on-surface mb-0.5">
            Hello, {user.name}
          </h1>
          <p className="font-body-md text-[14px] text-on-surface-variant">
            Find your perfect beauty experience
          </p>
        </div>
        <button
          onClick={onOpenAIAdvisor}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-nexora-pink to-primary text-white text-[12px] font-semibold flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
          <span>AI Advisor</span>
        </button>
      </section>

      {/* Featured Stories Carousel */}
      <section className="px-page-margin mb-6">
        <div className="relative w-full h-[200px] sm:h-[230px] rounded-2xl overflow-hidden shadow-md">
          <div 
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-full scroll-smooth"
            onScroll={(e) => {
              const el = e.currentTarget;
              const idx = Math.round(el.scrollLeft / el.offsetWidth);
              setActiveSlide(idx);
            }}
          >
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id}
                onClick={() => onSelectCategory(slide.category)}
                className="min-w-full h-full snap-center relative cursor-pointer group"
              >
                <img
                  alt={slide.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  src={slide.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className={`${slide.badgeBg} text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1.5 inline-block`}>
                    {slide.badge}
                  </span>
                  <h3 className="font-card-title text-[20px] font-bold leading-tight mb-0.5">{slide.title}</h3>
                  <p className="font-metadata text-[13px] opacity-90">{slide.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Indicator Dots */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
            {heroSlides.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeSlide === i ? 'bg-white w-5' : 'bg-white/50 w-1.5'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Active Upcoming Appointment (Live Countdown Banner if <= 24h, else Standard Card) */}
      {upcomingAppointment && (() => {
        const appointmentDate = parseAppointmentDateTime(upcomingAppointment.date, upcomingAppointment.time);
        const diffMs = appointmentDate.getTime() - Date.now();
        const isWithin24Hours = diffMs > -2 * 60 * 60 * 1000 && diffMs <= 24 * 60 * 60 * 1000;
        const isToday = upcomingAppointment.date === new Date().toISOString().split('T')[0];
        const upcomingSalon = salons.find((s) => s.id === upcomingAppointment.salonId);

        if (isWithin24Hours || isToday) {
          return (
            <AppointmentCountdownBanner
              appointment={upcomingAppointment}
              salon={upcomingSalon}
              onOpenDetails={onOpenAppointmentDetails}
            />
          );
        }

        return (
          <section className="px-page-margin mb-6">
            <div className="bg-primary text-on-primary rounded-2xl p-4 shadow-md relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-black/10 rounded-full blur-lg pointer-events-none" />
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1 mb-1 opacity-90">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                      {upcomingAppointment.date} · {upcomingAppointment.time}
                    </span>
                  </div>
                  <h3 className="font-card-title text-[18px] font-bold mb-1">{upcomingAppointment.salonName}</h3>
                  <p className="font-metadata text-[13px] opacity-90 mb-3">
                    {upcomingAppointment.services[0]?.name} {upcomingAppointment.stylist ? `· ${upcomingAppointment.stylist.name.split(' ')[0]}` : ''}
                  </p>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-inner">
                  <span className="material-symbols-outlined text-white text-[20px]">calendar_month</span>
                </div>
              </div>
              <button
                onClick={() => onOpenAppointmentDetails(upcomingAppointment)}
                className="relative z-10 w-full py-2.5 bg-white text-primary font-button-text text-[13px] font-bold rounded-xl hover:bg-white/90 transition-colors shadow-sm"
              >
                View Appointment Details
              </button>
            </div>
          </section>
        );
      })()}

      {/* Search Input */}
      <section className="px-page-margin mb-6 relative z-10">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-nexora-pink transition-colors">
              search
            </span>
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search salons, services or stylists in Jaipur..."
            className="w-full h-[48px] pl-11 pr-24 bg-surface-container-highest text-on-surface font-body-md text-[14px] rounded-xl shadow-xs focus:outline-none focus:ring-1 focus:ring-nexora-pink focus:bg-surface-container-lowest transition-all"
          />
          {searchInput && (
            <button
              onClick={() => onSearchSubmit(searchInput)}
              className="absolute right-2 top-2 px-3 py-1.5 bg-primary text-white text-[12px] font-semibold rounded-lg hover:bg-nexora-pink transition-colors"
            >
              Search
            </button>
          )}
        </div>
      </section>

      <div className="flex flex-col gap-6">
        {/* Book Again Carousel */}
        <section className="-mx-page-margin">
          <div className="flex items-center justify-between mb-3 px-page-margin">
            <h2 className="font-section-heading text-[17px] font-bold text-on-surface">Book Again</h2>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-3.5 px-page-margin pb-1 snap-x">
            <div 
              onClick={() => onSelectCategory('Hair Cut')}
              className="min-w-[280px] snap-center bg-surface-container-low border border-outline-variant rounded-xl p-3 flex items-center justify-between shadow-xs cursor-pointer hover:border-nexora-pink transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-nexora-pink shadow-inner">
                  <span className="material-symbols-outlined text-[24px]">content_cut</span>
                </div>
                <div>
                  <h3 className="font-card-title text-[14px] font-semibold text-on-surface mb-0.5">Hair Cut at Scissors & Shears</h3>
                  <p className="font-metadata text-[11px] text-on-surface-variant">Last booked recently</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCategory('Hair Cut');
                }}
                className="px-3 py-1.5 bg-primary-container text-white font-button-text text-[12px] rounded-lg hover:bg-primary transition-colors shadow-xs shrink-0"
              >
                Book
              </button>
            </div>

            <div 
              onClick={() => onSelectCategory('Facial & Skin')}
              className="min-w-[280px] snap-center bg-surface-container-low border border-outline-variant rounded-xl p-3 flex items-center justify-between shadow-xs cursor-pointer hover:border-nexora-pink transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-nexora-pink shadow-inner">
                  <span className="material-symbols-outlined text-[24px]">spa</span>
                </div>
                <div>
                  <h3 className="font-card-title text-[14px] font-semibold text-on-surface mb-0.5">Hydra Facial Deluxe</h3>
                  <p className="font-metadata text-[11px] text-on-surface-variant">Last booked 2 months ago</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCategory('Facial & Skin');
                }}
                className="px-3 py-1.5 bg-primary-container text-white font-button-text text-[12px] rounded-lg hover:bg-primary transition-colors shadow-xs shrink-0"
              >
                Book
              </button>
            </div>
          </div>
        </section>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <section className="px-page-margin">
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="font-section-heading text-[16px] font-bold text-on-surface">Recent Searches</h2>
              <button
                onClick={() => setRecentSearches([])}
                className="font-button-text text-[12px] font-semibold text-nexora-pink hover:underline"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleRecentClick(term)}
                  className="h-8 px-3.5 bg-surface-container rounded-full flex items-center gap-1.5 hover:bg-surface-container-high transition-colors text-on-surface text-[12px]"
                >
                  <span className="material-symbols-outlined text-[15px] text-on-surface-variant">history</span>
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Trending Tags */}
        <section className="px-page-margin">
          <h2 className="font-section-heading text-[16px] font-bold text-on-surface mb-2.5">Trending</h2>
          <div className="flex flex-wrap gap-2">
            {['Hair Spa', 'Hydra Facial', 'Bridal Makeup', 'Balayage', 'Beard Spa'].map((tag) => (
              <button
                key={tag}
                onClick={() => onSelectCategory(tag)}
                className="h-8 px-3.5 bg-surface-container-low border border-outline-variant rounded-full flex items-center gap-1.5 hover:bg-surface-container transition-colors text-on-surface text-[12px]"
              >
                <span className="material-symbols-outlined text-[15px] text-warning-amber">trending_up</span>
                <span>{tag}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Exclusive for You Promos */}
        <section className="-mx-page-margin">
          <h2 className="font-section-heading text-[17px] font-bold text-on-surface mb-3 px-page-margin">
            Exclusive for You
          </h2>
          <div className="flex overflow-x-auto no-scrollbar gap-3.5 px-page-margin pb-1 snap-x">
            <div className="min-w-[280px] snap-center bg-gradient-to-r from-nexora-pink to-primary rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded text-white backdrop-blur-sm">
                  PROMO
                </span>
                <span className="material-symbols-outlined opacity-80 text-[20px]">local_offer</span>
              </div>
              <h3 className="font-card-title text-[18px] font-bold mb-0.5">20% Off Nexora Premium</h3>
              <p className="text-[12px] opacity-90 mb-3">Upgrade your hair & grooming game today.</p>
              <button
                onClick={() => onBookSalon(salons[0])}
                className="px-4 py-1.5 bg-white text-nexora-pink font-button-text rounded-lg hover:bg-surface-container-lowest transition-colors text-[12px] font-bold"
              >
                Claim Now
              </button>
            </div>

            <div className="min-w-[280px] snap-center bg-gradient-to-r from-surface-tint to-surface-variant rounded-2xl p-4 text-on-surface shadow-md border border-outline-variant/30 relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded text-on-surface backdrop-blur-sm">
                  NEW
                </span>
                <span className="material-symbols-outlined text-primary text-[20px]">spa</span>
              </div>
              <h3 className="font-card-title text-[18px] font-bold mb-0.5">Hydra Facial Deluxe</h3>
              <p className="text-[12px] text-on-surface-variant mb-3">Experience the clinical 7-step glow.</p>
              <button
                onClick={() => onBookSalon(salons[1])}
                className="px-4 py-1.5 bg-primary text-white font-button-text rounded-lg hover:bg-nexora-pink transition-colors text-[12px] font-bold"
              >
                Explore
              </button>
            </div>
          </div>
        </section>

        {/* Popular Near You Locality Chips */}
        <section className="px-page-margin">
          <h2 className="font-section-heading text-[16px] font-bold text-on-surface mb-2.5">Popular Near You</h2>
          <div className="flex flex-wrap gap-2">
            {['Mansarovar', 'Vaishali Nagar', 'Malviya Nagar', 'C-Scheme'].map((loc) => (
              <button
                key={loc}
                onClick={() => onSearchSubmit(loc)}
                className="h-8 px-3.5 bg-primary-container text-white rounded-full flex items-center gap-1 hover:bg-primary transition-colors text-[12px] font-medium"
              >
                <span className="material-symbols-outlined text-[15px]">location_on</span>
                <span>{loc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Explore Services Icons */}
        <section className="-mx-page-margin">
          <h2 className="font-section-heading text-[17px] font-bold text-on-surface mb-3 px-page-margin">
            Explore Services
          </h2>
          <div className="flex overflow-x-auto no-scrollbar gap-3.5 px-page-margin pb-1">
            {exploreCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.query)}
                className="flex flex-col items-center gap-1.5 min-w-[70px] group text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-nexora-pink shadow-xs border border-outline-variant/30 group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-[26px]">{cat.icon}</span>
                </div>
                <span className="text-[12px] font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Filter Pills */}
        <section className="-mx-page-margin">
          <div className="flex overflow-x-auto no-scrollbar gap-2 px-page-margin">
            {quickFilters.map((f) => {
              const isSelected = selectedFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => handleFilterToggle(f)}
                  className={`h-8 px-4 rounded-full flex items-center gap-1 text-[12px] whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-primary text-white border-primary font-semibold shadow-xs'
                      : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span>{f}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Saved for Later Counter Summary */}
        <section className="px-page-margin">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="font-section-heading text-[16px] font-bold text-on-surface">Saved for Later</h2>
            <button
              onClick={onSelectSavedTab}
              className="font-button-text text-[13px] font-semibold text-nexora-pink hover:underline"
            >
              View Saved
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={onSelectSavedTab}
              className="bg-surface-container-low border border-outline-variant rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-surface-container transition-colors shadow-xs"
            >
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-nexora-pink">
                <span className="material-symbols-outlined text-[20px]">store</span>
              </div>
              <div>
                <h3 className="font-card-title text-[14px] font-bold text-on-surface leading-tight">
                  {savedSalonIds.length} Saved
                </h3>
                <p className="text-[11px] text-on-surface-variant">Salons</p>
              </div>
            </div>

            <div
              onClick={onSelectSavedTab}
              className="bg-surface-container-low border border-outline-variant rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-surface-container transition-colors shadow-xs"
            >
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-nexora-pink">
                <span className="material-symbols-outlined text-[20px]">spa</span>
              </div>
              <div>
                <h3 className="font-card-title text-[14px] font-bold text-on-surface leading-tight">
                  {savedServicesCount} Saved
                </h3>
                <p className="text-[11px] text-on-surface-variant">Services</p>
              </div>
            </div>
          </div>
        </section>

        {/* Nearby For You Salons Grid */}
        <section className="px-page-margin flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-section-heading text-[17px] font-bold text-on-surface">Nearby for You</h2>
            <span className="text-[12px] text-on-surface-variant">{filteredSalons.length} places</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSalons.map((salon) => {
              const isSaved = savedSalonIds.includes(salon.id);
              return (
                <div
                  key={salon.id}
                  className="bg-surface-container-low rounded-2xl overflow-hidden shadow-xs border border-outline-variant flex flex-col transition-all hover:shadow-md"
                >
                  <div
                    className="relative h-48 cursor-pointer overflow-hidden group"
                    onClick={() => onOpenSalonDetails(salon)}
                  >
                    <img
                      alt={salon.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={salon.image}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSaveSalon(salon.id);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/80 backdrop-blur-md flex items-center justify-center text-nexora-pink hover:bg-white transition-colors"
                    >
                      <span className={`material-symbols-outlined text-[20px] ${isSaved ? 'fill-1' : ''}`}>
                        favorite
                      </span>
                    </button>
                    <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-success-emerald text-white text-[10px] font-bold rounded uppercase tracking-wider">
                      {salon.isOpen ? 'Open Now' : 'Closed'}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3
                          onClick={() => onOpenSalonDetails(salon)}
                          className="font-card-title text-[16px] font-bold text-on-surface hover:text-nexora-pink cursor-pointer transition-colors"
                        >
                          {salon.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-warning-amber text-[16px] fill-1">star</span>
                          <span className="font-bold text-[13px]">{salon.rating}</span>
                          <span className="text-[11px] text-on-surface-variant">({salon.reviewCount})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-on-surface-variant mb-1.5 text-[12px]">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        <span>{salon.location.area} · {salon.distance}</span>
                      </div>

                      <p className="text-[12px] text-on-surface-variant mb-4">
                        {salon.categories.join(' · ')}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onOpenSalonDetails(salon)}
                        className="flex-1 py-2.5 bg-surface-container text-on-surface font-button-text text-[13px] rounded-xl hover:bg-surface-container-high transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onBookSalon(salon)}
                        className="flex-2 py-2.5 bg-primary text-white font-button-text text-[13px] rounded-xl hover:bg-nexora-pink transition-colors shadow-xs"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Floating Bottom Quick Action */}
      <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom)+12px)] left-0 w-full px-page-margin z-30 pointer-events-none">
        <div className="max-w-md mx-auto bg-surface/95 backdrop-blur-md border border-outline-variant/60 p-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 pointer-events-auto">
          <div className="flex-1">
            <p className="font-card-title text-[13px] font-semibold text-on-surface">Need a quick haircut or facial?</p>
          </div>
          <button
            onClick={onOpenQuickNearest}
            className="bg-nexora-pink text-white font-button-text text-[13px] py-2 px-4 rounded-xl hover:bg-primary transition-colors flex items-center gap-1.5 shadow-md whitespace-nowrap"
          >
            <span>⚡</span>
            <span>Book Nearest</span>
          </button>
        </div>
      </div>
    </div>
  );
};
