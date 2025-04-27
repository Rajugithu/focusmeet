import React, { useEffect, useRef, useState } from 'react';

interface MeetingComponentProps {
    meetingId: string;
}

const MeetingComponent: React.FC<MeetingComponentProps> = ({ meetingId }) => {
    console.log("Meeting ID inside MeetingComponent:", meetingId); 

    const videoRef = useRef<HTMLVideoElement>(null);
    const [loadingStatus, setLoadingStatus] = useState('Initializing...');
    const [error, setError] = useState<string | null>(null);
    const [frameCount, setFrameCount] = useState(0);
    const animationFrameRef = useRef<number>();
    const lastApiCallRef = useRef<number>(0);
    const streamRef = useRef<MediaStream | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isAiServiceAvailable, setIsAiServiceAvailable] = useState(false);

    // Initialize canvas and context
    useEffect(() => {
        if (!canvasRef.current) {
            canvasRef.current = document.createElement('canvas');
            ctxRef.current = canvasRef.current.getContext('2d');
            console.log("Canvas initialized:", !!ctxRef.current);
        }

        return () => {
            canvasRef.current = null;
            ctxRef.current = null;
        };
    }, []);

    const displayFrameInConsole = (frameData: string) => {
        console.log(`%cFRAME #${frameCount}`, 
            'color: white; background: black; padding: 2px 5px; border-radius: 3px;');
        
        console.log('%c ', `font-size: 1px; padding: 100px 150px; background: url('data:image/jpeg;base64,${frameData}') no-repeat; background-size: contain;`);
    };

    const startWebcam = async () => {
        try {
            console.log("Starting webcam...");
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: 'user' }
            });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await new Promise<void>((resolve) => {
                    if (!videoRef.current) return;
                    
                    const onLoaded = () => {
                        videoRef.current?.removeEventListener('loadedmetadata', onLoaded);
                        resolve();
                    };
                    
                    videoRef.current.addEventListener('loadedmetadata', onLoaded);
                    if (videoRef.current.readyState >= 3) resolve();
                });
                
                setLoadingStatus('Webcam ready');
                console.log("Webcam successfully started");
            }
        } catch (err) {
            console.error('Webcam error:', err);
            setLoadingStatus('Webcam access denied!');
            setError('Could not access webcam');
        }
    };

    const checkAiService = async () => {
        try {
            const response = await fetch('http://192.168.100.116:5001/health', {
                method: 'GET'
            });
            setIsAiServiceAvailable(response.ok);
        } catch (error) {
            console.log('AI service not available, continuing without it');
            setIsAiServiceAvailable(false);
        }
    };

    const captureAndSendFrame = async () => {
        if (!canvasRef.current || !ctxRef.current || !videoRef.current || !streamRef.current) {
            console.log('Required elements not ready');
            return;
        }

        const now = Date.now();
        if (now - lastApiCallRef.current < 1000) { // Throttle API calls to once per second
            return;
        }

        try {
            // Draw the current video frame to the canvas
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            ctxRef.current.drawImage(videoRef.current, 0, 0);

            // Only try to send to AI service if it's available
            if (isAiServiceAvailable) {
                try {
                    const frameData = canvasRef.current.toDataURL('image/jpeg', 0.8).split(',')[1];
                    const response = await fetch('http://192.168.100.116:5001/predict', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ image: frameData })
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    console.log('API Response:', data);
                    lastApiCallRef.current = now;
                } catch (apiError) {
                    console.warn('API connection error:', apiError);
                    setIsAiServiceAvailable(false);
                }
            }

            setFrameCount(prev => prev + 1);
        } catch (error) {
            console.error('Frame capture error:', error);
        }
    };
    
    
    

    useEffect(() => {
        console.log("Mounting component");
        const start = async () => {
            await startWebcam();
            await checkAiService();
            animationFrameRef.current = requestAnimationFrame(captureAndSendFrame);
        };
        start();

        return () => {
            console.log("Unmounting component");
            cancelAnimationFrame(animationFrameRef.current!);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [meetingId]);

    return (
        <div className="relative w-[640px] h-[480px] bg-black overflow-hidden mx-auto mt-8 rounded-lg shadow-xl">
            <div className="absolute top-2.5 left-2.5 z-20 text-green-500 bg-black/70 px-2.5 py-1.5 rounded text-sm font-mono">
                {loadingStatus}
                {error && <span className="text-red-500 block mt-1">{error}</span>}
                <span className="block text-xs">Frames sent: {frameCount}</span>
                {!isAiServiceAvailable && (
                    <span className="block text-xs text-yellow-500">AI service not available</span>
                )}
            </div>
            
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
            />
        </div>
    );
};

export default MeetingComponent;
