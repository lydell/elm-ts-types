export function generateTypeScript(code) {
    const Elm = extract(code);
    return `declare ${generateTypeScriptHelper("Elm", Elm, 0)}`;
}

function generateTypeScriptHelper(name, exports, i) {
    return `${indent(i)}namespace ${name} {
${
    Object.entries(exports)
        .map(([key, value]) =>
            key === "init"
                ? toDefinition(value(), i + 1)
                : generateTypeScriptHelper(key, value, i + 1)
        )
        .join("\n\n")
}
${indent(i)}}`
}

function indent(i) {
    return "    ".repeat(i);
}

function toDefinition({flagDecoder, ports, usesNodeOption}, i) {
    const args =
        flagDecoder === null && !usesNodeOption
            ? ""
            : `args: ${toArgs({flagDecoder, usesNodeOption}, i)}`;
    const returnType =
        ports === null
            ? "Record<string, never>"
            : `{
${indent(i + 1)}ports: ${toPortsType(ports, i + 1)}
${indent(i)}}`;
    return `${indent(i)}export function init(${args}): ${returnType};`;
}

function toArgs({flagDecoder, usesNodeOption}, i) {
    const args = [
        ...(flagDecoder === null
            ? []
            : [["flags", toType(flagDecoder, i)]]
        ),
        ...(usesNodeOption
            ? [["node", "Node"]]
            : []
        ),
    ]
        .map(([key, value]) => `${indent(i + 1)}${key}: ${value}`)
        .join(",\n");
    return `{
${args}
${indent(i)}}`;
}

function toPortsType(ports, i) {
    const portsString =
        Object.entries(ports)
            .map(([name, port]) =>
                port.$ === "incoming"
                    ? `${indent(i + 1)}${name}: {
${indent(i + 2)}send: (value: ${toType(port.value, i + 2)}) => void
${indent(i + 1)}}`
                    : `${indent(i + 1)}${name}: {
${indent(i + 2)}subscribe: (f: (value: ${toType(port.value, i + 2)}) => Promise<void>) => void,
${indent(i + 2)}unsubscribe: (f: (value: ${toType(port.value, i + 2)}) => Promise<void>) => void
${indent(i + 1)}}`
            )
            .join(",\n");
    return `{
${portsString}
${indent(i)}}`;
}

function toType(type, i) {
    switch (type.$) {
        case "object":
            const entries = Object.entries(type.value);
            return entries.length === 1
                ? `{ ${toKeyValue(entries[0], 0)} }`
                : `{
${
    Object.entries(type.value)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(entry => toKeyValue(entry, i + 1))
        .join(",\n")
}
${indent(i)}}`;
        case "tuple":
            return `[ ${Object.values(type.value).map(value => toType(value, i)).join(", ")} ]`;
        case "list":
            return `Array<${toType(type.value, i)}>`;
        case "array":
            return `Array<${toType(type.value, i)}>`;
        case "oneOf":
            return type.alternatives.map(alternative => toType(alternative, i)).join(" | ");
        case "primitive":
            return type.value;
        default:
            throw new Error("Unknown type.$: " + type.$);
    }
}

function toKeyValue([key, value], i) {
    return `${indent(i)}${JSON.stringify(key)}: ${toType(value, i)}`;
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
        .replace(/^_Platform_export\(/m, `${injection}\n$&`);
}

const preamble = `
var console = {
    log: globalThis.console.log,
    warn: function () {},
};
`.trim();

const injection = `
const proxy = new Proxy({}, {
    get: () => proxy,
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
        $: "incoming",
        value: _Platform_effectManagers[name].u(),
    };
}

function _Platform_setupOutgoingPort(name) {
    return {
        $: "outgoing",
        value: _Platform_effectManagers[name].u(proxy),
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
        for (let i = 0; entries.b; entries = entries.b, i++) {
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

var $elm$json$Json$Decode$oneOf = function (decoders) {
    return { $: "oneOf", alternatives: _List_toArray(decoders) };
};

var $elm$json$Json$Decode$map = F2(function(f, d1) {
    return d1;
});
`.trim();
