import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

Rectangle {
    id: modalRoot
    anchors.fill: parent
    color: "#D009131F" // Deep backdrop
    z: 999 // Always on top

    property int currentSlide: 0
    readonly property int totalSlides: 4

    // Modal Card
    Rectangle {
        id: card
        anchors.centerIn: parent
        width: Math.min(modalRoot.width - 32, 540)
        implicitHeight: contentCol.implicitHeight + 48
        radius: 14
        color: "#FFFFFF"
        border.color: "#CBD5E1"
        clip: true

        ColumnLayout {
            id: contentCol
            anchors.fill: parent
            anchors.margins: 28
            spacing: 20

            // Header Bar: Step Badge & Skip
            RowLayout {
                Layout.fillWidth: true
                Rectangle {
                    width: stepText.contentWidth + 16
                    height: 24
                    radius: 12
                    color: "#EFF6FF"
                    border.color: "#BFDBFE"
                    Text {
                        id: stepText
                        anchors.centerIn: parent
                        text: "STEP " + (modalRoot.currentSlide + 1) + " OF " + modalRoot.totalSlides
                        font.pixelSize: 10
                        font.bold: true
                        color: "#1E40AF"
                    }
                }

                Item { Layout.fillWidth: true }

                Text {
                    text: "Skip Guide ✕"
                    font.pixelSize: 12
                    font.bold: true
                    color: "#64748B"
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: appCtrl.completeOnboarding()
                    }
                }
            }

            // Slide Content Carousel (Indexed by currentSlide)
            Item {
                Layout.fillWidth: true
                Layout.preferredHeight: 240

                // ================= SLIDE 0: WELCOME =================
                ColumnLayout {
                    anchors.fill: parent
                    spacing: 12
                    visible: modalRoot.currentSlide === 0

                    Rectangle {
                        Layout.alignment: Qt.AlignHCenter
                        width: 64
                        height: 64
                        radius: 14
                        color: "#EFF6FF"
                        border.color: "#93C5FD"
                        Text {
                            anchors.centerIn: parent
                            text: "🏫"
                            font.pixelSize: 32
                        }
                    }

                    Text {
                        Layout.alignment: Qt.AlignHCenter
                        text: "Welcome to CampusCare"
                        font.bold: true
                        font.pixelSize: 20
                        color: "#0F172A"
                    }

                    Text {
                        Layout.alignment: Qt.AlignHCenter
                        text: "IT Asset, Lab Mapping & AMC Service Platform"
                        font.pixelSize: 13
                        font.bold: true
                        color: "#2563EB"
                    }

                    Text {
                        Layout.fillWidth: true
                        horizontalAlignment: Text.AlignHCenter
                        text: "Designed specifically for educational institutions, computer lab assistants, and AMC hardware engineers. CampusCare bridges physical lab infrastructure with live diagnostic tracking."
                        font.pixelSize: 13
                        color: "#475569"
                        wrapMode: Text.WordWrap
                    }
                }

                // ================= SLIDE 1: 2D LAB MAP =================
                ColumnLayout {
                    anchors.fill: parent
                    spacing: 10
                    visible: modalRoot.currentSlide === 1

                    Rectangle {
                        Layout.alignment: Qt.AlignHCenter
                        width: 56
                        height: 56
                        radius: 12
                        color: "#F0FDF4"
                        border.color: "#86EFAC"
                        Text {
                            anchors.centerIn: parent
                            text: "🖥️"
                            font.pixelSize: 28
                        }
                    }

                    Text {
                        Layout.alignment: Qt.AlignHCenter
                        text: "Visual 2D Physical Lab Map"
                        font.bold: true
                        font.pixelSize: 19
                        color: "#0F172A"
                    }

                    Text {
                        Layout.fillWidth: true
                        horizontalAlignment: Text.AlignHCenter
                        text: "Monitor physical computer desks in real-time using color-coded hardware badges:"
                        font.pixelSize: 12
                        color: "#64748B"
                        wrapMode: Text.WordWrap
                    }

                    // Legend Grid
                    GridLayout {
                        Layout.fillWidth: true
                        columns: 2
                        rowSpacing: 6
                        columnSpacing: 12

                        RowLayout {
                            spacing: 8
                            Rectangle { width: 12; height: 12; radius: 6; color: "#16A34A" }
                            Text { text: "Operational (Student Ready)"; font.pixelSize: 11; color: "#1E293B" }
                        }
                        RowLayout {
                            spacing: 8
                            Rectangle { width: 12; height: 12; radius: 6; color: "#DC2626" }
                            Text { text: "Issue Reported (Critical BSOD)"; font.pixelSize: 11; color: "#1E293B" }
                        }
                        RowLayout {
                            spacing: 8
                            Rectangle { width: 12; height: 12; radius: 6; color: "#D97706" }
                            Text { text: "Maintenance Due"; font.pixelSize: 11; color: "#1E293B" }
                        }
                        RowLayout {
                            spacing: 8
                            Rectangle { width: 12; height: 12; radius: 6; color: "#2563EB" }
                            Text { text: "Under Active Service"; font.pixelSize: 11; color: "#1E293B" }
                        }
                    }
                }

                // ================= SLIDE 2: ROLE-BASED ACCESS =================
                ColumnLayout {
                    anchors.fill: parent
                    spacing: 10
                    visible: modalRoot.currentSlide === 2

                    Rectangle {
                        Layout.alignment: Qt.AlignHCenter
                        width: 56
                        height: 56
                        radius: 12
                        color: "#FEF3C7"
                        border.color: "#FDE68A"
                        Text {
                            anchors.centerIn: parent
                            text: "🔒"
                            font.pixelSize: 28
                        }
                    }

                    Text {
                        Layout.alignment: Qt.AlignHCenter
                        text: "Strict Role-Based Access Control"
                        font.bold: true
                        font.pixelSize: 19
                        color: "#0F172A"
                    }

                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 6

                        Rectangle {
                            Layout.fillWidth: true
                            height: 38
                            radius: 6
                            color: "#F8FAFC"
                            border.color: "#E2E8F0"
                            RowLayout {
                                anchors.fill: parent
                                anchors.margins: 8
                                Text { text: "🏫 School Staff:"; font.bold: true; font.pixelSize: 11; color: "#1E40AF" }
                                Text { text: "Inspect own labs, report faulty PCs, track SLA"; font.pixelSize: 11; color: "#475569" }
                            }
                        }
                        Rectangle {
                            Layout.fillWidth: true
                            height: 38
                            radius: 6
                            color: "#F8FAFC"
                            border.color: "#E2E8F0"
                            RowLayout {
                                anchors.fill: parent
                                anchors.margins: 8
                                Text { text: "🛠️ Technicians:"; font.bold: true; font.pixelSize: 11; color: "#92400E" }
                                Text { text: "Follow hardware diagnosis checklists & minidump tests"; font.pixelSize: 11; color: "#475569" }
                            }
                        }
                        Rectangle {
                            Layout.fillWidth: true
                            height: 38
                            radius: 6
                            color: "#F8FAFC"
                            border.color: "#E2E8F0"
                            RowLayout {
                                anchors.fill: parent
                                anchors.margins: 8
                                Text { text: "👑 Org Admin:"; font.bold: true; font.pixelSize: 11; color: "#5B21B6" }
                                Text { text: "Multi-school contracts & 2D drag-and-drop map designer"; font.pixelSize: 11; color: "#475569" }
                            }
                        }
                    }
                }

                // ================= SLIDE 3: READY TO START =================
                ColumnLayout {
                    anchors.fill: parent
                    spacing: 12
                    visible: modalRoot.currentSlide === 3

                    Rectangle {
                        Layout.alignment: Qt.AlignHCenter
                        width: 64
                        height: 64
                        radius: 14
                        color: "#F0FDF4"
                        border.color: "#86EFAC"
                        Text {
                            anchors.centerIn: parent
                            text: "🚀"
                            font.pixelSize: 32
                        }
                    }

                    Text {
                        Layout.alignment: Qt.AlignHCenter
                        text: "You Are All Set!"
                        font.bold: true
                        font.pixelSize: 20
                        color: "#0F172A"
                    }

                    Text {
                        Layout.fillWidth: true
                        horizontalAlignment: Text.AlignHCenter
                        text: "CampusCare is optimized for your mobile phone, tablet, and desktop computer."
                        font.pixelSize: 13
                        font.bold: true
                        color: "#16A34A"
                        wrapMode: Text.WordWrap
                    }

                    Text {
                        Layout.fillWidth: true
                        horizontalAlignment: Text.AlignHCenter
                        text: "You can re-open this guide at any time by clicking the '❓ Guide' icon in the top header. Click 'Get Started' to enter your console."
                        font.pixelSize: 12
                        color: "#64748B"
                        wrapMode: Text.WordWrap
                    }
                }
            }

            Rectangle { Layout.fillWidth: true; height: 1; color: "#E2E8F0" }

            // Bottom Navigation Controls
            RowLayout {
                Layout.fillWidth: true
                spacing: 12

                // Indicator Dots
                RowLayout {
                    spacing: 6
                    Repeater {
                        model: modalRoot.totalSlides
                        Rectangle {
                            width: modalRoot.currentSlide === index ? 20 : 8
                            height: 8
                            radius: 4
                            color: modalRoot.currentSlide === index ? "#2563EB" : "#CBD5E1"
                            Behavior on width { NumberAnimation { duration: 200 } }
                        }
                    }
                }

                Item { Layout.fillWidth: true }

                // Back Button
                Button {
                    visible: modalRoot.currentSlide > 0
                    text: "← Back"
                    onClicked: modalRoot.currentSlide--
                    contentItem: Text {
                        text: parent.text
                        color: "#0F2942"
                        font.bold: true
                        font.pixelSize: 12
                    }
                    background: Rectangle {
                        color: "#F1F5F9"
                        radius: 6
                    }
                }

                // Next or Get Started Button
                Button {
                    text: modalRoot.currentSlide === modalRoot.totalSlides - 1 ? "Get Started 🚀" : "Next ➔"
                    onClicked: {
                        if (modalRoot.currentSlide < modalRoot.totalSlides - 1) {
                            modalRoot.currentSlide++;
                        } else {
                            appCtrl.completeOnboarding();
                        }
                    }
                    contentItem: Text {
                        text: parent.text
                        color: "#FFFFFF"
                        font.bold: true
                        font.pixelSize: 13
                        horizontalAlignment: Text.AlignHCenter
                        verticalAlignment: Text.AlignVCenter
                    }
                    background: Rectangle {
                        color: modalRoot.currentSlide === modalRoot.totalSlides - 1 ? "#16A34A" : "#0F2942"
                        radius: 6
                    }
                }
            }
        }
    }
}
