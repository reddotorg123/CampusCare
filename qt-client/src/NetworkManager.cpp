#include "NetworkManager.h"
#include <QNetworkRequest>

NetworkManager::NetworkManager(QObject *parent)
    : QObject(parent)
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

void NetworkManager::fetchLabWorkstations(const QString &labId)
{
    if (m_supabaseUrl.isEmpty()) return;

    m_isSyncing = true;
    emit isSyncingChanged();

    QUrl url(m_supabaseUrl + QString("/rest/v1/workstations?lab_id=eq.%1&select=*").arg(labId));
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
        }
        reply->deleteLater();
    });
}
