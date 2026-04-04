import urllib.request
import urllib.error
import json

def stop_blackswan():
    print("🟢 [GOV_API] Initiating Level 5 Threat Stand-down...")
    url = "http://127.0.0.1:8000/webhooks/national-disaster"
    payload = {
        "event_type": "PANDEMIC_LOCKDOWN",
        "severity": "NORMAL",
        "directive": "UNFREEZE_ALL_PARAMETRIC_PAYOUTS",
        "auth_key": "gov_secret_key_99"
    }

    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            status_code = response.getcode()
            response_body = response.read().decode('utf-8')
            print(f"📡 Status Code: {status_code}")
            print(f"📡 Response: {response_body}")
            if status_code == 200:
                print("✅ [SYSTEM] The Circuit Breaker has been successfully lifted!")
                print("Gig payouts have been resumed globally.")
    except Exception as e:
        print(f"Failed to reverse Black Swan webhook: {e}")

if __name__ == "__main__":
    stop_blackswan()
