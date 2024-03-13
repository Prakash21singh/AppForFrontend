import React, { useRef, useEffect } from 'react';
import * as faceDetection from '@mediapipe/face_detection';
import '@mediapipe/drawing_utils';

const FaceDetectionComponent = () => {
    const videoRef = useRef();
    const canvasRef = useRef();

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        let faceDetector;

        if (video && canvas) {
            const camera = new faceDetection.Camera(video, {
                onFrame: async () => {
                    if (!faceDetector) {
                        faceDetector = new faceDetection.FaceDetection({
                            locateFile: (file) => {
                                return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
                            }
                        });
                        await faceDetector.setOptions({
                            minDetectionConfidence: 0.5,
                            minTrackingConfidence: 0.5
                        });
                        faceDetector.onResults((results) => {
                            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                            results.forEach((face) => {
                                const { topLeft, bottomRight } = face.boundingBox;
                                const width = bottomRight[0] - topLeft[0];
                                const height = bottomRight[1] - topLeft[1];
                                canvas.getContext('2d').drawRect(topLeft[0], topLeft[1], width, height);
                            });
                        });
                    }
                    await faceDetector.send({ image: video });
                },
                width: 640,
                height: 480
            });
            camera.start();
        }

        return () => {
            if (faceDetector) {
                faceDetector.close();
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

export default FaceDetectionComponent;
