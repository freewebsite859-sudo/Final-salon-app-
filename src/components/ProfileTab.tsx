import React, { useState } from 'react';
import { UserProfile } from '../types';

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

      {/* App Info Footer */}
      <div className="text-center py-4 text-on-surface-variant text-[11px] flex flex-col gap-1">
        <p className="font-semibold">Nexora SalonOS · v2.4</p>
        <p>Grounded with Gemini 3.7 & Google Maps Data</p>
      </div>
    </div>
  );
};
