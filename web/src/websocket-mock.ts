/**
 * WebSocket Mock Server for Edge Detection App
 * Simulates real-time communication between Android app and web viewer
 */

export interface FrameData {
    width: number;
    height: number;
    data: Uint8Array;
    timestamp: number;
    isEdgeDetectionEnabled: boolean;
    fps: number;
}

export class WebSocketMockServer {
    private isConnected: boolean = false;
    private frameInterval: number | null = null;
    private onFrameCallback: ((frame: FrameData) => void) | null = null;
    private onStatusCallback: ((status: string) => void) | null = null;

    constructor() {
        this.setupMockServer();
    }

    private setupMockServer(): void {
        // Simulate WebSocket connection
        setTimeout(() => {
            this.isConnected = true;
            this.onStatusCallback?.("Connected to Android Edge Detection App");
            this.startFrameStream();
        }, 1000);
    }

    public connect(): Promise<boolean> {
        return new Promise((resolve) => {
            if (this.isConnected) {
                resolve(true);
            } else {
                setTimeout(() => {
                    this.isConnected = true;
                    this.onStatusCallback?.("Connected to Android Edge Detection App");
                    this.startFrameStream();
                    resolve(true);
                }, 1000);
            }
        });
    }

    public disconnect(): void {
        this.isConnected = false;
        if (this.frameInterval) {
            clearInterval(this.frameInterval);
            this.frameInterval = null;
        }
        this.onStatusCallback?.("Disconnected from Android Edge Detection App");
    }

    public onFrame(callback: (frame: FrameData) => void): void {
        this.onFrameCallback = callback;
    }

    public onStatus(callback: (status: string) => void): void {
        this.onStatusCallback = callback;
    }

    private startFrameStream(): void {
        if (!this.isConnected) return;

        let frameCount = 0;
        let isEdgeDetectionEnabled = true;
        let lastTime = Date.now();

        this.frameInterval = setInterval(() => {
            if (!this.isConnected) return;

            const currentTime = Date.now();
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            if (currentTime - lastTime >= 1000) {
                frameCount = 0;
                lastTime = currentTime;
            }

            // Generate mock frame data
            const frame = this.generateMockFrame(fps, isEdgeDetectionEnabled);
            this.onFrameCallback?.(frame);

            frameCount++;
        }, 100); // 10 FPS for demo
    }

    private generateMockFrame(fps: number, isEdgeDetectionEnabled: boolean): FrameData {
        const width = 640;
        const height = 480;
        const data = new Uint8Array(width * height * 3);

        for (let i = 0; i < data.length; i += 3) {
            const x = (i / 3) % width;
            const y = Math.floor((i / 3) / width);

            let r, g, b;

            if (isEdgeDetectionEnabled) {
                // Simulate edge detection patterns
                const centerX = width / 2;
                const centerY = height / 2;
                const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                
                // Create dynamic edge patterns
                const time = Date.now() * 0.001;
                const edge = Math.sin(distance * 0.05 + time) > 0.7 ? 255 : 0;
                r = g = b = edge;
            } else {
                // Simulate original camera feed
                const noise = Math.random() * 30;
                const gradient = (x + y) / (width + height) * 255;
                r = Math.min(255, gradient + noise);
                g = Math.min(255, gradient * 0.8 + noise);
                b = Math.min(255, gradient * 0.6 + noise);
            }

            data[i] = r;     // R
            data[i + 1] = g; // G
            data[i + 2] = b; // B
        }

        return {
            width,
            height,
            data,
            timestamp: Date.now(),
            isEdgeDetectionEnabled,
            fps
        };
    }

    public toggleEdgeDetection(): void {
        // This would be called from the Android app
        console.log("Edge detection toggled via WebSocket");
    }

    public sendCommand(command: string): void {
        if (this.isConnected) {
            console.log(`Sending command to Android app: ${command}`);
            // In a real implementation, this would send to the Android app
        }
    }
}

// HTTP Mock Endpoint
export class HttpMockServer {
    private baseUrl: string = "http://localhost:8080/api";

    public async getFrameData(): Promise<FrameData> {
        // Simulate HTTP request delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const width = 640;
        const height = 480;
        const data = new Uint8Array(width * height * 3);

        // Generate mock data
        for (let i = 0; i < data.length; i += 3) {
            const x = (i / 3) % width;
            const y = Math.floor((i / 3) / width);
            
            const intensity = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 255;
            data[i] = intensity;     // R
            data[i + 1] = intensity; // G
            data[i + 2] = intensity; // B
        }

        return {
            width,
            height,
            data,
            timestamp: Date.now(),
            isEdgeDetectionEnabled: true,
            fps: 15
        };
    }

    public async sendCommand(command: string): Promise<boolean> {
        console.log(`HTTP POST to ${this.baseUrl}/command: ${command}`);
        // Simulate HTTP response
        await new Promise(resolve => setTimeout(resolve, 50));
        return true;
    }
}
