export type BaseActivityResponse = {
  isSuccess: boolean;
  message?: string;
};

export type ActivityStartResponse = {
  id?: string;
} & BaseActivityResponse;

export type ActivityStopResponse = {
  id?: string;
} & BaseActivityResponse;

export type ParkingData = {
  location: string;
  timeRemaining: string;
  status: string;
  endTime: string;
  canExtend: boolean;
  totalDurationMinutes: number;
  reservationId: string;
};

export type StartLiveActivityFn = (data: ParkingData) => Promise<ActivityStartResponse>;

export type StopLiveActivityFn = (id: string) => Promise<ActivityStopResponse>;

export type UpdateLiveActivityFn = (id: string, data: Omit<ParkingData, 'reservationId'>) => Promise<ActivityStartResponse>;
