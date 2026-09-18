#pragma once

#include <QObject>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QUrl>
#include <QJsonObject>
#include <QJsonDocument>
#include <QJsonArray>
#include <QDesktopServices>

class NetworkManager : public QObject {
    Q_OBJECT
    Q_PROPERTY(QString supabaseUrl READ supabaseUrl WRITE setSupabaseUrl NOTIFY supabaseUrlChanged)
    Q_PROPERTY(QString supabaseKey READ supabaseKey WRITE setSupabaseKey NOTIFY supabaseKeyChanged)
    Q_PROPERTY(bool isSyncing READ isSyncing NOTIFY isSyncingChanged)
    Q_PROPERTY(QString appVersion READ appVersion CONSTANT)

public:
    explicit NetworkManager(QObject *parent = nullptr);

    QString supabaseUrl() const { return m_supabaseUrl; }
    void setSupabaseUrl(const QString &url);

    QString supabaseKey() const { return m_supabaseKey; }
    void setSupabaseKey(const QString &key);

    bool isSyncing() const { return m_isSyncing; }
    QString appVersion() const { return QStringLiteral("1.0.0"); }

    Q_INVOKABLE void fetchTickets();
    Q_INVOKABLE void fetchSchools();
    Q_INVOKABLE void fetchLabWorkstations(const QString &labId);
    Q_INVOKABLE void postTicket(const QJsonObject &ticketData);
    
    // OTA Update System
    Q_INVOKABLE void checkOtaUpdate();
    Q_INVOKABLE void openDownloadUrl(const QString &url);

signals:
    void supabaseUrlChanged();
    void supabaseKeyChanged();
    void isSyncingChanged();
    void ticketsLoaded(const QJsonArray &tickets);
    void schoolsLoaded(const QJsonArray &schools);
    void workstationsLoaded(const QJsonArray &workstations);
    void otaUpdateAvailable(const QString &newVersion, const QString &downloadUrl, const QString &releaseNotes);
    void otaUpToDate();
    void networkError(const QString &error);

private:
    QNetworkAccessManager m_netManager;
    QString m_supabaseUrl;
    QString m_supabaseKey;
    bool m_isSyncing = false;
};
