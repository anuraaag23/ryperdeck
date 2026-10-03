import React, { useState, useEffect, useRef } from 'react';
import { LiquidCursor } from './components/LiquidGlass/LiquidCursor';
import { LiquidShaderBackground } from './components/LiquidGlass/LiquidShaderBackground';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingCoffeeWidget } from './components/Coffee/FloatingCoffeeWidget';
import { RequestFeatureModal } from './components/RequestFeature/RequestFeatureModal';
import { ReportBugModal } from './components/RequestFeature/ReportBugModal';
import { LegalCenterPage, LegalTab } from './components/LegalCenterPage';
import { AdminPage } from './components/AdminPage';

// Sections — ordered for maximum visual impact & natural conversion narrative
import { HeroSection }            from './components/Sections/HeroSection';
import { AppShowcaseSection }     from './components/Sections/AppShowcaseSection';
import { ControlsSection }        from './components/Sections/ControlsSection';
import { UnlimitedPagesSection }  from './components/Sections/UnlimitedPagesSection';
import { CurrentFeaturesSection } from './components/Sections/CurrentFeaturesSection';
import { UseCasesSection }        from './components/Sections/UseCasesSection';
import { PCAppShowcaseSection }   from './components/Sections/PCAppShowcaseSection';
import { PhoneShowcaseSection }   from './components/Sections/PhoneShowcaseSection';
import { InActionSection }        from './components/Sections/InActionSection';
import { WindowsShowcase }        from './components/Sections/WindowsShowcase';
import { DefaultPresetsSection }  from './components/Presets/DefaultPresetsSection';
import { ComparisonSection }      from './components/Sections/ComparisonSection';
import { PrivacySection }         from './components/Sections/PrivacySection';
import { SmallPrintSection }      from './components/Sections/SmallPrintSection';
import { LeaderboardSection }     from './components/Sections/LeaderboardSection';
import { HowItWorksSection }      from './components/Sections/HowItWorksSection';
import { ManifestoSection }       from './components/Sections/ManifestoSection';
import { DeveloperStorySection }  from './components/Sections/DeveloperStorySection';
import { DownloadAndFAQ }         from './components/Sections/DownloadAndFAQ';
import { KeyboardMousePage }      from './components/KeyboardMousePage';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'legal' | 'admin' | 'keyboard-mouse'>('home');
  const [legalTab, setLegalTab]       = useState<LegalTab>('privacy');
  const [featureOpen, setFeatureOpen] = useState(false);
  const [bugOpen, setBugOpen]         = useState(false);

  // Preserve scroll position before navigating away from the home view
  const savedScrollY = useRef<number>(0);

  // Hash-based routing
  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.toLowerCase();
      if (h === '#keyboard-mouse' || h === '#remote-control' || h === '#trackpad' || h === '#remote-keyboard') {
        savedScrollY.current = window.scrollY;
        setCurrentView('keyboard-mouse');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (h === '#terms' || h === '#terms-and-conditions') {
        savedScrollY.current = window.scrollY;
        setLegalTab('terms');
        setCurrentView('legal');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (h === '#privacy' || h === '#privacy-policy') {
        savedScrollY.current = window.scrollY;
        setLegalTab('privacy');
        setCurrentView('legal');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (h === '#refund' || h === '#refund-policy' || h === '#cancellation') {
        savedScrollY.current = window.scrollY;
        setLegalTab('refund');
        setCurrentView('legal');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (h === '#shipping' || h === '#shipping-policy' || h === '#delivery') {
        savedScrollY.current = window.scrollY;
        setLegalTab('shipping');
        setCurrentView('legal');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (h === '#contact' || h === '#contact-us') {
        savedScrollY.current = window.scrollY;
        setLegalTab('contact');
        setCurrentView('legal');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (h === '#ryper-ctrl-adminpnl') {
        savedScrollY.current = window.scrollY;
        setCurrentView('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (h === '' && (currentView === 'legal' || currentView === 'admin' || currentView === 'keyboard-mouse')) {
        setCurrentView('home');
        requestAnimationFrame(() => {
          window.scrollTo({ top: savedScrollY.current, behavior: 'instant' });
        });
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [currentView]);

  const openLegal = (tab: LegalTab) => {
    savedScrollY.current = window.scrollY;
    setLegalTab(tab);
    setCurrentView('legal');
    window.location.hash = tab === 'privacy' ? 'privacy-policy' : tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openKeyboardMouse = () => {
    savedScrollY.current = window.scrollY;
    setCurrentView('keyboard-mouse');
    window.location.hash = 'keyboard-mouse';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const returnToHome = () => {
    setCurrentView('home');
    if (window.location.hash) {
      history.pushState(null, '', window.location.pathname);
    }
    // Restore the exact scroll position the user was at before navigating away
    requestAnimationFrame(() => {
      window.scrollTo({ top: savedScrollY.current, behavior: 'instant' });
    });
  };

  // Track global scroll progress (0-100%)
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress((window.scrollY / total) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen text-[#f5f5f7] bg-black overflow-x-hidden selection:bg-white/20 selection:text-white">
      {/* Global Liquid Glass Scroll Progress Indicator */}
      <div
        className="fixed top-0 left-0 h-[2.5px] bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 z-50 pointer-events-none shadow-[0_0_14px_rgba(56,189,248,0.9)] transition-[width] duration-75 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Dynamic Ambient Optical Caustics */}
      <LiquidShaderBackground />

      {/* ADMIN PANEL */}
      {currentView === 'admin' ? (
        <AdminPage onBack={returnToHome} />
      ) : currentView === 'legal' ? (
        /* DEDICATED LEGAL & COMPLIANCE CENTER */
        <LegalCenterPage initialTab={legalTab} onBack={returnToHome} />
      ) : currentView === 'keyboard-mouse' ? (
        /* DEDICATED REMOTE KEYBOARD & PRECISION TRACKPAD HUB */
        <KeyboardMousePage onBack={returnToHome} />
      ) : (
        <>
          {/* Floating Pill Navigation */}
          <Navbar
            onRequestFeature={() => setFeatureOpen(true)}
            onReportBug={() => setBugOpen(true)}
            onOpenKeyboardMouse={openKeyboardMouse}
            isModalOpen={featureOpen || bugOpen}
          />

          <main className="relative z-10">
            {/* 1 — WELCOME / HERO: Tagline, Status, Visitor Counter, CTAs */}
            <HeroSection
              onRequestFeature={() => setFeatureOpen(true)}
              onReportBug={() => setBugOpen(true)}
            />

            {/* 2 — IMMEDIATE VISUAL PROOF: Xiaomi Pad 6 tablet in landscape auto-swiping */}
            <AppShowcaseSection />

            {/* 3 — TACTILE POWER: Every hotkey. On your Android (16 icon tiles) */}
            <ControlsSection />

            {/* 4 — HARDWARE KILLER: Most controllers give you 8 buttons. RyperDeck gives you unlimited pages. */}
            <UnlimitedPagesSection />

            {/* 5 — CAPABILITIES BREAKDOWN: What RyperDeck offers right now (12 capability cards + Hub Spotlight) */}
            <div id="current-features">
              <CurrentFeaturesSection
                onRequestFeature={() => setFeatureOpen(true)}
                onOpenKeyboardMouse={openKeyboardMouse}
              />
            </div>

            {/* 6 — TARGET PERSONAS: Built for people who actually focus (Streamer, Gamer, Creator, Power User) */}
            <UseCasesSection />

            {/* 7 — WINDOWS COMPANION: Monitor mockup & companion download options */}
            <PCAppShowcaseSection />

            {/* 8 — ANDROID MOBILE SHOWCASE: Pick up. Tap. Done. (Auto-swiping smartphone preview) */}
            <PhoneShowcaseSection />

            {/* 9 — COMMUNITY & DEMO: RyperDeck in Action & Top Supporters leaderboard bar */}
            <InActionSection />

            {/* 10 — DEEP NATIVE INTEGRATION: Direct Windows hotkeys, zero latency UDP */}
            <WindowsShowcase />

            {/* 11 — DEFAULT PRESETS: Streamer, Gamer, Editor JSON downloads */}
            <DefaultPresetsSection />

            {/* 12 — PRICE ANCHORING: StreamDeck $250 vs RyperDeck $0 in your pocket */}
            <ComparisonSection />

            {/* 13 — PEACE OF MIND: Nothing leaves your home (animated UDP packet beam) */}
            <PrivacySection onOpenPrivacyModal={() => openLegal('privacy')} />

            {/* 14 — SPECIFICATIONS: Small print. No surprises. (Windows 10/11 · Android 8+ · Free Forever) */}
            <SmallPrintSection />

            {/* 15 — SOCIAL PROOF: Live Community Leaderboard & Verified Reviews */}
            <LeaderboardSection />

            {/* 16 — EFFORTLESS ONBOARDING: 30-Second Windows Setup Guide */}
            <HowItWorksSection />

            {/* 17 — INDIE MANIFESTO: Built with attention, not investors (2 months, zero funding) */}
            <ManifestoSection />

            {/* 18 — HUMAN STORY (Directly above FAQ): Built by one person (Anurag's story, photo, milestones) */}
            <DeveloperStorySection />

            {/* 19 — FINAL CONVERSION: Download Card + Frequently Asked Questions accordion */}
            <DownloadAndFAQ />
          </main>

          {/* Footer with Anurag's Instagram, Telegram, Email, X, GitHub + Legal Links */}
          <Footer
            onRequestFeature={() => setFeatureOpen(true)}
            onReportBug={() => setBugOpen(true)}
            onLegal={openLegal}
            onPrivacy={() => openLegal('privacy')}
            onOpenKeyboardMouse={openKeyboardMouse}
          />

          {/* Floating Animated Coffee Cup Widget (bottom right corner) */}
          <FloatingCoffeeWidget />
        </>
      )}

      {/* Modals & Overlays */}
      <RequestFeatureModal isOpen={featureOpen} onClose={() => setFeatureOpen(false)} />
      <ReportBugModal      isOpen={bugOpen}     onClose={() => setBugOpen(false)} />

      {/* Interactive Liquid Glass Cursor */}
      <LiquidCursor />
    </div>
  );
};

export default App;
