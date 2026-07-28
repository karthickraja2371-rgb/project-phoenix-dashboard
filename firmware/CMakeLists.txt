cmake_minimum_required(VERSION 3.20)
project(project_phoenix_firmware C)

set(CMAKE_C_STANDARD 11)

include_directories(include)

file(GLOB SOURCES "src/*.c")

add_executable(phoenix_firmware ${SOURCES})

target_compile_definitions(phoenix_firmware PRIVATE
    STM32H753xx
    USE_HAL_DRIVER
    NDP120_OFFLINE_AI
)
