# ShopNest Mobile App

Flutter mobile application for ShopNest e-commerce.

## Tech Stack

- Flutter (Dart)
- Provider (state management)
- HTTP client for API calls
- Shared Preferences for local auth/session data

## Requirements

- Flutter SDK 3.35+
- Dart SDK 3.11+
- Android Studio or Xcode (for emulator/device builds)

## Setup

From this folder:

```bash
flutter pub get
flutter run
```

## API Configuration

The app uses a hardcoded backend URL in `lib/config/api_config.dart`:

```dart
static const String baseUrl = 'https://shop-nest-backend.vercel.app';
```

For local backend testing, change it to:

```dart
static const String baseUrl = 'http://10.0.2.2:4000';
```

Use your machine's LAN IP for physical devices (for example, `http://192.168.1.20:4000`).

## Useful Commands

- `flutter pub get` - install dependencies
- `flutter run` - run in debug mode
- `flutter test` - run tests
- `flutter build apk` - build Android APK
- `flutter build ios` - build iOS app

## Notes

- Make sure backend CORS and network access allow mobile requests.
- Payment and order verification routes depend on backend configuration.
