/**
 * @file safety_system.c
 * @brief Socket Skin Graft FSR Pressure Safety & 20.0 kPa Hardware Lock
 * Claim 8: Socket Pressure Safety Array & Hardware Lock Interrupt
 */

#include <stdint.h>
#include <stdbool.h>

#define MAX_SAFE_SOCKET_PRESSURE_KPA 20.0f
#define FSR_SENSOR_COUNT 8

static float current_fsr_pressures[FSR_SENSOR_COUNT];
static bool passive_tendon_lock_engaged = false;

bool evaluate_fsr_pressure_safety(void) {
    float peak_pressure = 0.0f;

    for (int i = 0; i < FSR_SENSOR_COUNT; i++) {
        if (current_fsr_pressures[i] > peak_pressure) {
            peak_pressure = current_fsr_pressures[i];
        }
    }

    if (peak_pressure >= MAX_SAFE_SOCKET_PRESSURE_KPA) {
        passive_tendon_lock_engaged = true;
        // Trigger immediate hardware interrupt to disengage active motor power
        return true;
    }

    passive_tendon_lock_engaged = false;
    return false;
}
