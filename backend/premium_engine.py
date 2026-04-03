class PremiumEngine:
    @staticmethod
    def calculate_weekly_premium(worker, tier_coverage_amount: float) -> dict:
        """
        Dynamically calculates the weekly premium utilizing the Pw formula.
        Pw = max( [E(L) * (1 + λ)] + γ - (R_score * β) - W_credit , P_floor )
        """
        # Mock Open-Meteo logic: Use pincode to set a risk multiplier
        risk_multiplier = 1.0
        if worker.pincode and worker.pincode.endswith('1'):
            risk_multiplier = 1.4
        
        base_risk = (tier_coverage_amount * 0.01) # 1% expected loss base
        expected_loss = base_risk * risk_multiplier

        systemic_risk_margin = 0.1 # lambda (10% liquidity buffer)
        base_opex = 5.0 # gamma (API gateway fees)
        r_score_beta = 0.5 # beta (how much discount per r_score point)
        p_floor = tier_coverage_amount * 0.005 # Absolute min premium 0.5%
        
        w_credit = min(worker.wallet_balance, 50.0) # Use up to 50 Rs from wallet
        
        premium = (expected_loss * (1 + systemic_risk_margin)) + base_opex - (worker.r_score * r_score_beta) - w_credit
        premium = max(premium, p_floor)
        
        return {
            "premium_amount": round(premium, 2),
            "coverage_amount": tier_coverage_amount,
            "breakdown": {
                "expected_loss": round(expected_loss, 2),
                "r_score_discount": round(worker.r_score * r_score_beta, 2),
                "wallet_credit_used": round(w_credit, 2),
                "p_floor": round(p_floor, 2)
            }
        }
