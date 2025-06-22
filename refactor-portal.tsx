import React, { useState, useEffect, useMemo, useRef } from "react";
import ReactDOM from 'react-dom/client';

/*
===================================================================================
    INTERFACES & TYPES
===================================================================================
*/

interface ClassBooking {
  id: string;
  className: string;
  instructor: string;
  dateTime: Date;
  status: "completed" | "upcoming" | "cancelled";
}

interface MembershipPlan {
  planId: number;
  name: string;
  creditsPerMonth: number;
  guestPassesPerMonth: number;
  workshopsPerMonth: number;
  price: number;
  features: string[];
}

interface Referral {
  id:string;
  name: string;
  joinDate: string; 
  creditsEarned: number;
  status: "pending" | "completed";
}

interface User {
  name: string;
  email: string;
  initials: string;
}

interface UsageData {
  classesUsed: number;
  classesTotal: number;
  guestPassesUsed: number;
  guestPassesTotal: number;
  workshopsAttended: number;
  workshopsTotal: number;
}

/*
===================================================================================
    ICON COMPONENTS
===================================================================================
*/

const IconCheck = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
);

const IconChevronRight = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
);

const IconChevronLeft = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
);

const IconCreditCard = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
);

const IconGift = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 13l-4-4h8l-4 4zm0-13a2 2 0 00-2 2h4a2 2 0 00-2-2z" /></svg>
);

const IconHistory = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const IconHome = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
);

const IconCalendar = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
);

const IconCopy = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
);

const IconUser = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);

/*
===================================================================================
    GLOBAL STYLES COMPONENT
===================================================================================
*/
const GlobalStyles = () => (
  <style>{`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    body {
      font-family: 'Inter', sans-serif;
      background-color: #020617;
      color: #e2e8f0;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    *, *::before, *::after {
      box-sizing: inherit;
    }

    /* UX FIX: Custom scrollbar styling */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #0f172a; /* slate-900 */
    }
    ::-webkit-scrollbar-thumb {
      background-color: #334155; /* slate-700 */
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background-color: #475569; /* slate-600 */
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-out forwards;
    }
  `}</style>
);


/*
===================================================================================
    CHILD COMPONENTS
===================================================================================
*/

const Header = ({ user, onLogout }: { user: User | null; onLogout: () => void; }) => {
    // UX FIX: State to manage the user dropdown with a delay on mouse leave
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const timerRef = useRef<number | null>(null);

    const handleMouseEnter = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setDropdownVisible(true);
    };

    const handleMouseLeave = () => {
        timerRef.current = window.setTimeout(() => {
            setDropdownVisible(false);
        }, 300); // 300ms delay before closing
    };

    return (
        <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
            <div className="px-6 py-4 flex items-center justify-between">
                <h1 className="font-bold text-xl text-white">FitStudio Members</h1>
                <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
                        {user?.initials || 'U'}
                    </div>
                    {isDropdownVisible && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg animate-fadeIn">
                            <div className="px-4 py-3 border-b border-slate-700">
                                <div className="font-semibold text-white truncate">{user?.name}</div>
                                <div className="text-sm text-slate-400 truncate">{user?.email}</div>
                            </div>
                            <div className="p-1">
                                <button onClick={onLogout} className="w-full text-left flex items-center px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-md transition-colors">
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

const Sidebar = ({ activeTab, onTabClick }: { activeTab: string; onTabClick: (tab: string) => void; }) => {
    const sidebarItems = [
        { id: "dashboard", icon: IconHome, label: "Dashboard" },
        { id: "bookings", icon: IconHistory, label: "Booking History" },
        { id: "membership", icon: IconCreditCard, label: "Membership" },
        { id: "calendar", icon: IconCalendar, label: "Calendar" },
        { id: "referrals", icon: IconGift, label: "Referrals" },
    ];
    return (
        <aside className="w-64 p-4 border-r border-slate-800">
            <nav className="space-y-2">
                {sidebarItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabClick(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-300 ${
                            activeTab === item.id
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
};

const ToggleSwitch = ({ enabled, onChange, disabled = false }: { enabled: boolean; onChange: () => void; disabled?: boolean; }) => (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`${enabled ? 'bg-blue-600' : 'bg-slate-700'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <span
        aria-hidden="true"
        className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
);


const UsageMeter = ({ label, used, total }: { label: string, used: number, total: number }) => {
    const percentage = total > 0 ? (used / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between items-center mb-1 text-sm">
                <span className="text-slate-400">{label}</span>
                <span className="font-medium text-slate-200">{used} / {total}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}/>
            </div>
        </div>
    );
};

const Dashboard = ({ usageData, isAutoRenewalOn, isMembershipFrozen, totalReferralCredits }: { usageData: UsageData, isAutoRenewalOn: boolean, isMembershipFrozen: boolean, totalReferralCredits: number }) => (
    <div className="space-y-6 animate-fadeIn">
        <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Your Credits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors">
                    <p className="text-sm text-slate-400">Remaining Credits</p>
                    <p className="text-3xl font-bold text-blue-400">{usageData.classesTotal - usageData.classesUsed}</p>
                    <p className="text-xs text-slate-500">of {usageData.classesTotal} total</p>
                </div>
                 <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors">
                    <p className="text-sm text-slate-400">Referral Credits</p>
                    <p className="text-3xl font-bold text-emerald-400">{totalReferralCredits}</p>
                    <p className="text-xs text-slate-500">earned</p>
                </div>
                 <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors">
                    <p className="text-sm text-slate-400">Next Renewal</p>
                    <p className="text-xl font-bold text-white">July 6, 2025</p>
                    {isMembershipFrozen ? (
                         <p className="text-xs text-yellow-400">Membership Frozen</p>
                    ) : (
                         <p className={`text-xs ${isAutoRenewalOn ? 'text-emerald-400' : 'text-red-400'}`}>
                            Auto-renewal {isAutoRenewalOn ? 'ON' : 'OFF'}
                         </p>
                    )}
                </div>
            </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Benefits Usage</h2>
            <div className="space-y-4">
                <UsageMeter label="Classes" used={usageData.classesUsed} total={usageData.classesTotal} />
                <UsageMeter label="Guest Passes" used={usageData.guestPassesUsed} total={usageData.guestPassesTotal} />
                <UsageMeter label="Workshops" used={usageData.workshopsAttended} total={usageData.workshopsTotal} />
            </div>
        </div>
    </div>
);

const BookingHistory = ({ bookings }: { bookings: ClassBooking[] }) => (
    <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 animate-fadeIn">
        <h2 className="text-xl font-bold text-white mb-4">Booking History</h2>
        <div className="space-y-3">
            {bookings.map(booking => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
                    <div>
                        <p className="font-semibold text-white">{booking.className}</p>
                        <p className="text-sm text-slate-400">with {booking.instructor}</p>
                        <p className="text-sm text-slate-500">{booking.dateTime.toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        booking.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                        booking.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-red-500/10 text-red-400'
                    }`}>
                        {booking.status}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

const Membership = ({ currentPlanId, plans, onPlanChange, isAutoRenewalOn, onToggleAutoRenewal, isMembershipFrozen, onToggleFreeze }: { currentPlanId: number; plans: MembershipPlan[]; onPlanChange: (id: number) => void; isAutoRenewalOn: boolean; onToggleAutoRenewal: () => void; isMembershipFrozen: boolean; onToggleFreeze: () => void; }) => (
    <div className="space-y-6 animate-fadeIn">
        <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Membership Settings</h2>
            <div className="space-y-4">
                 {/* UX FIX: Implemented logic to disable auto-renewal when membership is frozen */}
                <div className={`flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700 transition-opacity ${isMembershipFrozen ? 'opacity-50' : ''}`}>
                    <div>
                        <h3 className={`font-semibold transition-colors ${isMembershipFrozen ? 'text-slate-500' : 'text-white'}`}>Auto-Renewal</h3>
                        <p className="text-sm text-slate-400">
                            {isMembershipFrozen ? 'Disabled while membership is frozen.' : 'Your plan will renew automatically.'}
                        </p>
                    </div>
                    <ToggleSwitch 
                        enabled={isAutoRenewalOn} 
                        onChange={onToggleAutoRenewal}
                        disabled={isMembershipFrozen} 
                    />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
                     <div>
                        <h3 className="font-semibold text-white">Freeze Membership</h3>
                        <p className="text-sm text-slate-400">{isMembershipFrozen ? 'Your membership is currently frozen.' : 'Temporarily pause your plan.'}</p>
                    </div>
                    <ToggleSwitch enabled={isMembershipFrozen} onChange={onToggleFreeze} />
                </div>
            </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Change Membership Plan</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <div key={plan.planId} className={`p-6 rounded-lg border-2 transition-all ${currentPlanId === plan.planId ? 'border-blue-500 bg-slate-800' : 'border-slate-700 bg-slate-900 hover:border-slate-500'}`}>
                        <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                        <p className="text-3xl font-bold my-2 text-white">${plan.price}<span className="text-sm font-normal text-slate-400">/month</span></p>
                        <ul className="space-y-2 mb-6 text-sm text-slate-300">
                            {plan.features.map(feature => (
                                <li key={feature} className="flex items-start">
                                    <IconCheck className="w-4 h-4 mr-2 mt-0.5 text-emerald-400 flex-shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button 
                            onClick={() => onPlanChange(plan.planId)}
                            disabled={currentPlanId === plan.planId}
                            className="w-full py-2.5 rounded-md font-semibold text-sm transition-colors disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-600 disabled:text-slate-400"
                        >
                            {currentPlanId === plan.planId ? 'Current Plan' : 'Select Plan'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const CalendarView = ({ bookings, renewalDate }: { bookings: ClassBooking[], renewalDate: Date }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const changeMonth = (amount: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + amount);
            return newDate;
        });
    };
    
    const dayHasEvent = (day: number) => {
        return bookings.some(b => 
            b.dateTime.getFullYear() === currentDate.getFullYear() &&
            b.dateTime.getMonth() === currentDate.getMonth() &&
            b.dateTime.getDate() === day
        );
    };

    const isRenewalDay = (day: number) => {
        return renewalDate.getFullYear() === currentDate.getFullYear() &&
               renewalDate.getMonth() === currentDate.getMonth() &&
               renewalDate.getDate() === day;
    };
    
    const selectedDayEvents = useMemo(() => {
        if (!selectedDay) return [];
        return bookings.filter(b => 
            b.dateTime.getFullYear() === selectedDay.getFullYear() &&
            b.dateTime.getMonth() === selectedDay.getMonth() &&
            b.dateTime.getDate() === selectedDay.getDate()
        );
    }, [selectedDay, bookings]);


    return (
        <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="lg:col-span-2 bg-slate-800/50 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-700 transition-colors"><IconChevronLeft /></button>
                    <h2 className="text-xl font-bold text-white">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-700 transition-colors"><IconChevronRight /></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const isSelected = selectedDay?.getDate() === day && selectedDay?.getMonth() === currentDate.getMonth();
                        return (
                            <button 
                                key={day} 
                                onClick={() => setSelectedDay(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                                className={`h-12 w-full rounded-lg flex items-center justify-center relative transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-slate-700'}`}
                            >
                                {day}
                                {(dayHasEvent(day) || isRenewalDay(day)) && <span className={`absolute bottom-2 h-1.5 w-1.5 rounded-full ${isRenewalDay(day) ? 'bg-red-500' : 'bg-emerald-500'}`}></span>}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="lg:col-span-1 bg-slate-800/50 border border-slate-800 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4">
                    {selectedDay ? selectedDay.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' }) : "Select a day"}
                </h3>
                <div className="space-y-3">
                    {selectedDay && isRenewalDay(selectedDay.getDate()) && (
                         <div className="p-3 bg-red-500/10 text-red-400 rounded-lg text-sm">
                            Membership Renewal
                        </div>
                    )}
                    {selectedDay && selectedDayEvents.length > 0 ? (
                        selectedDayEvents.map(event => (
                            <div key={event.id} className="p-3 bg-slate-900 border border-slate-700 rounded-lg">
                                <p className="font-semibold text-white">{event.className}</p>
                                <p className="text-sm text-slate-400">{event.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        ))
                    ) : selectedDay ? (
                        <p className="text-slate-400 text-sm">No events scheduled.</p>
                    ) : (
                         <p className="text-slate-400 text-sm">Select a day on the calendar to see scheduled events.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const Referrals = ({ referrals, onAddReferral, referralCode }: { referrals: Referral[], onAddReferral: (name: string) => void, referralCode: string }) => {
    const [referralName, setReferralName] = useState("");
    const [isCopied, setIsCopied] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddReferral(referralName);
        setReferralName("");
    };
    
    const handleCopyCode = () => {
        navigator.clipboard.writeText(referralCode);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
         <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-2">Referral Program</h2>
                <p className="text-sm text-slate-400 mb-6">Earn 2 bonus credits for each friend who joins!</p>
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                    <label className="text-sm font-medium text-slate-400">Your Referral Code</label>
                    <div className="flex items-center gap-4 mt-2">
                        <p className="flex-grow p-3 bg-slate-800 rounded-md font-mono text-lg text-white text-center tracking-widest">{referralCode}</p>
                        <button onClick={handleCopyCode} className="flex-shrink-0 px-4 py-2.5 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <IconCopy className="w-4 h-4" />
                            {isCopied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Your Referrals</h2>
                <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
                    <input
                        type="text"
                        value={referralName}
                        onChange={(e) => setReferralName(e.target.value)}
                        placeholder="Add a new referral's name..."
                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="px-5 py-2.5 bg-slate-700 text-white rounded-md text-sm font-semibold hover:bg-slate-600 transition-colors">Add</button>
                </form>
                <div className="space-y-3">
                    {referrals.map(ref => (
                         <div key={ref.id} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
                            <div>
                                <p className="font-semibold text-white">{ref.name}</p>
                                <p className="text-sm text-slate-400">Joined on {ref.joinDate}</p>
                            </div>
                            <div className="text-right">
                                {ref.status === "completed" ? (
                                    <>
                                        <p className="font-medium text-emerald-400">+{ref.creditsEarned} Credits</p>
                                        <p className="text-xs text-slate-500">Earned</p>
                                    </>
                                ) : (
                                     <p className="font-medium text-yellow-400">Pending</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
         </div>
    );
};

// Enhanced LoginView with improved and stricter validation for full name
const LoginView = ({ onLogin }: { onLogin: (name: string) => void }) => {
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = name.trim();

        // Rule 1: Required
        if (trimmedName === "") {
            setError("Full name is required.");
            return;
        }

        // Rule 2: Minimum Length
        if (trimmedName.length < 3) {
            setError("Full name must be at least 3 characters long.");
            return;
        }

        // Rule 3: Must contain at least one letter (Unicode support)
        const hasLetter = /\p{L}/u.test(trimmedName);
        if (!hasLetter) {
            setError("Please enter a valid name containing letters.");
            return;
        }

        // Rule 4: Must not contain numbers or special characters (only letters and spaces allowed)
        // Accepts names with multiple words, accents, and ignores leading/trailing/multiple spaces
        // Allows only Unicode letters and spaces
        const validFullName = /^([\p{L}]+(?: [\p{L}]+)+)$/u;
        if (!validFullName.test(trimmedName)) {
            setError("Please enter your full name (letters and spaces only, at least two words).");
            return;
        }

        // All validations passed
        setError("");
        onLogin(trimmedName);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950">
            <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2940&auto=format&fit=crop')"}}></div>
            <form onSubmit={handleSubmit} className="w-full max-w-sm p-8 space-y-6 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl shadow-blue-500/10">
                <div className="text-center animate-fadeIn" style={{ animationDelay: '100ms' }}>
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="text-slate-400 mt-2">Sign in to your FitStudio portal.</p>
                </div>
                <div className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <IconUser className="w-5 h-5 text-slate-500" />
                        </span>
                        <input 
                            id="username"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Jane Doe"
                            className={`w-full pl-10 p-3 bg-slate-800 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 transition-shadow ${error ? 'border-red-500' : 'border-slate-700'}`}
                        />
                    </div>
                    {/* Show custom error message if it exists */}
                    {error && (
                        <p className="text-red-400 text-sm mt-2 animate-fadeIn">{error}</p>
                    )}
                </div>
                <div className="animate-fadeIn" style={{ animationDelay: '300ms' }}>
                    <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors transform hover:scale-105">
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
};


/* 
===================================================================================
    MAIN APP COMPONENT (The Orchestrator)
===================================================================================
*/

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentPlanId, setCurrentPlanId] = useState(1);
    const [isAutoRenewalOn, setIsAutoRenewalOn] = useState(true);
    const [isMembershipFrozen, setIsMembershipFrozen] = useState(false);
    
    const initialReferralsData = useMemo<Referral[]>(() => [
        { id: "1", name: "John Smith", joinDate: "2024-01-10", creditsEarned: 2, status: "completed" },
        { id: "2", name: "Lisa Chen", joinDate: "2024-01-15", creditsEarned: 0, status: "pending" },
    ], []);

    const [referrals, setReferrals] = useState(initialReferralsData);

    const [usageData, setUsageData] = useState<UsageData>({
        classesUsed: 5,
        classesTotal: 0,
        guestPassesUsed: 1,
        guestPassesTotal: 0,
        workshopsAttended: 0,
        workshopsTotal: 0,
    });

    const plans = useMemo<MembershipPlan[]>(() => [
        { planId: 1, name: "Premium Monthly", creditsPerMonth: 12, guestPassesPerMonth: 2, workshopsPerMonth: 1, price: 149, features: ["12 classes/month", "Access to all locations", "2 Guest passes/month", "Priority booking"] },
        { planId: 2, name: "Unlimited Monthly", creditsPerMonth: 30, guestPassesPerMonth: 4, workshopsPerMonth: 2, price: 199, features: ["Unlimited classes", "All Premium features", "4 guest passes/month", "Personal training discount"] },
        { planId: 3, name: "Annual Premium", creditsPerMonth: 36, guestPassesPerMonth: 5, workshopsPerMonth: 4, price: 250, features: ["Unlimited Classes", "Access to all locations", "Unlimited Guest Passes", "Exclusive workshops"] },
    ], []);

    const initialBookingHistory = useMemo<ClassBooking[]>(() => [
        { id: "1", className: "Power Yoga", instructor: "Sarah Johnson", dateTime: new Date("2025-06-01T09:00"), status: "completed" },
        { id: "2", className: "HIIT Training", instructor: "Mike Chen", dateTime: new Date("2025-06-03T18:00"), status: "completed" },
        { id: "3", className: "Pilates Core", instructor: "Emma Wilson", dateTime: new Date("2025-07-06T10:00"), status: "upcoming" },
        { id: "4", className: "Spin Class", instructor: "David Lee", dateTime: new Date("2025-07-18T17:30"), status: "upcoming" },
    ], []);
    
    const totalReferralCredits = useMemo(() => {
        return referrals.reduce((sum, ref) => sum + ref.creditsEarned, 0);
    }, [referrals]);
    
    const RENEWAL_DATE = useMemo(() => new Date("2025-07-06"), []);
    const REFERRAL_CODE = "FITNESS2025";

    useEffect(() => {
        const selectedPlan = plans.find(p => p.planId === currentPlanId);
        if (selectedPlan) {
            setUsageData(prevUsage => ({
                ...prevUsage,
                classesTotal: selectedPlan.creditsPerMonth,
                guestPassesTotal: selectedPlan.guestPassesPerMonth,
                workshopsTotal: selectedPlan.workshopsPerMonth,
            }));
        }
    }, [currentPlanId, plans]);

    const handleLogin = (userName: string) => {
        if (userName.trim()) {
            const initials = userName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
            setCurrentUser({
                name: userName,
                email: `${userName.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/, '')}@example.com`,
                initials: initials
            });
        }
    };
    
    const handleLogout = () => {
        setCurrentUser(null);
        setActiveTab("dashboard");
    };

    const handleToggleAutoRenewal = () => setIsAutoRenewalOn(prev => !prev);
    const handleToggleFreeze = () => setIsMembershipFrozen(prev => !prev);
    
    const handleAddReferral = (name: string) => {
        if (!name.trim()) return;
        const newReferral: Referral = {
            id: Date.now().toString(),
            name,
            joinDate: new Date().toISOString().split('T')[0],
            creditsEarned: 0,
            status: "pending",
        };
        setReferrals(prev => [newReferral, ...prev]);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard usageData={usageData} isAutoRenewalOn={isAutoRenewalOn} isMembershipFrozen={isMembershipFrozen} totalReferralCredits={totalReferralCredits} />;
            case 'bookings':
                return <BookingHistory bookings={initialBookingHistory} />;
            case 'membership':
                return <Membership 
                            currentPlanId={currentPlanId} 
                            plans={plans} 
                            onPlanChange={setCurrentPlanId}
                            isAutoRenewalOn={isAutoRenewalOn}
                            onToggleAutoRenewal={handleToggleAutoRenewal}
                            isMembershipFrozen={isMembershipFrozen}
                            onToggleFreeze={handleToggleFreeze}
                        />;
            case 'calendar':
                return <CalendarView bookings={initialBookingHistory} renewalDate={RENEWAL_DATE} />;
            case 'referrals':
                return <Referrals referrals={referrals} onAddReferral={handleAddReferral} referralCode={REFERRAL_CODE} />;
            default:
                return <Dashboard usageData={usageData} isAutoRenewalOn={isAutoRenewalOn} isMembershipFrozen={isMembershipFrozen} totalReferralCredits={totalReferralCredits} />;
        }
    };

    if (!currentUser) {
        return (
            <>
                <GlobalStyles />
                <LoginView onLogin={handleLogin} />
            </>
        );
    }

    return (
        <>
            <GlobalStyles />
            <div className="flex min-h-screen">
                <Sidebar activeTab={activeTab} onTabClick={setActiveTab} />
                <div className="flex-1 flex flex-col">
                    <Header user={currentUser} onLogout={handleLogout} />
                    <main className="flex-1 p-6 lg:p-8">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </>
    );
};

export default App;

/*
===================================================================================
    ROOT RENDER BLOCK
===================================================================================
*/

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}