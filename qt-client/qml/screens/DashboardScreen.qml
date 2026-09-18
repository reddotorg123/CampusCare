import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ScrollView {
    id: scrollRoot
    contentWidth: availableWidth
    clip: true

    readonly property bool isMobile: scrollRoot.width < 600

    ColumnLayout {
        width: Math.min(scrollRoot.width - (scrollRoot.isMobile ? 16 : 32), 1060)
        anchors.horizontalCenter: parent.horizontalCenter
        spacing: scrollRoot.isMobile ? 12 : 20

        Item { height: scrollRoot.isMobile ? 4 : 8 }

        // Institution Header Card
        Rectangle {
            Layout.fillWidth: true
            implicitHeight: headerCol.implicitHeight + (scrollRoot.isMobile ? 24 : 32)
            color: "#FFFFFF"
            radius: 10
            border.color: "#E2E8F0"
            border.width: 1

            ColumnLayout {
                id: headerCol
                anchors.fill: parent
                anchors.margins: scrollRoot.isMobile ? 12 : 16
                spacing: 12

                RowLayout {
                    Layout.fillWidth: true
                    spacing: 12

                    Rectangle {
                        width: scrollRoot.isMobile ? 40 : 48
                        height: scrollRoot.isMobile ? 40 : 48
                        radius: 8
                        color: "#EFF6FF"
                        Text {
                            anchors.centerIn: parent
                            text: "🏫"
                            font.pixelSize: scrollRoot.isMobile ? 20 : 24
                        }
                    }

                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 2
                        Text {
                            text: appCtrl.currentUserSchoolName || "CampusCare MSP Central"
                            font.bold: true
                            font.pixelSize: scrollRoot.isMobile ? 15 : 18
                            color: "#0F172A"
                            wrapMode: Text.WordWrap
                            Layout.fillWidth: true
                        }
                        Text {
                            text: appCtrl.currentLabName ? (appCtrl.currentLabName + " • Institutional Asset Portal") : "Central IT AMC Management"
                            font.pixelSize: 11
                            color: "#64748B"
                            wrapMode: Text.WordWrap
                            Layout.fillWidth: true
                        }
                    }
                }

                Button {
                    Layout.fillWidth: scrollRoot.isMobile
                    Layout.alignment: scrollRoot.isMobile ? Qt.AlignHCenter : Qt.AlignRight
                    text: "View 2D Lab Map ➔"
                    onClicked: appCtrl.currentScreen = "lab_map"
                    contentItem: Text {
                        text: parent.text
                        color: "#FFFFFF"
                        font.bold: true
                        font.pixelSize: 13
                        horizontalAlignment: Text.AlignHCenter
                        verticalAlignment: Text.AlignVCenter
                    }
                    background: Rectangle {
                        color: "#0F2942"
                        radius: 6
                    }
                }
            }
        }

        // 4 KPI Metric Cards (Responsive 1, 2, or 4 columns)
        GridLayout {
            Layout.fillWidth: true
            columns: scrollRoot.width > 900 ? 4 : (scrollRoot.width > 540 ? 2 : 1)
            rowSpacing: 10
            columnSpacing: 10

            // Card 1: Total Systems
            Rectangle {
                Layout.fillWidth: true
                height: 90
                color: "#FFFFFF"
                radius: 8
                border.color: "#E2E8F0"
                ColumnLayout {
                    anchors.fill: parent
                    anchors.margins: 12
                    Text { text: "TOTAL WORKSTATIONS"; font.pixelSize: 10; font.bold: true; color: "#64748B" }
                    Text { text: appCtrl.stats.total ? appCtrl.stats.total.toString() : "30"; font.pixelSize: 22; font.bold: true; color: "#0F172A" }
                    Text { text: "All Lab 1 Desks Active"; font.pixelSize: 10; color: "#10B981" }
                }
            }

            // Card 2: Healthy Systems
            Rectangle {
                Layout.fillWidth: true
                height: 90
                color: "#FFFFFF"
                radius: 8
                border.color: "#E2E8F0"
                ColumnLayout {
                    anchors.fill: parent
                    anchors.margins: 12
                    Text { text: "OPERATIONAL"; font.pixelSize: 10; font.bold: true; color: "#64748B" }
                    Text { text: (appCtrl.stats.working ? appCtrl.stats.working.toString() : "24") + " / 30"; font.pixelSize: 22; font.bold: true; color: "#16A34A" }
                    Text { text: "80% System Availability"; font.pixelSize: 10; color: "#64748B" }
                }
            }

            // Card 3: Issues Reported
            Rectangle {
                Layout.fillWidth: true
                height: 90
                color: "#FFFFFF"
                radius: 8
                border.color: "#FCA5A5"
                ColumnLayout {
                    anchors.fill: parent
                    anchors.margins: 12
                    Text { text: "ACTIVE TICKETS"; font.pixelSize: 10; font.bold: true; color: "#DC2626" }
                    Text { text: (appCtrl.stats.issues ? appCtrl.stats.issues.toString() : "2") + " Critical"; font.pixelSize: 22; font.bold: true; color: "#DC2626" }
                    Text { text: "PC-07 & PC-19 require fix"; font.pixelSize: 10; color: "#DC2626" }
                }
            }

            // Card 4: AMC Status
            Rectangle {
                Layout.fillWidth: true
                height: 90
                color: "#FFFFFF"
                radius: 8
                border.color: "#E2E8F0"
                ColumnLayout {
                    anchors.fill: parent
                    anchors.margins: 12
                    Text { text: "AMC COVERAGE"; font.pixelSize: 10; font.bold: true; color: "#64748B" }
                    Text { text: "Comprehensive"; font.pixelSize: 18; font.bold: true; color: "#2563EB" }
                    Text { text: "Valid thru 31 Mar 2027"; font.pixelSize: 10; color: "#10B981" }
                }
            }
        }

        // Active Tickets List Section
        Rectangle {
            Layout.fillWidth: true
            implicitHeight: ticketColumn.implicitHeight + 28
            color: "#FFFFFF"
            radius: 8
            border.color: "#E2E8F0"

            ColumnLayout {
                id: ticketColumn
                anchors.fill: parent
                anchors.margins: scrollRoot.isMobile ? 12 : 16
                spacing: 12

                RowLayout {
                    Layout.fillWidth: true
                    Text {
                        text: "Active Tickets & Incidents"
                        font.bold: true
                        font.pixelSize: 15
                        color: "#0F172A"
                    }
                    Item { Layout.fillWidth: true }
                    Button {
                        text: "+ Log Ticket"
                        onClicked: appCtrl.currentScreen = "create_ticket"
                        contentItem: Text {
                            text: parent.text
                            color: "#FFFFFF"
                            font.bold: true
                            font.pixelSize: 11
                        }
                        background: Rectangle {
                            color: "#DC2626"
                            radius: 4
                        }
                    }
                }

                Rectangle {
                    Layout.fillWidth: true
                    height: 1
                    color: "#E2E8F0"
                }

                Repeater {
                    model: appCtrl.tickets

                    delegate: Rectangle {
                        required property var modelData
                        Layout.fillWidth: true
                        implicitHeight: ticketRowCol.implicitHeight + 16
                        radius: 6
                        color: "#F8FAFC"
                        border.color: "#E2E8F0"

                        ColumnLayout {
                            id: ticketRowCol
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
                                    spacing: 2
                                    Layout.fillWidth: true
                                    RowLayout {
                                        spacing: 6
                                        Text {
                                            text: modelData.number
                                            font.bold: true
                                            font.pixelSize: 12
                                            color: "#0F2942"
                                        }
                                        Rectangle {
                                            width: prioText.contentWidth + 8
                                            height: 16
                                            radius: 3
                                            color: modelData.priority === "Critical" ? "#DC2626" : "#D97706"
                                            Text {
                                                id: prioText
                                                anchors.centerIn: parent
                                                text: modelData.priority
                                                color: "#FFFFFF"
                                                font.pixelSize: 9
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
                                    visible: !scrollRoot.isMobile
                                    text: "Inspect ➔"
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
                                visible: scrollRoot.isMobile
                                Layout.fillWidth: true
                                text: "Inspect Incident ➔"
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
