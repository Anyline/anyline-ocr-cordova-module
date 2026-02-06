// swift-tools-version:5.5
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "io-anyline-cordova",
    platforms: [
        .iOS(.v13)
    ],
    products: [
        .library(
            name: "io-anyline-cordova",
            targets: ["io-anyline-cordova"])
    ],
    dependencies: [
        // Cordova-iOS dependency (SPM support requires 8.0.0+)
        .package(
            url: "https://github.com/apache/cordova-ios.git",
            from: "8.0.0"
        ),
        // Anyline SDK dependency
        .package(
            url: "https://github.com/Anyline/anyline-ocr-spm-module.git",
            from: "55.9.0"
        )
    ],
    targets: [
        .target(
            name: "io-anyline-cordova",
            dependencies: [
                .product(name: "Cordova", package: "cordova-ios"),
                .product(name: "AnylinePackage", package: "anyline-ocr-spm-module")
            ],
            path: "src/ios",
            publicHeadersPath: "."
        )
    ]
)