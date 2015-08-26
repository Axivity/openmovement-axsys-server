{
	"targets": [
		{
			"target_name":"devicefinder",
			"sources": [
				"addons/DeviceFinder.h", 
				"addons/DeviceFinder.cpp", 
				"addons/NodeAddonForDeviceFinder.cpp"
			],
			"include_dirs": [
				"<!(node -e \"require('nan')\")"
			]
		}


	]

}
