/**
 * @file emg_dsp.cpp
 * @brief Dashboard sEMG Signal Processing (C++20)
 */

#include "emg_dsp.hpp"
#include "hardware_config.hpp"

namespace Phoenix::Dashboard {

void process_emg_dsp_pipeline(DSP::EmgDspSystem& dsp) {
    std::array<float, Hardware::NUM_EMG_CHANNELS> raw = {0.1f, 0.2f, 0.15f, 0.18f};
    dsp.processSamples(raw);
}

} // namespace Phoenix::Dashboard
