cmake_minimum_required(VERSION 3.16)

project(CampusCare VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

find_package(Qt6 6.5 REQUIRED COMPONENTS
    Core
    Gui
    Qml
    Quick
    QuickControls2
    Network
)

qt_standard_project_setup(REQUIRES 6.5)

qt_add_executable(CampusCare
    src/main.cpp
    src/NetworkManager.h
    src/NetworkManager.cpp
    src/DataModels.h
    src/DataModels.cpp
    src/AppController.h
    src/AppController.cpp
)

qt_add_qml_module(CampusCare
    URI CampusCare
    VERSION 1.0
    QML_FILES
        qml/Main.qml
        qml/components/OnboardingModal.qml
        qml/screens/LoginScreen.qml
        qml/screens/SchoolDashboardScreen.qml
        qml/screens/DashboardScreen.qml
        qml/screens/SchoolsScreen.qml
        qml/screens/LabMapScreen.qml
        qml/screens/SystemDetailsScreen.qml
        qml/screens/CreateTicketScreen.qml
        qml/screens/TicketDetailsScreen.qml
        qml/screens/TicketTimelineScreen.qml
        qml/screens/TechnicianJobScreen.qml
        qml/screens/LabEditorScreen.qml
)

target_include_directories(CampusCare PRIVATE src)

target_link_libraries(CampusCare PRIVATE
    Qt6::Core
    Qt6::Gui
    Qt6::Qml
    Qt6::Quick
    Qt6::QuickControls2
    Qt6::Network
)

include(GNUInstallDirs)
install(TARGETS CampusCare
    BUNDLE DESTINATION .
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
)
