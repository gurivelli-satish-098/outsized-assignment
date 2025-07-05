#!/bin/bash

# 🚀 Outsized Auth Documentation Deployment Script
# This script automates the deployment of API documentation to Netlify

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "docs" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Starting documentation deployment to Netlify..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    print_warning "Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Check if user is logged in to Netlify
if ! netlify status &> /dev/null; then
    print_warning "Not logged in to Netlify. Please login first:"
    print_status "Run: netlify login"
    exit 1
fi

# Validate Swagger file
print_status "Validating Swagger specification..."
if ! npx swagger-cli validate docs/swagger.yaml &> /dev/null; then
    print_warning "Swagger validation failed, but continuing..."
fi

# Test local serving
print_status "Testing local documentation..."
if command -v python3 &> /dev/null; then
    timeout 5s python3 -m http.server 8000 --directory docs > /dev/null 2>&1 &
    SERVER_PID=$!
    sleep 2
    if curl -s http://localhost:8000 > /dev/null; then
        print_success "Local documentation test passed"
    else
        print_warning "Local documentation test failed"
    fi
    kill $SERVER_PID 2>/dev/null || true
elif command -v python &> /dev/null; then
    timeout 5s python -m http.server 8000 --directory docs > /dev/null 2>&1 &
    SERVER_PID=$!
    sleep 2
    if curl -s http://localhost:8000 > /dev/null; then
        print_success "Local documentation test passed"
    else
        print_warning "Local documentation test failed"
    fi
    kill $SERVER_PID 2>/dev/null || true
else
    print_warning "Python not found, skipping local test"
fi

# Deploy to Netlify
print_status "Deploying to Netlify..."
if netlify deploy --prod --dir=docs; then
    print_success "Documentation deployed successfully!"
    
    # Get the deployment URL
    DEPLOY_URL=$(netlify status --json | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
    if [ ! -z "$DEPLOY_URL" ]; then
        print_success "Your documentation is available at: $DEPLOY_URL"
        echo ""
        print_status "Quick links:"
        echo "  📖 Main Docs: $DEPLOY_URL"
        echo "  📋 API Spec: $DEPLOY_URL/swagger.yaml"
        echo "  🔧 Try it out: $DEPLOY_URL"
        echo ""
    fi
else
    print_error "Deployment failed!"
    exit 1
fi

# Optional: Open in browser
if command -v open &> /dev/null; then
    read -p "Open documentation in browser? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "$DEPLOY_URL"
    fi
elif command -v xdg-open &> /dev/null; then
    read -p "Open documentation in browser? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        xdg-open "$DEPLOY_URL"
    fi
fi

print_success "Deployment completed! 🎉" 