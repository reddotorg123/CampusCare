import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

Item {
    id: labMapRoot

    readonly property bool isMobile: labMapRoot.width < 640
    property real zoomScale: labMapRoot.isMobile ? 0.8 : 1.0

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: labMapRoot.isMobile ? 8 : 16
        spacing: 10

        // Top Control & Legend Bar
        Rectangle {
            Layout.fillWidth: true
            implicitHeight: headerBarCol.implicitHeight + (labMapRoot.isMobile ? 16 : 20)
            color: "#FFFFFF"
            radius: 8
            border.color: "#E2E8F0"

            ColumnLayout {
                id: headerBarCol
                anchors.fill: parent
                anchors.margins: labMapRoot.isMobile ? 10 : 12
                spacing: 8

                RowLayout {
                    Layout.fillWidth: true
                    spacing: 8

                    ComboBox {
                        id: labPicker
                        Layout.preferredWidth: labMapRoot.isMobile ? 190 : 270
                        model: appCtrl.availableLabs
                        currentIndex: {
                            for (var i = 0; i < appCtrl.availableLabs.length; ++i) {
                                if (appCtrl.availableLabs[i] === appCtrl.currentLabName) return i;
                            }
                            return 0;
                        }
                        onActivated: {
                            appCtrl.selectLab(currentText);
                        }
                    }

                    Text {
                        text: appCtrl.workstations.length + " PCs"
                        font.pixelSize: 11
                        font.bold: true
                        color: "#64748B"
                        visible: !labMapRoot.isMobile
                    }

                    Item { Layout.fillWidth: true }

                    // Org Admin Layout Customizer Button
                    Button {
                        visible: appCtrl.currentRole === "org_admin"
                        text: labMapRoot.isMobile ? "📐 Edit" : "📐 Customize Layout"
                        onClicked: appCtrl.currentScreen = "lab_editor"
                        contentItem: Text {
                            text: parent.text
                            color: "#0F2942"
                            font.bold: true
                            font.pixelSize: 11
                        }
                        background: Rectangle {
                            color: "#EFF6FF"
                            border.color: "#BFDBFE"
                            radius: 4
                        }
                    }

                    // Zoom controls
                    RowLayout {
                        spacing: 2
                        Button {
                            text: "－"
                            width: 28; height: 28
                            onClicked: if (labMapRoot.zoomScale > 0.5) labMapRoot.zoomScale -= 0.1
                        }
                        Text {
                            text: Math.round(labMapRoot.zoomScale * 100) + "%"
                            font.pixelSize: 10
                            font.bold: true
                            color: "#334155"
                        }
                        Button {
                            text: "＋"
                            width: 28; height: 28
                            onClicked: if (labMapRoot.zoomScale < 1.6) labMapRoot.zoomScale += 0.1
                        }
                    }
                }

                // Compact Legend
                Flow {
                    Layout.fillWidth: true
                    spacing: 8

                    RowLayout {
                        spacing: 4
                        Rectangle { width: 8; height: 8; radius: 4; color: "#16A34A" }
                        Text { text: "Working (" + (appCtrl.stats.working ? appCtrl.stats.working : 24) + ")"; font.pixelSize: 10; color: "#334155" }
                    }
                    RowLayout {
                        spacing: 4
                        Rectangle { width: 8; height: 8; radius: 4; color: "#DC2626" }
                        Text { text: "Issue (" + (appCtrl.stats.issues ? appCtrl.stats.issues : 2) + ")"; font.pixelSize: 10; color: "#DC2626"; font.bold: true }
                    }
                    RowLayout {
                        spacing: 4
                        Rectangle { width: 8; height: 8; radius: 4; color: "#D97706" }
                        Text { text: "Maintenance (" + (appCtrl.stats.maintenance ? appCtrl.stats.maintenance : 2) + ")"; font.pixelSize: 10; color: "#334155" }
                    }
                    RowLayout {
                        spacing: 4
                        Rectangle { width: 8; height: 8; radius: 4; color: "#2563EB" }
                        Text { text: "Under Service"; font.pixelSize: 10; color: "#334155" }
                    }
                    RowLayout {
                        spacing: 4
                        Rectangle { width: 8; height: 8; radius: 4; color: "#64748B" }
                        Text { text: "Offline"; font.pixelSize: 10; color: "#334155" }
                    }
                }
            }
        }

        // 2D Map Canvas Area
        Rectangle {
            Layout.fillWidth: true
            Layout.fillHeight: true
            color: "#F1F5F9"
            radius: 8
            border.color: "#CBD5E1"
            clip: true

            Flickable {
                id: mapFlickable
                anchors.fill: parent
                contentWidth: Math.max(width, 1100 * labMapRoot.zoomScale)
                contentHeight: Math.max(height, 650 * labMapRoot.zoomScale)
                boundsBehavior: Flickable.StopAtBounds

                Item {
                    id: canvasContent
                    width: 1100
                    height: 650
                    scale: labMapRoot.zoomScale
                    transformOrigin: Item.TopLeft

                    // Teacher / Instructor Podium
                    Rectangle {
                        x: appCtrl.podiumPosition.x ? appCtrl.podiumPosition.x : 350
                        y: appCtrl.podiumPosition.y ? appCtrl.podiumPosition.y : 16
                        width: 320
                        height: 40
                        color: "#1E293B"
                        radius: 6
                        RowLayout {
                            anchors.centerIn: parent
                            spacing: 8
                            Text { text: "📽️"; font.pixelSize: 14 }
                            Text {
                                text: "INSTRUCTOR PODIUM & PROJECTOR"
                                font.bold: true
                                font.pixelSize: 11
                                color: "#F8FAFC"
                            }
                        }
                    }

                    // Entrance Indicator
                    Rectangle {
                        x: 20
                        y: 20
                        width: 110
                        height: 32
                        radius: 4
                        color: "#E2E8F0"
                        border.color: "#94A3B8"
                        RowLayout {
                            anchors.centerIn: parent
                            spacing: 6
                            Text { text: "🚪"; font.pixelSize: 12 }
                            Text { text: "LAB ENTRANCE"; font.pixelSize: 10; font.bold: true; color: "#475569" }
                        }
                    }

                    // Workstation Nodes
                    Repeater {
                        model: appCtrl.workstations

                        delegate: Rectangle {
                            required property var modelData

                            x: modelData.x ? modelData.x : (50 + (modelData.col - 1) * 90)
                            y: modelData.y ? modelData.y : (92 + (modelData.row - 1) * 130)
                            width: 80
                            height: 64
                            radius: 6

                            property bool isFaulty: modelData.status === "issue"

                            color: {
                                if (modelData.status === "issue") return "#FEF2F2";
                                if (modelData.status === "service") return "#EFF6FF";
                                if (modelData.status === "maintenance") return "#FFFBEB";
                                if (modelData.status === "offline") return "#F1F5F9";
                                return "#F0FDF4";
                            }

                            border.color: {
                                if (modelData.status === "issue") return "#DC2626";
                                if (modelData.status === "service") return "#3B82F6";
                                if (modelData.status === "maintenance") return "#F59E0B";
                                if (modelData.status === "offline") return "#94A3B8";
                                return "#22C55E";
                            }
                            border.width: (isFaulty && appCtrl.currentRole === "technician") ? 3 : (appCtrl.selectedWorkstation.code === modelData.code ? 2 : 1)

                            ColumnLayout {
                                anchors.centerIn: parent
                                spacing: 2

                                Text {
                                    Layout.alignment: Qt.AlignHCenter
                                    text: "🖥️"
                                    font.pixelSize: 13
                                }

                                Text {
                                    Layout.alignment: Qt.AlignHCenter
                                    text: modelData.code
                                    font.bold: true
                                    font.pixelSize: 11
                                    color: "#0F172A"
                                }

                                Text {
                                    Layout.alignment: Qt.AlignHCenter
                                    text: modelData.activeTicket ? modelData.activeTicket : (modelData.status.toUpperCase())
                                    font.pixelSize: 8
                                    font.bold: true
                                    color: {
                                        if (modelData.status === "issue") return "#DC2626";
                                        if (modelData.status === "service") return "#2563EB";
                                        if (modelData.status === "maintenance") return "#D97706";
                                        if (modelData.status === "offline") return "#64748B";
                                        return "#16A34A";
                                    }
                                }
                            }

                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: {
                                    appCtrl.selectWorkstation(modelData.code);
                                    if (modelData.activeTicket) {
                                        appCtrl.selectTicket(modelData.activeTicket);
                                    }

                                    if (appCtrl.currentRole === "technician" && isFaulty) {
                                        appCtrl.currentScreen = "technician_job";
                                    } else {
                                        appCtrl.currentScreen = "system_details";
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
