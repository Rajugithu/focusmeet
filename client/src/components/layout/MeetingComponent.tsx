import React, { useEffect, useRef, useState } from 'react';
import { object } from 'zod';

interface MeetingComponentProps {
    meetingId: string;
    stream: MediaStream | null;
    hasJoined: boolean;
}

interface AnalysisResult {
    isAttentive: boolean;
    confidence: number;
    faceDetected: boolean;
}

const MeetingComponent: React.FC<MeetingComponentProps> = ({ meetingId, stream, hasJoined }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [status, setStatus] = useState('Initializing...');
    const [error, setError] = useState<string | null>(null);
    const [frameCount, setFrameCount] = useState(0);
    const [lastResult, setLastResult] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const userRole = localStorage.getItem('role');
    const userId = localStorage.getItem('userId') || 'unknown';

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (analysisIntervalRef.current) {
                clearInterval(analysisIntervalRef.current);
            }
        };
    }, []);

    // Stream handling
    useEffect(() => {
        if (!videoRef.current || !stream) return;

        videoRef.current.srcObject = stream;

        const handleCanPlay = async () => {
            try {
                await videoRef.current?.play();
                setStatus('Stream active');
                
                if (userRole === 'student' && hasJoined) {
                    startFaceAnalysis();
                }
            } catch (e) {
                console.error("Video play error:", e);
                setError('Failed to play video stream');
            }
        };

        videoRef.current.addEventListener('canplay', handleCanPlay);

        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('canplay', handleCanPlay);
            }
        };
    }, [stream, hasJoined, userRole]);

    // Start/stop analysis based on join status and role
    useEffect(() => {
        if (userRole !== 'student' || !hasJoined) {
            stopFaceAnalysis();
            return;
        }

        if (videoRef.current && videoRef.current.readyState >= 2 && stream) {
            startFaceAnalysis();
        }
    }, [hasJoined, stream, userRole]);

    const startFaceAnalysis = () => {
        stopFaceAnalysis(); // Clear any existing interval
        
        // Initial capture
        captureAndAnalyzeFrame();
        
        // Set up periodic capture
        analysisIntervalRef.current = setInterval(() => {
            captureAndAnalyzeFrame();
        }, 2000); // Analyze every 2 seconds
    };

    const stopFaceAnalysis = () => {
        if (analysisIntervalRef.current) {
            clearInterval(analysisIntervalRef.current);
            analysisIntervalRef.current = null;
        }
        setIsAnalyzing(false);
    };

    const captureAndAnalyzeFrame = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
    
        if (!video || !canvas || !stream || !stream.active || video.readyState < 2 || video.videoWidth === 0) {
            console.log("Video not ready for capture");
            return;
        }
    
        if (isAnalyzing) return;
    
        try {
            debugger;
            setIsAnalyzing(true);
            setStatus('Analyzing...');
            setError(null);
            debugger;
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
    
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas context not available');
    
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
            ctx.restore();
    
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
            const blob = await new Promise<Blob | null>((resolve) => {
                canvas.toBlob(resolve, 'image/jpeg', 0.8);
            });
    
            if (!blob) {
                throw new Error('Failed to capture frame');
            }
    
            // Create an Object URL for the captured image
            const objectUrl = URL.createObjectURL(blob);

            // Create an image element to display the captured frame in the console
            const img = new Image();
            img.src = objectUrl;

            // Log it to the console
            console.log(img);

            // Optionally, append the image to the body to display in the page
            document.body.appendChild(img);
            const formData = new FormData();

            formData.append('frame', blob, 'frame.jpg');
            formData.append('userId', userId);
    
            debugger;
            const response = await fetch(`http://localhost:5000/api/ai/process-frame`, {
                method: 'POST',
                headers: {
                    'meeting-id': meetingId
                },
                body: formData,
                signal: AbortSignal.timeout(10000)
            });
    
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Analysis failed');
            }
    
            setLastResult(data.data);
            updateStatusFromResult(data.data);
    
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Analysis failed');
        } finally {
            setIsAnalyzing(false);
        }
    
    };

    const updateStatusFromResult = (result: AnalysisResult) => {
        if (!result.faceDetected) {
            setStatus('No face detected');
            return;
        }

        const confidencePercent = Math.round(result.confidence * 100);
        setStatus(result.isAttentive
            ? `Attentive (${confidencePercent}%)`
            : `Distracted (${confidencePercent}%)`);
    };

    return (
        <div className="relative w-[640px] h-[480px] bg-black overflow-hidden mx-auto mt-8 rounded-lg shadow-xl">
            {/* Status overlay */}
            <div className={`absolute top-2 left-2 z-20 px-2 py-1 rounded text-sm font-mono
                ${isAnalyzing ? 'bg-blue-500/90 text-white' :
                    lastResult?.isAttentive ? 'bg-green-500/90 text-white' :
                        lastResult?.faceDetected ? 'bg-yellow-500/90 text-black' :
                            'bg-red-500/90 text-white'}`}>
                {status}
                {error && <div className="text-xs mt-1">{error}</div>}
                <div className="text-xs">Frames analyzed: {frameCount}</div>
            </div>

            {/* Video stream */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
            />

            {/* Hidden Canvas (used for frame capture) */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
};

export default MeetingComponent;