# i18next Implementation Guide

## 📁 Project Structure

```
src/i18n/
├── index.ts              # i18next initialization
├── resources.ts          # Import all translation files
└── locales/
    ├── vi/               # Vietnamese translations
    │   ├── common.json   # Common words/phrases
    │   ├── dashboard.json
    │   ├── transaction.json
    │   ├── analysis.json
    │   └── profile.json
    └── en/               # English translations
        ├── common.json
        ├── dashboard.json
        ├── transaction.json
        ├── analysis.json
        └── profile.json

src/hooks/
└── useTranslation.ts     # Custom hook for using translations

src/components/
└── LanguageSwitcher.tsx  # Language switcher component
```

## 🚀 Usage

### 1. In Any Component

```typescript
import { useTranslation } from '../hooks/useTranslation';

export default function MyComponent() {
  // Get translations from 'dashboard' namespace
  const { t } = useTranslation('dashboard');
  
  return <Text>{t('title')}</Text>;
}
```

### 2. Using Multiple Namespaces

```typescript
const { t: tDashboard } = useTranslation('dashboard');
const { t: tCommon } = useTranslation('common');

return (
  <>
    <Text>{tDashboard('title')}</Text>
    <Text>{tCommon('language')}</Text>
  </>
);
```

### 3. Language Switching

```typescript
const { switchLanguage, currentLanguage } = useTranslation();

// Switch to Vietnamese
switchLanguage('vi');

// Switch to English
switchLanguage('en');

// Check current language
if (currentLanguage === 'vi') {
  // Do something for Vietnamese
}
```

### 4. Language Switcher Component

```typescript
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Settings() {
  return <LanguageSwitcher />;
}
```

## 📝 Adding New Translations

### Step 1: Add to JSON Files

**src/i18n/locales/vi/dashboard.json**
```json
{
  "new_key": "Giá trị tiếng Việt"
}
```

**src/i18n/locales/en/dashboard.json**
```json
{
  "new_key": "English value"
}
```

### Step 2: Use in Component

```typescript
const { t } = useTranslation('dashboard');
<Text>{t('new_key')}</Text>
```

## 🔧 Configuration

**src/i18n/index.ts**

Currently configured with:
- Default language: `vi` (Vietnamese)
- Fallback language: `en` (English)
- Namespaces: `common`, `dashboard`, `transaction`, `analysis`, `profile`
- Default namespace: `common`

To change default language:
```typescript
i18n.init({
  lng: "en",  // Change to 'en' for English
  // ...
});
```

## 📚 Adding New Namespace

### 1. Create translation files
- `src/i18n/locales/vi/new-namespace.json`
- `src/i18n/locales/en/new-namespace.json`

### 2. Import in resources.ts
```typescript
import viNewNamespace from "./locales/vi/new-namespace.json";
import enNewNamespace from "./locales/en/new-namespace.json";

const resources = {
  vi: {
    // ... existing
    newNamespace: viNewNamespace,
  },
  en: {
    // ... existing
    newNamespace: enNewNamespace,
  },
};
```

### 3. Add to i18n/index.ts
```typescript
i18n.init({
  // ...
  ns: ["common", "dashboard", "newNamespace"],
  // ...
});
```

### 4. Use in components
```typescript
const { t } = useTranslation('newNamespace');
```

## 🎨 Interpolation

Support for dynamic values:

**JSON**
```json
{
  "greeting": "Hello, {{name}}!"
}
```

**Component**
```typescript
<Text>{t('greeting', { name: 'John' })}</Text>
// Output: "Hello, John!"
```

## 🌍 Supported Languages

- **vi** - Vietnamese
- **en** - English

To add more languages:
1. Create new folder in `src/i18n/locales/`
2. Add language code (e.g., `fr` for French)
3. Create JSON files matching existing structure
4. Import in `resources.ts`
5. Update `i18n/index.ts` with new language code

## 💡 Tips

1. **Always use the custom hook** - Import from `src/hooks/useTranslation.ts`
2. **Organize by feature** - Keep translations in their respective namespace
3. **Use meaningful keys** - Make keys descriptive (e.g., `total_balance` instead of `tb`)
4. **Keep consistency** - Same key across all languages
5. **Update translations** - When adding features, update all language files

## 🐛 Troubleshooting

**Missing translation key?**
- Check if key exists in JSON file
- Verify namespace name is correct
- Fallback language (en) will be used if not found

**Language not switching?**
- Ensure component uses the hook
- Check that language code is correct (vi/en)
- Clear app cache and restart

