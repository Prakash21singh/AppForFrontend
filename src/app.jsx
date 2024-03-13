import React, { useState } from 'react';
import HeadDetectionComponent from './component/HeadDetectionComponent.js';
import FaceDetectionComponent from './component/FaceDetectionComponent.js';
import PoseDetectionComponent from './component/PoseDetectionComponent.js';

const App = () => {
    const [isDetectionRunning, setDetectionRunning] = useState(false);

    const handleStartDetection = () => {
        // Start all detection processes
        setDetectionRunning(true);
    };

    return (
        <div>
            <h1>Online Proctoring</h1>
            {!isDetectionRunning ? (
                <button onClick={handleStartDetection}>Start Detection</button>
            ) : (
                <div>
                    <HeadDetectionComponent />
                    <FaceDetectionComponent />
                    <PoseDetectionComponent />
                </div>
            )}
        </div>
    );
};

export default App;
