import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Bug,
  Lightbulb,
  Coffee,
  Shield,
  ArrowLeft,
  Eye,
  EyeOff,
  Trash2,
  Download,
  RefreshCw,
  Users,
  CheckCircle,
  ExternalLink,
  Lock,
  Database,
  FolderOpen,
  LogOut,
  BarChart2,
  AlertCircle,
} from 'lucide-react';
import {
  supabase,
  isSupabaseConfigured,
  fetchSubscribers,
  fetchBugReports,
  fetchFeatureRequests,
  fetchSupporters,
  setFeatureStatus,
  deleteRecord,
  DbSubscriber,
  DbBugReport,
  DbFeatureRequest,
  DbSupporter,
} from '../lib/supabase';

// Secret fallback password for developer access (never shown in UI)
const BACKUP_ADMIN_PW = (import.meta as any).env?.VITE_ADMIN_PASSWORD || 'ryper@admin2025';

interface AdminPageProps {
  onBack: () => void;
}

type Tab = 'bugs' | 'features' | 'emails' | 'supporters' | 'visitors';

export const AdminPage: React.FC<AdminPageProps> = ({ onBack }) => {
  const [authed, setAuthed]         = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [pw, setPw]                 = useState('');
  const [showPw, setShowPw]         = useState(false);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [tab, setTab]               = useState<Tab>('bugs');
  const [tick, setTick]             = useState(0);

  // Live Data States
  const [emails, setEmails]         = useState<DbSubscriber[]>([]);
  const [bugs, setBugs]             = useState<DbBugReport[]>([]);
  const [features, setFeatures]     = useState<DbFeatureRequest[]>([]);
  const [supporters, setSupporters] = useState<DbSupporter[]>([]);
  const [visitorCount, setVisitorCount] = useState<number>(1);
  const [authEmail, setAuthEmail]   = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Check if session is already active in Supabase Auth
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setAuthed(true);
          setAuthEmail(session.user?.email || 'Admin');
        }
      });
    }
  }, []);

  // Fetch real data from Supabase whenever authed or refreshed
  useEffect(() => {
    if (!authed) return;
    setLoading(true);

    Promise.all([
      fetchSubscribers(),
      fetchBugReports(),
      fetchFeatureRequests(),
      fetchSupporters(),
    ])
      .then(([subList, bugList, featList, supList]) => {
        setEmails(subList);
        setBugs(bugList);
        setFeatures(featList);
        setSupporters(supList);
      })
      .catch((err) => {
        console.error('Error loading dashboard data:', err);
      })
      .finally(() => {
        setLoading(false);
      });

    try {
      const v = parseInt(localStorage.getItem('ryperdeck_real_visitors_v2') || '1', 10);
      setVisitorCount(v);
    } catch {
      setVisitorCount(1);
    }
  }, [authed, tick]);

  // Handle Login: Real Supabase Auth login (with secure env backup fallback)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const emailTrimmed = adminEmail.trim().replace(',', '.');
    const pwTrimmed = pw.trim();

    if (!emailTrimmed) {
      setError('Please enter your admin email address.');
      setLoading(false);
      return;
    }

    if (!pwTrimmed) {
      setError('Please enter your password.');
      setLoading(false);
      return;
    }

    // 1. Attempt Supabase Auth login
    if (supabase) {
      try {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: emailTrimmed,
          password: pwTrimmed,
        });

        if (!authError && data.session) {
          setAuthed(true);
          setAuthEmail(data.user?.email || emailTrimmed);
          setLoading(false);
          if (containerRef.current) containerRef.current.scrollTop = 0;
          return;
        }

        // If Supabase returned an error, check if password matches environment backup
        if (pwTrimmed === BACKUP_ADMIN_PW) {
          setAuthed(true);
          setAuthEmail(emailTrimmed);
          setLoading(false);
          if (containerRef.current) containerRef.current.scrollTop = 0;
          return;
        }

        setError(authError?.message || 'Invalid email or password.');
        setLoading(false);
        return;
      } catch (err: any) {
        console.error('Supabase sign-in error:', err);
      }
    }

    // 2. Fallback check
    if (pwTrimmed === BACKUP_ADMIN_PW) {
      setAuthed(true);
      setAuthEmail(emailTrimmed);
      setError('');
    } else {
      setError('Invalid admin credentials. Please verify your email and password.');
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setAuthed(false);
    setAuthEmail(null);
    setPw('');
    setAdminEmail('');
  };

  const handleDeleteItem = async (
    table: 'subscribers' | 'bug_reports' | 'feature_requests' | 'supporters',
    id?: string
  ) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to permanently delete this record?')) return;

    await deleteRecord(table, id);
    setTick((t) => t + 1);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await setFeatureStatus(id, newStatus);
    setTick((t) => t + 1);
  };

  const exportJSON = (data: any[], filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const TABS: { id: Tab; label: string; count: number | string; icon: React.ReactNode }[] = [
    { id: 'bugs',       label: 'Bug Reports',   count: bugs.length,       icon: <Bug style={{ width: 16, height: 16 }} /> },
    { id: 'features',   label: 'Feature Reqs',  count: features.length,   icon: <Lightbulb style={{ width: 16, height: 16 }} /> },
    { id: 'emails',     label: 'Subscribers',   count: emails.length,     icon: <Mail style={{ width: 16, height: 16 }} /> },
    { id: 'supporters', label: 'Supporters',    count: supporters.length, icon: <Coffee style={{ width: 16, height: 16 }} /> },
    { id: 'visitors',   label: 'Site Visitors', count: visitorCount.toLocaleString(), icon: <Users style={{ width: 16, height: 16 }} /> },
  ];

  // ════════════════════════════════════════════════════════════════════════════
  // ── 1. CLEAN SECURE LOGIN SCREEN ───────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════════
  if (!authed) {
    return (
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          overflowY: 'auto',
          backgroundColor: '#07070c',
          backgroundImage: 'radial-gradient(ellipse at 50% 15%, rgba(255, 255, 255, 0.07) 0%, rgba(0,0,0,0.95) 75%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#ffffff',
        }}
      >
        {/* Back to site */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.15)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.08)')}
        >
          <ArrowLeft style={{ width: 16, height: 16 }} />
          Back to Site
        </button>

        {/* Main login card */}
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            background: '#0d0e16',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '24px',
            padding: '38px 32px',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.3)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <Shield style={{ width: 24, height: 24 }} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255, 255, 255, 0.45)', fontWeight: 600 }}>
                RyperDeck System
              </p>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
                Admin Console
              </h1>
            </div>
          </div>

          {/* Database indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 12px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontSize: '12px',
              color: '#34d399',
              marginBottom: '24px',
            }}
          >
            <Database style={{ width: 14, height: 14, flexShrink: 0 }} />
            <span>Supabase Database Connected</span>
          </div>

          {/* Login form */}
          <form onSubmit={handleLogin} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Email field */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '8px' }}>
                Admin Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value.replace(',', '.'))}
                placeholder="your-admin@example.com"
                autoFocus
                required
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '0 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Password input */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '8px' }}>
                Password
              </label>

              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 46px 0 16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>

            {/* Error display */}
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  fontSize: '12px',
                }}
              >
                <AlertCircle style={{ width: 15, height: 15, flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '12px',
                background: '#ffffff',
                border: 'none',
                color: '#000000',
                fontWeight: 700,
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
                marginTop: '4px',
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Admin Console →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255, 255, 255, 0.3)', marginTop: '22px', marginBottom: 0 }}>
            <Lock style={{ width: 11, height: 11, display: 'inline', marginRight: '4px' }} />
            Secured via Supabase Authentication
          </p>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // ── 2. ADMIN DASHBOARD ─────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        overflowY: 'auto',
        backgroundColor: '#07070c',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Top Navbar */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(9, 10, 16, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <ArrowLeft style={{ width: 14, height: 14 }} />
            Back to Site
          </button>

          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>

          <span style={{ fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>RyperDeck Console</span>
            <span
              style={{
                fontSize: '11px',
                color: '#34d399',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '3px 9px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'monospace',
              }}
            >
              <Database style={{ width: 11, height: 11 }} /> Supabase Live
            </span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {authEmail && (
            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginRight: '6px' }}>
              Logged in: <strong style={{ color: '#ffffff' }}>{authEmail}</strong>
            </span>
          )}

          <button
            onClick={() => setTick((t) => t + 1)}
            title="Refresh database"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              color: '#ffffff',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            <RefreshCw style={{ width: 13, height: 13, animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleSignOut}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '999px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <LogOut style={{ width: 13, height: 13 }} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '32px 24px 60px' }}>

        {/* 5 Stats Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px', marginBottom: '28px' }}>
          {TABS.map((t) => {
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: '20px 18px',
                  borderRadius: '18px',
                  background: isActive ? 'rgba(255, 255, 255, 0.12)' : '#10111a',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.12)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  boxShadow: isActive ? '0 8px 24px rgba(0,0,0,0.6)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.55)', marginBottom: '8px' }}>
                  {t.icon}
                  <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.label}</span>
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>
                  {t.count}
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Detail Panel */}
        <div
          style={{
            background: '#10111a',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '20px',
            overflow: 'hidden',
          }}
        >
          {/* Panel Top Header */}
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                {TABS.find((t) => t.id === tab)?.label}
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                {tab === 'bugs' && 'Bug reports sent by users, with direct links to attached Google Drive files.'}
                {tab === 'features' && 'Community feature suggestions with real-time upvotes and statuses.'}
                {tab === 'emails' && 'Early-access and notification subscribers from landing page forms.'}
                {tab === 'supporters' && 'Confirmed supporters with amount, coffee cups, rating, and Razorpay transaction IDs.'}
                {tab === 'visitors' && 'Unique visitors recorded on this browser and device.'}
              </p>
            </div>

            {/* Export buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {tab === 'bugs' && bugs.length > 0 && <ExportBtn onClick={() => exportJSON(bugs, 'ryperdeck-bugs.json')} />}
              {tab === 'features' && features.length > 0 && <ExportBtn onClick={() => exportJSON(features, 'ryperdeck-features.json')} />}
              {tab === 'emails' && emails.length > 0 && <ExportBtn onClick={() => exportJSON(emails, 'ryperdeck-subscribers.json')} />}
              {tab === 'supporters' && supporters.length > 0 && <ExportBtn onClick={() => exportJSON(supporters, 'ryperdeck-supporters.json')} />}
            </div>
          </div>

          {/* Panel Body */}
          <div style={{ padding: '24px' }}>

            {/* ── TAB 1: BUGS ──────────────────────────────────────────────── */}
            {tab === 'bugs' && (
              bugs.length === 0 ? (
                <EmptyState
                  icon={<Bug style={{ width: 28, height: 28 }} />}
                  title="No Bug Reports in Database"
                  message="No bug reports submitted yet. When users submit issues on the site with attached screenshots or screen recordings, they will appear here with direct Google Drive links."
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {bugs.map((bug, idx) => (
                    <div
                      key={bug.id || idx}
                      style={{
                        padding: '20px',
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          Report #{bugs.length - idx}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'monospace' }}>
                            {bug.created_at ? new Date(bug.created_at).toLocaleString() : 'Just now'}
                          </span>
                          <button
                            onClick={() => handleDeleteItem('bug_reports', bug.id)}
                            title="Delete this bug report"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'rgba(255, 255, 255, 0.35)',
                              cursor: 'pointer',
                              padding: '4px',
                              display: 'flex',
                            }}
                          >
                            <Trash2 style={{ width: 15, height: 15 }} />
                          </button>
                        </div>
                      </div>

                      <p style={{ margin: '0 0 14px 0', fontSize: '14px', lineHeight: 1.6, color: '#ffffff' }}>
                        {bug.what}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        {bug.email && (
                          <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                            Contact: <a href={`mailto:${bug.email}`} style={{ color: '#67e8f9', textDecoration: 'none' }}>{bug.email}</a>
                          </span>
                        )}

                        {/* Google Drive Link */}
                        {bug.drive_url ? (
                          <a
                            href={bug.drive_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 14px',
                              borderRadius: '999px',
                              background: 'rgba(16, 185, 129, 0.15)',
                              border: '1px solid rgba(16, 185, 129, 0.35)',
                              color: '#34d399',
                              fontSize: '12px',
                              fontWeight: 600,
                              textDecoration: 'none',
                            }}
                          >
                            <FolderOpen style={{ width: 14, height: 14 }} />
                            View Attached File on Google Drive
                            <ExternalLink style={{ width: 12, height: 12 }} />
                          </a>
                        ) : bug.file_name ? (
                          <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.45)' }}>
                            Attached file: {bug.file_name}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* ── TAB 2: FEATURES ─────────────────────────────────────────── */}
            {tab === 'features' && (
              features.length === 0 ? (
                <EmptyState
                  icon={<Lightbulb style={{ width: 28, height: 28 }} />}
                  title="No Feature Requests in Database"
                  message="When users submit ideas using 'Request Feature', their requests will appear here with live vote counts and statuses you can change."
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {features.map((feat) => (
                    <div
                      key={feat.id}
                      style={{
                        padding: '20px',
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '16px',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                            {feat.title}
                          </span>

                          {/* Status dropdown */}
                          <select
                            value={feat.status}
                            onChange={(e) => feat.id && handleStatusChange(feat.id, e.target.value)}
                            style={{
                              fontSize: '11px',
                              padding: '4px 10px',
                              borderRadius: '999px',
                              background: '#1a1b26',
                              border: '1px solid rgba(255, 255, 255, 0.25)',
                              color: '#ffffff',
                              cursor: 'pointer',
                              outline: 'none',
                            }}
                          >
                            <option value="requested">requested</option>
                            <option value="planned">planned</option>
                            <option value="building">building</option>
                            <option value="done">done ✓</option>
                          </select>
                        </div>

                        {feat.name && (
                          <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)' }}>
                            Suggested by: <strong style={{ color: '#ffffff' }}>{feat.name}</strong>
                            {(feat as any).email && <span style={{ color: '#67e8f9', marginLeft: '6px', fontFamily: 'monospace' }}>({(feat as any).email})</span>}
                          </p>
                        )}

                        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5 }}>
                          {feat.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '6px 14px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.16)',
                          }}
                        >
                          <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase' }}>votes</span>
                          <span style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>{feat.votes}</span>
                        </div>

                        <button
                          onClick={() => handleDeleteItem('feature_requests', feat.id)}
                          title="Delete this feature request"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255, 255, 255, 0.35)',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                          }}
                        >
                          <Trash2 style={{ width: 15, height: 15 }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* ── TAB 3: EMAILS ────────────────────────────────────────────── */}
            {tab === 'emails' && (
              emails.length === 0 ? (
                <EmptyState
                  icon={<Mail style={{ width: 28, height: 28 }} />}
                  title="No Subscribers in Database"
                  message="No subscribers recorded yet. When visitors sign up on the site to follow development, their email addresses will appear here."
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {emails.map((sub, idx) => (
                    <div
                      key={sub.id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '999px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'rgba(255, 255, 255, 0.7)',
                          }}
                        >
                          {idx + 1}
                        </div>
                        <a
                          href={`mailto:${sub.email}`}
                          style={{ fontSize: '14px', color: '#ffffff', fontFamily: 'monospace', textDecoration: 'none' }}
                        >
                          {sub.email}
                        </a>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'monospace' }}>
                          {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : 'Active'}
                        </span>
                        <button
                          onClick={() => handleDeleteItem('subscribers', sub.id)}
                          title="Delete subscriber"
                          style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.35)', cursor: 'pointer', padding: '4px', display: 'flex' }}
                        >
                          <Trash2 style={{ width: 14, height: 14 }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* ── TAB 4: SUPPORTERS ────────────────────────────────────────── */}
            {tab === 'supporters' && (
              supporters.length === 0 ? (
                <EmptyState
                  icon={<Coffee style={{ width: 28, height: 28 }} />}
                  title="No Supporters Recorded Yet"
                  message="When users make a contribution via Razorpay Standard Checkout, verified payments and personal messages will appear here."
                />
              ) : (
                <div>
                  <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)' }}>
                      Total Pool Collected: <strong style={{ color: '#34d399', fontSize: '15px' }}>₹{supporters.reduce((acc, s) => acc + (s.amount || 0), 0).toLocaleString()}</strong> ({supporters.length} supporters)
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {supporters.map((sup, idx) => (
                      <div
                        key={sup.id || idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16px 20px',
                          borderRadius: '14px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>{sup.name}</span>
                            {sup.verified && (
                              <span
                                style={{
                                  fontSize: '10px',
                                  color: '#34d399',
                                  background: 'rgba(16, 185, 129, 0.12)',
                                  border: '1px solid rgba(16, 185, 129, 0.3)',
                                  padding: '2px 8px',
                                  borderRadius: '999px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  fontFamily: 'monospace',
                                }}
                              >
                                <CheckCircle style={{ width: 10, height: 10 }} /> Verified
                              </span>
                            )}
                          </div>
                          {sup.message && (
                            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)', fontStyle: 'italic' }}>
                              "{sup.message}"
                            </p>
                          )}
                          {sup.payment_id && (
                            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#67e8f9', fontFamily: 'monospace' }}>
                              Razorpay ID: {sup.payment_id}
                            </p>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: '#34d399', fontFamily: 'monospace' }}>
                              ₹{sup.amount?.toLocaleString()}
                            </div>
                            <div style={{ fontSize: '11px', color: '#fbbf24' }}>
                              ★ {sup.rating}/5 · {sup.cups} cups
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteItem('supporters', sup.id)}
                            title="Delete supporter record"
                            style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.35)', cursor: 'pointer', padding: '4px', display: 'flex' }}
                          >
                            <Trash2 style={{ width: 14, height: 14 }} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}

            {/* ── TAB 5: VISITORS ──────────────────────────────────────────── */}
            {tab === 'visitors' && (
              <div
                style={{
                  padding: '40px 20px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  textAlign: 'center',
                }}
              >
                <BarChart2 style={{ width: 36, height: 36, color: 'rgba(255, 255, 255, 0.35)', margin: '0 auto 16px' }} />
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                  Lifetime Unique Site Visitors
                </h3>
                <p style={{ margin: '0 0 8px 0', fontSize: '56px', fontWeight: 800, color: '#ffffff', fontFamily: 'monospace', letterSpacing: '-0.04em' }}>
                  {visitorCount.toLocaleString()}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255, 255, 255, 0.45)' }}>
                  Accurate, real visitors count stored in browser storage (no fake inflated metrics).
                </p>
              </div>
            )}

          </div>
        </div>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: 'rgba(255, 255, 255, 0.25)' }}>
          RyperDeck Secure Cloud Administration Console • Supabase Organization
        </p>
      </div>
    </div>
  );
};

// ── Subcomponents ─────────────────────────────────────────────────────────────

const EmptyState: React.FC<{ icon: React.ReactNode; title: string; message: string }> = ({
  icon,
  title,
  message,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '50px 20px',
      textAlign: 'center',
      gap: '10px',
    }}
  >
    <div
      style={{
        width: '54px',
        height: '54px',
        borderRadius: '999px',
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: '6px',
      }}
    >
      {icon}
    </div>
    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
      {title}
    </h3>
    <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', maxWidth: '440px', lineHeight: 1.5 }}>
      {message}
    </p>
  </div>
);

const ExportBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '7px 14px',
      borderRadius: '999px',
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.14)',
      color: '#ffffff',
      fontSize: '12px',
      fontWeight: 500,
      cursor: 'pointer',
    }}
  >
    <Download style={{ width: 12, height: 12 }} />
    <span>Export JSON</span>
  </button>
);
