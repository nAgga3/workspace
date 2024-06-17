// =============================================================================================================================
// Copyright 2021, CybeleSoft
// CYBELESOFT
// 20210511.1
// info@cybelesoft.com
// =============================================================================================================================
// -- Required:
// -- helper.js
// -- input.audio.processor.worklet.js
// -- thinfinity.components.js
// *****************************************************************************************************************************
// THINFINITY.TOOLBAR CLASS ****************************************************************************************************
// *****************************************************************************************************************************

(function () {
    const LIBUSB_MANUFACTURER_ID = 1;
    const LIBUSB_PRODUCT_ID = 2;
    const LIBUSB_SN_ID = 3;

    /** Success (no error) */
    const LIBUSB_SUCCESS = 0;

    /** Input/output error */
    const LIBUSB_ERROR_IO = -1;

    /** Invalid parameter */
    const LIBUSB_ERROR_INVALID_PARAM = -2;

    /** Access denied (insufficient permissions) */
    const LIBUSB_ERROR_ACCESS = -3;

    /** No such device (it may have been disconnected) */
    const LIBUSB_ERROR_NO_DEVICE = -4;

    /** Entity not found */
    const LIBUSB_ERROR_NOT_FOUND = -5;

    /** Resource busy */
    const LIBUSB_ERROR_BUSY = -6;

    /** Operation timed out */
    const LIBUSB_ERROR_TIMEOUT = -7;

    /** Overflow */
    const LIBUSB_ERROR_OVERFLOW = -8;

    /** Pipe error */
    const LIBUSB_ERROR_PIPE = -9;

    /** System call interrupted (perhaps due to signal) */
    const LIBUSB_ERROR_INTERRUPTED = -10;

    /** Insufficient memory */
    const LIBUSB_ERROR_NO_MEM = -11;

    /** Operation not supported or unimplemented on this platform */
    const LIBUSB_ERROR_NOT_SUPPORTED = -12;

    /* NB: Remember to update LIBUSB_ERROR_COUNT below as well as the
        message strings in strerror.c when adding new error codes here. */

    /** Other error */
    const LIBUSB_ERROR_OTHER = -99;


    /* Descriptor sizes per descriptor type */
    const LIBUSB_DT_DEVICE_SIZE = 18;
    const LIBUSB_DT_CONFIG_SIZE = 9;
    const LIBUSB_DT_INTERFACE_SIZE = 9;
    const LIBUSB_DT_ENDPOINT_SIZE = 7;
    const LIBUSB_DT_ENDPOINT_AUDIO_SIZE = 9;/* Audio extension */
    const LIBUSB_DT_HUB_NONVAR_SIZE = 7;
    const LIBUSB_DT_SS_ENDPOINT_COMPANION_SIZE = 6;
    const LIBUSB_DT_BOS_SIZE = 5;
    const LIBUSB_DT_DEVICE_CAPABILITY_SIZE = 3;

    /** \ingroup libusb_desc
     * Descriptor types as defined by the USB specification. */

    /** Device descriptor. See libusb_device_descriptor. */
    const LIBUSB_DT_DEVICE = 0x01;

    /** Configuration descriptor. See libusb_config_descriptor. */
    const LIBUSB_DT_CONFIG = 0x02;

    /** String descriptor */
    const LIBUSB_DT_STRING = 0x03;

    /** Interface descriptor. See libusb_interface_descriptor. */
    const LIBUSB_DT_INTERFACE = 0x04;

    /** Endpoint descriptor. See libusb_endpoint_descriptor. */
    const LIBUSB_DT_ENDPOINT = 0x05;

    /** BOS descriptor */
    const LIBUSB_DT_BOS = 0x0f;

    /** Device Capability descriptor */
    const LIBUSB_DT_DEVICE_CAPABILITY = 0x10;

    /** HID descriptor */
    const LIBUSB_DT_HID = 0x21;

    /** HID report descriptor */
    const LIBUSB_DT_REPORT = 0x22;

    /** Physical descriptor */
    const LIBUSB_DT_PHYSICAL = 0x23;

    /** Hub descriptor */
    const LIBUSB_DT_HUB = 0x29;

    /** SuperSpeed Hub descriptor */
    const LIBUSB_DT_SUPERSPEED_HUB = 0x2a;

    /** SuperSpeed Endpoint Companion descriptor */
    const LIBUSB_DT_SS_ENDPOINT_COMPANION = 0x30;

    const HID_IN_EP = 0x81;
    const HID_OUT_EP = 0x02;

    const LIBUSB_RECIPIENT_DEVICE = 0x00;
    /** Interface */
    const LIBUSB_RECIPIENT_INTERFACE = 0x01;
    /** Endpoint */
    const LIBUSB_RECIPIENT_ENDPOINT = 0x02;
    /** Other */
    const LIBUSB_RECIPIENT_OTHER = 0x03;

    /** Standard */
    const LIBUSB_REQUEST_TYPE_STANDARD = (0x00 << 5);
    /** Class */
    const LIBUSB_REQUEST_TYPE_CLASS = (0x01 << 5);
    /** Vendor */
    const LIBUSB_REQUEST_TYPE_VENDOR = (0x02 << 5);
    /** Reserved */
    const LIBUSB_REQUEST_TYPE_RESERVED = (0x03 << 5);

    const LIBUSB_ENDPOINT_ADDRESS_MASK = 0x0f;	/* in bEndpointAddress */
    const LIBUSB_ENDPOINT_DIR_MASK = 0x80;

    /** Out: host-to-device */
    const LIBUSB_ENDPOINT_OUT = 0x00;
    /** In: device-to-host */
    const LIBUSB_ENDPOINT_IN = 0x80;

    /** Control transfer */
    const LIBUSB_TRANSFER_TYPE_CONTROL = 0;
    /** Isochronous transfer */
    const LIBUSB_TRANSFER_TYPE_ISOCHRONOUS = 1;
    /** Bulk transfer */
    const LIBUSB_TRANSFER_TYPE_BULK = 2;
    /** Interrupt transfer */
    const LIBUSB_TRANSFER_TYPE_INTERRUPT = 3;
    /** Bulk stream transfer */
    const LIBUSB_TRANSFER_TYPE_BULK_STREAM = 4;


    let USBDeviceStringDescription = new protobuf.Type("USBDeviceStringDescription")
    USBDeviceStringDescription.add(new protobuf.Field("productName", 1, "bytes"));
    USBDeviceStringDescription.add(new protobuf.Field("manufacturerName", 2, "bytes"));

    let USBFunctionReturn = new protobuf.Type("USBFunctionReturn");
    USBFunctionReturn.add(new protobuf.Field("device", 1, "uint32"))
    USBFunctionReturn.add(new protobuf.Field("functionIdx", 2, "uint32"))
    USBFunctionReturn.add(new protobuf.Field("code", 3, "uint32"))
    USBFunctionReturn.add(new protobuf.Field("executionIdx", 4, "uint32"))
    USBFunctionReturn.add(new protobuf.Field("data", 5, "bytes"))
    //new protobuf.Root().define("USBFunctionReturn").add(USBFunctionReturn);

    let USBDeviceDescription = new protobuf.Type("USBDeviceDescription");
    USBDeviceDescription.add(new protobuf.Field("bLength", 1, "uint32"))
    USBDeviceDescription.add(new protobuf.Field("bDescriptorType", 2, "uint32"))
    USBDeviceDescription.add(new protobuf.Field("bcdUSB", 3, "uint32"))
    USBDeviceDescription.add(new protobuf.Field("bDeviceClass", 4, "uint32"))
    USBDeviceDescription.add(new protobuf.Field("bDeviceSubClass", 5, "uint32"))
    USBDeviceDescription.add(new protobuf.Field("bDeviceProtocol", 6, "uint32"))
    USBDeviceDescription.add(new protobuf.Field("bMaxPacketSize0", 7, "uint32"))
    USBDeviceDescription.add(new protobuf.Field("idVendor", 8, "uint32"))
    USBDeviceDescription.add(new protobuf.Field("idProduct", 9, "uint32"))
    USBDeviceDescription.add(new protobuf.Field("bcdDevice", 10, "uint32"))
    USBDeviceDescription.add(new protobuf.Field("iManufacturer", 11, "uint32"))
    USBDeviceDescription.add(new protobuf.Field("iProduct", 12, "uint32"))
    USBDeviceDescription.add(new protobuf.Field("iSerialNumber", 13, "uint32"))
    USBDeviceDescription.add(new protobuf.Field("bNumConfigurations", 14, "uint32"))
    USBDeviceDescription.add(new protobuf.Field("uniqueId", 15, "uint32"))

    let USBDeviceSettings = new protobuf.Type("USBDeviceSettings");
    USBDeviceSettings.add(new protobuf.Field("deviceBusNumber", 1, "uint32"))
    USBDeviceSettings.add(new protobuf.Field("deviceAddress", 2, "uint32"))

    let USBDeviceEndpoint = new protobuf.Type("USBDeviceEndpoint");
    USBDeviceEndpoint.add(new protobuf.Field("bLength", 1, "uint32"))
    USBDeviceEndpoint.add(new protobuf.Field("bDescriptorType", 2, "uint32"))
    USBDeviceEndpoint.add(new protobuf.Field("bEndpointAddress", 3, "uint32"))
    USBDeviceEndpoint.add(new protobuf.Field("bmAttributes", 4, "uint32"))
    USBDeviceEndpoint.add(new protobuf.Field("wMaxPacketSize", 5, "uint32"))
    USBDeviceEndpoint.add(new protobuf.Field("bInterval", 6, "uint32"))
    USBDeviceEndpoint.add(new protobuf.Field("bRefresh", 7, "uint32"))
    USBDeviceEndpoint.add(new protobuf.Field("bSynchAddress", 8, "uint32"))
    USBDeviceEndpoint.add(new protobuf.Field("extra", 9, "bytes"))

    let USBDeviceInterface = new protobuf.Type("USBDeviceInterface");
    USBDeviceInterface.add(new protobuf.Field("bLength", 1, "uint32"))
    USBDeviceInterface.add(new protobuf.Field("bDescriptorType", 2, "uint32"))
    USBDeviceInterface.add(new protobuf.Field("bInterfaceNumber", 3, "uint32"))
    USBDeviceInterface.add(new protobuf.Field("bAlternateSetting", 4, "uint32"))
    USBDeviceInterface.add(new protobuf.Field("bNumEndpoints", 5, "uint32"))
    USBDeviceInterface.add(new protobuf.Field("bInterfaceClass", 6, "uint32"))
    USBDeviceInterface.add(new protobuf.Field("bInterfaceSubClass", 7, "uint32"))
    USBDeviceInterface.add(new protobuf.Field("bInterfaceProtocol", 8, "uint32"))
    USBDeviceInterface.add(new protobuf.Field("iInterface", 9, "uint32"))
    USBDeviceInterface.add(new protobuf.Field("endpoint", 10, "USBDeviceEndpoint", "repeated"))
    USBDeviceInterface.add(new protobuf.Field("extra", 11, "bytes"))

    let USBDeviceAltSetting = new protobuf.Type("USBDeviceAltSetting");
    USBDeviceAltSetting.add(new protobuf.Field("alternates", 1, "USBDeviceInterface", "repeated"))
    USBDeviceAltSetting.add(new protobuf.Field("interfaceNumber", 2, "uint32"))

    let USBDeviceConfiguration = new protobuf.Type("USBDeviceConfiguration");
    USBDeviceConfiguration.add(new protobuf.Field("interfaces", 1, "USBDeviceAltSetting", "repeated"))

    let USBDeviceAttached = new protobuf.Type("USBDeviceAttached");
    USBDeviceAttached.add(new protobuf.Field("description", 1, "bytes"))
    USBDeviceAttached.add(new protobuf.Field("settings", 2, "bytes"))
    USBDeviceAttached.add(new protobuf.Field("configuration", 3, "bytes"))
    USBDeviceAttached.add(new protobuf.Field("stringDescription", 4, "bytes"))

    let USBDeviceControlTransfer = new protobuf.Type("USBDeviceControlTransfer");
    USBDeviceControlTransfer.add(new protobuf.Field("requestType", 1, "uint32"))
    USBDeviceControlTransfer.add(new protobuf.Field("bRequest", 2, "uint32"))
    USBDeviceControlTransfer.add(new protobuf.Field("wValue", 3, "uint32"))
    USBDeviceControlTransfer.add(new protobuf.Field("wIndex", 4, "uint32"))
    USBDeviceControlTransfer.add(new protobuf.Field("wLength", 5, "uint32"))
    USBDeviceControlTransfer.add(new protobuf.Field("data", 6, "bytes"))
    USBDeviceControlTransfer.add(new protobuf.Field("timeout", 7, "uint32"))

    let USBDeviceClearHalt = new protobuf.Type("USBDeviceClearHalt");
    USBDeviceClearHalt.add(new protobuf.Field("endpoint", 1, "uint32"))

    let USBDeviceIsoPacketDesc = new protobuf.Type("USBDeviceIsoPacketDesc");
    USBDeviceIsoPacketDesc.add(new protobuf.Field("length", 1, "uint32"))
    USBDeviceIsoPacketDesc.add(new protobuf.Field("actual_length", 2, "uint32"))
    USBDeviceIsoPacketDesc.add(new protobuf.Field("status", 3, "uint32"))

    let USBDeviceIsoPacketValue = new protobuf.Type("USBDeviceIsoPacketValue");
    USBDeviceIsoPacketValue.add(new protobuf.Field("iso_packets", 1, "USBDeviceIsoPacketDesc", "repeated"))

    let USBDeviceSubmitTransfer = new protobuf.Type("USBDeviceSubmitTransfer");
    USBDeviceSubmitTransfer.add(new protobuf.Field("flags", 1, "uint32"))
    USBDeviceSubmitTransfer.add(new protobuf.Field("endpoint", 2, "uint32"))
    USBDeviceSubmitTransfer.add(new protobuf.Field("type_", 3, "uint32"))
    USBDeviceSubmitTransfer.add(new protobuf.Field("timeout", 4, "uint32"))
    USBDeviceSubmitTransfer.add(new protobuf.Field("status", 5, "uint32"))
    USBDeviceSubmitTransfer.add(new protobuf.Field("length", 6, "uint32"))
    USBDeviceSubmitTransfer.add(new protobuf.Field("actual_length", 7, "uint32"))
    USBDeviceSubmitTransfer.add(new protobuf.Field("buffer", 8, "bytes"))
    USBDeviceSubmitTransfer.add(new protobuf.Field("num_iso_packets", 9, "uint32"))
    USBDeviceSubmitTransfer.add(new protobuf.Field("iso_packet_desc", 10, "bytes"))

    let USBDeviceClaimInterface = new protobuf.Type("USBDeviceClaimInterface");
    USBDeviceClaimInterface.add(new protobuf.Field("interface_number", 1, "uint32"))

    let USBDeviceReleaseInterface = new protobuf.Type("USBDeviceReleaseInterface");
    USBDeviceReleaseInterface.add(new protobuf.Field("interface_number", 1, "uint32"))

    let USBDeviceSelectConfiguration = new protobuf.Type("USBDeviceSelectConfiguration");
    USBDeviceSelectConfiguration.add(new protobuf.Field("configuration", 1, "uint32"))

    let USBDeviceInterfaceAltSetting = new protobuf.Type("USBDeviceInterfaceAltSetting");
    USBDeviceInterfaceAltSetting.add(new protobuf.Field("dev_interface", 1, "uint32"))
    USBDeviceInterfaceAltSetting.add(new protobuf.Field("alt_setting", 2, "uint32"))

    let USBDeviceEventDisconnect = new protobuf.Type("USBDeviceEventDisconnect");
    USBDeviceEventDisconnect.add(new protobuf.Field("device_idx", 1, "uint32"));
    USBDeviceEventDisconnect.add(new protobuf.Field("idVendor", 2, "uint32"));
    USBDeviceEventDisconnect.add(new protobuf.Field("idProduct", 3, "uint32"));

    const USB_FUNCTION_DEVICE_ATTACHMENT = 1;
    const USB_FUNCTION_DEVICE_OPEN = 2;
    const USB_FUNCTION_DEVICE_CLOSE = 3;
    const USB_FUNCTION_DEVICE_CONTROL_TRANSFER = 4;
    const USB_FUNCTION_DEVICE_RESET = 5;
    const USB_FUNCTION_DEVICE_CLEAR_HALT = 6;
    const USB_FUNCTION_DEVICE_SUBMIT_TRANSFER = 7;
    const USB_FUNCTION_DEVICE_RELEASE_INTERFACE = 8;
    const USB_FUNCTION_DEVICE_CLAIM_INTERFACE = 9;
    const USB_FUNCTION_DEVICE_SELECT_CONFIGURATION = 10;
    const USB_FUNCTION_DEVICE_INTERFACE_ALT_SETTING = 11;

    const USB_FUNCTION_DEVICE_EVENT_DISCONNECT = 20;
    (function USBLoader() {
        // -- PRIVATE VARIABLES ************************************************************************************************
        var _ref = this;
        var _initialized = false;
        var _device = null;
        var _devices = [];
        var _staging = [];
        var _componentRef = null;
        // -- END PRIVATE VARIABLES ********************************************************************************************
        // -- PRIVATE METHODS **************************************************************************************************

        function initialize() {
            _componentRef = new Thinfinity.Component({
                events: {
                    'ready': onComponentReady,
                    'destroy': onComponentsDisposed
                }
            });
        }
        function getComponent(name) {
            return new Promise((resolve, reject) => {
                _componentRef.getAsyncRegisteredObject(name).then(resolve).catch((msg) => {
                    var msg = `${name} component is undefined or null, please define component first.`;
                    helper.console.warning(msg, arguments);
                    reject(msg);
                });
            });
        }
        function loadJS(url) {
            return new Promise((resolve, reject) => {
                try {
                    if (typeof url === "string" && url.length > 0) helper.dom.loadScript(url, resolve, reject);
                    else reject({ 'error': -1, 'message': 'URL is not valid' });
                } catch (err) {
                    reject(err);
                }
            });
        }

        function create_out_buffer(size)
        {
            return new Uint8Array(size);
        }

        function list_connected_devices()
        {
            let usb = navigator.usb;
            if (usb === null) return;
            usb.getDevices().then(devices => {
                for (let dev in devices)
                    notify_usb_connected(devices[dev]);
            }); // no filters, show all attachable devices
        }

        function libusb_get_device_list(ctx, list)
        {
            helper.console.debug(">> libusb_get_device_list")
            /*if (pick_device() < 0)
                return LIBUSB_ERROR_NO_DEVICE;
            let dev = self._device;*/

            let dev = navigator.usb.getDevices();
            if ((dev == null) || (dev.length == 0))
                return LIBUSB_ERROR_NO_DEVICE;

            dev_list = []
            for (let i = 0; i < dev.length; i++)
            {
                let dev_id = i;
                dev_list.push(dev_id);
            }

            self._devices = dev_list;
        }

        function getEnpointAttributesFromTransferType(transfer_type)
        {
            if (transfer_type.toLowerCase() == "interrupt")
                return 3;
            if (transfer_type.toLowerCase() == "bulk")
                return 2;
            if (transfer_type.toLowerCase() == "isochronous")
                return 1;
            if (transfer_type.toLowerCase() == "control")
                return 0;
            // default return 3
            return 3;
        }

        function libusb_get_device_descriptor(device_idx)
        {
            helper.console.debug(">> ["+device_idx+"] libusb_get_device_descriptor")
            let devices = _devices;

            if (!devices)
                return LIBUSB_ERROR_INVALID_PARAM;

            let dev = devices[device_idx];
            if (!dev)
                return LIBUSB_ERROR_INVALID_PARAM;
            helper.console.debug(dev);

            if (0 == dev.configurations.length) // has no interfaces
                return LIBUSB_ERROR_NOT_SUPPORTED;

            var desc = USBDeviceDescription.create({
                "bLength": LIBUSB_DT_DEVICE_SIZE,
                "bDescriptorType": LIBUSB_DT_DEVICE,
                "bcdUSB": (dev.usbVersionMajor << 8) | dev.usbVersionMinor,
                "bDeviceClass": dev.deviceClass,
                "bDeviceSubClass": dev.deviceSubclass,
                "bDeviceProtocol": dev.deviceProtocol,
                "bMaxPacketSize0": 64,
                "idVendor": dev.vendorId,
                "idProduct": dev.productId,
                "bcdDevice": (dev.deviceVersionMajor << 8) | (dev.deviceVersionMinor << 4) | (dev.deviceVersionSubminor),
                "iManufacturer": LIBUSB_MANUFACTURER_ID,
                "iProduct": LIBUSB_PRODUCT_ID,
                "iSerialNumber": LIBUSB_SN_ID,
                "bNumConfigurations": dev.configurations.length,
                "uniqueId": device_idx,
            });

            var enc = new TextEncoder();
            var strDesc = USBDeviceStringDescription.create({
                "productName": enc.encode(dev.productName),
                "manufacturerName": enc.encode(dev.manufacturerName)
            })

            var settings = USBDeviceSettings.create({
                "deviceBusNumber": 1,
                "deviceAddress": device_idx,
            })

            let configuration_bytes = null;

            try {
                USBDeviceConfiguration.add(USBDeviceAltSetting)
                try{
                    USBDeviceAltSetting.add(USBDeviceInterface)
                    try{
                        USBDeviceInterface.add(USBDeviceEndpoint)

                        var config = USBDeviceConfiguration.create({
                            "interfaces": [],
                        })

                        for (let interf of dev.configurations[0].interfaces)
                        {
                            let devAltSetting = USBDeviceAltSetting.create({
                                "alternates": [],
                                "interfaceNumber": interf.interfaceNumber,
                            })
                            let interfaceNumber = 0;

                            for (let altsetting of interf.alternates)
                            {
                                let usbintf = USBDeviceInterface.create({
                                    "bLength": LIBUSB_DT_INTERFACE_SIZE,
                                    "bDescriptorType": LIBUSB_DT_INTERFACE,
                                    "bInterfaceNumber": interfaceNumber++,
                                    "bAlternateSetting": altsetting.alternateSetting,
                                    "bNumEndpoints": altsetting.endpoints.length,
                                    "bInterfaceClass": altsetting.interfaceClass,
                                    "bInterfaceSubClass": altsetting.interfaceSubclass,
                                    "bInterfaceProtocol": altsetting.interfaceProtocol,
                                    "iInterface": 0,
                                    "endpoint": [],
                                    "extra": '',
                                });

                                for (let endpnt of altsetting.endpoints)
                                {
                                    usbintf.endpoint.push(USBDeviceEndpoint.create({
                                        "bLength": LIBUSB_DT_ENDPOINT_SIZE,
                                        "bDescriptorType": LIBUSB_DT_ENDPOINT,
                                        "bEndpointAddress": (endpnt.direction.toLowerCase() == "in" ? 0x80 : 0x00) | endpnt.endpointNumber,
                                        "bmAttributes": getEnpointAttributesFromTransferType(endpnt.type),
                                        "wMaxPacketSize": endpnt.packetSize,
                                        "bInterval": 10,
                                        "bRefresh": 0,
                                        "bSynchAddress": 0,
                                        "extra": '',
                                    }));
                                }
                                devAltSetting.alternates.push(usbintf);
                            }
                            config.interfaces.push(devAltSetting);
                        }
                        configuration_bytes = USBDeviceConfiguration.encode(config).finish();
                    }
                    finally {
                        USBDeviceInterface.remove(USBDeviceEndpoint);
                    }
                }
                finally {
                    USBDeviceAltSetting.remove(USBDeviceInterface);
                }
            }
            finally {
                USBDeviceConfiguration.remove(USBDeviceAltSetting);
            }

            let devatt = USBDeviceAttached.create({
                "description": USBDeviceDescription.encode(desc).finish(),
                "settings": USBDeviceSettings.encode(settings).finish(),
                "configuration": configuration_bytes,
                "stringDescription": USBDeviceStringDescription.encode(strDesc).finish(),
            });

            var funcReturn = USBFunctionReturn.create({
                "device": device_idx,
                "functionIdx": USB_FUNCTION_DEVICE_ATTACHMENT,
                "executionIdx": 0,
                "code": 0,
                "data": USBDeviceAttached.encode(devatt).finish()
            });

            return USBFunctionReturn.encode(funcReturn).finish();
        }

        async function libusb_open(device_idx)
        {
            helper.console.debug(">> ["+device_idx+"] libusb_open")
            let devices = _devices;

            if (!devices)
                return LIBUSB_ERROR_INVALID_PARAM;

            let dev = devices[device_idx];
            if (!dev)
                return LIBUSB_ERROR_INVALID_PARAM;

            await dev.open();

            self._device = dev;
            helper.console.debug("Device opened: "+dev)

            return LIBUSB_SUCCESS;
        }

        async function libusb_close(device_idx)
        {
            helper.console.debug(">> ["+device_idx+"] libusb_close")
            let devices = _devices;

            if (!devices)
                return LIBUSB_ERROR_INVALID_PARAM;

            let dev = devices[device_idx];
            if (!dev)
                return LIBUSB_ERROR_INVALID_PARAM;

            await dev.close();
            return LIBUSB_SUCCESS;
        }

        function libusb_get_string_descriptor_ascii(device_idx, desc_index)
        {
            helper.console.debug(">> ["+device_idx+"] libusb_get_string_descriptor_ascii")
            // this function should be in Delphi
            let devices = _devices;

            if (!devices)
                return LIBUSB_ERROR_INVALID_PARAM;

            let dev = devices[device_idx];
            if (!dev)
                return LIBUSB_ERROR_INVALID_PARAM;

            dev.productName;
            dev.manufacturerName
            dev.serialNumber

        }

        async function libusb_set_configuration(device_idx, configuration) // configuration is a number
        {
            helper.console.debug(">> ["+device_idx+"] libusb_set_configuration")
            let devices = _devices;

            if (!devices)
                return LIBUSB_ERROR_INVALID_PARAM;

            let dev = devices[device_idx];
            if (!dev)
                return LIBUSB_ERROR_INVALID_PARAM;

            await dev.selectConfiguration(configuration);
            return LIBUSB_SUCCESS;
        }

        async function libusb_claim_interface(device_idx, interface_number)
        {
            helper.console.debug(">> ["+device_idx+"] libusb_claim_interface number="+interface_number);
            let devices = _devices;

            if (!devices)
                return LIBUSB_ERROR_INVALID_PARAM;

            let dev = devices[device_idx];
            if (!dev)
                return LIBUSB_ERROR_INVALID_PARAM;


            await dev.claimInterface(interface_number);
            return LIBUSB_SUCCESS;
        }

        async function libusb_release_interface(device_idx, interface_number)
        {
            helper.console.debug(">> ["+device_idx+"] libusb_release_interface number="+interface_number)
            let devices = _devices;

            if (!devices)
                return LIBUSB_ERROR_INVALID_PARAM;

            let dev = devices[device_idx];
            if (!dev)
                return LIBUSB_ERROR_INVALID_PARAM;

            await dev.releaseInterface(interface_number);
            return LIBUSB_SUCCESS;
        }

        async function libusb_control_transfer(device_idx, request_type, bRequest, wValue, wIndex, wLength, data, timeout) // timeout is not used
        {
            helper.console.debug(">> ["+device_idx+"] libusb_control_transfer request_type:"+request_type+"-bRequest:"+bRequest+"-wValue:"+wValue+"-wLength:"+wLength)
            let devices = _devices;

            if (!devices)
                return LIBUSB_ERROR_INVALID_PARAM;

            let dev = devices[device_idx];
            if (!dev)
                return LIBUSB_ERROR_INVALID_PARAM;

            try {

                setup = { "request": bRequest, "value": wValue, "index": wIndex };

                switch (request_type & 0x1F) {
                    case LIBUSB_RECIPIENT_DEVICE:
                        setup["recipient"] = "device";
                        break;
                    case LIBUSB_RECIPIENT_INTERFACE:
                        setup["recipient"] = "interface";
                        break;
                    case LIBUSB_RECIPIENT_ENDPOINT:
                        setup["recipient"] = "endpoint";
                        break;
                    case LIBUSB_RECIPIENT_OTHER:
                        setup["recipient"] = "other";
                        break;
                    default:
                        helper.console.error("Unexpected request type: "+(request_type & 0x31));
                        return LIBUSB_ERROR_INVALID_PARAM;
                }

                switch (request_type & 0x60) {
                    case LIBUSB_REQUEST_TYPE_STANDARD:
                        setup["requestType"] = "standard";
                        break;
                    case LIBUSB_REQUEST_TYPE_CLASS:
                        setup["requestType"] = "class";
                        break;
                    case LIBUSB_REQUEST_TYPE_VENDOR:
                        setup["requestType"] = "vendor";
                        break;
                    default:
                    //case LIBUSB_REQUEST_TYPE_RESERVED:
                        return LIBUSB_ERROR_INVALID_PARAM;
                }

                if ((request_type & LIBUSB_ENDPOINT_DIR_MASK) == LIBUSB_ENDPOINT_IN) {

                    helper.console.debug("Calling ["+device_idx+"] controlTransferIn with setup: "+JSON.stringify(setup));
                    let res = await dev.controlTransferIn(setup, wLength);
                    if (res.status.toLowerCase() != "ok")
                        return LIBUSB_ERROR_IO;

                    //return LIBUSB_SUCCESS;
                    helper.console.debug("controlTransferIn result: "+JSON.stringify(res.data.buffer));
                    return res.data.buffer;
                }

                if ((request_type & LIBUSB_ENDPOINT_DIR_MASK) == LIBUSB_ENDPOINT_OUT) {
                    let buf = create_out_buffer(wLength);
                    let res = await dev.controlTransferOut(setup, buf);

                    if (res.status.toLowerCase() == "ok")
                        return LIBUSB_ERROR_IO;

                    return res.bytesWritten;
                }
            } catch (error) {
                helper.console.error("Unexpected error in libusb_control_transfer: "+error);
            }

            return LIBUSB_ERROR_OTHER;
        }

        async function libusb_clear_halt(device_idx, endpoint)
        {
            let direction = ((endpoint & LIBUSB_ENDPOINT_DIR_MASK) & LIBUSB_ENDPOINT_OUT) ? "out" : "in";
            let num = endpoint & ~LIBUSB_ENDPOINT_DIR_MASK;

            helper.console.debug(">> ["+device_idx+"] libusb_clear_halt - endpoint:"+num+" - direction:"+direction);
            let devices = _devices;

            if (!devices)
                return LIBUSB_ERROR_INVALID_PARAM;

            let dev = devices[device_idx];
            if (!dev)
                return LIBUSB_ERROR_INVALID_PARAM;

            await dev.clearHalt(direction, num);

            return LIBUSB_SUCCESS;
        }

        async function libusb_submit_transfer(device_idx, transfer)
        {
            helper.console.debug(">> ["+device_idx+"] libusb_submit_transfer")
            let devices = _devices;

            if (!devices)
                return LIBUSB_ERROR_INVALID_PARAM;

            let dev = devices[device_idx];
            if (!dev)
                return LIBUSB_ERROR_INVALID_PARAM;

            let num = transfer.endpoint & ~LIBUSB_ENDPOINT_DIR_MASK;
            if ((transfer.endpoint & LIBUSB_ENDPOINT_DIR_MASK) == LIBUSB_ENDPOINT_IN) {
                helper.console.debug("calling ["+device_idx+"] transferIn for endpoint:"+num+"-length:"+transfer.length+"-type:"+transfer.type_);
                switch(transfer.type_) {
                    case LIBUSB_TRANSFER_TYPE_INTERRUPT:
                    case LIBUSB_TRANSFER_TYPE_BULK:
                    {
                        let res = await dev.transferIn(num, transfer.length);
                        if (res.status.toLowerCase() != "ok")
                            return LIBUSB_ERROR_IO;

                        transfer.actual_length = res["data"]["buffer"]["byteLength"];
                        return res["data"]["buffer"];
                    }
                    case LIBUSB_TRANSFER_TYPE_BULK_STREAM:
                        helper.console.error("Not implemented: IN LIBUSB_TRANSFER_TYPE_BULK_STREAM");
                        return LIBUSB_ERROR_NOT_SUPPORTED;
                    case LIBUSB_TRANSFER_TYPE_CONTROL:
                        helper.console.error("Not implemented: IN LIBUSB_TRANSFER_TYPE_CONTROL");
                        return LIBUSB_ERROR_NOT_SUPPORTED;
                    case LIBUSB_TRANSFER_TYPE_ISOCHRONOUS:
                        helper.console.error("Not implemented: IN LIBUSB_TRANSFER_TYPE_ISOCHRONOUS");
                        return LIBUSB_ERROR_NOT_SUPPORTED;
                }
            }

            if ((transfer.endpoint & LIBUSB_ENDPOINT_DIR_MASK) == LIBUSB_ENDPOINT_OUT) {
                helper.console.debug("["+device_idx+"] calling transferOut for endpoint:"+num+"-length:"+transfer.length+"-type:"+transfer.type_);
                switch(transfer.type_) {
                    case LIBUSB_TRANSFER_TYPE_INTERRUPT:
                    case LIBUSB_TRANSFER_TYPE_BULK:
                        let res = await dev.transferOut(num, transfer.buffer);
                        return LIBUSB_SUCCESS;
                    case LIBUSB_TRANSFER_TYPE_BULK_STREAM:
                        helper.console.error("Not implemented: OUT LIBUSB_TRANSFER_TYPE_BULK_STREAM");
                        return LIBUSB_ERROR_NOT_SUPPORTED;
                    case LIBUSB_TRANSFER_TYPE_CONTROL:
                        helper.console.error("Not implemented: OUT LIBUSB_TRANSFER_TYPE_CONTROL");
                        return LIBUSB_ERROR_NOT_SUPPORTED;
                    case LIBUSB_TRANSFER_TYPE_ISOCHRONOUS:
                        helper.console.error("Not implemented: OUT LIBUSB_TRANSFER_TYPE_ISOCHRONOUS");
                        return LIBUSB_ERROR_NOT_SUPPORTED;
                }
            }

            return LIBUSB_ERROR_OTHER;
        }

        async function libusb_reset_device(device_idx)
        {
            helper.console.debug(">> libusb_reset_device idx="+device_idx)
            let devices = _devices;

            if (!devices)
                return LIBUSB_ERROR_INVALID_PARAM;

            let dev = devices[device_idx];
            if (!dev)
                return LIBUSB_ERROR_INVALID_PARAM;

            await dev.reset();

            return LIBUSB_SUCCESS;
        }


        function libusb_set_interface_alt_setting(device_idx, interface_number, alternate_setting)
        {
            helper.console.debug(">> ["+device_idx+"] libusb_set_interface_alt_setting alternate_setting="+alternate_setting)
            let devices = _devices;

            if (!devices)
                return LIBUSB_ERROR_INVALID_PARAM;

            let dev = devices[device_idx];
            if (!dev)
                return LIBUSB_ERROR_INVALID_PARAM;

            dev.selectAlternateInterface(interface_number, alternate_setting);

            return LIBUSB_SUCCESS;
        }

        function initializeUSB() {
            helper.console.debug(">> initializeUSB")
            // -- Remove reference to external object.
            self._initialized = true;
        }

        function get_device_index(device)
        {
            let newDevIdx = -1;
            for (let i = 0; i < _devices.length; i++)
            {
                let curr_dev = _devices[i];
                if ((curr_dev.productId == device.productId) && (curr_dev.vendorId == device.vendorId))
                {
                    if (typeof(curr_dev.serialNumber != "undefined") && typeof(device.serialNumber != "undefined") && (curr_dev.serialNumber == device.serialNumber))
                        newDevIdx = i;
                    else
                    if (typeof(curr_dev.serialNumber == "undefined") && typeof(device.serialNumber == "undefined"))
                        newDevIdx = i;
                    if (newDevIdx != -1)
                        break;
                }
            }
            helper.console.debug(">> get_device_index for dev: "+ device.productName + ", serial number " + device.serialNumber + " - index: "+newDevIdx);
            return newDevIdx;
        }

        function notify_usb_connected(device)
        {
            self._device = device;
            let newDevIdx = get_device_index(device);
            if (newDevIdx == -1)
                newDevIdx = _devices.push(device) - 1;
            else
                _devices[newDevIdx] = device;

            let desc = libusb_get_device_descriptor(newDevIdx);
            helper.console.debug(desc);

            THIN.wsSend(null, 2, desc);
        }

        function notify_usb_disconnected(device)
        {
            self._device = device;
            let device_idx = get_device_index(device);
            if (device_idx == -1)
                return;

            var evDisc = USBDeviceEventDisconnect.create({
                "device_idx": device_idx,
                "idVendor": device.vendorId,
                "idProduct": device.productId,
            });

            var funcReturn = USBFunctionReturn.create({
                "device": device_idx,
                "functionIdx": USB_FUNCTION_DEVICE_EVENT_DISCONNECT,
                "executionIdx": 0,
                "code": 0,
                "data": USBDeviceEventDisconnect.encode(evDisc).finish()
            });


            THIN.wsSend(null, 2,  USBFunctionReturn.encode(funcReturn).finish());
        }

        function connectUSB()
        {
            helper.console.debug("USB connected");
            let usb = navigator.usb;
            if ((usb === null) || (typeof(usb) == "undefined")) return;
            usb.requestDevice({ filters: [] }).then(device => {
                notify_usb_connected(device);
            });

            navigator.usb.getDevices().then(devices => {
                helper.console.debug("Total devices: " + devices.length);
                devices.forEach(device => {
                    helper.console.debug("Product name: " + device.productName + ", serial number " + device.serialNumber);
                });
            });

            libusb_get_device_list(1,2);
            //pick_device();
        }

        function requireComponent(name) {
            return new Promise((resolve, reject) => {
                let max = 15, count = 0;
                let intervalId = setInterval(() => {
                    let comp = _componentRef.getRegisteredObject(name);
                    if (comp) {
                        clearInterval(intervalId);
                        resolve(comp);
                    } else if (count > max) reject(null);
                    count++;
                }, 100);
            });
        }

        function answerFunctionResultCode(device_idx, executionIdx, functionIdx, resultCode) {
            var funcReturn = USBFunctionReturn.create({
                "device": device_idx,
                "functionIdx": functionIdx,
                "executionIdx": executionIdx,
                "code": resultCode,
                "data": ''
            });

            let desc = USBFunctionReturn.encode(funcReturn).finish();
            THIN.wsSend(null, 2, desc);
            helper.console.debug("answerFunctionResultCode was send for executionIdx: "+executionIdx+"-resultCode:"+resultCode);
        }

        function answerFunctionResultCodeData(device_idx, executionIdx, functionIdx, resultCode, resultData) {
            var funcReturn = USBFunctionReturn.create({
                "device": device_idx,
                "functionIdx": functionIdx,
                "executionIdx": executionIdx,
                "code": resultCode,
                "data": new Uint8Array(resultData),
            });

            let desc = USBFunctionReturn.encode(funcReturn).finish();
            THIN.wsSend(null, 2, desc);
            helper.console.debug("answerFunctionResultCodeData was send for executionIdx: "+executionIdx);
        }

        function getFunctionName(function_idx)
        {
            switch (function_idx) {
                case USB_FUNCTION_DEVICE_OPEN: return "libusb_open";
                case USB_FUNCTION_DEVICE_CLOSE: return "libusb_close";
                case USB_FUNCTION_DEVICE_CONTROL_TRANSFER: return "libusb_control_transfer";
                case USB_FUNCTION_DEVICE_RESET: return "libusb_reset_device";
                case USB_FUNCTION_DEVICE_CLEAR_HALT: return "libusb_clear_halt";
                case USB_FUNCTION_DEVICE_SUBMIT_TRANSFER: return "libusb_submit_transfer";
                case USB_FUNCTION_DEVICE_RELEASE_INTERFACE: return "libusb_release_interface";
                case USB_FUNCTION_DEVICE_CLAIM_INTERFACE: return "libusb_claim_interface";
                case USB_FUNCTION_DEVICE_SELECT_CONFIGURATION: return "libusb_set_configuration";
                case USB_FUNCTION_DEVICE_INTERFACE_ALT_SETTING: return "libusb_set_interface_alt_setting";
                default: return "Unknown ("+function_idx+")";
            }
        };

        async function handleServerData(group, data) {
            let cmd = USBFunctionReturn.decode(data);
            try {
                helper.console.debug("processing function "+getFunctionName(cmd.functionIdx));
                if (cmd.functionIdx == USB_FUNCTION_DEVICE_OPEN) {
                    answerFunctionResultCode(cmd.device, cmd.executionIdx, cmd.functionIdx, await libusb_open(cmd.device));
                } else
                if (cmd.functionIdx == USB_FUNCTION_DEVICE_CLOSE) {
                    answerFunctionResultCode(cmd.device, cmd.executionIdx, cmd.functionIdx, await libusb_close(cmd.device));
                } else
                if (cmd.functionIdx == USB_FUNCTION_DEVICE_CONTROL_TRANSFER)
                {
                    let controlTransferParameters = USBDeviceControlTransfer.decode(cmd.data);
                    // function libusb_control_transfer(request_type, bRequest, wValue, wIndex, data, timeout) // timeout is not used
                    let resultCode = await libusb_control_transfer(cmd.device, controlTransferParameters.requestType, controlTransferParameters.bRequest, controlTransferParameters.wValue, controlTransferParameters.wIndex, controlTransferParameters.wLength, controlTransferParameters.data, controlTransferParameters.timeout);
                    if (typeof(resultCode) != "number")
                        answerFunctionResultCodeData(cmd.device, cmd.executionIdx, cmd.functionIdx, 0, resultCode);
                    else
                        answerFunctionResultCodeData(cmd.device, cmd.executionIdx, cmd.functionIdx, resultCode, '');
                } else
                if (cmd.functionIdx == USB_FUNCTION_DEVICE_RESET) {
                    answerFunctionResultCode(cmd.device, cmd.executionIdx, cmd.functionIdx, await libusb_reset_device(cmd.device));
                } else
                if (cmd.functionIdx == USB_FUNCTION_DEVICE_CLEAR_HALT) {
                    let params = USBDeviceClearHalt.decode(cmd.data);
                    answerFunctionResultCode(cmd.device, cmd.executionIdx, cmd.functionIdx, await libusb_clear_halt(cmd.device, params.endpoint));
                } else
                if (cmd.functionIdx == USB_FUNCTION_DEVICE_SUBMIT_TRANSFER)
                {
                    let params = USBDeviceSubmitTransfer.decode(cmd.data);
                    let resultCode = await libusb_submit_transfer(cmd.device, params);
                    if (typeof(resultCode) != "number")
                        answerFunctionResultCodeData(cmd.device, cmd.executionIdx, cmd.functionIdx, 0, resultCode);
                    else
                        answerFunctionResultCodeData(cmd.device, cmd.executionIdx, cmd.functionIdx, resultCode, '');
                } else
                if (cmd.functionIdx == USB_FUNCTION_DEVICE_RELEASE_INTERFACE)
                {
                    let params = USBDeviceReleaseInterface.decode(cmd.data);
                    answerFunctionResultCode(cmd.device, cmd.executionIdx, cmd.functionIdx, await libusb_release_interface(cmd.device, params.interface_number));
                } else
                if (cmd.functionIdx == USB_FUNCTION_DEVICE_CLAIM_INTERFACE)
                {
                    let params = USBDeviceClaimInterface.decode(cmd.data);
                    answerFunctionResultCode(cmd.device, cmd.executionIdx, cmd.functionIdx, await libusb_claim_interface(cmd.device, params.interface_number));
                } else
                if (cmd.functionIdx == USB_FUNCTION_DEVICE_SELECT_CONFIGURATION)
                {
                    let params = USBDeviceSelectConfiguration.decode(cmd.data);
                    answerFunctionResultCode(cmd.device, cmd.executionIdx, cmd.functionIdx, await libusb_set_configuration(cmd.device, params.configuration));
                } else
                if (cmd.functionIdx == USB_FUNCTION_DEVICE_INTERFACE_ALT_SETTING)
                {
                    let params = USBDeviceInterfaceAltSetting.decode(cmd.data);
                    answerFunctionResultCode(cmd.device, cmd.executionIdx, cmd.functionIdx, await libusb_set_interface_alt_setting(cmd.device, params.dev_interface, params.alt_setting));
                }
            }
            catch (error) {
                helper.console.error("Unexpected error processing function "+getFunctionName(cmd.functionIdx)+" - error msg: "+error);
                answerFunctionResultCode(cmd.device, cmd.executionIdx, cmd.functionIdx, LIBUSB_ERROR_OTHER);
            }
        }

        function getToolbarOptionsForUSB() {
            return {
                caption: "Connect USB",
                attributes: { icon: "cyb-microphone", "class": "micBtn", id: "usbBtn" },
                parent: "Options",
                action: "connect.usb",
                handler: connectUSB
            };
            /*
              //_thinProperties.addProperty({
            //////    parent: [CAPTION | ACTION | NUMBER]
            //////    insertBefore:[CAPTION | ACTION | NUMBER],
            //////    insertAfter:/*[CAPTION | ACTION | NUMBER],
            //    insertAfter: "Refresh",
            //    attributes: { icon: "thin-microphone" },
            //    caption: "Connect USB",
            //    action: "connect.usb",
            //    handler: () => { debugger; },
            //});
             */
        }
        function onComponentReady(ev) {
			if (!THIN.rdParams.webUsb) {
				helper.console.debug("webUsb disabled in web.settings");
				return;
			}
			if (!agentInfo.isChrome) {
				helper.console.warning("Using a browser that's not chrome: disabling webusb");
				return;
			}
            // -- SOMETIMES TOOLBAR IS NOT DEFINED (ONLY IN REFRESH)
            getComponent("SCRAPER").then(comp => {
                comp.owner.registerCustomHandler(0x07, handleServerData);
                requireComponent("THIN.RDP.PROPERTIES").then(comp => {
                    if (comp && comp.addProperty) comp.addProperty(getToolbarOptionsForUSB());
                    else helper.console.warn("Properties does not support 'addProperty' method. Cannot attach USB component.", arguments);
                }).catch(() => { helper.console.warn("Cannot initialize USB component, toolbar is null or undefined", arguments); });
            }).catch(e =>{
                helper.console.warn("Toolbar getComponent error in USB. ", e);
            });

            navigator.usb.addEventListener('connect', event => {
                helper.console.debug("Device connected! IdProduct: "+event.device.productId+" - IdVendor: "+event.device.vendorId);
                notify_usb_connected(event.device);
            });

            navigator.usb.addEventListener('disconnect', event => {
                helper.console.debug("Device disconnected! IdProduct: "+event.device.productId+" - IdVendor: "+event.device.vendorId);
                notify_usb_disconnected(event.device);
            });
            // load already connected and authorized devices
            list_connected_devices();
        }

        function onComponentsDisposed() {
            /* Uninitialization */
        }
        initialize();
    })();
})();