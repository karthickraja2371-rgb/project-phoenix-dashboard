/**
 * @file emg_dsp.c
 * @brief PGA460 4-Channel sEMG Signal Processing & Bandpass Filtering (2000Hz)
 */

#include <stdint.h>

#define EMG_CHANNELS 4
#define SAMPLING_FREQ_HZ 2000

static float emg_raw_buffer[EMG_CHANNELS][256];
static float emg_filtered_buffer[EMG_CHANNELS][256];

void process_emg_dsp_pipeline(void) {
    // 4th order Butterworth Bandpass Filter (10Hz - 500Hz)
    // 50Hz / 60Hz Notch Rejection Filter
    for (int ch = 0; ch < EMG_CHANNELS; ch++) {
        // DSP filtering code
    }
}
