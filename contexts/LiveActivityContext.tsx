
import { LiveActivityState, useLiveActivityActions } from '@/hooks/useLiveActivityActions';
import React, { createContext, ReactNode, useContext, useReducer } from 'react';

interface LiveActivityContextType {
  state: LiveActivityState;
  actions: {
    startLiveActivity: (data: any) => Promise<{ success: boolean; id?: string; message?: string }>;
    extendTime: (minutes: number) => Promise<void>;
    endReservation: () => Promise<void>;
    updateState: (updates: Partial<LiveActivityState>) => void;
  };
}

const LiveActivityContext = createContext<LiveActivityContextType | undefined>(undefined);

type LiveActivityAction = 
  | { type: 'UPDATE_STATE'; payload: Partial<LiveActivityState> }
  | { type: 'RESET' };

const initialState: LiveActivityState = {
  id: null,
  reservationId: null,
  location: '',
  endTime: null,
};

function liveActivityReducer(state: LiveActivityState, action: LiveActivityAction): LiveActivityState {
  switch (action.type) {
    case 'UPDATE_STATE':
      return { ...state, ...action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface LiveActivityProviderProps {
  children: ReactNode;
}

export function LiveActivityProvider({ children }: LiveActivityProviderProps) {
  const [state, dispatch] = useReducer(liveActivityReducer, initialState);

  const updateState = (updates: Partial<LiveActivityState>) => {
    dispatch({ type: 'UPDATE_STATE', payload: updates });
  };

  const { handleExtendTime, handleEndReservation, startLiveActivity } = useLiveActivityActions({
    liveActivityState: state,
    onStateUpdate: updateState,
  });

  const contextValue: LiveActivityContextType = {
    state,
    actions: {
      startLiveActivity,
      extendTime: handleExtendTime,
      endReservation: handleEndReservation,
      updateState,
    },
  };

  return (
    <LiveActivityContext.Provider value={contextValue}>
      {children}
    </LiveActivityContext.Provider>
  );
}

export function useLiveActivity() {
  const context = useContext(LiveActivityContext);
  if (context === undefined) {
    throw new Error('useLiveActivity must be used within a LiveActivityProvider');
  }
  return context;
}
