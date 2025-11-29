
import React, { useState, useEffect } from 'react';
import { 
  ScreenName, 
  ActivityType, 
  SessionRecord 
} from './types';
import { 
  Play, 
  BookOpen, 
  Gamepad2, 
  Flower, 
  Footprints, 
  Music, 
  Wind, 
  StopCircle, 
  History, 
  Timer,
  ChevronLeft,
  Bot,
  Feather,
  ArrowRight,
  User,
  Calendar,
  Phone,
  Mail,
  Share2,
  CheckCircle2,
  AlertCircle,
  Lock,
  LogIn
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AIChatOverlay } from './components/AIChatOverlay';

const ACTIVITY_ICONS: Record<ActivityType, React.ReactNode> = {
  [ActivityType.READING]: <BookOpen size={32} />,
  [ActivityType.GAMING]: <Gamepad2 size={32} />,
  [ActivityType.MEDITATING]: <Flower size={32} />,
  [ActivityType.WALKING]: <Footprints size={32} />,
  [ActivityType.LISTENING]: <Music size={32} />,
  [ActivityType.BREATHING]: <Wind size={32} />,
};

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  [ActivityType.READING]: '#6366f1',
  [ActivityType.GAMING]: '#8b5cf6',
  [ActivityType.MEDITATING]: '#ec4899',
  [ActivityType.WALKING]: '#10b981',
  [ActivityType.LISTENING]: '#f59e0b',
  [ActivityType.BREATHING]: '#3b82f6',
};

const App: React.FC = () => {
  // --- State ---
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(ScreenName.LANDING);
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // --- Logic ---

  // Timer Effect
  useEffect(() => {
    let interval: number | null = null;
    if (isActive) {
      interval = window.setInterval(() => {
        setSessionTime((time) => time + 1);
      }, 1000);
    } else if (!isActive && sessionTime !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, sessionTime]);

  const handleStartSession = (activity: ActivityType) => {
    setSelectedActivity(activity);
    setSessionTime(0);
    setCurrentScreen(ScreenName.SESSION);
    setIsActive(true);
  };

  const handleCompleteSession = () => {
    setIsActive(false);
    if (selectedActivity) {
      const newSession: SessionRecord = {
        id: Date.now().toString(),
        activity: selectedActivity,
        durationSeconds: sessionTime,
        timestamp: new Date(),
      };
      setSessions((prev) => [newSession, ...prev]);
    }
    setCurrentScreen(ScreenName.REPORT);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalTime = () => {
    const totalSeconds = sessions.reduce((acc, curr) => acc + curr.durationSeconds, 0);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  // --- Screens ---

  const LandingScreen = () => (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 animate-in fade-in duration-500 relative">
      <div className="mb-8 p-6 bg-white/20 rounded-3xl backdrop-blur-md shadow-xl">
        <Flower size={80} className="text-white" />
      </div>
      <h1 className="text-5xl font-bold tracking-tight mb-4">Mind it</h1>
      <p className="text-xl font-medium text-indigo-100 mb-12 tracking-wide">Rest • Reset • Report</p>
      
      <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={() => setCurrentScreen(ScreenName.STRESS_ASSESSMENT)}
            className="group relative bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full"
          >
            Get Started
            <span className="absolute -right-2 -top-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
          </button>
          
          <button
            onClick={() => setCurrentScreen(ScreenName.LOGIN)}
            className="flex items-center justify-center gap-2 text-indigo-100 font-medium hover:text-white transition-colors py-2"
          >
             Already a member? Login
          </button>
      </div>
    </div>
  );

  const LoginScreen = () => {
      const handleLogin = (e: React.FormEvent) => {
          e.preventDefault();
          // Simulate login
          setCurrentScreen(ScreenName.SELECTION);
      };

      return (
        <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300 overflow-y-auto no-scrollbar">
            {/* Header */}
            <div className="bg-indigo-600 p-8 pt-16 pb-12 rounded-b-[40px] shadow-lg text-center shrink-0">
                 <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <LogIn className="text-white w-8 h-8" />
                 </div>
                 <h2 className="text-3xl text-white mb-2" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700 }}>
                    Welcome Back
                 </h2>
                 <p className="text-indigo-200 font-medium">Continue your wellness journey</p>
            </div>

            {/* Form */}
            <div className="p-8 flex-1 flex flex-col justify-center pb-24">
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                            <input
                                required
                                type="email"
                                placeholder="you@example.com"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-700"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                            <input
                                required
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-700"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-black hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            Log In
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="text-center pt-4">
                        <button
                            type="button"
                            onClick={() => setCurrentScreen(ScreenName.REGISTRATION)}
                            className="text-indigo-600 font-medium text-sm hover:underline"
                        >
                            Don't have an account? Register
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="p-6 text-center">
                 <button 
                     onClick={() => setCurrentScreen(ScreenName.LANDING)}
                     className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                 >
                     Back to Home
                 </button>
            </div>
        </div>
      );
  };

  const StressAssessmentScreen = () => {
    const [answers, setAnswers] = useState<Record<number, string>>({});

    const questions = [
      { id: 1, text: "Do you often feel overwhelmed by your daily workload?" },
      { id: 2, text: "Do you have trouble sleeping due to racing thoughts?" },
      { id: 3, text: "Do you find it difficult to relax even when off duty?" }
    ];

    const options = ["Yes", "Maybe", "No"];

    const handleAnswer = (questionId: number, option: string) => {
      setAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    const isComplete = questions.every(q => answers[q.id]);

    return (
      <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
        <div className="p-8 pt-12 pb-6">
           <h2 className="text-3xl text-gray-900 mb-2" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700 }}>
             Stress Check
           </h2>
           <p className="text-gray-500">Let's assess your current stress levels to better help you.</p>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-24">
           <div className="space-y-8">
             {questions.map((q, idx) => (
               <div key={q.id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 150}ms` }}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mt-0.5">
                      {q.id}
                    </span>
                    <p className="text-lg text-gray-800 font-medium leading-tight">
                      {q.text}
                    </p>
                  </div>
                  <div className="flex gap-2 pl-9">
                    {options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(q.id, option)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                          answers[q.id] === option
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
               </div>
             ))}
           </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white to-transparent">
          <button
            onClick={() => setCurrentScreen(ScreenName.JOURNALIST_INTRO)}
            disabled={!isComplete}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2 ${
              isComplete 
                ? 'bg-gray-900 text-white hover:bg-black hover:scale-[1.02] active:scale-95' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const JournalistIntroScreen = () => (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-500 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 z-0"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-50 rounded-full -ml-32 -mb-32 z-0"></div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 z-10 text-center">
        <div className="mb-8 p-4 bg-gray-50 rounded-full">
           <Feather className="w-12 h-12 text-gray-800" />
        </div>

        <h2 
          className="text-4xl text-gray-900 mb-6 leading-tight" 
          style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700 }}
        >
          For Our Journalists
        </h2>
        
        <div className="w-16 h-1 bg-gray-200 mb-8 rounded-full"></div>

        <p className="text-xl text-gray-600 font-light mb-12 leading-relaxed max-w-xs" style={{ fontFamily: '"Playfair Display", serif' }}>
           Stress Relief and Assuring Quality Sleep
        </p>

        <button
          onClick={() => setCurrentScreen(ScreenName.REGISTRATION)}
          className="group flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-xl font-medium text-lg shadow-xl hover:bg-black transition-all hover:scale-[1.02] active:scale-95 w-full max-w-[280px] justify-center"
        >
          Proceed to Register
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      <div className="p-6 z-10 text-center">
        <button 
            onClick={() => setCurrentScreen(ScreenName.LANDING)}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
            Back to Home
        </button>
      </div>
    </div>
  );

  const RegistrationScreen = () => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // In a real app, validation and API submission would go here.
      setCurrentScreen(ScreenName.SELECTION);
    };

    return (
      <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300 overflow-y-auto no-scrollbar">
          {/* Header Section */}
          <div className="bg-indigo-600 p-8 pt-12 rounded-b-[40px] shadow-lg text-center shrink-0">
               <h2 className="text-3xl text-white mb-2" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700 }}>
                  Register with Mind It
               </h2>
               <p className="text-indigo-200 font-medium tracking-wide">Rest • Reset • Report</p>
          </div>
  
          {/* Form Section */}
          <div className="p-8 flex-1 pb-24">
              <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-600 ml-1">Full Name</label>
                      <div className="relative">
                          <User className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                          <input
                              required
                              type="text"
                              placeholder="John Doe"
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-700"
                          />
                      </div>
                  </div>
  
                   {/* Gender */}
                  <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-600 ml-1">Gender</label>
                      <div className="relative">
                          <select required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none text-gray-700">
                               <option value="" disabled selected>Select Gender</option>
                               <option value="male">Male</option>
                               <option value="female">Female</option>
                               <option value="other">Other</option>
                               <option value="prefer-not-to-say">Prefer not to say</option>
                          </select>
                          <div className="absolute right-4 top-4 w-2 h-2 border-r-2 border-b-2 border-gray-400 rotate-45 pointer-events-none"></div>
                      </div>
                  </div>
  
                  {/* DOB */}
                   <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-600 ml-1">Date of Birth</label>
                      <div className="relative">
                          <Calendar className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                          <input
                              required
                              type="date"
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-700"
                          />
                      </div>
                  </div>
  
                  {/* Mobile */}
                   <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-600 ml-1">Mobile Number</label>
                      <div className="relative">
                          <Phone className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                          <input
                              required
                              type="tel"
                              placeholder="+1 234 567 890"
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-700"
                          />
                      </div>
                  </div>
  
                  {/* Email */}
                   <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-600 ml-1">Email Address</label>
                      <div className="relative">
                          <Mail className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                          <input
                              required
                              type="email"
                              placeholder="john@example.com"
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-700"
                          />
                      </div>
                  </div>
  
                  {/* Refer a Friend */}
                   <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-600 ml-1">Refer a Friend (Optional)</label>
                      <div className="relative">
                          <Share2 className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                          <input
                              type="text"
                              placeholder="Referral Code or Friend's Email"
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-700"
                          />
                      </div>
                  </div>
  
                  <div className="pt-4">
                       <button
                          type="submit"
                          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-black hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                       >
                          Join Now
                          <ArrowRight className="w-5 h-5" />
                       </button>
                  </div>

                  <div className="text-center">
                    <button
                        type="button"
                        onClick={() => setCurrentScreen(ScreenName.LOGIN)}
                        className="text-indigo-600 font-medium text-sm hover:underline"
                    >
                        Already have an account? Login
                    </button>
                  </div>
              </form>
          </div>
      </div>
    );
  };

  const SelectionScreen = () => (
    <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right duration-300">
      <div className="p-8 pb-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Reset your mind</h2>
        <p className="text-gray-500">Choose an activity to start resting.</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6 pt-2">
        <div className="grid grid-cols-2 gap-4">
          {Object.values(ActivityType).map((activity) => (
            <button
              key={activity}
              onClick={() => handleStartSession(activity)}
              className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-gray-100 flex flex-col items-center justify-center gap-4 transition-all hover:scale-[1.02] aspect-square"
            >
              <div 
                className="p-4 rounded-2xl text-white shadow-inner"
                style={{ backgroundColor: ACTIVITY_COLORS[activity] }}
              >
                {ACTIVITY_ICONS[activity]}
              </div>
              <span className="font-semibold text-gray-700">{activity}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const SessionScreen = () => (
    <div className="flex flex-col h-full bg-slate-900 text-white animate-in zoom-in-95 duration-500">
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Ambient Background Circles */}
        <div className="absolute w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="z-10 flex flex-col items-center gap-8">
          <div className="text-indigo-200 uppercase tracking-widest font-semibold text-sm">Now {selectedActivity}</div>
          
          <div className="relative">
             <div className="w-64 h-64 rounded-full border-4 border-white/10 flex items-center justify-center">
                <div className="w-56 h-56 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-6xl font-mono font-light tabular-nums">
                        {formatTime(sessionTime)}
                    </span>
                </div>
             </div>
             {isActive && (
                 <div className="absolute inset-0 rounded-full border-4 border-indigo-400 border-t-transparent animate-spin duration-[3000ms]" />
             )}
          </div>

          <button
            onClick={handleCompleteSession}
            className="flex items-center gap-3 bg-red-500/90 hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-red-500/30 mt-8"
          >
            <StopCircle />
            Stop Session
          </button>
        </div>
      </div>
    </div>
  );

  const ReportScreen = () => {
    // Prepare Data for Chart
    const activityTotals = sessions.reduce((acc, curr) => {
      acc[curr.activity] = (acc[curr.activity] || 0) + curr.durationSeconds;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(activityTotals).map(([name, seconds]) => ({
      name,
      seconds,
    }));

    return (
      <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-bottom duration-300">
        <div className="p-6 bg-white shadow-sm z-10">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-2xl font-bold text-gray-800">Your Report</h2>
             <button 
                onClick={() => setCurrentScreen(ScreenName.SELECTION)}
                className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
             >
                <ChevronLeft size={24} />
             </button>
          </div>
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
            <div className="flex items-center gap-3 mb-2 opacity-80">
              <History size={20} />
              <span className="text-sm font-medium">Total Rest Time</span>
            </div>
            <div className="text-4xl font-bold">{getTotalTime()}</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Chart Section */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-6">Activity Breakdown (Seconds)</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" hide />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="seconds" radius={[8, 8, 8, 8]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={ACTIVITY_COLORS[entry.name as ActivityType]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* History List */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-4 px-2">Recent Sessions</h3>
            <div className="space-y-3">
              {sessions.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">No sessions recorded yet.</p>
              ) : (
                  sessions.map((session) => (
                    <div key={session.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div 
                            className="p-2 rounded-xl text-white" 
                            style={{ backgroundColor: ACTIVITY_COLORS[session.activity] }}
                        >
                            {/* Simple icon mapping */}
                             {session.activity === ActivityType.READING && <BookOpen size={16} />}
                             {session.activity === ActivityType.GAMING && <Gamepad2 size={16} />}
                             {session.activity === ActivityType.MEDITATING && <Flower size={16} />}
                             {session.activity === ActivityType.WALKING && <Footprints size={16} />}
                             {session.activity === ActivityType.LISTENING && <Music size={16} />}
                             {session.activity === ActivityType.BREATHING && <Wind size={16} />}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{session.activity}</div>
                          <div className="text-xs text-gray-400">{session.timestamp.toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="font-mono font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
                        {formatTime(session.durationSeconds)}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans p-0 sm:p-8">
      {/* Mobile Frame Simulation */}
      <div className="w-full max-w-[420px] h-[100dvh] sm:h-[800px] bg-white sm:rounded-[40px] shadow-2xl overflow-hidden relative border-8 border-gray-900/5 sm:border-gray-900">
        
        {/* Screen Content */}
        {currentScreen === ScreenName.LANDING && <LandingScreen />}
        {currentScreen === ScreenName.STRESS_ASSESSMENT && <StressAssessmentScreen />}
        {currentScreen === ScreenName.JOURNALIST_INTRO && <JournalistIntroScreen />}
        {currentScreen === ScreenName.REGISTRATION && <RegistrationScreen />}
        {currentScreen === ScreenName.LOGIN && <LoginScreen />}
        {currentScreen === ScreenName.SELECTION && <SelectionScreen />}
        {currentScreen === ScreenName.SESSION && <SessionScreen />}
        {currentScreen === ScreenName.REPORT && <ReportScreen />}

        {/* Global UI Elements */}
        
        {/* AI Chat Floating Button (Except on Landing, Intro, Stress Check and Auth screens) */}
        {currentScreen !== ScreenName.LANDING && 
         currentScreen !== ScreenName.STRESS_ASSESSMENT && 
         currentScreen !== ScreenName.JOURNALIST_INTRO && 
         currentScreen !== ScreenName.REGISTRATION && 
         currentScreen !== ScreenName.LOGIN && (
            <button
                onClick={() => setIsChatOpen(true)}
                className="absolute bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40 hover:bg-indigo-700"
            >
                <Bot size={28} />
            </button>
        )}

        <AIChatOverlay isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      </div>
    </div>
  );
};

export default App;