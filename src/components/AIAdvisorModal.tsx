import React, { useState } from 'react';
import { GroundingChunk, UserProfile, Salon } from '../types';

interface AIAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  currentLocation: string;
  onSelectSalonByName?: (name: string) => void;
}

export const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({
  isOpen,
  onClose,
  user,
  currentLocation,
  onSelectSalonByName,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseMarkdown, setResponseMarkdown] = useState<string | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const samplePrompts = [
    '💇 Recommend top hair stylist in Mansarovar for modern fade & textured layers',
    '✨ Where can I get an authentic Hydra Facial Deluxe near me with high ratings?',
    '👰 Best salon in Jaipur for bridal makeup & pre-bridal skin package',
    '🌿 Which spa near me offers Swedish aromatherapy & deep tissue massage?',
  ];

  const handleAskAI = async (queryToUse?: string) => {
    const query = queryToUse || promptInput;
    if (!query.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setResponseMarkdown(null);
    setGroundingChunks([]);

    try {
      const res = await fetch('/api/salons/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: query,
          preferences: {
            preferredServices: user.preferredServices,
            genderPreference: user.genderPreference,
            hairProfile: user.hairProfile,
            skinConcern: user.skinConcern,
            favoriteStylist: user.favoriteStylist,
            defaultLocality: user.defaultLocality,
          },
          location: {
            area: currentLocation,
            latitude: 26.8533,
            longitude: 75.7681,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResponseMarkdown(data.text || data.summary || 'Recommendations ready!');
        setGroundingChunks(data.groundingChunks || []);
      } else {
        setErrorMsg(data.error || 'Failed to get AI recommendation. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Network error while connecting to Nexora AI Advisor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="ai-advisor-modal-container"
        className="w-full max-w-xl bg-surface rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-nexora-pink flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            </div>
            <div>
              <h2 className="font-card-title text-[17px] font-bold text-on-surface">Nexora AI Salon Advisor</h2>
              <p className="text-[11px] text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-nexora-pink">google_pin</span>
                <span>Grounded with Google Maps & Live Reviews</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Input Area */}
        <div className="mb-4">
          <div className="relative">
            <textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Ask anything: 'Recommend the best keratin hair spa in Jaipur', 'What facial suits sensitive skin?'..."
              rows={2}
              className="w-full p-3 pl-3 pr-12 bg-surface-container-highest text-on-surface rounded-xl text-[13px] border-0 focus:ring-1 focus:ring-nexora-pink"
            />
            <button
              onClick={() => handleAskAI()}
              disabled={isLoading || !promptInput.trim()}
              className="absolute right-2 bottom-3 p-2 bg-primary text-white rounded-lg hover:bg-nexora-pink transition-colors disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
        </div>

        {/* Sample Prompt Chips */}
        {!responseMarkdown && !isLoading && (
          <div className="mb-4">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-2">
              Popular Styling Queries
            </span>
            <div className="flex flex-col gap-2">
              {samplePrompts.map((sp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPromptInput(sp);
                    handleAskAI(sp);
                  }}
                  className="p-2.5 text-left rounded-xl bg-surface-container-lowest border border-outline-variant/40 hover:bg-surface-container text-[12px] text-on-surface transition-all flex items-center justify-between group"
                >
                  <span>{sp}</span>
                  <span className="material-symbols-outlined text-[16px] text-nexora-pink group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-10 h-10 border-3 border-nexora-pink/30 border-t-nexora-pink rounded-full animate-spin" />
            <p className="text-[13px] font-medium text-on-surface">
              Consulting Google Maps & analyzing verified reviews in {currentLocation}...
            </p>
          </div>
        )}

        {/* Error */}
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-error-container text-on-error-container text-[12px]">
            {errorMsg}
          </div>
        )}

        {/* AI Markdown Output */}
        {responseMarkdown && (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 text-[13px] leading-relaxed text-on-surface whitespace-pre-line shadow-xs">
              {responseMarkdown}
            </div>

            {/* Maps Grounding Links */}
            {groundingChunks && groundingChunks.length > 0 && (
              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/50">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className="material-symbols-outlined text-nexora-pink text-[18px]">location_on</span>
                  <h4 className="font-semibold text-[13px] text-on-surface">Verified Google Maps Sources</h4>
                </div>
                <div className="flex flex-col gap-2">
                  {groundingChunks.map((chunk, i) => {
                    const title = chunk.maps?.title || chunk.web?.title || `Place Reference #${i + 1}`;
                    const url = chunk.maps?.uri || chunk.web?.uri;
                    const snippet = chunk.maps?.placeAnswerSources?.reviewSnippets?.[0]?.snippet;

                    return (
                      <div key={i} className="p-2.5 rounded-lg bg-surface-container text-[12px] flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-on-surface">{title}</span>
                          {url && (
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-nexora-pink font-semibold flex items-center gap-0.5 hover:underline"
                            >
                              <span>View on Maps</span>
                              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                            </a>
                          )}
                        </div>
                        {snippet && (
                          <p className="text-[11px] text-on-surface-variant italic">"{snippet}"</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
