import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  HardDrive, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Trash2, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle, 
  CalendarPlus, 
  FileText, 
  Download, 
  ShieldCheck, 
  Sparkles, 
  LogIn, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  initAuth, 
  googleSignIn, 
  logoutGoogle, 
  getAccessToken 
} from '../services/googleAuth';
import { 
  listDriveCommuteFiles, 
  saveReceiptToGoogleDrive, 
  deleteDriveFile, 
  DriveCommuteFile 
} from '../services/googleDrive';
import { 
  listCalendarEvents, 
  createCommuteCalendarEvent, 
  deleteCalendarEvent, 
  CalendarOfficeEvent 
} from '../services/googleCalendar';
import { useBooking } from '../context/BookingContext';

export const GoogleWorkspaceHub: React.FC = () => {
  const { activeTicket, refundHistory, selectedVehicle, selectedPickupStage, selectedDestStage } = useBooking();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Drive state
  const [driveFiles, setDriveFiles] = useState<DriveCommuteFile[]>([]);
  const [loadingDrive, setLoadingDrive] = useState<boolean>(false);
  const [driveSuccessMsg, setDriveSuccessMsg] = useState<string | null>(null);

  // Calendar state
  const [calendarEvents, setCalendarEvents] = useState<CalendarOfficeEvent[]>([]);
  const [loadingCalendar, setLoadingCalendar] = useState<boolean>(false);
  const [calendarSuccessMsg, setCalendarSuccessMsg] = useState<string | null>(null);

  // Confirmation modal state for destructive operations (MANDATORY per workspace skill)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionType: 'delete_drive' | 'delete_calendar';
    targetId: string;
  }>({
    isOpen: false,
    title: '',
    description: '',
    actionType: 'delete_drive',
    targetId: ''
  });

  // Check auth state on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setIsLoadingAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setIsLoadingAuth(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch Drive & Calendar data when token is ready
  useEffect(() => {
    if (token) {
      loadDriveFiles();
      loadCalendarEvents();
    }
  }, [token]);

  const handleSignIn = async () => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
      }
    } catch (err: any) {
      console.error('Google Sign In Failed:', err);
      setAuthError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutGoogle();
      setUser(null);
      setToken(null);
      setDriveFiles([]);
      setCalendarEvents([]);
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  const loadDriveFiles = async () => {
    setLoadingDrive(true);
    try {
      const files = await listDriveCommuteFiles();
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Failed to load drive files:', err);
    } finally {
      setLoadingDrive(false);
    }
  };

  const loadCalendarEvents = async () => {
    setLoadingCalendar(true);
    try {
      const events = await listCalendarEvents();
      setCalendarEvents(events);
    } catch (err: any) {
      console.error('Failed to load calendar events:', err);
    } finally {
      setLoadingCalendar(false);
    }
  };

  const handleSaveActiveReceiptToDrive = async () => {
    if (!token) return;
    setLoadingDrive(true);
    setDriveSuccessMsg(null);

    try {
      const receiptData = activeTicket
        ? {
            ticketId: activeTicket.id,
            vehicle: activeTicket.vehicleName,
            sacco: activeTicket.sacco,
            plate: activeTicket.plate,
            route: activeTicket.routeNumber,
            pickup: activeTicket.pickupStage,
            destination: activeTicket.destinationStage,
            fareKes: activeTicket.fareKes,
            seatNumber: activeTicket.seatNumber,
            status: activeTicket.status,
            bookingTime: activeTicket.bookingTime,
            insuranceGuarantee: '100% Zero-Loss M-Pesa Auto-Refund Protected by Urban Fishstick',
            savedAt: new Date().toISOString()
          }
        : {
            title: 'Urban Fishstick Nairobi Commute Pass & Expense Ledger',
            sampleVehicle: selectedVehicle?.name || 'Super Metro 044',
            fareKes: selectedVehicle?.fareKes || 70,
            guarantee: '100% Office Delay Auto-Refund Policy Protected',
            savedAt: new Date().toISOString()
          };

      const filename = `UrbanFishstick_Receipt_${Date.now()}`;
      await saveReceiptToGoogleDrive(filename, receiptData);
      setDriveSuccessMsg('✅ Commute receipt saved successfully to Google Drive!');
      await loadDriveFiles();
    } catch (err: any) {
      setAuthError(err.message || 'Failed to upload receipt to Google Drive');
    } finally {
      setLoadingDrive(false);
    }
  };

  const handleExportMonthlyLedgerToDrive = async () => {
    if (!token) return;
    setLoadingDrive(true);
    setDriveSuccessMsg(null);

    try {
      const ledger = {
        title: 'Monthly Nairobi Commute & Office Overtime Audit',
        user: user?.displayName || user?.email || 'Nairobi Commuter',
        generatedAt: new Date().toISOString(),
        totalFaresPaidKes: activeTicket ? activeTicket.fareKes : 1450,
        totalRefundsClaimedKes: refundHistory.reduce((sum, r) => sum + r.amountKes, 0),
        refundHistory: refundHistory,
        panicMinutesSaved: 180,
        provider: 'Urban Fishstick Guaranteed Transit'
      };

      const filename = `UrbanFishstick_Monthly_Ledger_${new Date().toISOString().slice(0, 7)}`;
      await saveReceiptToGoogleDrive(filename, ledger);
      setDriveSuccessMsg('✅ Monthly commute expense ledger exported to Google Drive!');
      await loadDriveFiles();
    } catch (err: any) {
      setAuthError(err.message || 'Failed to export ledger to Google Drive');
    } finally {
      setLoadingDrive(false);
    }
  };

  const handleAddCommuteToCalendar = async () => {
    if (!token) return;
    setLoadingCalendar(true);
    setCalendarSuccessMsg(null);

    try {
      const vehicleName = activeTicket?.vehicleName || selectedVehicle?.name || 'Super Metro 044';
      const route = activeTicket?.routeNumber || selectedVehicle?.routeNumber || 'Route 105';
      const pickup = activeTicket?.pickupStage || selectedPickupStage?.name || 'Kencom CBD';
      const dest = activeTicket?.destinationStage || selectedDestStage?.name || 'Westlands Stage';
      const seat = activeTicket?.seatNumber || 4;

      await createCommuteCalendarEvent({
        vehicleName,
        route,
        pickupStage: pickup,
        destinationStage: dest,
        seatNumber: seat,
        departureTimeStr: activeTicket?.departureTime || '18:15'
      });

      setCalendarSuccessMsg('✅ Matatu departure & office exit event added to Google Calendar!');
      await loadCalendarEvents();
    } catch (err: any) {
      setAuthError(err.message || 'Failed to create calendar event');
    } finally {
      setLoadingCalendar(false);
    }
  };

  // Execution of confirmed destructive action
  const executeDestructiveAction = async () => {
    const { actionType, targetId } = confirmModal;
    setConfirmModal(prev => ({ ...prev, isOpen: false }));

    if (actionType === 'delete_drive') {
      setLoadingDrive(true);
      try {
        await deleteDriveFile(targetId);
        setDriveSuccessMsg('File permanently deleted from Google Drive.');
        await loadDriveFiles();
      } catch (err: any) {
        setAuthError(err.message || 'Failed to delete file from Drive');
      } finally {
        setLoadingDrive(false);
      }
    } else if (actionType === 'delete_calendar') {
      setLoadingCalendar(true);
      try {
        await deleteCalendarEvent(targetId);
        setCalendarSuccessMsg('Calendar commute event removed.');
        await loadCalendarEvents();
      } catch (err: any) {
        setAuthError(err.message || 'Failed to delete calendar event');
      } finally {
        setLoadingCalendar(false);
      }
    }
  };

  return (
    <div id="google-workspace-hub" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google Workspace Sync</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              Google Drive & Google Calendar Integration
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Seamlessly sync your office meetings, auto-schedule matatu departures, and backup commute expense receipts directly into your official Google Drive and Google Calendar.
            </p>
          </div>

          {/* User Auth Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shrink-0 w-full sm:w-auto">
            {user ? (
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      referrerPolicy="no-referrer" 
                      className="w-10 h-10 rounded-full border border-emerald-400"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">
                      {user.displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold text-white truncate max-w-[150px]">{user.displayName}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{user.email}</div>
                  </div>
                </div>
                <button
                  id="google-sign-out-btn"
                  onClick={handleSignOut}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-xl bg-slate-900 border border-slate-800 transition-all"
                  title="Sign out of Google"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="google-sign-in-btn"
                onClick={handleSignIn}
                disabled={isLoadingAuth}
                className="gsi-material-button w-full sm:w-auto flex items-center justify-center gap-3 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl shadow-lg transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                <span>{isLoadingAuth ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>
        </div>

        {authError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{authError}</span>
          </div>
        )}
      </div>

      {/* Grid: Google Drive & Google Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Google Calendar Panel */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Google Calendar Office Sync</h3>
                  <span className="text-[11px] text-blue-400 font-medium">Automatic Overtime & Commute Matching</span>
                </div>
              </div>

              {token && (
                <button
                  onClick={loadCalendarEvents}
                  disabled={loadingCalendar}
                  className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 transition-all"
                  title="Refresh Calendar Events"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingCalendar ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              When your office meeting runs over, your calendar alerts you and lets you extend your matatu departure time without losing your booking.
            </p>

            {calendarSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300">
                {calendarSuccessMsg}
              </div>
            )}

            {/* Upcoming Calendar Events List */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400">Upcoming Office & Commute Events</div>

              {!token ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                  Sign in with Google above to see your office calendar meetings and schedule departures.
                </div>
              ) : loadingCalendar ? (
                <div className="p-4 text-center text-xs text-slate-400">Loading events from Google Calendar...</div>
              ) : calendarEvents.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                  No upcoming meetings found. Ready to schedule your Matatu Commute!
                </div>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {calendarEvents.map(event => (
                    <div
                      key={event.id}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 hover:border-blue-500/40 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{event.summary}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>
                            {event.start?.dateTime
                              ? new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : 'All day'}
                          </span>
                          {event.location && <span>• {event.location}</span>}
                        </div>
                      </div>

                      {event.summary?.includes('Urban Fishstick') && (
                        <button
                          onClick={() =>
                            setConfirmModal({
                              isOpen: true,
                              title: 'Cancel Calendar Commute Reminder?',
                              description: `Are you sure you want to remove "${event.summary}" from your Google Calendar?`,
                              actionType: 'delete_calendar',
                              targetId: event.id
                            })
                          }
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-all"
                          title="Remove from Calendar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          {token && (
            <button
              id="add-commute-calendar-btn"
              onClick={handleAddCommuteToCalendar}
              disabled={loadingCalendar}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Add Urban Fishstick Commute to Calendar</span>
            </button>
          )}
        </div>

        {/* Google Drive Panel */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Google Drive Commute Ledger</h3>
                  <span className="text-[11px] text-amber-400 font-medium">Receipts, Overtime Logs & Delay Certificates</span>
                </div>
              </div>

              {token && (
                <button
                  onClick={loadDriveFiles}
                  disabled={loadingDrive}
                  className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 transition-all"
                  title="Refresh Drive Files"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingDrive ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Back up all your transit tickets, M-Pesa fare receipts, and office overtime certificates directly into your Google Drive storage.
            </p>

            {driveSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300">
                {driveSuccessMsg}
              </div>
            )}

            {/* Google Drive Files List */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400">Saved Urban Fishstick Files in Google Drive</div>

              {!token ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                  Sign in with Google above to store and access receipts on your Google Drive.
                </div>
              ) : loadingDrive ? (
                <div className="p-4 text-center text-xs text-slate-400">Loading files from Google Drive...</div>
              ) : driveFiles.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                  No receipts saved on Google Drive yet. Click below to save your first transit receipt!
                </div>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {driveFiles.map(file => (
                    <div
                      key={file.id}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 hover:border-amber-500/40 transition-all"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                        <div className="truncate">
                          <div className="text-xs font-bold text-white truncate">{file.name}</div>
                          <div className="text-[10px] text-slate-400">
                            {file.createdTime ? new Date(file.createdTime).toLocaleDateString() : 'Recent'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-900 transition-all"
                            title="Open in Google Drive"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() =>
                            setConfirmModal({
                              isOpen: true,
                              title: 'Delete Google Drive Receipt?',
                              description: `Are you sure you want to permanently delete "${file.name}" from your Google Drive? This action cannot be undone.`,
                              actionType: 'delete_drive',
                              targetId: file.id
                            })
                          }
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-all"
                          title="Delete from Google Drive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {token && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <button
                id="save-receipt-drive-btn"
                onClick={handleSaveActiveReceiptToDrive}
                disabled={loadingDrive}
                className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Save Commute Receipt</span>
              </button>
              <button
                id="export-ledger-drive-btn"
                onClick={handleExportMonthlyLedgerToDrive}
                disabled={loadingDrive}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Export Monthly Ledger</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Destructive Operations (Required by workspace-integration skill) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{confirmModal.title}</h4>
                <span className="text-xs text-rose-400 font-semibold">User Confirmation Required</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {confirmModal.description}
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={executeDestructiveAction}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
