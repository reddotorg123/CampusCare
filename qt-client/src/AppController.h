#pragma once

#include <QObject>
#include <QString>
#include <QVariantList>
#include <QVariantMap>
#include <QJsonArray>
#include <QJsonObject>
#include <QJsonValue>
#include <QJsonDocument>

class AppController : public QObject {
    Q_OBJECT
    Q_PROPERTY(QString currentScreen READ currentScreen WRITE setCurrentScreen NOTIFY currentScreenChanged)
    Q_PROPERTY(QString currentRole READ currentRole WRITE setCurrentRole NOTIFY currentRoleChanged)
    Q_PROPERTY(bool isAuthenticated READ isAuthenticated WRITE setIsAuthenticated NOTIFY isAuthenticatedChanged)
    Q_PROPERTY(bool hasSeenOnboarding READ hasSeenOnboarding WRITE setHasSeenOnboarding NOTIFY hasSeenOnboardingChanged)
    Q_PROPERTY(QString currentUserName READ currentUserName NOTIFY currentUserNameChanged)
    Q_PROPERTY(QString currentUserSchoolName READ currentUserSchoolName NOTIFY currentUserSchoolNameChanged)
    Q_PROPERTY(QString currentLabName READ currentLabName NOTIFY currentLabNameChanged)
    Q_PROPERTY(QString validationError READ validationError NOTIFY validationErrorChanged)
    Q_PROPERTY(QVariantList schools READ schools NOTIFY schoolsChanged)
    Q_PROPERTY(QVariantList workstations READ workstations NOTIFY workstationsChanged)
    Q_PROPERTY(QVariantList tickets READ tickets NOTIFY ticketsChanged)
    Q_PROPERTY(QVariantList schoolTickets READ schoolTickets NOTIFY ticketsChanged)
    Q_PROPERTY(QVariantList technicianTickets READ technicianTickets NOTIFY ticketsChanged)
    Q_PROPERTY(QVariantList openTickets READ openTickets NOTIFY ticketsChanged)
    Q_PROPERTY(QVariantMap selectedWorkstation READ selectedWorkstation NOTIFY selectedWorkstationChanged)
    Q_PROPERTY(QVariantMap selectedTicket READ selectedTicket NOTIFY selectedTicketChanged)
    Q_PROPERTY(QVariantList checklist READ checklist NOTIFY checklistChanged)
    Q_PROPERTY(QVariantList timeline READ timeline NOTIFY timelineChanged)
    Q_PROPERTY(QVariantMap stats READ stats NOTIFY statsChanged)
    Q_PROPERTY(QVariantMap podiumPosition READ podiumPosition NOTIFY podiumPositionChanged)
    Q_PROPERTY(QVariantList availableTechnicians READ availableTechnicians CONSTANT)
    Q_PROPERTY(QStringList availableLabs READ availableLabs CONSTANT)

public:
    explicit AppController(QObject *parent = nullptr);

    QString currentScreen() const { return m_currentScreen; }
    void setCurrentScreen(const QString &screen);

    QString currentRole() const { return m_currentRole; }
    void setCurrentRole(const QString &role);

    bool isAuthenticated() const { return m_isAuthenticated; }
    void setIsAuthenticated(bool auth);

    bool hasSeenOnboarding() const { return m_hasSeenOnboarding; }
    void setHasSeenOnboarding(bool seen);

    QString currentUserName() const { return m_currentUserName; }
    QString currentUserSchoolName() const { return m_currentUserSchoolName; }
    QString currentLabName() const { return m_currentLabName; }
    QString validationError() const { return m_validationError; }

    QVariantList schools() const;
    QVariantList workstations() const { return m_workstations; }
    QVariantList tickets() const { return m_tickets; }
    QVariantList schoolTickets() const;
    QVariantList technicianTickets() const;
    QVariantList openTickets() const;
    QVariantMap selectedWorkstation() const { return m_selectedWorkstation; }
    QVariantMap selectedTicket() const { return m_selectedTicket; }
    QVariantList checklist() const { return m_checklist; }
    QVariantList timeline() const { return m_timeline; }
    QVariantMap stats() const { return m_stats; }
    QVariantMap podiumPosition() const { return m_podiumPosition; }
    QVariantList availableTechnicians() const { return m_availableTechnicians; }
    QStringList availableLabs() const { return m_availableLabs; }

    // Navigation & RBAC
    Q_INVOKABLE void login(const QString &email, const QString &password, const QString &role);
    Q_INVOKABLE void logout();
    Q_INVOKABLE void navigateBack();
    Q_INVOKABLE bool canAccessScreen(const QString &screen) const;

    // School & Lab context selection
    Q_INVOKABLE void selectSchool(const QString &schoolId);
    Q_INVOKABLE void selectLab(const QString &labName);

    // Onboarding Guide
    Q_INVOKABLE void completeOnboarding();
    Q_INVOKABLE void resetOnboarding();

    // Workstation & Ticket selection
    Q_INVOKABLE void selectWorkstation(const QString &code);
    Q_INVOKABLE void selectTicket(const QString &ticketNumber);

    // Ticket Lifecycle Operations & Engineer Reassignment
    Q_INVOKABLE bool submitTicketWithValidation(const QString &title, const QString &description, const QString &priority, const QString &category);
    Q_INVOKABLE bool submitTicket(const QString &title, const QString &description, const QString &priority, const QString &category) {
        return submitTicketWithValidation(title, description, priority, category);
    }
    Q_INVOKABLE void resolveTicket(const QString &ticketNumber, const QString &resolutionNote = "");
    Q_INVOKABLE void assignTechnician(const QString &ticketNumber, const QString &techName);
    Q_INVOKABLE void claimJob(const QString &ticketNumber);
    Q_INVOKABLE void releaseJob(const QString &ticketNumber, const QString &reason);
    Q_INVOKABLE void updateTicketStatus(const QString &ticketNumber, const QString &newStatus);
    Q_INVOKABLE void toggleChecklistItem(int index);
    Q_INVOKABLE void addTimelineMessage(const QString &text);

    // 2D Lab Map Customization & Management
    Q_INVOKABLE void updateWorkstationPosition(const QString &code, int x, int y);
    Q_INVOKABLE void updateWorkstationStatus(const QString &code, const QString &status);
    Q_INVOKABLE bool addWorkstation(const QString &code, const QString &assetCode, int x, int y, int row, int col, const QString &status = "working");
    Q_INVOKABLE void removeWorkstation(const QString &code);
    Q_INVOKABLE void setPodiumPosition(int x, int y);

    // Network / Supabase Data Ingestion
    Q_INVOKABLE void setTicketsFromNetwork(const QJsonArray &tickets);
    Q_INVOKABLE void setSchoolsFromNetwork(const QJsonArray &schools);
    Q_INVOKABLE void setWorkstationsFromNetwork(const QJsonArray &workstations);

signals:
    void currentScreenChanged();
    void currentRoleChanged();
    void isAuthenticatedChanged();
    void hasSeenOnboardingChanged();
    void currentUserNameChanged();
    void currentUserSchoolNameChanged();
    void currentLabNameChanged();
    void validationErrorChanged();
    void schoolsChanged();
    void workstationsChanged();
    void ticketsChanged();
    void selectedWorkstationChanged();
    void selectedTicketChanged();
    void checklistChanged();
    void timelineChanged();
    void statsChanged();
    void podiumPositionChanged();

private:
    void initData();
    void recomputeStats();
    void loadSettings();
    void saveSettings();

    QString m_currentScreen = "login";
    QString m_currentRole = "school_admin";
    bool m_isAuthenticated = false;
    bool m_hasSeenOnboarding = false;
    QString m_currentUserName = "";
    QString m_currentUserSchoolName = "";
    QString m_currentLabName = "";
    QString m_validationError = "";

    QVariantList m_schools;
    QVariantList m_workstations;
    QVariantList m_tickets;
    QVariantMap m_selectedWorkstation;
    QVariantMap m_selectedTicket;
    QVariantList m_checklist;
    QVariantList m_timeline;
    QVariantMap m_stats;
    QVariantMap m_podiumPosition;
    QVariantList m_availableTechnicians;
    QStringList m_availableLabs;
};
