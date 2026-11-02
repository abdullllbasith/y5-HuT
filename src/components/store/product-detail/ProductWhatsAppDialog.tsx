import React, { useState } from 'react';
import { MessageCircle, X, Check, Copy, ExternalLink } from 'lucide-react';
import { getDemoWhatsAppNumber, buildWhatsAppUrl } from '../../../lib/whatsapp';
import { Button } from '../../ui/Button';

interface ProductWhatsAppDialogProps {
  open: boolean;
  onClose: () => void;
  messageText: string;
}

export const ProductWhatsAppDialog: React.FC<ProductWhatsAppDialogProps> = ({
  open,
  onClose,
  messageText,
}) => {
  const [copied, setCopied] = useState(false);
  const whatsappNumber = getDemoWhatsAppNumber();

  if (!open) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-hard max-w-lg w-full border border-line overflow-hidden flex flex-col text-left">
        {/* Header */}
        <div className="px-5 py-4 border-b border-line flex items-center justify-between bg-paper-sunk">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-go" />
            <h3 className="font-display font-bold text-base text-ink">
              WhatsApp Enquiry Preview
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-ink-soft hover:text-ink hover:bg-paper cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs font-ui">
          {/* Honest Demo Disclosure */}
          <div className="p-3 bg-highlighter/30 border border-line rounded-xl space-y-1">
            <p className="font-bold text-ink">
              Demo Showcase — Simulated WhatsApp Concierge
            </p>
            <p className="text-ink-soft leading-relaxed text-[11px]">
              In a live shop, this opens WhatsApp with a pre-filled enquiry. To test direct launch, set{' '}
              <code className="bg-paper-sunk px-1 py-0.5 rounded font-data text-[10px] text-ink">
                VITE_DEMO_WHATSAPP_NUMBER
              </code>
              .
            </p>
          </div>

          {/* Message Textbox */}
          <div>
            <label className="block font-data text-[10px] uppercase font-bold text-ink-soft mb-1.5">
              Draft Dispatch Message
            </label>
            <div className="bg-paper border border-line rounded-xl p-3 font-data text-xs text-ink whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {messageText}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={handleCopy}
              className="flex-1 min-h-[44px]"
            >
              {copied ? <Check className="w-4 h-4 text-go" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Message'}</span>
            </Button>

            {whatsappNumber && (
              <Button
                variant="primary"
                onClick={() => {
                  const url = buildWhatsAppUrl(whatsappNumber, messageText);
                  window.open(url, '_blank', 'noopener,noreferrer');
                }}
                className="flex-1 min-h-[44px]"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open WhatsApp</span>
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={onClose}
              className="min-h-[44px]"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

