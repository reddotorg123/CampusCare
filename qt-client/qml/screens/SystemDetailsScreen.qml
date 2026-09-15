import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ScrollView {
    id: sysRoot
    contentWidth: availableWidth
    clip: true

    readonly property bool isMobile: sysRoot.width < 600

    ColumnLayout {
        width: Math.min(sysRoot.width - (sysRoot.isMobile ? 16 : 32), 900)
        anchors.horizontalCenter: parent.horizontalCenter
        spacing: sysRoot.isMobile ? 12 : 16

        Item { height: 8 }

        // Navigation Bar
        ColumnLayout {
            Layout.fillWidth: true
            spacing: 8
            visible: sysRoot.isMobile

            Button {
                Layout.fillWidth: true
                text: "← Back to Lab Map"
                onClicked: appCtrl.navigateBack()
                contentItem: Text {
                    text: parent.text
                    color: "#0F2942"
                    font.bold: true
                    font.pixelSize: 12
                    horizontalAlignment: Text.AlignHCenter
                }
                background: Rectangle {
                    color: "#E2E8F0"
                    radius: 4
                }
            }

            Button {
                Layout.fillWidth: true
                text: "+ Report Issue on " + appCtrl.selectedWorkstation.code
                onClicked: appCtrl.currentScreen = "create_ticket"
                contentItem: Text {
                    text: parent.text
                    color: "#FFFFFF"
                    font.bold: true
                    font.pixelSize: 12
                    horizontalAlignment: Text.AlignHCenter
                }
                background: Rectangle {
                    color: "#DC2626"
                    radius: 4
                }
            }
        }

        RowLayout {
            Layout.fillWidth: true
            visible: !sysRoot.isMobile

            Button {
                text: "← Back to Lab Map"
                onClicked: appCtrl.navigateBack()
                contentItem: Text {
                    text: parent.text
                    color: "#0F2942"
                    font.bold: true
                    font.pixelSize: 12
                }
                background: Rectangle {
                    color: "#E2E8F0"
                    radius: 4
                }
            }
            Item { Layout.fillWidth: true }
            Button {
                text: "+ Report Issue on " + appCtrl.selectedWorkstation.code
                onClicked: appCtrl.currentScreen = "create_ticket"
                contentItem: Text {
                    text: parent.text
                    color: "#FFFFFF"
                    font.bold: true
                    font.pixelSize: 12
                }
                background: Rectangle {
                    color: "#DC2626"
                    radius: 4
                }
            }
        }

        // Header Card
        Rectangle {
            Layout.fillWidth: true
            implicitHeight: headerCardCol.implicitHeight + (sysRoot.isMobile ? 20 : 32)
            color: "#FFFFFF"
            radius: 8
            border.color: "#E2E8F0"

            RowLayout {
                id: headerCardCol
                anchors.fill: parent
                anchors.margins: sysRoot.isMobile ? 12 : 16
                spacing: 12

                Rectangle {
                    width: sysRoot.isMobile ? 44 : 56
                    height: sysRoot.isMobile ? 44 : 56
                    radius: 8
                    color: appCtrl.selectedWorkstation.status === "issue" ? "#FEE2E2" : "#F0FDF4"
                    Text {
                        anchors.centerIn: parent
                        text: "🖥️"
                        font.pixelSize: sysRoot.isMobile ? 22 : 28
                    }
                }

                ColumnLayout {
                    Layout.fillWidth: true
                    spacing: 4
                    RowLayout {
                        spacing: 8
                        Text {
                            text: appCtrl.selectedWorkstation.code
                            font.bold: true
                            font.pixelSize: sysRoot.isMobile ? 16 : 20
                            color: "#0F172A"
                        }
                        Rectangle {
                            width: statBadgeText.contentWidth + 10
                            height: 20
                            radius: 4
                            color: appCtrl.selectedWorkstation.status === "issue" ? "#DC2626" : "#16A34A"
                            Text {
                                id: statBadgeText
                                anchors.centerIn: parent
                                text: appCtrl.selectedWorkstation.status === "issue" ? "ISSUE REPORTED" : "OPERATIONAL"
                                color: "#FFFFFF"
                                font.pixelSize: 9
                                font.bold: true
                            }
                        }
                    }
                    Text {
                        text: "Asset Tag: " + appCtrl.selectedWorkstation.assetCode + " • " + appCtrl.selectedWorkstation.location
                        font.pixelSize: 11
                        color: "#64748B"
                        wrapMode: Text.WordWrap
                        Layout.fillWidth: true
                    }
                }
            }
        }

        // Active Ticket Banner
        Rectangle {
            Layout.fillWidth: true
            visible: appCtrl.selectedWorkstation.status === "issue"
            implicitHeight: ticketBannerCol.implicitHeight + 24
            color: "#FEF2F2"
            radius: 8
            border.color: "#FCA5A5"

            ColumnLayout {
                id: ticketBannerCol
                anchors.fill: parent
                anchors.margins: 14
                spacing: 8

                RowLayout {
                    Layout.fillWidth: true
                    spacing: 10
                    Text { text: "⚠️"; font.pixelSize: 20 }
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 2
                        Text {
                            text: "Active Incident: " + appCtrl.selectedWorkstation.activeTicket + " (CRITICAL)"
                            font.bold: true
                            font.pixelSize: 12
                            color: "#991B1B"
                        }
                        Text {
                            text: "Blue Screen of Death (DRIVER_IRQL_NOT_LESS_OR_EQUAL)"
                            font.pixelSize: 11
                            color: "#B91C1C"
                            wrapMode: Text.WordWrap
                            Layout.fillWidth: true
                        }
                    }
                }

                RowLayout {
                    Layout.fillWidth: sysRoot.isMobile
                    Layout.alignment: sysRoot.isMobile ? Qt.AlignHCenter : Qt.AlignRight
                    spacing: 8

                    Button {
                        text: "View Ticket Details ➔"
                        onClicked: {
                            appCtrl.selectTicket(appCtrl.selectedWorkstation.activeTicket);
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

                    Button {
                        visible: appCtrl.currentRole === "technician"
                        text: "🛠️ Start Diagnosis Job ➔"
                        onClicked: {
                            appCtrl.selectTicket(appCtrl.selectedWorkstation.activeTicket);
                            appCtrl.currentScreen = "technician_job";
                        }
                        contentItem: Text {
                            text: parent.text
                            color: "#FFFFFF"
                            font.bold: true
                            font.pixelSize: 11
                            horizontalAlignment: Text.AlignHCenter
                        }
                        background: Rectangle {
                            color: "#DC2626"
                            radius: 4
                        }
                    }
                }
            }
        }

        // Hardware Specifications Card
        Rectangle {
            Layout.fillWidth: true
            implicitHeight: specGrid.implicitHeight + 48
            color: "#FFFFFF"
            radius: 8
            border.color: "#E2E8F0"

            ColumnLayout {
                anchors.fill: parent
                anchors.margins: sysRoot.isMobile ? 12 : 16
                spacing: 12

                Text {
                    text: "Hardware & Network Specifications"
                    font.bold: true
                    font.pixelSize: 14
                    color: "#0F172A"
                }

                Rectangle { Layout.fillWidth: true; height: 1; color: "#E2E8F0" }

                GridLayout {
                    id: specGrid
                    Layout.fillWidth: true
                    columns: sysRoot.width > 600 ? 2 : 1
                    rowSpacing: 10
                    columnSpacing: 20

                    Repeater {
                        model: [
                            { label: "Make & Model", val: appCtrl.selectedWorkstation.makeModel },
                            { label: "Processor", val: appCtrl.selectedWorkstation.processor },
                            { label: "RAM / Memory", val: appCtrl.selectedWorkstation.ram },
                            { label: "Storage", val: appCtrl.selectedWorkstation.storage },
                            { label: "Operating System", val: appCtrl.selectedWorkstation.os },
                            { label: "IP Address", val: appCtrl.selectedWorkstation.ip },
                            { label: "MAC Address", val: appCtrl.selectedWorkstation.mac },
                            { label: "Display Monitor", val: appCtrl.selectedWorkstation.monitor },
                            { label: "Peripherals", val: appCtrl.selectedWorkstation.peripherals }
                        ]

                        delegate: ColumnLayout {
                            required property var modelData
                            spacing: 2
                            Text { text: modelData.label; font.pixelSize: 10; font.bold: true; color: "#64748B" }
                            Text { text: modelData.val; font.pixelSize: 12; color: "#0F172A"; wrapMode: Text.WordWrap; Layout.fillWidth: true }
                        }
                    }
                }
            }
        }

        Item { height: 16 }
    }
}
