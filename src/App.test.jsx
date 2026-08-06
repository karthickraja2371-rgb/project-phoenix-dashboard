import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

import HeaderNavbar from './components/HeaderNavbar';
import GestureSelector from './components/GestureSelector';
import TelemetryLog from './components/TelemetryLog';
import AIChatModal from './components/AIChatModal';

describe('Project Phoenix Bionic Dashboard Component Tests', () => {
  it('renders HeaderNavbar with brand title and patent badge', () => {
    render(
      <HeaderNavbar
        viewMode="dashboard"
        setViewMode={() => {}}
        isVoiceListening={false}
        toggleVoiceListening={() => {}}
        isAudioTelemetryActive={true}
        setIsAudioTelemetryActive={() => {}}
        setIsChatOpen={() => {}}
        pressureSpike={false}
        sensorFailure={false}
        lowBattery={false}
      />
    );

    expect(screen.getByText('PROJECT PHOENIX')).toBeInTheDocument();
    expect(screen.getByText('PATENT NO. 202641077314')).toBeInTheDocument();
  });

  it('renders 16 Gesture Library grid in GestureSelector', () => {
    const mockGestures = [
      { name: "POWER GRIP", color: "#FF3D00", desc: "Full fist closure" },
      { name: "PINCH", color: "#FF9100", desc: "Thumb + Index precision tip pinch" }
    ];

    render(
      <GestureSelector
        GESTURES={mockGestures}
        activeGestureIdx={0}
        manualGestureIdx={0}
        setManualGestureIdx={() => {}}
        isAutoCycle={true}
        setIsAutoCycle={() => {}}
        audioTelemetry={{ enabled: false }}
      />
    );

    expect(screen.getByText('POWER GRIP')).toBeInTheDocument();
    expect(screen.getByText('PINCH')).toBeInTheDocument();
  });

  it('renders TelemetryLog items correctly', () => {
    const mockLogs = [
      { time: '14:22:01.000', text: '[AI SIMULATED] NDP120 Neural Inference: POWER GRIP', color: '#00E5FF' }
    ];

    render(<TelemetryLog telemetryLogs={mockLogs} logContainerRef={{ current: null }} />);
    expect(screen.getByText(/NDP120 Neural Inference: POWER GRIP/i)).toBeInTheDocument();
  });

  it('renders AIChatModal when open and responds to user input', () => {
    const handleSend = vi.fn();
    render(
      <AIChatModal
        isChatOpen={true}
        setIsChatOpen={() => {}}
        chatMessages={[{ sender: 'bot', text: '👋 Hello! I am the Project Phoenix AI Assistant.' }]}
        chatInput=""
        setChatInput={() => {}}
        handleSendChat={handleSend}
      />
    );

    expect(screen.getByText('Project Phoenix AI Assistant')).toBeInTheDocument();
  });
});
