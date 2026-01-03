
import urllib.request
import json
import sys

def test_chat():
    url = "http://localhost:8000/api/chat"
    payload = {
        "message": "Merhaba",
        "intro_message": False,
        "forced_mod": "safe-support",
        "history": []
    }
    
    print("Sending request with forced_mod='safe-support'...")
    try:
        req = urllib.request.Request(
            url, 
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            
            print("\nResponse Status:", response.getcode())
            print("Response Mod:", data.get('mod'))
            print("Response Reason:", data.get('mod_reason'))
            
            if data.get('mod') == 'safe-support':
                print("\nSUCCESS: Mode parsed correctly and overridden!")
            else:
                print(f"\nFAILURE: Expected 'safe-support', got '{data.get('mod')}'")
            
    except urllib.error.HTTPError as e:
        print(f"\nHTTP ERROR: {e.code} - {e.reason}")
        print(e.read().decode('utf-8'))
    except Exception as e:
        print(f"\nERROR: {e}")

if __name__ == "__main__":
    test_chat()
