#!/usr/bin/env bash
set -euo pipefail

echo "[eas-build-pre-install] Start copying Firebase config files from EAS file env vars if present"

ROOT_DIR="$(pwd)"

if [[ -n "${GOOGLE_SERVICES_JSON:-}" && -f "$GOOGLE_SERVICES_JSON" ]]; then
  echo "- Writing google-services.json -> $ROOT_DIR/google-services.json"
  cp "$GOOGLE_SERVICES_JSON" "$ROOT_DIR/google-services.json"
else
  echo "- GOOGLE_SERVICES_JSON not set or file not found; skipping"
fi

if [[ -n "${GOOGLE_SERVICE_INFO_PLIST:-}" && -f "$GOOGLE_SERVICE_INFO_PLIST" ]]; then
  echo "- Writing GoogleService-Info.plist -> $ROOT_DIR/GoogleService-Info.plist"
  cp "$GOOGLE_SERVICE_INFO_PLIST" "$ROOT_DIR/GoogleService-Info.plist"
else
  echo "- GOOGLE_SERVICE_INFO_PLIST not set or file not found; skipping"
fi

echo "[eas-build-pre-install] Done"


