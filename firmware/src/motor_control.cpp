/**
 * @file motor_control.cpp
 * @brief Dashboard Motor Control (C++20)
 */

#include "motor_control.hpp"

namespace Phoenix::Dashboard {

void update_motor_control_loop(Control::MotorControlSystem& mc, float dt_sec) {
    mc.updateJoints(0.0f, 0.0f, dt_sec);
}

} // namespace Phoenix::Dashboard
