interface FrameData {
    width: number;
    height: number;
    data: Uint8Array;
    timestamp: number;
}

class EdgeDetectionViewer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private fpsCounter: HTMLElement;
    private frameCount: number = 0;
    private lastTime: number = 0;
    private isEdgeDetectionEnabled: boolean = true;
    private currentFrame: FrameData | null = null;
    private animationId: number | null = null;

    constructor() {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.fpsCounter = document.getElementById('fps-counter')!;

        this.setupCanvas();
        this.setupControls();
        this.loadSampleFrame();
        this.startAnimation();
    }

    private setupCanvas(): void {
        this.canvas.width = 640;
        this.canvas.height = 480;
    }

    private setupControls(): void {
        // Add keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.key === 'e' || e.key === 'E') {
                this.toggleEdgeDetection();
            }
        });

        // Add click to toggle
        this.canvas.addEventListener('click', () => {
            this.toggleEdgeDetection();
        });
    }

    private loadSampleFrame(): void {
        // Create a more realistic sample frame
        this.generateSampleFrame();
    }

    private generateSampleFrame(): void {
        const imageData = this.ctx.createImageData(640, 480);
        const width = 640;
        const height = 480;

        for (let i = 0; i < imageData.data.length; i += 4) {
            const x = (i / 4) % width;
            const y = Math.floor((i / 4) / width);

            let r, g, b;

            if (this.isEdgeDetectionEnabled) {
                // Simulate edge detection - create geometric patterns
                const centerX = width / 2;
                const centerY = height / 2;
                const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                
                // Create circular edge patterns
                const edge = Math.sin(distance * 0.05) > 0.8 ? 255 : 0;
                r = g = b = edge;
            } else {
                // Simulate original camera feed
                const noise = Math.random() * 50;
                const gradient = (x + y) / (width + height) * 255;
                r = Math.min(255, gradient + noise);
                g = Math.min(255, gradient * 0.8 + noise);
                b = Math.min(255, gradient * 0.6 + noise);
            }

            imageData.data[i] = r;     // R
            imageData.data[i + 1] = g; // G
            imageData.data[i + 2] = b; // B
            imageData.data[i + 3] = 255; // A
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    private toggleEdgeDetection(): void {
        this.isEdgeDetectionEnabled = !this.isEdgeDetectionEnabled;
        this.generateSampleFrame();
        
        // Update UI indication
        const status = this.isEdgeDetectionEnabled ? 'ON' : 'OFF';
        console.log(`Edge Detection: ${status}`);
    }

    private startAnimation(): void {
        const animate = () => {
            this.updateFPS();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    private updateFPS(): void {
        this.frameCount++;
        const currentTime = performance.now();

        if (currentTime - this.lastTime >= 1000) {
            const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.fpsCounter.textContent = `FPS: ${fps}`;

            this.frameCount = 0;
            this.lastTime = currentTime;
        }
    }

    // Method to receive frame data from Android app (for future integration)
    public updateFrame(frameData: FrameData): void {
        this.currentFrame = frameData;
        this.renderFrame(frameData);
    }

    private renderFrame(frameData: FrameData): void {
        const imageData = this.ctx.createImageData(frameData.width, frameData.height);
        
        for (let i = 0; i < frameData.data.length; i++) {
            imageData.data[i] = frameData.data[i];
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    public destroy(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize the viewer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const viewer = new EdgeDetectionViewer();
    
    // Add instructions
    const instructions = document.createElement('div');
    instructions.innerHTML = `
        <div style="text-align: center; margin: 10px 0; color: #666;">
            <p>Click the canvas or press 'E' to toggle edge detection</p>
            <p>This simulates the Android app's real-time edge detection</p>
        </div>
    `;
    document.querySelector('.container')?.appendChild(instructions);
});
