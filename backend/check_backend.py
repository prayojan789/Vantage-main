import sys
import traceback

try:
    from app.main import app
    print("SUCCESS: Backend app loaded successfully")
    print("Routes:")
    for route in app.routes:
        methods = getattr(route, "methods", None)
        path = getattr(route, "path", "")
        if methods and path.startswith("/api"):
            print(f"  {sorted(methods)} {path}")
except Exception as e:
    print(f"ERROR: {e}")
    traceback.print_exc()
    sys.exit(1)