#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQuickStyle>
#include <QIcon>
#include "AppController.h"
#include "NetworkManager.h"
#include "DataModels.h"

int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);
    app.setApplicationName("CampusCare");
    app.setOrganizationName("CampusCare Solutions");
    app.setApplicationVersion("1.0.0");

    QQuickStyle::setStyle("Basic");

    qmlRegisterType<Workstation>("CampusCare.Models", 1, 0, "Workstation");

    AppController appCtrl;
    NetworkManager netMgr;

    QQmlApplicationEngine engine;
    engine.rootContext()->setContextProperty("appCtrl", &appCtrl);
    engine.rootContext()->setContextProperty("netMgr", &netMgr);

    const QUrl url(QStringLiteral("qrc:/qt/qml/CampusCare/qml/Main.qml"));
    QObject::connect(
        &engine,
        &QQmlApplicationEngine::objectCreated,
        &app,
        [url](QObject *obj, const QUrl &objUrl) {
            if (!obj && url == objUrl)
                QCoreApplication::exit(-1);
        },
        Qt::QueuedConnection
    );

    engine.load(url);

    return app.exec();
}
