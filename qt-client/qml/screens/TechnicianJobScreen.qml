import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ScrollView {
    id: jobRoot
    contentWidth: availableWidth
    clip: true

    readonly property bool isMobile: jobRoot.width < 600

    ColumnLayout {
        width: Math.min(jobRoot.width - (jobRoot.isMobile ? 16 : 32), 900)
        anchors.horizontalCenter: parent.horizontalCenter
        spacing: jobRoot.isMobile ? 12 : 16

        Item { height: 8 }

        // Back button
        RowLayout {
            Layout.fillWidth: true
            Button {
                text: "← Back"
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
                text: "View Target PC Map ➔"
                onClicked: {
                    appCtrl.selectWorkstation(appCtrl.selectedTicket.systemCode);
                    appCtrl.currentScreen = "lab_map";
                }
                contentItem: Text {
                    text: parent.text
                    color: "#0F2942"
                    font.bold: true
                    font.pixelSize: 12
                }
                background: Rectangle {
                    color: "#EFF6FF"
                    border.color: "#BFDBFE"
                    radius: 4
                }
            }
        }

        // Job Header Card
        Rectangle {
            Layout.fillWidth: true
            implicitHeight: headerCol.implicitHeight + (jobRoot.isMobile ? 24 : 32)
            color: "#0F2942"
            radius: 8

            ColumnLayout {
                id: headerCol
                anchors.fill: parent
                anchors.margins: jobRoot.isMobile ? 12 : 16
                spacing: 8

                RowLayout {
                    Layout.fillWidth: true
                    spacing: 12

                    Rectangle {
                        width: jobRoot.isMobile ? 38 : 48
                        height: jobRoot.isMobile ? 38 : 48
                        radius: 6
                        color: "#1E4E79"
                        Text {
                            anchors.centerIn: parent
                            text: "🛠️"
                            font.pixelSize: jobRoot.isMobile ? 18 : 22
                        }
                    }

                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 2
                        Text {
                            text: "Field Diagnosis Job • " + appCtrl.selectedTicket.number
                            font.bold: true
                            font.pixelSize: jobRoot.isMobile ? 14 : 16
                            color: "#FFFFFF"
                        }
                        Text {
                            text: "Target System: " + appCtrl.selectedTicket.systemCode + " (" + appCtrl.selectedTicket.assetCode + ")"
                            font.pixelSize: 11
                            color: "#94A3B8"
                        }
                    }

                    Rectangle {
                        width: jobStatusText.contentWidth + 12
                        height: 24
                        radius: 4
                        color: appCtrl.selectedTicket.status === "Resolved" ? "#16A34A" : "#D97706"
                        Text {
                            id: jobStatusText
                            anchors.centerIn: parent
                            text: appCtrl.selectedTicket.status.toUpperCase()
                            color: "#FFFFFF"
                            font.bold: true
                            font.pixelSize: 10
                        }
                    }
                }
            }
        }

        // Checklist Card
        Rectangle {
            Layout.fillWidth: true
            implicitHeight: checklistCol.implicitHeight + (jobRoot.isMobile ? 24 : 36)
            color: "#FFFFFF"
            radius: 8
            border.color: "#E2E8F0"

            ColumnLayout {
                id: checklistCol
                anchors.fill: parent
                anchors.margins: jobRoot.isMobile ? 12 : 16
                spacing: 12

                Text {
                    text: "Mandatory Quality & Diagnosis Checklist"
                    font.bold: true
                    font.pixelSize: 15
                    color: "#0F172A"
                }

                Text {
                    text: "Tap items below as steps are performed on physical PC:"
                    font.pixelSize: 11
                    color: "#64748B"
                }

                Rectangle { Layout.fillWidth: true; height: 1; color: "#E2E8F0" }

                Repeater {
                    model: appCtrl.checklist

                    delegate: Rectangle {
                        required property var modelData
                        required property int index
                        Layout.fillWidth: true
                        implicitHeight: itemRow.implicitHeight + 20
                        radius: 6
                        color: modelData.done ? "#F0FDF4" : "#F8FAFC"
                        border.color: modelData.done ? "#BBF7D0" : "#E2E8F0"

                        RowLayout {
                            id: itemRow
                            anchors.fill: parent
                            anchors.margins: 10
                            spacing: 12

                            // 44px min touch target
                            Rectangle {
                                width: 26
                                height: 26
                                radius: 5
                                color: modelData.done ? "#16A34A" : "#FFFFFF"
                                border.color: modelData.done ? "#16A34A" : "#CBD5E1"
                                border.width: 1

                                Text {
                                    anchors.centerIn: parent
                                    text: "✓"
                                    font.bold: true
                                    font.pixelSize: 14
                                    color: "#FFFFFF"
                                    visible: modelData.done
                                }
                            }

                            Text {
                                Layout.fillWidth: true
                                text: modelData.title
                                font.pixelSize: 12
                                font.strikeout: modelData.done
                                color: modelData.done ? "#166534" : "#1E293B"
                                wrapMode: Text.WordWrap
                            }
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: appCtrl.toggleChecklistItem(index)
                        }
                    }
                }

                Rectangle { Layout.fillWidth: true; height: 1; color: "#E2E8F0" }

                // Live Diagnostic Note Entry
                ColumnLayout {
                    Layout.fillWidth: true
                    spacing: 6

                    Text {
                        text: "Add Live Diagnostic Observation / Repair Note:"
                        font.pixelSize: 11
                        font.bold: true
                        color: "#334155"
                    }

                    RowLayout {
                        Layout.fillWidth: true
                        spacing: 8

                        TextField {
                            id: diagNoteInput
                            Layout.fillWidth: true
                            placeholderText: "e.g. Memory test passed 0 errors, replaced faulty RAM stick..."
                            onAccepted: {
                                if (text.trim().length > 0) {
                                    appCtrl.addTimelineMessage(text.trim());
                                    text = "";
                                }
                            }
                        }

                        Button {
                            text: "+ Post Note"
                            enabled: diagNoteInput.text.trim().length > 0
                            onClicked: {
                                if (diagNoteInput.text.trim().length > 0) {
                                    appCtrl.addTimelineMessage(diagNoteInput.text.trim());
                                    diagNoteInput.text = "";
                                }
                            }
                            contentItem: Text {
                                text: parent.text
                                color: diagNoteInput.text.trim().length > 0 ? "#FFFFFF" : "#94A3B8"
                                font.bold: true
                                font.pixelSize: 11
                            }
                            background: Rectangle {
                                color: diagNoteInput.text.trim().length > 0 ? "#0F2942" : "#E2E8F0"
                                radius: 4
                            }
                        }
                    }

                    // Quick Diagnosis Presets / Chips
                    Flow {
                        Layout.fillWidth: true
                        spacing: 6

                        Repeater {
                            model: [
                                "MemTest86: 4 passes 0 errors",
                                "Updated Realtek LAN Driver v10.68",
                                "Replaced SATA Cable",
                                "UEFI BIOS flashed to v1.2",
                                "System 30-min burn-in verified OK"
                            ]

                            delegate: Rectangle {
                                required property var modelData
                                width: chipText.contentWidth + 14
                                height: 26
                                radius: 13
                                color: "#F1F5F9"
                                border.color: "#CBD5E1"

                                Text {
                                    id: chipText
                                    anchors.centerIn: parent
                                    text: modelData
                                    font.pixelSize: 10
                                    color: "#334155"
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: {
                                        diagNoteInput.text = modelData;
                                    }
                                }
                            }
                        }
                    }
                }

                Rectangle { Layout.fillWidth: true; height: 1; color: "#E2E8F0" }

                // Actions (Stacked on mobile, row on desktop)
                ColumnLayout {
                    Layout.fillWidth: true
                    spacing: 8
                    visible: jobRoot.isMobile

                    Button {
                        Layout.fillWidth: true
                        height: 44
                        text: "✓ Mark Service Resolved & Close Ticket"
                        onClicked: {
                            var note = diagNoteInput.text.trim().length > 0 ?
                                diagNoteInput.text.trim() :
                                "Workstation diagnosed, components tested and system verified operational.";
                            appCtrl.resolveTicket(appCtrl.selectedTicket.number, note);
                            appCtrl.currentScreen = "ticket_timeline";
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
                            color: "#16A34A"
                            radius: 6
                        }
                    }
                }

                RowLayout {
                    Layout.fillWidth: true
                    spacing: 12
                    visible: !jobRoot.isMobile

                    Button {
                        text: "💬 View Full Timeline Stream"
                        onClicked: appCtrl.currentScreen = "ticket_timeline"
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
                        text: "✓ Mark Service Resolved & Return PC to Operational"
                        onClicked: {
                            var note = diagNoteInput.text.trim().length > 0 ?
                                diagNoteInput.text.trim() :
                                "Workstation diagnosed, components tested and system verified operational.";
                            appCtrl.resolveTicket(appCtrl.selectedTicket.number, note);
                            appCtrl.currentScreen = "ticket_timeline";
                        }
                        contentItem: Text {
                            text: parent.text
                            color: "#FFFFFF"
                            font.bold: true
                            font.pixelSize: 12
                        }
                        background: Rectangle {
                            color: "#16A34A"
                            radius: 4
                        }
                    }
                }
            }
        }

        Item { height: 16 }
    }
}
