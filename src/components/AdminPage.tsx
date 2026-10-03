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
  Plus,
  Edit2,
  Check,
  X as XIcon,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import {
  supabase,
  isSupabaseConfigured,
  fetchSubscribers,
  fetchBugReports,
  fetchFeatureRequests,
  fetchSupporters,
  setFeatureStatus,
  updateFeatureRequest,
  createFeatureRequestByAdmin,
  createSupporterByAdmin,
  updateSupporter,
  setSupporterVerified,
  deleteRecord,
  fetchGlobalVisitorsFromDb,
  updateGlobalVisitorsInDb,
  SITE_STATS_SQL,
  DbSubscriber,
  DbBugReport,
  DbFeatureRequest,
  DbSupporter,
} from '../lib/supabase';
import { syncSupportersFromSupabase, clearLocalSupporters } from '../config/kofi';


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

  // Mobile detection
  const [isMobile, setIsMobile]     = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Live Data States
  const [emails, setEmails]         = useState<DbSubscriber[]>([]);
  const [bugs, setBugs]             = useState<DbBugReport[]>([]);
  const [features, setFeatures]     = useState<DbFeatureRequest[]>([]);
  const [supporters, setSupporters] = useState<DbSupporter[]>([]);
  const [visitorCount, setVisitorCount] = useState<number>(1);
  const [authEmail, setAuthEmail]   = useState<string | null>(null);

  // Feature Request Management State
  const [editFeatureId, setEditFeatureId] = useState<string | null>(null);
  const [editTitle, setEditTitle]         = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus]       = useState('requested');
  const [editVotes, setEditVotes]         = useState(1);
  const [savingFeature, setSavingFeature] = useState(false);

  // Add Feature Modal / Card State
  const [showAddFeature, setShowAddFeature] = useState(false);
  const [newTitle, setNewTitle]             = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setNewStatus]           = useState('planned');
  const [newVotes, setNewVotes]             = useState(5);
  const [addingFeature, setAddingFeature]   = useState(false);

  // Supporter Management State
  const [showAddSupporter, setShowAddSupporter] = useState(false);
  const [newSupName, setNewSupName]             = useState('');
  const [newSupAmount, setNewSupAmount]         = useState('100');
  const [newSupCups, setNewSupCups]             = useState('2');
  const [newSupRating, setNewSupRating]         = useState(5);
  const [newSupMessage, setNewSupMessage]       = useState('');
  const [newSupRef, setNewSupRef]               = useState('');
  const [newSupVerified, setNewSupVerified]     = useState(true);
  const [addingSupporter, setAddingSupporter]   = useState(false);
  const [supporterFilter, setSupporterFilter]   = useState<'all' | 'pending' | 'verified'>('all');
  const [copiedWebhook, setCopiedWebhook]       = useState(false);
  const [showWebhookGuide, setShowWebhookGuide] = useState(false);

  // Supporter Inline Edit State
  const [editSupporterId, setEditSupporterId]   = useState<string | null>(null);
  const [editSupName, setEditSupName]           = useState('');
  const [editSupAmount, setEditSupAmount]       = useState('100');
  const [editSupCups, setEditSupCups]           = useState('2');
  const [editSupRating, setEditSupRating]       = useState(5);
  const [editSupMessage, setEditSupMessage]     = useState('');
  const [editSupRef, setEditSupRef]             = useState('');
  const [editSupVerified, setEditSupVerified]   = useState(true);
  const [savingSupporter, setSavingSupporter]   = useState(false);

  // Visitor Management State
  const [isDbVisitor, setIsDbVisitor]           = useState(false);
  const [editVisitorVal, setEditVisitorVal]     = useState('');
  const [savingVisitor, setSavingVisitor]       = useState(false);
  const [copiedVisitorSql, setCopiedVisitorSql] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Always require fresh authentication when opening the Admin Panel — no auto-login & strict noindex
  useEffect(() => {
    setAuthed(false);
    const metaRobots = document.querySelector('meta[name="robots"]');
    const originalRobots = metaRobots?.getAttribute('content') || 'index, follow';
    metaRobots?.setAttribute('content', 'noindex, nofollow, noarchive');

    return () => {
      metaRobots?.setAttribute('content', originalRobots);
      if (supabase) {
        supabase.auth.signOut().catch(() => {});
      }
    };
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
      fetchGlobalVisitorsFromDb(),
    ])
      .then(([subList, bugList, featList, supList, visData]) => {
        setEmails(subList);
        setBugs(bugList);
        setFeatures(featList);
        setSupporters(supList);
        setVisitorCount(visData.count);
        setIsDbVisitor(visData.isDb);
        setEditVisitorVal(String(visData.count));
      })
      .catch((err) => {
        console.error('Error loading dashboard data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [authed, tick]);

  // Handle Login — Strictly server-side Supabase verification, zero client credentials
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

    if (!supabase) {
      setError('Authentication service is not configured.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: emailTrimmed,
        password: pwTrimmed,
      });

      if (authError || !data.session) {
        setError(authError?.message || 'Invalid email or password.');
        setLoading(false);
        return;
      }

      setAuthed(true);
      setAuthEmail(data.user?.email || emailTrimmed);
      setLoading(false);
      if (containerRef.current) containerRef.current.scrollTop = 0;
    } catch (err: any) {
      setError(err?.message || 'Authentication error.');
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    setAuthed(false);
    setAuthEmail(null);
    setPw('');
    setAdminEmail('');
  };

  const handleExit = async () => {
    await handleSignOut();
    onBack();
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

  // Start editing a feature request
  const handleStartEditFeature = (feat: DbFeatureRequest) => {
    setEditFeatureId(feat.id || null);
    setEditTitle(feat.title);
    setEditDescription(feat.description || '');
    setEditStatus(feat.status);
    setEditVotes(feat.votes || 1);
  };

  // Save edited feature request
  const handleSaveEditFeature = async () => {
    if (!editFeatureId) return;
    setSavingFeature(true);
    await updateFeatureRequest(editFeatureId, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      status: editStatus,
      votes: Number(editVotes),
    });
    setSavingFeature(false);
    setEditFeatureId(null);
    setTick((t) => t + 1);
  };

  // Quick adjust votes (+1 or -1)
  const handleAdjustVotes = async (id: string, currentVotes: number, delta: number) => {
    const nextVotes = Math.max(0, currentVotes + delta);
    await updateFeatureRequest(id, { votes: nextVotes });
    setTick((t) => t + 1);
  };

  // Create new feature request
  const handleCreateFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAddingFeature(true);
    await createFeatureRequestByAdmin({
      title: newTitle.trim(),
      description: newDescription.trim(),
      status: newStatus,
      votes: Number(newVotes) || 1,
    });
    setAddingFeature(false);
    setShowAddFeature(false);
    setNewTitle('');
    setNewDescription('');
    setNewStatus('planned');
    setNewVotes(5);
    setTick((t) => t + 1);
  };

  // Supporter Management Handlers
  const handleStartEditSupporter = (sup: DbSupporter) => {
    setEditSupporterId(sup.id || null);
    setEditSupName(sup.name);
    setEditSupAmount(String(sup.amount || 50));
    setEditSupCups(String(sup.cups || 1));
    setEditSupRating(sup.rating || 5);
    setEditSupMessage(sup.message || '');
    setEditSupRef(sup.payment_id || '');
    setEditSupVerified(sup.verified ?? true);
  };

  const handleSaveEditSupporter = async () => {
    if (!editSupporterId) return;
    setSavingSupporter(true);
    await updateSupporter(editSupporterId, {
      name: editSupName.trim() || 'Anonymous Supporter',
      amount: Number(editSupAmount) || 50,
      cups: Number(editSupCups) || 1,
      rating: Number(editSupRating) || 5,
      message: editSupMessage.trim() || undefined,
      payment_id: editSupRef.trim() || undefined,
      verified: editSupVerified,
    });
    await syncSupportersFromSupabase();
    setSavingSupporter(false);
    setEditSupporterId(null);
    setTick((t) => t + 1);
  };

  const handleToggleVerified = async (id?: string, current = true) => {
    if (!id) return;
    const nextState = !current;
    setSupporters((prev) =>
      prev.map((s) => (s.id === id ? { ...s, verified: nextState } : s))
    );
    await setSupporterVerified(id, nextState);
    await syncSupportersFromSupabase();
    setTick((t) => t + 1);
  };

  const handleCreateSupporter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName.trim()) return;
    setAddingSupporter(true);
    await createSupporterByAdmin({
      name: newSupName.trim(),
      amount: Number(newSupAmount) || 50,
      cups: Number(newSupCups) || Math.max(1, Math.round(Number(newSupAmount) / 50)),
      rating: Number(newSupRating) || 5,
      message: newSupMessage.trim() || undefined,
      payment_id: newSupRef.trim() || undefined,
      verified: newSupVerified,
    });
    await syncSupportersFromSupabase();
    setAddingSupporter(false);
    setShowAddSupporter(false);
    setNewSupName('');
    setNewSupMessage('');
    setNewSupRef('');
    setTick((t) => t + 1);
  };

  const handleClearLocalCache = async () => {
    if (window.confirm('Clear local supporter cache and refresh live from Supabase database?')) {
      clearLocalSupporters();
      await syncSupportersFromSupabase();
      setTick((t) => t + 1);
    }
  };

  const handleSaveVisitorCount = async () => {
    const val = parseInt(editVisitorVal, 10);
    if (isNaN(val) || val < 0) return;
    setSavingVisitor(true);
    await updateGlobalVisitorsInDb(val);
    setVisitorCount(val);
    setSavingVisitor(false);
    alert('Visitor count updated successfully!');
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
  // ── 1. CLEAN SECURE LOGIN SCREEN (MOBILE-OPTIMIZED) ─────────────────────────
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
          padding: isMobile ? '16px' : '24px',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#ffffff',
        }}
      >
        {/* Back to site */}
        <button
          onClick={handleExit}
          style={{
            position: 'absolute',
            top: isMobile ? '16px' : '24px',
            left: isMobile ? '16px' : '24px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          <ArrowLeft style={{ width: 15, height: 15 }} />
          <span>Exit to Site</span>
        </button>

        {/* Login Box */}
        <div
          style={{
            width: '100%',
            maxWidth: isMobile ? '100%' : '440px',
            background: '#0d0e15',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: isMobile ? '24px' : '28px',
            padding: isMobile ? '32px 20px' : '44px 36px',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                width: isMobile ? '48px' : '56px',
                height: isMobile ? '48px' : '56px',
                borderRadius: '18px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }}
            >
              <Shield style={{ width: isMobile ? 22 : 26, height: isMobile ? 22 : 26 }} />
            </div>

            <h1 style={{ fontSize: isMobile ? '20px' : '22px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
              RyperDeck Console
            </h1>
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', margin: 0, lineHeight: 1.4 }}>
              Sign in with your admin credentials
            </p>
          </div>

          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '13px',
                marginBottom: '20px',
              }}
            >
              <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} noValidate autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
                Admin Email
              </label>
              <input
                type="email"
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="Enter admin email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value.replace(',', '.'))}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Enter admin password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                  }}
                >
                  {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '8px',
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                background: '#ffffff',
                border: 'none',
                color: '#000000',
                fontSize: '14px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 16px rgba(255, 255, 255, 0.2)',
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Console'}
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.35)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Lock style={{ width: 10, height: 10 }} /> 256-bit Encrypted Session
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // ── 2. MAIN ADMIN CONSOLE (FULLY RESPONSIVE & MOBILE-OPTIMIZED) ────────────
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
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#ffffff',
      }}
    >
      {/* Top Navbar */}
      <div
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(10, 11, 18, 0.95)',
          backdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          padding: isMobile ? '12px 14px' : '14px 28px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center',
          justifyContent: 'space-between',
          gap: isMobile ? '10px' : '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleExit}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
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
              Site
            </button>

            <span style={{ fontSize: isMobile ? '14px' : '15px', fontWeight: 700 }}>
              RyperDeck Console
            </span>
          </div>

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
              gap: '4px',
              fontFamily: 'monospace',
            }}
          >
            <Database style={{ width: 10, height: 10 }} /> Live
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'space-between' : 'flex-end', gap: '8px' }}>
          {!isMobile && (
            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginRight: '6px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Shield style={{ width: 12, height: 12, color: '#34d399' }} />
                <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '11px', fontFamily: 'monospace' }}>Admin Session</span>
              </span>
            </span>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setTick((t) => t + 1)}
              title="Refresh database"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
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
              onClick={handleExit}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
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
              <span>Log Out & Exit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1060px', margin: '0 auto', padding: isMobile ? '16px 12px 60px' : '28px 24px 60px' }}>

        {/* 5 Stats Cards Grid (Responsive 2-col on mobile) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: isMobile ? '8px' : '14px',
            marginBottom: '20px',
          }}
        >
          {TABS.map((t) => {
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: isMobile ? '14px 12px' : '18px 16px',
                  borderRadius: '16px',
                  background: isActive ? 'rgba(255, 255, 255, 0.12)' : '#10111a',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.12)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  boxShadow: isActive ? '0 8px 24px rgba(0,0,0,0.6)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.55)', marginBottom: '6px' }}>
                  {t.icon}
                  <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.label}</span>
                </div>
                <div style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>
                  {t.count}
                </div>
              </button>
            );
          })}
        </div>

        {/* Horizontal Mobile Tabs Swipe Bar */}
        {isMobile && (
          <div
            style={{
              display: 'flex',
              overflowX: 'auto',
              gap: '6px',
              paddingBottom: '12px',
              marginBottom: '12px',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
            }}
          >
            {TABS.map((t) => {
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    padding: '8px 14px',
                    borderRadius: '999px',
                    background: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: isActive ? '#000000' : 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  {t.label} ({t.count})
                </button>
              );
            })}
          </div>
        )}

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
              padding: isMobile ? '16px' : '20px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: isMobile ? '16px' : '18px', fontWeight: 700, color: '#ffffff' }}>
                {TABS.find((t) => t.id === tab)?.label}
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                {tab === 'bugs' && 'Bug reports sent by users, with direct links to attached Google Drive files.'}
                {tab === 'features' && 'Manage roadmap, community requests, statuses, and adjust live upvotes.'}
                {tab === 'emails' && 'Early-access and notification subscribers from landing page forms.'}
                {tab === 'supporters' && 'Confirmed supporters with amount, coffee cups, rating, and Ko-fi / contribution references.'}
                {tab === 'visitors' && 'Unique visitors recorded on this browser and device.'}
              </p>
            </div>

            {/* Action buttons on header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {tab === 'features' && (
                <button
                  onClick={() => setShowAddFeature(!showAddFeature)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    borderRadius: '999px',
                    background: '#ffffff',
                    border: 'none',
                    color: '#000000',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Plus style={{ width: 14, height: 14 }} />
                  <span>Add Feature</span>
                </button>
              )}

              {tab === 'supporters' && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setShowAddSupporter(!showAddSupporter)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 14px',
                      borderRadius: '999px',
                      background: '#fbbf24',
                      border: 'none',
                      color: '#000000',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Plus style={{ width: 14, height: 14 }} />
                    <span>Add Supporter</span>
                  </button>

                  <button
                    onClick={handleClearLocalCache}
                    title="Purge stale local cache and sync live from database"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '7px 12px',
                      borderRadius: '999px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    <RefreshCw style={{ width: 12, height: 12 }} />
                    <span>Purge Cache</span>
                  </button>
                </div>
              )}

              {tab === 'bugs' && bugs.length > 0 && <ExportBtn onClick={() => exportJSON(bugs, 'ryperdeck-bugs.json')} />}
              {tab === 'features' && features.length > 0 && <ExportBtn onClick={() => exportJSON(features, 'ryperdeck-features.json')} />}
              {tab === 'emails' && emails.length > 0 && <ExportBtn onClick={() => exportJSON(emails, 'ryperdeck-subscribers.json')} />}
              {tab === 'supporters' && supporters.length > 0 && <ExportBtn onClick={() => exportJSON(supporters, 'ryperdeck-supporters.json')} />}
            </div>
          </div>

          {/* New Feature Creator Form */}
          {tab === 'features' && showAddFeature && (
            <div
              style={{
                padding: isMobile ? '16px' : '20px 24px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700, color: '#34d399' }}>
                + Add New Feature / Roadmap Item
              </h3>
              <form onSubmit={handleCreateFeature} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <input
                    type="text"
                    placeholder="Feature title (e.g. OBS Studio Scene Switcher)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: '#1a1b26',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Detailed description of the feature..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: '#1a1b26',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>Status:</span>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: '#1a1b26',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        fontSize: '12px',
                      }}
                    >
                      <option value="requested">requested</option>
                      <option value="planned">planned</option>
                      <option value="building">building</option>
                      <option value="done">done ✓</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>Votes:</span>
                    <input
                      type="number"
                      min={0}
                      value={newVotes}
                      onChange={(e) => setNewVotes(parseInt(e.target.value, 10) || 0)}
                      style={{
                        width: '70px',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: '#1a1b26',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        fontSize: '12px',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginLeft: isMobile ? '0' : 'auto' }}>
                    <button
                      type="submit"
                      disabled={addingFeature}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '8px',
                        background: '#34d399',
                        border: 'none',
                        color: '#000000',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {addingFeature ? 'Saving...' : 'Save Item'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddFeature(false)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Panel Body */}
          <div style={{ padding: isMobile ? '14px' : '24px' }}>

            {/* ── TAB 1: BUGS ──────────────────────────────────────────────── */}
            {tab === 'bugs' && (
              bugs.length === 0 ? (
                <EmptyState
                  icon={<Bug style={{ width: 28, height: 28 }} />}
                  title="No Bug Reports Yet"
                  message="When users encounter issues and click 'Report a Bug', their submissions with system logs and uploaded screenshots will appear here."
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {bugs.map((bug) => (
                    <div
                      key={bug.id}
                      style={{
                        padding: isMobile ? '14px' : '18px 20px',
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontSize: isMobile ? '14px' : '15px', fontWeight: 600, color: '#ffffff', lineHeight: 1.5 }}>
                            {bug.what}
                          </p>

                          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', marginTop: '6px' }}>
                            {bug.created_at ? new Date(bug.created_at).toLocaleDateString() : 'Recent'}
                            {bug.email && <span style={{ color: '#67e8f9', marginLeft: '6px' }}>• {bug.email}</span>}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteItem('bug_reports', bug.id)}
                          title="Delete bug report"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255, 255, 255, 0.3)',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            flexShrink: 0,
                          }}
                        >
                          <Trash2 style={{ width: 15, height: 15 }} />
                        </button>
                      </div>

                      {/* Google Drive attachment link */}
                      <div style={{ marginTop: '10px' }}>
                        {bug.drive_url ? (
                          <a
                            href={bug.drive_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              background: 'rgba(16, 185, 129, 0.15)',
                              border: '1px solid rgba(16, 185, 129, 0.35)',
                              color: '#34d399',
                              fontSize: '12px',
                              fontWeight: 600,
                              textDecoration: 'none',
                              maxWidth: '100%',
                              wordBreak: 'break-all',
                            }}
                          >
                            <FolderOpen style={{ width: 14, height: 14, flexShrink: 0 }} />
                            <span>View Attached File on Google Drive</span>
                            <ExternalLink style={{ width: 12, height: 12, flexShrink: 0 }} />
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

            {/* ── TAB 2: FEATURES (WITH FULL MANAGEMENT & INLINE EDITING) ──── */}
            {tab === 'features' && (
              features.length === 0 ? (
                <EmptyState
                  icon={<Lightbulb style={{ width: 28, height: 28 }} />}
                  title="No Feature Requests Yet"
                  message="Use the '+ Add Feature' button above to create roadmap items, or wait for visitors to submit ideas."
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {features.map((feat) => {
                    const isEditing = editFeatureId === feat.id;

                    if (isEditing) {
                      return (
                        <div
                          key={feat.id}
                          style={{
                            padding: isMobile ? '14px' : '18px 20px',
                            borderRadius: '16px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid #34d399',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                          }}
                        >
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#34d399' }}>
                            Editing Feature: {feat.title}
                          </div>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              background: '#1a1b26',
                              border: '1px solid rgba(255, 255, 255, 0.25)',
                              color: '#ffffff',
                              fontSize: '14px',
                            }}
                          />
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            rows={3}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              background: '#1a1b26',
                              border: '1px solid rgba(255, 255, 255, 0.25)',
                              color: '#ffffff',
                              fontSize: '13px',
                              resize: 'vertical',
                            }}
                          />
                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>Status:</span>
                              <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  background: '#1a1b26',
                                  border: '1px solid rgba(255, 255, 255, 0.25)',
                                  color: '#ffffff',
                                  fontSize: '12px',
                                }}
                              >
                                <option value="requested">requested</option>
                                <option value="planned">planned</option>
                                <option value="building">building</option>
                                <option value="done">done ✓</option>
                              </select>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>Votes:</span>
                              <input
                                type="number"
                                min={0}
                                value={editVotes}
                                onChange={(e) => setEditVotes(parseInt(e.target.value, 10) || 0)}
                                style={{
                                  width: '65px',
                                  padding: '5px 8px',
                                  borderRadius: '6px',
                                  background: '#1a1b26',
                                  border: '1px solid rgba(255, 255, 255, 0.25)',
                                  color: '#ffffff',
                                  fontSize: '12px',
                                }}
                              />
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginLeft: isMobile ? '0' : 'auto' }}>
                              <button
                                onClick={handleSaveEditFeature}
                                disabled={savingFeature}
                                style={{
                                  padding: '6px 14px',
                                  borderRadius: '6px',
                                  background: '#34d399',
                                  border: 'none',
                                  color: '#000000',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                              >
                                {savingFeature ? 'Saving...' : 'Save Changes'}
                              </button>
                              <button
                                onClick={() => setEditFeatureId(null)}
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  background: 'rgba(255, 255, 255, 0.1)',
                                  border: 'none',
                                  color: '#ffffff',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={feat.id}
                        style={{
                          padding: isMobile ? '14px' : '18px 20px',
                          borderRadius: '16px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          display: 'flex',
                          flexDirection: isMobile ? 'column' : 'row',
                          alignItems: isMobile ? 'stretch' : 'flex-start',
                          justifyContent: 'space-between',
                          gap: isMobile ? '12px' : '16px',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                            <span style={{ fontSize: isMobile ? '14px' : '15px', fontWeight: 700, color: '#ffffff' }}>
                              {feat.title}
                            </span>

                            {/* Status dropdown */}
                            <select
                              value={feat.status}
                              onChange={(e) => feat.id && handleStatusChange(feat.id, e.target.value)}
                              style={{
                                fontSize: '11px',
                                padding: '3px 8px',
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
                              Author: <strong style={{ color: '#ffffff' }}>{feat.name}</strong>
                              {(feat as any).email && <span style={{ color: '#67e8f9', marginLeft: '6px', fontFamily: 'monospace' }}>({(feat as any).email})</span>}
                            </p>
                          )}

                          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5 }}>
                            {feat.description}
                          </p>
                        </div>

                        {/* Actions row: Votes, Edit, Delete */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isMobile ? 'space-between' : 'flex-end',
                            gap: '10px',
                            borderTop: isMobile ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                            paddingTop: isMobile ? '10px' : 0,
                          }}
                        >
                          {/* Vote badge & quick adjustment buttons */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '4px 10px',
                                borderRadius: '10px',
                                background: 'rgba(255, 255, 255, 0.08)',
                                border: '1px solid rgba(255, 255, 255, 0.16)',
                              }}
                            >
                              <span style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase' }}>votes</span>
                              <span style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>{feat.votes}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <button
                                onClick={() => feat.id && handleAdjustVotes(feat.id, feat.votes, 1)}
                                title="Increase vote count by 1"
                                style={{
                                  background: 'rgba(255, 255, 255, 0.06)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  borderRadius: '4px',
                                  color: '#34d399',
                                  cursor: 'pointer',
                                  padding: '1px 3px',
                                  display: 'flex',
                                }}
                              >
                                <ChevronUp style={{ width: 12, height: 12 }} />
                              </button>
                              <button
                                onClick={() => feat.id && handleAdjustVotes(feat.id, feat.votes, -1)}
                                title="Decrease vote count by 1"
                                style={{
                                  background: 'rgba(255, 255, 255, 0.06)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  borderRadius: '4px',
                                  color: '#f87171',
                                  cursor: 'pointer',
                                  padding: '1px 3px',
                                  display: 'flex',
                                }}
                              >
                                <ChevronDown style={{ width: 12, height: 12 }} />
                              </button>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              onClick={() => handleStartEditFeature(feat)}
                              title="Edit feature details"
                              style={{
                                background: 'rgba(255, 255, 255, 0.08)',
                                border: '1px solid rgba(255, 255, 255, 0.14)',
                                borderRadius: '8px',
                                color: '#ffffff',
                                cursor: 'pointer',
                                padding: '6px 10px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '11px',
                                fontWeight: 600,
                              }}
                            >
                              <Edit2 style={{ width: 12, height: 12 }} />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => handleDeleteItem('feature_requests', feat.id)}
                              title="Delete this feature request"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'rgba(255, 255, 255, 0.3)',
                                cursor: 'pointer',
                                padding: '6px',
                                display: 'flex',
                              }}
                            >
                              <Trash2 style={{ width: 15, height: 15 }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* ── TAB 3: EMAILS ────────────────────────────────────────────── */}
            {tab === 'emails' && (
              emails.length === 0 ? (
                <EmptyState
                  icon={<Mail style={{ width: 28, height: 28 }} />}
                  title="No Subscribers Yet"
                  message="When visitors sign up on the site to follow updates, their email addresses will appear here."
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
                        padding: isMobile ? '12px 14px' : '14px 18px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Mail style={{ width: 15, height: 15, color: '#34d399', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: 600, color: '#ffffff', wordBreak: 'break-all' }}>
                            {sub.email}
                          </div>
                          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)' }}>
                            Subscribed {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : ''}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteItem('subscribers', sub.id)}
                        title="Delete subscriber"
                        style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.3)', cursor: 'pointer', padding: '4px', display: 'flex' }}
                      >
                        <Trash2 style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* ── TAB 4: SUPPORTERS (WITH FULL MANAGEMENT & INLINE EDITING) ── */}
            {tab === 'supporters' && (
              <div>
                {/* Add Supporter Form */}
                {showAddSupporter && (
                  <form
                    onSubmit={handleCreateSupporter}
                    style={{
                      padding: isMobile ? '16px' : '20px',
                      borderRadius: '16px',
                      background: 'rgba(251, 191, 36, 0.05)',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                      marginBottom: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#fbbf24' }}>
                        + Add Supporter / Ko-fi Donation
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAddSupporter(false)}
                        style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.4)', cursor: 'pointer' }}
                      >
                        <XIcon style={{ width: 16, height: 16 }} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr', gap: '10px' }}>
                      <input
                        type="text"
                        required
                        placeholder="Supporter Name (e.g. Alex Rivera)"
                        value={newSupName}
                        onChange={(e) => setNewSupName(e.target.value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: '#1a1b26',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#ffffff',
                          fontSize: '13px',
                        }}
                      />

                      <input
                        type="number"
                        placeholder="Amount (₹)"
                        value={newSupAmount}
                        onChange={(e) => {
                          setNewSupAmount(e.target.value);
                          const amt = Number(e.target.value) || 0;
                          setNewSupCups(String(Math.max(1, Math.round(amt / 50))));
                        }}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: '#1a1b26',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#ffffff',
                          fontSize: '13px',
                        }}
                      />

                      <input
                        type="number"
                        placeholder="Cups"
                        value={newSupCups}
                        onChange={(e) => setNewSupCups(e.target.value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: '#1a1b26',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#ffffff',
                          fontSize: '13px',
                        }}
                      />

                      <select
                        value={newSupRating}
                        onChange={(e) => setNewSupRating(Number(e.target.value))}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: '#1a1b26',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#ffffff',
                          fontSize: '13px',
                        }}
                      >
                        <option value={5}>★ 5 Stars</option>
                        <option value={4}>★ 4 Stars</option>
                        <option value={3}>★ 3 Stars</option>
                        <option value={2}>★ 2 Stars</option>
                        <option value={1}>★ 1 Star</option>
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Review / Message (Optional)"
                        value={newSupMessage}
                        onChange={(e) => setNewSupMessage(e.target.value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: '#1a1b26',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#ffffff',
                          fontSize: '13px',
                        }}
                      />

                      <input
                        type="text"
                        placeholder="Ko-fi Ref / Note (Optional)"
                        value={newSupRef}
                        onChange={(e) => setNewSupRef(e.target.value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: '#1a1b26',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#ffffff',
                          fontSize: '13px',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={newSupVerified}
                          onChange={(e) => setNewSupVerified(e.target.checked)}
                        />
                        <span>Verified Supporter (shows on Leaderboard immediately)</span>
                      </label>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setShowAddSupporter(false)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: 'none',
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={addingSupporter}
                          style={{
                            padding: '6px 18px',
                            borderRadius: '8px',
                            background: '#fbbf24',
                            border: 'none',
                            color: '#000000',
                            fontWeight: 700,
                            fontSize: '12px',
                            cursor: 'pointer',
                            opacity: addingSupporter ? 0.6 : 1,
                          }}
                        >
                          {addingSupporter ? 'Adding...' : 'Save Supporter'}
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Pool Stats, Ko-fi Ledger Link & Verification Filter Tabs */}
                {(() => {
                  const verifiedSupporters = supporters.filter((s) => s.verified === true);
                  const pendingSupporters = supporters.filter((s) => s.verified !== true);
                  const displayedSupporters =
                    supporterFilter === 'pending'
                      ? pendingSupporters
                      : supporterFilter === 'verified'
                      ? verifiedSupporters
                      : supporters;

                  return (
                    <div>
                      {/* Top Summary Bar */}
                      <div
                        style={{
                          marginBottom: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '12px',
                        }}
                      >
                        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)' }}>
                          Verified Pool Collected:{' '}
                          <strong style={{ color: '#34d399', fontSize: '15px' }}>
                            ₹{verifiedSupporters.reduce((acc, s) => acc + (Number(s.amount) || 0), 0).toLocaleString()}
                          </strong>{' '}
                          ({verifiedSupporters.length} verified / {supporters.length} total)
                        </p>

                        {/* Direct link to Ko-fi creator donations dashboard */}
                        <a
                          href="https://ko-fi.com/manage/donations"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            borderRadius: '999px',
                            background: 'rgba(251, 191, 36, 0.12)',
                            border: '1px solid rgba(251, 191, 36, 0.35)',
                            color: '#fbbf24',
                            fontSize: '12px',
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          ☕ Check Ko-fi Creator Ledger ↗
                        </a>
                      </div>

                      {/* Automated Ko-fi Webhook Quick Setup Banner */}
                      <div
                        style={{
                          marginBottom: '16px',
                          padding: '14px 16px',
                          borderRadius: '12px',
                          background: 'rgba(56, 189, 248, 0.06)',
                          border: '1px solid rgba(56, 189, 248, 0.25)',
                          display: 'flex',
                          flexDirection: isMobile ? 'column' : 'row',
                          alignItems: isMobile ? 'flex-start' : 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8' }}>
                              ⚡ Instant Auto-Verification
                            </span>
                            <span
                              style={{
                                fontSize: '10px',
                                padding: '2px 8px',
                                borderRadius: '999px',
                                background: 'rgba(16, 185, 129, 0.15)',
                                color: '#34d399',
                                fontFamily: 'monospace',
                              }}
                            >
                              Active
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.4 }}>
                            Webhook URL: <code style={{ color: '#38bdf8', fontFamily: 'monospace' }}>https://ryperdeck.vercel.app/api/kofi-webhook</code>
                            <span style={{ marginLeft: '8px', color: '#34d399', fontSize: '11px', fontFamily: 'monospace' }}>• Token: c7bf...1df8 (Secured ✓)</span>
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('https://ryperdeck.vercel.app/api/kofi-webhook');
                              setCopiedWebhook(true);
                              setTimeout(() => setCopiedWebhook(false), 2500);
                            }}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              background: copiedWebhook ? '#34d399' : 'rgba(56, 189, 248, 0.15)',
                              border: '1px solid rgba(56, 189, 248, 0.35)',
                              color: copiedWebhook ? '#000000' : '#38bdf8',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            {copiedWebhook ? '✓ Copied URL!' : 'Copy Webhook URL'}
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowWebhookGuide(!showWebhookGuide)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '8px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '11px',
                              cursor: 'pointer',
                            }}
                          >
                            {showWebhookGuide ? 'Hide Guide' : 'Setup Guide (30s)'}
                          </button>
                        </div>
                      </div>

                      {showWebhookGuide && (
                        <div
                          style={{
                            marginBottom: '16px',
                            padding: '14px 16px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.75)',
                            lineHeight: 1.6,
                          }}
                        >
                          <strong style={{ color: '#ffffff', display: 'block', marginBottom: '6px' }}>
                            How to enable real-time automatic verification:
                          </strong>
                          <ol style={{ margin: 0, paddingLeft: '18px' }}>
                            <li>
                              Open <a href="https://ko-fi.com/manage/webhooks" target="_blank" rel="noopener noreferrer" style={{ color: '#fbbf24' }}>ko-fi.com/manage/webhooks ↗</a>
                            </li>
                            <li>
                              Paste Webhook URL: <code style={{ color: '#38bdf8' }}>https://ryperdeck.vercel.app/api/kofi-webhook</code>
                            </li>
                            <li>Click <strong>Update</strong> or <strong>Send Test</strong>.</li>
                            <li>All future donations automatically verify on the website within 3 seconds!</li>
                          </ol>
                        </div>
                      )}

                      {/* Filter Tabs */}
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => setSupporterFilter('all')}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            background: supporterFilter === 'all' ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
                            color: supporterFilter === 'all' ? '#000000' : 'rgba(255, 255, 255, 0.7)',
                            border:
                              '1px solid ' +
                              (supporterFilter === 'all' ? '#ffffff' : 'rgba(255, 255, 255, 0.12)'),
                          }}
                        >
                          All ({supporters.length})
                        </button>

                        <button
                          type="button"
                          onClick={() => setSupporterFilter('pending')}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: supporterFilter === 'pending' ? '#fbbf24' : 'rgba(251, 191, 36, 0.1)',
                            color: supporterFilter === 'pending' ? '#000000' : '#fbbf24',
                            border:
                              '1px solid ' +
                              (supporterFilter === 'pending' ? '#fbbf24' : 'rgba(251, 191, 36, 0.3)'),
                          }}
                        >
                          {pendingSupporters.length > 0 && (
                            <span
                              style={{
                                width: 7,
                                height: 7,
                                borderRadius: '50%',
                                background: supporterFilter === 'pending' ? '#000000' : '#fbbf24',
                              }}
                            />
                          )}
                          Pending Verification ({pendingSupporters.length})
                        </button>

                        <button
                          type="button"
                          onClick={() => setSupporterFilter('verified')}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            background: supporterFilter === 'verified' ? '#34d399' : 'rgba(16, 185, 129, 0.1)',
                            color: supporterFilter === 'verified' ? '#000000' : '#34d399',
                            border:
                              '1px solid ' +
                              (supporterFilter === 'verified' ? '#34d399' : 'rgba(16, 185, 129, 0.3)'),
                          }}
                        >
                          Verified ({verifiedSupporters.length})
                        </button>
                      </div>

                      {displayedSupporters.length === 0 ? (
                        <EmptyState
                          icon={<Coffee style={{ width: 28, height: 28 }} />}
                          title={
                            supporterFilter === 'pending'
                              ? 'No Pending Verifications'
                              : supporterFilter === 'verified'
                              ? 'No Verified Supporters'
                              : 'No Supporters Recorded Yet'
                          }
                          message={
                            supporterFilter === 'pending'
                              ? 'All supporter submissions have been verified and processed!'
                              : 'When supporters contribute via Ko-fi or submit a review, they will appear here.'
                          }
                        />
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {displayedSupporters.map((sup, idx) => {
                            const isEditing = editSupporterId === sup.id;

                            if (isEditing) {
                              return (
                                <div
                                  key={sup.id || idx}
                                  style={{
                                    padding: isMobile ? '14px' : '18px 20px',
                                    borderRadius: '16px',
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    border: '1px solid #fbbf24',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                  }}
                                >
                                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#fbbf24' }}>
                                    Editing Supporter: {sup.name}
                                  </div>

                                  <div
                                    style={{
                                      display: 'grid',
                                      gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr',
                                      gap: '10px',
                                    }}
                                  >
                                    <input
                                      type="text"
                                      value={editSupName}
                                      onChange={(e) => setEditSupName(e.target.value)}
                                      placeholder="Name"
                                      style={{
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        background: '#1a1b26',
                                        border: '1px solid rgba(255, 255, 255, 0.25)',
                                        color: '#ffffff',
                                        fontSize: '13px',
                                      }}
                                    />
                                    <input
                                      type="number"
                                      value={editSupAmount}
                                      onChange={(e) => setEditSupAmount(e.target.value)}
                                      placeholder="Amount (₹)"
                                      style={{
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        background: '#1a1b26',
                                        border: '1px solid rgba(255, 255, 255, 0.25)',
                                        color: '#ffffff',
                                        fontSize: '13px',
                                      }}
                                    />
                                    <input
                                      type="number"
                                      value={editSupCups}
                                      onChange={(e) => setEditSupCups(e.target.value)}
                                      placeholder="Cups"
                                      style={{
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        background: '#1a1b26',
                                        border: '1px solid rgba(255, 255, 255, 0.25)',
                                        color: '#ffffff',
                                        fontSize: '13px',
                                      }}
                                    />
                                    <select
                                      value={editSupRating}
                                      onChange={(e) => setEditSupRating(Number(e.target.value))}
                                      style={{
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        background: '#1a1b26',
                                        border: '1px solid rgba(255, 255, 255, 0.25)',
                                        color: '#ffffff',
                                        fontSize: '13px',
                                      }}
                                    >
                                      <option value={5}>★ 5 Stars</option>
                                      <option value={4}>★ 4 Stars</option>
                                      <option value={3}>★ 3 Stars</option>
                                      <option value={2}>★ 2 Stars</option>
                                      <option value={1}>★ 1 Star</option>
                                    </select>
                                  </div>

                                  <div
                                    style={{
                                      display: 'grid',
                                      gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
                                      gap: '10px',
                                    }}
                                  >
                                    <input
                                      type="text"
                                      value={editSupMessage}
                                      onChange={(e) => setEditSupMessage(e.target.value)}
                                      placeholder="Review / Message (No links)"
                                      style={{
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        background: '#1a1b26',
                                        border: '1px solid rgba(255, 255, 255, 0.25)',
                                        color: '#ffffff',
                                        fontSize: '13px',
                                      }}
                                    />
                                    <input
                                      type="text"
                                      value={editSupRef}
                                      onChange={(e) => setEditSupRef(e.target.value)}
                                      placeholder="Ko-fi Ref / Note"
                                      style={{
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        background: '#1a1b26',
                                        border: '1px solid rgba(255, 255, 255, 0.25)',
                                        color: '#ffffff',
                                        fontSize: '13px',
                                      }}
                                    />
                                  </div>

                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      gap: '10px',
                                      flexWrap: 'wrap',
                                    }}
                                  >
                                    <label
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontSize: '12px',
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={editSupVerified}
                                        onChange={(e) => setEditSupVerified(e.target.checked)}
                                      />
                                      <span>Verified Supporter</span>
                                    </label>

                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <button
                                        type="button"
                                        onClick={() => setEditSupporterId(null)}
                                        style={{
                                          padding: '6px 14px',
                                          borderRadius: '8px',
                                          background: 'rgba(255, 255, 255, 0.08)',
                                          border: 'none',
                                          color: 'rgba(255, 255, 255, 0.7)',
                                          fontSize: '12px',
                                          cursor: 'pointer',
                                        }}
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="button"
                                        onClick={handleSaveEditSupporter}
                                        disabled={savingSupporter}
                                        style={{
                                          padding: '6px 18px',
                                          borderRadius: '8px',
                                          background: '#34d399',
                                          border: 'none',
                                          color: '#000000',
                                          fontWeight: 700,
                                          fontSize: '12px',
                                          cursor: 'pointer',
                                          opacity: savingSupporter ? 0.6 : 1,
                                        }}
                                      >
                                        {savingSupporter ? 'Saving...' : 'Save Changes'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            const isVerified = sup.verified === true;

                            return (
                              <div
                                key={sup.id || idx}
                                style={{
                                  display: 'flex',
                                  flexDirection: isMobile ? 'column' : 'row',
                                  alignItems: isMobile ? 'stretch' : 'center',
                                  justifyContent: 'space-between',
                                  gap: isMobile ? '10px' : '16px',
                                  padding: isMobile ? '14px' : '16px 20px',
                                  borderRadius: '14px',
                                  background: isVerified
                                    ? 'rgba(255, 255, 255, 0.04)'
                                    : 'rgba(251, 191, 36, 0.06)',
                                  border: isVerified
                                    ? '1px solid rgba(255, 255, 255, 0.1)'
                                    : '1px solid rgba(251, 191, 36, 0.35)',
                                }}
                              >
                                <div>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      flexWrap: 'wrap',
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: isMobile ? '14px' : '15px',
                                        fontWeight: 700,
                                        color: '#ffffff',
                                      }}
                                    >
                                      {sup.name}
                                    </span>

                                    {isVerified ? (
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
                                    ) : (
                                      <span
                                        style={{
                                          fontSize: '10px',
                                          color: '#fbbf24',
                                          background: 'rgba(251, 191, 36, 0.15)',
                                          border: '1px solid rgba(251, 191, 36, 0.4)',
                                          padding: '2px 8px',
                                          borderRadius: '999px',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          fontFamily: 'monospace',
                                          fontWeight: 700,
                                        }}
                                      >
                                        ⚠️ Pending Verification
                                      </span>
                                    )}
                                  </div>

                                  {sup.message && (
                                    <p
                                      style={{
                                        margin: '4px 0 0 0',
                                        fontSize: '13px',
                                        color: 'rgba(255, 255, 255, 0.75)',
                                        fontStyle: 'italic',
                                      }}
                                    >
                                      "{sup.message}"
                                    </p>
                                  )}

                                  {sup.payment_id && (
                                    <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)' }}>
                                        Ko-fi Proof:
                                      </span>
                                      <code
                                        style={{
                                          fontSize: '11px',
                                          color: '#67e8f9',
                                          fontFamily: 'monospace',
                                          background: 'rgba(103, 232, 249, 0.1)',
                                          padding: '2px 6px',
                                          borderRadius: '4px',
                                          border: '1px solid rgba(103, 232, 249, 0.25)',
                                        }}
                                      >
                                        {sup.payment_id}
                                      </code>
                                    </div>
                                  )}
                                </div>

                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: isMobile ? 'space-between' : 'flex-end',
                                    gap: '12px',
                                    borderTop: isMobile ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                                    paddingTop: isMobile ? '8px' : 0,
                                  }}
                                >
                                  <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                                    <div
                                      style={{
                                        fontSize: '17px',
                                        fontWeight: 800,
                                        color: isVerified ? '#34d399' : '#fbbf24',
                                        fontFamily: 'monospace',
                                      }}
                                    >
                                      ₹{sup.amount?.toLocaleString()}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#fbbf24' }}>
                                      ★ {sup.rating || 5}/5 · {sup.cups || 1} {sup.cups === 1 ? 'cup' : 'cups'}
                                    </div>
                                  </div>

                                  {/* Management Actions */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {!isVerified ? (
                                      <button
                                        onClick={() => handleToggleVerified(sup.id, false)}
                                        title="Verify this payment and publish review live to the Leaderboard"
                                        style={{
                                          padding: '6px 14px',
                                          borderRadius: '8px',
                                          background: '#34d399',
                                          border: 'none',
                                          color: '#000000',
                                          fontSize: '11px',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          boxShadow: '0 0 15px rgba(52, 211, 153, 0.3)',
                                        }}
                                      >
                                        <CheckCircle style={{ width: 12, height: 12 }} /> Verify &amp; Publish ✓
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleToggleVerified(sup.id, true)}
                                        title="Unverify supporter (removes from public Leaderboard)"
                                        style={{
                                          padding: '5px 10px',
                                          borderRadius: '6px',
                                          background: 'rgba(255, 255, 255, 0.06)',
                                          border: '1px solid rgba(255, 255, 255, 0.15)',
                                          color: 'rgba(255, 255, 255, 0.5)',
                                          fontSize: '11px',
                                          cursor: 'pointer',
                                        }}
                                      >
                                        Unverify
                                      </button>
                                    )}

                                    <button
                                      onClick={() => handleStartEditSupporter(sup)}
                                      title="Edit supporter record"
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'rgba(255, 255, 255, 0.4)',
                                        cursor: 'pointer',
                                        padding: '5px',
                                        display: 'flex',
                                      }}
                                    >
                                      <Edit2 style={{ width: 14, height: 14 }} />
                                    </button>

                                    <button
                                      onClick={() => handleDeleteItem('supporters', sup.id)}
                                      title="Delete fake or unwanted record"
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'rgba(239, 68, 68, 0.6)',
                                        cursor: 'pointer',
                                        padding: '5px',
                                        display: 'flex',
                                      }}
                                    >
                                      <Trash2 style={{ width: 14, height: 14 }} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ── TAB 5: VISITORS ──────────────────────────────────────────── */}
            {tab === 'visitors' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                {/* Main counter card */}
                <div
                  style={{
                    padding: isMobile ? '24px 16px' : '40px 24px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    textAlign: 'center',
                  }}
                >
                  <BarChart2 style={{ width: 36, height: 36, color: '#38bdf8', margin: '0 auto 16px' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                      Lifetime Unique Site Visitors
                    </h3>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 10px',
                        borderRadius: '999px',
                        background: isDbVisitor ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: isDbVisitor ? '#34d399' : '#fbbf24',
                        border: isDbVisitor ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                        fontWeight: 600,
                        fontFamily: 'monospace',
                      }}
                    >
                      {isDbVisitor ? '● Supabase Database Synced' : '○ Local Storage Mode'}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 12px 0', fontSize: isMobile ? '44px' : '64px', fontWeight: 800, color: '#ffffff', fontFamily: 'monospace', letterSpacing: '-0.04em' }}>
                    {visitorCount.toLocaleString()}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255, 255, 255, 0.45)', maxWidth: '540px', marginInline: 'auto' }}>
                    {isDbVisitor
                      ? 'Real-time global count stored in Supabase PostgreSQL database across all browsers and devices.'
                      : 'Visitors currently stored locally on this browser. Enable the Supabase table below so visitors are never lost across devices.'}
                  </p>

                  {/* Manual count editor */}
                  <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                      type="number"
                      value={editVisitorVal}
                      onChange={(e) => setEditVisitorVal(e.target.value)}
                      placeholder="Set visitor baseline"
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                        width: '160px',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleSaveVisitorCount}
                      disabled={savingVisitor}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: '#38bdf8',
                        color: '#000000',
                        fontSize: '12px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        opacity: savingVisitor ? 0.6 : 1,
                      }}
                    >
                      {savingVisitor ? 'Saving...' : 'Set Count'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        fetchGlobalVisitorsFromDb().then(({ count, isDb }) => {
                          setVisitorCount(count);
                          setIsDbVisitor(isDb);
                          setEditVisitorVal(String(count));
                        });
                      }}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Database Setup instructions */}
                {!isDbVisitor && (
                  <div
                    style={{
                      padding: isMobile ? '16px' : '20px',
                      borderRadius: '16px',
                      background: 'rgba(245, 158, 11, 0.05)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Database style={{ width: 18, height: 18, color: '#fbbf24' }} />
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#fbbf24' }}>
                          Connect Lifetime Visitors to Supabase (1-Minute Setup)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(SITE_STATS_SQL);
                          setCopiedVisitorSql(true);
                          setTimeout(() => setCopiedVisitorSql(false), 2500);
                        }}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          background: copiedVisitorSql ? '#34d399' : '#fbbf24',
                          color: '#000000',
                          fontSize: '12px',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {copiedVisitorSql ? '✓ Copied SQL!' : 'Copy Supabase SQL'}
                      </button>
                    </div>
                    <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.5 }}>
                      To make visitor counts permanent across all devices and never lose counts, run this SQL in your Supabase project (<strong>SQL Editor &gt; New Query &gt; Paste &gt; Run</strong>):
                    </p>
                    <pre
                      style={{
                        margin: 0,
                        padding: '12px',
                        borderRadius: '8px',
                        background: '#0a0a12',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#67e8f9',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        overflowX: 'auto',
                        maxHeight: '180px',
                      }}
                    >
                      {SITE_STATS_SQL}
                    </pre>
                  </div>
                )}
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
      padding: '40px 16px',
      textAlign: 'center',
      gap: '10px',
    }}
  >
    <div
      style={{
        width: '50px',
        height: '50px',
        borderRadius: '999px',
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: '4px',
      }}
    >
      {icon}
    </div>
    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
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
      padding: '6px 12px',
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
