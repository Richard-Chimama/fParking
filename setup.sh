#!/bin/bash
echo "🚀 Setting up fParking development environment..."

# Install dependencies
npm install

# Setup config
cp config.sample.json config.json

# Set Java version
export JAVA_HOME=$(/usr/libexec/java_home -v 17)

# Validate setup
./scripts/validate-build.sh

echo "✅ Setup complete! Run 'npm run build:android:local' to start building."