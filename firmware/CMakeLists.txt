cmake_minimum_required(VERSION 3.20)
project(project_phoenix_firmware_dashboard LANGUAGES CXX C)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Strict warning flags
if(MSVC)
    add_compile_options(/W4 /WX)
else()
    add_compile_options(-Wall -Wextra -Wextra -Werror -Wpedantic)
endif()

include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/../../firmware/inc
)

file(GLOB SOURCES "src/*.cpp")

add_executable(phoenix_firmware ${SOURCES})

target_link_libraries(phoenix_firmware PRIVATE phoenix_firmware_lib)

target_compile_definitions(phoenix_firmware PRIVATE
    STM32H753xx
    USE_HAL_DRIVER
    NDP120_OFFLINE_AI
    HIL_SIMULATION=1
)
