import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ScrollView {
    id: tktRoot
    contentWidth: availableWidth
    clip: true

    ColumnLayout {
        width: Math.min(tktRoot.width - 32, 900)
        anchors.horizontalCenter: parent.horizontalCenter
        spacing: 16

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
                text: "View System " + appCtrl.selectedTicket.systemCode + " ➔"
                onClicked: {
                    appCtrl.selectWorkstation(appCtrl.selectedTicket.systemCode);
                    appCtrl.currentScreen = "system_details";
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

        // Ticket Overview Card
        Rectangle {
            Layout.fillWidth: true
            implicitHeight: ticketDetailsCol.implicitHeight + 36
            color: "#FFFFFF"
            radius: 8
            border.color: "#E2E8F0"

            ColumnLayout {
                id: ticketDetailsCol
                anchors.fill: parent
                anchors.margins: 18
                spacing: 14

                RowLayout {
                    Layout.fillWidth: true
                    spacing: 10
                    Text {
                        text: appCtrl.selectedTicket.number
                        font.bold: true
                        font.pixelSize: 20
                        color: "#0F2942"
                    }
                    Rectangle {
                        width: prioBadgeText.contentWidth + 12
                        height: 22
                        radius: 4
                        color: appCtrl.selectedTicket.priority === "Critical" ? "#DC2626" : "#D97706"
                        Text {
                            id: prioBadgeText
                            anchors.centerIn: parent
                            text: appCtrl.selectedTicket.priority.toUpperCase()
                            color: "#FFFFFF"
                            font.pixelSize: 10
                            font.bold: true
                        }
                    }
                    Rectangle {
                        width: statusBadgeText.contentWidth + 12
                        height: 22
                        radius: 4
                        color: appCtrl.selectedTicket.status === "Resolved" ? "#16A34A" : (appCtrl.selectedTicket.status === "Open" ? "#DC2626" : "#2563EB")
                        Text {
                            id: statusBadgeText
                            anchors.centerIn: parent
                            text: appCtrl.selectedTicket.status.toUpperCase()
                            color: "#FFFFFF"
                            font.pixelSize: 10
                            font.bold: true
                        }
                    }
                }

                Text {
                    text: appCtrl.selectedTicket.title
                    font.bold: true
                    font.pixelSize: 16
                    color: "#0F172A"
                    wrapMode: Text.WordWrap
                    Layout.fillWidth: true
                }

                Rectangle { Layout.fillWidth: true; height: 1; color: "#E2E8F0" }

                // Metadata Grid
                GridLayout {
                    Layout.fillWidth: true
                    columns: tktRoot.width > 600 ? 3 : 1
                    rowSpacing: 10
                    columnSpacing: 16

                    ColumnLayout {
                        spacing: 2
                        Text { text: "AFFECTED WORKSTATION"; font.pixelSize: 10; font.bold: true; color: "#64748B" }
                        Text { text: appCtrl.selectedTicket.systemCode + " (" + appCtrl.selectedTicket.assetCode + ")"; font.pixelSize: 13; font.bold: true; color: "#0F172A" }
                    }

                    ColumnLayout {
                        spacing: 2
                        Text { text: "ASSIGNED TECHNICIAN"; font.pixelSize: 10; font.bold: true; color: "#64748B" }
                        Text { text: appCtrl.selectedTicket.technician; font.pixelSize: 13; color: "#0F172A" }
                    }

                    ColumnLayout {
                        spacing: 2
                        Text { text: "REPORTED BY"; font.pixelSize: 10; font.bold: true; color: "#64748B" }
                        Text { text: appCtrl.selectedTicket.reportedBy + " • " + appCtrl.selectedTicket.createdAt; font.pixelSize: 12; color: "#0F172A" }
                    }
                }

                Rectangle { Layout.fillWidth: true; height: 1; color: "#E2E8F0" }

                // Description
                ColumnLayout {
                    spacing: 6
                    Layout.fillWidth: true
                    Text { text: "INCIDENT DETAILS & ERROR DESCRIPTION"; font.pixelSize: 11; font.bold: true; color: "#64748B" }
                    Rectangle {
                        Layout.fillWidth: true
                        implicitHeight: descText.implicitHeight + 16
                        color: "#F8FAFC"
                        radius: 6
                        border.color: "#E2E8F0"
                        Text {
                            id: descText
                            anchors.fill: parent
                            anchors.margins: 10
                            text: appCtrl.selectedTicket.description
                            font.pixelSize: 13
                            color: "#334155"
                            wrapMode: Text.WordWrap
                        }
                    }
                }

                // ================= ORG ADMIN DISPATCH CONTROLS =================
                Rectangle {
                    visible: appCtrl.currentRole === "org_admin"
                    Layout.fillWidth: true
                    implicitHeight: dispatchCol.implicitHeight + 16
                    color: "#F8FAFC"
                    radius: 6
                    border.color: "#CBD5E1"

                    ColumnLayout {
                        id: dispatchCol
                        anchors.fill: parent
                        anchors.margins: 12
                        spacing: 8

                        Text {
                            text: "👑 Organization Admin Dispatch Controls:"
                            font.bold: true
                            font.pixelSize: 12
                            color: "#1E293B"
                        }

                        GridLayout {
                            Layout.fillWidth: true
                            columns: tktRoot.width > 600 ? 2 : 1
                            rowSpacing: 8
                            columnSpacing: 12

                            // Assign Technician
                            ColumnLayout {
                                Layout.fillWidth: true
                                spacing: 4
                                Text { text: "Reassign Technician:"; font.pixelSize: 10; font.bold: true; color: "#64748B" }
                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 6
                                    ComboBox {
                                        id: techCombo
                                        Layout.fillWidth: true
                                        model: appCtrl.availableTechnicians
                                    }
                                    Button {
                                        text: "Assign"
                                        onClicked: appCtrl.assignTechnician(appCtrl.selectedTicket.number, techCombo.currentText)
                                    }
                                }
                            }

                            // Update Lifecycle Status
                            ColumnLayout {
                                Layout.fillWidth: true
                                spacing: 4
                                Text { text: "Update Incident Lifecycle:"; font.pixelSize: 10; font.bold: true; color: "#64748B" }
                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 6
                                    ComboBox {
                                        id: statusCombo
                                        Layout.fillWidth: true
                                        model: ["Open", "In Progress", "Under Service", "Resolved", "Closed"]
                                        currentIndex: {
                                            var st = appCtrl.selectedTicket.status;
                                            if (st === "Open") return 0;
                                            if (st === "In Progress") return 1;
                                            if (st === "Under Service") return 2;
                                            if (st === "Resolved") return 3;
                                            return 4;
                                        }
                                    }
                                    Button {
                                        text: "Apply"
                                        onClicked: appCtrl.updateTicketStatus(appCtrl.selectedTicket.number, statusCombo.currentText)
                                    }
                                }
                            }
                        }
                    }
                }

                // ================= ROLE-RESTRICTED WORKFLOW BUTTONS =================
                // 1. School Admin: Cannot access technician repair tools, only timeline stream and add staff remark
                ColumnLayout {
                    visible: appCtrl.currentRole === "school_admin"
                    Layout.fillWidth: true
                    spacing: 10

                    RowLayout {
                        Layout.fillWidth: true
                        spacing: 8
                        TextField {
                            id: staffNoteField
                            Layout.fillWidth: true
                            placeholderText: "Add note/remark as School Staff (e.g. System turned off, lab batch notified)..."
                            onAccepted: {
                                if (text.trim().length > 0) {
                                    appCtrl.addTimelineMessage(text.trim());
                                    text = "";
                                }
                            }
                        }
                        Button {
                            text: "+ Post Staff Note"
                            enabled: staffNoteField.text.trim().length > 0
                            onClicked: {
                                if (staffNoteField.text.trim().length > 0) {
                                    appCtrl.addTimelineMessage(staffNoteField.text.trim());
                                    staffNoteField.text = "";
                                }
                            }
                            contentItem: Text {
                                text: parent.text
                                color: staffNoteField.text.trim().length > 0 ? "#FFFFFF" : "#94A3B8"
                                font.bold: true
                                font.pixelSize: 11
                            }
                            background: Rectangle {
                                color: staffNoteField.text.trim().length > 0 ? "#0F2942" : "#E2E8F0"
                                radius: 4
                            }
                        }
                    }

                    Button {
                        Layout.fillWidth: true
                        height: 40
                        text: "💬 Open Timeline Stream & Communications History"
                        onClicked: appCtrl.currentScreen = "ticket_timeline"
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

                // 2. Technician & Org Admin: Have access to checklist and timeline
                RowLayout {
                    visible: appCtrl.currentRole !== "school_admin"
                    Layout.fillWidth: true
                    spacing: 12

                    Button {
                        Layout.fillWidth: true
                        height: 40
                        text: "🛠️ Open Technician Diagnosis & Checklist"
                        onClicked: appCtrl.currentScreen = "technician_job"
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

                    Button {
                        Layout.fillWidth: true
                        height: 40
                        text: "💬 Activity Timeline & Chat Stream"
                        onClicked: appCtrl.currentScreen = "ticket_timeline"
                        contentItem: Text {
                            text: parent.text
                            color: "#0F2942"
                            font.bold: true
                            font.pixelSize: 13
                            horizontalAlignment: Text.AlignHCenter
                            verticalAlignment: Text.AlignVCenter
                        }
                        background: Rectangle {
                            color: "#EFF6FF"
                            border.color: "#BFDBFE"
                            radius: 6
                        }
                    }
                }
            }
        }

        Item { height: 16 }
    }
}
