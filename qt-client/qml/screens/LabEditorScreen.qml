import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

Item {
    id: editorRoot

    readonly property bool isCompact: editorRoot.width < 850
    property int selectedIndex: -1
    property var selectedPC: selectedIndex >= 0 && selectedIndex < appCtrl.workstations.length ? appCtrl.workstations[selectedIndex] : null
    property int snapGridSize: 20
    property bool snapEnabled: true
    property real canvasScale: editorRoot.isCompact ? 0.75 : 1.0
    property string statusToast: ""

    Timer {
        id: toastTimer
        interval: 3000
        onTriggered: editorRoot.statusToast = ""
    }

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: editorRoot.isCompact ? 8 : 16
        spacing: 10

        // ================= TOP CONTROL TOOLBAR =================
        Rectangle {
            Layout.fillWidth: true
            implicitHeight: toolbarCol.implicitHeight + 16
            color: "#FFFFFF"
            radius: 8
            border.color: "#E2E8F0"

            ColumnLayout {
                id: toolbarCol
                anchors.fill: parent
                anchors.margins: 10
                spacing: 8

                RowLayout {
                    Layout.fillWidth: true
                    spacing: 8

                    ColumnLayout {
                        spacing: 1
                        Text {
                            text: "2D Lab Layout Designer"
                            font.bold: true
                            font.pixelSize: editorRoot.isCompact ? 13 : 15
                            color: "#0F172A"
                        }
                        Text {
                            text: appCtrl.workstations.length + " Workstations Configured"
                            font.pixelSize: 10
                            color: "#64748B"
                        }
                    }

                    Item { Layout.fillWidth: true }

                    Button {
                        text: "← Back to Live Map"
                        onClicked: appCtrl.currentScreen = "lab_map"
                        contentItem: Text {
                            text: parent.text
                            color: "#0F2942"
                            font.bold: true
                            font.pixelSize: 11
                        }
                        background: Rectangle {
                            color: "#F1F5F9"
                            border.color: "#CBD5E1"
                            radius: 4
                        }
                    }

                    Button {
                        text: "+ Add PC"
                        onClicked: {
                            var nextNum = appCtrl.workstations.length + 1;
                            newCodeInput.text = "PC-" + (nextNum < 10 ? "0" + nextNum : nextNum);
                            newAssetInput.text = "VMHS-PC-" + (nextNum < 10 ? "00" + nextNum : (nextNum < 100 ? "0" + nextNum : nextNum));
                            addDialog.open();
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

                    Button {
                        text: "✓ Save Layout"
                        onClicked: {
                            editorRoot.statusToast = "Layout saved and synced to Live 2D Lab Map!";
                            toastTimer.restart();
                        }
                        contentItem: Text {
                            text: parent.text
                            color: "#FFFFFF"
                            font.bold: true
                            font.pixelSize: 11
                        }
                        background: Rectangle {
                            color: "#16A34A"
                            radius: 4
                        }
                    }
                }

                // Snap and Zoom Row
                RowLayout {
                    Layout.fillWidth: true
                    spacing: 6

                    Rectangle {
                        width: snapText.contentWidth + 14
                        height: 28
                        radius: 4
                        color: editorRoot.snapEnabled ? "#EFF6FF" : "#F1F5F9"
                        border.color: editorRoot.snapEnabled ? "#3B82F6" : "#CBD5E1"
                        Text {
                            id: snapText
                            anchors.centerIn: parent
                            text: editorRoot.snapEnabled ? "🧲 Snap: " + editorRoot.snapGridSize + "px" : "Snap: OFF"
                            font.pixelSize: 10
                            font.bold: true
                            color: editorRoot.snapEnabled ? "#1E40AF" : "#64748B"
                        }
                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: {
                                if (!editorRoot.snapEnabled) {
                                    editorRoot.snapEnabled = true;
                                    editorRoot.snapGridSize = 20;
                                } else if (editorRoot.snapGridSize === 20) {
                                    editorRoot.snapGridSize = 40;
                                } else {
                                    editorRoot.snapEnabled = false;
                                }
                            }
                        }
                    }

                    Item { Layout.fillWidth: true }

                    RowLayout {
                        spacing: 2
                        Button {
                            text: "－"
                            width: 26; height: 28
                            onClicked: if (editorRoot.canvasScale > 0.5) editorRoot.canvasScale -= 0.1
                        }
                        Button {
                            text: "＋"
                            width: 26; height: 28
                            onClicked: if (editorRoot.canvasScale < 1.6) editorRoot.canvasScale += 0.1
                        }
                    }
                }
            }
        }

        // Status Toast
        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 32
            visible: editorRoot.statusToast !== ""
            color: "#DCFCE7"
            radius: 6
            border.color: "#86EFAC"

            RowLayout {
                anchors.centerIn: parent
                spacing: 6
                Text { text: "✅"; font.pixelSize: 12 }
                Text {
                    text: editorRoot.statusToast
                    font.pixelSize: 11
                    font.bold: true
                    color: "#166534"
                }
            }
        }

        // Main Layout (Side-by-side on desktop, stacked on mobile)
        GridLayout {
            Layout.fillWidth: true
            Layout.fillHeight: true
            columns: editorRoot.isCompact ? 1 : 2
            rowSpacing: 10
            columnSpacing: 10

            // Canvas Area
            Rectangle {
                Layout.fillWidth: true
                Layout.fillHeight: true
                color: "#F8FAFC"
                radius: 8
                border.color: "#CBD5E1"
                clip: true

                Flickable {
                    id: canvasFlickable
                    anchors.fill: parent
                    contentWidth: Math.max(width, 1100 * editorRoot.canvasScale)
                    contentHeight: Math.max(height, 650 * editorRoot.canvasScale)

                    Item {
                        id: canvasContainer
                        width: 1100
                        height: 650
                        scale: editorRoot.canvasScale
                        transformOrigin: Item.TopLeft

                        // Grid
                        Repeater {
                            model: 28
                            Rectangle {
                                x: index * 40
                                y: 0
                                width: 1
                                height: 650
                                color: (index % 2 === 0) ? "#E2E8F0" : "#F1F5F9"
                            }
                        }
                        Repeater {
                            model: 17
                            Rectangle {
                                x: 0
                                y: index * 40
                                width: 1100
                                height: 1
                                color: (index % 2 === 0) ? "#E2E8F0" : "#F1F5F9"
                            }
                        }

                        // Entrance Door
                        Rectangle {
                            x: 20; y: 20
                            width: 110; height: 32
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

                        // Draggable Podium
                        Rectangle {
                            id: podiumRect
                            x: appCtrl.podiumPosition.x ? appCtrl.podiumPosition.x : 350
                            y: appCtrl.podiumPosition.y ? appCtrl.podiumPosition.y : 16
                            width: 320; height: 40
                            radius: 6
                            color: "#1E293B"
                            border.color: podiumDragArea.drag.active ? "#38BDF8" : "#475569"
                            border.width: podiumDragArea.drag.active ? 2 : 1

                            RowLayout {
                                anchors.centerIn: parent
                                spacing: 8
                                Text { text: "📽️"; font.pixelSize: 14 }
                                Text {
                                    text: "INSTRUCTOR PODIUM (DRAG TO REPOSITION)"
                                    font.bold: true
                                    font.pixelSize: 10
                                    color: "#F8FAFC"
                                }
                            }

                            MouseArea {
                                id: podiumDragArea
                                anchors.fill: parent
                                drag.target: podiumRect
                                drag.axis: Drag.XAndYAxis
                                cursorShape: Qt.SizeAllCursor
                                onReleased: {
                                    var snap = editorRoot.snapEnabled ? editorRoot.snapGridSize : 1;
                                    var snappedX = Math.round(podiumRect.x / snap) * snap;
                                    var snappedY = Math.round(podiumRect.y / snap) * snap;
                                    podiumRect.x = snappedX;
                                    podiumRect.y = snappedY;
                                    appCtrl.setPodiumPosition(snappedX, snappedY);
                                }
                            }
                        }

                        // Workstations
                        Repeater {
                            id: pcRepeater
                            model: appCtrl.workstations

                            delegate: Rectangle {
                                id: workstationNode
                                required property var modelData
                                required property int index

                                x: modelData.x ? modelData.x : 50
                                y: modelData.y ? modelData.y : 90
                                width: 80; height: 64
                                radius: 6

                                property bool isSelected: editorRoot.selectedIndex === index

                                color: {
                                    if (modelData.status === "issue") return "#FEF2F2";
                                    if (modelData.status === "service") return "#EFF6FF";
                                    if (modelData.status === "maintenance") return "#FFFBEB";
                                    if (modelData.status === "offline") return "#F1F5F9";
                                    return "#F0FDF4";
                                }

                                border.color: {
                                    if (isSelected) return "#2563EB";
                                    if (modelData.status === "issue") return "#EF4444";
                                    if (modelData.status === "service") return "#3B82F6";
                                    if (modelData.status === "maintenance") return "#F59E0B";
                                    if (modelData.status === "offline") return "#94A3B8";
                                    return "#22C55E";
                                }
                                border.width: isSelected ? 2 : 1

                                ColumnLayout {
                                    anchors.centerIn: parent
                                    spacing: 2

                                    Text { Layout.alignment: Qt.AlignHCenter; text: "🖥️"; font.pixelSize: 13 }
                                    Text { Layout.alignment: Qt.AlignHCenter; text: modelData.code; font.bold: true; font.pixelSize: 11; color: "#0F172A" }
                                    Text {
                                        Layout.alignment: Qt.AlignHCenter
                                        text: modelData.status.toUpperCase()
                                        font.pixelSize: 8; font.bold: true
                                        color: modelData.status === "issue" ? "#DC2626" : (modelData.status === "service" ? "#2563EB" : (modelData.status === "maintenance" ? "#D97706" : "#16A34A"))
                                    }
                                }

                                MouseArea {
                                    id: nodeDragArea
                                    anchors.fill: parent
                                    drag.target: workstationNode
                                    drag.axis: Drag.XAndYAxis
                                    cursorShape: Qt.SizeAllCursor

                                    onPressed: editorRoot.selectedIndex = index

                                    onReleased: {
                                        var snap = editorRoot.snapEnabled ? editorRoot.snapGridSize : 1;
                                        var snappedX = Math.round(workstationNode.x / snap) * snap;
                                        var snappedY = Math.round(workstationNode.y / snap) * snap;
                                        workstationNode.x = snappedX;
                                        workstationNode.y = snappedY;
                                        appCtrl.updateWorkstationPosition(modelData.code, snappedX, snappedY);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Inspector Panel
            Rectangle {
                Layout.preferredWidth: editorRoot.isCompact ? -1 : 260
                Layout.fillWidth: editorRoot.isCompact
                Layout.preferredHeight: editorRoot.isCompact ? 160 : -1
                Layout.fillHeight: !editorRoot.isCompact
                color: "#FFFFFF"
                radius: 8
                border.color: "#E2E8F0"

                ColumnLayout {
                    anchors.fill: parent
                    anchors.margins: 12
                    spacing: 8

                    Text {
                        text: "Node Inspector"
                        font.bold: true
                        font.pixelSize: 13
                        color: "#0F172A"
                    }

                    Rectangle { Layout.fillWidth: true; height: 1; color: "#E2E8F0" }

                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 6
                        visible: editorRoot.selectedPC !== null

                        RowLayout {
                            Layout.fillWidth: true
                            Text {
                                text: "SELECTED: " + (editorRoot.selectedPC ? editorRoot.selectedPC.code : "")
                                font.bold: true
                                font.pixelSize: 14
                                color: "#0F2942"
                            }
                            Item { Layout.fillWidth: true }
                            Button {
                                text: "🗑️ Delete"
                                onClicked: {
                                    if (editorRoot.selectedPC) {
                                        appCtrl.removeWorkstation(editorRoot.selectedPC.code);
                                        editorRoot.selectedIndex = -1;
                                    }
                                }
                            }
                        }

                        // Status pills
                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 4

                            Button {
                                Layout.fillWidth: true
                                text: "🟢 OK"
                                onClicked: if (editorRoot.selectedPC) appCtrl.updateWorkstationStatus(editorRoot.selectedPC.code, "working")
                            }
                            Button {
                                Layout.fillWidth: true
                                text: "🔴 Error"
                                onClicked: if (editorRoot.selectedPC) appCtrl.updateWorkstationStatus(editorRoot.selectedPC.code, "issue")
                            }
                            Button {
                                Layout.fillWidth: true
                                text: "🟡 Maint"
                                onClicked: if (editorRoot.selectedPC) appCtrl.updateWorkstationStatus(editorRoot.selectedPC.code, "maintenance")
                            }
                            Button {
                                Layout.fillWidth: true
                                text: "🔵 Service"
                                onClicked: if (editorRoot.selectedPC) appCtrl.updateWorkstationStatus(editorRoot.selectedPC.code, "service")
                            }
                        }
                    }

                    Text {
                        visible: editorRoot.selectedPC === null
                        text: "Select any PC node above to edit status or coordinates"
                        font.pixelSize: 11
                        color: "#94A3B8"
                    }

                    Item { Layout.fillHeight: true }
                }
            }
        }
    }

    // Add Workstation Dialog
    Dialog {
        id: addDialog
        anchors.centerIn: parent
        width: Math.min(parent.width - 32, 380)
        modal: true
        title: "Add Workstation Node"

        ColumnLayout {
            anchors.fill: parent
            spacing: 10

            Text { text: "System Code *"; font.pixelSize: 11; font.bold: true; color: "#334155" }
            TextField {
                id: newCodeInput
                Layout.fillWidth: true
                text: "PC-" + (appCtrl.workstations.length + 1)
            }

            Text { text: "Asset ID Tag *"; font.pixelSize: 11; font.bold: true; color: "#334155" }
            TextField {
                id: newAssetInput
                Layout.fillWidth: true
                text: "VMHS-PC-" + (appCtrl.workstations.length + 1)
            }

            Text { text: "Initial Status"; font.pixelSize: 11; font.bold: true; color: "#334155" }
            ComboBox {
                id: newStatusCombo
                Layout.fillWidth: true
                model: ["working", "maintenance", "issue", "service", "offline"]
            }

            RowLayout {
                Layout.fillWidth: true
                spacing: 8

                Button {
                    Layout.fillWidth: true
                    text: "Cancel"
                    onClicked: addDialog.close()
                }

                Button {
                    Layout.fillWidth: true
                    text: "Add to Canvas"
                    onClicked: {
                        var nextCol = (appCtrl.workstations.length % 10) + 1;
                        var nextRow = Math.floor(appCtrl.workstations.length / 10) + 1;
                        var initialX = 50 + (nextCol - 1) * 90;
                        var initialY = 92 + (nextRow - 1) * 130;

                        appCtrl.addWorkstation(newCodeInput.text, newAssetInput.text, initialX, initialY, nextRow, nextCol, newStatusCombo.currentText);
                        addDialog.close();
                        editorRoot.statusToast = "Added " + newCodeInput.text + " to layout canvas.";
                        toastTimer.restart();
                    }
                }
            }
        }
    }
}
