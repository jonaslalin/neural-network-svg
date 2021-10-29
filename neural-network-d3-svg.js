// -----------------------------------------------------------------------------

function _drawNeuralNetwork(
  counter,
  neuralNetworkWithCoordinates,
  svgId,
  cssPrefix,
  nodeRadius
) {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var svg = d3.select('#' + svgId);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var defs = svg
    .selectAll('defs')
    .data([
      { nodeRadius: nodeRadius }
    ])
    .join('defs');

  var defsCircleId =
    cssPrefix + '-' + counter.i + '-circle';
  var defsCircle = defs
    .selectAll('#' + defsCircleId)
    .data(function (d) { return [d]; })
    .join('circle')
    .attr('id', defsCircleId)
    .attr('r', function (d) { return d.nodeRadius; });

  var defsCircleClipPathId =
    cssPrefix + '-' + counter.i + '-circle-clip-path';
  var defsCircleClipPath = defs
    .selectAll('#' + defsCircleClipPathId)
    .data(function (d) { return [d]; })
    .join('clipPath')
    .attr('id', defsCircleClipPathId);

  var defsCircleClipPathUse = defsCircleClipPath
    .selectAll('use')
    .data(function (d) { return [d]; })
    .join('use')
    .attr('href', '#' + defsCircleId);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

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
    .join('g')
    .each(function (d) {
      var gLinksGLayerGLinkClass2 = (
        gLinksGLayerGLinkClass
        + '-'
        + d.link.sourceLayer
        + '-'
        + d.link.sourceIndex
        + '-'
        + d.link.targetLayer
        + '-'
        + d.link.targetIndex
      );
      d3.select(this).classed(
        (
          gLinksGLayerGLinkClass
          + ' '
          + gLinksGLayerGLinkClass2
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

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

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
    .join('g')
    .each(function (d) {
      var gNodesGLayerGNodeClass2 = (
        gNodesGLayerGNodeClass
        + '-'
        + d.node.layer
        + '-'
        + d.node.index
      );
      d3.select(this).classed(
        (
          gNodesGLayerGNodeClass
          + ' '
          + gNodesGLayerGNodeClass2
        ),
        true
      );
    });

  var gNodesGLayerGNodeUse = gNodesGLayerGNode
    .selectAll('use')
    .data(function (d) { return [d]; })
    .join('use')
    .attr('href', '#' + defsCircleId)
    .attr('x', function (d) { return d.x; })
    .attr('y', function (d) { return d.y; })
    .style('clip-path', 'url(#' + defsCircleClipPathId);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  counter.i = counter.i + 1;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
}

var drawNeuralNetwork = (function () {
  var counter = { i: 1 };
  return _drawNeuralNetwork.bind(null, counter);
})();

// -----------------------------------------------------------------------------

function annotateNeuralNetwork(
  neuralNetworkWithCoordinates,
  svgId,
  cssPrefix,
  linkLabelFilterFn,
  linkLabelRectWidth,
  linkLabelRectHeight,
  linkLabelTextFn,
  linkLabelTextShiftFactor,
  nodeLabelFilterFn,
  nodeLabelRectWidth,
  nodeLabelRectHeight,
  nodeLabelTextFn
) {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var svg = d3.select('#' + svgId);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var gLinkLabelsClass = cssPrefix + '-link-labels';
  var gLinkLabels = svg
    .selectAll('g.' + gLinkLabelsClass)
    .data([
      neuralNetworkWithCoordinates.linksWithCoordinates
    ])
    .join('g')
    .classed(gLinkLabelsClass, true);

  var gLinkLabelsGLayerClass = cssPrefix + '-layer';
  var gLinkLabelsGLayer = gLinkLabels
    .selectAll('g.' + gLinkLabelsGLayerClass)
    .data(function (d) { return d; })
    .join('g')
    .classed(gLinkLabelsGLayerClass, true);

  var gLinkLabelsGLayerGLinkLabelClass = cssPrefix + '-link-label';
  var gLinkLabelsGLayerGLinkLabel = gLinkLabelsGLayer
    .selectAll('g.' + gLinkLabelsGLayerGLinkLabelClass)
    .data(function (d) {
      return d.filter(linkLabelFilterFn);
    })
    .join('g')
    .each(function (d) {
      var gLinkLabelsGLayerGLinkLabelClass2 = (
        gLinkLabelsGLayerGLinkLabelClass
        + '-'
        + d.link.sourceLayer
        + '-'
        + d.link.sourceIndex
        + '-'
        + d.link.targetLayer
        + '-'
        + d.link.targetIndex
      );
      d3.select(this).classed(
        (
          gLinkLabelsGLayerGLinkLabelClass
          + ' '
          + gLinkLabelsGLayerGLinkLabelClass2
        ),
        true
      );
    });

  var gLinkLabelsGLayerGLinkLabelRect = gLinkLabelsGLayerGLinkLabel
    .selectAll('rect')
    .data(function (d) { return [d]; })
    .join('rect')
    .attr('x', function (d) {
      return (
        d.x(linkLabelTextShiftFactor)
        - Math.floor(linkLabelRectWidth / 2)
      );
    })
    .attr('y', function (d) {
      return (
        d.y(linkLabelTextShiftFactor)
        - Math.floor(linkLabelRectHeight / 2)
      );
    })
    .attr('width', linkLabelRectWidth)
    .attr('height', linkLabelRectHeight);

  var gLinkLabelsGLayerGLinkLabelText = gLinkLabelsGLayerGLinkLabel
    .selectAll('text')
    .data(function (d) { return [d]; })
    .join('text')
    .attr('x', function (d) {
      return d.x(linkLabelTextShiftFactor);
    })
    .attr('y', function (d) {
      return d.y(linkLabelTextShiftFactor);
    })
    .text(linkLabelTextFn);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var gNodeLabelsClass = cssPrefix + '-node-labels';
  var gNodeLabels = svg
    .selectAll('g.' + gNodeLabelsClass)
    .data([
      neuralNetworkWithCoordinates.nodesWithCoordinates
    ])
    .join('g')
    .classed(gNodeLabelsClass, true);

  var gNodeLabelsGLayerClass = cssPrefix + '-layer';
  var gNodeLabelsGLayer = gNodeLabels
    .selectAll('g.' + gNodeLabelsGLayerClass)
    .data(function (d) { return d; })
    .join('g')
    .classed(gNodeLabelsGLayerClass, true);

  var gNodeLabelsGLayerGNodeLabelClass = cssPrefix + '-node-label';
  var gNodeLabelsGLayerGNodeLabel = gNodeLabelsGLayer
    .selectAll('g.' + gNodeLabelsGLayerGNodeLabelClass)
    .data(function (d) {
      return d.filter(nodeLabelFilterFn);
    })
    .join('g')
    .each(function (d) {
      var gNodeLabelsGLayerGNodeLabelClass2 = (
        gNodeLabelsGLayerGNodeLabelClass
        + '-'
        + d.node.layer
        + '-'
        + d.node.index
      );
      d3.select(this).classed(
        (
          gNodeLabelsGLayerGNodeLabelClass
          + ' '
          + gNodeLabelsGLayerGNodeLabelClass2
        ),
        true
      );
    });

  var gNodeLabelsGLayerGNodeLabelRect = gNodeLabelsGLayerGNodeLabel
    .selectAll('rect')
    .data(function (d) { return [d]; })
    .join('rect')
    .attr('x', function (d) {
      return d.x - Math.floor(nodeLabelRectWidth / 2);
    })
    .attr('y', function (d) {
      return d.y - Math.floor(nodeLabelRectHeight / 2);
    })
    .attr('width', nodeLabelRectWidth)
    .attr('height', nodeLabelRectHeight);

  var gNodeLabelsGLayerGnodeLabelText = gNodeLabelsGLayerGNodeLabel
    .selectAll('text')
    .data(function (d) { return [d]; })
    .join('text')
    .attr('x', function (d) { return d.x; })
    .attr('y', function (d) { return d.y; })
    .text(nodeLabelTextFn);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
}

// -----------------------------------------------------------------------------
