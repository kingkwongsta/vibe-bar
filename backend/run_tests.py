#!/usr/bin/env python3
"""
Test runner script for vibe-bar backend tests.
Provides easy commands to run different test suites.
"""

import subprocess
import sys
import argparse


def run_command(cmd):
    """Run a command and return the result"""
    print(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=False)
    return result.returncode == 0


def main():
    parser = argparse.ArgumentParser(description="Run vibe-bar backend tests")
    parser.add_argument(
        "suite", 
        choices=["all", "models", "api", "offline"],
        help="Test suite to run"
    )
    parser.add_argument("-v", "--verbose", action="store_true", help="Verbose output")
    
    args = parser.parse_args()
    
    base_cmd = [sys.executable, "-m", "pytest"]
    if args.verbose:
        base_cmd.append("-v")
    
    if args.suite == "all":
        # Run all tests
        cmd = base_cmd + ["tests/"]
        print("🚀 Running all tests...")
        
    elif args.suite == "models":
        # Run only model tests
        cmd = base_cmd + ["tests/test_models.py"]
        print("🎯 Running model tests...")
        
    elif args.suite == "api":
        # Run only API-dependent tests (requires OpenRouter API key)
        cmd = base_cmd + ["tests/test_openrouter.py", "-k", "basic_completion or structured_messages or cocktail_generation or error_handling"]
        print("🌐 Running API-dependent tests...")
        
    elif args.suite == "offline":
        # Run only tests that don't require API access
        cmd = base_cmd + ["tests/", "-k", "not (basic_completion or structured_messages or cocktail_generation or error_handling)"]
        print("📴 Running offline tests...")
    
    success = run_command(cmd)
    
    if success:
        print(f"\n✅ {args.suite.title()} tests completed successfully!")
    else:
        print(f"\n❌ {args.suite.title()} tests failed!")
        sys.exit(1)


if __name__ == "__main__":
    main() 