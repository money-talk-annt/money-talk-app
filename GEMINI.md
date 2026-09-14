# Money Talk - Antigravity Agent Guidelines

> Dự án: **Money Talk** (Mobile App Quản lý tài chính / giao tiếp)  
> Stack chính: **Expo SDK 57 (v57.0.22)**, **React Native 0.86.3**, **React 19.2.3**, **TypeScript**, **Zustand**, **React Navigation 7**, **Reanimated 4.5.1**, **i18next**.

---

## 1. Nguyên Tắc Quan Trọng: Expo SDK 57
- Expo SDK 57 đi kèm React Native 0.86 và React 19.2.3 (New Architecture mặc định).
- Luôn tra cứu tài liệu chính thức theo phiên bản tại: https://docs.expo.dev/versions/v57.0.0/
- **Cài đặt thư viện**: Sử dụng `npx expo install <package>` để đảm bảo độ tương thích phiên bản SDK 57.
- Không sử dụng các API cũ đã bị deprecated ở Expo SDK 57.

---

## 2. Tiêu Chuẩn Kiến Trúc & Codebase
- **Quản lý trạng thái (State Management)**: Sử dụng **Zustand** (store đặt trong `src/store/` hoặc `src/stores/`).
- **Điều hướng (Navigation)**: React Navigation v7 (`@react-navigation/native-stack`, `@react-navigation/bottom-tabs`). Tuân thủ typing an toàn với TypeScript.
- **Đa ngôn ngữ (i18n)**: Tuân thủ hướng dẫn chi tiết tại [I18N_GUIDE.md](file:///d:/money-talk-app/I18N_GUIDE.md) sử dụng `i18next` và `react-i18next`.
- **Animation & Cử chỉ**: `react-native-reanimated` 4.5.1 và `react-native-gesture-handler` 2.32.
- **Async Storage**: `@react-native-async-storage/async-storage`.

---

## 3. Customizations & Skills Có Sẵn
Hệ thống agent của Antigravity tự động tải các tài nguyên từ thư mục `.agents/`:
- **Rules**: `.agents/rules/expo-v57.md`, `.agents/rules/project-standards.md`
- **Skills**: `.agents/skills/expo-workflow/` (Quy trình kiểm tra, chạy dev, cài package và xử lý sự cố Expo SDK 57)
