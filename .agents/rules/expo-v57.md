# Expo SDK 57 & React 19 Guidelines

## Compatibility & Tooling
- **Expo Version**: SDK 57 (exact docs: https://docs.expo.dev/versions/v57.0.0/)
- **React**: 19.2.3
- **React Native**: 0.86.3 (New Architecture enabled)

## Development Rules
1. **Package Installation**:
   - Always install React Native and Expo compatible modules using `npx expo install <package-name>`.
   - Never use raw `npm i` for libraries with native bindings (e.g. storage, reanimated, screens).

2. **Diagnostics & Health**:
   - Run `npx expo-doctor` to diagnose mismatched peer dependencies or configuration errors.
   - Clear metro cache with `npx expo start -c` when encountering caching or resolver issues.

3. **Reanimated & Gesture Handler**:
   - Use `react-native-reanimated` 4.5.1 and `react-native-gesture-handler` 2.32.0.
   - Import gestures inside appropriate gesture root components.
