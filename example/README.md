	 _____         _ _         
	|  _  |___ _ _| |_|___ ___ 
	|     |   | | | | |   | -_|
	|__|__|_|_|_  |_|_|_|_|___|
	          |___|            
	          
## Anyline Cordova Example App ##


### Quick Start - Setup

Copy the plugin to a new folder in your example App folder or elsewhere, just not in the same folder es the examples
folder (so when you locally add the plugin, it won't recursively add itself).

#### Add Plugin

npm:
```
cordova plugin add io-anyline-cordova
```
local:
```
cordova plugin add path/to/local/plugin
```

#### Add platform

Android:
```
cordova platform add android@latest
```
iOS:
```
cordova platform add ios@latest
```

#### Run it

```
cordova run android --device 
```


```
cordova run ios --device 
```