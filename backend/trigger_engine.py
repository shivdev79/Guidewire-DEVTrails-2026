class TriggerEngine:
    @staticmethod
    def evaluate_double_lock(worker) -> tuple:
        """
        Implements the deterministic Double-Lock Verification.
        Lock 1: Objective meteorological/social disruption.
        Lock 2: Operational Income Impairment (DBSCAN Cluster Velocity).
        
        Returns: (is_triggered: bool, disruption_type: str, exact_reason: str)
        """
        lock1_disruption = None

        # Lock 1: Environmental Threshold Check (Mocked via logic)
        # Using pincodes to simulate geospatial triggers for the demo
        if worker.pincode and worker.pincode.endswith('2'):
            lock1_disruption = "Severe Rain Exceedance"
        elif worker.pincode and worker.pincode.endswith('3'):
            lock1_disruption = "Critical AQI Spike"
        elif worker.pincode and worker.pincode.endswith('4'):
             lock1_disruption = "Civic Strike / Protest Blockade"
             
        if not lock1_disruption:
            return False, None, None

        # Lock 2: Operational Impairment Check 
        # (Mocking DBSCAN real-time traffic & order velocity)
        # If lock 1 generates a hazard polygon, we check if the worker is actually immobilized.
        # For demo purposes, we will assume Lock 2 validates if Lock 1 is triggered.
        lock2_verified = True
        
        if lock1_disruption and lock2_verified:
            reason = f"Double-Lock Verified: [{lock1_disruption}] & [DBSCAN Velocity < 5km/h]"
            return True, lock1_disruption, reason
            
        return False, None, None
