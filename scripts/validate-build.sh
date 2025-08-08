#!/bin/bash
echo "🔍 Validating build environment..."

# Check Java version
if java -version 2>&1 | grep -q "17"; then
    echo "✅ Java 17 detected"
else
    echo "❌ Java 17 required. Run: export JAVA_HOME=$(/usr/libexec/java_home -v 17)"
    exit 1
fi

# Check config files
if [ ! -f "config.json" ]; then
    echo "⚠️  config.json missing. Creating from sample..."
    cp config.sample.json config.json
fi

# Check google-services.json
if [ ! -f "google-services.json" ]; then
    echo "❌ google-services.json missing"
    exit 1
fi

echo "✅ Build environment validated!"