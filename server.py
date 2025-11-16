#!/usr/bin/env python3
"""
Simple HTTP server for local development
Usage: python3 server.py [port]
Default port: 8080
"""

import http.server
import socketserver
import sys
import os

# Default port
PORT = 8080

# Get port from command line argument if provided
if len(sys.argv) > 1:
    try:
        PORT = int(sys.argv[1])
    except ValueError:
        print("Invalid port number. Using default port 8080.")

# Change to the directory containing this script
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Create server
Handler = http.server.SimpleHTTPRequestHandler
Handler.extensions_map.update({
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
})

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Server running at http://localhost:{PORT}/")
        print(f"Open http://localhost:{PORT}/main.html in your browser")
        print("Press Ctrl+C to stop the server")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopped.")
except OSError as e:
    if e.errno == 98:  # Address already in use
        print(f"Port {PORT} is already in use. Try a different port:")
        print(f"python3 server.py {PORT + 1}")
    else:
        print(f"Error starting server: {e}")
