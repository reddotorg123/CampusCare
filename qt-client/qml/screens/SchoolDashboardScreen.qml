import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ScrollView {
    id: schoolDashRoot
    contentWidth: availableWidth
    clip: true

    readonly property bool isMobile: schoolDashRoot.width < 600
    readonly property bool isTablet: schoolDashRoot.width >= 600 && schoolDashRoot.width < 960

    ColumnLayout {
        width: Math.min(schoolDashRoot.width - (schoolDashRoot.isMobile ? 16 : 32), 1060)
        anchors.horizontalCenter: parent.horizontalCenter
        spacing: schoolDashRoot.isMobile ? 12 : 20

        Item { height: schoolDashRoot.isMobile ? 4 : 8 }

        // School Header Banner
        Rectangle {
            Layout.fillWidth: true
            implicitHeight: bannerCol.implicitHeight + (schoolDashRoot.isMobile ? 24 : 36)
            color: "#0F2942"
            radius: 10

            ColumnLayout {
                id: bannerCol
                anchors.fill: parent
                anchors.margins: schoolDashRoot.isMobile ? 12 : 18
                spacing: 12

                RowLayout {
                    Layout.fillWidth: true
                    spacing: 12

                    Rectangle {
                        width: schoolDashRoot.isMobile ? 40 : 54
                        height: schoolDashRoot.isMobile ? 40 : 54
                        radius: 8
                        color: "#1E4E79"
                        Text {
                            anchors.centerIn: parent
                            text: "🏫"
                            font.pixelSize: schoolDashRoot.isMobile ? 20 : 28
                        }
                    }

                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 2
                        Text {
                            text: appCtrl.currentUserSchoolName
                            font.bold: true
                            font.pixelSize: schoolDashRoot.isMobile ? 15 : 19
                            color: "#FFFFFF"
                            wrapMode: Text.WordWrap
                            Layout.fillWidth: true
                        }
                        Text {
                            text: "Institutional Portal • " + appCtrl.currentUserName
                            font.pixelSize: 11
                            color: "#94A3B8"
                            wrapMode: Text.WordWrap
                            Layout.fillWidth: true
                        }
                    }
                }

                Button {
                    Layout.fillWidth: schoolDashRoot.isMobile
                    Layout.alignment: schoolDashRoot.isMobile ? Qt.AlignHCenter : Qt.AlignRight
                    text: "🚨 Report Faulty PC"
                    onClicked: appCtrl.currentScreen = "create_ticket"
                    contentItem: Text {
                        text: parent.text
                        color: "#FFFFFF"
                        font.bold: true
                        font.pixelSize: 13
                        horizontalAlignment: Text.AlignHCenter
                        verticalAlignment: Text.AlignVCenter
                    }
                    background: Rectangle {
                        color: "#DC2626"
                        radius: 6
                    }
                }
            }
        }

        // Institutional KPI Metrics (Responsive 1, 2, or 4 columns)
        GridLayout {
            Layout.fillWidth: true
            columns: schoolDashRoot.width > 900 ? 4 : (schoolDashRoot.width > 520 ? 2 : 1)
            rowSpacing: 10
            columnSpacing: 10

            // Card 1
            Rectangle {
                Layout.fillWidth: true
                height: 88
                color: "#FFFFFF"
                radius: 8
                border.color: "#E2E8F0"
                ColumnLayout {
                    anchors.fill: parent
                    anchors.margins: 12
                    Text { text: "MAIN LAB SYSTEMS"; font.pixelSize: 10; font.bold: true; color: "#64748B" }
                    Text { text: appCtrl.stats.total ? appCtrl.stats.total.toString() : "30"; font.pixelSize: 22; font.bold: true; color: "#0F172A" }
                    Text { text: "Science Wing - Floor 2"; font.pixelSize: 11; color: "#64748B" }
                }
            }

            // Card 2
            Rectangle {
                Layout.fillWidth: true
                height: 88
                color: "#FFFFFF"
                radius: 8
                border.color: "#E2E8F0"
                ColumnLayout {
                    anchors.fill: parent
                    anchors.margins: 12
                    Text { text: "OPERATIONAL NOW"; font.pixelSize: 10; font.bold: true; color: "#64748B" }
                    Text { text: (appCtrl.stats.working ? appCtrl.stats.working.toString() : "24") + " PCs"; font.pixelSize: 22; font.bold: true; color: "#16A34A" }
                    Text { text: "80% Student Readiness"; font.pixelSize: 11; color: "#16A34A" }
                }
            }

            // Card 3
            Rectangle {
                Layout.fillWidth: true
                height: 88
                color: "#FFFFFF"
                radius: 8
                border.color: "#FCA5A5"
                ColumnLayout {
                    anchors.fill: parent
                    anchors.margins: 12
                    Text { text: "REPORTED ISSUES"; font.pixelSize: 10; font.bold: true; color: "#DC2626" }
                    Text { text: (appCtrl.stats.issues ? appCtrl.stats.issues.toString() : "2") + " Issues"; font.pixelSize: 22; font.bold: true; color: "#DC2626" }
                    Text { text: "Technician Dispatched"; font.pixelSize: 11; color: "#DC2626" }
                }
            }

            // Card 4
            Rectangle {
                Layout.fillWidth: true
                height: 88
                color: "#FFFFFF"
                radius: 8
                border.color: "#E2E8F0"
                ColumnLayout {
                    anchors.fill: parent
                    anchors.margins: 12
                    Text { text: "AMC COVERAGE"; font.pixelSize: 10; font.bold: true; color: "#64748B" }
                    Text { text: "Active & Covered"; font.pixelSize: 17; font.bold: true; color: "#2563EB" }
                    Text { text: "Valid thru 31 Mar 2027"; font.pixelSize: 11; color: "#10B981" }
                }
            }
        }

        // Action Banners Row
        Rectangle {
            Layout.fillWidth: true
            implicitHeight: mapActionCol.implicitHeight + 24
            color: "#EFF6FF"
            radius: 8
            border.color: "#BFDBFE"

            ColumnLayout {
                id: mapActionCol
                anchors.fill: parent
                anchors.margins: 14
                spacing: 10

                RowLayout {
                    Layout.fillWidth: true
                    spacing: 12
                    Text { text: "🗺️"; font.pixelSize: 22 }
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 2
                        Text {
                            text: "Main Computer Lab Floorplan"
                            font.bold: true
                            font.pixelSize: 14
                            color: "#1E3A8A"
                        }
                        Text {
                            text: "Inspect 2D layout of 30 desks and see faulty machines in red"
                            font.pixelSize: 11
                            color: "#3B82F6"
                            wrapMode: Text.WordWrap
                            Layout.fillWidth: true
                        }
                    }
                }

                Button {
                    Layout.fillWidth: schoolDashRoot.isMobile
                    Layout.alignment: schoolDashRoot.isMobile ? Qt.AlignHCenter : Qt.AlignRight
                    text: "Open 2D Lab Map ➔"
                    onClicked: appCtrl.currentScreen = "lab_map"
                    contentItem: Text {
                        text: parent.text
                        color: "#FFFFFF"
                        font.bold: true
                        font.pixelSize: 12
                    }
                    background: Rectangle {
                        color: "#1E40AF"
                        radius: 4
                    }
                }
            }
        }

        // Active Tickets Table
        Rectangle {
            Layout.fillWidth: true
            implicitHeight: tktCol.implicitHeight + 28
            color: "#FFFFFF"
            radius: 8
            border.color: "#E2E8F0"

            ColumnLayout {
                id: tktCol
                anchors.fill: parent
                anchors.margins: schoolDashRoot.isMobile ? 12 : 16
                spacing: 10

                RowLayout {
                    Layout.fillWidth: true
                    Text {
                        text: "Tickets Raised by Your Institution"
                        font.bold: true
                        font.pixelSize: 15
                        color: "#0F172A"
                    }
                    Item { Layout.fillWidth: true }
                    Text {
                        text: appCtrl.schoolTickets.length + " Tickets"
                        font.pixelSize: 11
                        color: "#64748B"
                    }
                }

                Rectangle { Layout.fillWidth: true; height: 1; color: "#E2E8F0" }

                Repeater {
                    model: appCtrl.schoolTickets

                    delegate: Rectangle {
                        required property var modelData
                        Layout.fillWidth: true
                        implicitHeight: itemLayout.implicitHeight + 16
                        radius: 6
                        color: "#F8FAFC"
                        border.color: "#E2E8F0"

                        ColumnLayout {
                            id: itemLayout
                            anchors.fill: parent
                            anchors.margins: 10
                            spacing: 8

                            RowLayout {
                                Layout.fillWidth: true
                                spacing: 10

                                Rectangle {
                                    width: 38
                                    height: 38
                                    radius: 6
                                    color: modelData.priority === "Critical" ? "#FEE2E2" : "#FEF3C7"
                                    Text {
                                        anchors.centerIn: parent
                                        text: modelData.systemCode
                                        font.bold: true
                                        font.pixelSize: 11
                                        color: modelData.priority === "Critical" ? "#DC2626" : "#D97706"
                                    }
                                }

                                ColumnLayout {
                                    Layout.fillWidth: true
                                    spacing: 2
                                    RowLayout {
                                        spacing: 6
                                        Text { text: modelData.number; font.bold: true; font.pixelSize: 12; color: "#0F2942" }
                                        Rectangle {
                                            width: statPill.contentWidth + 8
                                            height: 16
                                            radius: 3
                                            color: modelData.status === "In Progress" ? "#DBEAFE" : "#DCFCE7"
                                            Text {
                                                id: statPill
                                                anchors.centerIn: parent
                                                text: modelData.status.toUpperCase()
                                                color: modelData.status === "In Progress" ? "#1E40AF" : "#166534"
                                                font.pixelSize: 8
                                                font.bold: true
                                            }
                                        }
                                    }
                                    Text {
                                        text: modelData.title
                                        font.pixelSize: 11
                                        color: "#334155"
                                        wrapMode: Text.WordWrap
                                        Layout.fillWidth: true
                                    }
                                }

                                Button {
                                    visible: !schoolDashRoot.isMobile
                                    text: "Track ➔"
                                    onClicked: {
                                        appCtrl.selectTicket(modelData.number);
                                        appCtrl.currentScreen = "ticket_details";
                                    }
                                    contentItem: Text {
                                        text: parent.text
                                        color: "#0F2942"
                                        font.bold: true
                                        font.pixelSize: 11
                                    }
                                    background: Rectangle {
                                        color: "#E2E8F0"
                                        radius: 4
                                    }
                                }
                            }

                            Button {
                                visible: schoolDashRoot.isMobile
                                Layout.fillWidth: true
                                text: "Track Incident Status ➔"
                                onClicked: {
                                    appCtrl.selectTicket(modelData.number);
                                    appCtrl.currentScreen = "ticket_details";
                                }
                                contentItem: Text {
                                    text: parent.text
                                    color: "#0F2942"
                                    font.bold: true
                                    font.pixelSize: 11
                                    horizontalAlignment: Text.AlignHCenter
                                }
                                background: Rectangle {
                                    color: "#E2E8F0"
                                    radius: 4
                                }
                            }
                        }
                    }
                }
            }
        }

        Item { height: 16 }
    }
}
