
import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { ViewState, ThemeColor } from './types';
import { Home, MapPin, BookOpen, Phone, FileText, Menu, X, Bell, CalendarCheck, Globe, PenTool, GraduationCap, Download, Settings, Moon, Sun, Check, Calendar, AlertTriangle, RefreshCw } from 'lucide-react';
import HomePage from './components/HomePage';
import ChatWidget from './components/ChatWidget';

const AboutPage = React.lazy(() => import('./components/AboutPage'));
const DestinationsPage = React.lazy(() => import('./components/DestinationsPage'));
const BookingPage = React.lazy(() => import('./components/BookingPage'));
const ContactPage = React.lazy(() => import('./components/ContactPage'));
const MockTestPage = React.lazy(() => import('./components/MockTestPage'));
const NotificationsPage = React.lazy(() => import('./components/NotificationsPage'));
const ResourcesPage = React.lazy(() => import('./components/ResourcesPage'));
const UKInterviewPage = React.lazy(() => import('./components/UKInterviewPage'));
const NepaliCalendarPage = React.lazy(() => import('./components/NepaliCalendarPage'));

const COLOR_PALETTES: Record<ThemeColor, any> = {
  green: {
    50: '236 253 245', 100: '209 250 229', 200: '167 243 208', 300: '110 231 183', 
    400: '52 211 153', 500: '16 185 129', 600: '5 150 105', 700: '4 120 87', 
    800: '6 95 70', 900: '6 78 59', 950: '2 44 34', hex: '#059669'
  },
  blue: {
    50: '239 246 255', 100: '219 234 254', 200: '191 219 254', 300: '147 197 253',
    400: '96 165 250', 500: '59 130 246', 600: '37 99 235', 700: '29 78 216',
    800: '30 64 175', 900: '30 58 138', 950: '23 37 84', hex: '#2563eb'
  },
  purple: {
    50: '250 245 255', 100: '243 232 255', 200: '233 213 255', 300: '216 180 254',
    400: '192 132 252', 500: '168 85 247', 600: '147 51 234', 700: '126 34 206',
    800: '107 33 168', 900: '88 28 135', 950: '59 7 100', hex: '#9333ea'
  },
  orange: {
    50: '255 247 237', 100: '255 237 213', 200: '254 215 170', 300: '253 186 116',
    400: '251 146 60', 500: '249 115 22', 600: '234 88 12', 700: '194 65 12',
    800: '154 52 18', 900: '124 45 18', 950: '67 20 7', hex: '#ea580c'
  },
  rose: {
    50: '255 241 242', 100: '255 228 230', 200: '254 205 211', 300: '253 164 175',
    400: '251 113 133', 500: '244 63 94', 600: '225 29 72', 700: '190 18 60',
    800: '159 18 57', 900: '136 19 55', 950: '76 5 25', hex: '#e11d48'
  }
};

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("App Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 mb-6">
            <AlertTriangle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">Please reload the application.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-all flex items-center"
          >
            <RefreshCw size={18} className="mr-2" /> Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-[60vh] w-full">
    <div className="relative w-16 h-16">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 dark:border-primary-900/30 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);

const NavItem = React.memo(({ view, icon: Icon, label, active, onClick }: { view: ViewState; icon: any; label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all w-full md:w-auto text-left md:text-center nav-item ${
        active 
          ? 'bg-white/20 text-white font-bold backdrop-blur-md shadow-sm' 
          : 'text-white/80 hover:bg-white/10 hover:text-white'
      }`}
    >
      <Icon size={18} strokeWidth={active ? 2.5 : 2} />
      <span>{label}</span>
    </button>
));

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  
  const [themeColor, setThemeColor] = useState<ThemeColor>(() => {
    try {
        return (localStorage.getItem('brighton-theme') as ThemeColor) || 'green';
    } catch { return 'green'; }
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
        const saved = localStorage.getItem('brighton-dark-mode');
        return saved !== null ? JSON.parse(saved) : false;
    } catch { return false; }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState('');

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.add('dark');
    else root.classList.remove('dark');

    const palette = COLOR_PALETTES[themeColor];
    Object.keys(palette).forEach(key => {
      if (key !== 'hex') root.style.setProperty(`--primary-${key}`, palette[key]);
    });
    
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', palette.hex);

    try {
        localStorage.setItem('brighton-theme', themeColor);
        localStorage.setItem('brighton-dark-mode', JSON.stringify(isDarkMode));
    } catch (e) {}
  }, [isDarkMode, themeColor]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.HOME: return <HomePage setView={setCurrentView} />;
      case ViewState.ABOUT: return <AboutPage />;
      case ViewState.DESTINATIONS: return <DestinationsPage onAskAI={(q) => { setChatInitialMessage(q); setIsChatOpen(true); }} />;
      case ViewState.BOOKING: return <BookingPage />;
      case ViewState.CONTACT: return <ContactPage />;
      case ViewState.MOCK_TEST: return <MockTestPage />;
      case ViewState.NOTIFICATIONS: return <NotificationsPage />;
      case ViewState.RESOURCES: return <ResourcesPage />;
      case ViewState.UK_INTERVIEW: return <UKInterviewPage />;
      case ViewState.NEPALI_CALENDAR: return <NepaliCalendarPage />;
      default: return <HomePage setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-500 selection:bg-primary-500/20 selection:text-primary-700">
      <div className="bg-noise"></div>

      <div className="fixed inset-0 z-[-1] overflow-hidden transform-gpu pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-50/50 via-white/80 to-blue-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-primary-400/20 dark:bg-primary-600/10 rounded-full blur-[100px] opacity-60 mix-blend-multiply dark:mix-blend-screen will-change-transform translate-z-0"></div>
        <div className="absolute bottom-[-10%] left-[-20%] w-[60vw] h-[60vw] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[100px] opacity-60 mix-blend-multiply dark:mix-blend-screen will-change-transform translate-z-0"></div>
      </div>

      <header className="bg-primary-700/90 dark:bg-black/60 backdrop-blur-lg text-white sticky top-0 z-40 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-colors duration-500 transform-gpu">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center cursor-pointer gap-3 group" onClick={() => setCurrentView(ViewState.HOME)}>
              <div className="relative w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl backdrop-blur-sm shadow-inner ring-1 ring-white/20">
                 <Globe className="text-white" size={24} />
                 <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                    <PenTool className="text-primary-600 transform -rotate-12" size={10} fill="currentColor" /> 
                 </div>
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-xl font-extrabold text-white leading-none tracking-tight">Brighton</h1>
                <p className="text-[10px] text-primary-100 font-bold tracking-widest uppercase opacity-80 mt-0.5">Career Consultants</p>
              </div>
            </div>

            <div className="hidden md:flex space-x-1">
              <NavItem view={ViewState.HOME} icon={Home} label="Home" active={currentView === ViewState.HOME} onClick={() => setCurrentView(ViewState.HOME)} />
              <NavItem view={ViewState.DESTINATIONS} icon={MapPin} label="Study" active={currentView === ViewState.DESTINATIONS} onClick={() => setCurrentView(ViewState.DESTINATIONS)} />
              <NavItem view={ViewState.BOOKING} icon={FileText} label="Counseling" active={currentView === ViewState.BOOKING} onClick={() => setCurrentView(ViewState.BOOKING)} />
              <NavItem view={ViewState.RESOURCES} icon={CalendarCheck} label="Appt." active={currentView === ViewState.RESOURCES} onClick={() => setCurrentView(ViewState.RESOURCES)} />
              <NavItem view={ViewState.CONTACT} icon={Phone} label="Contact" active={currentView === ViewState.CONTACT} onClick={() => setCurrentView(ViewState.CONTACT)} />
            </div>

            <div className="flex items-center space-x-3">
              {showInstallBtn && (
                <button onClick={handleInstallClick} className="hidden md:flex items-center space-x-1 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-white/30 transition-all">
                  <Download size={14} /><span>Install</span>
                </button>
              )}
               <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="p-2 text-white/80 hover:bg-white/10 rounded-full transition-all active:scale-95"><Settings size={20} /></button>
               <button onClick={() => {setCurrentView(ViewState.NOTIFICATIONS); setUnreadNotifications(0);}} className="relative p-2 text-white/80 hover:bg-white/10 rounded-full transition-all active:scale-95">
                <Bell size={22} />
                {unreadNotifications > 0 && <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-primary-700 animate-pulse"></span>}
              </button>
              <div className="md:hidden">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2 hover:bg-white/10 rounded-xl transition-colors active:scale-95">
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {isSettingsOpen && (
          <div className="absolute top-16 right-4 w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/50 dark:border-gray-600 p-4 animate-slideDown text-gray-800 dark:text-white z-50">
            <div className="flex justify-between items-center mb-4 border-b border-gray-200/50 dark:border-gray-700 pb-2">
              <h3 className="font-bold text-sm uppercase tracking-wider">Appearance</h3>
              <button onClick={() => setIsSettingsOpen(false)}><X size={16} /></button>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">Dark Mode</span>
              <button onClick={() => setIsDarkMode(!isDarkMode)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDarkMode ? 'bg-primary-600' : 'bg-gray-300'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div>
              <span className="text-sm font-medium block mb-2">Theme Color</span>
              <div className="grid grid-cols-5 gap-2">
                {(['green', 'blue', 'purple', 'orange', 'rose'] as ThemeColor[]).map((color) => (
                  <button key={color} onClick={() => setThemeColor(color)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${themeColor === color ? 'ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-gray-800' : ''}`} style={{ backgroundColor: `rgb(${COLOR_PALETTES[color][500]})` }}>{themeColor === color && <Check size={14} className="text-white" />}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {isMobileMenuOpen && (
          <div className="md:hidden bg-primary-900/95 dark:bg-black/90 backdrop-blur-xl border-t border-white/10 p-4 shadow-2xl absolute w-full z-50 max-h-[80vh] overflow-y-auto rounded-b-3xl animate-slideDown">
            <div className="grid grid-cols-2 gap-2">
                <NavItem view={ViewState.HOME} icon={Home} label="Home" active={currentView === ViewState.HOME} onClick={() => {setCurrentView(ViewState.HOME); setIsMobileMenuOpen(false);}} />
                <NavItem view={ViewState.DESTINATIONS} icon={MapPin} label="Study Abroad" active={currentView === ViewState.DESTINATIONS} onClick={() => {setCurrentView(ViewState.DESTINATIONS); setIsMobileMenuOpen(false);}} />
                <NavItem view={ViewState.UK_INTERVIEW} icon={GraduationCap} label="Visa Interview" active={currentView === ViewState.UK_INTERVIEW} onClick={() => {setCurrentView(ViewState.UK_INTERVIEW); setIsMobileMenuOpen(false);}} />
                <NavItem view={ViewState.BOOKING} icon={FileText} label="Counseling" active={currentView === ViewState.BOOKING} onClick={() => {setCurrentView(ViewState.BOOKING); setIsMobileMenuOpen(false);}} />
                <NavItem view={ViewState.RESOURCES} icon={CalendarCheck} label="Appointments" active={currentView === ViewState.RESOURCES} onClick={() => {setCurrentView(ViewState.RESOURCES); setIsMobileMenuOpen(false);}} />
                <NavItem view={ViewState.MOCK_TEST} icon={FileText} label="Mock Tests" active={currentView === ViewState.MOCK_TEST} onClick={() => {setCurrentView(ViewState.MOCK_TEST); setIsMobileMenuOpen(false);}} />
                <NavItem view={ViewState.NEPALI_CALENDAR} icon={Calendar} label="Calendar" active={currentView === ViewState.NEPALI_CALENDAR} onClick={() => {setCurrentView(ViewState.NEPALI_CALENDAR); setIsMobileMenuOpen(false);}} />
                <NavItem view={ViewState.ABOUT} icon={BookOpen} label="About" active={currentView === ViewState.ABOUT} onClick={() => {setCurrentView(ViewState.ABOUT); setIsMobileMenuOpen(false);}} />
                <NavItem view={ViewState.CONTACT} icon={Phone} label="Contact" active={currentView === ViewState.CONTACT} onClick={() => {setCurrentView(ViewState.CONTACT); setIsMobileMenuOpen(false);}} />
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-32 md:pb-8 animate-fadeIn" key={currentView}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            {renderView()}
          </Suspense>
        </ErrorBoundary>
      </main>

      <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/60 dark:bg-black/60 backdrop-blur-lg border border-white/40 dark:border-white/10 rounded-3xl px-6 py-2 flex items-center space-x-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] ring-1 ring-white/50 dark:ring-white/5 z-30 max-w-[95%] animate-slideUp">
        <button onClick={() => setCurrentView(ViewState.HOME)} className={`p-2.5 rounded-full transition-all duration-300 relative group ${currentView === ViewState.HOME ? 'text-primary-600 dark:text-primary-400 -translate-y-1' : 'text-gray-500 dark:text-gray-400'}`}>
            <Home size={24} strokeWidth={currentView === ViewState.HOME ? 2.5 : 2} />
        </button>
        <button onClick={() => setCurrentView(ViewState.RESOURCES)} className={`p-2.5 rounded-full transition-all duration-300 relative group ${currentView === ViewState.RESOURCES ? 'text-primary-600 dark:text-primary-400 -translate-y-1' : 'text-gray-500 dark:text-gray-400'}`}>
            <CalendarCheck size={24} strokeWidth={currentView === ViewState.RESOURCES ? 2.5 : 2} />
        </button>
        <button onClick={() => setCurrentView(ViewState.BOOKING)} className={`p-4 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-500 text-white shadow-xl shadow-primary-600/30 -translate-y-5 border-[3px] border-white/80 dark:border-gray-900 transition-transform active:scale-95 hover:scale-105`}>
            <FileText size={26} strokeWidth={2.5} />
        </button>
        <button onClick={() => setCurrentView(ViewState.UK_INTERVIEW)} className={`p-2.5 rounded-full transition-all duration-300 relative group ${currentView === ViewState.UK_INTERVIEW ? 'text-primary-600 dark:text-primary-400 -translate-y-1' : 'text-gray-500 dark:text-gray-400'}`}>
            <GraduationCap size={24} strokeWidth={currentView === ViewState.UK_INTERVIEW ? 2.5 : 2} />
        </button>
        <button onClick={() => setCurrentView(ViewState.NEPALI_CALENDAR)} className={`p-2.5 rounded-full transition-all duration-300 relative group ${currentView === ViewState.NEPALI_CALENDAR ? 'text-primary-600 dark:text-primary-400 -translate-y-1' : 'text-gray-500 dark:text-gray-400'}`}>
            <Calendar size={24} strokeWidth={currentView === ViewState.NEPALI_CALENDAR ? 2.5 : 2} />
        </button>
      </div>

      <ChatWidget isOpen={isChatOpen} setIsOpen={setIsChatOpen} initialMessage={chatInitialMessage} setInitialMessage={setChatInitialMessage} />
    </div>
  );
};

export default App;
