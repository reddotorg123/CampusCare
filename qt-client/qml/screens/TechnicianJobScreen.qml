import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ScrollView {
    id: jobRoot
    contentWidth: availableWidth
    clip: true

    readonly property bool isMobile: jobRoot.width < 600
    property string activeTab: "my_jobs" // "my_jobs" or "open_pool"
    property bool showReleaseDialog: false
    property string releaseReason: ""

    ColumnLayout {
        width: Math.min(jobRoot.width - (jobRoot.isMobile ? 16 : 32), 940)
        anchors.horizontalCenter: parent.horizontalCenter
        spacing: jobRoot.isMobile ? 12 : 16

        Item { height: 8 }

        // Back button and quick actions
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
                    radius: 6
                }
            }
            Item { Layout.fillWidth: true }

            Button {
                text: "View Target PC Map ➔"
                visible: appCtrl.selectedTicket.systemCode !== undefined && appCtrl.selectedTicket.systemCode !== ""
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
                    radius: 6
                }
            }
        }

        // ================= 1. PUSH NOTIFICATION BANNER =================
        Rectangle {
            Layout.fillWidth: true
            implicitHeight: bannerRow.implicitHeight + 20
            radius: 8
            color: "#FFFBEB"
            border.color: "#FCD34D"
            border.width: 1
            visible: appCtrl.openTickets.length > 0

            RowLayout {
                id: bannerRow
                anchors.fill: parent
                anchors.margins: 10
                spacing: 10

                Text {
                    text: "🚨"
                    font.pixelSize: 20
                }

                ColumnLayout {
                    Layout.fillWidth: true
                    spacing: 1
                    Text {
                        text: "NEW ISSUES ARRIVED (" + appCtrl.openTickets.length + " Open Pool)"
                        font.bold: true
                        font.pixelSize: 12
                        color: "#92400E"
                    }
                    Text {
                        text: "Unassigned tickets are waiting for any engineer to accept and claim."
                        font.pixelSize: 11
                        color: "#B45309"
                    }
                }

                Button {
                    text: "View Pool"
                    onClicked: jobRoot.activeTab = "open_pool"
                    contentItem: Text {
                        text: parent.text
                        color: "#FFFFFF"
                        font.bold: true
                        font.pixelSize: 11
                    }
                    background: Rectangle {
                        color: "#D97706"
                        radius: 6
                    }
                }
            }
        }

        // ================= 2. ENGINEER CONSOLE TAB BAR =================
        Rectangle {
            Layout.fillWidth: true
            height: 46
            radius: 8
            color: "#FFFFFF"
            border.color: "#E2E8F0"

            RowLayout {
                anchors.fill: parent
                anchors.margins: 4
                spacing: 6

                // Tab: My Active Jobs
                Rectangle {
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    radius: 6
                    color: jobRoot.activeTab === "my_jobs" ? "#0F2942" : "transparent"

                    RowLayout {
                        anchors.centerIn: parent
                        spacing: 6
                        Text {
                            text: "🛠️ My Active Jobs"
                            font.bold: jobRoot.activeTab === "my_jobs"
                            font.pixelSize: jobRoot.isMobile ? 12 : 13
                            color: jobRoot.activeTab === "my_jobs" ? "#FFFFFF" : "#475569"
                        }
                        Rectangle {
                            width: 20
                            height: 20
                            radius: 10
                            color: jobRoot.activeTab === "my_jobs" ? "#2563EB" : "#E2E8F0"
                            Text {
                                anchors.centerIn: parent
                                text: appCtrl.technicianTickets.length
                                font.pixelSize: 10
                                font.bold: true
                                color: jobRoot.activeTab === "my_jobs" ? "#FFFFFF" : "#475569"
                            }
                        }
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: jobRoot.activeTab = "my_jobs"
                    }
                }

                // Tab: Open Issues Pool
                Rectangle {
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    radius: 6
                    color: jobRoot.activeTab === "open_pool" ? "#D97706" : "transparent"

                    RowLayout {
                        anchors.centerIn: parent
                        spacing: 6
                        Text {
                            text: "⚡ Open Issues Pool"
                            font.bold: jobRoot.activeTab === "open_pool"
                            font.pixelSize: jobRoot.isMobile ? 12 : 13
                            color: jobRoot.activeTab === "open_pool" ? "#FFFFFF" : "#475569"
                        }
                        Rectangle {
                            width: 20
                            height: 20
                            radius: 10
                            color: jobRoot.activeTab === "open_pool" ? "#92400E" : "#FDE68A"
                            Text {
                                anchors.centerIn: parent
                                text: appCtrl.openTickets.length
                                font.pixelSize: 10
                                font.bold: true
                                color: jobRoot.activeTab === "open_pool" ? "#FFFFFF" : "#92400E"
                            }
                        }
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: jobRoot.activeTab = "open_pool"
                    }
                }
            }
        }

        // ================= 3. OPEN ISSUES POOL CONTENT =================
        ColumnLayout {
            Layout.fillWidth: true
            spacing: 12
            visible: jobRoot.activeTab === "open_pool"

            Text {
                text: "Open Issues Pool (Available to All Field Engineers)"
                font.bold: true
                font.pixelSize: 15
                color: "#0F172A"
            }
            Text {
                text: "If an assigned engineer is unavailable or released a job, it appears here for any engineer to accept and service."
                font.pixelSize: 12
                color: "#64748B"
            }

            Rectangle {
                Layout.fillWidth: true
                implicitHeight: 120
                radius: 8
                color: "#FFFFFF"
                border.color: "#E2E8F0"
                visible: appCtrl.openTickets.length === 0

                ColumnLayout {
                    anchors.centerIn: parent
                    spacing: 6
                    Text {
                        Layout.alignment: Qt.AlignHCenter
                        text: "🎉"
                        font.pixelSize: 28
                    }
                    Text {
                        Layout.alignment: Qt.AlignHCenter
                        text: "Open Pool is Empty"
                        font.bold: true
                        font.pixelSize: 14
                        color: "#334155"
                    }
                    Text {
                        Layout.alignment: Qt.AlignHCenter
                        text: "All raised issues are currently assigned and being handled by field engineers."
                        font.pixelSize: 12
                        color: "#94A3B8"
                    }
                }
            }

            Repeater {
                model: appCtrl.openTickets

                delegate: Rectangle {
                    required property var modelData
                    Layout.fillWidth: true
                    implicitHeight: poolCardCol.implicitHeight + 24
                    radius: 8
                    color: "#FFFFFF"
                    border.color: "#FDE68A"
                    border.width: 1.5

                    ColumnLayout {
                        id: poolCardCol
                        anchors.fill: parent
                        anchors.margins: 14
                        spacing: 8

                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 8

                            Rectangle {
                                width: poolNumText.contentWidth + 12
                                height: 22
                                radius: 4
                                color: "#FEF3C7"
                                Text {
                                    id: poolNumText
                                    anchors.centerIn: parent
                                    text: modelData.number
                                    font.bold: true
                                    font.pixelSize: 11
                                    color: "#92400E"
                                }
                            }

                            Rectangle {
                                width: poolPriText.contentWidth + 10
                                height: 22
                                radius: 4
                                color: modelData.priority === "Critical" ? "#FEE2E2" : "#FEF3C7"
                                Text {
                                    id: poolPriText
                                    anchors.centerIn: parent
                                    text: modelData.priority
                                    font.bold: true
                                    font.pixelSize: 10
                                    color: modelData.priority === "Critical" ? "#DC2626" : "#D97706"
                                }
                            }

                            Rectangle {
                                width: poolCatText.contentWidth + 10
                                height: 22
                                radius: 4
                                color: "#F1F5F9"
                                Text {
                                    id: poolCatText
                                    anchors.centerIn: parent
                                    text: modelData.category
                                    font.pixelSize: 10
                                    color: "#475569"
                                }
                            }

                            Item { Layout.fillWidth: true }

                            Text {
                                text: modelData.createdAt
                                font.pixelSize: 11
                                color: "#94A3B8"
                            }
                        }

                        Text {
                            Layout.fillWidth: true
                            text: modelData.title
                            font.bold: true
                            font.pixelSize: 14
                            color: "#0F172A"
                            wrapMode: Text.WordWrap
                        }

                        Text {
                            Layout.fillWidth: true
                            text: modelData.description
                            font.pixelSize: 12
                            color: "#475569"
                            wrapMode: Text.WordWrap
                        }

                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 8

                            Text {
                                text: "🖥️ " + modelData.systemCode + " (" + modelData.assetCode + ") • 🏫 " + modelData.school
                                font.pixelSize: 11
                                color: "#64748B"
                            }

                            Item { Layout.fillWidth: true }

                            Button {
                                text: "⚡ Accept & Claim Job"
                                onClicked: {
                                    appCtrl.claimJob(modelData.number);
                                    jobRoot.activeTab = "my_jobs";
                                }
                                contentItem: Text {
                                    text: parent.text
                                    color: "#FFFFFF"
                                    font.bold: true
                                    font.pixelSize: 12
                                }
                                background: Rectangle {
                                    color: "#16A34A"
                                    radius: 6
                                }
                            }
                        }
                    }
                }
            }
        }

        // ================= 4. MY ACTIVE JOBS CONTENT =================
        ColumnLayout {
            Layout.fillWidth: true
            spacing: 12
            visible: jobRoot.activeTab === "my_jobs"

            // Empty state
            Rectangle {
                Layout.fillWidth: true
                implicitHeight: 140
                radius: 8
                color: "#FFFFFF"
                border.color: "#E2E8F0"
                visible: appCtrl.technicianTickets.length === 0

                ColumnLayout {
                    anchors.centerIn: parent
                    spacing: 8
                    Text {
                        Layout.alignment: Qt.AlignHCenter
                        text: "📋"
                        font.pixelSize: 32
                    }
                    Text {
                        Layout.alignment: Qt.AlignHCenter
                        text: "No Active Jobs Assigned"
                        font.bold: true
                        font.pixelSize: 15
                        color: "#1E293B"
                    }
                    Text {
                        Layout.alignment: Qt.AlignHCenter
                        text: "Tap 'Open Issues Pool' above to claim pending service tickets."
                        font.pixelSize: 12
                        color: "#64748B"
                    }
                    Button {
                        Layout.alignment: Qt.AlignHCenter
                        text: "Browse Open Issues Pool"
                        onClicked: jobRoot.activeTab = "open_pool"
                        contentItem: Text {
                            text: parent.text
                            color: "#FFFFFF"
                            font.bold: true
                            font.pixelSize: 12
                        }
                        background: Rectangle {
                            color: "#0F2942"
                            radius: 6
                        }
                    }
                }
            }

            // Ticket Switcher Pills if technician has multiple tickets
            RowLayout {
                Layout.fillWidth: true
                spacing: 8
                visible: appCtrl.technicianTickets.length > 1

                Text {
                    text: "Assigned Work:"
                    font.bold: true
                    font.pixelSize: 12
                    color: "#475569"
                }

                Repeater {
                    model: appCtrl.technicianTickets

                    delegate: Rectangle {
                        required property var modelData
                        width: pillRow.implicitWidth + 16
                        height: 28
                        radius: 14
                        color: appCtrl.selectedTicket.number === modelData.number ? "#0F2942" : "#F1F5F9"
                        border.color: appCtrl.selectedTicket.number === modelData.number ? "#0F2942" : "#CBD5E1"

                        RowLayout {
                            id: pillRow
                            anchors.centerIn: parent
                            spacing: 4
                            Text {
                                text: modelData.number + " (" + modelData.systemCode + ")"
                                font.pixelSize: 11
                                font.bold: appCtrl.selectedTicket.number === modelData.number
                                color: appCtrl.selectedTicket.number === modelData.number ? "#FFFFFF" : "#334155"
                            }
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: appCtrl.selectTicket(modelData.number)
                        }
                    }
                }
            }

            // Active Job Header Card
            Rectangle {
                Layout.fillWidth: true
                implicitHeight: headerCol.implicitHeight + (jobRoot.isMobile ? 24 : 32)
                color: "#0F2942"
                radius: 8
                visible: appCtrl.technicianTickets.length > 0

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

                        // Release / Decline Button
                        Button {
                            text: "🔄 Release / Decline"
                            onClicked: jobRoot.showReleaseDialog = true
                            contentItem: Text {
                                text: parent.text
                                color: "#FCA5A5"
                                font.bold: true
                                font.pixelSize: 11
                            }
                            background: Rectangle {
                                color: "#450A0A"
                                border.color: "#DC2626"
                                radius: 6
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
                                text: (appCtrl.selectedTicket.status ? appCtrl.selectedTicket.status : "IN PROGRESS").toUpperCase()
                                color: "#FFFFFF"
                                font.bold: true
                                font.pixelSize: 10
                            }
                        }
                    }

                    Text {
                        Layout.fillWidth: true
                        text: "Issue: " + (appCtrl.selectedTicket.title ? appCtrl.selectedTicket.title : "")
                        font.pixelSize: 12
                        color: "#E2E8F0"
                        wrapMode: Text.WordWrap
                    }
                }
            }

            // Release Job Dialog Card (Inline when showReleaseDialog is true)
            Rectangle {
                Layout.fillWidth: true
                implicitHeight: releaseCol.implicitHeight + 24
                radius: 8
                color: "#FEF2F2"
                border.color: "#F87171"
                border.width: 1.5
                visible: jobRoot.showReleaseDialog && appCtrl.technicianTickets.length > 0

                ColumnLayout {
                    id: releaseCol
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 10

                    Text {
                        text: "⚠️ Release Job Back to Open Pool?"
                        font.bold: true
                        font.pixelSize: 14
                        color: "#991B1B"
                    }

                    Text {
                        text: "If you cannot complete this repair, provide a note so another field engineer can take over seamlessly:"
                        font.pixelSize: 11
                        color: "#7F1D1D"
                    }

                    TextField {
                        id: releaseReasonInput
                        Layout.fillWidth: true
                        placeholderText: "e.g. Awaiting Dell replacement motherboard, shift ended..."
                    }

                    RowLayout {
                        Layout.fillWidth: true
                        spacing: 8

                        Button {
                            text: "Cancel"
                            onClicked: jobRoot.showReleaseDialog = false
                            contentItem: Text {
                                text: parent.text
                                color: "#475569"
                                font.bold: true
                                font.pixelSize: 11
                            }
                            background: Rectangle {
                                color: "#E2E8F0"
                                radius: 4
                            }
                        }

                        Item { Layout.fillWidth: true }

                        Button {
                            text: "Confirm Release to Pool"
                            onClicked: {
                                appCtrl.releaseJob(appCtrl.selectedTicket.number, releaseReasonInput.text);
                                releaseReasonInput.text = "";
                                jobRoot.showReleaseDialog = false;
                                jobRoot.activeTab = "open_pool";
                            }
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
                }
            }

            // Quality & Diagnostic Checklist Card
            Rectangle {
                Layout.fillWidth: true
                implicitHeight: checklistCol.implicitHeight + (jobRoot.isMobile ? 24 : 36)
                color: "#FFFFFF"
                radius: 8
                border.color: "#E2E8F0"
                visible: appCtrl.technicianTickets.length > 0

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

                    // Resolution Action Button
                    Button {
                        Layout.fillWidth: true
                        height: 44
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
            }
        }

        Item { height: 16 }
    }
}
