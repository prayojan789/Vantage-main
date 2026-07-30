"""
Create a demo user by calling the signup API.
"""

import urllib.request
import json

def create_demo_user():
    url = "http://localhost:8000/api/v1/auth/signup"
    data = {
        "email": "demo@vantage.np",
        "password": "demo123",
        "full_name": "Demo User"
    }
    
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode('utf-8'),
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print("✓ Demo user created successfully!")
            print(f"  Email: demo@vantage.np")
            print(f"  Password: demo123")
            print(f"  Response: {result}")
            print(f"\nYou can now log in at http://localhost:5173/sign-in")
    except Exception as e:
        print(f"✗ Error: {e}")

if __name__ == "__main__":
    create_demo_user()