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
    const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const userRole = localStorage.getItem('role');
    const roomId = localStorage.getItem("meetingRoomId") || '';
    const userId = localStorage.getItem('userId') || 'unknown';

    // Initialize canvas and video handling
    useEffect(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        (canvasRef as React.MutableRefObject<HTMLCanvasElement | null>).current = canvas;

        return () => {
            if (analysisIntervalRef.current) {
                clearInterval(analysisIntervalRef.current);
            }
        };
    }, []);

    // Handle stream changes
    useEffect(() => {
        if (!videoRef.current || !stream) return;

        videoRef.current.srcObject = stream;
        debugger;
        const handleLoadedMetadata = () => {
            console.log("Video stream ready");
            if (userRole === 'student' && hasJoined) {
                startFaceAnalysis();
                debugger;
            }
            
        };

        videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
        
        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
            }
        };
    }, [stream, hasJoined, userRole]);

    // Start/stop monitoring based on join status
    useEffect(() => {
        debugger;
        if (userRole !== 'student' || !hasJoined) {
            debugger;
            if (analysisIntervalRef.current) {
                clearInterval(analysisIntervalRef.current);
                analysisIntervalRef.current = null;
            }
            return;
        }

        if (stream) {
            startFaceAnalysis();
        }

        return () => {
            if (analysisIntervalRef.current) {
                clearInterval(analysisIntervalRef.current);
            }
        };
    }, [hasJoined, stream, userRole]);

    const startFaceAnalysis = () => {
        if (analysisIntervalRef.current) {
            clearInterval(analysisIntervalRef.current);
        }
        
        // Initial analysis
        captureAndAnalyzeFrame();
        debugger;
        
        // Set up periodic analysis
        analysisIntervalRef.current = setInterval(() => {
            captureAndAnalyzeFrame();
        }, 2000);
    };

    const captureAndAnalyzeFrame = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        debugger;
        
        if (!video || !canvas || video.readyState < 3) {
            console.log("Video not ready for capture");
            debugger;
            return;
        }

        try {
            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas context not available');

            // Draw video frame to canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert to blob for analysis
            const blob = await new Promise<Blob | null>((resolve) => {
                canvas.toBlob(resolve, 'image/jpeg', 0.9);
            });

            if (!blob) throw new Error('Failed to create image blob');

            const formData = new FormData();
            formData.append('frame', blob, 'frame.jpg');
            formData.append('roomId', roomId);
            formData.append('studentId', userId);
            formData.append('timestamp', Date.now().toString());

            const response = await fetch('http://localhost:5000/api/ai/process-frame', {
                method: 'POST',
                body: formData,
                headers: {
                    'Room-ID': roomId,
                    'Cache-Control': 'no-cache'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Analysis failed');
            }

            const result: AnalysisResult = await response.json();
            
            if (typeof result.faceDetected !== 'boolean') {
                throw new Error('Invalid AI response format');
            }

            setLastResult(result);
            setFrameCount(prev => prev + 1);
            updateStatusFromResult(result);

        } catch (error) {
            console.error('Frame analysis error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
            
            if (!errorMessage.includes('temporary')) {
                setError(`Analysis error: ${errorMessage}`);
            }
            
            // Retry with increasing delay
            const delay = Math.min(1000 * (frameCount + 1), 5000);
            setTimeout(() => captureAndAnalyzeFrame(), delay);
        }
    };

    const updateStatusFromResult = (result: AnalysisResult) => {
        if (result.faceDetected) {
            setStatus(result.isAttentive 
                ? `Attentive (${Math.round(result.confidence * 100)}%)`
                : `Distracted (${Math.round(result.confidence * 100)}%)`
            );
        } else {
            setStatus('No face detected');
        }
    };

    return (
        <div className="relative w-[640px] h-[480px] bg-black overflow-hidden mx-auto mt-8 rounded-lg shadow-xl">
            {/* Status overlay */}
            <div className={`absolute top-2 left-2 z-20 px-2 py-1 rounded text-sm font-mono
                ${lastResult?.isAttentive ? 'bg-green-500/90 text-white' : 
                  lastResult?.faceDetected ? 'bg-yellow-500/90 text-black' : 
                  'bg-red-500/90 text-white'}`}>
                {status}
                {error && <div className="text-xs mt-1">{error}</div>}
                <div className="text-xs">Frames analyzed: {frameCount}</div>
            </div>
            
            {/* Video element */}
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