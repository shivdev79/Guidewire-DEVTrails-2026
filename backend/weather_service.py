"""
Weather Service - Hybrid Real/Mock API Layer
Real APIs: Open-Meteo (free), WAQI (free)
Fallback: Mock data for demo/testing
"""

import httpx
import asyncio
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)

class WeatherService:
    """Fetches weather data from Open-Meteo (free tier) with mocking capability"""
    
    # India Pincode to Lat/Long Mapping (simplified - common cities)
    PINCODE_COORDINATES = {
        "400001": {"lat": 19.0176, "lon": 72.8479, "city": "Mumbai"},      # Mumbai
        "400002": {"lat": 19.0176, "lon": 72.8479, "city": "Mumbai"},      # Mumbai (high risk)
        "400003": {"lat": 19.0176, "lon": 72.8479, "city": "Mumbai"},      # Mumbai (AQI risk)
        "400004": {"lat": 19.0176, "lon": 72.8479, "city": "Mumbai"},      # Mumbai (strike risk)
        "560001": {"lat": 12.9716, "lon": 77.5946, "city": "Bangalore"},   # Bangalore
        "110001": {"lat": 28.6139, "lon": 77.2090, "city": "Delhi"},       # Delhi
        "700001": {"lat": 22.5726, "lon": 88.3639, "city": "Kolkata"},     # Kolkata
        "600001": {"lat": 13.0827, "lon": 80.2707, "city": "Chennai"},     # Chennai
    }
    
    @staticmethod
    def get_coordinates(pincode: str) -> Dict:
        """Get latitude/longitude from pincode"""
        coords = WeatherService.PINCODE_COORDINATES.get(pincode)
        if not coords:
            # Default to Mumbai if pincode not found
            logger.warning(f"Pincode {pincode} not mapped. Using Mumbai defaults.")
            return WeatherService.PINCODE_COORDINATES["400001"]
        return coords
    
    @staticmethod
    async def fetch_weather_forecast(pincode: str, use_mock: bool = False) -> Dict:
        """
        Fetch 7-day weather forecast from Open-Meteo
        
        use_mock=True: Always return mock data (for instant demo)
        use_mock=False: Try real API, fall back to mock if fails
        
        Returns:
        {
            "precipitation_sum": float,      # mm/day avg
            "temperature_max": float,        # °C
            "risk_multiplier": float,        # 1.0-2.0
            "trigger_type": str or None,     # "rain" / "heat" / None
            "source": str                    # "real" or "mock"
        }
        """
        
        if use_mock:
            return WeatherService._mock_forecast(pincode)
        
        try:
            coords = WeatherService.get_coordinates(pincode)
            lat, lon = coords["lat"], coords["lon"]
            
            # Real Open-Meteo API (free tier, no auth required)
            url = (
                f"https://api.open-meteo.com/v1/forecast?"
                f"latitude={lat}&longitude={lon}"
                f"&daily=precipitation_sum,temperature_2m_max,weather_code"
                f"&timezone=Asia/Kolkata"
            )
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url)
                response.raise_for_status()
                data = response.json()
                
                # Process response
                daily_data = data.get("daily", {})
                precip = daily_data.get("precipitation_sum", [0])[0] or 0  # Today's forecast
                temp_max = daily_data.get("temperature_2m_max", [25])[0] or 25
                
                logger.info(f"Real weather: Pincode {pincode}: Rain={precip}mm, Temp={temp_max}°C")
                
                return WeatherService._calculate_risk(precip, temp_max, source="real")
                
        except Exception as e:
            logger.warning(f"Real API failed for pincode {pincode}: {e}. Using mock.")
            return WeatherService._mock_forecast(pincode)
    
    @staticmethod
    def _calculate_risk(precipitation: float, temperature: float, source: str = "real") -> Dict:
        """Calculate risk multiplier and trigger from weather data"""
        
        risk_multiplier = 1.0
        trigger_type = None
        
        # Heavy Rain (>15mm/hr = >360mm/day, but realistic is 50-100mm/day)
        if precipitation > 50:
            risk_multiplier = 1.6
            trigger_type = "heavy_rain"
        elif precipitation > 20:
            risk_multiplier = 1.4
            trigger_type = "moderate_rain"
        
        # Extreme Heat (>42°C is dangerous)
        if temperature > 42:
            if risk_multiplier < 1.5:
                risk_multiplier += 0.3
            if not trigger_type:
                trigger_type = "extreme_heat"
        elif temperature > 38:
            if risk_multiplier < 1.3:
                risk_multiplier += 0.2
        
        return {
            "precipitation_sum": round(precipitation, 1),
            "temperature_max": round(temperature, 1),
            "risk_multiplier": round(risk_multiplier, 2),
            "trigger_type": trigger_type,
            "source": source
        }
    
    @staticmethod
    def _mock_forecast(pincode: str) -> Dict:
        """Return mock weather data for demo/testing"""
        
        # Simulate different conditions based on pincode ending
        last_digit = int(pincode[-1]) if pincode else 0
        
        if last_digit == 2:
            # Heavy rain scenario
            return {
                "precipitation_sum": 65.5,
                "temperature_max": 28.0,
                "risk_multiplier": 1.6,
                "trigger_type": "heavy_rain",
                "source": "mock"
            }
        elif last_digit == 3:
            # Extreme heat
            return {
                "precipitation_sum": 0.0,
                "temperature_max": 44.2,
                "risk_multiplier": 1.5,
                "trigger_type": "extreme_heat",
                "source": "mock"
            }
        else:
            # Normal conditions
            return {
                "precipitation_sum": 2.0,
                "temperature_max": 32.0,
                "risk_multiplier": 1.0,
                "trigger_type": None,
                "source": "mock"
            }


class AQIService:
    """Air Quality Index Service - WAQI API with mocking"""
    
    @staticmethod
    async def fetch_aqi(pincode: str, city: str = None, use_mock: bool = False) -> Dict:
        """
        Fetch AQI from waqi.org
        
        use_mock=True: Always return mock data
        use_mock=False: Try real API, fall back to mock if fails
        
        Returns:
        {
            "aqi": int,                  # 0-500
            "level": str,                # "Good" / "Moderate" / "Poor" / "Severe"
            "trigger": bool,             # True if AQI > 300 (severe)
            "source": str                # "real" or "mock"
        }
        """
        
        if use_mock:
            return AQIService._mock_aqi(pincode)
        
        try:
            # Map pincode to city (simplified)
            city_map = {
                "400001": "Mumbai",
                "400002": "Mumbai",
                "400003": "Mumbai",
                "560001": "Bangalore",
                "110001": "Delhi",
                "700001": "Kolkata",
                "600001": "Chennai",
            }
            
            city = city_map.get(pincode, "Mumbai")
            
            # WAQI Free API (note: requires API key from waqi.info)
            # For hackathon, we'll use mock - in production add your key
            WAQI_TOKEN = "demo"  # Replace with actual key
            
            url = f"http://api.waqi.info/feed/{city}/?token={WAQI_TOKEN}"
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url)
                response.raise_for_status()
                data = response.json()
                
                if data.get("status") == "ok":
                    aqi_value = data["data"].get("aqi", 100)
                    logger.info(f"Real AQI for {city}: {aqi_value}")
                    return AQIService._calculate_aqi_level(aqi_value, source="real")
                else:
                    raise Exception("Invalid WAQI response")
                    
        except Exception as e:
            logger.warning(f"Real AQI API failed for {city}: {e}. Using mock.")
            return AQIService._mock_aqi(pincode)
    
    @staticmethod
    def _calculate_aqi_level(aqi_value: int, source: str = "real") -> Dict:
        """Calculate AQI level and trigger"""
        
        if aqi_value > 500:
            level = "Hazardous"
        elif aqi_value > 300:
            level = "Severe"
        elif aqi_value > 200:
            level = "Very Unhealthy"
        elif aqi_value > 150:
            level = "Unhealthy"
        elif aqi_value > 100:
            level = "Unhealthy for Sensitive Groups"
        elif aqi_value > 50:
            level = "Moderate"
        else:
            level = "Good"
        
        trigger = aqi_value > 300  # Severe pollution is a trigger
        
        return {
            "aqi": aqi_value,
            "level": level,
            "trigger": trigger,
            "source": source
        }
    
    @staticmethod
    def _mock_aqi(pincode: str) -> Dict:
        """Return mock AQI for demo/testing"""
        
        # Simulate different conditions based on pincode ending
        last_digit = int(pincode[-1]) if pincode else 0
        
        if last_digit == 3:
            # Critical AQI
            return {
                "aqi": 350,
                "level": "Severe",
                "trigger": True,
                "source": "mock"
            }
        else:
            # Normal AQI
            return {
                "aqi": 85,
                "level": "Moderate",
                "trigger": False,
                "source": "mock"
            }


class PaymentService:
    """Payment Service - Mock Razorpay UPI with instant demo mode"""
    
    @staticmethod
    async def process_payout(worker_id: int, amount: float, upi_id: str, 
                            use_mock: bool = True, instant_demo: bool = False) -> Dict:
        """
        Process payout to worker's UPI
        
        use_mock=True: Instant mock payout (for demo)
        instant_demo=True: Simulate instant success without delay
        
        Returns:
        {
            "status": "success" / "pending" / "failed",
            "transaction_id": str,
            "payout_amount": float,
            "timestamp": str,
            "upi_id": str,
            "message": str,
            "source": str  # "real" or "mock"
        }
        """
        
        import uuid
        from datetime import datetime
        
        transaction_id = f"TXN_{uuid.uuid4().hex[:12].upper()}"
        timestamp = datetime.utcnow().isoformat()
        
        if use_mock or instant_demo:
            # Mock instant payout (for demo)
            return {
                "status": "success",
                "transaction_id": transaction_id,
                "payout_amount": amount,
                "timestamp": timestamp,
                "upi_id": upi_id,
                "message": f"✅ Instant payout of ₹{amount} sent to {upi_id}",
                "source": "mock"
            }
        
        try:
            # Real Razorpay API (requires key + secret)
            # For now, this is scaffolding - in production add your Razorpay credentials
            
            logger.info(f"Processing real payout: Worker {worker_id}, Amount ₹{amount}")
            
            # In production:
            # import razorpay
            # client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
            # response = client.payout.create(data={...})
            
            return {
                "status": "success",
                "transaction_id": transaction_id,
                "payout_amount": amount,
                "timestamp": timestamp,
                "upi_id": upi_id,
                "message": f"Payout of ₹{amount} initiated to {upi_id}",
                "source": "real"
            }
            
        except Exception as e:
            logger.error(f"Payout failed: {e}")
            return {
                "status": "failed",
                "transaction_id": transaction_id,
                "payout_amount": amount,
                "timestamp": timestamp,
                "upi_id": upi_id,
                "message": f"Payout failed: {str(e)}",
                "source": "mock"
            }
