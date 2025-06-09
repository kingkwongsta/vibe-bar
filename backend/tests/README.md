# Vibe Bar Backend Tests

This directory contains all tests for the vibe-bar backend application, organized following Python testing best practices.

## 📁 Test Structure

```
tests/
├── __init__.py              # Makes tests a Python package
├── conftest.py              # Pytest configuration and shared fixtures
├── test_models.py           # Tests for Pydantic models
├── test_openrouter.py       # Tests for OpenRouter service integration
└── README.md               # This file
```

## 🧪 Test Categories

### Model Tests (`test_models.py`)
- **User Preferences**: Tests for user input validation and preferences handling
- **Cocktail Recipes**: Tests for recipe data structures and validation
- **Common Models**: Tests for shared API response models
- **Validation**: Tests for Pydantic model validation rules

### OpenRouter Tests (`test_openrouter.py`)
- **Configuration**: Tests for API configuration validation
- **Service Initialization**: Tests for service setup and initialization
- **Model Creation**: Tests for data model instantiation
- **API Integration**: Tests for actual API calls (requires API key)

## 🚀 Running Tests

### Using the Test Runner (Recommended)

```bash
# Run all offline tests (no API key required)
python run_tests.py offline -v

# Run only model tests
python run_tests.py models -v

# Run API-dependent tests (requires OpenRouter API key)
python run_tests.py api -v

# Run all tests
python run_tests.py all -v
```

### Using Pytest Directly

```bash
# Run all tests
python -m pytest tests/ -v

# Run specific test file
python -m pytest tests/test_models.py -v

# Run tests without API dependencies
python -m pytest tests/ -k "not (basic_completion or structured_messages or cocktail_generation or error_handling)" -v

# Run only API tests
python -m pytest tests/test_openrouter.py -k "basic_completion or structured_messages or cocktail_generation or error_handling" -v
```

## 🔧 Configuration

### Pytest Configuration (`pytest.ini`)
- Configured for async test support with `pytest-asyncio`
- Automatic test discovery in the `tests/` directory
- Proper asyncio event loop handling

### Dependencies
The following testing dependencies are included in `requirements.txt`:
- `pytest==8.3.3` - Main testing framework
- `pytest-asyncio==0.24.0` - Async test support

## 🌐 API Testing

Some tests require an OpenRouter API key to run. These tests will be automatically skipped if the API key is not configured.

To run API tests:
1. Set up your `.env` file with `OPENROUTER_API_KEY`
2. Use `python run_tests.py api -v` or run pytest with API test filters

## 📊 Test Coverage

Current test coverage includes:
- ✅ Pydantic model validation
- ✅ User preferences handling
- ✅ Cocktail recipe data structures
- ✅ API response models
- ✅ Service configuration validation
- ✅ Basic API integration (when API key available)

## 🔍 Debugging Tests

For debugging failed tests:

```bash
# Run with extra verbose output
python -m pytest tests/ -vv

# Run specific test with output capture disabled
python -m pytest tests/test_models.py::test_user_preferences -v -s

# Run with Python debugger on failures
python -m pytest tests/ --pdb
```

## 📝 Adding New Tests

When adding new tests:

1. **Model Tests**: Add to `test_models.py` for any new Pydantic models
2. **Service Tests**: Add to `test_openrouter.py` for API-related functionality
3. **New Categories**: Create new test files following the `test_*.py` naming convention
4. **Fixtures**: Add shared fixtures to `conftest.py`

### Test Naming Convention
- Test files: `test_*.py`
- Test functions: `test_*`
- Test classes: `Test*`

## 🎯 Best Practices

- **Isolation**: Each test should be independent and not rely on other tests
- **Fixtures**: Use fixtures for common setup and teardown
- **Async Tests**: Mark async tests with `@pytest.mark.asyncio`
- **API Mocking**: Consider mocking external API calls for faster, more reliable tests
- **Clear Names**: Use descriptive test function names that explain what is being tested 