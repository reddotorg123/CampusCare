#include "AppController.h"
#include <QDateTime>
#include <QSettings>

AppController::AppController(QObject *parent)
    : QObject(parent)
{
    loadSettings();
    initData();
}

void AppController::loadSettings()
{
    QSettings settings("CampusCareSolutions", "CampusCare");
    m_hasSeenOnboarding = settings.value("firstTimeGuideCompleted", false).toBool();
}

void AppController::saveSettings()
{
    QSettings settings("CampusCareSolutions", "CampusCare");
    settings.setValue("firstTimeGuideCompleted", m_hasSeenOnboarding);
}

void AppController::setHasSeenOnboarding(bool seen)
{
    if (m_hasSeenOnboarding != seen) {
        m_hasSeenOnboarding = seen;
        saveSettings();
        emit hasSeenOnboardingChanged();
    }
}

void AppController::completeOnboarding()
{
    setHasSeenOnboarding(true);
}

void AppController::resetOnboarding()
{
    setHasSeenOnboarding(false);
}

void AppController::setCurrentScreen(const QString &screen)
{
    if (m_currentScreen != screen) {
        m_currentScreen = screen;
        emit currentScreenChanged();
    }
}

void AppController::setCurrentRole(const QString &role)
{
    if (m_currentRole != role) {
        m_currentRole = role;
        emit currentRoleChanged();
    }
}

void AppController::setIsAuthenticated(bool auth)
{
    if (m_isAuthenticated != auth) {
        m_isAuthenticated = auth;
        emit isAuthenticatedChanged();
    }
}

void AppController::login(const QString &email, const QString &password, const QString &role)
{
    Q_UNUSED(email)
    Q_UNUSED(password)

    m_currentRole = role;
    m_isAuthenticated = true;

    if (role == "school_admin") {
        m_currentUserName = "Dr. K. Jayachandran (Principal)";
        m_currentUserSchoolName = "Velammal Matric Higher Secondary";
        m_currentScreen = "school_dashboard";
    } else if (role == "technician") {
        m_currentUserName = "Rajesh Kumar (Senior Field Engineer)";
        m_currentUserSchoolName = "AMC Hardware Services Ltd.";
        m_currentScreen = "technician_job";
    } else { // org_admin
        m_currentUserName = "A. Vikram (MSP Org Admin)";
        m_currentUserSchoolName = "CampusCare Multi-Tenant Central";
        m_currentScreen = "dashboard";
    }

    emit isAuthenticatedChanged();
    emit currentRoleChanged();
    emit currentUserNameChanged();
    emit currentUserSchoolNameChanged();
    emit currentScreenChanged();
}

void AppController::logout()
{
    m_isAuthenticated = false;
    m_currentScreen = "login";
    emit isAuthenticatedChanged();
    emit currentScreenChanged();
}

void AppController::navigateBack()
{
    if (m_currentScreen == "system_details") {
        setCurrentScreen("lab_map");
    } else if (m_currentScreen == "create_ticket") {
        setCurrentScreen(m_selectedWorkstation.isEmpty() ? "lab_map" : "system_details");
    } else if (m_currentScreen == "ticket_timeline") {
        setCurrentScreen("ticket_details");
    } else if (m_currentScreen == "ticket_details") {
        if (m_currentRole == "school_admin") setCurrentScreen("school_dashboard");
        else if (m_currentRole == "technician") setCurrentScreen("technician_job");
        else setCurrentScreen("dashboard");
    } else if (m_currentScreen == "technician_job") {
        if (m_currentRole == "org_admin") setCurrentScreen("dashboard");
        else setCurrentScreen("lab_map");
    } else if (m_currentScreen == "lab_editor") {
        setCurrentScreen("lab_map");
    } else if (m_currentScreen == "schools") {
        setCurrentScreen("dashboard");
    } else if (m_currentScreen == "lab_map") {
        if (m_currentRole == "school_admin") setCurrentScreen("school_dashboard");
        else if (m_currentRole == "technician") setCurrentScreen("technician_job");
        else setCurrentScreen("dashboard");
    } else {
        if (m_currentRole == "school_admin") setCurrentScreen("school_dashboard");
        else if (m_currentRole == "technician") setCurrentScreen("technician_job");
        else setCurrentScreen("dashboard");
    }
}

bool AppController::canAccessScreen(const QString &screen) const
{
    if (!m_isAuthenticated) {
        return screen == "login";
    }

    if (m_currentRole == "school_admin") {
        return screen == "school_dashboard" ||
               screen == "lab_map" ||
               screen == "system_details" ||
               screen == "create_ticket" ||
               screen == "ticket_details" ||
               screen == "ticket_timeline";
    }

    if (m_currentRole == "technician") {
        return screen == "technician_job" ||
               screen == "lab_map" ||
               screen == "system_details" ||
               screen == "ticket_details" ||
               screen == "ticket_timeline";
    }

    return true;
}

void AppController::selectSchool(const QString &schoolId)
{
    for (const QVariant &s : m_schools) {
        QVariantMap map = s.toMap();
        if (map.value("id").toString() == schoolId || map.value("code").toString() == schoolId) {
            m_currentUserSchoolName = map.value("name").toString();
            emit currentUserSchoolNameChanged();
            setCurrentScreen("lab_map");
            break;
        }
    }
}

void AppController::selectLab(const QString &labName)
{
    if (m_currentLabName != labName) {
        m_currentLabName = labName;
        emit currentLabNameChanged();
    }
}

QVariantList AppController::schoolTickets() const
{
    QVariantList filtered;
    for (const QVariant &t : m_tickets) {
        QVariantMap map = t.toMap();
        if (map.value("school").toString().contains("Velammal")) {
            filtered.append(map);
        }
    }
    return filtered;
}

QVariantList AppController::technicianTickets() const
{
    QVariantList filtered;
    for (const QVariant &t : m_tickets) {
        QVariantMap map = t.toMap();
        if (map.value("technician").toString().contains("Rajesh Kumar")) {
            filtered.append(map);
        }
    }
    return filtered;
}

void AppController::initData()
{
    m_podiumPosition["x"] = 350;
    m_podiumPosition["y"] = 16;
    m_podiumPosition["label"] = "INSTRUCTOR PODIUM & PROJECTOR";

    m_availableTechnicians = QVariantList{
        "Rajesh Kumar (Senior Field Engineer)",
        "Suresh Nair (Hardware Specialist)",
        "Anitha Raj (Network & Systems)",
        "Karthik V. (Field Support)"
    };

    m_availableLabs = QStringList{
        "Main Computer Lab (Lab 1)",
        "IT & Software Wing (Lab 2)",
        "Multimedia & CAD Studio (Lab 3)",
        "Robotics & IoT Laboratory (Lab 4)"
    };

    // Schools
    QVariantMap s1;
    s1["id"] = "sch-1";
    s1["name"] = "Velammal Matric Higher Secondary";
    s1["code"] = "VMHS";
    s1["location"] = "Mogappair East, Chennai";
    s1["labsCount"] = 4;
    s1["systemsCount"] = 128;
    s1["activeTickets"] = 2;
    s1["amcStatus"] = "Active";
    s1["amcExpiry"] = "31 Mar 2027";
    m_schools.append(s1);

    QVariantMap s2;
    s2["id"] = "sch-2";
    s2["name"] = "St. John's Higher Secondary School";
    s2["code"] = "SJHSS";
    s2["location"] = "Besant Nagar, Chennai";
    s2["labsCount"] = 3;
    s2["systemsCount"] = 96;
    s2["activeTickets"] = 1;
    s2["amcStatus"] = "Active";
    s2["amcExpiry"] = "15 Jan 2027";
    m_schools.append(s2);

    QVariantMap s3;
    s3["id"] = "sch-3";
    s3["name"] = "DAV Public School";
    s3["code"] = "DAVPS";
    s3["location"] = "Velachery, Chennai";
    s3["labsCount"] = 5;
    s3["systemsCount"] = 160;
    s3["activeTickets"] = 0;
    s3["amcStatus"] = "Active";
    s3["amcExpiry"] = "30 Jun 2027";
    m_schools.append(s3);

    // Workstations (30 PCs across 3 rows of 10)
    for (int i = 1; i <= 30; ++i) {
        QVariantMap pc;
        QString codeStr = QString("PC-%1").arg(i, 2, 10, QChar('0'));
        QString assetCode = QString("VMHS-PC-%1").arg(i, 3, 10, QChar('0'));
        pc["code"] = codeStr;
        pc["assetCode"] = assetCode;
        
        int row = (i - 1) / 10;
        int col = (i - 1) % 10;
        pc["row"] = row + 1;
        pc["col"] = col + 1;
        pc["x"] = 50 + col * 90;
        pc["y"] = 92 + row * 130;

        if (i == 7) {
            pc["status"] = "issue"; // Red
            pc["activeTicket"] = "#TKT-1024";
        } else if (i == 19) {
            pc["status"] = "issue"; // Red
            pc["activeTicket"] = "#TKT-1029";
        } else if (i == 11) {
            pc["status"] = "service"; // Blue
            pc["activeTicket"] = "#TKT-1015";
        } else if (i == 14 || i == 22) {
            pc["status"] = "maintenance"; // Amber
            pc["activeTicket"] = "";
        } else if (i == 28) {
            pc["status"] = "offline"; // Gray
            pc["activeTicket"] = "";
        } else {
            pc["status"] = "working"; // Green
            pc["activeTicket"] = "";
        }

        pc["makeModel"] = "Dell OptiPlex 3080 SFF";
        pc["processor"] = "Intel Core i5-10500 @ 3.10GHz (6 Cores)";
        pc["ram"] = "16 GB DDR4-2666 MHz";
        pc["storage"] = "512 GB NVMe M.2 SSD + 1 TB HDD";
        pc["os"] = "Windows 11 Pro Education 64-bit";
        pc["ip"] = QString("192.168.10.%1").arg(40 + i);
        pc["mac"] = QString("D4:81:D7:9C:2A:%1").arg(i + 10, 2, 16, QChar('0')).toUpper();
        pc["monitor"] = "Dell P2419H 24\" IPS FHD";
        pc["peripherals"] = "Dell KB216 Keyboard + MS116 Optical Mouse";
        pc["location"] = QString("Main Computer Lab, Row %1, Desk %2").arg(row + 1).arg(col + 1);

        m_workstations.append(pc);
    }

    m_selectedWorkstation = m_workstations.at(6).toMap();

    // Tickets
    QVariantMap t1;
    t1["number"] = "#TKT-1024";
    t1["title"] = "Blue Screen of Death (DRIVER_IRQL_NOT_LESS_OR_EQUAL) on boot";
    t1["description"] = "System boots into BSOD with error code DRIVER_IRQL_NOT_LESS_OR_EQUAL pointing to tcpip.sys. Occurs right after Windows login during lab batch sessions.";
    t1["systemCode"] = "PC-07";
    t1["assetCode"] = "VMHS-PC-007";
    t1["school"] = "Velammal Matric Higher Secondary";
    t1["lab"] = "Main Computer Lab (Lab 1)";
    t1["status"] = "In Progress";
    t1["priority"] = "Critical";
    t1["category"] = "Hardware / Driver Crash";
    t1["technician"] = "Rajesh Kumar (Senior Field Engineer)";
    t1["reportedBy"] = "S. Ramanathan (Lab Assistant)";
    t1["createdAt"] = "Today, 08:45 AM";
    m_tickets.append(t1);

    QVariantMap t2;
    t2["number"] = "#TKT-1029";
    t2["title"] = "System fails to POST - Beep code 3-3 (Memory failure)";
    t2["description"] = "System powers on with orange diagnostic LED and continuous 3-3 beep sequence. Display remains black.";
    t2["systemCode"] = "PC-19";
    t2["assetCode"] = "VMHS-PC-019";
    t2["school"] = "Velammal Matric Higher Secondary";
    t2["lab"] = "Main Computer Lab (Lab 1)";
    t2["status"] = "Open";
    t2["priority"] = "High";
    t2["category"] = "Memory / RAM";
    t2["technician"] = "Rajesh Kumar (Senior Field Engineer)";
    t2["reportedBy"] = "P. Divya (Lab Assistant)";
    t2["createdAt"] = "Today, 09:12 AM";
    m_tickets.append(t2);

    QVariantMap t3;
    t3["number"] = "#TKT-1015";
    t3["title"] = "Corrupted OS Registry Hive recovery and verification";
    t3["description"] = "Reinstalled Windows 11 Education image via network PXE boot. Verifying student portal software and network drives.";
    t3["systemCode"] = "PC-11";
    t3["assetCode"] = "VMHS-PC-011";
    t3["school"] = "Velammal Matric Higher Secondary";
    t3["lab"] = "Main Computer Lab (Lab 1)";
    t3["status"] = "Under Service";
    t3["priority"] = "Medium";
    t3["category"] = "OS / Software";
    t3["technician"] = "Rajesh Kumar (Senior Field Engineer)";
    t3["reportedBy"] = "S. Ramanathan (Lab Assistant)";
    t3["createdAt"] = "Yesterday, 04:30 PM";
    m_tickets.append(t3);

    m_selectedTicket = t1;

    // Checklist
    QVariantMap c1; c1["title"] = "Boot into Dell SupportAssist UEFI Hardware Diagnostics"; c1["done"] = true; m_checklist.append(c1);
    QVariantMap c2; c2["title"] = "Execute extended memory pass (MemTest86 - 4 passes)"; c2["done"] = true; m_checklist.append(c2);
    QVariantMap c3; c3["title"] = "Inspect memory dump file (C:\\Windows\\Minidump\\*.dmp)"; c3["done"] = true; m_checklist.append(c3);
    QVariantMap c4; c4["title"] = "Update Realtek PCIe GbE LAN Controller driver (v10.68+)"; c4["done"] = false; m_checklist.append(c4);
    QVariantMap c5; c5["title"] = "Perform 30-minute system burn-in stress test"; c5["done"] = false; m_checklist.append(c5);
    QVariantMap c6; c6["title"] = "Verify student login and network drive mapping"; c6["done"] = false; m_checklist.append(c6);

    // Timeline
    QVariantMap l1; l1["time"] = "08:45 AM"; l1["author"] = "S. Ramanathan"; l1["role"] = "Lab Staff"; l1["action"] = "Reported Ticket #TKT-1024 (BSOD on boot)"; m_timeline.append(l1);
    QVariantMap l2; l2["time"] = "08:52 AM"; l2["author"] = "System"; l2["role"] = "Automated Dispatch"; l2["action"] = "Dispatched and assigned to Field Engineer Rajesh Kumar"; m_timeline.append(l2);
    QVariantMap l3; l3["time"] = "09:15 AM"; l3["author"] = "Rajesh Kumar"; l3["role"] = "Technician"; l3["action"] = "Arrived on site. Initial UEFI diagnostics confirmed healthy hardware components."; m_timeline.append(l3);
    QVariantMap l4; l4["time"] = "09:35 AM"; l4["author"] = "Rajesh Kumar"; l4["role"] = "Technician"; l4["action"] = "Extracted minidump. Crash identified in rt640x64.sys (Network driver conflict). Preparing driver reinstallation."; m_timeline.append(l4);

    recomputeStats();
}

void AppController::recomputeStats()
{
    int total = m_workstations.size();
    int working = 0;
    int issues = 0;
    int maintenance = 0;
    int service = 0;
    int offline = 0;

    for (const QVariant &item : m_workstations) {
        QVariantMap map = item.toMap();
        QString st = map.value("status").toString();
        if (st == "working") working++;
        else if (st == "issue") issues++;
        else if (st == "maintenance") maintenance++;
        else if (st == "service") service++;
        else if (st == "offline") offline++;
    }

    m_stats["total"] = total;
    m_stats["working"] = working;
    m_stats["issues"] = issues;
    m_stats["maintenance"] = maintenance;
    m_stats["service"] = service;
    m_stats["offline"] = offline;
    m_stats["healthScore"] = total > 0 ? (working * 100 / total) : 100;

    emit statsChanged();
}

void AppController::selectWorkstation(const QString &code)
{
    for (const QVariant &item : m_workstations) {
        QVariantMap map = item.toMap();
        if (map.value("code").toString() == code) {
            m_selectedWorkstation = map;
            emit selectedWorkstationChanged();
            break;
        }
    }
}

void AppController::selectTicket(const QString &ticketNumber)
{
    for (const QVariant &item : m_tickets) {
        QVariantMap map = item.toMap();
        if (map.value("number").toString() == ticketNumber) {
            m_selectedTicket = map;
            emit selectedTicketChanged();
            break;
        }
    }
}

void AppController::toggleChecklistItem(int index)
{
    if (index >= 0 && index < m_checklist.size()) {
        QVariantMap item = m_checklist.at(index).toMap();
        item["done"] = !item.value("done").toBool();
        m_checklist[index] = item;
        emit checklistChanged();
    }
}

bool AppController::submitTicketWithValidation(const QString &title, const QString &description, const QString &priority, const QString &category)
{
    if (title.trimmed().isEmpty()) {
        m_validationError = "Please enter an incident title.";
        emit validationErrorChanged();
        return false;
    }

    if (description.trimmed().isEmpty()) {
        m_validationError = "Please describe the problem symptoms.";
        emit validationErrorChanged();
        return false;
    }

    m_validationError = "";
    emit validationErrorChanged();

    QVariantMap newTicket;
    int nextNum = 1030 + m_tickets.size();
    QString numStr = QString("#TKT-%1").arg(nextNum);

    newTicket["number"] = numStr;
    newTicket["title"] = title.trimmed();
    newTicket["description"] = description.trimmed();
    newTicket["systemCode"] = m_selectedWorkstation.value("code").toString();
    newTicket["assetCode"] = m_selectedWorkstation.value("assetCode").toString();
    newTicket["school"] = m_currentUserSchoolName;
    newTicket["lab"] = m_currentLabName;
    newTicket["status"] = "Open";
    newTicket["priority"] = priority.isEmpty() ? "High" : priority;
    newTicket["category"] = category.isEmpty() ? "Hardware" : category;
    newTicket["technician"] = "Unassigned";
    newTicket["reportedBy"] = m_currentUserName;
    newTicket["createdAt"] = "Just now";

    m_tickets.prepend(newTicket);
    emit ticketsChanged();

    // Mark current workstation as having an issue
    QString curCode = m_selectedWorkstation.value("code").toString();
    for (int i = 0; i < m_workstations.size(); ++i) {
        QVariantMap pc = m_workstations.at(i).toMap();
        if (pc.value("code").toString() == curCode) {
            pc["status"] = "issue";
            pc["activeTicket"] = numStr;
            m_workstations[i] = pc;
            m_selectedWorkstation = pc;
            emit selectedWorkstationChanged();
            emit workstationsChanged();
            break;
        }
    }

    // Add entry to audit log
    QVariantMap msg;
    msg["time"] = QDateTime::currentDateTime().toString("hh:mm AP");
    msg["author"] = m_currentUserName;
    msg["role"] = (m_currentRole == "school_admin") ? "School Staff" : "Technician";
    msg["action"] = QString("Raised Ticket %1 for %2: %3").arg(numStr, curCode, title);
    m_timeline.append(msg);
    emit timelineChanged();

    recomputeStats();
    m_selectedTicket = newTicket;
    emit selectedTicketChanged();
    setCurrentScreen("ticket_details");

    return true;
}

void AppController::resolveTicket(const QString &ticketNumber, const QString &resolutionNote)
{
    QString targetSysCode = "";

    // Update ticket in list
    for (int i = 0; i < m_tickets.size(); ++i) {
        QVariantMap t = m_tickets.at(i).toMap();
        if (t.value("number").toString() == ticketNumber) {
            t["status"] = "Resolved";
            targetSysCode = t.value("systemCode").toString();
            m_tickets[i] = t;
            if (m_selectedTicket.value("number").toString() == ticketNumber) {
                m_selectedTicket = t;
                emit selectedTicketChanged();
            }
            emit ticketsChanged();
            break;
        }
    }

    // Reset workstation status to operational (Green)
    if (!targetSysCode.isEmpty()) {
        for (int i = 0; i < m_workstations.size(); ++i) {
            QVariantMap pc = m_workstations.at(i).toMap();
            if (pc.value("code").toString() == targetSysCode) {
                pc["status"] = "working";
                pc["activeTicket"] = "";
                m_workstations[i] = pc;
                if (m_selectedWorkstation.value("code").toString() == targetSysCode) {
                    m_selectedWorkstation = pc;
                    emit selectedWorkstationChanged();
                }
                emit workstationsChanged();
                break;
            }
        }
    }

    // Check off all checklist items
    for (int i = 0; i < m_checklist.size(); ++i) {
        QVariantMap item = m_checklist.at(i).toMap();
        item["done"] = true;
        m_checklist[i] = item;
    }
    emit checklistChanged();

    // Log resolution to timeline
    QVariantMap msg;
    msg["time"] = QDateTime::currentDateTime().toString("hh:mm AP");
    msg["author"] = m_currentUserName;
    msg["role"] = (m_currentRole == "technician") ? "Technician" : "Support Lead";
    msg["action"] = resolutionNote.isEmpty() ?
                    QString("Service marked RESOLVED for %1. Hardware diagnostic pass verified.").arg(ticketNumber) :
                    QString("Service RESOLVED: %1").arg(resolutionNote);
    m_timeline.append(msg);
    emit timelineChanged();

    recomputeStats();
}

void AppController::assignTechnician(const QString &ticketNumber, const QString &techName)
{
    for (int i = 0; i < m_tickets.size(); ++i) {
        QVariantMap t = m_tickets.at(i).toMap();
        if (t.value("number").toString() == ticketNumber) {
            t["technician"] = techName;
            if (t.value("status").toString() == "Open") {
                t["status"] = "In Progress";
            }
            m_tickets[i] = t;
            if (m_selectedTicket.value("number").toString() == ticketNumber) {
                m_selectedTicket = t;
                emit selectedTicketChanged();
            }
            emit ticketsChanged();

            QVariantMap msg;
            msg["time"] = QDateTime::currentDateTime().toString("hh:mm AP");
            msg["author"] = m_currentUserName;
            msg["role"] = "Dispatch";
            msg["action"] = QString("Assigned technician %1 to %2").arg(techName, ticketNumber);
            m_timeline.append(msg);
            emit timelineChanged();
            break;
        }
    }
}

void AppController::updateTicketStatus(const QString &ticketNumber, const QString &newStatus)
{
    for (int i = 0; i < m_tickets.size(); ++i) {
        QVariantMap t = m_tickets.at(i).toMap();
        if (t.value("number").toString() == ticketNumber) {
            t["status"] = newStatus;
            m_tickets[i] = t;
            if (m_selectedTicket.value("number").toString() == ticketNumber) {
                m_selectedTicket = t;
                emit selectedTicketChanged();
            }
            emit ticketsChanged();

            if (newStatus == "Closed" || newStatus == "Resolved") {
                QString sys = t.value("systemCode").toString();
                for (int j = 0; j < m_workstations.size(); ++j) {
                    QVariantMap pc = m_workstations.at(j).toMap();
                    if (pc.value("code").toString() == sys) {
                        pc["status"] = "working";
                        pc["activeTicket"] = "";
                        m_workstations[j] = pc;
                        if (m_selectedWorkstation.value("code").toString() == sys) {
                            m_selectedWorkstation = pc;
                            emit selectedWorkstationChanged();
                        }
                        emit workstationsChanged();
                        break;
                    }
                }
            }

            QVariantMap msg;
            msg["time"] = QDateTime::currentDateTime().toString("hh:mm AP");
            msg["author"] = m_currentUserName;
            msg["role"] = "Admin";
            msg["action"] = QString("Ticket %1 status changed to %2").arg(ticketNumber, newStatus);
            m_timeline.append(msg);
            emit timelineChanged();
            recomputeStats();
            break;
        }
    }
}

void AppController::addTimelineMessage(const QString &text)
{
    if (text.trimmed().isEmpty()) return;

    QVariantMap msg;
    msg["time"] = QDateTime::currentDateTime().toString("hh:mm AP");
    msg["author"] = m_currentUserName;
    msg["role"] = (m_currentRole == "technician") ? "Technician" : "School Staff";
    msg["action"] = text.trimmed();

    m_timeline.append(msg);
    emit timelineChanged();
}

void AppController::updateWorkstationPosition(const QString &code, int x, int y)
{
    for (int i = 0; i < m_workstations.size(); ++i) {
        QVariantMap pc = m_workstations.at(i).toMap();
        if (pc.value("code").toString() == code) {
            pc["x"] = x;
            pc["y"] = y;
            m_workstations[i] = pc;
            if (m_selectedWorkstation.value("code").toString() == code) {
                m_selectedWorkstation = pc;
                emit selectedWorkstationChanged();
            }
            emit workstationsChanged();
            break;
        }
    }
}

void AppController::updateWorkstationStatus(const QString &code, const QString &status)
{
    for (int i = 0; i < m_workstations.size(); ++i) {
        QVariantMap pc = m_workstations.at(i).toMap();
        if (pc.value("code").toString() == code) {
            pc["status"] = status;
            m_workstations[i] = pc;
            if (m_selectedWorkstation.value("code").toString() == code) {
                m_selectedWorkstation = pc;
                emit selectedWorkstationChanged();
            }
            emit workstationsChanged();
            recomputeStats();
            break;
        }
    }
}

bool AppController::addWorkstation(const QString &code, const QString &assetCode, int x, int y, int row, int col, const QString &status)
{
    QString trimmedCode = code.trimmed().toUpper();
    if (trimmedCode.isEmpty()) return false;

    // Check duplicate
    for (const QVariant &item : m_workstations) {
        if (item.toMap().value("code").toString() == trimmedCode) {
            return false;
        }
    }

    QVariantMap pc;
    pc["code"] = trimmedCode;
    pc["assetCode"] = assetCode.trimmed().isEmpty() ? QString("VMHS-%1").arg(trimmedCode) : assetCode.trimmed();
    pc["x"] = x;
    pc["y"] = y;
    pc["row"] = row;
    pc["col"] = col;
    pc["status"] = status;
    pc["activeTicket"] = "";
    pc["makeModel"] = "Dell OptiPlex 3080 SFF";
    pc["processor"] = "Intel Core i5-10500 @ 3.10GHz (6 Cores)";
    pc["ram"] = "16 GB DDR4-2666 MHz";
    pc["storage"] = "512 GB NVMe M.2 SSD";
    pc["os"] = "Windows 11 Pro Education 64-bit";
    pc["ip"] = QString("192.168.10.%1").arg(50 + m_workstations.size());
    pc["mac"] = "D4:81:D7:9C:3B:10";
    pc["monitor"] = "Dell P2419H 24\" IPS FHD";
    pc["peripherals"] = "Dell KB216 Keyboard + MS116 Optical Mouse";
    pc["location"] = QString("Main Computer Lab, Row %1, Desk %2").arg(row).arg(col);

    m_workstations.append(pc);
    emit workstationsChanged();
    recomputeStats();
    return true;
}

void AppController::removeWorkstation(const QString &code)
{
    for (int i = 0; i < m_workstations.size(); ++i) {
        QVariantMap pc = m_workstations.at(i).toMap();
        if (pc.value("code").toString() == code) {
            m_workstations.removeAt(i);
            if (m_selectedWorkstation.value("code").toString() == code) {
                m_selectedWorkstation = m_workstations.isEmpty() ? QVariantMap() : m_workstations.first().toMap();
                emit selectedWorkstationChanged();
            }
            emit workstationsChanged();
            recomputeStats();
            break;
        }
    }
}

void AppController::setPodiumPosition(int x, int y)
{
    m_podiumPosition["x"] = x;
    m_podiumPosition["y"] = y;
    emit podiumPositionChanged();
}
