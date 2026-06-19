export function toWindowDefinition(code) {
}

export function toStandaloneDefinition(code) {
}

export function toSeparateDefinitions(code) {
    const Elm = extract(code);
    const definitions = {};
    toSeparateDefinitionsHelper("Elm", Elm, definitions);
    return definitions;
}

function toSeparateDefinitionsHelper(name, exports, definitions) {
    for (const [key, value] of Object.entries(exports)) {
        if (key === "init") {
            definitions[name] = toDefinition(value());
        } else {
            toSeparateDefinitionsHelper(`${name}.${key}`, value, definitions);
        }
    }
}

function toDefinition({flagDecoder, ports, usesNodeOption}) {
    const args =
        flagDecoder === null && !usesNodeOption
            ? ""
            : `args: ${toArgs({flagDecoder, usesNodeOption})}`;
    const returnType =
        ports === null
            ? "Record<string, never>"
            : `{
    ports: ${toPortsType(ports)}
}`;
    return `export function init(${args}): ${returnType};`;
}

function toArgs({flagDecoder, usesNodeOption}) {
    const args = [
        ...(flagDecoder === null
            ? []
            : [["flags", flagDecoder]]
        ),
        ...(usesNodeOption
            ? [["node", "Node"]]
            : []
        ),
    ]
        .map(([key, value]) => `    ${key}: ${value}`)
        .join(",\n");
    return `{
${args}
}`;
}

function toPortsType(ports) {
    const portsString =
        Object.entries(ports)
            .map(([name, port]) =>
                port.type === "incoming"
                    ? `{
        send: (value: ${port.value}) => void
    }`
                    : `{
        subscribe: (f: (value: ${port.value}) => void) => void,
        unsubscribe: (f: (value: ${port.value}) => void) => void
    }`
            )
            .join(",\n");
    return `{
${portsString}
    }`;
}

function extract(code) {
    const f = new Function(inject(code));
    const scope = {};
    f.call(scope);
    return scope.Elm;
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
const proxy = new Proxy({}, {
    get() {
        return proxy;
    }
});

function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder) {
    const ports = _Platform_setupEffects({}, () => {});
    return {
        flagDecoder: flagDecoder.$ === 0 ? null : decoderToString(flagDecoder),
        ports: ports ?? null,
        usesNodeOption: stepperBuilder.toString().includes("'node'"),
    };
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args) {
    return {
        flagDecoder: null,
        ports: null,
        usesNodeOption: true,
    };
});

function _Platform_setupIncomingPort(name) {
    return {
        type: "incoming",
        value: decoderToString(_Platform_effectManagers[name].u())
    };
}

function _Platform_setupOutgoingPort(name) {
    return {
        type: "outgoing",
        value: _Json_unwrap(_Platform_effectManagers[name].u(proxy))
    };
}

var $elm$core$Basics$identity = () => _Json_wrap("unknown");
var $elm$json$Json$Encode$null = _Json_wrap("null");
var $elm$json$Json$Encode$bool = () => _Json_wrap("boolean");
var $elm$json$Json$Encode$int = () => _Json_wrap("number");
var $elm$json$Json$Encode$float = () => _Json_wrap("float");
var $elm$json$Json$Encode$string = () => _Json_wrap("string");

var $elm$json$Json$Encode$list = F2(function (func, entries) {
    if (func === $elm$core$Basics$identity) {
        let output = "[";
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

var $elm$json$Json$Encode$array = F2(function (func, entries) {
    return _Json_wrap("Array<" + _Json_unwrap(func(proxy)) + ">");
});

var $elm$json$Json$Encode$object = function (pairs) {
    var object = A3(
        $elm$core$List$foldl,
        F2(function (_v0, obj) {
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

var $elm$core$Maybe$destruct = F3(function (_default, func, maybe) {
    return _Json_wrap(_Json_unwrap(func(proxy)) + " | " + _Json_unwrap(_default));
});

var $elm$json$Json$Decode$andThen = F2(function(callback, decoder) {
    const next = callback(proxy);
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

var $elm$json$Json$Decode$field = F2(function(field, decoder) {
    var object = {};
    object[field] = decoder;
    return { $: "object", value: object };
});

var $elm$json$Json$Decode$index = F2(function(index, decoder) {
    var object = {};
    object[index] = decoder;
    return { $: "tuple", value: object };
});

var $elm$json$Json$Decode$oneOf = function (decoders) {
    return {
        $: "oneOf",
        alternatives: _List_toArray(decoders)
    };
};

var $elm$json$Json$Decode$map = F2(function(f, d1) {
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
