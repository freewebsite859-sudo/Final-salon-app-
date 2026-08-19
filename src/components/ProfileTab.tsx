import React, { useEffect, useRef, useState } from 'react';
import { UserProfile } from '../types';

interface SupportMessage {
  id: number;
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

const nowTime = () =>
  new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

interface ProfileTabProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onOpenAIAdvisor: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  onUpdateUser,
  onOpenAIAdvisor,
}) => {
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);

  const [isEditingStyling, setIsEditingStyling] = useState(false);
  const [hairProfile, setHairProfile] = useState(user.hairProfile || 'Wavy / Medium Length');
  const [skinConcern, setSkinConcern] = useState(user.skinConcern || 'Hydration & De-Tan');
  const [favoriteStylist, setFavoriteStylist] = useState(user.favoriteStylist || 'Aarav (Scissors & Shears)');
  const [defaultLocality, setDefaultLocality] = useState(user.defaultLocality || 'Mansarovar, Jaipur');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('Profile preferences updated successfully!');

  // Help & Support — mock live concierge chat state
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
  const [supportInput, setSupportInput] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([
    {
      id: 1,
      sender: 'agent',
      text: `Hi ${(user.name || 'there').split(' ')[0]}! 👋 I'm Tanya from Nexora Concierge Support. Ask me anything about bookings, refunds, offers, or salon contact issues.`,
      time: nowTime(),
    },
  ]);
  const supportChatEndRef = useRef<HTMLDivElement>(null);
  const supportReplyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      phone,
    });
    setIsEditingPersonal(false);
    setSuccessMsg('Personal information updated successfully!');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSaveStyling = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      hairProfile,
      skinConcern,
      favoriteStylist,
      defaultLocality,
    });
    setIsEditingStyling(false);
    setSuccessMsg('Beauty & Styling Profile updated successfully!');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Auto-scroll the support chat to the latest message
  useEffect(() => {
    if (isSupportChatOpen) {
      supportChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [supportMessages, isAgentTyping, isSupportChatOpen]);

  // Clear any pending mock-agent reply when the component unmounts
  useEffect(() => {
    return () => {
      if (supportReplyTimeout.current) {
        clearTimeout(supportReplyTimeout.current);
      }
    };
  }, []);

  const getSupportReply = (text: string): string => {
    const t = text.toLowerCase();
    if (t.includes('cancel')) {
      return 'To cancel: open the Appointments tab → select your upcoming booking → tap "Cancel Booking". Cancellations made 4+ hours before the slot get a 100% refund to your original payment method within 3–5 business days. 💇‍♀️';
    }
    if (t.includes('reschedule') || t.includes('rebook') || t.includes('change time')) {
      return 'Rescheduling is free! Go to Appointments → select your booking → "Reschedule", then pick a new preferred slot. The salon is notified instantly and your stylist preference carries over. ✅';
    }
    if (t.includes('refund') || t.includes('payment') || t.includes('money')) {
      return 'Refund status: refunds are processed to the original payment method within 3–5 business days after cancellation. If it has been longer, share your booking ID here and I will escalate it to the payments team right away. 💳';
    }
    if (t.includes('contact') || t.includes('salon') || t.includes('phone') || t.includes('number')) {
      return 'You can reach any salon directly from its profile page — tap the "Call" button below the salon name. If the salon is unreachable, tell me the salon name and I will connect you to the store manager. 📞';
    }
    if (t.includes('offer') || t.includes('discount') || t.includes('coupon')) {
      return 'All active offers live in the Offers carousel on the Home tab. Apply one at checkout — your VIP loyalty points stack with most offers! ✨';
    }
    return 'Thanks for reaching out! I have logged your query and a Nexora support specialist will follow up within 15 minutes. Meanwhile, anything else I can help with — bookings, refunds, or offers? 😊';
  };

  const handleSendSupportMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = supportInput.trim();
    if (!text || isAgentTyping) return;

    setSupportMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text, time: nowTime() },
    ]);
    setSupportInput('');
    setIsAgentTyping(true);

    // Mock concierge reply after a short "typing" delay
    supportReplyTimeout.current = setTimeout(() => {
      setSupportMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'agent', text: getSupportReply(text), time: nowTime() },
      ]);
      setIsAgentTyping(false);
    }, 1400);
  };

  const hairOptions = ['Wavy / Medium Length', 'Straight / Short', 'Curly / Long', 'Fade & Textured', 'Fine / Layered'];
  const skinOptions = ['Hydration & De-Tan', 'Acne & Oil Control', 'Glow & Anti-Aging', 'Sensitive & Calm', 'Brightening'];
  const stylistOptions = ['Aarav (Scissors & Shears)', 'Priya (Luxe Lounge)', 'Rohan (Hair Craft Studio)', 'Ananya (Glam Studio)'];
  const localityOptions = ['Mansarovar, Jaipur', 'Vaishali Nagar, Jaipur', 'Malviya Nagar, Jaipur', 'C-Scheme, Jaipur', 'Raja Park, Jaipur'];

  return (
    <div className="flex flex-col w-full pb-28 max-w-4xl mx-auto px-page-margin pt-3">
      {/* Header Profile Card */}
      <div className="bg-gradient-to-r from-primary via-nexora-pink to-primary-container rounded-3xl p-5 text-white shadow-md mb-5 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover ring-3 ring-white/50 shadow-md"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-card-title text-[20px] font-bold truncate">{user.name}</h2>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                VIP Member
              </span>
            </div>
            <p className="text-[12px] opacity-90">{user.email}</p>
            <p className="text-[12px] opacity-80">{user.phone} · {user.locationArea}, {user.city}</p>
          </div>
        </div>

        {/* Loyalty Points Strip */}
        <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between relative z-10 text-[13px]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">stars</span>
            <span>Beauty Rewards: <strong>{user.loyaltyPoints} Points</strong></span>
          </div>
          <span className="text-[11px] bg-white text-primary px-2.5 py-0.5 rounded-full font-bold">
            ₹{user.loyaltyPoints} Value
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 mb-4 rounded-xl bg-emerald-500/15 text-emerald-800 text-[13px] font-semibold flex items-center gap-2 border border-emerald-500/30">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Beauty & Styling Profile */}
      <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-4 shadow-xs mb-4">
        <div className="flex items-center justify-between mb-3 border-b border-outline-variant/40 pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-nexora-pink text-[20px]">palette</span>
            <h3 className="font-card-title text-[15px] font-bold text-on-surface">Beauty & Styling Profile</h3>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsEditingStyling(!isEditingStyling)}
              className="text-[12px] font-bold text-[#b00055] hover:bg-[#b00055]/10 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 border border-[#b00055]/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">
                {isEditingStyling ? 'close' : 'edit'}
              </span>
              <span>{isEditingStyling ? 'Cancel' : 'Edit Profile'}</span>
            </button>
            <button
              type="button"
              onClick={onOpenAIAdvisor}
              className="text-[12px] font-bold text-nexora-pink hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Consult AI</span>
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            </button>
          </div>
        </div>

        {isEditingStyling ? (
          <form onSubmit={handleSaveStyling} className="flex flex-col gap-3.5 pt-1">
            {/* Hair Profile */}
            <div>
              <label className="text-[11px] font-bold text-on-surface-variant block mb-1">Hair Profile</label>
              <input
                type="text"
                value={hairProfile}
                onChange={(e) => setHairProfile(e.target.value)}
                className="w-full h-9 px-3 bg-white rounded-xl text-[12px] border border-outline-variant focus:outline-none focus:border-[#b00055] mb-1.5"
                placeholder="e.g. Wavy / Medium Length"
              />
              <div className="flex flex-wrap gap-1.5">
                {hairOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setHairProfile(opt)}
                    className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                      hairProfile === opt
                        ? 'bg-[#b00055] text-white border-[#b00055] font-semibold shadow-xs'
                        : 'bg-white text-on-surface-variant border-outline-variant/60 hover:border-[#b00055]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Concern */}
            <div>
              <label className="text-[11px] font-bold text-on-surface-variant block mb-1">Skin Concern</label>
              <input
                type="text"
                value={skinConcern}
                onChange={(e) => setSkinConcern(e.target.value)}
                className="w-full h-9 px-3 bg-white rounded-xl text-[12px] border border-outline-variant focus:outline-none focus:border-[#b00055] mb-1.5"
                placeholder="e.g. Hydration & De-Tan"
              />
              <div className="flex flex-wrap gap-1.5">
                {skinOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSkinConcern(opt)}
                    className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                      skinConcern === opt
                        ? 'bg-[#b00055] text-white border-[#b00055] font-semibold shadow-xs'
                        : 'bg-white text-on-surface-variant border-outline-variant/60 hover:border-[#b00055]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Favorite Stylist */}
            <div>
              <label className="text-[11px] font-bold text-on-surface-variant block mb-1">Favorite Stylist</label>
              <input
                type="text"
                value={favoriteStylist}
                onChange={(e) => setFavoriteStylist(e.target.value)}
                className="w-full h-9 px-3 bg-white rounded-xl text-[12px] border border-outline-variant focus:outline-none focus:border-[#b00055] mb-1.5"
                placeholder="e.g. Aarav (Scissors & Shears)"
              />
              <div className="flex flex-wrap gap-1.5">
                {stylistOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFavoriteStylist(opt)}
                    className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                      favoriteStylist === opt
                        ? 'bg-[#b00055] text-white border-[#b00055] font-semibold shadow-xs'
                        : 'bg-white text-on-surface-variant border-outline-variant/60 hover:border-[#b00055]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Default Locality */}
            <div>
              <label className="text-[11px] font-bold text-on-surface-variant block mb-1">Default Locality</label>
              <input
                type="text"
                value={defaultLocality}
                onChange={(e) => setDefaultLocality(e.target.value)}
                className="w-full h-9 px-3 bg-white rounded-xl text-[12px] border border-outline-variant focus:outline-none focus:border-[#b00055] mb-1.5"
                placeholder="e.g. Mansarovar, Jaipur"
              />
              <div className="flex flex-wrap gap-1.5">
                {localityOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDefaultLocality(opt)}
                    className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                      defaultLocality === opt
                        ? 'bg-[#b00055] text-white border-[#b00055] font-semibold shadow-xs'
                        : 'bg-white text-on-surface-variant border-outline-variant/60 hover:border-[#b00055]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#b00055] text-white font-bold rounded-xl text-[12px] hover:bg-[#900045] transition-colors shadow-xs cursor-pointer"
              >
                Save Styling Profile
              </button>
              <button
                type="button"
                onClick={() => setIsEditingStyling(false)}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl text-[12px] hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-3 text-[12px]">
            <div className="p-2.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
              <span className="text-on-surface-variant text-[11px] block">Hair Profile</span>
              <span className="font-semibold text-on-surface">{user.hairProfile || 'Wavy / Medium Length'}</span>
            </div>
            <div className="p-2.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
              <span className="text-on-surface-variant text-[11px] block">Skin Concern</span>
              <span className="font-semibold text-on-surface">{user.skinConcern || 'Hydration & De-Tan'}</span>
            </div>
            <div className="p-2.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
              <span className="text-on-surface-variant text-[11px] block">Favorite Stylist</span>
              <span className="font-semibold text-on-surface">{user.favoriteStylist || 'Aarav (Scissors & Shears)'}</span>
            </div>
            <div className="p-2.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
              <span className="text-on-surface-variant text-[11px] block">Default Locality</span>
              <span className="font-semibold text-on-surface">{user.defaultLocality || 'Mansarovar, Jaipur'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Edit Personal Profile Form */}
      <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-4 shadow-xs mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">manage_accounts</span>
            <h3 className="font-card-title text-[15px] font-bold text-on-surface">Personal Information</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsEditingPersonal(!isEditingPersonal)}
            className="text-[12px] font-semibold text-[#b00055] cursor-pointer"
          >
            {isEditingPersonal ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {isEditingPersonal ? (
          <form onSubmit={handleSavePersonal} className="flex flex-col gap-3">
            <div>
              <label className="text-[11px] text-on-surface-variant block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 bg-white rounded-xl text-[13px] border border-outline-variant"
              />
            </div>
            <div>
              <label className="text-[11px] text-on-surface-variant block mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 bg-white rounded-xl text-[13px] border border-outline-variant"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 bg-primary text-white font-button-text rounded-xl text-[13px] hover:bg-nexora-pink transition-colors mt-1"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-2 text-[13px]">
            <div className="flex justify-between py-1 border-b border-outline-variant/30">
              <span className="text-on-surface-variant">Name</span>
              <span className="font-semibold text-on-surface">{user.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-outline-variant/30">
              <span className="text-on-surface-variant">Email</span>
              <span className="font-semibold text-on-surface">{user.email}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-on-surface-variant">Phone</span>
              <span className="font-semibold text-on-surface">{user.phone}</span>
            </div>
          </div>
        )}
      </div>

      {/* Help & Support */}
      <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-4 shadow-xs mb-4">
        <div className="flex items-center gap-2 mb-3 border-b border-outline-variant/40 pb-2">
          <span className="material-symbols-outlined text-primary text-[20px]">support_agent</span>
          <h3 className="font-card-title text-[15px] font-bold text-on-surface">Help & Support</h3>
        </div>

        {/* Live Chat entry */}
        <button
          type="button"
          onClick={() => setIsSupportChatOpen(true)}
          className="w-full flex items-center gap-3 p-3 mb-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 hover:border-primary/50 hover:shadow-xs transition-all text-left cursor-pointer group"
        >
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">chat</span>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-surface" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-on-surface flex items-center gap-1.5 flex-wrap">
              24×7 Live Chat Support
              <span className="text-[9px] bg-emerald-500/15 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                Online
              </span>
            </p>
            <p className="text-[11px] text-on-surface-variant">Chat with Tanya — avg. reply under 1 min</p>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px] group-hover:translate-x-0.5 transition-transform">
            arrow_forward_ios
          </span>
        </button>

        {/* Helpline */}
        <a
          href="tel:18004197766"
          className="w-full flex items-center gap-3 p-3 mb-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 hover:border-primary/50 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">call</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-on-surface">Nexora Helpline</p>
            <p className="text-[11px] text-on-surface-variant">1800 419 7766 · Toll-Free, 9 AM – 9 PM</p>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px] group-hover:translate-x-0.5 transition-transform">
            arrow_forward_ios
          </span>
        </a>

        {/* Email */}
        <a
          href="mailto:care@nexora.in"
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/40 hover:border-primary/50 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">mail</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-on-surface">Email Support</p>
            <p className="text-[11px] text-on-surface-variant">care@nexora.in · replies within 24 hrs</p>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px] group-hover:translate-x-0.5 transition-transform">
            arrow_forward_ios
          </span>
        </a>
      </div>

      {/* App Info Footer */}
      <div className="text-center py-4 text-on-surface-variant text-[11px] flex flex-col gap-1">
        <p className="font-semibold">Nexora SalonOS · v2.4</p>
        <p>Grounded with Gemini 3.7 & Google Maps Data</p>
      </div>

      {/* Mock Live Support Chat Window Modal */}
      {isSupportChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md bg-surface rounded-3xl shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col h-[520px] max-h-[85vh]">
            {/* Support Header */}
            <div className="p-3.5 bg-surface-bright border-b border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[14px]">
                    <span className="material-symbols-outlined text-[18px]">support_agent</span>
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-surface" />
                </div>
                <div>
                  <h3 className="font-bold text-[14px] text-on-surface">Nexora Concierge Support</h3>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <span>Tanya • Online</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSupportChatOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Support Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-surface-container-lowest">
              <div className="text-center my-1">
                <span className="text-[10px] bg-surface-container text-on-surface-variant px-2.5 py-1 rounded-full font-medium">
                  Today • Encrypted Support Session
                </span>
              </div>

              {supportMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[82%] ${
                    msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl text-[12px] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white rounded-br-xs'
                        : 'bg-surface-container border border-outline-variant/40 text-on-surface rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-on-surface-variant/70 mt-1 px-1">{msg.time}</span>
                </div>
              ))}

              {isAgentTyping && (
                <div className="self-start flex items-center gap-1.5 bg-surface-container border border-outline-variant/40 px-3 py-2 rounded-2xl text-[11px] text-on-surface-variant">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px]">Tanya is typing...</span>
                </div>
              )}

              <div ref={supportChatEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="px-3 pt-2 pb-1 bg-surface border-t border-outline-variant/30 flex gap-1.5 overflow-x-auto scrollbar-none">
              {['How to cancel an appointment?', 'Reschedule my booking', 'Check refund status', 'Salon contact issue'].map(
                (prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSupportInput(prompt);
                    }}
                    className="shrink-0 text-[10px] bg-surface-container hover:bg-surface-container-high text-on-surface-variant px-2.5 py-1 rounded-full border border-outline-variant/30 transition-colors"
                  >
                    {prompt}
                  </button>
                )
              )}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={handleSendSupportMessage}
              className="p-3 bg-surface border-t border-outline-variant/30 flex items-center gap-2"
            >
              <input
                type="text"
                value={supportInput}
                onChange={(e) => setSupportInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 bg-surface-container border border-outline-variant rounded-xl px-3.5 py-2 text-[13px] text-on-surface focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={!supportInput.trim()}
                className="w-9 h-9 rounded-xl bg-primary disabled:opacity-40 text-white flex items-center justify-center hover:bg-nexora-pink transition-colors cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
