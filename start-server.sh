#!/bin/bash
echo "Starting CS2 Marketplace Server..."
echo ""
echo "Server will be available at: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
cd "$(dirname "$0")"
python -m http.server 8000

