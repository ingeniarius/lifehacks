var Mesh = window.Mesh = {};

Mesh.styles = {
    // mesh styles
    vline : { color : '#c00', style : 'solid', opacity : 0.5 },
    hline : { color : '#c00', style : 'solid', opacity : 0.5 },
    hsubline : { color : '#c00', style : 'dotted', opacity : 0.5 },

    // guide styles
    vguide : { color : '#0ff', style : 'solid', opacity : 0.5 },
    hguide : { color : '#0ff', style : 'solid', opacity : 0.5 }
};

Mesh.page = $('body');
Mesh.htmlPage = $('html');
Mesh.pageWidth = 0;
Mesh.pageHeight = 0;

$(function() {
    Mesh.page.addClass('mesh-js-fix');
    Mesh.htmlPage.addClass('mesh-js-fix');
    Mesh.pageWidth = Mesh.page.width();
    Mesh.pageHeight = Mesh.page.height();
    Mesh.page.removeClass('mesh-js-fix');
    Mesh.htmlPage.removeClass('mesh-js-fix');
});

Mesh.page.append(['<style>',
    '.mesh-js-fix { position: absolute; }',
    '.mesh-js { position: absolute; width: 0; height: 0; top: 0; left: 0; }',
    '.mesh-js-vguide { border-left: 1px ', Mesh.styles.vguide.style, ' ', Mesh.styles.vguide.color, '; }',
    '.mesh-js-hguide { border-top: 1px ', Mesh.styles.hguide.style, ' ', Mesh.styles.hguide.color, '; }',
    '.mesh-js-vline { border-left: 1px ', Mesh.styles.vline.style, ' ', Mesh.styles.vline.color, '; }',
    '.mesh-js-hline { border-top: 1px ', Mesh.styles.hline.style, ' ', Mesh.styles.hline.color, '; }',
    '.mesh-js-hsubline { border-top: 1px ', Mesh.styles.hsubline.style, ' ', Mesh.styles.hsubline.color, '; }',
    '</style>'].join(''));

Mesh.objects = {
    generic : function(className) { return $('<div class="mesh-js ' + className + '"></div>') },

    vline : function() { return Mesh.objects.generic('mesh-js-vline') },
    hline : function() { return Mesh.objects.generic('mesh-js-hline') },
    hsubline : function() { return Mesh.objects.generic('mesh-js-hsubline') },

    vguide : function() { return Mesh.objects.generic('mesh-js-vguide') },
    hguide : function() { return Mesh.objects.generic('mesh-js-hguide') }
};

Mesh.mesh = function(options) {
    var gutterTotalWidth = (options.columns - 1) * options.gutter;
    var margins = options.left + options.right;
    var columnWidth = (options.width - gutterTotalWidth - margins)/options.columns;
    var delta = options.centered ? (Mesh.pageWidth - options.width)/2 : 0;
    var guideOffset = delta + options.left;
    for (var i = 0; i < options.columns; i++) {
        var left = Mesh.objects.vline();
        var right = Mesh.objects.vline();
        Mesh.page.append(left);
        Mesh.page.append(right);
        left.css({ height : Mesh.pageHeight + 'px', left : guideOffset + 'px'});
        right.css({ height : Mesh.pageHeight + 'px', left : guideOffset + columnWidth + 'px'});
        guideOffset += columnWidth + options.gutter;
    }
    var guideOffset = options.top || 0;
    var rowsCount = Math.round(Mesh.pageHeight / options.row);
    var j = 0;
    for (var i = 0; i < rowsCount; i++) {
        var hline = (j == 0 || j == options.order) ? Mesh.objects.hline() : Mesh.objects.hsubline();
        Mesh.page.append(hline);
        hline.css({ width : Mesh.pageWidth, top : guideOffset + 'px' });
        guideOffset += options.row;
        if (j == options.order) {
            j = 0;
        } else {
            j++;
        }
    }
};

Mesh.vguide = function(options) {
    var guide =  Mesh.objects.vguide();
    guide.css('height', Mesh.pageHeight + 'px');
    Mesh.page.append(guide);
    var delta = options.width ? (Mesh.pageWidth - options.width)/2 : 0;
    if (options.left || options.right) {
        if (options.left) {
            guide.css('left', delta + options.left + 'px');
        } else if (options.right && options.width) {
            guide.css('left', delta + (options.width - options.right) + 'px');
        } else if (options.right) {
            guide.css('left', (Mesh.pageWidth - options.right) + 'px');
        }
    } else  {
        guide2 = guide.clone();
        Mesh.page.append(guide2);
        guide.css('left', delta + 'px');
        guide2.css('left', delta + options.width + 'px');
    }

};
Mesh.hguide = function(options) {
    var guide =  Mesh.objects.hguide();
    Mesh.page.append(guide);
    guide.css({ width : Mesh.pageWidth + 'px', top : options.top + 'px' });
};
