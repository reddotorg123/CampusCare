#pragma once

#include <QObject>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QUrl>
#include <QJsonObject>
#include <QJsonDocument>
#include <QJsonArray>

class NetworkManager : public QObject {
    Q_OBJECT
    Q_PROPERTY(QString supabaseUrl READ supabaseUrl WRITE setSupabaseUrl NOTIFY supabaseUrlChanged)
    Q_PROPERTY(QString supabaseKey READ supabaseKey WRITE setSupabaseKey NOTIFY supabaseKeyChanged)
    Q_PROPERTY(bool isSyncing READ isSyncing NOTIFY isSyncingChanged)

public:
    explicit NetworkManager(QObject *parent = nullptr);

    QString supabaseUrl() const { return m_supabaseUrl; }
    void setSupabaseUrl(const QString &url);

    QString supabaseKey() const { return m_supabaseKey; }
    void setSupabaseKey(const QString &key);

    bool isSyncing() const { return m_isSyncing; }

    Q_INVOKABLE void fetchTickets();
    Q_INVOKABLE void fetchLabWorkstations(const QString &labId);
    Q_INVOKABLE void postTicket(const QJsonObject &ticketData);

signals:
    void supabaseUrlChanged();
    void supabaseKeyChanged();
    void isSyncingChanged();
    void ticketsLoaded(const QJsonArray &tickets);
    void workstationsLoaded(const QJsonArray &workstations);
    void networkError(const QString &error);

private:
    QNetworkAccessManager m_netManager;
    QString m_supabaseUrl;
    QString m_supabaseKey;
    bool m_isSyncing = false;
};
