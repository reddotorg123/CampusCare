#pragma once

#include <QObject>
#include <QString>
#include <QVariantList>
#include <QVariantMap>

class Workstation : public QObject {
    Q_OBJECT
    Q_PROPERTY(QString code READ code WRITE setCode NOTIFY dataChanged)
    Q_PROPERTY(QString assetCode READ assetCode WRITE setAssetCode NOTIFY dataChanged)
    Q_PROPERTY(QString status READ status WRITE setStatus NOTIFY dataChanged)
    Q_PROPERTY(int x READ x WRITE setX NOTIFY dataChanged)
    Q_PROPERTY(int y READ y WRITE setY NOTIFY dataChanged)
    Q_PROPERTY(QString makeModel READ makeModel WRITE setMakeModel NOTIFY dataChanged)
    Q_PROPERTY(QString processor READ processor WRITE setProcessor NOTIFY dataChanged)
    Q_PROPERTY(QString ram READ ram WRITE setRam NOTIFY dataChanged)
    Q_PROPERTY(QString storage READ storage WRITE setStorage NOTIFY dataChanged)
    Q_PROPERTY(QString os READ os WRITE setOs NOTIFY dataChanged)
    Q_PROPERTY(QString ip READ ip WRITE setIp NOTIFY dataChanged)
    Q_PROPERTY(QString mac READ mac WRITE setMac NOTIFY dataChanged)
    Q_PROPERTY(QString monitor READ monitor WRITE setMonitor NOTIFY dataChanged)
    Q_PROPERTY(QString peripherals READ peripherals WRITE setPeripherals NOTIFY dataChanged)
    Q_PROPERTY(QString location READ location WRITE setLocation NOTIFY dataChanged)

public:
    explicit Workstation(QObject *parent = nullptr);

    QString code() const { return m_code; }
    void setCode(const QString &c) { if (m_code != c) { m_code = c; emit dataChanged(); } }

    QString assetCode() const { return m_assetCode; }
    void setAssetCode(const QString &ac) { if (m_assetCode != ac) { m_assetCode = ac; emit dataChanged(); } }

    QString status() const { return m_status; }
    void setStatus(const QString &s) { if (m_status != s) { m_status = s; emit dataChanged(); } }

    int x() const { return m_x; }
    void setX(int val) { if (m_x != val) { m_x = val; emit dataChanged(); } }

    int y() const { return m_y; }
    void setY(int val) { if (m_y != val) { m_y = val; emit dataChanged(); } }

    QString makeModel() const { return m_makeModel; }
    void setMakeModel(const QString &v) { m_makeModel = v; emit dataChanged(); }

    QString processor() const { return m_processor; }
    void setProcessor(const QString &v) { m_processor = v; emit dataChanged(); }

    QString ram() const { return m_ram; }
    void setRam(const QString &v) { m_ram = v; emit dataChanged(); }

    QString storage() const { return m_storage; }
    void setStorage(const QString &v) { m_storage = v; emit dataChanged(); }

    QString os() const { return m_os; }
    void setOs(const QString &v) { m_os = v; emit dataChanged(); }

    QString ip() const { return m_ip; }
    void setIp(const QString &v) { m_ip = v; emit dataChanged(); }

    QString mac() const { return m_mac; }
    void setMac(const QString &v) { m_mac = v; emit dataChanged(); }

    QString monitor() const { return m_monitor; }
    void setMonitor(const QString &v) { m_monitor = v; emit dataChanged(); }

    QString peripherals() const { return m_peripherals; }
    void setPeripherals(const QString &v) { m_peripherals = v; emit dataChanged(); }

    QString location() const { return m_location; }
    void setLocation(const QString &v) { m_location = v; emit dataChanged(); }

signals:
    void dataChanged();

private:
    QString m_code;
    QString m_assetCode;
    QString m_status;
    int m_x = 0;
    int m_y = 0;
    QString m_makeModel;
    QString m_processor;
    QString m_ram;
    QString m_storage;
    QString m_os;
    QString m_ip;
    QString m_mac;
    QString m_monitor;
    QString m_peripherals;
    QString m_location;
};
