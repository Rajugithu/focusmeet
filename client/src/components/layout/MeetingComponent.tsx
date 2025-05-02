import React, { useEffect, useRef, useState } from 'react';

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
    
        if (isAnalyzing) return; // Skip if previous analysis is still in progress
    
        try {
            setIsAnalyzing(true);
            setStatus('Analyzing...');
            
            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
    
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas context not available');
    
            // Clear and draw the current video frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.scale(-1, 1); // Mirror the image
            ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
            ctx.restore();
    
            // Convert canvas to Blob and send to server
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    setIsAnalyzing(false);
                    return;
                }
    
                try {
                    const formData = new FormData();
                    formData.append('image', blob, 'frame.jpg');
                    formData.append('meetingId', meetingId);
                    formData.append('userId', userId);
    
                    const response = await fetch('/api/analyze-frame', {
                        method: 'POST',
                        body: formData,
                    });
    
                    const contentType = response.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                        const text = await response.text();
                        throw new Error(`Unexpected Response: ${text.substring(0, 100)}`);
                    }
    
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.message || `Server returned ${response.status}`);
                    }
                    
                    const result = await response.json();
                    setLastResult(result);
                    updateStatusFromResult(result);
                    setFrameCount(prev => prev + 1);
                } catch (err) {
                    console.error('Analysis error:', err);
                    setError(
                        err instanceof Error 
                            ? err.message 
                            : typeof err === 'string' 
                                ? err 
                                : 'Analysis failed'
                    );
                } finally {
                    setIsAnalyzing(false);
                }
            }, 'image/jpeg', 0.8); // JPEG at 80% quality
        } catch (error) {
            console.error('Capture error:', error);
            setError('Frame capture failed');
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