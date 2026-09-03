function scrambleString(str) {
    if (!str) return str;
    var chars = String(str).split('');
    for (var i = chars.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = chars[i];
        chars[i] = chars[j];
        chars[j] = temp;
    }
    return chars.join('');
}

function scrambleValue(value) {
    if (!value) return value;
    var valStr = String(value);
    var tagRegex = /(\[[^\]]*\]|\{[0-9]+\})/g;
    var parts = valStr.split(tagRegex);

    return parts
        .map(function(part) {
            if (part.match(/^(\[[^\]]*\]|\{[0-9]+\})$/)) {
                return part;
            }
            return scrambleString(part);
        })
        .join('');
}

Events.on(ClientLoadEvent, function() {
    var properties = Core.bundle.getProperties();
    if (properties) {
        properties.each(function(key, originalValue) {
            if (originalValue) {
                properties.put(key, scrambleValue(originalValue));
            }
        });
    }

    Vars.content.each(function(content) {
        if (content.localizedName) {
            content.localizedName = scrambleValue(content.localizedName);
        }
        if (content.description) {
            content.description = scrambleValue(content.description);
        }
        if (content.details) {
            content.details = scrambleValue(content.details);
        }
    });

    Vars.content.planets().each(function(planet) {
        if (planet.localizedName) {
            planet.localizedName = scrambleValue(planet.localizedName);
        }
        if (planet.sectors) {
            planet.sectors.each(function(sector) {
                if (sector.preset && sector.preset.localizedName) {
                    sector.preset.localizedName = scrambleValue(sector.preset.localizedName);
                }
            });
        }
    });
});
