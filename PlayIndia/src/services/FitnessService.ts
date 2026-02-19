// Mock implementation for development
// Replace with actual Health Connect integration

const mockHealthData = {
  steps: 8547,
  heartRate: [72, 75, 78, 82, 76, 74, 70, 68, 85, 90, 88, 82],
  calories: 420,
  sleepHours: 7.5,
  workoutMinutes: 45,
  waterIntake: 1.8,
  weeklySteps: [
    { day: 'Mon', steps: 6000 },
    { day: 'Tue', steps: 8500 },
    { day: 'Wed', steps: 4000 },
    { day: 'Thu', steps: 9500 },
    { day: 'Fri', steps: 7200 },
    { day: 'Sat', steps: 11000 },
    { day: 'Sun', steps: 8547 }, // Today
  ],
  hourlyHeartRate: [
    { hour: '08:00', rate: 65 },
    { hour: '10:00', rate: 72 },
    { hour: '12:00', rate: 85 },
    { hour: '14:00', rate: 78 },
    { hour: '16:00', rate: 92 },
    { hour: '18:00', rate: 75 },
    { hour: '20:00', rate: 70 },
  ]
};

export interface FitnessData {
  steps: number;
  heartRate: number[];
  calories: number;
  sleepHours: number;
  workoutMinutes: number;
  waterIntake: number;
  timestamp: Date;
}

export interface DailyFitnessSummary {
  date: string;
  steps: number;
  calories: number;
  heartRateAvg: number;
  sleepHours: number;
  workoutMinutes: number;
  waterIntake: number;
  weeklySteps?: { day: string; steps: number }[];
  hourlyHeartRate?: { hour: string; rate: number }[];
}

class FitnessService {
  private static instance: FitnessService;

  private constructor() { }

  static getInstance(): FitnessService {
    if (!FitnessService.instance) {
      FitnessService.instance = new FitnessService();
    }
    return FitnessService.instance;
  }

  // Request health data permissions
  async requestPermissions(): Promise<boolean> {
    try {
      // For now, return true to bypass permission issues
      // In production, implement proper permission handling
      console.log('Health Connect permissions requested');
      return true;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  // Fetch today's steps
  async getTodaySteps(): Promise<number> {
    try {
      // Mock data for development
      return mockHealthData.steps;
    } catch (error) {
      console.error('Error fetching steps:', error);
      return 0;
    }
  }

  // Fetch heart rate data
  async getHeartRateData(): Promise<number[]> {
    try {
      // Mock data for development
      return mockHealthData.heartRate;
    } catch (error) {
      console.error('Error fetching heart rate:', error);
      return [];
    }
  }

  // Fetch calories burned
  async getCaloriesBurned(): Promise<number> {
    try {
      // Mock data for development
      return mockHealthData.calories;
    } catch (error) {
      console.error('Error fetching calories:', error);
      return 0;
    }
  }

  // Fetch sleep data
  async getSleepHours(): Promise<number> {
    try {
      // Mock data for development
      return mockHealthData.sleepHours;
    } catch (error) {
      console.error('Error fetching sleep data:', error);
      return 0;
    }
  }

  // Fetch water intake
  async getWaterIntake(): Promise<number> {
    try {
      // Mock data for development
      return mockHealthData.waterIntake;
    } catch (error) {
      console.error('Error fetching water intake:', error);
      return 0;
    }
  }

  // Fetch workout data
  async getWorkoutMinutes(): Promise<number> {
    try {
      // Mock data for development
      return mockHealthData.workoutMinutes;
    } catch (error) {
      console.error('Error fetching workout data:', error);
      return 0;
    }
  }

  // Get complete daily fitness summary
  async getDailyFitnessSummary(): Promise<DailyFitnessSummary> {
    const [
      steps,
      calories,
      heartRateData,
      sleepHours,
      workoutMinutes,
      waterIntake
    ] = await Promise.all([
      this.getTodaySteps(),
      this.getCaloriesBurned(),
      this.getHeartRateData(),
      this.getSleepHours(),
      this.getWorkoutMinutes(),
      this.getWaterIntake()
    ]);

    const heartRateAvg = heartRateData.length > 0
      ? heartRateData.reduce((sum, rate) => sum + rate, 0) / heartRateData.length
      : 0;

    return {
      date: new Date().toISOString().split('T')[0],
      steps,
      calories,
      heartRateAvg: Math.round(heartRateAvg),
      sleepHours: Math.round(sleepHours * 10) / 10,
      workoutMinutes: Math.round(workoutMinutes),
      waterIntake: Math.round(waterIntake * 1000) / 1000,
      weeklySteps: mockHealthData.weeklySteps,
      hourlyHeartRate: mockHealthData.hourlyHeartRate
    };
  }

  // Sync data with backend
  async syncWithBackend(summary: DailyFitnessSummary): Promise<boolean> {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('YOUR_BACKEND_URL/api/fitness/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_AUTH_TOKEN'
        },
        body: JSON.stringify(summary)
      });

      return response.ok;
    } catch (error) {
      console.error('Backend sync failed:', error);
      return false;
    }
  }
}

export default FitnessService.getInstance();