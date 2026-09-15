import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

Rectangle {
    id: loginRoot
    color: "#0B192C"

    // Background decorative elements
    Rectangle {
        x: -100; y: -100
        width: 400; height: 400
        radius: 200
        color: "#1E3E62"
        opacity: 0.15
    }
    Rectangle {
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        anchors.margins: -100
        width: 500; height: 500
        radius: 250
        color: "#000000"
        opacity: 0.3
    }

    property string selectedRole: "school_admin"

    ScrollView {
        anchors.fill: parent
        contentWidth: availableWidth
        clip: true

        ColumnLayout {
            width: Math.min(loginRoot.width - 32, 480)
            anchors.centerIn: parent
            spacing: 16

            Item { height: 16 }

            // Card Container
            Rectangle {
                Layout.fillWidth: true
                implicitHeight: cardCol.implicitHeight + 48
                radius: 12
                color: "#FFFFFF"
                border.color: "#E2E8F0"

                ColumnLayout {
                    id: cardCol
                    anchors.fill: parent
                    anchors.margins: 28
                    spacing: 18

                    // Header
                    ColumnLayout {
                        Layout.alignment: Qt.AlignHCenter
                        spacing: 6

                        Rectangle {
                            Layout.alignment: Qt.AlignHCenter
                            width: 56
                            height: 56
                            radius: 12
                            color: "#0F2942"
                            Text {
                                anchors.centerIn: parent
                                text: "CC"
                                font.bold: true
                                font.pixelSize: 22
                                color: "#FFFFFF"
                            }
                        }

                        Text {
                            Layout.alignment: Qt.AlignHCenter
                            text: "CampusCare Portal"
                            font.bold: true
                            font.pixelSize: 22
                            color: "#0F172A"
                        }

                        Text {
                            Layout.alignment: Qt.AlignHCenter
                            text: "IT Asset, AMC & Physical Lab Management"
                            font.pixelSize: 12
                            color: "#64748B"
                        }
                    }

                    Rectangle { Layout.fillWidth: true; height: 1; color: "#E2E8F0" }

                    // Role Picker Tabs
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 6

                        Text {
                            text: "SELECT USER CATEGORY / ROLE *"
                            font.pixelSize: 11
                            font.bold: true
                            color: "#475569"
                        }

                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 6

                            // School Admin
                            Rectangle {
                                Layout.fillWidth: true
                                height: 50
                                radius: 6
                                color: loginRoot.selectedRole === "school_admin" ? "#EFF6FF" : "#F8FAFC"
                                border.color: loginRoot.selectedRole === "school_admin" ? "#2563EB" : "#CBD5E1"
                                border.width: loginRoot.selectedRole === "school_admin" ? 2 : 1

                                ColumnLayout {
                                    anchors.centerIn: parent
                                    spacing: 2
                                    Text {
                                        Layout.alignment: Qt.AlignHCenter
                                        text: "🏫 School Staff"
                                        font.pixelSize: 12
                                        font.bold: loginRoot.selectedRole === "school_admin"
                                        color: loginRoot.selectedRole === "school_admin" ? "#1E40AF" : "#334155"
                                    }
                                    Text {
                                        Layout.alignment: Qt.AlignHCenter
                                        text: "Raise & Track"
                                        font.pixelSize: 9
                                        color: "#64748B"
                                    }
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: {
                                        loginRoot.selectedRole = "school_admin";
                                        emailField.text = "principal@velammal.edu.in";
                                    }
                                }
                            }

                            // Technician
                            Rectangle {
                                Layout.fillWidth: true
                                height: 50
                                radius: 6
                                color: loginRoot.selectedRole === "technician" ? "#FEF3C7" : "#F8FAFC"
                                border.color: loginRoot.selectedRole === "technician" ? "#D97706" : "#CBD5E1"
                                border.width: loginRoot.selectedRole === "technician" ? 2 : 1

                                ColumnLayout {
                                    anchors.centerIn: parent
                                    spacing: 2
                                    Text {
                                        Layout.alignment: Qt.AlignHCenter
                                        text: "🛠️ Technician"
                                        font.pixelSize: 12
                                        font.bold: loginRoot.selectedRole === "technician"
                                        color: loginRoot.selectedRole === "technician" ? "#92400E" : "#334155"
                                    }
                                    Text {
                                        Layout.alignment: Qt.AlignHCenter
                                        text: "Diagnose Jobs"
                                        font.pixelSize: 9
                                        color: "#64748B"
                                    }
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: {
                                        loginRoot.selectedRole = "technician";
                                        emailField.text = "rajesh.kumar@amcservice.com";
                                    }
                                }
                            }

                            // Org Admin
                            Rectangle {
                                Layout.fillWidth: true
                                height: 50
                                radius: 6
                                color: loginRoot.selectedRole === "org_admin" ? "#EDE9FE" : "#F8FAFC"
                                border.color: loginRoot.selectedRole === "org_admin" ? "#7C3AED" : "#CBD5E1"
                                border.width: loginRoot.selectedRole === "org_admin" ? 2 : 1

                                ColumnLayout {
                                    anchors.centerIn: parent
                                    spacing: 2
                                    Text {
                                        Layout.alignment: Qt.AlignHCenter
                                        text: "👑 Org Admin"
                                        font.pixelSize: 12
                                        font.bold: loginRoot.selectedRole === "org_admin"
                                        color: loginRoot.selectedRole === "org_admin" ? "#5B21B6" : "#334155"
                                    }
                                    Text {
                                        Layout.alignment: Qt.AlignHCenter
                                        text: "Full System"
                                        font.pixelSize: 9
                                        color: "#64748B"
                                    }
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: {
                                        loginRoot.selectedRole = "org_admin";
                                        emailField.text = "admin@campuscare.io";
                                    }
                                }
                            }
                        }
                    }

                    // Role Description Notice
                    Rectangle {
                        Layout.fillWidth: true
                        implicitHeight: roleNoticeText.implicitHeight + 14
                        radius: 6
                        color: "#F1F5F9"
                        border.color: "#E2E8F0"

                        Text {
                            id: roleNoticeText
                            anchors.fill: parent
                            anchors.margins: 8
                            font.pixelSize: 11
                            color: "#475569"
                            wrapMode: Text.WordWrap
                            text: {
                                if (loginRoot.selectedRole === "school_admin") {
                                    return "🔒 Restricted Access: Only your institution's computers and tickets will be visible. Direct ticket creation and lab status monitoring enabled.";
                                } else if (loginRoot.selectedRole === "technician") {
                                    return "🔧 Field Service View: Access assigned jobs, physical lab navigation to broken workstations, and diagnosis checklists.";
                                } else {
                                    return "⚡ Multi-Tenant Administrator: Full access across all client schools, AMC contracts, 2D lab map editor, and ticket dispatch.";
                                }
                            }
                        }
                    }

                    // Email Field
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 4
                        Text { text: "Institutional Username / Email *"; font.pixelSize: 12; font.bold: true; color: "#334155" }
                        TextField {
                            id: emailField
                            Layout.fillWidth: true
                            text: "principal@velammal.edu.in"
                        }
                    }

                    // Password Field
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 4
                        Text { text: "Password *"; font.pixelSize: 12; font.bold: true; color: "#334155" }
                        TextField {
                            id: pwdField
                            Layout.fillWidth: true
                            echoMode: TextInput.Password
                            text: "password123"
                        }
                    }

                    // Sign In Button
                    Button {
                        Layout.fillWidth: true
                        height: 44
                        text: "Sign In to Console ➔"
                        onClicked: {
                            appCtrl.login(emailField.text, pwdField.text, loginRoot.selectedRole);
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
                            color: "#0F2942"
                            radius: 6
                        }
                    }
                }
            }

            Item { height: 16 }
        }
    }
}
