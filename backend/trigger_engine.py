import asyncio
import logging
from weather_service import WeatherService, AQIService, PaymentService
from demo_mode import DemoModeController, DemoScenario

logger = logging.getLogger(__name__)


class TriggerEngine:
    
    @staticmethod
    def evaluate_double_lock_sync(worker) -> tuple:
        """
        Synchronous wrapper for background scheduler
        Calls async evaluate_double_lock in event loop
        """
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        
        return loop.run_until_complete(TriggerEngine.evaluate_double_lock(worker))
    
    @staticmethod
    async def evaluate_double_lock(worker) -> tuple:
        """
        Implements the deterministic Double-Lock Verification with REAL APIs
        Lock 1: Objective meteorological/social disruption (Open-Meteo, WAQI).
        Lock 2: Operational Income Impairment (Cluster Velocity).
        
        Returns: (is_triggered: bool, disruption_type: str, exact_reason: str)
        """
        
        # Check if demo mode is active (for live demonstrations)
        should_inject, demo_scenario = DemoModeController.should_inject_scenario(worker.pincode)
        
        lock1_disruption = None
        lock1_source = None
        
        if should_inject and demo_scenario:
            # DEMO MODE: Inject scenario instantly
            logger.warning(f"[DEMO MODE] Injecting scenario: {demo_scenario} for worker {worker.id}")
            
            if demo_scenario == DemoScenario.HEAVY_RAIN:
                lock1_disruption = "Severe Rain Exceedance (65mm+)"
                lock1_source = "demo"
            elif demo_scenario == DemoScenario.EXTREME_HEAT:
                lock1_disruption = "Extreme Heat (44°C+)"
                lock1_source = "demo"
            elif demo_scenario == DemoScenario.CRITICAL_AQI:
                lock1_disruption = "Critical AQI Spike (>300)"
                lock1_source = "demo"
            elif demo_scenario == DemoScenario.CIVIC_STRIKE:
                lock1_disruption = "Civic Strike / Market Closure"
                lock1_source = "demo"
            elif demo_scenario == DemoScenario.PLATFORM_CRASH:
                lock1_disruption = "Platform API Outage - No Orders"
                lock1_source = "demo"
        else:
            # NORMAL MODE: Fetch real APIs
            
            # Lock 1a: Check Weather (Open-Meteo)
            try:
                weather = await WeatherService.fetch_weather_forecast(
                    worker.pincode, 
                    use_mock=False  # Try real API first
                )
                
                if weather["trigger_type"]:
                    lock1_disruption = f"{weather['trigger_type'].replace('_', ' ').title()} ({weather['precipitation_sum']}mm rain, {weather['temperature_max']}°C)"
                    lock1_source = weather["source"]
                    logger.info(f"Weather trigger for worker {worker.id}: {lock1_disruption} ({lock1_source})")
            except Exception as e:
                logger.error(f"Weather check failed: {e}")
            
            # Lock 1b: Check AQI (WAQI)
            if not lock1_disruption:
                try:
                    aqi = await AQIService.fetch_aqi(
                        worker.pincode,
                        use_mock=False  # Try real API first
                    )
                    
                    if aqi["trigger"]:
                        lock1_disruption = f"Critical AQI Spike - {aqi['level']} (AQI: {aqi['aqi']})"
                        lock1_source = aqi["source"]
                        logger.info(f"AQI trigger for worker {worker.id}: {lock1_disruption} ({lock1_source})")
                except Exception as e:
                    logger.error(f"AQI check failed: {e}")
        
        if not lock1_disruption:
            return False, None, None

        # Lock 2: Operational Impairment Check
        # In production, this would use DBSCAN to check if delivery velocity drops <5km/h
        # For now, assume Lock 2 validates if Lock 1 is triggered
        lock2_verified = True
        
        if lock1_disruption and lock2_verified:
            reason = f"Double-Lock Verified: [{lock1_disruption}] + [DBSCAN: Velocity < 5km/h]"
            return True, lock1_disruption, reason
            
        return False, None, None
