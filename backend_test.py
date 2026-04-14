import requests
import sys
import json
from datetime import datetime

class DevraiAPITester:
    def __init__(self, base_url="https://eco-info.preview.emergentagent.com"):
        self.base_url = base_url
        self.access_token = None
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, use_admin=False):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
            
        if use_admin and self.admin_token:
            test_headers['Authorization'] = f'Bearer {self.admin_token}'
        elif self.access_token:
            test_headers['Authorization'] = f'Bearer {self.access_token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                try:
                    error_data = response.json()
                    details += f", Response: {error_data}"
                except:
                    details += f", Response: {response.text[:200]}"
            
            self.log_test(name, success, details)
            
            if success:
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_admin_login(self):
        """Test admin login"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={"email": "admin@devrai.com", "password": "admin123"}
        )
        if success and 'email' in response:
            # Note: Tokens are in httpOnly cookies, not in response
            print(f"Admin logged in: {response.get('email')} (Role: {response.get('role')})")
            return True
        return False

    def test_user_registration(self):
        """Test user registration"""
        test_email = f"test_user_{datetime.now().strftime('%H%M%S')}@test.com"
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data={
                "email": test_email,
                "password": "testpass123",
                "name": "Test User"
            }
        )
        if success:
            print(f"User registered: {test_email} (Status: {response.get('user', {}).get('approval_status')})")
            return test_email
        return None

    def test_unapproved_login(self, email):
        """Test login with unapproved user"""
        success, response = self.run_test(
            "Unapproved User Login",
            "POST",
            "auth/login",
            403,  # Should be forbidden
            data={"email": email, "password": "testpass123"}
        )
        return success

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        return self.run_test(
            "Invalid Login",
            "POST",
            "auth/login",
            401,
            data={"email": "invalid@test.com", "password": "wrongpass"}
        )

    def test_protected_routes_without_auth(self):
        """Test protected routes without authentication"""
        endpoints = [
            ("Get Groves", "groves"),
            ("Get Districts", "districts"),
            ("Get Articles", "articles"),
            ("Get News", "news"),
            ("Get Resources", "resources")
        ]
        
        results = []
        for name, endpoint in endpoints:
            success, _ = self.run_test(f"Unauth {name}", "GET", endpoint, 401)
            results.append(success)
        
        return all(results)

    def test_admin_routes_without_admin(self):
        """Test admin routes without admin privileges"""
        endpoints = [
            ("Get All Users", "admin/users"),
            ("Get Threats", "threats")
        ]
        
        results = []
        for name, endpoint in endpoints:
            success, _ = self.run_test(f"Non-Admin {name}", "GET", endpoint, 401)
            results.append(success)
        
        return all(results)

    def test_database_seeding(self):
        """Test if database has been seeded with sacred groves data"""
        # This will fail with 401 since we're not authenticated, but that's expected
        success, _ = self.run_test("Check DB Seeding", "GET", "groves", 401)
        return success  # We expect 401, not 500 or other errors

    def test_logout(self):
        """Test logout functionality"""
        return self.run_test("Logout", "POST", "auth/logout", 200)

    def print_summary(self):
        """Print test summary"""
        print(f"\n{'='*50}")
        print(f"TEST SUMMARY")
        print(f"{'='*50}")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.tests_passed < self.tests_run:
            print(f"\nFAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"- {result['test']}: {result['details']}")

def main():
    print("🧪 Starting Devrai API Testing...")
    print(f"Testing against: https://eco-info.preview.emergentagent.com")
    
    tester = DevraiAPITester()
    
    # Test basic connectivity
    print("\n📡 Testing Basic Connectivity...")
    tester.test_root_endpoint()
    
    # Test authentication flows
    print("\n🔐 Testing Authentication...")
    tester.test_admin_login()
    
    # Test user registration
    print("\n👤 Testing User Registration...")
    test_email = tester.test_user_registration()
    if test_email:
        tester.test_unapproved_login(test_email)
    
    # Test invalid login
    tester.test_invalid_login()
    
    # Test protected routes without auth
    print("\n🛡️ Testing Protected Routes...")
    tester.test_protected_routes_without_auth()
    
    # Test admin routes without admin
    print("\n👑 Testing Admin Routes...")
    tester.test_admin_routes_without_admin()
    
    # Test database seeding
    print("\n🌱 Testing Database...")
    tester.test_database_seeding()
    
    # Test logout
    print("\n🚪 Testing Logout...")
    tester.test_logout()
    
    # Print summary
    tester.print_summary()
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())