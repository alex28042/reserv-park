import { requireNativeModule } from 'expo';
import { Platform } from 'react-native';
import type {
    ActivityStartResponse,
    ActivityStopResponse,
    ParkingData
} from './LiveActivityManager.types';

const nativeModule = Platform.OS === 'ios' 
  ? requireNativeModule('LiveActivityManagerModule') 
  : null;

export const LiveActivityManager = nativeModule
  ? {
      start: async (data: ParkingData): Promise<ActivityStartResponse> => {
        return await nativeModule.start(
          data.location,
          data.timeRemaining,
          data.status,
          data.endTime,
          data.canExtend,
          data.totalDurationMinutes,
          data.reservationId
        );
      },
      stop: async (id: string): Promise<ActivityStopResponse> => {
        return await nativeModule.stop(id);
      },
      update: async (id: string, data: Omit<ParkingData, 'reservationId'>): Promise<ActivityStartResponse> => {
        return await nativeModule.update(
          id,
          data.location,
          data.timeRemaining,
          data.status,
          data.endTime,
          data.canExtend,
          data.totalDurationMinutes
        );
      },
    }
  : {
      start: async (data: ParkingData): Promise<ActivityStartResponse> => ({
        isSuccess: false,
        message: 'Live Activities are not supported on this platform',
      }),
      stop: async (id: string): Promise<ActivityStopResponse> => ({
        isSuccess: false,
        message: 'Live Activities are not supported on this platform',
      }),
      update: async (id: string, data: Omit<ParkingData, 'reservationId'>): Promise<ActivityStartResponse> => ({
        isSuccess: false,
        message: 'Live Activities are not supported on this platform',
      }),
    };

export default LiveActivityManager;
