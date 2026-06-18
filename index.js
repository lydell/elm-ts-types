export function doIt(code) {
    var f = new Function(inject(code));
    var scope = {};
    f.call(scope);
    var { Elm } = scope;
    // TODO: Proper recursive thing
    for (const key of Object.keys(Elm)) {
        console.log(key, Elm[key].init());
    }
    // TODO: Should there be one interface per namespace? Use actual namespaces?
    return "hi";
}

function inject(code) {
  return preamble +
    code
        // Delay port decoder construction until our injection has run.
        .replace(/_Platform_incomingPort\(\s+'[^']+',/g, "$& () =>")
        .replace(/^_Platform_export\(/m, (match) => `${injection}\n${match}`);
}

const preamble = `
var console = {
    log: globalThis.console.log,
    warn: function () {},
};
`.trim();

const injection = `
var proxy = new Proxy({}, {
    get: function () {
        return proxy;
    }
});

function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var ports = _Platform_setupEffects({}, function () {});
    var argsLines = [];
    if (stepperBuilder.toString().indexOf("'node'") !== -1) {
        argsLines.push("  node: Node");
    }
    if (flagDecoder.$ !== 0) {
        argsLines.push("  flags: " + decoderToString(flagDecoder));
    }
    var argsString =
        argsLines.length === 0
            ? ""
            : "args: {\\n" + argsLines.join(",\\n") + "\\n}";
    var portsString = "";
    if (ports) {
        for (var key in ports) {
            var port = ports[key];
            // TODO: Should subscribe require Promise<void>?
            var portString =
                port.type === "incoming"
                    ? "{\\n        send: (value: " + port.value + ") => void\\n      }"
                    : "{\\n        subscribe: (f: (value: " + port.value + ") => void) => void\\n        unsubscribe: (f: (value: " + port.value + ") => void) => void\\n      }";
            portsString += "\\n      " + JSON.stringify(key) + ": " + portString + ",";
        }
    }
    var returnTypeString =
        ports
            ? "{\\n    ports: {" + portsString + "\\n    }\\n  }"
            : "Record<string, never>";
    return "export function init(" + argsString + "): " + returnTypeString;
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
    return "export function init(args: { node: Node }): Record<string, never>;"
});

function _Platform_setupIncomingPort(name) {
	return {
        type: "incoming",
        name: name,
        value: decoderToString(_Platform_effectManagers[name].u())
    };
}

function _Platform_setupOutgoingPort(name) {
	return {
        type: "outgoing",
        name: name,
        value: _Json_unwrap(_Platform_effectManagers[name].u(proxy))
    };
}

var $elm$core$Basics$identity = function () { return _Json_wrap("unknown"); };

var $elm$json$Json$Encode$null = _Json_wrap("null");

var $elm$json$Json$Encode$bool = function () {
    return _Json_wrap("boolean");
};

var $elm$json$Json$Encode$int = function () {
    return _Json_wrap("number");
};

var $elm$json$Json$Encode$float = function () {
    return _Json_wrap("float");
};

var $elm$json$Json$Encode$string = function () {
    return _Json_wrap("string");
};

var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
        if (func === $elm$core$Basics$identity) {
            var output = "[";
            for (; entries.b; entries = entries.b) // WHILE_CONS
			{
				output += _Json_unwrap(entries.a) + ", ";
			}
            output += "]";
			return _Json_wrap(output);
        } else {
            return _Json_wrap("Array<" + _Json_unwrap(func(proxy)) + ">");
        }
	});

var $elm$json$Json$Encode$array = F2(
	function (func, entries) {
        return _Json_wrap("Array<" + _Json_unwrap(func(proxy)) + ">");
	});

var $elm$json$Json$Encode$object = function (pairs) {
	var object = A3(
        $elm$core$List$foldl,
        F2(
            function (_v0, obj) {
                var k = _v0.a;
                var v = _v0.b;
                return A3(_Json_addField, k, v, obj);
            }),
        _Json_emptyObject(_Utils_Tuple0),
        pairs
    );
    var output = "{ ";
    for (var key in object) {
        output += JSON.stringify(key) + ": " + object[key] + ", ";
    }
    output += "}";
    return _Json_wrap(output);
};

var $elm$core$Maybe$destruct = F3(
	function (_default, func, maybe) {
        return _Json_wrap(_Json_unwrap(func(proxy)) + " | " + _Json_unwrap(_default));
	});

var $elm$json$Json$Decode$andThen = F2(function(callback, decoder)
{
    var next = callback(proxy);
    if (next.$ === 0) {
        return decoder;
    }
    for (var key in next.value) {
        decoder.value[key] = next.value[key];
    }
    return decoder;
});

var $elm$json$Json$Decode$null = function () { return { $: "primitive", value: "null" }; };
var $elm$json$Json$Decode$bool = { $: "primitive", value: "boolean" };
var $elm$json$Json$Decode$int = { $: "primitive", value: "number" };
var $elm$json$Json$Decode$float = { $: "primitive", value: "number" };
var $elm$json$Json$Decode$string = { $: "primitive", value: "string" };
var $elm$json$Json$Decode$value = { $: "primitive", value: "unknown" };;


var $elm$json$Json$Decode$list = function (decoder) {
    return { $: "list", value: decoder };
};

var $elm$json$Json$Decode$array = function (decoder) {
    return { $: "array", value: decoder };
};

var $elm$json$Json$Decode$field = F2(function(field, decoder)
{
    var object = {};
    object[field] = decoder;
    return { $: "object", value: object };
});

var $elm$json$Json$Decode$index = F2(function(index, decoder)
{
    var object = {};
    object[index] = decoder;
    return { $: "tuple", value: object };
});

var $elm$json$Json$Decode$oneOf = function (decoders)
{
	return {
		$: "oneOf",
		alternatives: _List_toArray(decoders)
	};
}

var $elm$json$Json$Decode$map = F2(function(f, d1)
{
	return d1;
});

function decoderToString(decoder) {
    switch (decoder.$) {
        case "object":
            var output = "{ ";
            for (var key in decoder.value) {
                output += JSON.stringify(key) + ": " + decoderToString(decoder.value[key]) + ", ";
            }
            output += "}";
            return output;
        case "tuple":
            var output = "[ ";
            for (var key in decoder.value) {
                output += decoderToString(decoder.value[key]) + ", ";
            }
            output += "]";
            return output;
        case "list":
            return "Array<" + decoderToString(decoder.value) + ">";
        case "array":
            return "Array<" + decoderToString(decoder.value) + ">";
        case "oneOf":
            return decoder.alternatives.map(decoderToString).join(" | ");
        case "primitive":
            return decoder.value;
        default:
            throw new Error("Unknown decoder.$: " + decoder.$);
    }
}
`.trim();
