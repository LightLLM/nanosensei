# Mobile App Tests

Unit tests for the NanoSensei mobile app.

## Running Tests

### Run all tests
```bash
cd mobile
npm test
```

### Run in watch mode
```bash
npm run test:watch
```

### Run with coverage
```bash
npm run test:coverage
```

## Test Structure

- `LocalInferenceEngine.test.ts` - Tests for on-device AI inference engine
- `BackendClient.test.ts` - Tests for API client with mocked fetch

## Test Coverage

### LocalInferenceEngine
- ✅ Valid inference result structure
- ✅ Score range validation (0-100)
- ✅ Feedback for different skill types
- ✅ Deterministic results
- ✅ Edge cases (unknown skills, different dimensions)

### BackendClient
- ✅ Health check
- ✅ User creation and retrieval
- ✅ Session sync
- ✅ Session fetching
- ✅ Summary retrieval
- ✅ Error handling (network errors, API errors)

## Writing New Tests

1. Use Jest and React Native Testing Library
2. Mock external dependencies (fetch, AsyncStorage, etc.)
3. Follow the naming convention: `describe('<Component>', () => { it('should ...') })`
4. Test both success and error cases

## Example Test

```typescript
describe('MyComponent', () => {
  it('should render correctly', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Hello')).toBeTruthy();
  });
});
```

## Mocking

- `fetch` is mocked globally in `BackendClient.test.ts`
- `AsyncStorage` is mocked in `jest.setup.js`
- Expo modules are mocked in `jest.setup.js`

