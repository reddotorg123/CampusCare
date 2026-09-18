#include "NetworkManager.h"
#include <QNetworkRequest>
#include <QDesktopServices>
#include <QUrl>
#include <QDebug>

NetworkManager::NetworkManager(QObject *parent)
    : QObject(parent)
    , m_supabaseUrl(QStringLiteral("https://uxujdjyuhduthyhkcqfa.supabase.co"))
    , m_supabaseKey(QStringLiteral("sb_publishable_hZiNDCOhBDMm1EnjAC61dQ_3ek8W6Y8"))
{
}

void NetworkManager::setSupabaseUrl(const QString &url)
{
    if (m_supabaseUrl != url) {
        m_supabaseUrl = url;
        emit supabaseUrlChanged();
    }
}

void NetworkManager::setSupabaseKey(const QString &key)
{
    if (m_supabaseKey != key) {
        m_supabaseKey = key;
        emit supabaseKeyChanged();
    }
}

void NetworkManager::fetchTickets()
{
    if (m_supabaseUrl.isEmpty()) return;

    m_isSyncing = true;
    emit isSyncingChanged();

    QUrl url(m_supabaseUrl + "/rest/v1/tickets?select=*&order=created_at.desc");
    QNetworkRequest request(url);
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    request.setRawHeader("apikey", m_supabaseKey.toUtf8());
    request.setRawHeader("Authorization", ("Bearer " + m_supabaseKey).toUtf8());

    QNetworkReply *reply = m_netManager.get(request);
    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        m_isSyncing = false;
        emit isSyncingChanged();

        if (reply->error() == QNetworkReply::NoError) {
            QByteArray response = reply->readAll();
            QJsonDocument doc = QJsonDocument::fromJson(response);
            if (doc.isArray()) {
                emit ticketsLoaded(doc.array());
            }
        } else {
            emit networkError(reply->errorString());
        }
        reply->deleteLater();
    });
}

void NetworkManager::fetchSchools()
{
    if (m_supabaseUrl.isEmpty()) return;

    m_isSyncing = true;
    emit isSyncingChanged();

    QUrl url(m_supabaseUrl + "/rest/v1/schools?select=*,labs(*)");
    QNetworkRequest request(url);
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    request.setRawHeader("apikey", m_supabaseKey.toUtf8());
    request.setRawHeader("Authorization", ("Bearer " + m_supabaseKey).toUtf8());

    QNetworkReply *reply = m_netManager.get(request);
    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        m_isSyncing = false;
        emit isSyncingChanged();

        if (reply->error() == QNetworkReply::NoError) {
            QByteArray response = reply->readAll();
            QJsonDocument doc = QJsonDocument::fromJson(response);
            if (doc.isArray()) {
                emit schoolsLoaded(doc.array());
            }
        } else {
            emit networkError(reply->errorString());
        }
        reply->deleteLater();
    });
}

void NetworkManager::fetchLabWorkstations(const QString &labId)
{
    if (m_supabaseUrl.isEmpty()) return;

    m_isSyncing = true;
    emit isSyncingChanged();

    QString endpoint = labId.isEmpty() 
        ? QStringLiteral("/rest/v1/assets?select=*")
        : QString("/rest/v1/assets?lab_id=eq.%1&select=*").arg(labId);

    QUrl url(m_supabaseUrl + endpoint);
    QNetworkRequest request(url);
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    request.setRawHeader("apikey", m_supabaseKey.toUtf8());
    request.setRawHeader("Authorization", ("Bearer " + m_supabaseKey).toUtf8());

    QNetworkReply *reply = m_netManager.get(request);
    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        m_isSyncing = false;
        emit isSyncingChanged();

        if (reply->error() == QNetworkReply::NoError) {
            QByteArray response = reply->readAll();
            QJsonDocument doc = QJsonDocument::fromJson(response);
            if (doc.isArray()) {
                emit workstationsLoaded(doc.array());
            }
        } else {
            emit networkError(reply->errorString());
        }
        reply->deleteLater();
    });
}

void NetworkManager::postTicket(const QJsonObject &ticketData)
{
    if (m_supabaseUrl.isEmpty()) return;

    QUrl url(m_supabaseUrl + "/rest/v1/tickets");
    QNetworkRequest request(url);
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    request.setRawHeader("apikey", m_supabaseKey.toUtf8());
    request.setRawHeader("Authorization", ("Bearer " + m_supabaseKey).toUtf8());
    request.setRawHeader("Prefer", "return=representation");

    QNetworkReply *reply = m_netManager.post(request, QJsonDocument(ticketData).toJson());
    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        if (reply->error() != QNetworkReply::NoError) {
            emit networkError(reply->errorString());
        } else {
            fetchTickets();
        }
        reply->deleteLater();
    });
}

void NetworkManager::checkOtaUpdate()
{
    // Check OTA update endpoint (version manifest)
    QUrl manifestUrl("http://localhost:5173/version.json");
    QNetworkRequest request(manifestUrl);
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

    QNetworkReply *reply = m_netManager.get(request);
    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        if (reply->error() == QNetworkReply::NoError) {
            QByteArray data = reply->readAll();
            QJsonDocument doc = QJsonDocument::fromJson(data);
            if (doc.isObject()) {
                QJsonObject obj = doc.object();
                QString remoteVersion = obj.value("version").toString();
                QString changelog = obj.value("changelog").toString();
                QJsonObject platforms = obj.value("platforms").toObject();
                QJsonObject win = platforms.value("windows").toObject();
                QString downloadUrl = win.value("installerUrl").toString("https://github.com/campuscare/releases/releases");

                // Compare version with local 1.0.0
                if (!remoteVersion.isEmpty() && remoteVersion != appVersion()) {
                    emit otaUpdateAvailable(remoteVersion, downloadUrl, changelog);
                    reply->deleteLater();
                    return;
                }
            }
        }
        emit otaUpToDate();
        reply->deleteLater();
    });
}

void NetworkManager::openDownloadUrl(const QString &url)
{
    QDesktopServices::openUrl(QUrl(url));
}
