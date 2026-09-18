#include "AppController.h"
#include <QDateTime>
#include <QSettings>
#include <QRandomGenerator>
#include <QJsonObject>
#include <QJsonArray>
#include <QJsonValue>
#include <QJsonDocument>

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
    if (!canAccessScreen(screen)) {
        return;
    }
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
        m_currentUserName = email.isEmpty() ? QStringLiteral("School Administrator") : email.split('@').first();
        m_currentUserSchoolName = QStringLiteral("Client Institution");
        m_currentScreen = "school_dashboard";
    } else if (role == "technician") {
        m_currentUserName = email.isEmpty() ? QStringLiteral("Field Service Engineer") : email.split('@').first();
        m_currentUserSchoolName = QStringLiteral("Field Operations");
        m_currentScreen = "technician_job";
    } else { // org_admin
        m_currentUserName = email.isEmpty() ? QStringLiteral("MSP System Admin") : email.split('@').first();
        m_currentUserSchoolName = QStringLiteral("CampusCare Central AMC");
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

QVariantList AppController::schools() const
{
    if (m_currentRole == "school_admin") {
        QVariantList filtered;
        for (const QVariant &s : m_schools) {
            QVariantMap map = s.toMap();
            if (map.value("name").toString() == m_currentUserSchoolName || map.value("id").toString() == "sch-1") {
                filtered.append(map);
            }
        }
        return filtered;
    }
    return m_schools;
}

void AppController::selectSchool(const QString &schoolId)
{
    // School staff/admin cannot switch to external schools
    if (m_currentRole == "school_admin") {
        return;
    }

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
        if (m_currentUserSchoolName.isEmpty() || map.value("school").toString() == m_currentUserSchoolName) {
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
        QString tech = map.value("technician").toString();
        if (!m_currentUserName.isEmpty() && (tech == m_currentUserName || tech.contains(m_currentUserName))) {
            filtered.append(map);
        }
    }
    return filtered;
}

QVariantList AppController::openTickets() const
{
    QVariantList filtered;
    for (const QVariant &t : m_tickets) {
        QVariantMap map = t.toMap();
        QString tech = map.value("technician").toString();
        QString status = map.value("status").toString();
        if ((tech.isEmpty() || tech == "Unassigned" || tech.contains("Open Pool")) && status != "Resolved" && status != "Closed") {
            filtered.append(map);
        }
    }
    return filtered;
}

void AppController::claimJob(const QString &ticketNumber)
{
    for (int i = 0; i < m_tickets.size(); ++i) {
        QVariantMap t = m_tickets.at(i).toMap();
        if (t.value("number").toString() == ticketNumber) {
            t["technician"] = m_currentUserName;
            t["status"] = "In Progress";
            m_tickets[i] = t;
            if (m_selectedTicket.value("number").toString() == ticketNumber) {
                m_selectedTicket = t;
                emit selectedTicketChanged();
            }
            emit ticketsChanged();

            QVariantMap msg;
            msg["time"] = QDateTime::currentDateTime().toString("hh:mm AP");
            msg["author"] = m_currentUserName;
            msg["role"] = "Field Engineer";
            msg["action"] = QString("Claimed job %1 from Open Pool").arg(ticketNumber);
            m_timeline.append(msg);
            emit timelineChanged();
            break;
        }
    }
}

void AppController::releaseJob(const QString &ticketNumber, const QString &reason)
{
    for (int i = 0; i < m_tickets.size(); ++i) {
        QVariantMap t = m_tickets.at(i).toMap();
        if (t.value("number").toString() == ticketNumber) {
            t["technician"] = "Unassigned";
            t["status"] = "Open";
            m_tickets[i] = t;
            if (m_selectedTicket.value("number").toString() == ticketNumber) {
                m_selectedTicket = t;
                emit selectedTicketChanged();
            }
            emit ticketsChanged();

            QVariantMap msg;
            msg["time"] = QDateTime::currentDateTime().toString("hh:mm AP");
            msg["author"] = m_currentUserName;
            msg["role"] = "Field Engineer";
            msg["action"] = QString("Released job %1 back to Open Pool. Reason: %2")
                .arg(ticketNumber, reason.trimmed().isEmpty() ? "Reassigned by engineer" : reason.trimmed());
            m_timeline.append(msg);
            emit timelineChanged();
            break;
        }
    }
}

void AppController::initData()
{
    m_podiumPosition["x"] = 350;
    m_podiumPosition["y"] = 16;
    m_podiumPosition["label"] = "INSTRUCTOR PODIUM & PROJECTOR";

    m_availableTechnicians.clear();
    m_availableLabs.clear();

    m_schools.clear();
    m_workstations.clear();
    m_tickets.clear();
    m_checklist.clear();
    m_timeline.clear();
    m_selectedWorkstation = QVariantMap();
    m_selectedTicket = QVariantMap();

    recomputeStats();
}

void AppController::setTicketsFromNetwork(const QJsonArray &tickets)
{
    m_tickets.clear();
    for (const QJsonValue &val : tickets) {
        if (!val.isObject()) continue;
        QJsonObject obj = val.toObject();
        QVariantMap t;
        t["id"] = obj.value("id").toString();
        t["number"] = obj.value("ticket_number").toString(QStringLiteral("#TKT-") + obj.value("id").toString().left(6).toUpper());
        t["title"] = obj.value("title").toString();
        t["description"] = obj.value("description").toString();
        t["status"] = obj.value("status").toString(QStringLiteral("Open"));
        t["priority"] = obj.value("priority").toString(QStringLiteral("Medium"));
        t["category"] = obj.value("category").toString(QStringLiteral("Hardware"));
        t["school"] = obj.value("school_name").toString(m_currentUserSchoolName);
        t["technician"] = obj.value("assigned_technician_name").toString(QStringLiteral("Unassigned"));
        t["createdAt"] = obj.value("created_at").toString();
        m_tickets.append(t);
    }
    recomputeStats();
    emit ticketsChanged();
}

void AppController::setSchoolsFromNetwork(const QJsonArray &schools)
{
    m_schools.clear();
    for (const QJsonValue &val : schools) {
        if (!val.isObject()) continue;
        QJsonObject obj = val.toObject();
        QVariantMap s;
        s["id"] = obj.value("id").toString();
        s["name"] = obj.value("name").toString();
        s["code"] = obj.value("code").toString(QStringLiteral("SCH"));
        s["location"] = obj.value("city").toString(QStringLiteral("Campus"));
        s["labsCount"] = 0;
        s["systemsCount"] = 0;
        m_schools.append(s);
    }
    emit schoolsChanged();
}

void AppController::setWorkstationsFromNetwork(const QJsonArray &workstations)
{
    m_workstations.clear();
    for (const QJsonValue &val : workstations) {
        if (!val.isObject()) continue;
        QJsonObject obj = val.toObject();
        QVariantMap w;
        w["code"] = obj.value("name").toString();
        w["assetCode"] = obj.value("asset_code").toString();
        w["status"] = obj.value("status").toString(QStringLiteral("working"));
        m_workstations.append(w);
    }
    recomputeStats();
    emit workstationsChanged();
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
    int randomCode = QRandomGenerator::global()->bounded(100000, 999999);
    QString numStr = QString("TKT-%1").arg(randomCode);

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
