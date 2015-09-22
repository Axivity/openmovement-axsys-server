#include <nan.h>
#include <uv.h>
#include <stdio.h>
#include <WinBase.h>
#include <DbgHelp.h>
#include <Windows.h>
#include <mutex>

#include "DeviceFinder.h"

using namespace v8;

uv_async_t async;
DeviceFinder *deviceFinder;
uv_thread_t discovery_id;
std::mutex mtx;

bool stopLoop = false;
unsigned int debugCount = 0;
enum EventType { Added, Removed };


struct Callbacks {
	unsigned int vidPid;
	NanCallback *onDeviceAddedCallback;
	NanCallback *onDeviceRemovedCallback;
};

struct DeviceAddedOrRemovedBaton {
	EventType eventType;
	Device *device;
	NanCallback *onDeviceAdded;
	NanCallback *onDeviceRemoved;
	char *errorString;
};


void added_callback(void *reference, const Device &device) {
	// use uv_async_send to pass the data back.
	Callbacks *cbs = static_cast<Callbacks *>(reference);
	
	DeviceAddedOrRemovedBaton *baton = NULL;  
	baton = (DeviceAddedOrRemovedBaton *)malloc(sizeof(DeviceAddedOrRemovedBaton));

	baton->eventType = EventType::Added;
	baton->onDeviceAdded = cbs->onDeviceAddedCallback;
	baton->onDeviceRemoved = cbs->onDeviceRemovedCallback;
	baton->device = new Device(device);
	
	mtx.lock();
	async.data = baton;
	uv_async_send(&async);
	mtx.unlock();
	Sleep(500);
	
}


void removed_callback(void *reference, const Device &device) {
	// use uv_async_send to pass the data back.
	Callbacks *cbs = static_cast<Callbacks *>(reference);
	
	DeviceAddedOrRemovedBaton *baton = NULL;
	baton = (DeviceAddedOrRemovedBaton *)malloc(sizeof(DeviceAddedOrRemovedBaton));
	
	baton->eventType = EventType::Removed;
	baton->onDeviceAdded = cbs->onDeviceAddedCallback;
	baton->onDeviceRemoved = cbs->onDeviceRemovedCallback;

	// the device gets removed from the map managed by DeviceFinder so get a local copy.
	baton->device = new Device(device);
	mtx.lock();
	async.data = baton;
	uv_async_send(&async);
	mtx.unlock();
	Sleep(500);
	
}


void start_discovery_loop(void *arg) {

	Callbacks *cbs = static_cast<Callbacks *>(arg);
	
	// Start DeviceFinder here and pass in added_callback/removed_callback
	unsigned int vidPid = cbs->vidPid;
	deviceFinder = new DeviceFinder(vidPid);
	deviceFinder->Start(true, &added_callback, &removed_callback, arg);

	while (!stopLoop) {
		Sleep(500);
	}

	// Need to stop devicefinder 
	free(cbs);
	cbs = NULL;

	// close the uv_
	uv_close((uv_handle_t*)&async, NULL);
}

static Handle<Object> buildJSDeviceObject(const DeviceAddedOrRemovedBaton *baton) {

	/*
	This tries to create a JS object from Device object - see Device class in DeviceFinder.h 

	std::string usb;                // Unique PNP prefix, e.g. "USB\VID_04D8&PID_0057\7&91737B1&0"
	std::string port;               // Serial port device name, e.g. "\\.\COM98"
	std::string usbStor;            // USBSTOR identifier, e.g. "USBSTOR\DISK&VEN_CWA&PROD_CWA_MASS_STORAGE&REV_0017\8&1A780901&0&CWA17_65535&0"
	std::string usbComposite;       // USB composite device ID
	unsigned int deviceNumber;      // Device number, e.g. 1
	std::string physicalVolume;     // e.g. "\Device\HarddiskVolume105"
	std::string volumeName;         // e.g. "\\?\Volume{377c1972-0fbb-11e1-98fc-0024bed79d50}\"
	std::string volumePath;         // e.g. "E:\"
	std::string serialString;       // Parent composite device serial number, e.g. "CWA17_00123"
	unsigned int serialNumber;      // Serial number, e.g. 123
	unsigned int vidPid;
	*/
	//LPCSTR usb = baton->device->usb.c_str();
	Handle<Object> devObj = NanNew<Object>();
	
	Handle<Value> usb = NanNew<String>(baton->device->usb);
	devObj->Set((String::NewFromUtf8(NanGetCurrentContext()->GetIsolate(), "usb")), usb);
	
	Handle<Value> port = NanNew<String>(baton->device->port);
	devObj->Set((String::NewFromUtf8(NanGetCurrentContext()->GetIsolate(), "port")), port);
	

	Handle<Value> usbStor = NanNew<String>(baton->device->usbStor);
	devObj->Set((String::NewFromUtf8(NanGetCurrentContext()->GetIsolate(), "usbStor")), usbStor);
	

	Handle<Value> usbComposite = NanNew<String>(baton->device->usbComposite);
	devObj->Set((String::NewFromUtf8(NanGetCurrentContext()->GetIsolate(), "usbComposite")), usbComposite);
	

	Handle<Value> deviceNumber = NanNew<Number>(baton->device->deviceNumber);
	devObj->Set((String::NewFromUtf8(NanGetCurrentContext()->GetIsolate(), "deviceNumber")), deviceNumber);
	
	Handle<Value> physicalVolume = NanNew<String>(baton->device->physicalVolume);
	devObj->Set((String::NewFromUtf8(NanGetCurrentContext()->GetIsolate(), "physicalVolume")), physicalVolume);
	

	Handle<Value> volumeName = NanNew<String>(baton->device->volumeName);
	devObj->Set((String::NewFromUtf8(NanGetCurrentContext()->GetIsolate(), "volumeName")), volumeName);
	

	Handle<Value> volumePath = NanNew<String>(baton->device->volumePath);
	devObj->Set((String::NewFromUtf8(NanGetCurrentContext()->GetIsolate(), "volumePath")), volumePath);
	

	Handle<Value> serialString = NanNew<String>(baton->device->serialString);
	devObj->Set((String::NewFromUtf8(NanGetCurrentContext()->GetIsolate(), "serialString")), serialString);
	

	Handle<Value> serialNumber = NanNew<Number>(baton->device->serialNumber);
	devObj->Set((String::NewFromUtf8(NanGetCurrentContext()->GetIsolate(), "serialNumber")), serialNumber);

	Handle<Value> vidPid = NanNew<Number>(baton->device->vidPid);
	devObj->Set((String::NewFromUtf8(NanGetCurrentContext()->GetIsolate(), "vidPid")), vidPid);
	
	return devObj;

}


void added_or_removed_device(uv_async_t *handle) {
	//TODO: Refactor this function to have 1 switch statement?
	DeviceAddedOrRemovedBaton *baton;

	try {
		// consume async messages from added_callback or removed_callback.
		// NB: This will run in main thread (node/v8), so safer to use NanCallbacks
		NanScope();
		
		mtx.lock();
		
	    baton = static_cast<DeviceAddedOrRemovedBaton *>(handle->data);
		Handle<Object> devObj = buildJSDeviceObject(baton);
		Handle<Value> argv[] = {
			NanUndefined(),
			devObj
		};

		switch (baton->eventType) {
			case (EventType::Added) :

				baton->onDeviceAdded->Call(2, argv);
				
				break;

			case (EventType::Removed) :

				baton->onDeviceRemoved->Call(2, argv);
				
				break;

			default:
				break;
		}

		delete baton->device;
		free(handle->data);
		handle->data = NULL;
		mtx.unlock(); 

	}

	catch (...) {
		
		Handle<Value> argv[2];
		argv[0] = v8::Exception::Error(NanNew<String>("Error fetching added/removed device details"));
		argv[1] = NanUndefined();
		switch (baton->eventType) {
			case (EventType::Added) :

				baton->onDeviceAdded->Call(2, argv);

				break;

			case (EventType::Removed) :

				baton->onDeviceRemoved->Call(2, argv);

				break;

			default:
				break;
		}

	}
	
}


NAN_METHOD(StartDeviceDiscovery) {
	/*
	 This is the main method exposed - currently takes two functions
	 that are device added/removed callbacks. These functions are called
	 with device as it's argument later
	*/

	try {
		NanScope();
		
		// TODO: need some error handling to check the right types are passed
		unsigned int vidPid = args[0]->Int32Value();
		Local<Function> fn1 = args[1].As<Function>();
		Local<Function> fn2 = args[2].As<Function>();
		NanCallback *deviceAddedCallback = new NanCallback(fn1);
		NanCallback *deviceRemovedCallback = new NanCallback(fn2);

		Callbacks *cb = (Callbacks *)malloc(sizeof(Callbacks));
		cb->onDeviceAddedCallback = deviceAddedCallback;
		cb->onDeviceRemovedCallback = deviceRemovedCallback;
		cb->vidPid = vidPid;
		
		uv_async_init(uv_default_loop(), &async, added_or_removed_device);
		uv_thread_create(&discovery_id, start_discovery_loop, cb);
	
	}
	catch (...) {
		return NanThrowError("Initialization error - check callback functions");
	}
	NanReturnUndefined();
}


NAN_METHOD(StopDeviceDiscovery) {
	stopLoop = true;
	deviceFinder->Stop();
}


void Init(Handle<Object> exports) {
	exports->Set(NanNew<String>("StartDeviceDiscovery"),
		NanNew<FunctionTemplate>(StartDeviceDiscovery)->GetFunction());

	exports->Set(NanNew<String>("StopDeviceDiscovery"),
		NanNew<FunctionTemplate>(StopDeviceDiscovery)->GetFunction());
}

NODE_MODULE(devicefinder, Init);