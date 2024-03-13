import React, { useRef, useEffect } from 'react';
import * as posedetection from '@mediapipe/pose';
import '@mediapipe/drawing_utils';

const PoseDetectionComponent = () => {
    const videoRef = useRef();
    const canvasRef = useRef();

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        let poseDetection;

        if (video && canvas) {
            const camera = new posedetection.Camera(video, {
                onFrame: async () => {
                    if (!poseDetection) {
                        poseDetection = new posedetection.Pose({
                            locateFile: (file) => {
                                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
                            }
                        });
                        await poseDetection.setOptions({
                            modelComplexity: 1,
                            smoothLandmarks: true,
                            enableSegmentation: false,
                            smoothSegmentation: true,
                            minDetectionConfidence: 0.5,
                            minTrackingConfidence: 0.5
                        });
                        poseDetection.onResults((results) => {
                            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                            posedetection.draw.drawConnectors(
                                canvas.getContext('2d'),
                                results.poseLandmarks,
                                posedetection.POSE_CONNECTIONS,
                                { color: '#00FF00', lineWidth: 5 }
                            );
                            posedetection.draw.drawLandmarks(
                                canvas.getContext('2d'),
                                results.poseLandmarks,
                                { color: '#FF0000', lineWidth: 2 }
                            );
                        });
                    }
                    await poseDetection.send({ image: video });
                },
                width: 640,
                height: 480
            });
            camera.start();
        }

        return () => {
            if (poseDetection) {
                poseDetection.close();
            }
        };
    }, []);

    return (
        <div>
            <video
                ref={videoRef}
                style={{ transform: 'scale(-1, 1)', width: '640px', height: '480px' }}
                autoPlay
                playsInline
            ></video>
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }}></canvas>
        </div>
    );
};

export default PoseDetectionComponent;
