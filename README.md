## Building HEXA

### Prerequisites:

- [Node](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/lang/en/)
- [CocoaPods](https://cocoapods.org/)
- [Xcode](https://developer.apple.com/xcode/)
- [Android Studio](https://developer.android.com/studio)

```
git clone https://github.com/bithyve/hexa.git
cd hexa
yarn install
```

Make sure you have a `.env` similar to `.env.example` in your project's root directory before running hexa. If this file is not present with the appropriate values then the app will crash abruptly.

### Run on iOS

```
yarn ios
```

### Run on Android

```
yarn android
```

## Contributing

Please feel free to open a pull requests, issues with bugfixes and suggestions.

## License

[LICENSE](LICENSE)
