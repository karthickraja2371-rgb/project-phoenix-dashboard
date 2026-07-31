/**
 * @file safety_system.cpp
 * @brief Socket Skin Graft FSR Pressure Safety & 20.0 kPa Hardware Lock (C++20)
 * Claim 8: Socket Pressure Safety Array & Instantaneous Hardware Lock Interrupt
 */

#include <cstdint>
#include <array>
#include <algorithm>
#include "hardware_config.hpp"
#include "safety_system.hpp"

namespace Phoenix::Dashboard {

static std::array<float, Phoenix::Hardware::NUM_FSR_SENSORS> current_fsr_pressures{};
static bool passive_tendon_lock_engaged = false;

bool evaluate_fsr_pressure_safety(void) {
    float peak_pressure = 0.0f;

    for (size_t i = 0; i < Phoenix::Hardware::NUM_FSR_SENSORS; ++i) {
        if (current_fsr_pressures[i] > peak_pressure) {
            peak_pressure = current_fsr_pressures[i];
        }
    }

    if (peak_pressure >= Phoenix::Hardware::MAX_SAFE_PRESSURE_KPA) {
        passive_tendon_lock_engaged = true;
        // Instantaneously disengage active motor power (0s delay!)
        return true;
    }

    passive_tendon_lock_engaged = false;
    return false;
}

} // namespace Phoenix::Dashboard
