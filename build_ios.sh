# Build
npm run tauri ios build -- --export-method app-store-connect

# Upload to Apple Store Connect
APPNAME=mobile-nx
source ./.env
xcrun altool --upload-app --type ios \
--file "./src-tauri/gen/apple/build/arm64/$APPNAME.ipa" \
--apiKey $APPLE_API_KEY_ID --apiIssuer $APPLE_API_ISSUER
