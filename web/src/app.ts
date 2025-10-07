class EdgeDetectionViewer { 
    private canvas: HTMLCanvasElement; 
    private ctx: CanvasRenderingContext2D; 
    private fpsCounter: HTMLElement; 
    private frameCount: number = 0; 
    private lastTime: number = 0; 
 
    constructor() { 
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement; 
        this.ctx = this.canvas.getContext('2d')!; 
        this.fpsCounter = document.getElementById('fps-counter')!; 
 
        this.setupCanvas(); 
        this.loadSampleFrame(); 
    } 
 
    private setupCanvas(): void { 
        this.canvas.width = 640; 
        this.canvas.height = 480; 
    } 
 
    private loadSampleFrame(): void { 
        // Create a sample edge-detected frame 
        const imageData = this.ctx.createImageData(640, 480); 
 
        // Generate a simple pattern to simulate edge detection 
        for (let i = 0; i < imageData.data.length; i += 4) { 
            const x = (i / 4) % 640; 
            const y = Math.floor((i / 4) / 640); 
 
            // Create a simple edge pattern 
            const intensity = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 255; 
 
            imageData.data[i] = intensity;     // R 
            imageData.data[i + 1] = intensity; // G 
            imageData.data[i + 2] = intensity; // B 
            imageData.data[i + 3] = 255;       // A 
        } 
 
        this.ctx.putImageData(imageData, 0, 0); 
        this.updateFPS(); 
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
 
        requestAnimationFrame(() => this.updateFPS()); 
    } 
} 
 
// Initialize the viewer when the page loads 
document.addEventListener('DOMContentLoaded', () => { 
    new EdgeDetectionViewer(); 
}); 
