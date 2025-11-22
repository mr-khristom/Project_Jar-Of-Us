
import React, { useState } from 'react';
import { uploadMemory } from '../services/firebase';
import { enhanceMemoryText } from '../services/gemini';
import { getDirectImgurUrl } from '../services/utils';
import { Wand2, Save, Check, Loader2, LogOut, Calendar, AlertTriangle, Link } from 'lucide-react';

interface AdminViewProps {
  onBack: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ onBack }) => {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  // Default to today's date in YYYY-MM-DD format
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEnhance = async () => {
    if (!text) return;
    setIsEnhancing(true);
    const improved = await enhanceMemoryText(text);
    setText(improved);
    setIsEnhancing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;

    setIsUploading(true);
    setErrorMessage(null);
    setSuccess(false);

    try {
      // Auto-format URL before saving
      const finalUrl = getDirectImgurUrl(imageUrl);
      await uploadMemory(text, finalUrl, dateStr);
      setSuccess(true);
      setText('');
      setImageUrl('');
      // Keep date as is for batch entry convenience
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error("Upload failed", error);
      setErrorMessage(error.message || "Failed to upload memory.");
    } finally {
      setIsUploading(false);
    }
  };

  // Calculate preview URL live
  const previewUrl = getDirectImgurUrl(imageUrl);

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <h2 className="text-white font-medium text-lg">Admin</h2>
             <span className="px-2 py-0.5 bg-love-600 rounded text-[10px] text-white font-bold tracking-wider">PANEL</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onBack}
              className="text-slate-400 hover:text-white transition-colors p-2"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Error Display */}
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
              <AlertTriangle size={20} className="shrink-0 mt-0.5" />
              <div className="text-sm">{errorMessage}</div>
            </div>
          )}

          {/* Date Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Memory Date</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar size={18} />
                </div>
                <input
                    type="date"
                    required
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-love-500 focus:border-transparent text-slate-700 font-mono"
                />
            </div>
          </div>

          {/* Text Input Area */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Memory Note</label>
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-love-500 focus:border-transparent min-h-[120px] resize-none text-slate-700"
                placeholder="Write something beautiful..."
              />
              <button
                type="button"
                onClick={handleEnhance}
                disabled={!text || isEnhancing}
                className="absolute bottom-3 right-3 p-2 bg-white border border-slate-200 shadow-sm rounded-lg text-purple-600 hover:bg-purple-50 transition-colors disabled:opacity-50"
                title="Enhance with AI"
              >
                {isEnhancing ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
              </button>
            </div>
          </div>

          {/* Imgur Link Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Image URL (Imgur)</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Link size={18} />
                </div>
                <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://imgur.com/..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-love-500 focus:border-transparent text-slate-700"
                />
            </div>
            <p className="text-xs text-slate-400">
                Paste your Imgur link. We'll automatically convert it to a direct image link.
            </p>
            {previewUrl && (
                <div className="mt-2 relative w-full h-40 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading || !text}
            className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                success 
                ? 'bg-green-500 text-white' 
                : 'bg-love-600 hover:bg-love-700 text-white shadow-lg hover:shadow-xl'
            } disabled:opacity-50 disabled:shadow-none`}
          >
            {isUploading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : success ? (
              <>
                <Check size={20} />
                <span>Saved to Jar!</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Preserve Memory</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminView;
