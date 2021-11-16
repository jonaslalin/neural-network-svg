'use strict';

// -----------------------------------------------------------------------------

var nn = nn || {};

// -----------------------------------------------------------------------------

nn._drawNeuralNetwork =
  function _drawNeuralNetwork(
    counter,
    svgId,
    cssPrefix,
    neuralNetworkWithCoordinates
  ) {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var svg = d3.select('#' + svgId);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var defs = svg
      .selectAll('defs')
      .data([
        {
          nodeRadius: neuralNetworkWithCoordinates.nodeRadius
        }
      ])
      .join('defs');

    var defsGTemplateNodeClass = cssPrefix + '-template-node';

    var defsGTemplateNode = defs
      .selectAll('g.' + defsGTemplateNodeClass)
      .data(function (d) { return [d]; })
      .join('g')
      .classed(defsGTemplateNodeClass, true);

    var defsGTemplateNodeCircleId = (
      defsGTemplateNodeClass
      + '-circle-'
      + counter.i
    );

    var defsGTemplateNodeCircle = defsGTemplateNode
      .selectAll('circle')
      .data(function (d) { return [d]; })
      .join('circle')
      .attr('id', defsGTemplateNodeCircleId)
      .attr('r', function (d) { return d.nodeRadius; });

    var defsGTemplateNodeCircleClipPathId = (
      defsGTemplateNodeClass
      + '-circle-clip-path-'
      + counter.i
    );

    var defsGTemplateNodeCircleClipPath = defsGTemplateNode
      .selectAll('clipPath')
      .data(function (d) { return [d]; })
      .join('clipPath')
      .attr('id', defsGTemplateNodeCircleClipPathId);

    var defsGTemplateNodeCircleClipPathUse = defsGTemplateNodeCircleClipPath
      .selectAll('use')
      .data(function (d) { return [d]; })
      .join('use')
      .attr('href', '#' + defsGTemplateNodeCircleId);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var gLinksClass = cssPrefix + '-links';

    var gLinks = svg
      .selectAll('g.' + gLinksClass)
      .data([
        neuralNetworkWithCoordinates.linksWithCoordinates
      ])
      .join('g')
      .classed(gLinksClass, true);

    var gLinksGLayerClass = cssPrefix + '-layer';

    var gLinksGLayer = gLinks
      .selectAll('g.' + gLinksGLayerClass)
      .data(function (d) { return d; })
      .join('g')
      .classed(gLinksGLayerClass, true);

    var gLinksGLayerGLinkClass = cssPrefix + '-link';

    var gLinksGLayerGLink = gLinksGLayer
      .selectAll('g.' + gLinksGLayerGLinkClass)
      .data(function (d) { return d; })
      .join('g');

    gLinksGLayerGLink.each(function (d) {
      d3.select(this).classed(
        (
          gLinksGLayerGLinkClass
          + ' '
          + gLinksGLayerGLinkClass
          + '-'
          + d.link.key()
        ),
        true
      );
    });

    var gLinksGLayerGLinkLine = gLinksGLayerGLink
      .selectAll('line')
      .data(function (d) { return [d]; })
      .join('line')
      .attr('x1', function (d) { return d.x1(); })
      .attr('y1', function (d) { return d.y1(); })
      .attr('x2', function (d) { return d.x2(); })
      .attr('y2', function (d) { return d.y2(); });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var gNodesClass = cssPrefix + '-nodes';

    var gNodes = svg
      .selectAll('g.' + gNodesClass)
      .data([
        neuralNetworkWithCoordinates.nodesWithCoordinates
      ])
      .join('g')
      .classed(gNodesClass, true);

    var gNodesGLayerClass = cssPrefix + '-layer';

    var gNodesGLayer = gNodes
      .selectAll('g.' + gNodesGLayerClass)
      .data(function (d) { return d; })
      .join('g')
      .classed(gNodesGLayerClass, true);

    var gNodesGLayerGNodeClass = cssPrefix + '-node';

    var gNodesGLayerGNode = gNodesGLayer
      .selectAll('g.' + gNodesGLayerGNodeClass)
      .data(function (d) { return d; })
      .join('g');

    gNodesGLayerGNode.each(function (d) {
      d3.select(this).classed(
        (
          gNodesGLayerGNodeClass
          + ' '
          + gNodesGLayerGNodeClass
          + '-'
          + d.node.key()
        ),
        true
      );
    });

    var gNodesGLayerGNodeUse = gNodesGLayerGNode
      .selectAll('use')
      .data(function (d) { return [d]; })
      .join('use')
      .attr('href', '#' + defsGTemplateNodeCircleId)
      .attr('x', function (d) { return d.x; })
      .attr('y', function (d) { return d.y; })
      .style('clip-path', 'url(#' + defsGTemplateNodeCircleClipPathId + ')');

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    counter.i = counter.i + 1;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  };

nn.drawNeuralNetwork = (function () {
  var counter = { i: 0 };
  return nn._drawNeuralNetwork.bind(null, counter);
})();

// -----------------------------------------------------------------------------

nn.NodeText =
  function NodeText(layer, index, text) {
    nn.Node.call(this, layer, index);
    this.text = text;
  };

nn.NodeText.prototype = Object.create(nn.Node.prototype);

nn.NodeText.prototype.constructor = nn.NodeText;

nn.LinkText =
  function LinkText(
    sourceLayer,
    sourceIndex,
    targetLayer,
    targetIndex,
    text
  ) {
    nn.Link.call(
      this,
      sourceLayer,
      sourceIndex,
      targetLayer,
      targetIndex
    );
    this.text = text;
  };

nn.LinkText.prototype = Object.create(nn.Link.prototype);

nn.LinkText.prototype.constructor = nn.LinkText;

nn.XTextLookup =
  function XTextLookup(xTexts) {
    this.textDictionary = {};
    for (var i = 0; i < xTexts.length; i++) {
      this.textDictionary[xTexts[i].key()] = xTexts[i].text;
    }
  };

nn.XTextLookup.prototype.find =
  function find(key) {
    return this.textDictionary[key];
  };

nn.TextOptions =
  function TextOptions(width, height, position) {
    this.width = width;
    this.height = height;
    this.position = position;
  };

nn._annotateNeuralNetwork =
  function _annotateNeuralNetwork(
    counter,
    svgId,
    cssPrefix,
    neuralNetworkWithCoordinates,
    nodeTexts,
    linkTexts,
    textOptions
  ) {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var svg = d3.select('#' + svgId);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var defs = svg
      .selectAll('defs')
      .data([
        {
          text: textOptions
        }
      ])
      .join('defs');

    var defsGTemplateTextClass = cssPrefix + '-template-text';

    var defsGTemplateText = defs
      .selectAll('g.' + defsGTemplateTextClass)
      .data(function (d) { return [d]; })
      .join('g')
      .classed(defsGTemplateTextClass, true);

    var defsGTemplateTextRectId = (
      defsGTemplateTextClass
      + '-rect-'
      + counter.i
    );

    var defsGTemplateTextRect = defsGTemplateText
      .selectAll('rect')
      .data(function (d) { return [d]; })
      .join('rect')
      .attr('id', defsGTemplateTextRectId)
      .attr('width', function (d) { return d.text.width; })
      .attr('height', function (d) { return d.text.height; });

    var defsGTemplateTextRectClipPathId = (
      defsGTemplateTextClass
      + '-rect-clip-path-'
      + counter.i
    );

    var defsGTemplateTextRectClipPath = defsGTemplateText
      .selectAll('clipPath')
      .data(function (d) { return [d]; })
      .join('clipPath')
      .attr('id', defsGTemplateTextRectClipPathId);

    var defsGTemplateTextRectClipPathUse = defsGTemplateTextRectClipPath
      .selectAll('use')
      .data(function (d) { return [d]; })
      .join('use')
      .attr('href', '#' + defsGTemplateTextRectId);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var linkTextLookup = new nn.XTextLookup(linkTexts);

    var gLinkTextsClass = cssPrefix + '-link-texts';

    var gLinkTexts = svg
      .selectAll('g.' + gLinkTextsClass)
      .data([
        neuralNetworkWithCoordinates.linksWithCoordinates
      ])
      .join('g')
      .classed(gLinkTextsClass, true);

    var gLinkTextsGLayerClass = cssPrefix + '-layer';

    var gLinkTextsGLayer = gLinkTexts
      .selectAll('g.' + gLinkTextsGLayerClass)
      .data(function (d) { return d; })
      .join('g')
      .classed(gLinkTextsGLayerClass, true);

    var gLinkTextsGLayerGLinkTextClass = cssPrefix + '-link-text';

    var gLinkTextsGLayerGLinkText = gLinkTextsGLayer
      .selectAll('g.' + gLinkTextsGLayerGLinkTextClass)
      .data(function (d) { return d; })
      .join('g');

    gLinkTextsGLayerGLinkText.each(function (d) {
      d3.select(this).classed(
        (
          gLinkTextsGLayerGLinkTextClass
          + ' '
          + gLinkTextsGLayerGLinkTextClass
          + '-'
          + d.link.key()
        ),
        true
      );
    });

    var gLinkTextsGLayerGLinkTextUse = gLinkTextsGLayerGLinkText
      .selectAll('use')
      .data(function (d) {
        if (!!linkTextLookup.find(d.link.key())) {
          return [d];
        }
        return [];
      })
      .join('use')
      .attr('href', '#' + defsGTemplateTextRectId)
      .attr('x', function (d) {
        return (
          d.textX(textOptions.position)
          - Math.floor(textOptions.width / 2)
        );
      })
      .attr('y', function (d) {
        return (
          d.textY(textOptions.position)
          - Math.floor(textOptions.height / 2)
        );
      })
      .style('clip-path', 'url(#' + defsGTemplateTextRectClipPathId + ')');

    var gLinkTextsGLayerGLinkTextText = gLinkTextsGLayerGLinkText
      .selectAll('text')
      .data(function (d) {
        if (!!linkTextLookup.find(d.link.key())) {
          return [d];
        }
        return [];
      })
      .join('text')
      .attr('x', function (d) { return d.textX(textOptions.position); })
      .attr('y', function (d) { return d.textY(textOptions.position); })
      .text(function (d) { return linkTextLookup.find(d.link.key()); });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var nodeTextLookup = new nn.XTextLookup(nodeTexts);

    var gNodeTextsClass = cssPrefix + '-node-texts';

    var gNodeTexts = svg
      .selectAll('g.' + gNodeTextsClass)
      .data([
        neuralNetworkWithCoordinates.nodesWithCoordinates
      ])
      .join('g')
      .classed(gNodeTextsClass, true);

    var gNodeTextsGLayerClass = cssPrefix + '-layer';

    var gNodeTextsGLayer = gNodeTexts
      .selectAll('g.' + gNodeTextsGLayerClass)
      .data(function (d) { return d; })
      .join('g')
      .classed(gNodeTextsGLayerClass, true);

    var gNodeTextsGLayerGNodeTextClass = cssPrefix + '-node-text';

    var gNodeTextsGLayerGNodeText = gNodeTextsGLayer
      .selectAll('g.' + gNodeTextsGLayerGNodeTextClass)
      .data(function (d) { return d; })
      .join('g');

    gNodeTextsGLayerGNodeText.each(function (d) {
      d3.select(this).classed(
        (
          gNodeTextsGLayerGNodeTextClass
          + ' '
          + gNodeTextsGLayerGNodeTextClass
          + '-'
          + d.node.key()
        ),
        true
      );
    });

    var gNodeTextsGLayerGNodeTextUse = gNodeTextsGLayerGNodeText
      .selectAll('use')
      .data(function (d) {
        if (!!nodeTextLookup.find(d.node.key())) {
          return [d];
        }
        return [];
      })
      .join('use')
      .attr('href', '#' + defsGTemplateTextRectId)
      .attr('x', function (d) {
        return d.x - Math.floor(textOptions.width / 2);
      })
      .attr('y', function (d) {
        return d.y - Math.floor(textOptions.height / 2);
      })
      .style('clip-path', 'url(#' + defsGTemplateTextRectClipPathId + ')');

    var gNodeTextsGLayerGNodeTextText = gNodeTextsGLayerGNodeText
      .selectAll('text')
      .data(function (d) {
        if (!!nodeTextLookup.find(d.node.key())) {
          return [d];
        }
        return [];
      })
      .join('text')
      .attr('x', function (d) { return d.x; })
      .attr('y', function (d) { return d.y; })
      .text(function (d) { return nodeTextLookup.find(d.node.key()); });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    counter.i = counter.i + 1;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  };

nn.annotateNeuralNetwork = (function () {
  var counter = { i: 0 };
  return nn._annotateNeuralNetwork.bind(null, counter);
})();

// -----------------------------------------------------------------------------
