/**
 * @file rest_protocol.cpp
 * @brief Dashboard Mandatory Rest Protocol Cycle (C++20)
 */

#include "rest_protocol.hpp"

namespace Phoenix::Dashboard {

void evaluate_mandatory_rest_cycle(Safety::RestProtocol& rp, uint32_t delta_sec, bool is_emg_active) {
    rp.tick(delta_sec, is_emg_active);
}

} // namespace Phoenix::Dashboard
