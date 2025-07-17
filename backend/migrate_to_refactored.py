#!/usr/bin/env python3
"""
Migration script to transition from the old monolithic app.py to the new modular structure
"""

import os
import shutil
import sys
from datetime import datetime

def backup_original_app():
    """Create a backup of the original app.py"""
    if os.path.exists('app.py'):
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_name = f'app_backup_{timestamp}.py'
        shutil.copy2('app.py', backup_name)
        print(f"✅ Created backup: {backup_name}")
        return backup_name
    return None

def replace_app_file():
    """Replace the old app.py with the new refactored version"""
    if os.path.exists('app_refactored.py'):
        # Backup original
        backup_name = backup_original_app()
        
        # Replace with new version
        shutil.move('app_refactored.py', 'app.py')
        print("✅ Replaced app.py with refactored version")
        
        if backup_name:
            print(f"📁 Original app.py backed up as {backup_name}")
        
        return True
    else:
        print("❌ app_refactored.py not found!")
        return False

def verify_structure():
    """Verify that all required files and directories exist"""
    required_files = [
        'config.py',
        'models/__init__.py',
        'models/data_models.py',
        'services/__init__.py',
        'services/usms_scraper.py',
        'services/performance_analyzer.py',
        'services/user_service.py',
        'routes/__init__.py',
        'routes/api_routes.py',
        'utils/__init__.py',
        'utils/time_utils.py',
        'utils/age_utils.py',
        'tests/__init__.py',
        'tests/test_performance_analyzer.py'
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print("❌ Missing required files:")
        for file_path in missing_files:
            print(f"   - {file_path}")
        return False
    else:
        print("✅ All required files present")
        return True

def test_imports():
    """Test that all modules can be imported successfully"""
    print("🔍 Testing imports...")
    
    try:
        import config
        print("✅ config imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import config: {e}")
        return False
    
    try:
        from models import data_models
        print("✅ models.data_models imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import models.data_models: {e}")
        return False
    
    try:
        from services import usms_scraper, performance_analyzer, user_service
        print("✅ services imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import services: {e}")
        return False
    
    try:
        from routes import api_routes
        print("✅ routes.api_routes imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import routes.api_routes: {e}")
        return False
    
    try:
        from utils import time_utils, age_utils
        print("✅ utils imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import utils: {e}")
        return False
    
    return True

def run_tests():
    """Run the test suite to verify everything works"""
    print("🧪 Running tests...")
    
    try:
        # Import and run tests
        import unittest
        from tests.test_performance_analyzer import TestPerformanceAnalyzer
        
        # Create test suite
        suite = unittest.TestLoader().loadTestsFromTestCase(TestPerformanceAnalyzer)
        
        # Run tests
        runner = unittest.TextTestRunner(verbosity=1)
        result = runner.run(suite)
        
        if result.wasSuccessful():
            print("✅ All tests passed!")
            return True
        else:
            print("❌ Some tests failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error running tests: {e}")
        return False

def main():
    """Main migration function"""
    print("🚀 USMS Analytics Backend Migration")
    print("=" * 50)
    
    # Step 1: Verify structure
    print("\n1. Verifying file structure...")
    if not verify_structure():
        print("❌ Migration failed: Missing required files")
        sys.exit(1)
    
    # Step 2: Test imports
    print("\n2. Testing imports...")
    if not test_imports():
        print("❌ Migration failed: Import errors")
        sys.exit(1)
    
    # Step 3: Run tests
    print("\n3. Running tests...")
    if not run_tests():
        print("❌ Migration failed: Tests failed")
        sys.exit(1)
    
    # Step 4: Replace app.py
    print("\n4. Replacing app.py...")
    if not replace_app_file():
        print("❌ Migration failed: Could not replace app.py")
        sys.exit(1)
    
    # Step 5: Final verification
    print("\n5. Final verification...")
    if not test_imports():
        print("❌ Migration failed: Final import test failed")
        sys.exit(1)
    
    print("\n🎉 Migration completed successfully!")
    print("\nNext steps:")
    print("1. Start the application: python app.py")
    print("2. Test the API endpoints")
    print("3. Review the README_REFACTORED.md for documentation")
    print("4. Consider adding more tests for other modules")

if __name__ == '__main__':
    main() 