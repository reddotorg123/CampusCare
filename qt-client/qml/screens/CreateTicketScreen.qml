import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ScrollView {
    id: createRoot
    contentWidth: availableWidth
    clip: true

    readonly property bool isMobile: createRoot.width < 600

    ColumnLayout {
        width: Math.min(createRoot.width - (createRoot.isMobile ? 16 : 32), 700)
        anchors.horizontalCenter: parent.horizontalCenter
        spacing: 14

        Item { height: 8 }

        RowLayout {
            Layout.fillWidth: true
            Button {
                text: "← Cancel & Back"
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
        }

        // Validation Error Alert Banner
        Rectangle {
            Layout.fillWidth: true
            implicitHeight: 40
            visible: appCtrl.validationError !== ""
            color: "#FEF2F2"
            radius: 6
            border.color: "#FCA5A5"

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 12
                anchors.rightMargin: 12
                spacing: 8
                Text { text: "⚠️"; font.pixelSize: 14 }
                Text {
                    text: appCtrl.validationError
                    color: "#DC2626"
                    font.bold: true
                    font.pixelSize: 12
                }
            }
        }

        Rectangle {
            Layout.fillWidth: true
            implicitHeight: formCol.implicitHeight + (createRoot.isMobile ? 24 : 36)
            color: "#FFFFFF"
            radius: 8
            border.color: "#E2E8F0"

            ColumnLayout {
                id: formCol
                anchors.fill: parent
                anchors.margins: createRoot.isMobile ? 14 : 20
                spacing: 12

                Text {
                    text: "Log Maintenance Incident / Ticket"
                    font.bold: true
                    font.pixelSize: createRoot.isMobile ? 16 : 18
                    color: "#0F172A"
                }

                Text {
                    text: "School: " + appCtrl.currentUserSchoolName + " • " + appCtrl.currentLabName
                    font.pixelSize: 11
                    color: "#64748B"
                    wrapMode: Text.WordWrap
                    Layout.fillWidth: true
                }

                Rectangle { Layout.fillWidth: true; height: 1; color: "#E2E8F0" }

                // Target Workstation Selector
                ColumnLayout {
                    Layout.fillWidth: true
                    spacing: 4
                    Text { text: "Select Affected Workstation *"; font.pixelSize: 11; font.bold: true; color: "#334155" }

                    RowLayout {
                        Layout.fillWidth: true
                        spacing: 8

                        ComboBox {
                            id: pcCombo
                            Layout.preferredWidth: 160
                            model: {
                                var codes = [];
                                for (var i = 0; i < appCtrl.workstations.length; ++i) {
                                    codes.push(appCtrl.workstations[i].code);
                                }
                                return codes;
                            }
                            currentIndex: {
                                var curCode = appCtrl.selectedWorkstation.code;
                                for (var i = 0; i < appCtrl.workstations.length; ++i) {
                                    if (appCtrl.workstations[i].code === curCode) return i;
                                }
                                return 0;
                            }
                            onActivated: {
                                appCtrl.selectWorkstation(currentText);
                            }
                        }

                        Text {
                            text: "Asset Tag: " + appCtrl.selectedWorkstation.assetCode + " • " + appCtrl.selectedWorkstation.location
                            font.pixelSize: 11
                            color: "#64748B"
                            elide: Text.ElideRight
                            Layout.fillWidth: true
                        }
                    }
                }

                // Title
                ColumnLayout {
                    Layout.fillWidth: true
                    spacing: 4
                    Text { text: "Incident Title *"; font.pixelSize: 11; font.bold: true; color: "#334155" }
                    TextField {
                        id: titleInput
                        Layout.fillWidth: true
                        placeholderText: "e.g. Blue Screen crash on boot"
                        text: "System crashing repeatedly during lab batch sessions"
                    }
                }

                // Priority & Category (1 column on mobile, 2 columns on tablet/desktop)
                GridLayout {
                    Layout.fillWidth: true
                    columns: createRoot.width > 500 ? 2 : 1
                    rowSpacing: 10
                    columnSpacing: 12

                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 4
                        Text { text: "Priority Level *"; font.pixelSize: 11; font.bold: true; color: "#334155" }
                        ComboBox {
                            id: prioCombo
                            Layout.fillWidth: true
                            model: ["Critical", "High", "Medium", "Low"]
                            currentIndex: 0
                        }
                    }

                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 4
                        Text { text: "Category *"; font.pixelSize: 11; font.bold: true; color: "#334155" }
                        ComboBox {
                            id: catCombo
                            Layout.fillWidth: true
                            model: ["Hardware Crash", "Operating System", "RAM / Memory", "Network / LAN", "Peripherals"]
                            currentIndex: 0
                        }
                    }
                }

                // Description
                ColumnLayout {
                    Layout.fillWidth: true
                    spacing: 4
                    Text { text: "Detailed Problem Description *"; font.pixelSize: 11; font.bold: true; color: "#334155" }
                    TextArea {
                        id: descInput
                        Layout.fillWidth: true
                        Layout.preferredHeight: 90
                        placeholderText: "Describe symptoms, error codes..."
                        text: "Workstation displays BSOD DRIVER_IRQL_NOT_LESS_OR_EQUAL approximately 2 minutes after student login. Dell hardware diagnostics pass standard test."
                        wrapMode: Text.WordWrap
                    }
                }

                Rectangle { Layout.fillWidth: true; height: 1; color: "#E2E8F0" }

                // Submit Button
                Button {
                    Layout.fillWidth: true
                    height: 44
                    text: "Submit Incident & Dispatch Technician ➔"
                    onClicked: {
                        appCtrl.submitTicketWithValidation(titleInput.text, descInput.text, prioCombo.currentText, catCombo.currentText);
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
                        color: "#DC2626"
                        radius: 6
                    }
                }
            }
        }

        Item { height: 16 }
    }
}
