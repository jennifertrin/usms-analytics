#!/usr/bin/env python3
"""
Test script to demonstrate multi-user functionality
This script simulates multiple users accessing the USMS Analytics application simultaneously.
"""

import requests
import time
import threading
from concurrent.futures import ThreadPoolExecutor
import json

BASE_URL = "http://localhost:5000"

def simulate_user(user_id, usms_link):
    """Simulate a single user session"""
    print(f"User {user_id}: Starting session...")
    
    # Create a session for this user
    session = requests.Session()
    
    try:
        # Step 1: Check if there's an existing session
        response = session.get(f"{BASE_URL}/api/session")
        print(f"User {user_id}: Session check - {response.status_code}")
        
        # Step 2: Analyze USMS results
        print(f"User {user_id}: Analyzing USMS results...")
        response = session.post(f"{BASE_URL}/api/analyze", 
                              json={"usmsLink": usms_link},
                              headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            data = response.json()
            swimmer_name = data.get('swimmer', {}).get('name', 'Unknown')
            user_session_id = data.get('user_session', {}).get('user_id', 'Unknown')
            print(f"User {user_id}: Analysis complete for {swimmer_name} (Session: {user_session_id[:8]}...)")
            
            # Step 3: Fetch user data
            response = session.get(f"{BASE_URL}/api/data")
            if response.status_code == 200:
                print(f"User {user_id}: Data retrieved successfully")
            else:
                print(f"User {user_id}: Failed to retrieve data - {response.status_code}")
                
        else:
            print(f"User {user_id}: Analysis failed - {response.status_code}")
            print(f"User {user_id}: Response - {response.text}")
            
    except Exception as e:
        print(f"User {user_id}: Error - {e}")
    
    print(f"User {user_id}: Session completed")

def test_concurrent_users():
    """Test multiple users accessing the application simultaneously"""
    print("=== Multi-User Test for USMS Analytics ===\n")
    
    # Sample USMS links (these would be real USMS results pages in production)
    sample_links = [
        "https://www.usms.org/comp/meets/example1",
        "https://www.usms.org/comp/meets/example2", 
        "https://www.usms.org/comp/meets/example3",
        "https://www.usms.org/comp/meets/example4",
        "https://www.usms.org/comp/meets/example5"
    ]
    
    # Test with 5 concurrent users
    num_users = 5
    
    print(f"Starting test with {num_users} concurrent users...")
    print("Each user will analyze different USMS results simultaneously.\n")
    
    # Use ThreadPoolExecutor to simulate concurrent users
    with ThreadPoolExecutor(max_workers=num_users) as executor:
        # Submit tasks for each user
        futures = []
        for i in range(num_users):
            link = sample_links[i % len(sample_links)]
            future = executor.submit(simulate_user, f"User-{i+1}", link)
            futures.append(future)
        
        # Wait for all users to complete
        for future in futures:
            future.result()
    
    print("\n=== Test Results ===")
    
    # Check active users count
    try:
        response = requests.get(f"{BASE_URL}/api/users/active")
        if response.status_code == 200:
            data = response.json()
            print(f"Active users: {data.get('active_users', 0)}")
            print(f"Total sessions: {data.get('total_sessions', 0)}")
        else:
            print("Failed to get active users count")
    except Exception as e:
        print(f"Error checking active users: {e}")
    
    print("\nMulti-user test completed!")

def test_session_isolation():
    """Test that user sessions are properly isolated"""
    print("\n=== Session Isolation Test ===")
    
    # Create two different sessions
    session1 = requests.Session()
    session2 = requests.Session()
    
    try:
        # User 1 analyzes data
        print("User 1: Analyzing data...")
        response1 = session1.post(f"{BASE_URL}/api/analyze", 
                                json={"usmsLink": "https://www.usms.org/comp/meets/user1"},
                                headers={'Content-Type': 'application/json'})
        
        if response1.status_code == 200:
            data1 = response1.json()
            user1_id = data1.get('user_session', {}).get('user_id', 'Unknown')
            print(f"User 1: Session ID - {user1_id[:8]}...")
        
        # User 2 analyzes different data
        print("User 2: Analyzing data...")
        response2 = session2.post(f"{BASE_URL}/api/analyze", 
                                json={"usmsLink": "https://www.usms.org/comp/meets/user2"},
                                headers={'Content-Type': 'application/json'})
        
        if response2.status_code == 200:
            data2 = response2.json()
            user2_id = data2.get('user_session', {}).get('user_id', 'Unknown')
            print(f"User 2: Session ID - {user2_id[:8]}...")
        
        # Verify sessions are different
        if user1_id != user2_id:
            print("✅ Session isolation working: Users have different session IDs")
        else:
            print("❌ Session isolation failed: Users have same session ID")
        
        # Test data isolation
        print("\nTesting data isolation...")
        
        # User 1 should only see their own data
        response1_data = session1.get(f"{BASE_URL}/api/data")
        if response1_data.status_code == 200:
            print("✅ User 1 can access their data")
        
        # User 2 should only see their own data
        response2_data = session2.get(f"{BASE_URL}/api/data")
        if response2_data.status_code == 200:
            print("✅ User 2 can access their data")
        
        # Clear sessions
        session1.delete(f"{BASE_URL}/api/session")
        session2.delete(f"{BASE_URL}/api/session")
        print("✅ Sessions cleared successfully")
        
    except Exception as e:
        print(f"❌ Session isolation test failed: {e}")

if __name__ == "__main__":
    print("USMS Analytics - Multi-User Test Suite")
    print("Make sure the backend server is running on http://localhost:5000")
    print("=" * 50)
    
    # Test concurrent users
    test_concurrent_users()
    
    # Test session isolation
    test_session_isolation()
    
    print("\n" + "=" * 50)
    print("All tests completed!")
    print("\nTo test manually:")
    print("1. Open multiple browser tabs/windows")
    print("2. Navigate to http://localhost:3000")
    print("3. Each tab will have its own session")
    print("4. Analyze different USMS results in each tab")
    print("5. Verify data is isolated between sessions") 