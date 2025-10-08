/**
 * Edge Detection Viewer - Android App Simulation
 * Real-time camera processing with edge detection
 */

interface FrameData {
    width: number;
    height: number;
    data: Uint8Array;
    timestamp: number;
    isEdgeDetectionEnabled: boolean;
    fps: number;
}

class EdgeDetectionViewer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private fpsCounter: HTMLElement;
    private frameCountElement: HTMLElement;
    private processingTimeElement: HTMLElement;
    private toggleBtn: HTMLButtonElement;
    private cameraBtn: HTMLButtonElement;
    private statusIndicator: HTMLElement;
    private processingIndicator: HTMLElement;
    
    private frameCount: number = 0;
    private lastTime: number = 0;
    private isEdgeDetectionEnabled: boolean = false;
    private isCameraRunning: boolean = false;
    private animationId: number | null = null;
    private currentFrame: FrameData | null = null;
    private processingStartTime: number = 0;

    constructor() {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.fpsCounter = document.getElementById('fps-counter')!;
        this.frameCountElement = document.getElementById('frame-count')!;
        this.processingTimeElement = document.getElementById('processing-time')!;
        this.toggleBtn = document.getElementById('toggle-btn') as HTMLButtonElement;
        this.cameraBtn = document.getElementById('camera-btn') as HTMLButtonElement;
        this.statusIndicator = document.getElementById('status-indicator')!;
        this.processingIndicator = document.getElementById('processing-indicator')!;

        this.setupCanvas();
        this.setupControls();
        this.setupKeyboardControls();
        this.startAnimation();
    }

    private setupCanvas(): void {
        this.canvas.width = 640;
        this.canvas.height = 480;
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private setupControls(): void {
        this.toggleBtn.addEventListener('click', () => {
            this.toggleEdgeDetection();
        });

        this.cameraBtn.addEventListener('click', () => {
            this.toggleCamera();
        });
    }

    private setupKeyboardControls(): void {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'e' || e.key === 'E') {
                this.toggleEdgeDetection();
            } else if (e.key === 'c' || e.key === 'C') {
                this.toggleCamera();
            }
        });
    }

    private toggleCamera(): void {
        this.isCameraRunning = !this.isCameraRunning;
        
        if (this.isCameraRunning) {
            this.cameraBtn.classList.add('active');
            this.cameraBtn.querySelector('span')!.textContent = 'Stop Camera';
            this.statusIndicator.style.background = '#4CAF50';
            this.startCameraSimulation();
        } else {
            this.cameraBtn.classList.remove('active');
            this.cameraBtn.querySelector('span')!.textContent = 'Start Camera';
            this.statusIndicator.style.background = '#f44336';
            this.stopCameraSimulation();
        }
    }

    private toggleEdgeDetection(): void {
        this.isEdgeDetectionEnabled = !this.isEdgeDetectionEnabled;
        
        if (this.isEdgeDetectionEnabled) {
            this.toggleBtn.classList.add('active');
            this.toggleBtn.querySelector('span')!.textContent = 'Disable Edge Detection';
        } else {
            this.toggleBtn.classList.remove('active');
            this.toggleBtn.querySelector('span')!.textContent = 'Enable Edge Detection';
        }
    }

    private startCameraSimulation(): void {
        // Simulate camera startup
        this.showProcessingIndicator();
        setTimeout(() => {
            this.hideProcessingIndicator();
            this.generateCameraFrame();
        }, 1000);
    }

    private stopCameraSimulation(): void {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private generateCameraFrame(): void {
        if (!this.isCameraRunning) return;

        this.processingStartTime = performance.now();
        this.showProcessingIndicator();

        // Simulate processing delay
        setTimeout(() => {
            this.hideProcessingIndicator();
            this.renderFrame();
            this.updateStats();
            
            // Continue generating frames
            if (this.isCameraRunning) {
                requestAnimationFrame(() => this.generateCameraFrame());
            }
        }, 50); // Simulate processing time
    }

    private renderFrame(): void {
        const imageData = this.ctx.createImageData(640, 480);
        const width = 640;
        const height = 480;

        for (let i = 0; i < imageData.data.length; i += 4) {
            const x = (i / 4) % width;
            const y = Math.floor((i / 4) / width);

            let r, g, b;

            if (this.isEdgeDetectionEnabled) {
                // Simulate edge detection - create realistic patterns
                const centerX = width / 2;
                const centerY = height / 2;
                const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                
                // Create dynamic edge patterns with time-based animation
                const time = Date.now() * 0.001;
                const noise = Math.sin(x * 0.02 + time) * Math.cos(y * 0.02 + time);
                const edge = Math.sin(distance * 0.05 + time * 2) > 0.6 ? 255 : 0;
                
                // Add some noise to make it look more realistic
                const edgeWithNoise = Math.max(0, Math.min(255, edge + noise * 50));
                r = g = b = edgeWithNoise;
            } else {
                // Simulate original camera feed with realistic patterns
                const time = Date.now() * 0.001;
                const noise = Math.random() * 30;
                
                // Create a more realistic camera-like pattern
                const gradient = (x + y) / (width + height) * 255;
                const wave = Math.sin(x * 0.01 + time) * Math.cos(y * 0.01 + time) * 20;
                
                r = Math.min(255, Math.max(0, gradient + noise + wave));
                g = Math.min(255, Math.max(0, gradient * 0.9 + noise + wave * 0.8));
                b = Math.min(255, Math.max(0, gradient * 0.8 + noise + wave * 0.6));
            }

            imageData.data[i] = r;     // R
            imageData.data[i + 1] = g; // G
            imageData.data[i + 2] = b; // B
            imageData.data[i + 3] = 255; // A
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    private updateStats(): void {
        this.frameCount++;
        const currentTime = performance.now();

        if (currentTime - this.lastTime >= 1000) {
            const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.fpsCounter.textContent = fps.toString();
            this.frameCountElement.textContent = this.frameCount.toString();
            
            this.frameCount = 0;
            this.lastTime = currentTime;
        }

        // Update processing time
        const processingTime = Math.round(performance.now() - this.processingStartTime);
        this.processingTimeElement.textContent = `${processingTime}ms`;
    }

    private showProcessingIndicator(): void {
        this.processingIndicator.classList.add('show');
    }

    private hideProcessingIndicator(): void {
        this.processingIndicator.classList.remove('show');
    }

    private startAnimation(): void {
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
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
    
    // Add some console logging for debugging
    console.log('🔍 Edge Detection Viewer initialized');
    console.log('📱 This simulates the Android app\'s camera processing pipeline');
    console.log('⌨️  Press E to toggle edge detection, C to toggle camera');
});