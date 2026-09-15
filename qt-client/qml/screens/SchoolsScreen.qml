import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ScrollView {
    id: schoolsRoot
    contentWidth: availableWidth
    clip: true

    readonly property bool isMobile: schoolsRoot.width < 600

    ColumnLayout {
        width: Math.min(schoolsRoot.width - (schoolsRoot.isMobile ? 16 : 32), 950)
        anchors.horizontalCenter: parent.horizontalCenter
        spacing: 14

        Item { height: 8 }

        RowLayout {
            Layout.fillWidth: true
            Text {
                text: "Client Institutions (AMC Contracts)"
                font.bold: true
                font.pixelSize: schoolsRoot.isMobile ? 16 : 18
                color: "#0F172A"
            }
            Item { Layout.fillWidth: true }
            Text {
                text: "3 Active"
                font.pixelSize: 11
                font.bold: true
                color: "#16A34A"
            }
        }

        Repeater {
            model: appCtrl.schools

            delegate: Rectangle {
                required property var modelData
                Layout.fillWidth: true
                implicitHeight: cardCol.implicitHeight + (schoolsRoot.isMobile ? 20 : 28)
                color: "#FFFFFF"
                radius: 8
                border.color: "#E2E8F0"

                ColumnLayout {
                    id: cardCol
                    anchors.fill: parent
                    anchors.margins: schoolsRoot.isMobile ? 12 : 16
                    spacing: 10

                    RowLayout {
                        Layout.fillWidth: true
                        spacing: 12

                        Rectangle {
                            width: schoolsRoot.isMobile ? 42 : 52
                            height: schoolsRoot.isMobile ? 42 : 52
                            radius: 8
                            color: "#EFF6FF"
                            Text {
                                anchors.centerIn: parent
                                text: "🏫"
                                font.pixelSize: schoolsRoot.isMobile ? 20 : 26
                            }
                        }

                        ColumnLayout {
                            Layout.fillWidth: true
                            spacing: 3

                            RowLayout {
                                spacing: 8
                                Text {
                                    text: modelData.name
                                    font.bold: true
                                    font.pixelSize: schoolsRoot.isMobile ? 13 : 15
                                    color: "#0F172A"
                                    wrapMode: Text.WordWrap
                                    Layout.fillWidth: true
                                }
                                Rectangle {
                                    width: 48
                                    height: 18
                                    radius: 3
                                    color: "#DCFCE7"
                                    Text {
                                        anchors.centerIn: parent
                                        text: "ACTIVE"
                                        color: "#166534"
                                        font.pixelSize: 8
                                        font.bold: true
                                    }
                                }
                            }

                            Text {
                                text: modelData.location + " • " + modelData.code
                                font.pixelSize: 11
                                color: "#64748B"
                            }

                            Text {
                                text: modelData.labsCount + " Labs • " + modelData.systemsCount + " Systems • Expiry: " + modelData.amcExpiry
                                font.pixelSize: 10
                                color: "#475569"
                            }
                        }
                    }

                    // Actions row (stacked on mobile)
                    RowLayout {
                        Layout.fillWidth: true
                        spacing: 10

                        Text {
                            text: modelData.activeTickets + " Active Tickets"
                            font.pixelSize: 11
                            font.bold: true
                            color: modelData.activeTickets > 0 ? "#DC2626" : "#16A34A"
                        }

                        Item { Layout.fillWidth: true }

                        Button {
                            text: "Open Lab Map ➔"
                            onClicked: {
                                appCtrl.selectSchool(modelData.id);
                                appCtrl.currentScreen = "lab_map";
                            }
                            contentItem: Text {
                                text: parent.text
                                color: "#FFFFFF"
                                font.bold: true
                                font.pixelSize: 11
                            }
                            background: Rectangle {
                                color: "#0F2942"
                                radius: 4
                            }
                        }
                    }
                }
            }
        }

        Item { height: 16 }
    }
}
