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
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      phone,
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

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
        <div className="p-3 mb-4 rounded-xl bg-success-emerald/15 text-success-emerald text-[13px] font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Profile preferences updated successfully!</span>
        </div>
      )}

      {/* Styling Profile */}
      <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-4 shadow-xs mb-4">
        <div className="flex items-center justify-between mb-3 border-b border-outline-variant/40 pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-nexora-pink text-[20px]">palette</span>
            <h3 className="font-card-title text-[15px] font-bold text-on-surface">Beauty & Styling Profile</h3>
          </div>
          <button
            onClick={onOpenAIAdvisor}
            className="text-[12px] font-bold text-nexora-pink hover:underline flex items-center gap-1"
          >
            <span>Consult AI</span>
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[12px]">
          <div className="p-2.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
            <span className="text-on-surface-variant text-[11px] block">Hair Profile</span>
            <span className="font-semibold text-on-surface">Wavy / Medium Length</span>
          </div>
          <div className="p-2.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
            <span className="text-on-surface-variant text-[11px] block">Skin Concern</span>
            <span className="font-semibold text-on-surface">Hydration & De-Tan</span>
          </div>
          <div className="p-2.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
            <span className="text-on-surface-variant text-[11px] block">Favorite Stylist</span>
            <span className="font-semibold text-on-surface">Aarav (Scissors & Shears)</span>
          </div>
          <div className="p-2.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
            <span className="text-on-surface-variant text-[11px] block">Default Locality</span>
            <span className="font-semibold text-on-surface">Mansarovar, Jaipur</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-4 shadow-xs mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">manage_accounts</span>
            <h3 className="font-card-title text-[15px] font-bold text-on-surface">Personal Information</h3>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-[12px] font-semibold text-nexora-pink"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="flex flex-col gap-3">
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
