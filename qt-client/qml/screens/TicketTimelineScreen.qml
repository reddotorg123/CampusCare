import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ScrollView {
    id: timeRoot
    contentWidth: availableWidth
    clip: true

    ColumnLayout {
        width: Math.min(timeRoot.width - 32, 900)
        anchors.horizontalCenter: parent.horizontalCenter
        spacing: 16

        Item { height: 8 }

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
        }

        // Timeline Container Card
        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: timelineCol.implicitHeight + 36
            color: "#FFFFFF"
            radius: 8
            border.color: "#E2E8F0"

            ColumnLayout {
                id: timelineCol
                anchors.fill: parent
                anchors.margins: 16
                spacing: 14

                Text {
                    text: "Audit Timeline & Discussion Stream • " + appCtrl.selectedTicket.number
                    font.bold: true
                    font.pixelSize: 15
                    color: "#0F172A"
                }

                Rectangle { Layout.fillWidth: true; height: 1; color: "#E2E8F0" }

                Repeater {
                    model: appCtrl.timeline

                    delegate: RowLayout {
                        required property var modelData
                        Layout.fillWidth: true
                        spacing: 12

                        Rectangle {
                            width: 36
                            height: 36
                            radius: 18
                            color: modelData.role === "Technician" ? "#EFF6FF" : (modelData.role === "Lab Staff" ? "#FEF2F2" : "#F1F5F9")
                            Text {
                                anchors.centerIn: parent
                                text: modelData.role === "Technician" ? "🔧" : (modelData.role === "Lab Staff" ? "👤" : "⚙️")
                                font.pixelSize: 14
                            }
                        }

                        ColumnLayout {
                            Layout.fillWidth: true
                            spacing: 2
                            RowLayout {
                                spacing: 8
                                Text { text: modelData.author; font.bold: true; font.pixelSize: 12; color: "#0F172A" }
                                Text { text: "• " + modelData.role; font.pixelSize: 11; color: "#64748B" }
                                Text { text: "• " + modelData.time; font.pixelSize: 11; color: "#94A3B8" }
                            }
                            Text {
                                text: modelData.action
                                font.pixelSize: 13
                                color: "#334155"
                                wrapMode: Text.WordWrap
                                Layout.fillWidth: true
                            }
                        }
                    }
                }

                Rectangle { Layout.fillWidth: true; height: 1; color: "#E2E8F0" }

                // Message Input Row
                RowLayout {
                    Layout.fillWidth: true
                    spacing: 8

                    TextField {
                        id: msgInput
                        Layout.fillWidth: true
                        placeholderText: "Type update or remark as " + (appCtrl.currentRole === "technician" ? "Technician" : "Staff") + "..."
                        onAccepted: {
                            if (text.trim().length > 0) {
                                appCtrl.addTimelineMessage(text.trim());
                                text = "";
                            }
                        }
                    }

                    Button {
                        text: "Post Remark"
                        onClicked: {
                            if (msgInput.text.trim().length > 0) {
                                appCtrl.addTimelineMessage(msgInput.text.trim());
                                msgInput.text = "";
                            }
                        }
                        contentItem: Text {
                            text: parent.text
                            color: "#FFFFFF"
                            font.bold: true
                            font.pixelSize: 12
                        }
                        background: Rectangle {
                            color: "#0F2942"
                            radius: 4
                        }
                    }
                }
            }
        }

        Item { height: 16 }
    }
}
