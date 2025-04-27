import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import os from "os";

interface HttpError extends Error {
  status?: number;
  statusCode?: number;
}

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.disable('x-powered-by');

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

// Get local IP address for network access
function getLocalIpAddress(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '0.0.0.0';
}

(async () => {
  try {
    const server = await registerRoutes(app);

    // Global error handler
    app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      log(`Error ${status}: ${message}`);
      res.status(status).json({ message });
    });

    // Vite setup
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Server configuration
    const host = process.env.HOST || '0.0.0.0';
    const PORT = 8080;
    const localIp = getLocalIpAddress();

    server.listen(PORT, host, () => {
      log(`Server is running on:
  - Local:    http://localhost:${PORT}
  - Network:  http://${localIp}:${PORT}`);
      
      if (app.get("env") === "development") {
        log("\nAccess from mobile devices:");
        log(`1. Connect your phone to the same WiFi network`);
        log(`2. Visit: http://${localIp}:${PORT}`);
      }
    });

  } catch (error) {
    console.error("Fatal Server Error:", error);
    process.exit(1);
  }
})();