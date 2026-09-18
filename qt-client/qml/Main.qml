import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import "screens"
import "components"

ApplicationWindow {
    id: root
    visible: true
    width: 1100
    height: 820
    minimumWidth: 360
    minimumHeight: 600
    title: "CampusCare - Cross-Platform IT Asset & Lab Management"
    color: "#F8FAFC"

    // Responsive Device Breakpoints
    readonly property bool isMobile: root.width < 680
    readonly property bool isTablet: root.width >= 680 && root.width < 1000
    readonly property bool isDesktop: root.width >= 1000

    // Institutional Theme Palette
    readonly property color colNavy: "#0F2942"
    readonly property color colNavyLight: "#1E4E79"
    readonly property color colAccent: "#2563EB"
    readonly property color colBg: "#F8FAFC"
    readonly property color colCard: "#FFFFFF"
    readonly property color colBorder: "#E2E8F0"
    readonly property color colText: "#0F172A"
    readonly property color colMuted: "#64748B"
    readonly property color colGreen: "#16A34A"
    readonly property color colRed: "#DC2626"
    readonly property color colAmber: "#D97706"

    // ================= OTA OVER-THE-AIR UPDATE SYSTEM =================
    property string otaNewVersion: ""
    property string otaDownloadUrl: ""
    property string otaChangelog: ""
    property bool otaBannerVisible: false

    Connections {
        target: netMgr
        function onOtaUpdateAvailable(newVersion, downloadUrl, releaseNotes) {
            root.otaNewVersion = newVersion;
            root.otaDownloadUrl = downloadUrl;
            root.otaChangelog = releaseNotes;
            root.otaBannerVisible = true;
        }
    }

    Rectangle {
        id: otaBanner
        z: 999
        anchors.top: parent.top
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.topMargin: root.otaBannerVisible ? 12 : -120
        width: Math.min(parent.width - 24, 560)
        height: 60
        radius: 10
        color: "#0F172A"
        border.color: "#38BDF8"
        border.width: 1.5
        visible: opacity > 0
        opacity: root.otaBannerVisible ? 1.0 : 0.0

        Behavior on anchors.topMargin { NumberAnimation { duration: 300; easing.type: Easing.OutCubic } }
        Behavior on opacity { NumberAnimation { duration: 250 } }

        RowLayout {
            anchors.fill: parent
            anchors.leftMargin: 14
            anchors.rightMargin: 12
            spacing: 12

            Text {
                text: "🚀"
                font.pixelSize: 20
            }

            ColumnLayout {
                Layout.fillWidth: true
                spacing: 2
                Text {
                    text: "CampusCare Update Available (" + root.otaNewVersion + ")"
                    font.bold: true
                    font.pixelSize: 13
                    color: "#FFFFFF"
                }
                Text {
                    text: root.otaChangelog || "New performance updates and database fixes."
                    font.pixelSize: 11
                    color: "#94A3B8"
                    elide: Text.ElideRight
                    Layout.fillWidth: true
                }
            }

            Button {
                text: "Update"
                onClicked: {
                    netMgr.openDownloadUrl(root.otaDownloadUrl);
                    root.otaBannerVisible = false;
                }
                contentItem: Text {
                    text: parent.text
                    color: "#FFFFFF"
                    font.bold: true
                    font.pixelSize: 11
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter
                }
                background: Rectangle {
                    color: "#0284C7"
                    radius: 6
                }
            }

            Button {
                text: "✕"
                onClicked: root.otaBannerVisible = false
                contentItem: Text {
                    text: "✕"
                    color: "#94A3B8"
                    font.bold: true
                    font.pixelSize: 12
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter
                }
                background: Rectangle { color: "transparent" }
            }
        }
    }

    // ================= 1. LOGIN BARRIER (WHEN NOT AUTHENTICATED) =================
    Loader {
        anchors.fill: parent
        active: !appCtrl.isAuthenticated
        visible: !appCtrl.isAuthenticated
        source: "screens/LoginScreen.qml"
        z: 100
    }

    // ================= 2. FIRST TIME USER ONBOARDING OVERLAY =================
    OnboardingModal {
        anchors.fill: parent
        visible: !appCtrl.hasSeenOnboarding && appCtrl.isAuthenticated
        z: 200
    }

    // ================= 3. MAIN APPLICATION SHELL =================
    ColumnLayout {
        anchors.fill: parent
        spacing: 0
        visible: appCtrl.isAuthenticated

        // ================= TOP HEADER BAR =================
        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: root.isMobile ? 54 : 64
            color: root.colNavy

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: root.isMobile ? 10 : 16
                anchors.rightMargin: root.isMobile ? 10 : 16
                spacing: root.isMobile ? 8 : 14

                // Brand Logo & User Context
                RowLayout {
                    spacing: 8
                    Rectangle {
                        width: root.isMobile ? 32 : 38
                        height: root.isMobile ? 32 : 38
                        radius: 8
                        color: "#1E4E79"
                        border.color: "#3B82F6"
                        border.width: 1
                        Text {
                            anchors.centerIn: parent
                            text: "CC"
                            font.bold: true
                            font.pixelSize: root.isMobile ? 13 : 16
                            color: "#FFFFFF"
                        }
                    }

                    ColumnLayout {
                        spacing: 1
                        Text {
                            text: "CampusCare"
                            font.bold: true
                            font.pixelSize: root.isMobile ? 14 : 16
                            color: "#FFFFFF"
                        }
                        Text {
                            visible: !root.isMobile
                            text: appCtrl.currentUserSchoolName
                            font.pixelSize: 11
                            color: "#94A3B8"
                            elide: Text.ElideRight
                            Layout.maximumWidth: 260
                        }
                    }
                }

                Item { Layout.fillWidth: true }

                // Desktop / Tablet Navigation Bar
                RowLayout {
                    spacing: 6
                    visible: !root.isMobile

                    Repeater {
                        model: {
                            if (appCtrl.currentRole === "school_admin") {
                                return [
                                    { id: "school_dashboard", label: "Dashboard" },
                                    { id: "lab_map", label: "My Lab Map" },
                                    { id: "create_ticket", label: "+ Raise Ticket" },
                                    { id: "ticket_details", label: "My Tickets" }
                                ];
                            } else if (appCtrl.currentRole === "technician") {
                                return [
                                    { id: "technician_job", label: "Assigned Job" },
                                    { id: "lab_map", label: "Target Lab Map" },
                                    { id: "ticket_details", label: "Specs & Info" },
                                    { id: "ticket_timeline", label: "Timeline Stream" }
                                ];
                            } else { // org_admin
                                return [
                                    { id: "dashboard", label: "Overview" },
                                    { id: "schools", label: "Schools Directory" },
                                    { id: "lab_map", label: "2D Lab Map" },
                                    { id: "lab_editor", label: "Lab Map Editor" },
                                    { id: "ticket_details", label: "Ticket Center" }
                                ];
                            }
                        }

                        delegate: Rectangle {
                            required property var modelData
                            height: 34
                            width: navText.contentWidth + 20
                            radius: 6
                            color: appCtrl.currentScreen === modelData.id ? "#1E4E79" : "transparent"
                            border.color: appCtrl.currentScreen === modelData.id ? "#3B82F6" : "transparent"
                            border.width: 1

                            Text {
                                id: navText
                                anchors.centerIn: parent
                                text: modelData.label
                                font.pixelSize: 12
                                font.weight: appCtrl.currentScreen === modelData.id ? Font.DemiBold : Font.Normal
                                color: appCtrl.currentScreen === modelData.id ? "#FFFFFF" : "#CBD5E1"
                            }

                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: appCtrl.currentScreen = modelData.id
                            }
                        }
                    }
                }

                // Help / Guide Button (Replays Onboarding Anytime)
                Button {
                    text: root.isMobile ? "❓" : "❓ Guide"
                    onClicked: appCtrl.resetOnboarding()
                    contentItem: Text {
                        text: parent.text
                        color: "#E2E8F0"
                        font.pixelSize: 11
                        font.bold: true
                        horizontalAlignment: Text.AlignHCenter
                        verticalAlignment: Text.AlignVCenter
                    }
                    background: Rectangle {
                        color: "#1E3A5F"
                        border.color: "#3B82F6"
                        radius: 4
                    }
                }

                // Role Badge
                Rectangle {
                    height: 28
                    width: userBadgeLayout.contentWidth + 12
                    radius: 14
                    color: "#0A1B2C"
                    border.color: "#334155"
                    border.width: 1

                    RowLayout {
                        id: userBadgeLayout
                        anchors.centerIn: parent
                        spacing: 5
                        Rectangle {
                            width: 6
                            height: 6
                            radius: 3
                            color: appCtrl.currentRole === "org_admin" ? "#A855F7" :
                                   (appCtrl.currentRole === "technician" ? "#F59E0B" : "#10B981")
                        }
                        Text {
                            text: appCtrl.currentRole === "org_admin" ? "Admin" :
                                  (appCtrl.currentRole === "technician" ? "Tech" : "Staff")
                            font.pixelSize: 11
                            font.bold: true
                            color: "#F1F5F9"
                        }
                    }
                }

                // Logout Button
                Button {
                    text: root.isMobile ? "🚪" : "🚪 Sign Out"
                    onClicked: appCtrl.logout()
                    contentItem: Text {
                        text: parent.text
                        color: "#FCA5A5"
                        font.pixelSize: 11
                        font.bold: true
                        horizontalAlignment: Text.AlignHCenter
                        verticalAlignment: Text.AlignVCenter
                    }
                    background: Rectangle {
                        color: "#3F1D1D"
                        border.color: "#7F1D1D"
                        radius: 4
                    }
                }
            }
        }

        // ================= MAIN SCREEN CONTAINER =================
        Item {
            Layout.fillWidth: true
            Layout.fillHeight: true

            Loader {
                id: screenLoader
                anchors.fill: parent
                source: {
                    switch (appCtrl.currentScreen) {
                        case "school_dashboard": return "screens/SchoolDashboardScreen.qml";
                        case "dashboard": return "screens/DashboardScreen.qml";
                        case "schools": return "screens/SchoolsScreen.qml";
                        case "lab_map": return "screens/LabMapScreen.qml";
                        case "system_details": return "screens/SystemDetailsScreen.qml";
                        case "create_ticket": return "screens/CreateTicketScreen.qml";
                        case "ticket_details": return "screens/TicketDetailsScreen.qml";
                        case "ticket_timeline": return "screens/TicketTimelineScreen.qml";
                        case "technician_job": return "screens/TechnicianJobScreen.qml";
                        case "lab_editor": return "screens/LabEditorScreen.qml";
                        default:
                            return (appCtrl.currentRole === "school_admin") ? "screens/SchoolDashboardScreen.qml" :
                                   ((appCtrl.currentRole === "technician") ? "screens/TechnicianJobScreen.qml" : "screens/DashboardScreen.qml");
                    }
                }
            }
        }

        // ================= BOTTOM NAVIGATION BAR (MOBILE ONLY) =================
        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 56
            color: "#FFFFFF"
            border.color: root.colBorder
            border.width: 1
            visible: root.isMobile

            RowLayout {
                anchors.fill: parent
                spacing: 0

                Repeater {
                    model: {
                        if (appCtrl.currentRole === "school_admin") {
                            return [
                                { id: "school_dashboard", label: "Dashboard", icon: "🏫" },
                                { id: "lab_map", label: "Lab Map", icon: "🖥️" },
                                { id: "create_ticket", label: "Report", icon: "🚨" },
                                { id: "ticket_details", label: "Tickets", icon: "🎫" }
                            ];
                        } else if (appCtrl.currentRole === "technician") {
                            return [
                                { id: "technician_job", label: "Job", icon: "🛠️" },
                                { id: "lab_map", label: "Map", icon: "🖥️" },
                                { id: "ticket_details", label: "Specs", icon: "📋" },
                                { id: "ticket_timeline", label: "Timeline", icon: "💬" }
                            ];
                        } else {
                            return [
                                { id: "dashboard", label: "Overview", icon: "📊" },
                                { id: "schools", label: "Schools", icon: "🏫" },
                                { id: "lab_map", label: "Map", icon: "🖥️" },
                                { id: "lab_editor", label: "Editor", icon: "📐" },
                                { id: "ticket_details", label: "Tickets", icon: "🎫" }
                            ];
                        }
                    }

                    delegate: Item {
                        required property var modelData
                        Layout.fillWidth: true
                        Layout.fillHeight: true

                        ColumnLayout {
                            anchors.centerIn: parent
                            spacing: 2
                            Text {
                                Layout.alignment: Qt.AlignHCenter
                                text: modelData.icon
                                font.pixelSize: 16
                            }
                            Text {
                                Layout.alignment: Qt.AlignHCenter
                                text: modelData.label
                                font.pixelSize: 10
                                font.bold: appCtrl.currentScreen === modelData.id
                                color: appCtrl.currentScreen === modelData.id ? root.colAccent : root.colMuted
                            }
                        }

                        MouseArea {
                            anchors.fill: parent
                            onClicked: appCtrl.currentScreen = modelData.id
                        }
                    }
                }
            }
        }
    }
}
