# Money Talk Project Standards

## State Management
- Use **Zustand** stores with TypeScript interfaces.
- Keep stores lightweight, modular, and persistence-ready if using AsyncStorage.

## Internationalization (i18n)
- Refer to [I18N_GUIDE.md](file:///d:/money-talk-app/I18N_GUIDE.md).
- Do not hardcode user-facing strings; use `useTranslation()` from `react-i18next`.
- Add new translations in both `vi` and `en` locale files.

## Styling & Components
- Prefer `StyleSheet.create` with semantic naming.
- Respect device safe areas using `react-native-safe-area-context`.
- Use TypeScript strict types for all props and navigation param lists.
