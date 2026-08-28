import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MatatuVehicle, 
  NairobiRoute, 
  INITIAL_MATATUS, 
  NAIROBI_ROUTES, 
  NAIROBI_STAGES,
  Stage 
} from '../data/nairobiRoutes';
import { matatuAudio } from '../utils/audioEffects';

export interface BookingTicket {
  id: string;
  vehicleId: string;
  vehicleName: string;
  sacco: string;
  routeNumber: string;
  plate: string;
  pickupStage: string;
  destinationStage: string;
  seatNumber: number;
  fareKes: number;
  bookingTime: string;
  departureTime: string;
  secondsUntilDeparture: number;
  status: 'confirmed' | 'onboard' | 'delayed_refunded' | 'completed' | 'dropped_off';
  qrCodeSeed: string;
  alightingRequested?: boolean;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: 'passenger' | 'conductor' | 'driver' | 'system';
  vehicleId: string;
  text: string;
  shengTranslation?: string;
  timestamp: string;
  isImportant?: boolean;
}

export interface RefundLog {
  id: string;
  bookingId: string;
  vehicleName: string;
  amountKes: number;
  reason: string;
  timestamp: string;
  method: 'M-PESA' | 'WALLET';
}

interface BookingContextType {
  // State
  walletBalance: number;
  userRole: 'passenger' | 'conductor';
  setUserRole: (role: 'passenger' | 'conductor') => void;
  language: 'sheng' | 'english' | 'swahili';
  setLanguage: (lang: 'sheng' | 'english' | 'swahili') => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  
  // Vehicles & Routes
  vehicles: MatatuVehicle[];
  selectedVehicle: MatatuVehicle | null;
  setSelectedVehicle: (matatu: MatatuVehicle | null) => void;
  selectedRoute: NairobiRoute | null;
  setSelectedRoute: (route: NairobiRoute | null) => void;
  selectedPickupStage: Stage | null;
  setSelectedPickupStage: (stage: Stage | null) => void;
  selectedDestStage: Stage | null;
  setSelectedDestStage: (stage: Stage | null) => void;

  // Active Booking
  activeTicket: BookingTicket | null;
  ticketHistory: BookingTicket[];
  refundHistory: RefundLog[];
  bookSeat: (vehicle: MatatuVehicle, seatNumber: number, pickup: string, dest: string) => boolean;
  cancelAndRefund: (ticketId: string, reason?: string) => void;
  requestDropMeHere: () => void;
  
  // Conductor Operations
  conductorActiveVehicleId: string;
  setConductorActiveVehicleId: (id: string) => void;
  confirmPassengerBoarding: (ticketId: string) => void;
  triggerConductorHorn: () => void;
  triggerConductorTap: () => void;
  triggerDeparture: (vehicleId: string) => void;

  // In-App Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string, isQuickReply?: boolean) => void;

  // Notification Banner
  activeAlert: { message: string; type: 'success' | 'warning' | 'info' | 'refund' } | null;
  dismissAlert: () => void;
  triggerAudioHorn: () => void;
  triggerAudioDropBell: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState<number>(1850);
  const [userRole, setUserRole] = useState<'passenger' | 'conductor'>('passenger');
  const [language, setLanguage] = useState<'sheng' | 'english' | 'swahili'>('sheng');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [vehicles, setVehicles] = useState<MatatuVehicle[]>(INITIAL_MATATUS);
  const [selectedVehicle, setSelectedVehicle] = useState<MatatuVehicle | null>(INITIAL_MATATUS[0]);
  const [selectedRoute, setSelectedRoute] = useState<NairobiRoute | null>(NAIROBI_ROUTES[0]);
  const [selectedPickupStage, setSelectedPickupStage] = useState<Stage | null>(NAIROBI_STAGES[0]);
  const [selectedDestStage, setSelectedDestStage] = useState<Stage | null>(NAIROBI_STAGES[5]);

  const [activeTicket, setActiveTicket] = useState<BookingTicket | null>(null);
  const [ticketHistory, setTicketHistory] = useState<BookingTicket[]>([]);
  const [refundHistory, setRefundHistory] = useState<RefundLog[]>([
    {
      id: 'ref-091',
      bookingId: 'BKG-9921-WESTY',
      vehicleName: 'Super Metro 044',
      amountKes: 70,
      reason: 'Office late meeting - Auto-refund policy triggered',
      timestamp: 'Yesterday 18:32',
      method: 'M-PESA'
    }
  ]);

  const [conductorActiveVehicleId, setConductorActiveVehicleId] = useState<string>('mat-001');
  const [activeAlert, setActiveAlert] = useState<{ message: string; type: 'success' | 'warning' | 'info' | 'refund' } | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      senderName: 'Otieno (Donda)',
      senderRole: 'conductor',
      vehicleId: 'mat-001',
      text: 'Wazi wasee! Super Metro 044 iko Kencom, tunangoja viti nne tuondoke.',
      shengTranslation: 'Greetings all! Super Metro 044 is at Kencom, waiting for 4 seats before departing.',
      timestamp: '18:02',
      isImportant: true
    },
    {
      id: 'msg-2',
      senderName: 'Wanjiku (Office UpperHill)',
      senderRole: 'passenger',
      vehicleId: 'mat-001',
      text: 'Niko kwa lift nateremka, nimebook seat 4!',
      shengTranslation: 'I am taking the elevator down from the office, seat 4 booked!',
      timestamp: '18:04'
    },
    {
      id: 'msg-3',
      senderName: 'Dere Mwangi',
      senderRole: 'driver',
      vehicleId: 'mat-001',
      text: 'Waiyaki Way iko rada safi leo, hakuna jam hadi Westlands.',
      shengTranslation: 'Waiyaki Way is completely clear today, no traffic up to Westlands.',
      timestamp: '18:06'
    }
  ]);

  // Handle sound preference
  useEffect(() => {
    matatuAudio.toggleSound(soundEnabled);
  }, [soundEnabled]);

  // Live simulation of vehicle movement and ticket countdown
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Move vehicles slightly along road coordinates
      setVehicles(prevVehicles =>
        prevVehicles.map(veh => {
          // Slight jitter/movement for live tracking feel
          const deltaLat = (Math.random() - 0.48) * 0.0006;
          const deltaLng = (Math.random() - 0.48) * 0.0006;
          const newSpeed = veh.status === 'boarding' ? Math.max(0, Math.min(15, veh.speedKmh + (Math.random() * 4 - 2))) : Math.min(80, Math.max(20, veh.speedKmh + (Math.random() * 6 - 3)));

          return {
            ...veh,
            currentLat: veh.currentLat + deltaLat,
            currentLng: veh.currentLng + deltaLng,
            speedKmh: Math.round(newSpeed)
          };
        })
      );

      // 2. Count down active ticket if present
      setActiveTicket(prevTicket => {
        if (!prevTicket || prevTicket.status !== 'confirmed') return prevTicket;

        if (prevTicket.secondsUntilDeparture <= 1) {
          // Time expired and user didn't board! Auto refund policy triggers!
          cancelAndRefund(prevTicket.id, 'Office delay departure limit reached (Auto-Refund)');
          return null;
        }

        return {
          ...prevTicket,
          secondsUntilDeparture: prevTicket.secondsUntilDeparture - 1
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTicket]);

  const triggerAudioHorn = () => {
    matatuAudio.playHorn();
  };

  const triggerAudioDropBell = () => {
    matatuAudio.playDropBell();
  };

  const bookSeat = (
    vehicle: MatatuVehicle, 
    seatNumber: number, 
    pickup: string, 
    dest: string
  ): boolean => {
    if (walletBalance < vehicle.fareKes) {
      setActiveAlert({
        message: 'Bob zako zimeisha kwa wallet! Please top up your M-Pesa balance.',
        type: 'warning'
      });
      return false;
    }

    // Deduct fare
    setWalletBalance(prev => prev - vehicle.fareKes);

    // Update vehicle seats
    setVehicles(prev =>
      prev.map(v =>
        v.id === vehicle.id
          ? { ...v, availableSeats: Math.max(0, v.availableSeats - 1) }
          : v
      )
    );

    const departureSeconds = 4 * 60; // 4 minutes window for office workers to reach stage
    const newTicket: BookingTicket = {
      id: `BKG-${Math.floor(1000 + Math.random() * 9000)}-${pickup.substring(0, 4).toUpperCase()}`,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      sacco: vehicle.sacco,
      routeNumber: vehicle.routeNumber,
      plate: vehicle.plate,
      pickupStage: pickup,
      destinationStage: dest,
      seatNumber: seatNumber,
      fareKes: vehicle.fareKes,
      bookingTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      departureTime: vehicle.departureTime,
      secondsUntilDeparture: departureSeconds,
      status: 'confirmed',
      qrCodeSeed: `NRB-MATATU-${Date.now()}-${seatNumber}`,
      alightingRequested: false
    };

    setActiveTicket(newTicket);
    setTicketHistory(prev => [newTicket, ...prev]);

    matatuAudio.playHorn();

    setActiveAlert({
      message: `Wazi mkubwa! Seat #${seatNumber} imelockiwa kwa ${vehicle.name}. Una dk 4 kufika stage.`,
      type: 'success'
    });

    // Add automated conductor greeting to chat
    setChatMessages(prev => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        senderName: `${vehicle.conductorName}`,
        senderRole: 'conductor',
        vehicleId: vehicle.id,
        text: `Karibu bro/sis! Seat yako #${seatNumber} imewekwa reservation. Gari itatoka kwa ${vehicle.departureTime}.`,
        shengTranslation: `Welcome! Your seat #${seatNumber} is secured. Matatu departs at ${vehicle.departureTime}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isImportant: true
      }
    ]);

    return true;
  };

  const cancelAndRefund = (ticketId: string, reason: string = 'Commuter Office Delay Request') => {
    if (!activeTicket || activeTicket.id !== ticketId) return;

    const refundAmount = activeTicket.fareKes;
    setWalletBalance(prev => prev + refundAmount);

    // Release seat back
    setVehicles(prev =>
      prev.map(v =>
        v.id === activeTicket.vehicleId
          ? { ...v, availableSeats: Math.min(v.totalSeats, v.availableSeats + 1) }
          : v
      )
    );

    const log: RefundLog = {
      id: `REF-${Date.now().toString().slice(-4)}`,
      bookingId: ticketId,
      vehicleName: activeTicket.vehicleName,
      amountKes: refundAmount,
      reason,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      method: 'M-PESA'
    };

    setRefundHistory(prev => [log, ...prev]);
    setActiveTicket(prev => prev ? { ...prev, status: 'delayed_refunded' } : null);

    matatuAudio.playRefundChime();

    setActiveAlert({
      message: `Usistress buda! Matatu imeondoka, bob zako KES ${refundAmount} zimerudi chap chap kwa M-Pesa/Wallet!`,
      type: 'refund'
    });

    // Notify chat
    setChatMessages(prev => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        senderName: 'Nganya Auto-Refund Bot',
        senderRole: 'system',
        vehicleId: activeTicket.vehicleId,
        text: `Seat #${activeTicket.seatNumber} imeachiliwa. KES ${refundAmount} refund imeingia kwa M-Pesa papo hapo.`,
        shengTranslation: `Seat #${activeTicket.seatNumber} released. KES ${refundAmount} refunded instantly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const requestDropMeHere = () => {
    if (!activeTicket) return;

    setActiveTicket(prev => prev ? { ...prev, alightingRequested: true } : null);
    matatuAudio.playDropBell();

    setActiveAlert({
      message: '🔔 "Nishushe Hapo!" Signal sent to Conductor & Driver dashboard. Stage bell rang!',
      type: 'info'
    });

    // Broadcast to chat
    setChatMessages(prev => [
      ...prev,
      {
        id: `drop-${Date.now()}`,
        senderName: 'Seat #04 (Passenger)',
        senderRole: 'passenger',
        vehicleId: activeTicket.vehicleId,
        text: '🔔 Donda nishushe hapo kwa stage ya mbele tafadhali!',
        shengTranslation: 'Conductor please drop me off at the next upcoming stage!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isImportant: true
      }
    ]);
  };

  const confirmPassengerBoarding = (ticketId: string) => {
    setActiveTicket(prev => prev && prev.id === ticketId ? { ...prev, status: 'onboard' } : prev);
    matatuAudio.playBodyworkTap();
    setActiveAlert({
      message: 'Passenger checked in & safely on board!',
      type: 'success'
    });
  };

  const triggerConductorHorn = () => {
    matatuAudio.playHorn();
  };

  const triggerConductorTap = () => {
    matatuAudio.playBodyworkTap();
  };

  const triggerDeparture = (vehicleId: string) => {
    matatuAudio.playBodyworkTap();
    matatuAudio.playHorn();
    
    setVehicles(prev =>
      prev.map(v => (v.id === vehicleId ? { ...v, status: 'on_route', speedKmh: 48 } : v))
    );

    setActiveAlert({
      message: 'Nganya imeng\'oa nanga! Route is moving smoothly.',
      type: 'success'
    });
  };

  const sendChatMessage = (text: string, isQuickReply: boolean = false) => {
    if (!text.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: userRole === 'conductor' ? 'Makanga / Donda' : 'You (Passenger)',
      senderRole: userRole,
      vehicleId: selectedVehicle?.id || 'mat-001',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isImportant: isQuickReply
    };

    setChatMessages(prev => [...prev, newMessage]);

    // Play light click sound
    if (userRole === 'conductor') {
      matatuAudio.playCoinShake();
    }
  };

  const dismissAlert = () => setActiveAlert(null);

  return (
    <BookingContext.Provider
      value={{
        walletBalance,
        userRole,
        setUserRole,
        language,
        setLanguage,
        soundEnabled,
        setSoundEnabled,
        vehicles,
        selectedVehicle,
        setSelectedVehicle,
        selectedRoute,
        setSelectedRoute,
        selectedPickupStage,
        setSelectedPickupStage,
        selectedDestStage,
        setSelectedDestStage,
        activeTicket,
        ticketHistory,
        refundHistory,
        bookSeat,
        cancelAndRefund,
        requestDropMeHere,
        conductorActiveVehicleId,
        setConductorActiveVehicleId,
        confirmPassengerBoarding,
        triggerConductorHorn,
        triggerConductorTap,
        triggerDeparture,
        chatMessages,
        sendChatMessage,
        activeAlert,
        dismissAlert,
        triggerAudioHorn,
        triggerAudioDropBell
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
