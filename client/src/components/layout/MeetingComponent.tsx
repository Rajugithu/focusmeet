import React, { useEffect, useRef, useState } from 'react';
import { object } from 'zod';
import { io, Socket } from 'socket.io-client';

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
    const lastApiCallRef = useRef<number>(0);
    const [lastResult, setLastResult] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isDistractedNotificationVisible, setIsDistractedNotificationVisible] = useState(false);
    const [distractionNotificationMessage, setDistractionNotificationMessage] = useState<string | null>(null);
    const [isDistractedAlertVisible, setIsDistractedAlertVisible] = useState(false);
    const [distractionAlertMessage, setDistractionAlertMessage] = useState<string | null>(null);

    const userRole = localStorage.getItem('role');
    const userId = localStorage.getItem('userId') || 'unknown';

    const socket = useRef<Socket | null>(null);

    useEffect(() => {
        socket.current = io('http://localhost:5000');

        socket.current.on('connect', () => {
            console.log('Socket.IO connected on client:', socket.current?.id);
            if (hasJoined) {
                socket.current?.emit('joinUserRoom', userId);
                console.log('Emitting joinUserRoom on connect:', userId);
            }
        });

        socket.current.on('disconnect', () => {
            console.log('Socket.IO disconnected on client');
        });

        socket.current.on('connect_error', (error) => {
            console.error('Socket.IO connection error:', error);
        });

        return () => {
            socket.current?.disconnect();
        };
    }, []);

    useEffect(() => {
        if (hasJoined && socket.current?.connected) {
            socket.current?.emit('joinUserRoom', userId);
            console.log('Emitting joinUserRoom on hasJoined:', userId);
        }
    }, [hasJoined, userId]);

    // Socket.IO event listener for immediate distraction detection
    useEffect(() => {
        if (!socket.current) return;

        socket.current.on('distractionDetected', (data: { meetingId: string; timestamp: string }) => {
            debugger;
            if (data.meetingId === meetingId) {
                console.log('Immediate distraction detected:', data);
                setDistractionNotificationMessage('Looks like you might be a bit distracted!');
                setIsDistractedNotificationVisible(true);
                setTimeout(() => {
                    setIsDistractedNotificationVisible(false);
                    setDistractionNotificationMessage(null);
                }, 3000); // Hide after 3 seconds
            }
        });

        return () => {
            socket.current?.off('distractionDetected');
        };
    }, [meetingId, socket.current]);

    // Socket.IO event listener for 10-second distraction alerts
    useEffect(() => {
        if (!socket.current) return;

        socket.current.on('distractionAlert', (data: { meetingId: string; timestamp: string }) => {
            if (data.meetingId === meetingId) {
                console.log('10-second distraction alert received:', data);
                setDistractionAlertMessage('Please focus on the lecture.');
                setIsDistractedAlertVisible(true);
                setTimeout(() => {
                    setIsDistractedAlertVisible(false);
                    setDistractionAlertMessage(null);
                }, 5000);
            }
        });

        return () => {
            socket.current?.off('distractionAlert');
        };
    }, [meetingId, socket.current]);

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

    const displayFrameInConsole = (frameData: string) => {
        console.log(`%cFRAME #${frameCount}`,
            'color: white; background: black; padding: 2px 5px; border-radius: 3px;');

        console.log('%c ', `font-size: 1px; padding: 100px 150px; background: url('data:image/jpeg;base64,${frameData}') no-repeat; background-size: contain;`);
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
            const now = Date.now();
            setIsAnalyzing(true);
            setStatus('Analyzing...');
            setError(null);

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas context not available');

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
            ctx.restore();

            const blob = await new Promise<Blob | null>((resolve) => {
                canvas.toBlob(resolve, 'image/jpeg', 0.8);
            });

            if (!blob) {
                throw new Error('Failed to capture frame');
            }

            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64Data = reader.result?.toString().split(',')[1] || '';
                displayFrameInConsole(base64Data);
            }

            const formData = new FormData();

            formData.append('frame', blob, 'frame.jpg');

            const response = await fetch(`http://localhost:5000/api/ai/process-frame`, {
                method: 'POST',
                headers: {
                    'meeting-id': meetingId,
                    'user-id': userId

                },
                body: formData,
            });

            console.log("current meeting id is : ", meetingId);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log("API response:", data);
            setFrameCount(prev => prev + 1);
            lastApiCallRef.current = now;
            setLastResult(data); // Update last result to reflect attentiveness
            updateStatusFromResult(data); // Update status based on the analysis result

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
            {/* Immediate Distraction Notification */}
            {isDistractedNotificationVisible && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-yellow-500 text-black p-2 rounded-md shadow-md z-30">
                    Looks like you might be a bit distracted!
                </div>
            )}

            {/* 10-Second Distraction Alert */}
            {isDistractedAlertVisible && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white p-4 rounded-md shadow-lg z-30">
                    Please focus on the lecture.
                </div>
            )}
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