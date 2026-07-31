/**
 * @file sensor_fusion.cpp
 * @brief Dashboard Sensor Fusion (C++20)
 */

#include "sensor_fusion.hpp"

namespace Phoenix::Dashboard {

void process_sensor_fusion(DSP::SensorFusionEngine& sf) {
    sf.updateVision(0.85f);
}

} // namespace Phoenix::Dashboard
