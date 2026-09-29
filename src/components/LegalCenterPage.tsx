import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Shield,
  FileText,
  RotateCcw,
  Truck,
  Mail,
  ExternalLink,
  Copy,
  CheckCheck,
  Lock,
  Clock,
  MapPin,
  Check,
  AlertCircle,
  HelpCircle,
  Coffee,
} from 'lucide-react';

export type LegalTab = 'privacy' | 'terms' | 'refund' | 'shipping' | 'contact';

interface Props {
  initialTab?: LegalTab;
  onBack: () => void;
}

export const LegalCenterPage: React.FC<Props> = ({ initialTab = 'privacy', onBack }) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);
  const [copied, setCopied] = useState(false);
  const supportEmail = 'ryperdeck.help@gmail.com';

  // Sync tab with hash if user changes hash
  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.toLowerCase();
      if (h.includes('terms')) setActiveTab('terms');
      else if (h.includes('refund') || h.includes('cancellation')) setActiveTab('refund');
      else if (h.includes('shipping') || h.includes('delivery')) setActiveTab('shipping');
      else if (h.includes('contact')) setActiveTab('contact');
      else if (h.includes('privacy')) setActiveTab('privacy');
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const switchTab = (tab: LegalTab) => {
    setActiveTab(tab);
    window.location.hash = tab === 'privacy' ? 'privacy-policy' : tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const tabs: { id: LegalTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'terms', label: 'Terms & Conditions', icon: <FileText className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy Policy', icon: <Shield className="w-4 h-4" /> },
    { id: 'refund', label: 'Refund & Cancellation', icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'shipping', label: 'Shipping & Delivery', icon: <Truck className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact Us', icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] pt-6 pb-24 px-4 sm:px-6 md:px-8 relative z-50">
      {/* Background Optical Ambient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-white/[0.015] blur-[220px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between py-6 mb-8 border-b border-white/[0.07]">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass-btn border border-white/[0.1] hover:border-white/[0.2] bg-white/[0.04] text-[13px] text-white/80 hover:text-white transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to RyperDeck
          </button>

          <div className="flex items-center gap-2.5">
            <span className="text-[14px] font-semibold text-white">
              ryper<span className="text-white/70">deck</span>
            </span>
            <span className="liquid-glass-badge text-[10px] text-white/50">Legal & Compliance</span>
          </div>
        </div>

        {/* Tab Navigation Controls (Razorpay Compliant Direct Links) */}
        <div className="mb-10 overflow-x-auto scrollbar-none pb-2">
          <div className="flex items-center gap-2 min-w-max p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => switchTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-black font-semibold shadow-lg shadow-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1. TERMS & CONDITIONS TAB */}
        {/* ========================================================================= */}
        {activeTab === 'terms' && (
          <div className="animate-fadeIn">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/[0.1] bg-white/[0.03] text-[11px] font-mono tracking-widest uppercase text-white/60 mb-4">
                <FileText className="w-3.5 h-3.5 text-white/70" />
                RBI & RAZORPAY COMPLIANT
              </div>
              <h1 className="text-[36px] sm:text-[52px] font-bold tracking-[-0.04em] leading-[1.0] text-white mb-4">
                Terms and Conditions
              </h1>
              <p className="text-[16px] sm:text-[18px] text-white/60 font-light leading-relaxed">
                Last updated: September 2026. Please read these terms carefully before downloading or using RyperDeck.
              </p>
            </div>

            <div className="space-y-8 text-[15px] text-white/70 leading-relaxed font-light">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-[18px] font-semibold text-white mb-2">1. Acceptance of Terms</h3>
                <p>
                  By accessing the RyperDeck website (the "Site") or downloading and installing the RyperDeck Windows companion software and Android application, you agree to be bound by these Terms and Conditions and all applicable laws and regulations of India. If you do not agree with any of these terms, you are prohibited from using this software.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-[18px] font-semibold text-white mb-2">2. Product Nature & License</h3>
                <p className="mb-3">
                  RyperDeck is an independent, 100% free software application developed solo by Anurag. It converts Android smartphones and tablets into wireless macro controllers for Windows PCs over local Wi-Fi UDP sockets.
                </p>
                <p>
                  You are granted a personal, non-exclusive, non-transferable, royalty-free license to use RyperDeck for personal, streaming, content creation, gaming, and professional workflows. Reverse engineering, decompiling, or distributing malicious alterations is strictly prohibited.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-[18px] font-semibold text-white mb-2">3. Voluntary Contributions & Pricing</h3>
                <p className="mb-3">
                  RyperDeck is free software. No subscription or purchase is required to access any macro features, layouts, or hotkeys.
                </p>
                <p>
                  Users may optionally choose to support ongoing independent development by making voluntary contributions ("Buy a Coffee") starting at ₹50, ₹100, ₹250, or a custom amount. Payments are voluntary gratuities to support server hosting and software development, processed securely via Razorpay under RBI guidelines.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-[18px] font-semibold text-white mb-2">4. User Responsibilities & System Security</h3>
                <p>
                  RyperDeck communicates purely over your local home or office network. You are responsible for ensuring that your local Wi-Fi network is password-protected and secure. RyperDeck transmits hotkey signals to your Windows PC; configure your shortcuts and hotkeys responsibly.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-[18px] font-semibold text-white mb-2">5. Disclaimer of Warranties & Limitation of Liability</h3>
                <p>
                  RyperDeck is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied. Under no circumstances shall the developer (Anurag) be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the software.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-[18px] font-semibold text-white mb-2">6. Governing Law & Dispute Resolution</h3>
                <p>
                  These Terms and any dispute or claim arising out of or related to them or the software shall be governed by and construed in accordance with the laws of India, subject to the exclusive jurisdiction of the competent courts in India.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. PRIVACY POLICY TAB */}
        {/* ========================================================================= */}
        {activeTab === 'privacy' && (
          <div className="animate-fadeIn">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/[0.1] bg-white/[0.03] text-[11px] font-mono tracking-widest uppercase text-white/60 mb-4">
                <Lock className="w-3.5 h-3.5 text-white/70" />
                PRIVACY GUARANTEE
              </div>
              <h1 className="text-[36px] sm:text-[52px] font-bold tracking-[-0.04em] leading-[1.0] text-white mb-4">
                Privacy Policy
              </h1>
              <p className="text-[16px] sm:text-[18px] text-white/60 font-light leading-relaxed">
                We don't want your data. We don't track your hotkeys. We don't sell anything to anyone. Period.
              </p>
            </div>

            {/* Trust Guarantee Banner */}
            <div className="p-6 sm:p-8 rounded-[28px] bg-white/[0.03] border border-white/[0.12] shadow-[0_20px_60px_rgba(0,0,0,0.7)] mb-10 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-[18px] sm:text-[20px] font-bold text-white mb-2">
                    The RyperDeck Privacy Guarantee
                  </h2>
                  <p className="text-[14px] sm:text-[15px] text-white/60 leading-relaxed font-light">
                    RyperDeck is engineered to operate strictly within your local home or office network.
                    Zero cloud relays, zero accounts required, and zero telemetry collected. Your shortcuts,
                    macros, and usage habits never touch the internet.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/[0.06] text-[12px] text-white/50">
                    <span className="flex items-center gap-1.5 text-white/70">
                      <Check className="w-4 h-4 text-emerald-400" /> 100% Local Subnet
                    </span>
                    <span className="flex items-center gap-1.5 text-white/70">
                      <Check className="w-4 h-4 text-emerald-400" /> 0 External Tracking
                    </span>
                    <span className="flex items-center gap-1.5 text-white/70">
                      <Check className="w-4 h-4 text-emerald-400" /> No Account Needed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Sections */}
            <div className="space-y-6 text-[15px] text-white/70 leading-relaxed font-light">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-[18px] font-semibold text-white mb-2">1. Zero Data Collection</h3>
                <p>
                  RyperDeck collects zero personal data. We do not track keystrokes, macro bindings, opened applications, hardware configurations, or browsing history. When you launch a macro or tap a button, that action is executed purely between your Android device and Windows PC on your local subnet.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-[18px] font-semibold text-white mb-2">2. Local Network & UDP Communication</h3>
                <p>
                  All communications between the RyperDeck Windows companion app and your phone or tablet occur strictly over your local Wi-Fi network using encrypted UDP sockets. No cloud servers, proxies, relays, or CDN routes are ever used. If you disconnect your internet cable, RyperDeck continues working seamlessly because it does not depend on the internet.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-[18px] font-semibold text-white mb-2">3. No Accounts, No Passwords</h3>
                <p>
                  You never have to create an account, log in with an email, or provide credentials to use RyperDeck. There is no central user database, which means there is nothing to leak or breach.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-[18px] font-semibold text-white mb-2">4. No Tracking Cookies</h3>
                <p>
                  The RyperDeck website does not use tracking cookies, analytics cookies, marketing pixels, or fingerprinting scripts. We do not use Google Analytics or Meta Pixel.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-[18px] font-semibold text-white mb-2">5. Feature Requests & Bug Reports</h3>
                <p>
                  When you optionally submit a feature suggestion or report a bug, the content is saved so Anurag can review it. If you choose to provide your email address, it is used solely to reply to your inquiry. We never share, sell, or disclose your email address to third parties.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-[18px] font-semibold text-white mb-2">6. Secure Razorpay Payment Processing</h3>
                <p>
                  If you choose to support development by buying a coffee, payment processing is handled independently by Razorpay (an RBI-licensed Payment Aggregator) under 128-bit bank-grade encryption. RyperDeck never sees, stores, or handles credit/debit card numbers or UPI MPINs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. REFUND & CANCELLATION POLICY TAB */}
        {/* ========================================================================= */}
        {activeTab === 'refund' && (
          <div className="animate-fadeIn">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/[0.1] bg-white/[0.03] text-[11px] font-mono tracking-widest uppercase text-white/60 mb-4">
                <RotateCcw className="w-3.5 h-3.5 text-white/70" />
                MANDATORY RBI COMPLIANCE
              </div>
              <h1 className="text-[36px] sm:text-[52px] font-bold tracking-[-0.04em] leading-[1.0] text-white mb-4">
                Refund & Cancellation Policy
              </h1>
              <p className="text-[16px] sm:text-[18px] text-white/60 font-light leading-relaxed">
                Clear, transparent, and fair policies for voluntary community support contributions.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-[28px] bg-white/[0.03] border border-white/[0.12] mb-10 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-white mb-2">
                    7-Day Accidental Payment Refund Window
                  </h2>
                  <p className="text-[14px] sm:text-[15px] text-white/60 leading-relaxed font-light">
                    If you made an accidental payment, were charged multiple times, or made an unintended contribution, we will refund 100% of your money. Simply email us within 7 days of the transaction.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 text-[15px] text-white/70 leading-relaxed font-light">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-[18px] font-semibold text-white mb-2">1. Nature of Payments</h3>
                <p>
                  RyperDeck is completely free software. All features are unlocked with zero mandatory paywalls. Payments made on this website via the "Buy a Coffee" modal or support links are strictly voluntary gratuities to support independent development, web hosting, and software updates.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-[18px] font-semibold text-white mb-2">2. Eligibility for Refunds</h3>
                <p className="mb-3">
                  Refunds are honored under the following circumstances:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-white/60">
                  <li><strong>Duplicate Charges:</strong> You were charged more than once for a single intended contribution due to network or gateway lag.</li>
                  <li><strong>Accidental Transaction:</strong> You entered an unintended contribution amount or your account was debited inadvertently.</li>
                  <li><strong>Technical Gateway Errors:</strong> Payment was debited from your bank or UPI account but failed to record or register properly.</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-[18px] font-semibold text-white mb-2">3. How to Request a Refund</h3>
                <p className="mb-3">
                  To initiate a refund, please send an email to <span className="font-mono text-white underline">{supportEmail}</span> with the subject line <strong>"Refund Request - [Your Payment ID]"</strong>. Please include:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-white/60 mb-3">
                  <li>Razorpay Payment ID (e.g. <span className="font-mono text-white/80">pay_...</span>)</li>
                  <li>Date and amount of the transaction</li>
                  <li>Payment screenshot or bank reference number (UTR)</li>
                </ul>
                <p>
                  Requests must be submitted within <strong>7 calendar days</strong> from the date of the transaction.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-[18px] font-semibold text-white mb-2">4. Refund Processing Time (5–7 Business Days)</h3>
                <p>
                  Once approved, your refund will be initiated immediately via the Razorpay payment gateway dashboard. In compliance with RBI settlement guidelines, funds will automatically credit back to your original source of payment (UPI ID, Debit/Credit Card, or Netbanking Account) within <strong>5 to 7 business days</strong>.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-[18px] font-semibold text-white mb-2">5. Cancellation of Recurring Services</h3>
                <p>
                  RyperDeck does not operate any recurring monthly or annual subscription plans. All voluntary contributions are one-time payments. Consequently, there is no recurring billing or automatic renewal to cancel.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. SHIPPING & DELIVERY POLICY TAB */}
        {/* ========================================================================= */}
        {activeTab === 'shipping' && (
          <div className="animate-fadeIn">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/[0.1] bg-white/[0.03] text-[11px] font-mono tracking-widest uppercase text-white/60 mb-4">
                <Truck className="w-3.5 h-3.5 text-white/70" />
                DIGITAL GOODS & SOFTWARE
              </div>
              <h1 className="text-[36px] sm:text-[52px] font-bold tracking-[-0.04em] leading-[1.0] text-white mb-4">
                Shipping and Delivery Policy
              </h1>
              <p className="text-[16px] sm:text-[18px] text-white/60 font-light leading-relaxed">
                RyperDeck is 100% digital software. Zero physical delivery required. Instant access.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-[28px] bg-white/[0.03] border border-white/[0.12] mb-10 backdrop-blur-xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <span className="text-[12px] font-mono text-white/40 block mb-1">SHIPPING CHARGES</span>
                  <span className="text-[24px] font-bold text-emerald-400">₹0 (Free)</span>
                  <p className="text-[12px] text-white/40 mt-1">No packaging or delivery fees</p>
                </div>
                <div>
                  <span className="text-[12px] font-mono text-white/40 block mb-1">DELIVERY TIMELINE</span>
                  <span className="text-[24px] font-bold text-white">Instant</span>
                  <p className="text-[12px] text-white/40 mt-1">Direct download upon click</p>
                </div>
                <div>
                  <span className="text-[12px] font-mono text-white/40 block mb-1">DELIVERY METHOD</span>
                  <span className="text-[24px] font-bold text-white">Digital Download</span>
                  <p className="text-[12px] text-white/40 mt-1">Direct installer & APK files</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 text-[15px] text-white/70 leading-relaxed font-light">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-[18px] font-semibold text-white mb-2">1. Nature of Product (Digital Goods Only)</h3>
                <p>
                  RyperDeck is exclusively a digital software product consisting of a Windows Companion application (.exe / installer) and an Android application (.apk). We do NOT manufacture, ship, or deliver any physical hardware stream decks, physical plastic boxes, or printed media.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-[18px] font-semibold text-white mb-2">2. Delivery Method & Timelines</h3>
                <p>
                  Delivery of RyperDeck software is instantaneous. Users can download the software immediately from the official download links on this website or from our official public GitHub releases. No shipping waiting period is required.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-[18px] font-semibold text-white mb-2">3. Shipping Costs</h3>
                <p>
                  Because delivery is executed electronically over the internet via direct HTTPS download, all shipping, handling, and delivery charges are strictly ₹0.00.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-[18px] font-semibold text-white mb-2">4. Download Assistance & Support</h3>
                <p>
                  If you encounter any difficulty downloading the software, corrupted download files, or browser security blocks, please email us directly at <span className="font-mono text-white underline">{supportEmail}</span>. We will provide direct alternative download mirrors within 24 hours.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. CONTACT US & ABOUT US TAB */}
        {/* ========================================================================= */}
        {activeTab === 'contact' && (
          <div className="animate-fadeIn">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/[0.1] bg-white/[0.03] text-[11px] font-mono tracking-widest uppercase text-white/60 mb-4">
                <Mail className="w-3.5 h-3.5 text-white/70" />
                OFFICIAL SUPPORT & DISCLOSURES
              </div>
              <h1 className="text-[36px] sm:text-[52px] font-bold tracking-[-0.04em] leading-[1.0] text-white mb-4">
                Contact Us
              </h1>
              <p className="text-[16px] sm:text-[18px] text-white/60 font-light leading-relaxed">
                Direct disclosures and contact channels for RyperDeck support and payment inquiries.
              </p>
            </div>

            {/* Merchant Details Grid for Razorpay Verification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white/80" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold text-white">Merchant & Operator</h3>
                    <p className="text-[12px] text-white/40">Solo Developer & Proprietor</p>
                  </div>
                </div>
                <div className="space-y-2 text-[14px] text-white/70">
                  <p><strong className="text-white">Product Name:</strong> RyperDeck</p>
                  <p><strong className="text-white">Developer:</strong> Anurag</p>
                  <p><strong className="text-white">Country of Operation:</strong> India</p>
                  <p><strong className="text-white">Business Activity:</strong> Software Development & Wireless Productivity Tools</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white/80" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold text-white">Working Hours & SLA</h3>
                    <p className="text-[12px] text-white/40">Customer Support Timelines</p>
                  </div>
                </div>
                <div className="space-y-2 text-[14px] text-white/70">
                  <p><strong className="text-white">Operating Hours:</strong> Monday – Saturday (10:00 AM – 6:00 PM IST)</p>
                  <p><strong className="text-white">Email Response Time:</strong> Within 24 to 48 hours</p>
                  <p><strong className="text-white">Payment Inquiries:</strong> Immediate investigation via Razorpay dashboard</p>
                </div>
              </div>
            </div>

            {/* Direct Email Card */}
            <div className="rounded-[32px] p-8 sm:p-10 bg-[#090a12] border border-white/[0.14] shadow-[0_30px_90px_rgba(0,0,0,0.9)] backdrop-blur-2xl mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/40 block mb-2 font-semibold">
                    DIRECT SUPPORT EMAIL
                  </span>
                  <h3 className="text-[22px] sm:text-[26px] font-bold text-white mb-2 tracking-tight">
                    Got questions, feedback, or need a refund?
                  </h3>
                  <p className="text-[14px] text-white/50 leading-relaxed font-light max-w-md">
                    Every message lands directly in Anurag's inbox. Click below to compose an email or open Gmail.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <a
                    href={`mailto:${supportEmail}`}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.2] hover:border-white/[0.35] text-white font-mono text-[14px] font-semibold transition-all shadow-[0_0_30px_rgba(255,255,255,0.08)] group"
                  >
                    <Mail className="w-4 h-4 text-white/80 group-hover:scale-110 transition-transform" />
                    <span className="underline underline-offset-4 decoration-white/40 group-hover:decoration-white">
                      {supportEmail}
                    </span>
                  </a>

                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${supportEmail}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-white/70 hover:text-white text-[13px] font-medium transition-colors"
                  >
                    <span>Gmail</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={copyEmail}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-white/70 hover:text-white text-[13px] font-medium transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <CheckCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Social channels */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              <h3 className="text-[16px] font-semibold text-white mb-3">Other Direct Channels</h3>
              <div className="flex flex-wrap gap-4 text-[13px] text-white/70">
                <a
                  href="https://x.com/Anurag_y1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white underline underline-offset-4"
                >
                  X: @Anurag_y1
                </a>
                <span>·</span>
                <a
                  href="https://t.me/Anurag_y2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white underline underline-offset-4"
                >
                  Telegram: @Anurag_y2
                </a>
                <span>·</span>
                <a
                  href="https://github.com/anuraaag23"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white underline underline-offset-4"
                >
                  GitHub: @anuraaag23
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Footer inside Legal Center */}
        <div className="mt-14 pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-white/30">
          <span>Effective September 2026 · RyperDeck Compliance Center</span>
          <button
            onClick={onBack}
            className="text-white/60 hover:text-white underline cursor-pointer"
          >
            ← Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalCenterPage;
