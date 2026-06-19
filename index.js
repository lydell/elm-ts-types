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
            : [["flags", toType(flagDecoder)]]
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
                    ? `        ${name}: {
            send: (value: ${toType(port.value)}) => void
        }`
                    : `        ${name}: {
            subscribe: (f: (value: ${toType(port.value)}) => void) => void,
            unsubscribe: (f: (value: ${toType(port.value)}) => void) => void
        }`
            )
            .join(",\n");
    return `{
${portsString}
    }`;
}

function toType(type) {
    switch (type.$) {
        case "object":
            return `{ ${Object.entries(type.value).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)).map(([key, value]) => `${JSON.stringify(key)}: ${toType(value)}`).join(", ")} }`;
        case "tuple":
            return `[ ${Object.values(type.value).map(toType).join(", ")} ]`;
        case "list":
            return `Array<${toType(type.value)}>`;
        case "array":
            return `Array<${toType(type.value)}>`;
        case "oneOf":
            return type.alternatives.map(toType).join(" | ");
        case "primitive":
            return type.value;
        default:
            throw new Error("Unknown type.$: " + type.$);
    }
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
        flagDecoder: flagDecoder.$ === 0 ? null : flagDecoder,
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
        value: _Platform_effectManagers[name].u()
    };
}

function _Platform_setupOutgoingPort(name) {
    return {
        type: "outgoing",
        value: _Platform_effectManagers[name].u(proxy)
    };
}

var $elm$json$Json$Encode$null = { $: "primitive", value: "null" };
var $elm$json$Json$Encode$bool = () => ({ $: "primitive", value: "boolean" });
var $elm$json$Json$Encode$int = () => ({ $: "primitive", value: "number" });
var $elm$json$Json$Encode$float = () => ({ $: "primitive", value: "float" });
var $elm$json$Json$Encode$string = () => ({ $: "primitive", value: "string" });
var $elm$core$Basics$identity = () => ({ $: "primitive", value: "unknown" });

var $elm$json$Json$Encode$list = F2(function (func, entries) {
    if (func === $elm$core$Basics$identity) {
        const object = {};
        for (let i = 0; entries.b; entries = entries.b, i++) // WHILE_CONS
        {
            object[i] = entries.a;
        }
        return { $: "tuple", value: object };
    } else {
        return { $: "array", value: func(proxy) };
    }
});

var $elm$json$Json$Encode$array = F2(function (func, entries) {
    return { $: "array", value: func(proxy) };
});

var $elm$json$Json$Encode$object = function (pairs) {
    const object = A3(
        $elm$core$List$foldl,
        F2((_v0, obj) => A3(_Json_addField, _v0.a, _Json_wrap(_v0.b), obj)),
        _Json_emptyObject(_Utils_Tuple0),
        pairs
    );
    return { $: "object", value: object };
};

var $elm$core$Maybe$destruct = F3(function (_default, func, maybe) {
    return { $: "oneOf", alternatives: [func(proxy), _default] };
});

var $elm$json$Json$Decode$andThen = F2(function(callback, decoder) {
    const next = callback(proxy);
    if (next.$ === 0) {
        return decoder;
    }
    for (let key in next.value) {
        decoder.value[key] = next.value[key];
    }
    return decoder;
});

var $elm$json$Json$Decode$null = () => ({ $: "primitive", value: "null" });
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
    return { $: "object", value: { [field]: decoder } };
});

var $elm$json$Json$Decode$index = F2(function(index, decoder) {
    return { $: "tuple", value: { [index]: decoder } };
});

var $elm$json$Json$Decode$oneOf = function (decoders) {
    return { $: "oneOf", alternatives: _List_toArray(decoders) };
};

var $elm$json$Json$Decode$map = F2(function(f, d1) {
    return d1;
});
`.trim();
