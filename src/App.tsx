import React, { useState } from 'react';
import { ActiveTab, Salon, SalonService, Stylist, Appointment, UserProfile, Review } from './types';
import { INITIAL_SALONS, INITIAL_APPOINTMENTS, INITIAL_USER } from './data/mockSalons';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { ExploreTab } from './components/ExploreTab';
import { AppointmentsTab } from './components/AppointmentsTab';
import { SavedTab } from './components/SavedTab';
import { ProfileTab } from './components/ProfileTab';
import { LocationModal } from './components/LocationModal';
import { BookingModal } from './components/BookingModal';
import { SalonDetailModal } from './components/SalonDetailModal';
import { AIAdvisorModal } from './components/AIAdvisorModal';
import { QuickNearestModal } from './components/QuickNearestModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ServiceCategoryScreen } from './components/ServiceCategoryScreen';
import { ChooseProfessionalScreen } from './components/ChooseProfessionalScreen';
import { BookingSummaryModal } from './components/BookingSummaryModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [currentLocation, setCurrentLocation] = useState<string>('Mansarovar, Jaipur');
  const [salons, setSalons] = useState<Salon[]>(INITIAL_SALONS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [savedSalonIds, setSavedSalonIds] = useState<string[]>(['salon-1', 'salon-2', 'salon-5']);
  
  // Dedicated Category & Service Screen
  const [selectedCategoryScreen, setSelectedCategoryScreen] = useState<string | null>(null);

  // Dedicated Choose Professional Screen
  const [chooseProfessionalData, setChooseProfessionalData] = useState<{
    salon?: Salon | null;
    service?: SalonService | null;
    services?: SalonService[] | null;
  } | null>(null);

  // Booking Summary Modal & persistent draft state
  const [isBookingSummaryModalOpen, setIsBookingSummaryModalOpen] = useState(false);
  const [bookingSummaryDraft, setBookingSummaryDraft] = useState<{
    salon: Salon | null;
    services: SalonService[];
    stylist: Stylist | null;
    date: string;
    time: string;
    notes?: string;
  } | null>(null);

  // Modals state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSalonDetailModalOpen, setIsSalonDetailModalOpen] = useState(false);
  const [isAIAdvisorModalOpen, setIsAIAdvisorModalOpen] = useState(false);
  const [isQuickNearestModalOpen, setIsQuickNearestModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  // Selected entities for modals
  const [selectedSalonForDetail, setSelectedSalonForDetail] = useState<Salon | null>(null);
  const [selectedSalonForBooking, setSelectedSalonForBooking] = useState<Salon | null>(null);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<SalonService | null>(null);
  const [selectedServicesForBooking, setSelectedServicesForBooking] = useState<SalonService[] | null>(null);
  const [selectedStylistForBooking, setSelectedStylistForBooking] = useState<Stylist | null>(null);
  const [exploreQuery, setExploreQuery] = useState<string>('');

  // Active upcoming appointment for reminder banner
  const upcomingAppointment = appointments.find((a) => a.status === 'confirmed') || null;

  // Handlers
  const handleOpenSalonDetails = (salon: Salon) => {
    setSelectedSalonForDetail(salon);
    setIsSalonDetailModalOpen(true);
  };

  const handleOpenBooking = (
    salon: Salon,
    service?: SalonService,
    stylist?: Stylist,
    services?: SalonService[]
  ) => {
    setSelectedSalonForBooking(salon);
    setSelectedServiceForBooking(service || null);
    setSelectedServicesForBooking(services || (service ? [service] : null));
    setSelectedStylistForBooking(stylist || null);
    setIsBookingModalOpen(true);
  };

  const handleBookAgain = (appointment: Appointment) => {
    let salon = salons.find((s) => s.id === appointment.salonId);
    if (!salon) {
      salon = {
        id: appointment.salonId,
        name: appointment.salonName,
        rating: 4.8,
        reviewCount: 120,
        image: appointment.salonImage,
        categories: ['Hair', 'Grooming'],
        priceRange: '₹₹',
        distance: '1.5 km',
        isOpen: true,
        openingHours: '10:00 AM - 8:00 PM',
        location: {
          address: appointment.salonAddress,
          area: appointment.salonAddress.split(',')[0] || 'Mansarovar',
          city: 'Jaipur',
          coordinates: { lat: 26.85, lng: 75.78 },
          mapsUrl: appointment.mapsUrl,
        },
        phone: appointment.salonPhone || '+91 98290 12345',
        about: 'Premium salon and grooming studio in Jaipur.',
        amenities: ['AC', 'Wi-Fi', 'Card Payment', 'Parking'],
        services: appointment.services,
        stylists: appointment.stylist ? [appointment.stylist] : [],
      };
    }
    handleOpenBooking(
      salon,
      appointment.services[0],
      appointment.stylist,
      appointment.services
    );
  };

  const handleConfirmBooking = (newAppointment: Appointment) => {
    setAppointments([newAppointment, ...appointments]);
  };

  const handleToggleSaveSalon = (salonId: string) => {
    if (savedSalonIds.includes(salonId)) {
      setSavedSalonIds(savedSalonIds.filter((id) => id !== salonId));
    } else {
      setSavedSalonIds([...savedSalonIds, salonId]);
    }
  };

  const handleSearchSubmit = (query: string) => {
    setExploreQuery(query);
    setSelectedCategoryScreen(null);
    setActiveTab('explore');
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategoryScreen(category);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(
      appointments.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
    );
  };

  const handleRescheduleAppointment = (id: string) => {
    const apt = appointments.find((a) => a.id === id);
    if (apt) {
      const salon = salons.find((s) => s.id === apt.salonId) || salons[0];
      handleOpenBooking(salon, apt.services[0], apt.stylist);
    }
  };

  const handleAddReview = (salonId: string, newReview: Review) => {
    setSalons((prevSalons) =>
      prevSalons.map((salon) => {
        if (salon.id === salonId) {
          const updatedReviews = [newReview, ...salon.reviews];
          const newReviewCount = salon.reviewCount + 1;
          const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const newRating = Number((totalRating / updatedReviews.length).toFixed(1));
          const updatedSalon = {
            ...salon,
            reviews: updatedReviews,
            reviewCount: newReviewCount,
            rating: newRating > 0 ? newRating : salon.rating,
          };
          if (selectedSalonForDetail && selectedSalonForDetail.id === salonId) {
            setSelectedSalonForDetail(updatedSalon);
          }
          return updatedSalon;
        }
        return salon;
      })
    );
  };

  return (
    <div className="min-h-screen bg-surface-off-white text-on-surface flex flex-col font-body-md selection:bg-nexora-pink/20 selection:text-nexora-pink">
      {chooseProfessionalData ? (
        <ChooseProfessionalScreen
          user={user}
          currentLocation={currentLocation}
          salon={chooseProfessionalData.salon}
          service={chooseProfessionalData.service}
          services={chooseProfessionalData.services}
          activeAppointmentsCount={appointments.filter((a) => a.status === 'confirmed').length}
          onBack={() => setChooseProfessionalData(null)}
          onOpenLocation={() => setIsLocationModalOpen(true)}
          onOpenNotifications={() => setIsNotificationsModalOpen(true)}
          onOpenProfile={() => {
            setChooseProfessionalData(null);
            setSelectedCategoryScreen(null);
            setActiveTab('profile');
          }}
          onSelectTab={(tab) => {
            setChooseProfessionalData(null);
            setSelectedCategoryScreen(null);
            setActiveTab(tab);
          }}
          onContinueBooking={(stylist, selectedSlot, updatedServices) => {
            const targetSalon = chooseProfessionalData.salon || salons[0];
            const finalServices =
              updatedServices && updatedServices.length > 0
                ? updatedServices
                : chooseProfessionalData.services && chooseProfessionalData.services.length > 0
                ? chooseProfessionalData.services
                : chooseProfessionalData.service
                ? [chooseProfessionalData.service]
                : targetSalon.services.length > 0
                ? [targetSalon.services[0]]
                : [];
            
            // Set up booking draft and open BookingSummaryModal
            setBookingSummaryDraft({
              salon: targetSalon,
              services: finalServices,
              stylist: stylist || null,
              date: selectedSlot?.date || new Date().toISOString().split('T')[0],
              time: selectedSlot?.time || '2:30 PM',
              notes: '',
            });
            setChooseProfessionalData(null);
            setIsBookingSummaryModalOpen(true);
          }}
        />
      ) : selectedCategoryScreen ? (
        <ServiceCategoryScreen
          user={user}
          categoryTitle={selectedCategoryScreen}
          currentLocation={currentLocation}
          salons={salons}
          savedSalonIds={savedSalonIds}
          activeAppointmentsCount={appointments.filter((a) => a.status === 'confirmed').length}
          onBack={() => setSelectedCategoryScreen(null)}
          onOpenLocation={() => setIsLocationModalOpen(true)}
          onOpenNotifications={() => setIsNotificationsModalOpen(true)}
          onOpenProfile={() => {
            setSelectedCategoryScreen(null);
            setActiveTab('profile');
          }}
          onSelectTab={(tab) => {
            setSelectedCategoryScreen(null);
            setActiveTab(tab);
          }}
          onToggleSaveSalon={handleToggleSaveSalon}
          onOpenSalonDetails={handleOpenSalonDetails}
          onBookService={(salon, service, stylist) => {
            handleOpenBooking(salon, service, stylist);
          }}
          onChooseProfessional={(salon, service, services) => {
            setChooseProfessionalData({ salon, service, services });
          }}
        />
      ) : (
        <>
          {/* Fixed Header */}
          <Header
            user={user}
            currentLocation={currentLocation}
            onOpenLocation={() => setIsLocationModalOpen(true)}
            onOpenProfile={() => setActiveTab('profile')}
            onOpenNotifications={() => setIsNotificationsModalOpen(true)}
          />

          {/* Main Content Area */}
          <main className="pt-16 min-h-screen flex-1 flex flex-col">
            {activeTab === 'home' && (
              <HomeTab
                user={user}
                salons={salons}
                upcomingAppointment={upcomingAppointment}
                savedSalonIds={savedSalonIds}
                savedServicesCount={5}
                onOpenSalonDetails={handleOpenSalonDetails}
                onBookSalon={handleOpenBooking}
                onOpenAppointmentDetails={(apt) => {
                  setActiveTab('appointments');
                }}
                onToggleSaveSalon={handleToggleSaveSalon}
                onOpenQuickNearest={() => setIsQuickNearestModalOpen(true)}
                onOpenAIAdvisor={() => setIsAIAdvisorModalOpen(true)}
                onSelectCategory={handleSelectCategory}
                onSearchSubmit={handleSearchSubmit}
                onSelectSavedTab={() => setActiveTab('saved')}
              />
            )}

            {activeTab === 'explore' && (
              <ExploreTab
                salons={salons}
                currentLocation={currentLocation}
                savedSalonIds={savedSalonIds}
                initialSearchQuery={exploreQuery}
                onOpenSalonDetails={handleOpenSalonDetails}
                onBookSalon={handleOpenBooking}
                onToggleSaveSalon={handleToggleSaveSalon}
                onOpenAIAdvisor={() => setIsAIAdvisorModalOpen(true)}
              />
            )}

            {activeTab === 'appointments' && (
              <AppointmentsTab
                appointments={appointments}
                onCancelAppointment={handleCancelAppointment}
                onRescheduleAppointment={handleRescheduleAppointment}
                onBookAgain={handleBookAgain}
                onOpenSalonDetailsById={(id) => {
                  const s = salons.find((item) => item.id === id);
                  if (s) handleOpenSalonDetails(s);
                }}
              />
            )}

            {activeTab === 'saved' && (
              <SavedTab
                salons={salons}
                savedSalonIds={savedSalonIds}
                onOpenSalonDetails={handleOpenSalonDetails}
                onBookSalon={handleOpenBooking}
                onToggleSaveSalon={handleToggleSaveSalon}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileTab
                user={user}
                onUpdateUser={setUser}
                onOpenAIAdvisor={() => setIsAIAdvisorModalOpen(true)}
              />
            )}
          </main>

          {/* Fixed Bottom Navigation */}
          <BottomNav
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setSelectedCategoryScreen(null);
              setActiveTab(tab);
            }}
            activeAppointmentsCount={appointments.filter((a) => a.status === 'confirmed').length}
          />
        </>
      )}

      {/* Modals & Dialogs */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={currentLocation}
        onSelectLocation={(loc) => setCurrentLocation(loc)}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        salon={selectedSalonForBooking}
        initialService={selectedServiceForBooking}
        initialServices={selectedServicesForBooking}
        initialStylist={selectedStylistForBooking}
        onConfirmBooking={handleConfirmBooking}
        onOpenSummary={(draft) => {
          setIsBookingModalOpen(false);
          setBookingSummaryDraft(draft);
          setIsBookingSummaryModalOpen(true);
        }}
      />

      <BookingSummaryModal
        isOpen={isBookingSummaryModalOpen}
        onClose={() => setIsBookingSummaryModalOpen(false)}
        salon={bookingSummaryDraft?.salon || null}
        services={bookingSummaryDraft?.services || []}
        stylist={bookingSummaryDraft?.stylist || null}
        date={bookingSummaryDraft?.date || new Date().toISOString().split('T')[0]}
        time={bookingSummaryDraft?.time || '2:30 PM'}
        specialNotes={bookingSummaryDraft?.notes || ''}
        onConfirmBooking={handleConfirmBooking}
        onUpdateServices={(updatedServices) => {
          if (bookingSummaryDraft) {
            setBookingSummaryDraft({
              ...bookingSummaryDraft,
              services: updatedServices,
            });
          }
        }}
        onUpdateNotes={(newNotes) => {
          if (bookingSummaryDraft) {
            setBookingSummaryDraft({
              ...bookingSummaryDraft,
              notes: newNotes,
            });
          }
        }}
        onChangeSalon={() => {
          setIsBookingSummaryModalOpen(false);
          setSelectedCategoryScreen(null);
          setActiveTab('explore');
        }}
        onChangeServices={() => {
          if (!bookingSummaryDraft || !bookingSummaryDraft.salon) return;
          setIsBookingSummaryModalOpen(false);
          setChooseProfessionalData({
            salon: bookingSummaryDraft.salon,
            services: bookingSummaryDraft.services,
            service: bookingSummaryDraft.services[0] || null,
          });
        }}
        onChangeProfessional={() => {
          if (!bookingSummaryDraft || !bookingSummaryDraft.salon) return;
          setIsBookingSummaryModalOpen(false);
          setChooseProfessionalData({
            salon: bookingSummaryDraft.salon,
            services: bookingSummaryDraft.services,
            service: bookingSummaryDraft.services[0] || null,
          });
        }}
        onChangeDateTime={() => {
          if (!bookingSummaryDraft || !bookingSummaryDraft.salon) return;
          setIsBookingSummaryModalOpen(false);
          setSelectedSalonForBooking(bookingSummaryDraft.salon);
          setSelectedServicesForBooking(bookingSummaryDraft.services);
          setSelectedServiceForBooking(bookingSummaryDraft.services[0] || null);
          setSelectedStylistForBooking(bookingSummaryDraft.stylist);
          setIsBookingModalOpen(true);
        }}
      />

      <SalonDetailModal
        isOpen={isSalonDetailModalOpen}
        onClose={() => setIsSalonDetailModalOpen(false)}
        salon={selectedSalonForDetail}
        userLocation={currentLocation}
        isSaved={selectedSalonForDetail ? savedSalonIds.includes(selectedSalonForDetail.id) : false}
        onToggleSave={handleToggleSaveSalon}
        onAddReview={handleAddReview}
        onBookService={(salon, srv, st) => {
          setIsSalonDetailModalOpen(false);
          handleOpenBooking(salon, srv, st);
        }}
      />

      <AIAdvisorModal
        isOpen={isAIAdvisorModalOpen}
        onClose={() => setIsAIAdvisorModalOpen(false)}
        user={user}
        currentLocation={currentLocation}
      />

      <QuickNearestModal
        isOpen={isQuickNearestModalOpen}
        onClose={() => setIsQuickNearestModalOpen(false)}
        salons={salons}
        currentLocation={currentLocation}
        onConfirmBooking={handleConfirmBooking}
      />

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
      />
    </div>
  );
}
