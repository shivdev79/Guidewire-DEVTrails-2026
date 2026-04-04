"""
Demo Mode Controller - Inject scenarios instantly for live demonstrations
Allows judges/investors to see triggers fire immediately without waiting
"""

from enum import Enum
from typing import Optional
from datetime import datetime

class DemoScenario(str, Enum):
    """Pre-defined demonstration scenarios"""
    HEAVY_RAIN = "heavy_rain"
    EXTREME_HEAT = "extreme_heat"
    CRITICAL_AQI = "critical_aqi"
    CIVIC_STRIKE = "civic_strike"
    PLATFORM_CRASH = "platform_crash"
    CLEAR_WEATHER = "clear_weather"


class DemoModeController:
    """
    Manages demo scenarios for live demonstrations
    Allows injecting disruptions on-demand for judges/investors
    """
    
    # Active demo scenario (None = normal operation)
    _active_scenario: Optional[DemoScenario] = None
    _scenario_start_time: Optional[datetime] = None
    
    @staticmethod
    def activate_scenario(scenario: DemoScenario) -> dict:
        """
        Activate a demo scenario
        
        Example usage in demo:
        - "We'll now trigger a heavy rain scenario"
        - POST /demo/scenario with {"scenario": "heavy_rain"}
        - System starts detecting rain immediately on background job next run
        """
        DemoModeController._active_scenario = scenario
        DemoModeController._scenario_start_time = datetime.utcnow()
        
        scenario_descriptions = {
            DemoScenario.HEAVY_RAIN: "🌧️ Heavy Rain Scenario: Workers in delivery zones report 65mm+ rainfall. System detects zero-order delivery potential.",
            DemoScenario.EXTREME_HEAT: "🔥 Extreme Heat Scenario: Temperature exceeds 44°C. Outdoor delivery becomes hazardous.",
            DemoScenario.CRITICAL_AQI: "💨 Critical AQI Scenario: Air pollution spike to 350+ AQI. Platform deliveries halted.",
            DemoScenario.CIVIC_STRIKE: "🚨 Civic Strike Scenario: Unannounced market closure. Workers unable to access pickup zones.",
            DemoScenario.PLATFORM_CRASH: "💻 Platform Crash Scenario: Gig platform API down. No orders flowing to active drivers.",
            DemoScenario.CLEAR_WEATHER: "✅ Clear Weather Scenario: Normal operating conditions. No disruptions detected."
        }
        
        return {
            "status": "DEMO_MODE_ACTIVE",
            "active_scenario": scenario,
            "description": scenario_descriptions.get(scenario, "Unknown scenario"),
            "timestamp": DemoModeController._scenario_start_time.isoformat(),
            "message": "🎬 Demo scenario activated. All workers will trigger this disruption on next scheduler run (within 1 minute)."
        }
    
    @staticmethod
    def get_active_scenario() -> Optional[DemoScenario]:
        """Get currently active demo scenario"""
        return DemoModeController._active_scenario
    
    @staticmethod
    def deactivate_scenario() -> dict:
        """Deactivate demo mode, return to normal operation"""
        scenario = DemoModeController._active_scenario
        DemoModeController._active_scenario = None
        DemoModeController._scenario_start_time = None
        
        return {
            "status": "DEMO_MODE_DEACTIVATED",
            "previous_scenario": scenario,
            "message": "Demo mode disabled. System returning to normal operation."
        }
    
    @staticmethod
    def get_demo_status() -> dict:
        """Get current demo mode status"""
        return {
            "demo_mode_active": DemoModeController._active_scenario is not None,
            "active_scenario": DemoModeController._active_scenario,
            "scenario_start_time": DemoModeController._scenario_start_time.isoformat() if DemoModeController._scenario_start_time else None
        }
    
    @staticmethod
    def should_inject_scenario(worker_pincode: str) -> tuple[bool, Optional[DemoScenario]]:
        """
        Check if a scenario should be injected for this worker
        
        Returns (should_inject, scenario)
        """
        if not DemoModeController._active_scenario:
            return False, None
        
        # Inject scenario for all workers during demo mode
        return True, DemoModeController._active_scenario
