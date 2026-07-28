/**
 * @file rest_protocol.c
 * @brief Mandatory 3-Hour Active / 15-Minute Rest Cycle Manager
 * Claim 11: Mandatory Muscle Rest Cycle for Skin-Grafted Muscle Beds
 */

#include <stdint.h>
#include <stdbool.h>

#define THREE_HOURS_IN_SECONDS (3 * 3600)
#define FIFTEEN_MINUTES_IN_SECONDS (15 * 60)

static uint32_t active_sampling_seconds = 0;
static bool rest_lock_active = false;

void evaluate_mandatory_rest_cycle(void) {
    if (!rest_lock_active) {
        active_sampling_seconds++;
        if (active_sampling_seconds >= THREE_HOURS_IN_SECONDS) {
            rest_lock_active = true;
            active_sampling_seconds = 0;
        }
    } else {
        // Enforce 15-minute resting lock to allow skin graft re-oxygenation
        static uint32_t rest_seconds_elapsed = 0;
        rest_seconds_elapsed++;
        if (rest_seconds_elapsed >= FIFTEEN_MINUTES_IN_SECONDS) {
            rest_lock_active = false;
            rest_seconds_elapsed = 0;
        }
    }
}
